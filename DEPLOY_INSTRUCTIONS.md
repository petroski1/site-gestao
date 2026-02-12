# 🚀 Deploy Instructions - FinControl Pro

## Arquitetura do Deploy

### Frontend (Netlify) + Backend (Render/Railway)

---

## 📦 PASSO 1: Preparar o Código

### Baixar o código da Emergent:

1. **Via GitHub Integration:**
   - Conecte seu GitHub na Emergent
   - Faça push do código para seu repositório
   - Clone o repo localmente

2. **Via Download Manual:**
   ```bash
   # Se tiver acesso SSH/terminal
   cd /app
   zip -r fincontrol-pro.zip frontend backend
   ```

---

## 🎨 PASSO 2: Deploy do Frontend (Netlify)

### 2.1 - Preparação

1. Criar conta no [Netlify](https://netlify.com)
2. Instalar Netlify CLI (opcional):
   ```bash
   npm install -g netlify-cli
   ```

### 2.2 - Deploy via Git (Recomendado)

1. **Push seu código para GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/seu-usuario/fincontrol-pro.git
   git push -u origin main
   ```

2. **No Netlify Dashboard:**
   - Click "Add new site" → "Import an existing project"
   - Conecte seu GitHub
   - Selecione o repositório `fincontrol-pro`
   - Configure:
     - **Base directory:** `frontend`
     - **Build command:** `yarn build`
     - **Publish directory:** `frontend/build`

3. **Configure Environment Variables:**
   - Vá em Site settings → Environment variables
   - Adicione:
     ```
     REACT_APP_BACKEND_URL=https://seu-backend.onrender.com
     ```

4. Click "Deploy site"

### 2.3 - Deploy via CLI

```bash
cd frontend
netlify deploy --prod
```

---

## ⚙️ PASSO 3: Deploy do Backend (Render.com)

### 3.1 - Preparação

1. Criar conta no [Render](https://render.com)
2. Criar arquivo `render.yaml` (já incluído)

### 3.2 - Deploy

1. **No Render Dashboard:**
   - Click "New" → "Web Service"
   - Conecte seu GitHub
   - Selecione o repositório
   - Configure:
     - **Name:** fincontrol-backend
     - **Root Directory:** `backend`
     - **Runtime:** Python 3
     - **Build Command:** `pip install -r requirements.txt`
     - **Start Command:** `uvicorn server:app --host 0.0.0.0 --port $PORT`

2. **Environment Variables:**
   ```
   MONGO_URL=mongodb+srv://user:password@cluster.mongodb.net
   DB_NAME=fincontrol
   JWT_SECRET=seu-secret-super-seguro-aqui
   CORS_ORIGINS=https://seu-site.netlify.app
   ```

3. **MongoDB:**
   - Use [MongoDB Atlas](https://mongodb.com/atlas) (free tier)
   - Crie um cluster
   - Copie a connection string
   - Adicione ao MONGO_URL no Render

---

## 🗄️ PASSO 4: MongoDB Atlas (Grátis)

1. Criar conta no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Criar um cluster (M0 Free tier)
3. Create Database User:
   - Username: `fincontrol`
   - Password: [gere uma senha forte]
4. Network Access:
   - Add IP: `0.0.0.0/0` (allow all) ou IPs específicos
5. Copiar Connection String:
   ```
   mongodb+srv://fincontrol:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

---

## 🔄 PASSO 5: Conectar Frontend → Backend

1. **Após backend deployed no Render:**
   - Copie a URL: `https://fincontrol-backend.onrender.com`

2. **Atualize no Netlify:**
   - Site settings → Environment variables
   - Edite `REACT_APP_BACKEND_URL`
   - Valor: `https://fincontrol-backend.onrender.com`
   - Trigger redeploy

---

## ✅ PASSO 6: Testar

1. Acesse seu site: `https://seu-site.netlify.app`
2. Teste:
   - ✅ Landing page carrega
   - ✅ Registro de usuário
   - ✅ Login
   - ✅ Dashboard
   - ✅ Criar transação
   - ✅ Criar meta
   - ✅ Criar conta

---

## 🎯 Alternativas de Hosting

### Backend:
- **Render** (Recomendado - Free tier generoso)
- **Railway** (Fácil, $5/mês)
- **Fly.io** (Free tier)
- **Heroku** (Não tem mais free tier)

### Frontend:
- **Netlify** (Recomendado)
- **Vercel** (Também excelente)
- **Cloudflare Pages**

### Full-Stack (tudo junto):
- **Vercel** (Frontend + Serverless API)
- **Railway** (Frontend + Backend + MongoDB)

---

## 📝 Checklist Final

- [ ] Código no GitHub
- [ ] MongoDB Atlas configurado
- [ ] Backend deployed (Render)
- [ ] Frontend deployed (Netlify)
- [ ] Environment variables configuradas
- [ ] CORS configurado corretamente
- [ ] Teste completo do fluxo
- [ ] Custom domain configurado (opcional)

---

## 🆘 Troubleshooting

**Erro: CORS policy**
- Adicione a URL do Netlify no `CORS_ORIGINS` do backend

**Erro: Cannot connect to MongoDB**
- Verifique a connection string
- Verifique Network Access no Atlas (allow 0.0.0.0/0)

**Erro: API não responde**
- Verifique `REACT_APP_BACKEND_URL` no Netlify
- Teste a API diretamente: `https://seu-backend.onrender.com/api/investments/tips`

---

## 💰 Custos Estimados

- **Frontend (Netlify):** FREE
- **Backend (Render):** FREE (com limitações) ou $7/mês
- **MongoDB Atlas:** FREE (512MB) ou $9/mês (2GB)
- **Total:** $0 - $16/mês

---

## 🎉 Pronto!

Seu FinControl Pro estará rodando sem badges da Emergent!

Dúvidas? Entre em contato ou consulte:
- [Netlify Docs](https://docs.netlify.com)
- [Render Docs](https://render.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
