import { useEffect, useState } from "react";
import { AppLayout } from "../../components/AppLayout";
import { ProjectCard } from "../../components/ProjectCard";
import { listarProjetos } from "../../lib/api/openapi-client";
import type { Projeto } from "../../lib/api/types";

type Estado =
  | { fase: "carregando" }
  | { fase: "pronto"; projetos: Projeto[] }
  | { fase: "erro"; mensagem: string };

/**
 * Lista os projetos do studio, consumindo `GET /projetos/` do contrato OpenAPI
 * através do cliente tipado. Nenhum `fetch` solto, nenhum `any`.
 */
export default function ProjectsPage() {
  const [estado, setEstado] = useState<Estado>({ fase: "carregando" });

  useEffect(() => {
    let ativo = true;

    listarProjetos()
      .then((projetos) => {
        if (ativo) setEstado({ fase: "pronto", projetos });
      })
      .catch((erro: unknown) => {
        if (!ativo) return;
        const mensagem = erro instanceof Error ? erro.message : "Erro desconhecido";
        setEstado({ fase: "erro", mensagem });
      });

    return () => {
      ativo = false;
    };
  }, []);

  return (
    <AppLayout titulo="Projetos" subtitulo="Os produtos do studio, vindos da API.">
      {estado.fase === "carregando" ? <p style={{ color: "#666" }}>Carregando…</p> : null}

      {estado.fase === "erro" ? (
        <div style={{ border: "1px solid #E7C9A0", background: "#F6EEE1", borderRadius: 6, padding: 16 }}>
          <strong>Não foi possível carregar os projetos.</strong>
          <p style={{ margin: "6px 0 0", fontSize: 14, color: "#8A5A1E" }}>{estado.mensagem}</p>
          <p style={{ margin: "8px 0 0", fontSize: 13, color: "#666" }}>
            Confira se a API está no ar e se <code>NEXT_PUBLIC_API_URL</code> aponta para ela.
          </p>
        </div>
      ) : null}

      {estado.fase === "pronto" && estado.projetos.length === 0 ? (
        <p style={{ color: "#666" }}>
          Nenhum projeto registrado ainda. Crie o primeiro por <code>POST /projetos/</code>.
        </p>
      ) : null}

      {estado.fase === "pronto"
        ? estado.projetos.map((projeto) => <ProjectCard key={projeto.id} projeto={projeto} />)
        : null}
    </AppLayout>
  );
}
