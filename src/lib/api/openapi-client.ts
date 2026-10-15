/**
 * Cliente HTTP tipado do Paris Group Copilot.
 *
 * Cada função corresponde a um endpoint do contrato OpenAPI e devolve o tipo
 * declarado nele. Não existe `fetch` solto nem `any` atravessando a fronteira:
 * divergência entre frontend e backend vira erro de compilação.
 */

import { config } from "../config";
import type {
  HealthStatus,
  Hipotese,
  HipoteseCreate,
  HipoteseStatus,
  Projeto,
  ProjetoCreate,
} from "./types";

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, mensagem: string) {
    super(mensagem);
    this.name = "ApiError";
    this.status = status;
  }
}

async function requisitar<T>(rota: string, init?: RequestInit): Promise<T> {
  const resposta = await fetch(`${config.apiUrl}${rota}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  if (!resposta.ok) {
    throw new ApiError(
      resposta.status,
      `Falha ao chamar ${rota}: ${resposta.status} ${resposta.statusText}`
    );
  }

  return (await resposta.json()) as T;
}

/** GET /projetos/ — lista os projetos do studio. */
export function listarProjetos(): Promise<Projeto[]> {
  return requisitar<Projeto[]>("/projetos/");
}

/** GET /projetos/{id} — busca um projeto. */
export function buscarProjeto(id: number): Promise<Projeto> {
  return requisitar<Projeto>(`/projetos/${id}`);
}

/** POST /projetos/ — cria um projeto. */
export function criarProjeto(payload: ProjetoCreate): Promise<Projeto> {
  return requisitar<Projeto>("/projetos/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** GET /hipoteses/ — lista as hipóteses de valor. */
export function listarHipoteses(): Promise<Hipotese[]> {
  return requisitar<Hipotese[]>("/hipoteses/");
}

/** POST /hipoteses/ — registra uma hipótese de valor. */
export function criarHipotese(payload: HipoteseCreate): Promise<Hipotese> {
  return requisitar<Hipotese>("/hipoteses/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** PATCH /hipoteses/{id}/status — marca a hipótese como validada ou invalidada. */
export function atualizarStatusHipotese(
  id: number,
  novoStatus: HipoteseStatus
): Promise<Hipotese> {
  return requisitar<Hipotese>(
    `/hipoteses/${id}/status?novo_status=${novoStatus}`,
    { method: "PATCH" }
  );
}

/** GET /health — checagem de saúde do serviço. */
export function verificarSaude(): Promise<HealthStatus> {
  return requisitar<HealthStatus>("/health");
}
