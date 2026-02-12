from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
from openpyxl import Workbook
from fastapi.responses import StreamingResponse
import io

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.environ.get('JWT_SECRET', 'fincontrol-secret-key-change-in-production')
ALGORITHM = "HS256"
security = HTTPBearer()

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Models
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    email: str
    created_at: str

class TransactionCreate(BaseModel):
    tipo: str  # 'entrada' or 'saida'
    categoria: str
    subcategoria: str
    valor: float
    descricao: str
    data: str
    payment_method: Optional[str] = None  # 'dinheiro', 'credito', 'debito', 'pix'
    is_paid: bool = True

class TransactionUpdate(BaseModel):
    tipo: Optional[str] = None
    categoria: Optional[str] = None
    subcategoria: Optional[str] = None
    valor: Optional[float] = None
    descricao: Optional[str] = None
    data: Optional[str] = None
    payment_method: Optional[str] = None
    is_paid: Optional[bool] = None

class Transaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    tipo: str
    categoria: str
    subcategoria: str
    valor: float
    descricao: str
    data: str
    payment_method: Optional[str] = None
    is_paid: bool = True
    created_at: str

class BillCreate(BaseModel):
    tipo: str  # 'a_pagar' or 'a_receber'
    titulo: str
    valor: float
    vencimento: str
    categoria: str
    subcategoria: Optional[str] = None
    recorrencia: Optional[str] = None  # None, 'mensal', 'anual'
    observacoes: Optional[str] = None

class BillUpdate(BaseModel):
    status: Optional[str] = None  # 'pendente', 'pago', 'atrasado'
    data_pagamento: Optional[str] = None

