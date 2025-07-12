import { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import dynamic from 'next/dynamic';
import { Header } from 'generic-components-web';
export default function MyApp({ Component, pageProps }: AppProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Marca quando o componente está rodando no cliente
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && (
        <Header
          user="N"
          type="generic"
          userName="Eduarda Silva Neves"
          appTitlePrimary="CoopFarm"
        />
      )}
      <main style={{ padding: '2rem' }}>
        <Component {...pageProps} />
      </main>
    </>
  );
}
