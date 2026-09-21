FROM node:20-slim

RUN apt-get update \
 && apt-get install -y --no-install-recommends python3 ca-certificates curl \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY mcp/package*.json /app/mcp/
RUN cd /app/mcp && npm install --omit=dev --no-audit --no-fund

COPY . /app

ENV PORT=10000
EXPOSE 10000
CMD ["bash", "/app/start.sh"]
