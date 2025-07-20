import { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import '../styles/components.global.css';
import { Header, Menu, Dashboard } from '../components/coop-farm-components';
import RequireAuth from '@/utils/auth/requireAuth';

const publicRoutes = ['/user/login', '/user/insert'];

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const menuItems = [
    { label: 'Página inicial', path: '/home' },
    { label: 'Cadastro de produtos', path: '/products/insert' },
    { label: 'Lista de produtos', path: '/products/list' },
    { label: 'Registro de produção', path: '/production/insert' },
    { label: 'Controle da produção', path: '/production/list' },
    { label: 'Cadastro de metas', path: '/goals/insert' },
    { label: 'Gestão de metas', path: '/goals/list' },
    { label: 'Cadastro de vendas', path: '/sales/insert' },
    { label: 'Lista de vendas', path: '/sales/list' },
  ];

  const isPublicRoute = publicRoutes.includes(router.pathname);

  return (
    <>
      <div>
        {isClient && (
          <Header
            user="N"
            type="generic"
            userName="Eduarda Silva Neves"
            appTitlePrimary="CoopFarm"
          />
        )}
        <div className="central-content">
          {!isPublicRoute && <Menu items={menuItems} />}
          <main>
            <Dashboard>
              {isPublicRoute ? (
                <Component {...pageProps} />
              ) : (
                <RequireAuth>
                  <Component {...pageProps} />
                </RequireAuth>
              )}
            </Dashboard>
          </main>
        </div>
      </div>
    </>
  );
}
