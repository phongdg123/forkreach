import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse  # <--- FIX 1: Missing import
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
from stream import router as stream_router
from conversations_api import router as conversations_router
from products_api import router as products_router

load_dotenv()

# Configure API Key (Critical)
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

app = FastAPI(
    title="ForkReach API",
    description="Multi-AI Marketing Agent for Indie Hackers",
    version="1.0.0"
)

# Include streaming router (with agents)
app.include_router(stream_router)

# Include conversations router
app.include_router(conversations_router)

# Include products router
app.include_router(products_router)

# Configure CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    prompt: str

async def stream_generator(prompt: str):
    try:
        # FIX 2: Model name. "gemini-2.5" isn't out yet. Use "gemini-1.5-flash"
        model = genai.GenerativeModel("gemini-2.5-flash")
        
        # FIX 3: Use 'generate_content_async' (not _sync) so you can await it
        response = await model.generate_content_async(prompt, stream=True)

        async for chunk in response:
            if chunk.text:
                yield chunk.text

    except Exception as e:
        yield f"Error: {str(e)}"

@app.post("/api/stream")
async def stream(request: ChatRequest):
    # FIX 4: Changed 'req.prompt' to 'request.prompt' to match the function argument
    return StreamingResponse(stream_generator(request.prompt), media_type="text/plain")
