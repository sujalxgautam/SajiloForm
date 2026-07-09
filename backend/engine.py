# backend/engine.py
from litellm import Router
import os
from .models import ExtractedIdentity

# Initialize router once
model_list = [
    {"model_name": "sajiloform-ocr-pool", "litellm_params": {"model": "gemini/gemini-2.5-flash", "api_key": os.getenv(f"GEMINI_KEY_{i}"), "rpm": 15}}
    for i in range(1, 8) if os.getenv(f"GEMINI_KEY_{i}")
]
router = Router(model_list=model_list, routing_strategy="simple-shuffle", num_retries=3)

async def extract_document(base64_image: str, content_type: str) -> ExtractedIdentity:
    response = await router.acompletion(
        model="sajiloform-ocr-pool",
        messages=[{"role": "user", "content": [
            {"type": "text", "text": "Extract Nepalese ID details + confidence_score."},
            {"type": "image_url", "image_url": {"url": f"data:{content_type};base64,{base64_image}"}}
        ]}],
        response_format=ExtractedIdentity
    )
    return ExtractedIdentity.model_validate_json(response.choices[0].message.content)
