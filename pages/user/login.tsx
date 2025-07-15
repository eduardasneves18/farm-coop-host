import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Cliente } from '@/models/cliente';
import Link from 'next/link';
import { DialogMessage } from '@/utils/dialog_message';
import { auth } from '@/FirebaseConfig';
import styles from './login.module.css';

import { SessionManager } from '@/services/firebase/sessions/sessionManager';
import clienteStore from '@/store/client_store';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState<{ title: string; message: string } | null>(null);
  const router = useRouter();

  const [sessionManager, setSessionManager] = React.useState<SessionManager | null>(null);

  const handleLogin = async () => {
    if (!email || !senha) {
      setDialog({ title: 'Erro', message: 'Por favor, preencha e-mail e senha.' });
      return;
    }

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(getAuth(app), email, senha);
      const user = userCredential.user;

      if (user && user.uid) {
        const cliente: Cliente = {
          id: user.uid,
          email: user.email || '',
          nome: user.displayName || '',
          password: '',
          primeiroNome: '',
          ultimoNome: '',
          toJson: function (): Record<string, any> {
            throw new Error('Function not implemented.');
          },
          toRegisterJson: function (): Record<string, any> {
            throw new Error('Function not implemented.');
          },
          toLoginJson: function (): Record<string, any> {
            throw new Error('Function not implemented.');
          }
        };

        clienteStore.defineCliente(cliente);
        const sm = new SessionManager(auth, cliente);
        setSessionManager(sm);

        router.replace('/home');
      } else {
        throw new Error('Usuário inválido.');
      }
    } catch (error) {
      setDialog({ title: 'Erro', message: 'Falha ao realizar o login. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    return () => {
      sessionManager?.dispose();
    };
  }, [sessionManager]);

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className={styles.iconContainer}>
          <span className={styles.icon}>🌱</span>
          <h1 className={styles.title}>FarmCoop</h1>
          <p className={styles.subtitle}>Faça seu login para continuar</p>
        </div>

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className={styles.input}
        />

        <div className={styles.registerLink}>
          Ainda não possui uma conta?{' '}
          <Link href="/user/register" className={styles.link}>
            Cadastre-se
          </Link>
        </div>

        <button onClick={handleLogin} disabled={loading} className={styles.button}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </div>

      {dialog && (
        <DialogMessage
          title={dialog.title}
          message={dialog.message}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  );
};

export default LoginScreen;
