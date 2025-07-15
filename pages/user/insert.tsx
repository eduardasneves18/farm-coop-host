import React, { useState } from 'react';
import { useRouter } from 'next/router';

import { TextField, PasswordField } from 'generic-components-web';
import { UsersFirebaseService } from '@/services/firebase/users/user_firebase';

interface UserRegisterProps {}

export default function UserRegister(props: UserRegisterProps) {
  const router = useRouter();
  const usersFirebaseService = new UsersFirebaseService();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');

  const validarCampos = () => {
    if (!name.trim()) {
      alert('Por favor, digite seu nome.');
      return false;
    }
    if (!email.trim()) {
      alert('Por favor, digite seu e-mail.');
      return false;
    }
    if (!senha) {
      alert('Por favor, digite sua senha.');
      return false;
    }
    if (!confirmSenha) {
      alert('Por favor, confirme sua senha.');
      return false;
    }
    if (senha !== confirmSenha) {
      alert('As senhas não coincidem.');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validarCampos()) return;

    try {
      await usersFirebaseService.createUser(name.trim(), email.trim(), senha);
      router.push('/home');
    } catch (error) {
      alert('Falha ao criar o usuário. Tente novamente.');
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#121212',
        minHeight: '100vh',
        padding: '5vw 15px',
        color: '#D5C1A1',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      onClick={() => {
        (document.activeElement as HTMLElement)?.blur();
      }}
    >
      <div style={{ marginBottom: 40, textAlign: 'center' }}>
        <h1 style={{ fontSize: '3vw', fontWeight: 'bold', color: '#4CAF50', margin: 0 }}>Faça seu cadastro!</h1>
      </div>

      <div style={{ width: '100%', maxWidth: 400 }}>
        <TextField
          value={name}
          onChange={(e) => setName(e.target.value)}
          labelColor="#4CAF50"
          iconColor="#D5C1A1"
          hint="Nome"
          hintColor="#D5C1A1"
          fillColor="transparent"
          cursorColor="#FFFFFF"
          borderColor="#4CAF50"
          textColor="#D5C1A1"
          iconName="person"
          textType="text"
          style={{ marginTop: 16 }}
        />

        <TextField
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          labelColor="#4CAF50"
          iconColor="#D5C1A1"
          hint="E-mail"
          hintColor="#D5C1A1"
          fillColor="transparent"
          cursorColor="#FFFFFF"
          borderColor="#4CAF50"
          textColor="#D5C1A1"
          iconName="email"
          textType="email"
          style={{ marginTop: 16 }}
        />

        <PasswordField
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          labelColor="#4CAF50"
          iconColor="#D5C1A1"
          hint="Senha"
          hintColor="#D5C1A1"
          fillColor="transparent"
          cursorColor="#FFFFFF"
          borderColor="#4CAF50"
          textColor="#D5C1A1"
          style={{ marginTop: 16 }}
        />

        <PasswordField
          value={confirmSenha}
          onChange={(e) => setConfirmSenha(e.target.value)}
          labelColor="#4CAF50"
          iconColor="#D5C1A1"
          hint="Confirmar senha"
          hintColor="#D5C1A1"
          fillColor="transparent"
          cursorColor="#FFFFFF"
          borderColor="#4CAF50"
          textColor="#D5C1A1"
          style={{ marginTop: 16 }}
        />

        <button
          onClick={handleRegister}
          style={{
            marginTop: '2vw',
            width: '100%',
            padding: '14px 0',
            backgroundColor: '#3E513F',
            color: '#F0F0F0',
            border: 'none',
            borderRadius: 18,
            fontSize: 16,
            cursor: 'pointer',
          }}
        >
          Cadastrar
        </button>

        <button
          onClick={() => router.back()}
          style={{
            marginTop: '3vw',
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: 32,
            cursor: 'pointer',
            textAlign: 'left',
          }}
          aria-label="Voltar"
        >
          ← Voltar
        </button>
      </div>
    </div>
  );
}
