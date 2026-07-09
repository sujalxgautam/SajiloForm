import os
import json
import base64
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from litellm import Router
from dotenv import load_dotenv

# Load variables from the .env file
load_dotenv()

app = FastAPI(
    title="SajiloForm Core Engine",
    description="Resilient multi-model data extraction backend for Nepalese identity documents.",
    version="1.0.0"
)

# --------------------------------------------------------
# 1. CORS Configuration for Frontend Connectivity
# --------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits requests from your local frontend ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------------
# 2. Pydantic Target Output Schema
# --------------------------------------------------------
class ExtractedData(BaseModel):
    first_name: str = Field(description="First name / Given names exactly as written on the document (in Devanagari script if the document is in Nepali)")
    last_name: str = Field(description="Last name / Surname exactly as written on the document (in Devanagari script if the document is in Nepali)")
    dob: str = Field(description="Date of Birth formatted strictly as YYYY-MM-DD. Convert Bikram Sambat (B.S.) to Gregorian (A.D.) if necessary.")
    document_number: str = Field(description="The unique identification or certificate number of the document")
    address: str = Field(description="Full permanent address exactly as listed on the document (in Devanagari script if written in Nepali)")

# --------------------------------------------------------
# 3. High-Availability LiteLLM Router Setup (14 Unique Keys)
# --------------------------------------------------------
model_list = [
    # --- 7 NATIVE GOOGLE GEMINI DEPLOYMENTS ---
    {"model_name": "nepal-document-extractor", "litellm_params": {"model": "gemini/gemini-2.5-flash", "api_key": os.getenv("GEMINI_KEY_1")}},
    {"model_name": "nepal-document-extractor", "litellm_params": {"model": "gemini/gemini-2.5-flash", "api_key": os.getenv("GEMINI_KEY_2")}},
    {"model_name": "nepal-document-extractor", "litellm_params": {"model": "gemini/gemini-2.5-flash", "api_key": os.getenv("GEMINI_KEY_3")}},
    {"model_name": "nepal-document-extractor", "litellm_params": {"model": "gemini/gemini-2.5-flash", "api_key": os.getenv("GEMINI_KEY_4")}},
    {"model_name": "nepal-document-extractor", "litellm_params": {"model": "gemini/gemini-2.5-pro", "api_key": os.getenv("GEMINI_KEY_5")}},
    {"model_name": "nepal-document-extractor", "litellm_params": {"model": "gemini/gemini-3.5-flash", "api_key": os.getenv("GEMINI_KEY_6")}},
    {"model_name": "nepal-document-extractor", "litellm_params": {"model": "gemini/gemini-3.5-flash", "api_key": os.getenv("GEMINI_KEY_7")}},

    # (Comment out OpenRouter if you don't have active credits deposited there!)
]

router = Router(
    model_list=model_list,
    routing_strategy="simple-shuffle",  # Evenly distributes and randomizes API hits
    allowed_fails=1,                    # Instantly flags a model deployment if it fails a request
    cooldown_time=30,                   # Blocks a rate-limited endpoint for 30 seconds before re-trying
    num_retries=3                       # Automatically transparently retries up to 3 alternate models on fail
)

# --------------------------------------------------------
# 4. Asynchronous Core API Endpoint
# --------------------------------------------------------
@app.post("/api/extract")
async def extract_document_data(file: UploadFile = File(...)):
    # Read the incoming image stream
    contents = await file.read()
    
    # Safely convert raw image bytes to an encoded base64 Data URL payload
    base64_image = base64.b64encode(contents).decode('utf-8')
    image_data_url = f"data:{file.content_type};base64,{base64_image}"

    # Optimized system instructions guiding the processing agent
    messages = [
        {
            "role": "system",
            "content": (
                "You are an expert identity extraction agent specialized in Nepalese regulatory paperwork. "
                "Analyze the uploaded document image (Citizenship Certificate, National ID, or Driver License) carefully. "
                "Locate the text fields corresponding to the user's details. If text fields exist in both Devnagari and "
                "English scripts, read the English fields or provide the direct English transliteration. "
                "Extract all fields exactly as defined in the target format layout."
            )
        },
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Extract all data points matching the requested JSON structure from this document."},
                {"type": "image_url", "image_url": {"url": image_data_url}}
            ]
        }
    ]

    try:
        # Route requests asynchronously through the resilient engine wrapper
        response = await router.acompletion(
            model="nepal-document-extractor",
            messages=messages,
            response_format={
                "type": "json_object",
                "response_schema": ExtractedData.model_json_schema()
            },
            temperature=0.0  # Zero out creativity for maximum text-extraction accuracy
        )
        
        # Parse output safely into standard computer-readable Python dictionary
        raw_json_string = response.choices[0].message.content
        extracted_object = json.loads(raw_json_string)
        
        return {"status": "success", "data": extracted_object}

    except Exception as e:
        # Catches routing failures and returns structural debug diagnostics to frontend
        raise HTTPException(status_code=500, detail=f"Extraction Engine Error: {str(e)}")