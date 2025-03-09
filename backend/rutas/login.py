import jwt
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from modelos.models import Usuario
from config import get_db  # Esta es la función que te permitirá acceder a la base de datos
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from sqlalchemy.exc import IntegrityError

# Iniciar el router
router = APIRouter()

# Configuración de seguridad
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Configuración del secreto para firmar el JWT
SECRET_KEY = "mi_secreto_super_seguro"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # Tiempo de expiración del token (en minutos)

# Función para verificar contraseñas
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Función para obtener el hash de la contraseña
def get_password_hash(password):
    return pwd_context.hash(password)

# Función para generar un token JWT
def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Endpoint de login
@router.post("/login")
def login(username: str, password: str, db: Session = Depends(get_db)):
    # Buscar al usuario en la base de datos
    user = db.query(Usuario).filter(Usuario.username == username).first()
    if user is None:
        raise HTTPException(status_code=400, detail="Usuario no encontrado")

    # Verificar la contraseña
    if not verify_password(password, user.password):
        raise HTTPException(status_code=400, detail="Contraseña incorrecta")

    # Generar el token JWT
    access_token = create_access_token(data={"sub": user.username, "user_id": user.id})

    # Devolver el token y el ID del usuario
    return {"access_token": access_token, "token_type": "bearer", "user_id": user.id}

# Endpoint de registro de usuario
@router.post("/register")
def register(username: str, email: str, password: str, db: Session = Depends(get_db)):
    # Verificar si el usuario ya existe
    user = db.query(Usuario).filter(Usuario.username == username).first()
    if user:
        raise HTTPException(status_code=400, detail="El nombre de usuario ya está en uso")

    # Crear un nuevo usuario
    hashed_password = get_password_hash(password)
    new_user = Usuario(username=username, email=email, password=hashed_password)

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Error al guardar el usuario en la base de datos")
    
    return {"message": "Usuario creado con éxito", "username": new_user.username, "email": new_user.email}
