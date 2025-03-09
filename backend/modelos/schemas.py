from pydantic import BaseModel
from typing import List

# Esquema base para la palabra
class PalabraBase(BaseModel):
    palabra_original: str

# Esquema para la creación de una palabra
class PalabraCreate(PalabraBase):
    user_id: int  # Solo requerimos el user_id para crear la palabra

# Esquema para la respuesta de la palabra con el usuario
class Palabra(PalabraBase):
    id: int
    user_id: int
    palabra_traducida: str  # La traducción se incluirá aquí

    class Config:
        orm_mode = True

# Esquema base para el usuario
class UsuarioBase(BaseModel):
    username: str
    email: str

# Esquema para la creación de un usuario
class UsuarioCreate(UsuarioBase):
    password: str

# Esquema para la respuesta del usuario con la lista de palabras
class Usuario(UsuarioBase):
    id: int
    palabras: List[Palabra] = []  # Relación con las palabras del usuario

    class Config:
        orm_mode = True
