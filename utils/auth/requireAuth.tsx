import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { UserAuthChecker } from '@/utils/auth/userAuthChecker';

type RequireAuthProps = {
  children: React.ReactNode;
};

export default function RequireAuth({ children }: RequireAuthProps) {
  const router = useRouter();
  const [userChecked, setUserChecked] = useState(false);

  useEffect(() => {
    UserAuthChecker.check({
      onAuthenticated: () => setUserChecked(true),
      onUnauthenticated: () => {
        alert('Usuário não autenticado');
        router.push('/home');
      },
    });
  }, [router]);

  if (!userChecked) {
    return <div style={{ color: 'white', textAlign: 'center' }}>Carregando...</div>;
  }

  return <>{children}</>;
}
