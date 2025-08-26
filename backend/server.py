from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta
import json
import openai
from faker import Faker
import random

# Initialize Faker for mock data
fake = Faker()

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# OpenAI configuration
openai.api_key = os.environ.get('OPENAI_API_KEY')

# Create the main app
app = FastAPI(title="B&B Lead Hunter API", version="1.0.0")
api_router = APIRouter(prefix="/api")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Models
class Lead(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    reference_code: str = Field(default_factory=lambda: f"BBH-LIN-{random.randint(1000, 9999)}")
    platform: str = Field(default="linkedin")  # linkedin, instagram
    profile_url: str
    
    # Personal Info
    first_name: str
    last_name: str
    company: str
    position: str
    location: str
    email: Optional[str] = None
    phone: Optional[str] = None
    
    # Scoring
    ai_score: int = Field(default=0, ge=0, le=100)
    lead_temperature: str = Field(default="COLD")  # HOT, WARM, COLD
    
    # Tracking
    messages_sent: int = Field(default=0)
    last_activity: datetime = Field(default_factory=datetime.utcnow)
    responded: bool = Field(default=False)
    response_rate: float = Field(default=0.0)
    
    # Deal Info
    interested_projects: List[str] = Field(default_factory=list)
    deal_status: str = Field(default="new")  # new, contacted, negotiating, closed
    deal_value: Optional[float] = None
    commission_amount: Optional[float] = None
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Project(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    developer: str = Field(default="AZIZI")
    location: str
    price_range: str
    unit_types: List[str]
    commission_rate: str
    
    # Features
    features: Dict[str, Any] = Field(default_factory=dict)
    description: str = ""
    
    # Media
    brochure_url: Optional[str] = None
    tour_3d_url: Optional[str] = None
    video_url: Optional[str] = None
    images: List[str] = Field(default_factory=list)
    
    # Analytics
    leads_matched: int = Field(default=0)
    deals_closed: int = Field(default=0)
    total_revenue: float = Field(default=0.0)
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True)

class Deal(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    lead_id: str
    project_id: str
    
    # Deal Info
    status: str = Field(default="new")  # new, contacted, viewing, negotiating, closed, lost
    deal_value: float
    commission_amount: float
    commission_rate: float
    
    # Timeline
    created_at: datetime = Field(default_factory=datetime.utcnow)
    contacted_at: Optional[datetime] = None
    viewing_date: Optional[datetime] = None
    closed_at: Optional[datetime] = None
    
    # Notes
    notes: str = ""
    next_action: str = ""

class Analytics(BaseModel):
    period: str  # month-year format like "2025-01"
    
    # Lead Metrics
    total_leads_provided: int = 0
    hot_leads_generated: int = 0
    leads_responded: int = 0
    response_rate: float = 0.0
    
    # Deal Metrics
    deals_closed_azizi: int = 0
    total_revenue: float = 0.0
    average_deal_size: float = 0.0
    commission_received: float = 0.0
    
    # Performance
    conversion_rate: float = 0.0
    time_to_close_avg: int = 0  # days
    
    # Platform Performance
    linkedin_performance: Dict[str, Any] = Field(default_factory=dict)
    instagram_performance: Dict[str, Any] = Field(default_factory=dict)
    
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    role: str  # user, assistant
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    context_data: Optional[Dict[str, Any]] = None

class AuthUser(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: str
    auth_method: str  # biometric, pin, guest
    last_login: datetime = Field(default_factory=datetime.utcnow)
    access_level: str = Field(default="full")  # full, guest, demo

# AI Helper Functions
async def get_ai_lead_analysis(lead_data: dict, context: str = "scoring") -> str:
    """Get AI analysis for lead data"""
    try:
        model = "gpt-4-turbo-preview" if context == "chat" else "gpt-3.5-turbo"
        
        client = openai.OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))
        
        system_prompt = """You are a Dubai real estate lead analysis expert. 
        Analyze the lead quality and provide insights for B&B Lead Hunter dashboard."""
        
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Analyze this lead: {json.dumps(lead_data)}"}
            ],
            temperature=0.7,
            max_tokens=500
        )
        
        return response.choices[0].message.content
        
    except Exception as e:
        logging.error(f"AI analysis error: {e}")
        return "AI analysis temporarily unavailable"

