import Link from "next/link";
import { AppLayout } from "../components/AppLayout";

export default function HomePage() {
  return (
    <AppLayout
      titulo="Paris Group Copilot"
      subtitulo="Copiloto de venture studio para discovery e execução de MVPs com IA."
    >
      <p style={{ color: "#444" }}>
        A estrutura segue o padrão do scaffolding do studio: rotas em <code>pages</code>,
        componentes em <code>components</code> e o contrato da API em <code>lib/api</code>.
      </p>
      <p>
        <Link href="/projects">Ver projetos →</Link>
      </p>
    </AppLayout>
  );
}
