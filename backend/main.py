from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="RAG Agent API")

# Configure CORS for your Vercel domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-app.vercel.app",  # Replace with your Vercel URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    message: str
    conversation_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    conversation_id: str
    chunks_used: List[str] = []

class DocumentUpload(BaseModel):
    content: str
    filename: str

#TODO:Add your token to env
HF_API_TOKEN = os.getenv("HF_API_TOKEN")
HF_MODEL_URL = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium"

async def query_huggingface_model(prompt: str) -> str:
    """Hugging Face directly instead of Ollama"""
    headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}
    
    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 500,
            "temperature": 0.7,
            "do_sample": True,
        }
    }
    
    response = requests.post(HF_MODEL_URL, headers=headers, json=payload)
    
    if response.status_code == 200:
        result = response.json()
        return result[0]["generated_text"] if isinstance(result, list) else result.get("generated_text", "")
    else:
        raise HTTPException(status_code=500, detail="Model inference failed")