# Mock Data Generation
def generate_mock_leads(count: int = 50) -> List[dict]:
    """Generate mock lead data"""
    leads = []
    platforms = ["linkedin", "instagram"]
    temperatures = ["HOT", "WARM", "COLD"]
    statuses = ["new", "contacted", "negotiating", "closed"]
    locations = ["Dubai", "London", "New York", "Singapore", "Mumbai", "Toronto"]
    companies = ["TechCorp", "DataAI", "OilCo", "FinanceHub", "StartupXYZ", "MegaCorp"]
    
    for _ in range(count):
        lead_temp = random.choice(temperatures)
        ai_score = random.randint(95, 100) if lead_temp == "HOT" else random.randint(60, 94) if lead_temp == "WARM" else random.randint(20, 59)
        
        lead = {
            "id": str(uuid.uuid4()),
            "reference_code": f"BBH-{random.choice(['LIN', 'INS'])}-{random.randint(1000, 9999)}",
            "platform": random.choice(platforms),
            "profile_url": f"https://{random.choice(platforms)}.com/in/{fake.user_name()}",
            "first_name": fake.first_name(),
            "last_name": fake.last_name(),
            "company": random.choice(companies),
            "position": fake.job(),
            "location": random.choice(locations),
            "email": fake.email(),
            "ai_score": ai_score,
            "lead_temperature": lead_temp,
            "messages_sent": random.randint(0, 5),
            "last_activity": fake.date_time_between(start_date="-30d", end_date="now"),
            "responded": random.choice([True, False]),
            "response_rate": round(random.uniform(0.05, 0.25), 3),
            "interested_projects": random.sample(["AZIZI Riviera", "AZIZI Venice", "AZIZI Beachfront"], random.randint(0, 2)),
            "deal_status": random.choice(statuses),
            "deal_value": random.randint(500000, 3000000) if random.choice([True, False]) else None,
            "commission_amount": None,
            "created_at": fake.date_time_between(start_date="-60d", end_date="now"),
            "updated_at": fake.date_time_between(start_date="-10d", end_date="now")
        }
        
        if lead["deal_value"]:
            lead["commission_amount"] = lead["deal_value"] * random.uniform(0.03, 0.05)
            
        leads.append(lead)
    
    return leads

def generate_mock_projects() -> List[dict]:
    """Generate mock AZIZI projects"""
    projects = [
        {
            "id": str(uuid.uuid4()),
            "name": "AZIZI Riviera",
            "developer": "AZIZI",
            "location": "Dubai Marina",
            "price_range": "500k - 3M AED",
            "unit_types": ["Studio", "1BR", "2BR", "3BR"],
            "commission_rate": "3-5%",
            "features": {
                "sea_view": True,
                "metro": "5 min walk",
                "school": "nearby",
                "roi": "8% guaranteed"
            },
            "description": "Luxury waterfront living in Dubai Marina",
            "leads_matched": random.randint(50, 150),
            "deals_closed": random.randint(10, 30),
            "total_revenue": random.randint(5000000, 15000000),
            "created_at": fake.date_time_between(start_date="-365d", end_date="now"),
            "is_active": True
        },
        {
            "id": str(uuid.uuid4()),
            "name": "AZIZI Venice",
            "developer": "AZIZI",
            "location": "Al Furjan",
            "price_range": "400k - 2.5M AED",
            "unit_types": ["Studio", "1BR", "2BR", "3BR", "Townhouse"],
            "commission_rate": "3-4%",
            "features": {
                "community": "Family-friendly",
                "amenities": "World-class",
                "connectivity": "Excellent",
                "roi": "7% expected"
            },
            "description": "Italian-inspired community living",
            "leads_matched": random.randint(40, 120),
            "deals_closed": random.randint(8, 25),
            "total_revenue": random.randint(3000000, 12000000),
            "created_at": fake.date_time_between(start_date="-300d", end_date="now"),
            "is_active": True
        },
        {
            "id": str(uuid.uuid4()),
            "name": "AZIZI Beachfront",
            "developer": "AZIZI",
            "location": "Dubai South",
            "price_range": "600k - 4M AED",
            "unit_types": ["1BR", "2BR", "3BR", "4BR", "Penthouse"],
            "commission_rate": "4-6%",
            "features": {
                "beachfront": True,
                "luxury": "Ultra-luxury",
                "airport": "15 min drive",
                "roi": "9% projected"
            },
            "description": "Exclusive beachfront luxury residences",
            "leads_matched": random.randint(30, 80),
            "deals_closed": random.randint(5, 20),
            "total_revenue": random.randint(4000000, 18000000),
            "created_at": fake.date_time_between(start_date="-200d", end_date="now"),
            "is_active": True
        }
    ]
    return projects

