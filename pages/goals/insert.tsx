'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { GoalsFirebaseService } from '@/services/firebase/goals/goals_firebase';
import { UsersFirebaseService } from '@/services/firebase/users/user_firebase';

import {
  TextField,
  NumberField,
  DateField,
  Dashboard,
} from '../../components/coop-farm-components';
import { UserAuthChecker } from '@/utils/userAuthChecker';

const goalService = new GoalsFirebaseService();
const userService = new UsersFirebaseService();

export default function InsertGoalScreen() {
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
  }, [router]); // Adiciona `router` nas dependências conforme o warning

  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');
  const [valor, setValor] = useState('');
  const [unidade, setUnidade] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [prazo, setPrazo] = useState('');
  const [produtoId, setProdutoId] = useState('');

  // Definindo um tipo específico para erro no catch para evitar `any`
  type ErrorWithMessage = {
    message: string;
  };

  const handleSalvar = async () => {
    if (!nome || !tipo || !valor || !unidade || !quantidade || !prazo || !produtoId) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const user = await userService.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      await goalService.createGoalItem({
        usuarioId: user.uid,
        nome,
        tipo,
        valor: parseFloat(valor),
        unidade,
        quantidade: parseFloat(quantidade),
        prazo,
        produto: produtoId,
      });

      alert('Meta registrada com sucesso!');

      // Resetar campos
      setNome('');
      setTipo('');
      setValor('');
      setUnidade('');
      setQuantidade('');
      setPrazo('');
      setProdutoId('');
    } catch (e) {
      // Faz um type guard para erro com mensagem
      const error = e as ErrorWithMessage;
      alert(`Erro ao salvar meta: ${error.message || 'Erro desconhecido'}`);
    }
  };

  if (!userChecked) return null;

  return (
    <Dashboard>
      <div className="header-extrato" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Controle de Metas</h2>
      </div>
      <hr />
      <div className="grid grid-cols-1 gap-4 mt-6">
        <TextField
          id="tipo"
          label="Tipo da Meta"
          placeholder="Ex: Produção ou Venda"
          className="w-full"
          value={tipo}
          required
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTipo(e.target.value)}
        />

        <TextField
          id="produto"
          label="Produto"
          placeholder="ID do Produto"
          className="w-full"
          value={produtoId}
          required
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProdutoId(e.target.value)}
        />

        <TextField
          id="nome"
          label="Nome da Meta"
          placeholder="Digite o nome da meta"
          className="w-full"
          value={nome}
          required
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNome(e.target.value)}
        />

        <NumberField
          id="valor"
          label="Valor da Meta (R$)"
          placeholder="0.00"
          className="w-full"
          value={valor}
          required
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValor(e.target.value)}
        />

        <div className="flex gap-4">
          <TextField
            id="unidade"
            label="Unidade"
            placeholder="kg, l, g, dz..."
            className="w-full"
            value={unidade}
            required
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUnidade(e.target.value)}
          />
          <NumberField
            id="quantidade"
            label="Quantidade"
            placeholder="0"
            className="w-full"
            value={quantidade}
            required
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuantidade(e.target.value)}
          />
        </div>

        <DateField
          id="prazo"
          label="Prazo"
          placeholder="Selecione a data"
          className="w-full"
          value={prazo}
          required
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrazo(e.target.value)}
        />

        <button
          onClick={handleSalvar}
          style={{
            marginTop: '1.5rem',
            padding: '0.8rem 1.2rem',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
          }}>
          Cadastrar Meta
        </button>
      </div>
    </Dashboard>
  );
}
