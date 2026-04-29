#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/marketing-planning-generator}"
COMPOSE_FILE="$APP_DIR/compose.ec2.yaml"
ENV_FILE="$APP_DIR/.env"

required_vars=(
  AWS_REGION
  ECR_REGISTRY
  ECR_REPOSITORY
  IMAGE_TAG
  GROQ_API_KEY
)

for var_name in "${required_vars[@]}"; do
  if [[ -z "${!var_name:-}" ]]; then
    echo "Missing required environment variable: $var_name" >&2
    exit 1
  fi
done

mkdir -p "$APP_DIR"

IMAGE_URI="$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG"

cat > "$ENV_FILE" <<EOF
GROQ_API_KEY=$GROQ_API_KEY
HOST=0.0.0.0
PORT=8000
HOST_PORT=${HOST_PORT:-80}
IMAGE_URI=$IMAGE_URI
EOF

aws ecr get-login-password --region "$AWS_REGION" \
  | docker login --username AWS --password-stdin "$ECR_REGISTRY"

docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" pull
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d
docker image prune -af
