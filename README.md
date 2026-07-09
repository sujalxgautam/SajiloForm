# 🚀 SajiloForm – AI Document Intelligence for Nepal

**SajiloForm** is an AI‑powered middleware that automatically extracts identity document data (Citizenship, Passport, Bank KYC) using Google Gemini models.  
Built as a **modular prototype** for hackathon demonstration, it showcases how AI can streamline administrative workflows in Nepal.

---

## ✨ Features

- 🤖 **AI‑Powered Extraction** – Uses Gemini 2.5 Flash (with retry logic) to parse images.
- 📄 **Multi‑Document Support** – National ID, Passport, Bank KYC forms.
- 🌐 **Bilingual Interface** – Toggle between English and Nepali (नेपाली).
- 📤 **Smart Upload** – Drag & drop, click to browse, **and paste from clipboard (Ctrl+V)**.
- 🎯 **Confidence Scoring** – Each extraction shows a confidence percentage.
- 🖼️ **Multi‑Image Handling** – Upload multiple documents (e.g., front & back) and switch between them.
- 🧪 **Boundary Testing** – Dedicated test endpoint to simulate blurry, skewed, or overexposed images.
- 🔄 **Resilience** – Automatic retries with exponential backoff and fallback to empty data.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | FastAPI (Python 3.13), LiteLLM, Pydantic, tenacity |
| **AI Model** | Gemini 2.5 Flash via LiteLLM router |
| **Frontend** | React 19, Vite, Axios, React Dropzone |
| **Styling** | Pure CSS (glass‑morphism, custom gradient) |
| **Deployment** | (Local) Uvicorn + Vite dev server |

---

## 📦 Installation & Setup

### Prerequisites
- Python 3.13+
- Node.js 18+
- 7 Gemini API keys (for load balancing)

### 1. Clone the Repository
```bash
git clone https://github.com/sujalxgautam/SajiloForm.git
cd SajiloForm