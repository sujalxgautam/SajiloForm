# backend/main.py
import os
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from litellm import Router
from dotenv import load_dotenv
import uvicorn
import base64

load_dotenv()

app = FastAPI(title="SajiloForm Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🛠️ Define your structural schema
class ExtractedIdentity(BaseModel):
    first_name: str = Field(description="First name/Given name in native Devanagari script")
    last_name: str = Field(description="Last name/Surname in native Devanagari script")
    dob: str = Field(description="Date of birth exactly as written on the document")
    document_number: str = Field(description="Identity or registration number")
    address: str = Field(description="Permanent address in native Devanagari script")

# 🔀 Configure the LiteLLM Router Pool
model_list = [
    {
        "model_name": "sajiloform-ocr-pool",
        "litellm_params": {
            "model": "gemini/gemini-2.5-flash",
            "api_key": os.getenv(f"GEMINI_KEY_{i}"),
            "rpm": 15, # Safe guard limits per key if applicable
        }
    }
    for i in range(1, 8) if os.getenv(f"GEMINI_KEY_{i}")
]

# Initialize router with a simple-shuffle strategy and exponential backoff failover
router = Router(
    model_list=model_list,
    routing_strategy="simple-shuffle",
    num_retries=3,
    allowed_fails=1
)

@app.post("/api/v1/extract", response_model=ExtractedIdentity)
async def extract_identity(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file format. Upload an image.")
    
    try:
        image_bytes = await file.read()
        
        # 💡 FIX: Convert binary data to clean Base64 string format
        base64_image = base64.b64encode(image_bytes).decode("utf-8")
        
        # Dispatch to the shuffled router pool
        response = await router.acompletion(
            model="sajiloform-ocr-pool",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Extract details from this Nepalese identity document. Output fields natively in Devanagari script where indicated."},
                        {"type": "image_url", "image_url": {"url": f"data:{file.content_type};base64,{base64_image}"}} # Clean matching payload string
                    ]
                }
            ],
            response_format=ExtractedIdentity 
        )
        
        # Parse output safely via JSON structural translation layer
        return ExtractedIdentity.model_validate_json(response.choices[0].message.content)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction pipeline failure: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
