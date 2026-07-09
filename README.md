# 🚀 SajiloForm – AI Document Intelligence for Nepal

**SajiloForm** is an AI-powered middleware that automatically extracts identity document data (Citizenship, Passport, Bank KYC) using state-of-the-art language models. Built as a modular SDK for seamless integration into government and enterprise systems.

## ✨ Features

- 🤖 **AI-Powered Extraction** – Uses Gemini 2.5 Flash with intelligent load balancing across 7 API keys.
- 📄 **Multi‑Document Support** – National ID, Passport, Bank KYC forms.
- 🌐 **Bilingual Interface** – Full support for English and Nepali (नेपाली).
- 📤 **Smart Upload** – Drag & drop multiple images with real‑time processing and confidence scores.
- 🎯 **High Accuracy** – Confidence scoring for every extracted field.
- 🏦 **Enterprise Ready** – Modular architecture, easy SDK integration.

## 🛠 Tech Stack

### Backend
- **Framework:** FastAPI (Python 3.13)
- **AI Engine:** LiteLLM Router with Gemini 2.5 Flash
- **Validation:** Pydantic
- **Server:** Uvicorn

### Frontend
- **Framework:** React 19 with Vite
- **Styling:** Pure CSS (custom glass‑morphism design)
- **HTTP Client:** Axios
- **File Upload:** React Dropzone

## 📦 Installation

### Prerequisites
- Python 3.13+
- Node.js 18+
- 7 Gemini API Keys (for load balancing)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/SajiloForm.git
cd SajiloForm
