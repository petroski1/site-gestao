#!/bin/bash

# Script para preparar FinControl Pro para deploy externo

echo "🚀 Preparando FinControl Pro para deploy..."

# Criar diretório de deploy
mkdir -p /tmp/fincontrol-deploy

# Copiar frontend
echo "📦 Copiando frontend..."
cp -r /app/frontend /tmp/fincontrol-deploy/
rm -rf /tmp/fincontrol-deploy/frontend/node_modules
rm -rf /tmp/fincontrol-deploy/frontend/build

# Copiar backend
echo "📦 Copiando backend..."
cp -r /app/backend /tmp/fincontrol-deploy/

# Copiar configs
echo "📦 Copiando configurações..."
cp /app/netlify.toml /tmp/fincontrol-deploy/
cp /app/render.yaml /tmp/fincontrol-deploy/
cp /app/README.md /tmp/fincontrol-deploy/
cp /app/DEPLOY_INSTRUCTIONS.md /tmp/fincontrol-deploy/

# Criar .gitignore
cat > /tmp/fincontrol-deploy/.gitignore << 'EOF'
# Dependencies
node_modules/
__pycache__/
*.py[cod]
*$py.class

# Build
build/
dist/
*.egg-info/

# Environment
.env
.env.local
.env.production

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
coverage/
.pytest_cache/
EOF

# Criar .env.example para frontend
cat > /tmp/fincontrol-deploy/frontend/.env.example << 'EOF'
# Backend API URL
REACT_APP_BACKEND_URL=https://your-backend.onrender.com

# Netlify specific (optional)
WDS_SOCKET_PORT=443
ENABLE_HEALTH_CHECK=false
EOF

# Criar .env.example para backend
cat > /tmp/fincontrol-deploy/backend/.env.example << 'EOF'
# MongoDB Connection
MONGO_URL=mongodb+srv://user:password@cluster.mongodb.net
DB_NAME=fincontrol

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-key-change-this-in-production

# CORS (add your frontend URL)
CORS_ORIGINS=https://your-site.netlify.app,http://localhost:3000
EOF

# Criar arquivo ZIP
echo "📦 Criando arquivo ZIP..."
cd /tmp/fincontrol-deploy
zip -r /tmp/fincontrol-pro-deploy.zip . -x "*.git*" "*/node_modules/*" "*/build/*"

echo "✅ Pronto!"
echo ""
echo "📁 Arquivo criado em: /tmp/fincontrol-pro-deploy.zip"
echo "📏 Tamanho: $(du -h /tmp/fincontrol-pro-deploy.zip | cut -f1)"
echo ""
echo "🔽 Para baixar, execute:"
echo "   cp /tmp/fincontrol-pro-deploy.zip /app/"
echo ""
echo "📖 Leia DEPLOY_INSTRUCTIONS.md para instruções completas de deploy!"
