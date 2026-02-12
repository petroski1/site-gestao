#!/bin/bash

echo "🚀 Starting FinControl Pro..."

# Start MongoDB if needed (Railway tem MongoDB add-on)
if [ -z "$MONGO_URL" ]; then
  echo "⚠️  MONGO_URL not set, using default"
  export MONGO_URL="mongodb://localhost:27017"
fi

# Start Backend
echo "📦 Starting Backend (FastAPI)..."
cd /app/backend
uvicorn server:app --host 0.0.0.0 --port ${PORT:-8001} &
BACKEND_PID=$!

# Build Frontend
echo "📦 Building Frontend (React)..."
cd /app/frontend
yarn build

# Serve Frontend
echo "🌐 Serving Frontend..."
npx serve -s build -l 3000 &
FRONTEND_PID=$!

echo "✅ FinControl Pro started!"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"

# Keep alive
wait $BACKEND_PID $FRONTEND_PID
