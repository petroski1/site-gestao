# 🚂 Deploy FinControl Pro no Railway (TUDO EM UM SÓ LUGAR)

## Por que Railway?

✅ **Frontend + Backend no mesmo lugar**
✅ **MongoDB incluso** (addon grátis)
✅ **Deploy automático** via GitHub
✅ **HTTPS automático**
✅ **$5/mês** ou **$500 créditos grátis** para começar

---

## 🚀 Passo a Passo

### 1. Criar Conta no Railway

1. Acesse [railway.app](https://railway.app)
2. Faça login com GitHub
3. Ganhe **$5 grátis** (ou $500 com verificação de estudante)

### 2. Preparar o Código

```bash
# 1. Push para GitHub
git init
git add .
git commit -m "FinControl Pro - Full Stack App"
git remote add origin https://github.com/seu-usuario/fincontrol-pro.git
git branch -M main
git push -u origin main
```

### 3. Deploy no Railway

#### Opção A: Via Dashboard (Mais Fácil)

1. **No Railway Dashboard:**
   - Click "New Project"
   - Click "Deploy from GitHub repo"
   - Selecione `fincontrol-pro`
   - Railway vai detectar automaticamente!

2. **Adicionar MongoDB:**
   - No projeto, click "+ New"
   - Selecione "Database" → "MongoDB"
   - Railway cria automaticamente e seta a variável `MONGO_URL`

3. **Configurar Variáveis de Ambiente:**
   - Click no seu service
   - Vá em "Variables"
   - Adicione:
     ```
     PORT=8001
     DB_NAME=fincontrol
     JWT_SECRET=seu-secret-super-seguro-aqui-troque-isso
     CORS_ORIGINS=*
     REACT_APP_BACKEND_URL=${{RAILWAY_PUBLIC_DOMAIN}}
     ```

4. **Deploy Automático:**
   - Railway faz deploy automaticamente!
   - Aguarde ~5 minutos
   - Seu app estará em: `https://seu-app.up.railway.app`

#### Opção B: Via CLI

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Iniciar projeto
railway init

# Deploy
railway up

# Adicionar MongoDB
railway add mongodb

# Abrir no browser
railway open
```

### 4. Configurar Domínio (Opcional)

1. No Railway, vá em Settings
2. Em "Networking" → "Generate Domain"
3. Ou adicione seu domínio custom

---

## 📋 Arquivos Incluídos

✅ `railway.json` - Configuração do Railway
✅ `start.sh` - Script que inicia backend + frontend
✅ `Procfile` - Comando de start
✅ `nixpacks.toml` - Build configuration

---

## ⚙️ Como Funciona

1. **Railway faz build:**
   - Instala Node.js + Python
   - `yarn install` no frontend
   - `pip install` no backend
   - `yarn build` (cria build de produção do React)

2. **Railway executa `start.sh`:**
   - Inicia FastAPI no port $PORT
   - Serve o React build com `serve`
   - Ambos rodam no mesmo container!

3. **HTTPS automático:**
   - Railway provê SSL grátis
   - Seu app fica em: `https://fincontrol-xyz.up.railway.app`

---

## 🔧 Variáveis de Ambiente

### Obrigatórias:
```env
MONGO_URL=<gerado automaticamente pelo Railway>
DB_NAME=fincontrol
JWT_SECRET=<gere um secret forte>
```

### Opcionais:
```env
PORT=8001
CORS_ORIGINS=*
REACT_APP_BACKEND_URL=https://seu-app.up.railway.app
```

---

## 💰 Custos

- **Tier Gratuito:** $5/mês de crédito
- **Hobby Plan:** $5/mês (20GB bandwidth, 8GB RAM)
- **Pro Plan:** $20/mês (ilimitado)

**Estimativa para FinControl Pro:**
- ~$3-7/mês (tudo incluso)
- MongoDB addon: GRÁTIS até 1GB

---

## ✅ Vantagens vs Netlify

| Feature | Railway | Netlify |
|---------|---------|----------|
| Frontend | ✅ | ✅ |
| Backend Python | ✅ | ❌ |
| MongoDB | ✅ | ❌ |
| Tudo junto | ✅ | ❌ |
| Setup | 1 deploy | 2 deploys |

---

## 🐛 Troubleshooting

**Erro: Port already in use**
- Railway seta automaticamente a variável `$PORT`
- Use `--port ${PORT:-8001}` no uvicorn

**Erro: MongoDB connection failed**
- Verifique se adicionou o MongoDB addon
- Variável `MONGO_URL` deve estar setada

**Erro: Frontend não carrega**
- Verifique se `yarn build` rodou com sucesso
- Verifique logs: `railway logs`

**Erro: CORS**
- Adicione `CORS_ORIGINS=*` nas variáveis
- Ou especifique: `CORS_ORIGINS=https://seu-app.up.railway.app`

---

## 📚 Comandos Úteis

```bash
# Ver logs em tempo real
railway logs

# Ver status
railway status

# Abrir app
railway open

# Variáveis
railway variables

# Rollback
railway rollback
```

---

## 🎉 Pronto!

Seu **FinControl Pro** estará rodando completamente em um só lugar!

**URL:** `https://seu-app.up.railway.app`

✅ Frontend funcionando
✅ Backend funcionando
✅ MongoDB funcionando
✅ HTTPS ativado
✅ Deploy automático (push = deploy)

---

## 🔄 Alternativas

Se preferir outras plataformas:

### Render.com (Similar ao Railway)
- Também suporta full-stack
- Free tier mais limitado
- Instruções em `DEPLOY_INSTRUCTIONS.md`

### Vercel (Frontend) + Render (Backend)
- Separado, mas funciona
- Vercel grátis para frontend
- Render grátis para backend (com limitações)

---

**Dúvidas?** Railway tem excelente documentação: [docs.railway.app](https://docs.railway.app)
