# backend/engine.py
from litellm import Router
import os
import json
from .models import ExtractedIdentity
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

# ========== MODEL CONFIGURATION ==========
# Try these in order: gemini-1.5-pro (most stable), gemini-1.5-flash, gemini-2.0-flash
MODEL_NAME = "gemini/gemini-2.5-flash"   # <-- CHANGE THIS TO TEST OTHER MODELS

model_list = [
    {"model_name": "sajiloform-ocr-pool", "litellm_params": {"model": MODEL_NAME, "api_key": os.getenv(f"GEMINI_KEY_{i}"), "rpm": 15}}
    for i in range(1, 8) if os.getenv(f"GEMINI_KEY_{i}")
]

print(f"🔑 Found {len(model_list)} API keys. Using model: {MODEL_NAME}")

if not model_list:
    print("⚠️ No Gemini API keys found! Please check your .env file.")
    router = Router(model_list=[{"model_name": "sajiloform-ocr-pool", "litellm_params": {"model": MODEL_NAME}}])
else:
    router = Router(model_list=model_list, routing_strategy="simple-shuffle", num_retries=3)

# ========== RETRY DECORATOR ==========
@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    retry=retry_if_exception_type(Exception),
    before_sleep=lambda retry_state: print(f"⚠️ Retry attempt {retry_state.attempt_number} after error: {retry_state.outcome.exception()}")
)
async def call_gemini_with_retry(base64_image: str, content_type: str) -> dict:
    response = await router.acompletion(
        model="sajiloform-ocr-pool",
        messages=[{"role": "user", "content": [
            {"type": "text", "text": """Extract ALL available information from this Nepalese identity document.

Return ONLY valid JSON matching this exact schema:
{
  "first_name_np": "",
  "last_name_np": "",
  "address_np": "",
  "first_name_en": "",
  "last_name_en": "",
  "address_en": "",
  "dob_bs": "",
  "dob_ad": "",
  "document_number": "",
  "confidence_score": 0.0
}

Include province, district, municipality, ward in address fields if visible."""},
            {"type": "image_url", "image_url": {"url": f"data:{content_type};base64,{base64_image}"}}
        ]}],
        response_format={"type": "json_object"}
    )
    content = response.choices[0].message.content
    return json.loads(content) if isinstance(content, str) else content

# ========== MAIN EXTRACTOR ==========
async def extract_document(base64_image: str, content_type: str) -> ExtractedIdentity:
    try:
        data = await call_gemini_with_retry(base64_image, content_type)
        print("📝 Extracted Data:", json.dumps(data, indent=2))
        return ExtractedIdentity(
            first_name_np=data.get("first_name_np") or "",
            last_name_np=data.get("last_name_np") or "",
            address_np=data.get("address_np") or "",
            first_name_en=data.get("first_name_en") or "",
            last_name_en=data.get("last_name_en") or "",
            address_en=data.get("address_en") or "",
            dob_bs=data.get("dob_bs") or "",
            dob_ad=data.get("dob_ad") or "",
            document_number=data.get("document_number") or "",
            confidence_score=data.get("confidence_score") or 0.0
        )
    except Exception as e:
        print(f"❌ All retry attempts failed: {e}")
        return ExtractedIdentity(confidence_score=0.0)