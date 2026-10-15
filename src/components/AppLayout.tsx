import Link from "next/link";
import type { ReactNode } from "react";

interface AppLayoutProps {
  /** Título da página, exibido no cabeçalho e usado como h1. */
  titulo: string;
  /** Linha de apoio opcional, abaixo do título. */
  subtitulo?: string;
  children: ReactNode;
}

const NAVEGACAO: ReadonlyArray<{ href: string; rotulo: string }> = [
  { href: "/", rotulo: "Início" },
  { href: "/projects", rotulo: "Projetos" },
];

/**
 * Layout compartilhado das rotas do Copilot.
 *
 * A navegação vive aqui e em nenhum outro lugar: cada rota declara apenas o
 * próprio conteúdo. É o que impede o menu de divergir entre páginas.
 */
export function AppLayout({ titulo, subtitulo, children }: AppLayoutProps) {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
      <nav style={{ display: "flex", gap: 16, paddingBottom: 16, borderBottom: "1px solid #e5e5e5" }}>
        {NAVEGACAO.map((item) => (
          <Link key={item.href} href={item.href} style={{ color: "#444", textDecoration: "none" }}>
            {item.rotulo}
          </Link>
        ))}
      </nav>

      <header style={{ marginTop: 28, marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 28, letterSpacing: "-0.02em" }}>{titulo}</h1>
        {subtitulo ? (
          <p style={{ margin: "6px 0 0", color: "#666" }}>{subtitulo}</p>
        ) : null}
      </header>

      <main>{children}</main>
    </div>
  );
}
