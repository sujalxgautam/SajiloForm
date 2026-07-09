from pydantic import BaseModel, Field, field_validator
from typing import Optional, Any

class ExtractedIdentity(BaseModel):
    first_name_np: str = Field(default="", description="First name in Nepali")
    last_name_np: str = Field(default="", description="Last name in Nepali")
    address_np: str = Field(default="", description="Address in Nepali")
    first_name_en: str = Field(default="", description="First name in English")
    last_name_en: str = Field(default="", description="Last name in English")
    address_en: str = Field(default="", description="Address in English")
    dob_bs: str = Field(default="", description="Date of birth in BS")
    dob_ad: str = Field(default="", description="Date of birth in AD")
    document_number: str = Field(default="", description="Document number")
    confidence_score: float = Field(default=0.0, description="Confidence score")
    
    @field_validator('*', mode='before')
    @classmethod
    def convert_none_to_empty(cls, v):
        """Convert None to empty string for all string fields"""
        if v is None:
            return ""
        return v
    
    class Config:
        # Allow extra fields
        extra = "allow"

class HTMLFieldMetadata(BaseModel):
    element_id: str = ""
    element_name: str = ""
    element_placeholder: str = ""

class AgentMappingRequest(BaseModel):
    document_data: ExtractedIdentity
    form_fields: list[HTMLFieldMetadata]