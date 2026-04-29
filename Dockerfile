FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY marketing-muse-main/marketing-muse-main/package*.json ./
RUN npm ci

COPY marketing-muse-main/marketing-muse-main/ ./
RUN npm run build

FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    HOST=0.0.0.0 \
    PORT=8000

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY agents ./agents
COPY config ./config
COPY tools ./tools
COPY pdf_generator.py ./pdf_generator.py
COPY main.py ./main.py
COPY server.py ./server.py
COPY .env.example ./.env.example
COPY README.md ./README.md
COPY --from=frontend-builder /app/frontend/dist ./marketing-muse-main/marketing-muse-main/dist

EXPOSE 8000

CMD ["python", "server.py"]
