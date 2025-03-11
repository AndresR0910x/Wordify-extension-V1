import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
 # Asegúrate de importar los modelos desde la ubicación correcta de tu proyecto
  # Importa la función get_db si la necesitas para el acceso a la DB

import sys
import os

# Añadir la carpeta 'backend' al sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from modelos import models
from config import Base, get_db 

# Configuración de la base de datos de prueba


SQLALCHEMY_TEST_DATABASE_URL = "postgresql://postgres:andres@localhost/wordify_db"  # Cambia esto según tu configuración
engine = create_engine(SQLALCHEMY_TEST_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Crea todas las tablas en la base de datos de prueba
Base.metadata.create_all(bind=engine)

# Fixture para la sesión de base de datos
@pytest.fixture(scope="function")
def db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Prueba para verificar la creación de un usuario
def test_create_usuario(db_session):
    # Crear un nuevo usuario
    new_user = models.Usuario(username="testuser", email="testuser@example.com", password="password123")
    db_session.add(new_user)
    db_session.commit()
    db_session.refresh(new_user)

    # Verificar que el usuario fue creado correctamente
    assert new_user.id is not None
    assert new_user.username == "testuser"
    assert new_user.email == "testuser@example.com"

# Prueba para verificar la creación de una palabra
def test_create_palabra(db_session):
    # Crear un nuevo usuario para asociar una palabra
    new_user = models.Usuario(username="testuser2", email="testuser2@example.com", password="password123")
    db_session.add(new_user)
    db_session.commit()

    # Crear una nueva palabra para el usuario
    new_palabra = models.Palabra(user_id=new_user.id, palabra_original="hola", palabra_traducida="hello")
    db_session.add(new_palabra)
    db_session.commit()
    db_session.refresh(new_palabra)

    # Verificar que la palabra fue creada correctamente
    assert new_palabra.id is not None
    assert new_palabra.palabra_original == "hola"
    assert new_palabra.palabra_traducida == "hello"

# Prueba para verificar que la relación de usuario y palabras funcione
def test_user_palabras_relationship(db_session):
    # Crear un nuevo usuario
    new_user = models.Usuario(username="testuser3", email="testuser3@example.com", password="password123")
    db_session.add(new_user)
    db_session.commit()

    # Crear varias palabras para el usuario
    palabra1 = models.Palabra(user_id=new_user.id, palabra_original="amigo", palabra_traducida="friend")
    palabra2 = models.Palabra(user_id=new_user.id, palabra_original="familia", palabra_traducida="family")
    db_session.add(palabra1)
    db_session.add(palabra2)
    db_session.commit()

    # Recuperar el usuario con sus palabras
    user_with_palabras = db_session.query(models.Usuario).filter(models.Usuario.id == new_user.id).first()

    # Verificar la relación
    assert user_with_palabras is not None
    assert len(user_with_palabras.palabras) == 2
    assert user_with_palabras.palabras[0].palabra_original == "amigo"
    assert user_with_palabras.palabras[1].palabra_original == "familia"
