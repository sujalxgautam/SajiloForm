# SajiloForm: Agentic Document Intelligence

**Automating administrative data entry for the digital age in Nepal.**

SajiloForm is an intelligent document processing engine designed to eliminate manual data entry errors. By combining a **Router-based AI core** with **Semantic Field Mapping**, we transform unstructured document images into structured, verified JSON data in real-time.

## 🚀 Key Features

* **Intelligent Extraction:** Extracts critical data from Nepalese identity documents (Citizenship, National ID) with high precision using an intelligent model pool.
* **Confidence-Driven UX:** Implements a "Human-in-the-Loop" flow. High-confidence data is auto-filled; low-confidence data triggers an interactive review mode.
* **Agentic Mapping:** Uses an intelligent agent to semantically map document fields to specific form structures.
* **Scalable Architecture:** Built as a modular Python package, ready for SDK-based integration into secure banking and government systems.
* **Load Balanced:** Employs a custom router to distribute API requests, ensuring high throughput and zero downtime.

## 🛠 Tech Stack

* **Backend:** FastAPI (Python 3.13), Uvicorn.
* **AI Engine:** LiteLLM Router, Google Gemini 2.5 Flash.
* **Validation:** Pydantic (strict data modeling).
* **Deployment:** Docker-ready, platform-independent architecture.

## 🏗 Project Architecture

* `backend/engine.py`: The "Core Logic"—handles raw image processing and AI orchestration.
* `backend/models.py`: The "Recipe Book"—standardized data schemas.
* `backend/main.py`: The "Traffic Controller"—manages API traffic and endpoint routing.

## 💻 Getting Started

### Prerequisites
* [Docker Desktop](https://www.docker.com/products/docker-desktop/)
* Python 3.13+

### Running the Backend
1. Clone the repository.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
