# 💰 FinControl Pro

> Sistema completo de gestão financeira pessoal

## 🚀 Features

✅ **Autenticação completa** - JWT + bcrypt
✅ **Dashboard interativo** - Gráficos em tempo real
✅ **Transações detalhadas** - Categorias e subcategorias
✅ **Contas a pagar/receber** - Com recorrência
✅ **Metas financeiras** - Acompanhamento de progresso
✅ **Dicas de investimento** - Categorizadas por risco
✅ **Exportação Excel** - Download de transações
✅ **Design premium** - Dark theme com animações
✅ **100% Responsivo** - Mobile, tablet e desktop

## 🛠️ Tech Stack

**Frontend:**
- React 19
- React Router
- Recharts (gráficos)
- Framer Motion (animações)
- Tailwind CSS
- Lucide Icons

**Backend:**
- FastAPI (Python)
- MongoDB (Motor async)
- JWT Authentication
- bcrypt
- openpyxl (Excel)

## 📦 Estrutura

```
fincontrol-pro/
├── frontend/          # React app
│   ├── src/
│   │   ├── pages/    # 8 páginas
│   │   ├── components/
│   │   ├── context/
│   │   └── utils/
│   ├── public/
│   └── package.json
│
├── backend/          # FastAPI server
│   ├── server.py     # 25+ endpoints
│   ├── requirements.txt
│   └── .env
│
├── netlify.toml      # Netlify config
├── render.yaml       # Render config
└── README.md
```

## 🚀 Deploy

Veja [DEPLOY_INSTRUCTIONS.md](./DEPLOY_INSTRUCTIONS.md) para instruções completas.

**Quick Start:**

1. Frontend → Netlify
2. Backend → Render
3. Database → MongoDB Atlas

## 💻 Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --reload --port 8001
```

### Frontend
```bash
cd frontend
yarn install
yarn start
```

### MongoDB
```bash
# Usando Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Ou MongoDB Atlas (cloud)
```

## 🔐 Environment Variables

### Frontend (.env)
```
REACT_APP_BACKEND_URL=http://localhost:8001
```

### Backend (.env)
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=fincontrol
JWT_SECRET=your-super-secret-key-here
CORS_ORIGINS=http://localhost:3000
```

## 📱 Pages

1. **Landing Page** - Marketing com elementos 3D
2. **Login/Register** - Autenticação
3. **Dashboard** - Visão geral financeira
4. **Lançamentos** - CRUD de transações
5. **Contas** - A pagar/receber
6. **Metas** - Objetivos financeiros
7. **Investimentos** - Dicas educacionais
8. **Perfil** - Dados do usuário

## 🎨 Design

- **Tema:** Dark (#0A0A0A)
- **Cores:** Purple (#7F5AF0), Green (#2CB67D), Orange (#FF8906)
- **Fontes:** Manrope (headings), Inter (body), JetBrains Mono (números)
- **Estilo:** Glassmorphism, Neon glows, Micro-animations

## 📊 API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Transactions
- `GET /api/transactions`
- `POST /api/transactions`
- `PUT /api/transactions/{id}`
- `DELETE /api/transactions/{id}`

### Bills
- `GET /api/bills`
- `POST /api/bills`
- `PUT /api/bills/{id}`
- `DELETE /api/bills/{id}`

### Goals
- `GET /api/goals`
- `POST /api/goals`
- `PUT /api/goals/{id}`
- `DELETE /api/goals/{id}`

### Analytics
- `GET /api/analytics/category-breakdown`
- `GET /api/analytics/monthly-comparison`
- `GET /api/analytics/upcoming-bills`

### Export
- `GET /api/export/xlsx`

## 📄 License

MIT License - Use como quiser!

## 👨‍💻 Author

Criado para uso pessoal de gestão financeira.

---

**Feito com ❤️ usando React + FastAPI + MongoDB**
