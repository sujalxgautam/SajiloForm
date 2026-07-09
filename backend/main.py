# backend/main.py
from dotenv import load_dotenv
load_dotenv() # This loads our keys from the .env file
from fastapi import FastAPI, File, UploadFile, HTTPException
import logging
# Add this near the top of your main.py to hide those specific warnings
logging.getLogger("LiteLLM").setLevel(logging.ERROR)
import base64
import json
from backend.models import ExtractedIdentity, AgentMappingRequest
from backend.engine import extract_document, router 

from fastapi import Request
from fastapi.responses import JSONResponse
app = FastAPI()

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
    # Use the full path: module.file:app
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8001, reload=True)