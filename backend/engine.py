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
                {"type": "text", "text": """Extract ALL available information from this Nepalese identity document (Citizenship, National ID, Passport, or KYC document).

IMPORTANT INSTRUCTIONS:
1. Look carefully for these fields and extract whatever you can find:
   - first_name_np: First name in Nepali (if visible)
   - last_name_np: Last name in Nepali (if visible)
   - address_np: Full address in Nepali (including province, district, municipality if mentioned)
   - first_name_en: First name in English
   - last_name_en: Last name in English
   - address_en: Full address in English (including province, district, municipality if mentioned)
   - dob_bs: Date of birth in BS format (e.g., 2076-01-15)
   - dob_ad: Date of birth in AD format (e.g., 1990-05-20)
   - document_number: Document/ID number (Citizenship number, Passport number, etc.)
   - confidence_score: How confident are you? (0.0 to 1.0)

2. For address fields, try to extract the FULL address including:
   - Province (प्रदेश) - e.g., Bagmati, Gandaki, Province 1
   - District (जिल्ला) - e.g., Kathmandu, Lalitpur, Chitwan
   - Municipality (नगरपालिका) - e.g., Kathmandu Metropolitan City
   - Ward (वडा) - e.g., Ward No. 5

3. If you can't find specific info, leave the field empty as "".

4. Return ONLY valid JSON matching this exact schema:
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

IMPORTANT: The response MUST be valid JSON with no additional text or explanation."""},
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
            
        # Log the extracted data for debugging
        print("📝 Extracted Data:", json.dumps(data, indent=2))
            
        # Ensure all fields exist with defaults and convert None to empty string
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
        print(f"❌ Error in extract_document: {e}")
        # Return empty data on error
        return ExtractedIdentity()