#!/usr/bin/env bash
set -euo pipefail

# ----------------------------------------
# Default Paths
# ----------------------------------------
APP_DIR="${APP_DIR:-/opt/marketing-planning-generator}"
COMPOSE_FILE="$APP_DIR/compose.ec2.yaml"
ENV_FILE="$APP_DIR/.env"

# ----------------------------------------
# Required Environment Variables
# ----------------------------------------
required_vars=(
  DOCKERHUB_USERNAME
  DOCKERHUB_REPOSITORY
  IMAGE_TAG
  DOCKERHUB_TOKEN
  GROQ_API_KEY
)

for var_name in "${required_vars[@]}"; do
  if [[ -z "${!var_name:-}" ]]; then
    echo "❌ Missing required environment variable: $var_name" >&2
    exit 1
  fi
done

# ----------------------------------------
# Verify Docker Installation
# ----------------------------------------
if ! command -v docker >/dev/null 2>&1; then
  echo "❌ Docker is not installed on this EC2 instance." >&2
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "❌ Docker Compose plugin is not installed." >&2
  exit 1
fi

# ----------------------------------------
# Create Application Directory
# ----------------------------------------
mkdir -p "$APP_DIR"

# ----------------------------------------
# Verify Compose File Exists
# ----------------------------------------
if [[ ! -f "$COMPOSE_FILE" ]]; then
  echo "❌ Missing compose file: $COMPOSE_FILE" >&2
  exit 1
fi

# ----------------------------------------
# Build Docker Image URI
# ----------------------------------------
IMAGE_URI="$DOCKERHUB_USERNAME/$DOCKERHUB_REPOSITORY:$IMAGE_TAG"

echo "🚀 Deploying image: $IMAGE_URI"

# ----------------------------------------
# Generate Environment File
# ----------------------------------------
cat > "$ENV_FILE" <<EOF
GROQ_API_KEY=$GROQ_API_KEY
HOST=0.0.0.0
PORT=8000
HOST_PORT=${HOST_PORT:-80}
IMAGE_URI=$IMAGE_URI
EOF

# Secure environment file
chmod 600 "$ENV_FILE"

echo "📝 Environment file created at: $ENV_FILE"

# ----------------------------------------
# Docker Hub Login
# ----------------------------------------
echo "🔐 Logging in to Docker Hub..."
printf '%s' "$DOCKERHUB_TOKEN" \
  | docker login --username "$DOCKERHUB_USERNAME" --password-stdin

# ----------------------------------------
# Pull Latest Docker Image
# ----------------------------------------
echo "📥 Pulling latest Docker image..."
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" pull

# ----------------------------------------
# Stop Existing Containers
# ----------------------------------------
echo "🛑 Stopping old containers..."
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" down --remove-orphans || true

# ----------------------------------------
# Start Updated Containers
# ----------------------------------------
echo "▶️ Starting updated containers..."
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d

# ----------------------------------------
# Remove Unused Docker Images
# ----------------------------------------
echo "🧹 Cleaning up unused Docker images..."
docker image prune -af || true

# ----------------------------------------
# Deployment Verification
# ----------------------------------------
echo "📦 Active containers:"
docker ps

echo "✅ Deployment completed successfully."