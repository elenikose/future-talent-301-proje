from fastapi import FastAPI

app = FastAPI(title="Son Çağrı API")

@app.get("/")
def read_root():
    return {"status": "Sistem Ayakta", "proje": "Son Çağrı"}