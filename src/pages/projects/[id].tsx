import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AppLayout } from "../../components/AppLayout";
import { StatusBadge } from "../../components/StatusBadge";
import { buscarProjeto, listarHipoteses } from "../../lib/api/openapi-client";
import type { Hipotese, Projeto } from "../../lib/api/types";

type Estado =
  | { fase: "carregando" }
  | { fase: "pronto"; projeto: Projeto; hipoteses: Hipotese[] }
  | { fase: "erro"; mensagem: string };

/** Detalhe de um projeto e suas hipóteses de valor. */
export default function ProjectDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [estado, setEstado] = useState<Estado>({ fase: "carregando" });

  useEffect(() => {
    if (typeof id !== "string") return;
    const projetoId = Number(id);
    if (Number.isNaN(projetoId)) {
      setEstado({ fase: "erro", mensagem: `Identificador inválido: ${id}` });
      return;
    }

    let ativo = true;

    Promise.all([buscarProjeto(projetoId), listarHipoteses()])
      .then(([projeto, todas]) => {
        if (!ativo) return;
        const hipoteses = todas.filter((h) => h.projeto_id === projetoId);
        setEstado({ fase: "pronto", projeto, hipoteses });
      })
      .catch((erro: unknown) => {
        if (!ativo) return;
        const mensagem = erro instanceof Error ? erro.message : "Erro desconhecido";
        setEstado({ fase: "erro", mensagem });
      });

    return () => {
      ativo = false;
    };
  }, [id]);

  if (estado.fase === "carregando") {
    return <AppLayout titulo="Projeto"><p style={{ color: "#666" }}>Carregando…</p></AppLayout>;
  }

  if (estado.fase === "erro") {
    return (
      <AppLayout titulo="Projeto">
        <div style={{ border: "1px solid #E7C9A0", background: "#F6EEE1", borderRadius: 6, padding: 16 }}>
          <strong>Não foi possível carregar este projeto.</strong>
          <p style={{ margin: "6px 0 0", fontSize: 14, color: "#8A5A1E" }}>{estado.mensagem}</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout titulo={estado.projeto.nome} subtitulo={estado.projeto.descricao || undefined}>
      <h2 style={{ fontSize: 16, marginTop: 8 }}>Hipóteses de valor</h2>

      {estado.hipoteses.length === 0 ? (
        <p style={{ color: "#666" }}>Nenhuma hipótese registrada para este projeto.</p>
      ) : (
        estado.hipoteses.map((hipotese) => (
          <article
            key={hipotese.id}
            style={{ border: "1px solid #e5e5e5", borderRadius: 6, padding: "14px 16px", marginBottom: 10 }}
          >
            <div style={{ display: "flex", gap: 10, alignItems: "baseline", justifyContent: "space-between" }}>
              <p style={{ margin: 0, fontSize: 15 }}>{hipotese.enunciado}</p>
              <StatusBadge status={hipotese.status} />
            </div>
            <p style={{ margin: "8px 0 0", color: "#666", fontSize: 13 }}>
              <strong>Métrica:</strong> {hipotese.metrica}
            </p>
          </article>
        ))
      )}
    </AppLayout>
  );
}
