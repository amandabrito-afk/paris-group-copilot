import type { AppProps } from "next/app";

/** Raiz do Pages Router. Ponto único para estilos globais e provedores. */
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
