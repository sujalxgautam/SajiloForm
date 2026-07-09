# backend/main.py
import os
import base64
import json
import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from litellm import Router
from dotenv import load_dotenv

# Load key variables from your local .env file
load_dotenv()

app = FastAPI(title="SajiloForm Intelligence Engine")

# Maintain CORS bridge configuration for your React demo-portal
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# 🛠️ DATA SCHEMAS (Pydantic Models)
# ==========================================

# Model 1: Holds raw identity attributes extracted from documents
class ExtractedIdentity(BaseModel):
    first_name_np: str = Field(description="First name/Given name in native Devanagari script (नेपाली)")
    last_name_np: str = Field(description="Last name/Surname in native Devanagari script (नेपाली)")
    address_np: str = Field(description="Permanent address in native Devanagari script (नेपाली)")
    first_name_en: str = Field(description="First name/Given name in English CAPITAL letters")
    last_name_en: str = Field(description="Last name/Surname in English CAPITAL letters")
    address_en: str = Field(description="Permanent address translated/transliterated into English")
    dob_bs: str = Field(description="Date of birth in Bikram Sambat (BS) e.g., २०५२/०४/१५")
    dob_ad: str = Field(description="Date of birth converted to Gregorian Calendar (AD) e.g., 1995/07/31")
    document_number: str = Field(description="Identity, Citizenship, or National ID registration number digits")

# Model 2: Sub-schema describing a single raw HTML input field sent from frontend
class HTMLFieldMetadata(BaseModel):
    element_id: str = Field(default="", description="The 'id' attribute of the HTML input element")
    element_name: str = Field(default="", description="The 'name' attribute of the HTML input element")
    element_placeholder: str = Field(default="", description="The 'placeholder' attribute text of the HTML input element")

# Model 3: Payload structure incoming from the frontend for AI Agent mapping
class AgentMappingRequest(BaseModel):
    document_data: ExtractedIdentity = Field(description="The already extracted data from the document")
    form_fields: list[HTMLFieldMetadata] = Field(description="List of all raw HTML input attributes found on the host form")


# ==========================================
# 🔀 LITELLM KEY-SHUFFLING ROUTER POOL
# ==========================================
model_list = [
    {
        "model_name": "sajiloform-ocr-pool",
        "litellm_params": {
            "model": "gemini/gemini-2.5-flash",
            "api_key": os.getenv(f"GEMINI_KEY_{i}"),
            "rpm": 15, 
        }
    }
    for i in range(1, 8) if os.getenv(f"GEMINI_KEY_{i}")
]

router = Router(
    model_list=model_list,
    routing_strategy="simple-shuffle", # Automatically balances requests across your 7 keys
    num_retries=3,
    allowed_fails=1
)


# ==========================================
# 🚀 ENDPOINT 1: OCR EXTRACTION PIPELINE
# ==========================================
@app.post("/api/v1/extract", response_model=ExtractedIdentity)
async def extract_identity(file: UploadFile = File(...)):
    """Accepts an identity card image stream, processes it via the key pool, and returns bilingual JSON data."""
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file format. Upload an image.")
    
    try:
        image_bytes = await file.read()
        base64_image = base64.b64encode(image_bytes).decode("utf-8")
        
        response = await router.acompletion(
            model="sajiloform-ocr-pool",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text", 
                            "text": (
                                "Analyze this Nepalese identity document. Extract all fields accurately. "
                                "Provide details in both native Devanagari script and translated/transliterated English text "
                                "as strictly specified in the output schema. Ensure dates are calculated into both BS and AD variants."
                            )
                        },
                        {"type": "image_url", "image_url": {"url": f"data:{file.content_type};base64,{base64_image}"}} 
                    ]
                }
            ],
            response_format=ExtractedIdentity 
        )
        return ExtractedIdentity.model_validate_json(response.choices[0].message.content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction pipeline failure: {str(e)}")


# ==========================================
# 🤖 ENDPOINT 2: AI AGENT FORM-MAPPING CORE
# ==========================================
@app.post("/api/v1/map-fields")
async def map_fields(payload: AgentMappingRequest):
    """
    An Agentic layer that acts as a human reasoning system. It compares target form 
    fields with extracted data to return a direct element identifier-to-value map.
    """
    try:
        # Build a plain-text architectural context describing what fields need matching
        fields_to_analyze_string = ""
        for index, field in enumerate(payload.form_fields):
            fields_to_analyze_string += f"Field [{index}]: name='{field.element_name}', id='{field.element_id}', placeholder='{field.element_placeholder}'\n"

        # Initialize an LLM agent call to decide which document value belongs where
        response = await router.acompletion(
            model="sajiloform-ocr-pool",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an expert AI Form Filler Agent specialized in Nepalese administrative layouts. "
                        "Your job is to map extracted identity data parameters onto raw HTML fields. "
                        "You must return a raw JSON object where the KEYS are the exact matching element 'name' (prefer name over id), "
                        "and the VALUES are the appropriate corresponding information pieces selected from the document data.\n\n"
                        "Rules:\n"
                        "1. If an input field asks for Devanagari or Nepali content (detected by lookups or placeholder hints like 'नाम' or 'थर'), map the native text version.\n"
                        "2. If an input field asks for English, map the English text version.\n"
                        "3. Do not map fields if there is no confident match.\n"
                        "4. Output valid JSON only, without markdown blocks or code backticks."
                    )
                },
                {
                    "role": "user",
                    "content": f"Extracted Document Details:\n{payload.document_data.model_dump_json()}\n\nTarget Form Fields Found on Webpage:\n{fields_to_analyze_string}"
                }
            ],
            # Enforce strict raw JSON output formatting
            response_format={"type": "json_object"}
        )
        
        # Return the clean key-value mapping directly to the SDK engine
        mapping_result = json.loads(response.choices[0].message.content)
        return {"mappings": mapping_result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Agent mapping failure: {str(e)}")


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)