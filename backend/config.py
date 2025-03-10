from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import engine_from_config

SQLALCHEMY_DATABASE_URL = "postgresql://postgres:andres@localhost/wordify_db"

# Crear el motor de conexión
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Verificar la conexión
try:
    # Intenta conectarse al motor
    with engine.connect() as connection:
        print("Conexión exitosa con la base de datos.")
except Exception as e:
    print(f"Error al conectar a la base de datos: {e}")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependencia para obtener la sesión de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
