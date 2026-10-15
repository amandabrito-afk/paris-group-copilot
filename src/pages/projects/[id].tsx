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

/**
 * Converte o parâmetro de rota em identificador numérico.
 *
 * Roda durante o render, não dentro do efeito: id inválido é uma condição
 * derivada da própria URL, não um estado a sincronizar com sistema externo.
 */
function lerIdDaRota(valor: string | string[] | undefined): number | null {
  if (typeof valor !== "string") return null;
  const numero = Number(valor);
  return Number.isInteger(numero) && numero > 0 ? numero : null;
}

function Aviso({ titulo, detalhe }: { titulo: string; detalhe: string }) {
  return (
    <div style={{ border: "1px solid #E7C9A0", background: "#F6EEE1", borderRadius: 6, padding: 16 }}>
      <strong>{titulo}</strong>
      <p style={{ margin: "6px 0 0", fontSize: 14, color: "#8A5A1E" }}>{detalhe}</p>
    </div>
  );
}

/** Detalhe de um projeto e suas hipóteses de valor. */
export default function ProjectDetailPage() {
  const router = useRouter();
  const projetoId = lerIdDaRota(router.query.id);
  const [estado, setEstado] = useState<Estado>({ fase: "carregando" });

  useEffect(() => {
    if (projetoId === null) return;

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
  }, [projetoId]);

  // Enquanto o router não hidratou, `id` é undefined — não é erro, é espera.
  if (projetoId === null && router.isReady) {
    return (
      <AppLayout titulo="Projeto">
        <Aviso
          titulo="Endereço inválido."
          detalhe={`"${String(router.query.id)}" não é um identificador de projeto válido.`}
        />
      </AppLayout>
    );
  }

  if (estado.fase === "carregando") {
    return (
      <AppLayout titulo="Projeto">
        <p style={{ color: "#666" }}>Carregando…</p>
      </AppLayout>
    );
  }

  if (estado.fase === "erro") {
    return (
      <AppLayout titulo="Projeto">
        <Aviso titulo="Não foi possível carregar este projeto." detalhe={estado.mensagem} />
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
