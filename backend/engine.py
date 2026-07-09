# backend/engine.py
from litellm import Router
import os
import json
from .models import ExtractedIdentity

# Initialize router once
model_list = [
    {"model_name": "sajiloform-ocr-pool", "litellm_params": {"model": "gemini/gemini-2.5-flash", "api_key": os.getenv(f"GEMINI_KEY_{i}"), "rpm": 15}}
    for i in range(1, 8) if os.getenv(f"GEMINI_KEY_{i}")
]

# If no keys found, use a default or raise error
if not model_list:
    print("⚠️ No Gemini API keys found! Please check your .env file.")
    # For demo purposes, we'll still create a router but it will fail
    router = Router(model_list=[{"model_name": "sajiloform-ocr-pool", "litellm_params": {"model": "gemini/gemini-2.5-flash"}}])
else:
    router = Router(model_list=model_list, routing_strategy="simple-shuffle", num_retries=3)

async def extract_document(base64_image: str, content_type: str) -> ExtractedIdentity:
    try:
        response = await router.acompletion(
            model="sajiloform-ocr-pool",
            messages=[{"role": "user", "content": [
                {"type": "text", "text": "Extract Nepalese ID details + confidence_score. Return ONLY valid JSON matching the schema: first_name_np, last_name_np, address_np, first_name_en, last_name_en, address_en, dob_bs, dob_ad, document_number, confidence_score"},
                {"type": "image_url", "image_url": {"url": f"data:{content_type};base64,{base64_image}"}}
            ]}],
            response_format={"type": "json_object"}
        )
        # Parse the response
        content = response.choices[0].message.content
        if isinstance(content, str):
            data = json.loads(content)
        else:
            data = content
            
        # Ensure all required fields exist with defaults
        return ExtractedIdentity(
            first_name_np=data.get("first_name_np", ""),
            last_name_np=data.get("last_name_np", ""),
            address_np=data.get("address_np", ""),
            first_name_en=data.get("first_name_en", ""),
            last_name_en=data.get("last_name_en", ""),
            address_en=data.get("address_en", ""),
            dob_bs=data.get("dob_bs", ""),
            dob_ad=data.get("dob_ad", ""),
            document_number=data.get("document_number", ""),
            confidence_score=data.get("confidence_score", 0.0)
        )
    except Exception as e:
        print(f"Error in extract_document: {e}")
        # Return empty data on error
        return ExtractedIdentity()