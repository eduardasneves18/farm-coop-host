import { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import '../styles/components.global.css';
import { Header, Menu, Dashboard} from '../components/coop-farm-components';

const noLayoutRoutes = ['/user/login', '/user/insert'];

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

  const isNoLayout = noLayoutRoutes.includes(router.pathname);

  if (isNoLayout) {
    return ( <>
        <Header
          user="N"
          type="generic"
          userName="Eduarda Silva Neves"
          appTitlePrimary="CoopFarm" />
        <Dashboard>
          <Component {...pageProps} />
        </Dashboard>
      </>
    );
  }

  return (
    <>
    <div>
      <div>
        {isClient && (
          <Header
            user="N"
            type="generic"
            userName="Eduarda Silva Neves"
            appTitlePrimary="CoopFarm"
          />
        )}
      </div>
      <div className='central-content'>
        <Menu items={menuItems} />
        <main>
          <Dashboard>
            <Component {...pageProps} />
          </Dashboard>
        </main>
      </div>
    </div>
    </>
  );
}