class Bill(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    tipo: str
    titulo: str
    valor: float
    vencimento: str
    categoria: str
    subcategoria: Optional[str] = None
    status: str  # 'pendente', 'pago', 'atrasado'
    recorrencia: Optional[str] = None
    observacoes: Optional[str] = None
    data_pagamento: Optional[str] = None
    created_at: str

class GoalCreate(BaseModel):
    titulo: str
    valor_alvo: float
    prazo: str

class GoalUpdate(BaseModel):
    valor_atual: Optional[float] = None
    titulo: Optional[str] = None
    valor_alvo: Optional[float] = None
    prazo: Optional[str] = None

class Goal(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    titulo: str
    valor_alvo: float
    valor_atual: float
    prazo: str
    created_at: str

class InvestmentTip(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    titulo: str
    descricao: str
    categoria: str
    risco: str

class ProfileUpdate(BaseModel):
    name: Optional[str] = None

class DashboardStats(BaseModel):
    total_entradas: float
    total_saidas: float
    saldo: float
    transacoes_recentes: int
    metas_ativas: int
    contas_a_vencer: int

# Helper functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=7)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Auth routes
@api_router.post("/auth/register")
async def register(user_data: UserCreate):
    existing = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    
    user_id = str(uuid.uuid4())
    user_doc = {
        "id": user_id,
        "name": user_data.name,
        "email": user_data.email,
        "password_hash": hash_password(user_data.password),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user_doc)
    
    token = create_access_token({"sub": user_id})
    return {"token": token, "user": {"id": user_id, "name": user_data.name, "email": user_data.email}}

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Email ou senha incorretos")
    
    token = create_access_token({"sub": user["id"]})
    return {"token": token, "user": {"id": user["id"], "name": user["name"], "email": user["email"]}}

# Dashboard routes
@api_router.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats(current_user: dict = Depends(get_current_user)):
    transactions = await db.transactions.find(
        {"user_id": current_user["id"]}, 
        {"_id": 0, "valor": 1, "tipo": 1}
    ).to_list(5000)
    goals = await db.goals.find({"user_id": current_user["id"]}, {"_id": 0, "id": 1}).to_list(1000)
    
    # Get upcoming bills (next 7 days)
    today = datetime.now(timezone.utc).date()
    next_7_days = today + timedelta(days=7)
    bills = await db.bills.find({
        "user_id": current_user["id"],
        "status": "pendente"
    }, {"_id": 0}).to_list(1000)
    
    upcoming_bills = []
    for bill in bills:
        vencimento = datetime.fromisoformat(bill["vencimento"]).date()
        if today <= vencimento <= next_7_days:
            upcoming_bills.append(bill)
    
    total_entradas = sum(t["valor"] for t in transactions if t["tipo"] == "entrada")
    total_saidas = sum(t["valor"] for t in transactions if t["tipo"] == "saida")
    
    return DashboardStats(
        total_entradas=total_entradas,
        total_saidas=total_saidas,
        saldo=total_entradas - total_saidas,
        transacoes_recentes=len(transactions),
        metas_ativas=len(goals),
        contas_a_vencer=len(upcoming_bills)
    )

# Transaction routes
@api_router.get("/transactions", response_model=List[Transaction])
async def get_transactions(current_user: dict = Depends(get_current_user)):
    transactions = await db.transactions.find({"user_id": current_user["id"]}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return transactions

@api_router.post("/transactions", response_model=Transaction)
async def create_transaction(transaction: TransactionCreate, current_user: dict = Depends(get_current_user)):
    transaction_id = str(uuid.uuid4())
    transaction_doc = {
        "id": transaction_id,
        "user_id": current_user["id"],
        **transaction.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.transactions.insert_one(transaction_doc)
    return Transaction(**transaction_doc)

@api_router.delete("/transactions/{transaction_id}")
async def delete_transaction(transaction_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.transactions.delete_one({"id": transaction_id, "user_id": current_user["id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Transação não encontrada")
    return {"message": "Transação deletada com sucesso"}

@api_router.put("/transactions/{transaction_id}", response_model=Transaction)
async def update_transaction(transaction_id: str, transaction_update: TransactionUpdate, current_user: dict = Depends(get_current_user)):
    existing = await db.transactions.find_one({"id": transaction_id, "user_id": current_user["id"]}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Transação não encontrada")
    
    update_data = {k: v for k, v in transaction_update.model_dump().items() if v is not None}
    if update_data:
        await db.transactions.update_one({"id": transaction_id}, {"$set": update_data})
    
    updated = await db.transactions.find_one({"id": transaction_id}, {"_id": 0})
    return Transaction(**updated)

# Goal routes
@api_router.get("/goals", response_model=List[Goal])
async def get_goals(current_user: dict = Depends(get_current_user)):
    goals = await db.goals.find({"user_id": current_user["id"]}, {"_id": 0}).to_list(1000)
    return goals

@api_router.post("/goals", response_model=Goal)
async def create_goal(goal: GoalCreate, current_user: dict = Depends(get_current_user)):
    goal_id = str(uuid.uuid4())
    goal_doc = {
        "id": goal_id,
        "user_id": current_user["id"],
        **goal.model_dump(),
        "valor_atual": 0.0,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.goals.insert_one(goal_doc)
    return Goal(**goal_doc)

@api_router.put("/goals/{goal_id}", response_model=Goal)
async def update_goal(goal_id: str, goal_update: GoalUpdate, current_user: dict = Depends(get_current_user)):
    existing_goal = await db.goals.find_one({"id": goal_id, "user_id": current_user["id"]}, {"_id": 0})
    if not existing_goal:
        raise HTTPException(status_code=404, detail="Meta não encontrada")
    
    update_data = {k: v for k, v in goal_update.model_dump().items() if v is not None}
    if update_data:
        await db.goals.update_one({"id": goal_id}, {"$set": update_data})
    
    updated_goal = await db.goals.find_one({"id": goal_id}, {"_id": 0})
    return Goal(**updated_goal)

@api_router.delete("/goals/{goal_id}")
async def delete_goal(goal_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.goals.delete_one({"id": goal_id, "user_id": current_user["id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Meta não encontrada")
    return {"message": "Meta deletada com sucesso"}

# Investment tips routes
@api_router.get("/investments/tips", response_model=List[InvestmentTip])
async def get_investment_tips():
    tips = [
        InvestmentTip(
            id="1",
            titulo="Tesouro Selic",
            descricao="Investimento de baixo risco atrelado à taxa Selic. Ideal para reserva de emergência e objetivos de curto prazo.",
            categoria="Renda Fixa",
            risco="Baixo"
        ),
        InvestmentTip(
            id="2",
            titulo="Fundos de Índice (ETFs)",
            descricao="Diversificação automática com baixo custo. Acompanha índices como Ibovespa ou S&P 500.",
            categoria="Renda Variável",
            risco="Médio"
        ),
        InvestmentTip(
            id="3",
            titulo="CDB com liquidez diária",
            descricao="Certificado de Depósito Bancário com possibilidade de resgate a qualquer momento. Protegido pelo FGC.",
            categoria="Renda Fixa",
            risco="Baixo"
        ),
        InvestmentTip(
            id="4",
            titulo="Fundos Imobiliários (FIIs)",
            descricao="Invista em imóveis sem precisar comprar um. Receba rendimentos mensais e aproveite a valorização.",
            categoria="Renda Variável",
            risco="Médio-Alto"
        ),
        InvestmentTip(
            id="5",
            titulo="LCI/LCA",
            descricao="Letras de crédito isentas de IR para pessoa física. Boa opção para médio prazo.",
            categoria="Renda Fixa",
            risco="Baixo"
        ),
        InvestmentTip(
            id="6",
            titulo="Ações de Dividendos",
            descricao="Empresas sólidas que distribuem lucros regularmente. Estratégia de longo prazo com renda passiva.",
            categoria="Renda Variável",
            risco="Médio-Alto"
        )
    ]
    return tips

# Bills routes
@api_router.get("/bills", response_model=List[Bill])
async def get_bills(current_user: dict = Depends(get_current_user), status: Optional[str] = None):
    query = {"user_id": current_user["id"]}
    if status:
        query["status"] = status
    
    bills = await db.bills.find(query, {"_id": 0}).sort("vencimento", 1).to_list(1000)
    
    # Auto-update status based on vencimento
    today = datetime.now(timezone.utc).date()
    for bill in bills:
        if bill["status"] == "pendente":
            vencimento = datetime.fromisoformat(bill["vencimento"]).date()
            if vencimento < today:
                bill["status"] = "atrasado"
                await db.bills.update_one({"id": bill["id"]}, {"$set": {"status": "atrasado"}})
    
    return bills

@api_router.post("/bills", response_model=Bill)
async def create_bill(bill: BillCreate, current_user: dict = Depends(get_current_user)):
    bill_id = str(uuid.uuid4())
    bill_doc = {
        "id": bill_id,
        "user_id": current_user["id"],
        **bill.model_dump(),
        "status": "pendente",
        "data_pagamento": None,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.bills.insert_one(bill_doc)
    return Bill(**bill_doc)

@api_router.put("/bills/{bill_id}", response_model=Bill)
async def update_bill(bill_id: str, bill_update: BillUpdate, current_user: dict = Depends(get_current_user)):
    existing = await db.bills.find_one({"id": bill_id, "user_id": current_user["id"]}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Conta não encontrada")
    
    update_data = {k: v for k, v in bill_update.model_dump().items() if v is not None}
    
    # If marking as paid, set payment date
    if update_data.get("status") == "pago" and not update_data.get("data_pagamento"):
        update_data["data_pagamento"] = datetime.now(timezone.utc).isoformat()
    
    if update_data:
        await db.bills.update_one({"id": bill_id}, {"$set": update_data})
    
    updated = await db.bills.find_one({"id": bill_id}, {"_id": 0})
    return Bill(**updated)

@api_router.delete("/bills/{bill_id}")
async def delete_bill(bill_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.bills.delete_one({"id": bill_id, "user_id": current_user["id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Conta não encontrada")
    return {"message": "Conta deletada com sucesso"}

# Analytics routes
@api_router.get("/analytics/category-breakdown")
async def get_category_breakdown(current_user: dict = Depends(get_current_user)):
    transactions = await db.transactions.find({"user_id": current_user["id"], "tipo": "saida"}, {"_id": 0}).to_list(10000)
    
    category_totals = {}
    for t in transactions:
        cat = t["categoria"]
        category_totals[cat] = category_totals.get(cat, 0) + t["valor"]
    
    return [{"categoria": k, "total": v} for k, v in category_totals.items()]

@api_router.get("/analytics/monthly-comparison")
async def get_monthly_comparison(current_user: dict = Depends(get_current_user)):
    transactions = await db.transactions.find({"user_id": current_user["id"]}, {"_id": 0}).to_list(10000)
    
    monthly_data = {}
    for t in transactions:
        month = t["data"][:7]  # YYYY-MM
        if month not in monthly_data:
            monthly_data[month] = {"month": month, "entradas": 0, "saidas": 0}
        
        if t["tipo"] == "entrada":
            monthly_data[month]["entradas"] += t["valor"]
        else:
            monthly_data[month]["saidas"] += t["valor"]
    
    result = sorted(monthly_data.values(), key=lambda x: x["month"])
    for item in result:
        item["saldo"] = item["entradas"] - item["saidas"]
    
    return result

@api_router.get("/analytics/upcoming-bills")
async def get_upcoming_bills(current_user: dict = Depends(get_current_user)):
    today = datetime.now(timezone.utc).date()
    next_7_days = today + timedelta(days=7)
    
    bills = await db.bills.find({
        "user_id": current_user["id"],
        "status": "pendente"
    }, {"_id": 0}).to_list(1000)
    
    upcoming = []
    for bill in bills:
        vencimento = datetime.fromisoformat(bill["vencimento"]).date()
        if today <= vencimento <= next_7_days:
            upcoming.append(bill)
    
    return sorted(upcoming, key=lambda x: x["vencimento"])

# Profile routes
@api_router.get("/profile", response_model=User)
async def get_profile(current_user: dict = Depends(get_current_user)):
    return User(
        id=current_user["id"],
        name=current_user["name"],
        email=current_user["email"],
        created_at=current_user["created_at"]
    )

@api_router.put("/profile", response_model=User)
async def update_profile(profile_update: ProfileUpdate, current_user: dict = Depends(get_current_user)):
    update_data = {k: v for k, v in profile_update.model_dump().items() if v is not None}
    if update_data:
        await db.users.update_one({"id": current_user["id"]}, {"$set": update_data})
    
    updated_user = await db.users.find_one({"id": current_user["id"]}, {"_id": 0})
    return User(
        id=updated_user["id"],
        name=updated_user["name"],
        email=updated_user["email"],
        created_at=updated_user["created_at"]
    )

# Export route
@api_router.get("/export/xlsx")
async def export_to_xlsx(current_user: dict = Depends(get_current_user)):
    transactions = await db.transactions.find({"user_id": current_user["id"]}, {"_id": 0}).sort("data", -1).to_list(10000)
    
    wb = Workbook()
    ws = wb.active
    ws.title = "Transações"
    
    headers = ["Data", "Tipo", "Categoria", "Subcategoria", "Descrição", "Valor"]
    ws.append(headers)
    
    for transaction in transactions:
        ws.append([
            transaction["data"],
            transaction["tipo"].upper(),
            transaction["categoria"],
            transaction.get("subcategoria", ""),
            transaction["descricao"],
            transaction["valor"]
        ])
    
    output = io.BytesIO()
    wb.save(output)
    output.seek(0)
    
    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=fincontrol_transacoes.xlsx"}
    )

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
