#!/usr/bin/env bash
set -u
mkdir -p /app/data
export LINJIAN_HOST=0.0.0.0
export LINJIAN_PORT=8513
export LINJIAN_DATA_DIR=/app/data
PORT=8513 LINJIAN_PORT=8513 python3 /app/server/linjian_server.py &
sleep 2
LINJIAN_URL=http://127.0.0.1:8513 PORT=8787 node /app/mcp/server.js &
sleep 2
exec node /app/gateway.js
