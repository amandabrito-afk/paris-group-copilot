from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Hipotese, Projeto
from ..schemas import HipoteseCreate, HipoteseOut, Status

router = APIRouter(prefix="/hipoteses", tags=["hipoteses"])


@router.get(
    "/", response_model=list[HipoteseOut], summary="Lista as hipoteses de valor"
)
def listar_hipoteses(db: Session = Depends(get_db)):
    return db.scalars(select(Hipotese).order_by(Hipotese.id)).all()


@router.post(
    "/",
    response_model=HipoteseOut,
    status_code=status.HTTP_201_CREATED,
    summary="Registra uma hipotese de valor",
)
def criar_hipotese(payload: HipoteseCreate, db: Session = Depends(get_db)):
    if db.get(Projeto, payload.projeto_id) is None:
        raise HTTPException(status_code=404, detail="Projeto nao encontrado")
    hipotese = Hipotese(**payload.model_dump())
    db.add(hipotese)
    db.commit()
    db.refresh(hipotese)
    return hipotese


@router.patch(
    "/{hipotese_id}/status",
    response_model=HipoteseOut,
    summary="Marca a hipotese como validada ou invalidada",
)
def atualizar_status(hipotese_id: int, novo_status: Status, db: Session = Depends(get_db)):
    hipotese = db.get(Hipotese, hipotese_id)
    if hipotese is None:
        raise HTTPException(status_code=404, detail="Hipotese nao encontrada")
    hipotese.status = novo_status
    db.commit()
    db.refresh(hipotese)
    return hipotese
