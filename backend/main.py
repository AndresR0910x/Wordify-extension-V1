from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from rutas import login, palabras  # Importando las rutas de login y palabras

# Crear la instancia de la aplicación FastAPI
app = FastAPI()

# Configuración de CORS para permitir solicitudes desde cualquier origen (puedes cambiar "*" por una URL específica)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambia a la URL de tu frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Incluir las rutas
app.include_router(login.router)
app.include_router(palabras.router)

# El resto de la configuración de tu API
