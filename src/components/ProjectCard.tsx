import Link from "next/link";
import type { Projeto } from "../lib/api/types";

interface ProjectCardProps {
  /** Projeto vindo do contrato OpenAPI — nunca `any`. */
  projeto: Projeto;
  /** Quantas hipóteses este projeto tem registradas. */
  totalHipoteses?: number;
}

/** Cartão de um projeto do studio, na listagem. */
export function ProjectCard({ projeto, totalHipoteses }: ProjectCardProps) {
  return (
    <article
      style={{
        border: "1px solid #e5e5e5",
        borderRadius: 6,
        padding: "16px 18px",
        marginBottom: 10,
      }}
    >
      <h2 style={{ margin: 0, fontSize: 17 }}>
        <Link href={`/projects/${projeto.id}`} style={{ color: "#16181C", textDecoration: "none" }}>
          {projeto.nome}
        </Link>
      </h2>

      {projeto.descricao ? (
        <p style={{ margin: "6px 0 0", color: "#666", fontSize: 14 }}>{projeto.descricao}</p>
      ) : null}

      <p style={{ margin: "10px 0 0", color: "#8D9096", fontSize: 12 }}>
        Criado em {new Date(projeto.criado_em).toLocaleDateString("pt-BR")}
        {typeof totalHipoteses === "number"
          ? ` · ${totalHipoteses} ${totalHipoteses === 1 ? "hipótese" : "hipóteses"}`
          : null}
      </p>
    </article>
  );
}
