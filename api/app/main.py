from contextlib import asynccontextmanager

from fastapi import FastAPI

from .database import Base, engine
from .routers import hipoteses, projetos


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="Paris Group Copilot API",
    version="0.1.0",
    description=(
        "Contrato entre frontend e backend do Paris Group Copilot. "
        "O schema OpenAPI gerado aqui e a fonte de verdade: o frontend consome "
        "este contrato em vez de combinar formatos por conversa."
    ),
    lifespan=lifespan,
)

app.include_router(projetos.router)
app.include_router(hipoteses.router)


@app.get("/health", tags=["health"], summary="Checagem de saude do servico")
def health():
    return {"status": "ok"}
