# In backend/main.py
if __name__ == "__main__":
    # Change "main:app" to "backend.main:app"
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8001, reload=True)