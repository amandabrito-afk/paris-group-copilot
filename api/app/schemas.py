from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

Status = Literal["rascunho", "validada", "invalidada"]


class ProjetoCreate(BaseModel):
    nome: str = Field(examples=["Paris Group Copilot"], max_length=120)
    descricao: str = Field(
        default="",
        examples=["Copiloto de venture studio para discovery e execucao de MVPs."],
    )


class ProjetoOut(ProjetoCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    criado_em: datetime


class HipoteseCreate(BaseModel):
    projeto_id: int = Field(examples=[1])
    enunciado: str = Field(
        examples=[
            "Se estruturarmos o briefing num formato unico e replicavel, "
            "entao uma pessoa nova entende a marca sem participar do briefing, "
            "porque o conhecimento deixa de viver so na cabeca de quem fez."
        ]
    )
    metrica: str = Field(
        examples=["Pessoa nova entende a base do produto em ate 30 minutos"]
    )


class HipoteseOut(HipoteseCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: Status
    criado_em: datetime
