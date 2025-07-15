import { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import '../styles/globals.css';

import { Header, Menu } from 'generic-components-web';
import NextLink from 'next/link';

const noLayoutRoutes = ['/user/login', '/user/register'];

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const menuItems = [
    { label: 'Página inicial', path: '/' },
    { label: 'Extrato', path: '/statement' },
    { label: 'Cartões', path: '/products/insert' },
  ];

  const isNoLayout = noLayoutRoutes.includes(router.pathname);

  if (isNoLayout) {
    return <Component {...pageProps} />;
  }

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
      <Menu items={menuItems} LinkComponent={NextLink} />
      <main style={{ padding: '2rem' }}>
        <Component {...pageProps} />
      </main>
    </>
  );
}
