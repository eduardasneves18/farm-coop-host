import React, { useState } from 'react';
import { useRouter } from 'next/router';

import { TextField, PasswordField } from '../../components/coop-farm-components';;
import { UsersFirebaseService } from '@/services/firebase/users/user_firebase';

export default function UserRegister() {
  const router = useRouter();
  const usersFirebaseService = new UsersFirebaseService();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');

  function validarCampos() {
    if (!name.trim()) return false;
    if (!email.trim()) return false;
    if (!senha) return false;
    if (!confirmSenha) return false;
    if (senha !== confirmSenha) return false;
    return true;
  }

  async function handleRegister() {
    if (!validarCampos()) {
      alert('Verifique os campos e tente novamente.');
      return;
    }

    try {
      await usersFirebaseService.createUser(name.trim(), email.trim(), senha);
      router.push('/home');
    } catch {
      alert('Falha ao criar o usuário. Tente novamente.');
    }
  }

  return (
    <div style={{
      padding: '5vw 15px',
      color: '#D5C1A1',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}> 
      <h1 style={{
        fontSize: '3vw',
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 40,
      }}>
        Faça seu cadastro!
      </h1>

      <div style={{ width: '100%', maxWidth: 400 }}>
        <TextField
          id="name"
          value={name}
          className="w-full"
          placeholder="Nome"
          label="Nome"
          onChange={(e) => setName(e.target.value)}
          required
        />

        <TextField
          id="email"
          value={email}
          className="w-full"
          placeholder="E-mail"
          label="E-mail"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <PasswordField
          id="senha"
          value={senha}
          className="w-full"
          placeholder="Senha"
          label="Senha"
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <PasswordField
          id="confirmSenha"
          value={confirmSenha}
          className="w-full"
          placeholder="Confirmar senha"
          label="Confirmar senha"
          onChange={(e) => setConfirmSenha(e.target.value)}
          required
        />

        <button
          onClick={handleRegister}
          style={{
            marginTop: '2vw',
            width: '100%',
            padding: '14px 0',
            backgroundColor: '#4CAF50',
            color: '#F0F0F0',
            border: 'none',
            borderRadius: 18,
            fontSize: 16,
            cursor: 'pointer',
          }}>
          Cadastrar
        </button>

        <button
          onClick={() => router.back()}
          style={{
            marginTop: '3vw',
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: 20,
            cursor: 'pointer',
            textAlign: 'left',
          }}
          aria-label="Voltar">
          ← Voltar
        </button>
      </div>
    </div>
  );
}