# API Endpoints
@api_router.get("/")
async def root():
    return {"message": "B&B Lead Hunter API v1.0", "status": "running", "mode": os.environ.get('APP_MODE', 'demo')}

# Analytics Endpoints
@api_router.get("/analytics/dashboard")
async def get_dashboard_analytics():
    """Get main dashboard analytics"""
    current_month = datetime.now().strftime("%Y-%m")
    
    # Generate current month analytics
    total_leads = random.randint(800, 1000)
    hot_leads = random.randint(120, 180)
    deals_closed = random.randint(20, 40)
    total_revenue = random.randint(1200000, 2000000)
    
    return {
        "period": current_month,
        "total_leads_provided": total_leads,
        "hot_leads_generated": hot_leads,
        "leads_responded": random.randint(40, 80),
        "response_rate": round(random.uniform(0.05, 0.08), 3),
        "deals_closed_azizi": deals_closed,
        "total_revenue": total_revenue,
        "average_deal_size": round(total_revenue / max(deals_closed, 1)),
        "commission_received": round(total_revenue * 0.04),
        "conversion_rate": round((deals_closed / total_leads) * 100, 1),
        "time_to_close_avg": random.randint(10, 16),
        "linkedin_performance": {
            "leads": random.randint(500, 600),
            "response_rate": round(random.uniform(0.04, 0.07), 3),
            "conversion": round(random.uniform(0.15, 0.20), 3)
        },
        "instagram_performance": {
            "leads": random.randint(200, 400),
            "response_rate": round(random.uniform(0.06, 0.10), 3),
            "conversion": round(random.uniform(0.12, 0.18), 3)
        }
    }

@api_router.get("/analytics/compare/{month1}/{month2}")
async def compare_months(month1: str, month2: str):
    """Compare analytics between two months"""
    
    # Generate comparison data
    data1 = {
        "period": month1,
        "total_leads_provided": random.randint(750, 900),
        "hot_leads_generated": random.randint(100, 150),
        "deals_closed_azizi": random.randint(15, 30),
        "total_revenue": random.randint(1000000, 1500000),
        "conversion_rate": round(random.uniform(0.15, 0.20), 3),
        "response_rate": round(random.uniform(0.04, 0.07), 3)
    }
    
    data2 = {
        "period": month2,
        "total_leads_provided": random.randint(800, 1000),
        "hot_leads_generated": random.randint(120, 180),
        "deals_closed_azizi": random.randint(20, 40),
        "total_revenue": random.randint(1200000, 2000000),
        "conversion_rate": round(random.uniform(0.16, 0.22), 3),
        "response_rate": round(random.uniform(0.05, 0.08), 3)
    }
    
    # Calculate changes
    comparison = {}
    for key in data1:
        if key != "period" and isinstance(data1[key], (int, float)):
            change = ((data2[key] - data1[key]) / data1[key]) * 100
            comparison[key] = {
                "month1": data1[key],
                "month2": data2[key],
                "change_percent": round(change, 1),
                "trend": "up" if change > 0 else "down" if change < 0 else "stable"
            }
    
    return {
        "month1_data": data1,
        "month2_data": data2,
        "comparison": comparison
    }

# Leads Endpoints
@api_router.get("/leads")
async def get_leads(limit: int = 50):
    """Get leads list"""
    leads = generate_mock_leads(limit)
    return {"leads": leads, "total": len(leads)}

@api_router.get("/leads/hot")
async def get_hot_leads():
    """Get hot leads only"""
    all_leads = generate_mock_leads(100)
    hot_leads = [lead for lead in all_leads if lead["lead_temperature"] == "HOT"]
    return {"leads": hot_leads[:10], "total": len(hot_leads)}

