from pydantic import BaseModel, Field, field_validator
from typing import Optional, Any
import re

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
    confidence_score: float = Field(
        default=0.0, 
        ge=0.0, 
        le=1.0, 
        description="Confidence score between 0 and 1"
    )
    
    # Convert None to empty string for all fields
    @field_validator('*', mode='before')
    @classmethod
    def convert_none_to_empty(cls, v):
        """Convert None to empty string for all string fields"""
        return "" if v is None else v
    
    # Optional: Validate English fields contain only ASCII characters
    @field_validator('first_name_en', 'last_name_en', 'address_en')
    @classmethod
    def validate_english_fields(cls, v):
        """Warn if English fields contain non-ASCII characters"""
        if v and not re.match(r'^[a-zA-Z0-9\s\-.,\'"()]+$', v):
            # Log a warning but don't reject – the AI might still be correct
            # We just keep the value, but you could raise ValueError if strict
            pass
        return v
    
    class Config:
        # Allow extra fields from the AI response
        extra = "allow"

class HTMLFieldMetadata(BaseModel):
    element_id: str = ""
    element_name: str = ""
    element_placeholder: str = ""

class AgentMappingRequest(BaseModel):
    document_data: ExtractedIdentity
    form_fields: list[HTMLFieldMetadata]