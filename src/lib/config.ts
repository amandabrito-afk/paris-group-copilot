/**
 * Configuração da aplicação, lida do ambiente.
 *
 * Em produção, variável obrigatória ausente derruba o processo no boot com
 * mensagem descritiva — em vez de falhar silenciosamente em runtime, quando
 * já há usuário na frente.
 */

interface AppConfig {
  apiUrl: string;
  env: string;
  isProduction: boolean;
}

const OBRIGATORIAS_EM_PRODUCAO = ["NEXT_PUBLIC_API_URL"] as const;

function exigirEmProducao(env: string): void {
  if (env !== "production") return;

  const ausentes = OBRIGATORIAS_EM_PRODUCAO.filter(
    (nome) => !process.env[nome]
  );

  if (ausentes.length > 0) {
    throw new Error(
      `Configuração incompleta para produção. Variáveis ausentes: ${ausentes.join(", ")}. ` +
        `Defina-as no ambiente antes de subir. Ver .env.production.example para a lista documentada.`
    );
  }
}

function carregar(): AppConfig {
  const env = process.env.NODE_ENV ?? "development";
  exigirEmProducao(env);

  return {
    apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
    env,
    isProduction: env === "production",
  };
}

export const config: AppConfig = carregar();
