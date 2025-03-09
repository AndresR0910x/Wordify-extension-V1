from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from deep_translator import GoogleTranslator
from modelos.models import Usuario, Palabra
from modelos.schemas import PalabraCreate, Palabra as PalabraSchema
from config import get_db  # Asegúrate de tener esta función en tu archivo database.py

router = APIRouter()

# Ruta para crear una palabra, traducirla y asociarla a un usuario
@router.post("/palabra/", response_model=PalabraSchema)
def crear_palabra(palabra: PalabraCreate, db: Session = Depends(get_db)):
    # Verificar si el usuario existe
    usuario = db.query(Usuario).filter(Usuario.id == palabra.user_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Traducir la palabra original usando deep-translator
    try:
        palabra_traducida = GoogleTranslator(source='auto', target='es').translate(palabra.palabra_original)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error al traducir la palabra")
    
    # Crear la palabra asociada al usuario
    nueva_palabra = Palabra(
        palabra_original=palabra.palabra_original,
        palabra_traducida=palabra_traducida,
        user_id=palabra.user_id
    )
    
    # Guardar la palabra en la base de datos
    db.add(nueva_palabra)
    db.commit()
    db.refresh(nueva_palabra)

    return nueva_palabra
