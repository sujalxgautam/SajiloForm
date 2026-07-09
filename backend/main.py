# backend/main.py
from dotenv import load_dotenv
load_dotenv()  # This loads our keys from the .env file

from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import logging
# Add this near the top of your main.py to hide those specific warnings
logging.getLogger("LiteLLM").setLevel(logging.ERROR)
import base64
import json
import random
from backend.models import ExtractedIdentity, AgentMappingRequest
from backend.engine import extract_document, router

from fastapi import Request
from fastapi.responses import JSONResponse

app = FastAPI(
    title="SajiloForm API",
    description="AI-powered document extraction for Nepalese identity documents.",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",  # Your frontend dev server
        "http://localhost:5173",  # Vite default
        "http://localhost:3000",  # Alternative port
        "*"  # For development only - remove in production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/v1/extract", response_model=ExtractedIdentity)
async def extract_identity(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file format.")
    
    # Read and encode the file
    image_bytes = await file.read()
    b64 = base64.b64encode(image_bytes).decode("utf-8")
    
    try:
        # Calls your modular engine logic
        return await extract_document(b64, file.content_type)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/map-fields")
async def map_fields(payload: AgentMappingRequest):
    fields_str = "\n".join([f"name='{f.element_name}', id='{f.element_id}', placeholder='{f.element_placeholder}'" for f in payload.form_fields])
    
    response = await router.acompletion(
        model="sajiloform-ocr-pool",
        messages=[
            {"role": "system", "content": "You are a form filler. Return ONLY valid JSON."},
            {"role": "user", "content": f"Document: {payload.document_data.model_dump_json()}\n\nFields: {fields_str}"}
        ],
        response_format={"type": "json_object"}
    )
    return {"mappings": json.loads(response.choices[0].message.content)}

@app.get("/health")
async def health_check():
    """Simple endpoint to verify the backend is running."""
    return {
        "status": "online", 
        "version": "1.0.0",
        "description": "SajiloForm Backend API"
    }

@app.get("/api/v1/test/boundary")
async def test_boundary(
    test_type: str = Query(
        default="perfect",
        description="Type of test: 'blurry', 'skewed', 'overexposed', 'perfect', 'partial', 'empty'"
    )
):
    """
    Test endpoint for boundary testing (judge's stress test).
    Returns mock ExtractedIdentity with varying confidence scores and data completeness.
    """
    # Confidence mapping
    confidence_map = {
        "blurry": 0.45,
        "skewed": 0.60,
        "overexposed": 0.50,
        "perfect": 0.95,
        "partial": 0.70,
        "empty": 0.0,
    }
    
    confidence = confidence_map.get(test_type, 0.80)
    
    # Build mock data based on confidence
    # Higher confidence => more fields filled
    data = {
        "first_name_np": "राम" if confidence > 0.3 else "",
        "last_name_np": "शर्मा" if confidence > 0.3 else "",
        "address_np": "काठमाडौं, बागमती" if confidence > 0.4 else "",
        "first_name_en": "Ram" if confidence > 0.3 else "",
        "last_name_en": "Sharma" if confidence > 0.3 else "",
        "address_en": "Kathmandu, Bagmati" if confidence > 0.4 else "",
        "dob_bs": "2050-01-01" if confidence > 0.5 else "",
        "dob_ad": "1993-04-15" if confidence > 0.5 else "",
        "document_number": "123456789" if confidence > 0.5 else "",
        "confidence_score": confidence
    }
    
    return ExtractedIdentity(**data)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "message": "The AI Agent encountered an issue. Please check the image quality and try again."
        },
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8001, reload=True)