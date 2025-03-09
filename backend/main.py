from fastapi import FastAPI
from rutas import login
from rutas import palabras

app = FastAPI()

# Incluir las rutas
app.include_router(login.router)
app.include_router(palabras.router)



