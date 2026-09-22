from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class Projeto(Base):
    """Um produto do studio. Cada projeto agrupa suas hipoteses de valor."""

    __tablename__ = "projetos"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str] = mapped_column(String(120))
    descricao: Mapped[str] = mapped_column(Text, default="")
    criado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    hipoteses: Mapped[list["Hipotese"]] = relationship(back_populates="projeto")


class Hipotese(Base):
    """Hipotese de valor: o que melhora, para quem, e como medir."""

    __tablename__ = "hipoteses"

    id: Mapped[int] = mapped_column(primary_key=True)
    projeto_id: Mapped[int] = mapped_column(ForeignKey("projetos.id"))
    enunciado: Mapped[str] = mapped_column(Text)
    metrica: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(20), default="rascunho")
    criado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    projeto: Mapped["Projeto"] = relationship(back_populates="hipoteses")
