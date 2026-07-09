# backend/models.py
from pydantic import BaseModel, Field
from typing import Optional

class ExtractedIdentity(BaseModel):
    first_name_np: str = ""
    last_name_np: str = ""
    address_np: str = ""
    first_name_en: str = ""
    last_name_en: str = ""
    address_en: str = ""
    dob_bs: str = ""
    dob_ad: str = ""
    document_number: str = ""
    confidence_score: float = 0.0

class HTMLFieldMetadata(BaseModel):
    element_id: str = ""
    element_name: str = ""
    element_placeholder: str = ""

class AgentMappingRequest(BaseModel):
    document_data: ExtractedIdentity
    form_fields: list[HTMLFieldMetadata]