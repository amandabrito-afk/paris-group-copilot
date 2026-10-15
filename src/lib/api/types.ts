/**
 * Tipos do contrato OpenAPI do Paris Group Copilot.
 *
 * Gerados a partir de `http://localhost:8000/openapi.json` — o contrato que o
 * FastAPI deriva do próprio código. Se o backend mudar e estes tipos não
 * acompanharem, o erro aparece na compilação, não em produção.
 *
 * Não editar à mão: regerar a partir do contrato.
 */

/** Status possíveis de uma hipótese de valor. Enum fechado no backend. */
export type HipoteseStatus = "rascunho" | "validada" | "invalidada";

/** Um produto do studio. Cada projeto agrupa suas hipóteses de valor. */
export interface Projeto {
  id: number;
  nome: string;
  descricao: string;
  criado_em: string;
}

/** Payload de criação de um projeto. */
export interface ProjetoCreate {
  nome: string;
  descricao?: string;
}

/** Hipótese de valor: o que melhora, para quem, e como medir. */
export interface Hipotese {
  id: number;
  projeto_id: number;
  enunciado: string;
  metrica: string;
  status: HipoteseStatus;
  criado_em: string;
}

/** Payload de registro de uma hipótese de valor. */
export interface HipoteseCreate {
  projeto_id: number;
  enunciado: string;
  metrica: string;
}

/** Resposta da checagem de saúde do serviço. */
export interface HealthStatus {
  status: string;
}
