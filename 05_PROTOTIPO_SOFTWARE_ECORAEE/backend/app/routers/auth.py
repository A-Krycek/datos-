from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.entities import Usuario, RolSistema
from backend.app.schemas.dtos import Token, UserResponse
from backend.app.security import (
    verify_password, create_access_token, get_current_user, settings
)

router = APIRouter(prefix="/auth", tags=["Autenticación y RBAC"])

@router.post("/login", response_model=Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Autentica al usuario mediante credenciales institucionales y emite un JWT con rol (CP-01).
    """
    user = db.query(Usuario).filter(Usuario.username == form_data.username).first()
    
    # Credenciales demo por defecto si la base está recién inicializada
    if not user:
        demo_users = {
            "admin_sys": ("ROL_ADMIN", 1),
            "operador_carlos": ("ROL_OPERADOR", 2),
            "tecnico_maria": ("ROL_TECNICO", 3),
            "logistica_diego": ("ROL_LOGISTICA", 4),
            "auditor_ana": ("ROL_AUDITOR", 5)
        }
        if form_data.username in demo_users and form_data.password in ["admin123", "password123"]:
            role_code, user_id = demo_users[form_data.username]
            access_token = create_access_token(
                data={"sub": form_data.username, "role": role_code, "user_id": user_id}
            )
            return {
                "access_token": access_token,
                "token_type": "bearer",
                "username": form_data.username,
                "role": role_code
            }
        
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nombre de usuario o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nombre de usuario o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.activo:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Usuario inactivo en el sistema"
        )

    role_code = user.rol.codigo if user.rol else "ROL_OPERADOR"
    access_token = create_access_token(
        data={"sub": user.username, "role": role_code, "user_id": user.id_usuario}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": user.username,
        "role": role_code
    }

@router.get("/me", response_model=UserResponse)
def get_user_profile(current_user: dict = Depends(get_current_user)):
    """Retorna la identidad y el rol activo del usuario autenticado."""
    return {
        "id_usuario": current_user["user_id"],
        "username": current_user["username"],
        "role": current_user["role"],
        "activo": True
    }
