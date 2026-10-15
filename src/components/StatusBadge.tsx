import type { HipoteseStatus } from "../lib/api/types";

interface StatusBadgeProps {
  /** Status da hipótese. Enum fechado, vindo do contrato OpenAPI. */
  status: HipoteseStatus;
}

const APARENCIA: Record<HipoteseStatus, { fundo: string; texto: string; rotulo: string }> = {
  rascunho: { fundo: "#F0F0EE", texto: "#5A5A55", rotulo: "Rascunho" },
  validada: { fundo: "#E6EEEA", texto: "#24483E", rotulo: "Validada" },
  invalidada: { fundo: "#F6EEE1", texto: "#8A5A1E", rotulo: "Invalidada" },
};

/**
 * Selo de status de uma hipótese.
 *
 * O `Record<HipoteseStatus, ...>` força o TypeScript a cobrir todos os status
 * do contrato: se o backend adicionar um novo, isto deixa de compilar.
 */
export function StatusBadge({ status }: StatusBadgeProps) {
  const { fundo, texto, rotulo } = APARENCIA[status];

  return (
    <span
      style={{
        background: fundo,
        color: texto,
        fontSize: 12,
        fontWeight: 600,
        padding: "3px 9px",
        borderRadius: 99,
        whiteSpace: "nowrap",
      }}
    >
      {rotulo}
    </span>
  );
}
