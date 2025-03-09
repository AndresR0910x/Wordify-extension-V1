from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

Base = declarative_base()

# Modelo de Usuario
class Usuario(Base):
    __tablename__ = 'usuarios'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)

    # Relación con la tabla Palabras
    palabras = relationship("Palabra", back_populates="usuario")

    def __repr__(self):
        return f"<Usuario(id={self.id}, username={self.username}, email={self.email})>"

# Modelo de Palabras
class Palabra(Base):
    __tablename__ = 'palabras'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('usuarios.id'))
    palabra_original = Column(String)
    palabra_traducida = Column(String)

    # Relación con la tabla Usuario
    usuario = relationship("Usuario", back_populates="palabras")

    def __repr__(self):
        return f"<Palabra(id={self.id}, palabra_original={self.palabra_original}, palabra_traducida={self.palabra_traducida})>"

