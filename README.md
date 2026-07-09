# 🚀 SajiloForm

**AI-powered Document Intelligence for Nepal**

SajiloForm is an intelligent document processing system that automates data extraction from Nepalese identity documents (Citizenship, National ID, Passport, Bank KYC) using AI. Built for government and B2B integration.

## ✨ Features

- **🤖 AI-Powered Extraction**: Uses Google Gemini 2.5 Flash with load balancing across 7 API keys
- **📄 Multi-Document Support**: National ID, Passport, Bank KYC forms
- **🌐 Bilingual**: Full support for English and Nepali (नेपाली)
- **📤 Smart Upload**: Drag & drop multiple images with real-time processing
- **🎯 High Accuracy**: Confidence scoring for extracted data
- **🏦 Enterprise Ready**: Modular architecture for SDK integration

## 🛠 Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.13)
- **AI Engine**: LiteLLM Router with Gemini 2.5 Flash
- **Validation**: Pydantic
- **Server**: Uvicorn

### Frontend
- **Framework**: React 19 with Vite
- **Styling**: Pure CSS (No Tailwind)
- **HTTP Client**: Axios
- **File Upload**: React Dropzone

## 📦 Installation

### Prerequisites
- Python 3.13+
- Node.js 18+
- 7 Gemini API Keys (for load balancing)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/SajiloForm.git
cd SajiloForm
