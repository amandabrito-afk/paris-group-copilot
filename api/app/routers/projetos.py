from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Projeto
from ..schemas import ProjetoCreate, ProjetoOut

router = APIRouter(prefix="/projetos", tags=["projetos"])


@router.get("/", response_model=list[ProjetoOut], summary="Lista os projetos do studio")
def listar_projetos(db: Session = Depends(get_db)):
    return db.scalars(select(Projeto).order_by(Projeto.id)).all()


@router.post(
    "/",
    response_model=ProjetoOut,
    status_code=status.HTTP_201_CREATED,
    summary="Cria um projeto",
)
def criar_projeto(payload: ProjetoCreate, db: Session = Depends(get_db)):
    projeto = Projeto(**payload.model_dump())
    db.add(projeto)
    db.commit()
    db.refresh(projeto)
    return projeto


@router.get("/{projeto_id}", response_model=ProjetoOut, summary="Busca um projeto")
def buscar_projeto(projeto_id: int, db: Session = Depends(get_db)):
    projeto = db.get(Projeto, projeto_id)
    if projeto is None:
        raise HTTPException(status_code=404, detail="Projeto nao encontrado")
    return projeto