@api_router.post("/leads/{lead_id}/analyze")
async def analyze_lead(lead_id: str):
    """Get AI analysis for specific lead"""
    # Mock lead data for analysis
    lead_data = {
        "id": lead_id,
        "company": "TechCorp",
        "position": "CEO",
        "location": "Dubai",
        "ai_score": 95
    }
    
    analysis = await get_ai_lead_analysis(lead_data, "scoring")
    
    return {
        "lead_id": lead_id,
        "analysis": analysis,
        "recommendations": [
            "High-value prospect with strong buying potential",
            "Focus on luxury properties with tech-forward features",
            "Best contact time: 10-12 AM Dubai time"
        ]
    }

# Projects Endpoints
@api_router.get("/projects")
async def get_projects():
    """Get AZIZI projects"""
    projects = generate_mock_projects()
    return {"projects": projects, "total": len(projects)}

@api_router.post("/projects/upload")
async def upload_project(file: UploadFile = File(...)):
    """Upload project files (mock implementation)"""
    return {
        "message": "File uploaded successfully (Demo Mode)",
        "filename": file.filename,
        "size": file.size,
        "content_type": file.content_type,
        "url": f"/uploads/demo/{file.filename}",
        "note": "In production, this will upload to S3/Backend storage"
    }

# AI Chat Endpoints
@api_router.post("/ai/chat")
async def ai_chat(message: dict):
    """AI Assistant Chat"""
    user_message = message.get("content", "")
    session_id = message.get("session_id", str(uuid.uuid4()))
    
    # Get current dashboard context
    dashboard_data = await get_dashboard_analytics()
    
    context_prompt = f"""You are B&B Lead Hunter AI Assistant. Current data:
    - Total leads: {dashboard_data['total_leads_provided']}
    - Hot leads: {dashboard_data['hot_leads_generated']}
    - Deals closed: {dashboard_data['deals_closed_azizi']}
    - Revenue: {dashboard_data['total_revenue']} AED
    
    Help the user with lead analysis, strategies, and insights."""
    
    try:
        client = openai.OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))
        
        response = client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {"role": "system", "content": context_prompt},
                {"role": "user", "content": user_message}
            ],
            temperature=0.7,
            max_tokens=1000
        )
        
        ai_response = response.choices[0].message.content
        
        return {
            "session_id": session_id,
            "response": ai_response,
            "timestamp": datetime.utcnow().isoformat(),
            "model": "gpt-4-turbo-preview"
        }
        
    except Exception as e:
        logging.error(f"AI chat error: {e}")
        return {
            "session_id": session_id,
            "response": "I'm experiencing some technical difficulties. Please try again in a moment.",
            "timestamp": datetime.utcnow().isoformat(),
            "error": True
        }

# Authentication Endpoints
@api_router.post("/auth/biometric")
async def biometric_auth(auth_data: dict):
    """Handle biometric authentication"""
    method = auth_data.get("method", "unknown")
    success = auth_data.get("success", False)
    
    if success:
        return {
            "authenticated": True,
            "method": method,
            "access_level": "full",
            "token": f"demo_token_{uuid.uuid4()}",
            "expires_in": 3600
        }
    else:
        raise HTTPException(status_code=401, detail="Biometric authentication failed")

@api_router.post("/auth/pin")
async def pin_auth(pin_data: dict):
    """Handle PIN authentication"""
    pin = pin_data.get("pin", "")
    
    if pin == "777036":
        return {
            "authenticated": True,
            "method": "pin",
            "access_level": "full",
            "token": f"pin_token_{uuid.uuid4()}",
            "expires_in": 3600
        }
    else:
        raise HTTPException(status_code=401, detail="Invalid PIN")

@api_router.post("/auth/guest")
async def guest_auth():
    """Handle guest authentication"""
    return {
        "authenticated": True,
        "method": "guest",
        "access_level": "demo",
        "token": f"guest_token_{uuid.uuid4()}",
        "expires_in": 3600,
        "note": "Limited access - Demo mode only"
    }

# Include router
app.include_router(api_router)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()