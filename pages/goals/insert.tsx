'use client';

import React, { useState } from 'react';
import { GoalsFirebaseService } from '@/services/firebase/goals/goals_firebase';
import { UsersFirebaseService } from '@/services/firebase/users/user_firebase';

import {
  TextField,
  NumberField,
  DateField,
  Header,
} from 'generic-components-web';

const goalService = new GoalsFirebaseService();
const userService = new UsersFirebaseService();

export default function InsertGoalScreen() {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');
  const [valor, setValor] = useState('');
  const [unidade, setUnidade] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [prazo, setPrazo] = useState('');
  const [produtoId, setProdutoId] = useState('');

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
    } catch (e: any) {
      alert(`Erro ao salvar meta: ${e.message}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 text-white">

      <div className="grid grid-cols-1 gap-4 mt-6">
        <TextField
          id="tipo"
          label="Tipo da Meta"
          placeholder="Ex: Produção ou Venda"
          className="w-full"
          value={tipo}
          required
          onChange={(e) => setTipo(e.target.value)}
        />

        <TextField
          id="produto"
          label="Produto"
          placeholder="ID do Produto"
          className="w-full"
          value={produtoId}
          required
          onChange={(e) => setProdutoId(e.target.value)}
        />

        <TextField
          id="nome"
          label="Nome da Meta"
          placeholder="Digite o nome da meta"
          className="w-full"
          value={nome}
          required
          onChange={(e) => setNome(e.target.value)}
        />

        <NumberField
          id="valor"
          label="Valor da Meta (R$)"
          placeholder="0.00"
          className="w-full"
          value={valor}
          required
          onChange={(e) => setValor(e.target.value)}
        />

        <div className="flex gap-4">
          <TextField
            id="unidade"
            label="Unidade"
            placeholder="kg, l, g, dz..."
            className="w-full"
            value={unidade}
            required
            onChange={(e) => setUnidade(e.target.value)}
          />
          <NumberField
            id="quantidade"
            label="Quantidade"
            placeholder="0"
            className="w-full"
            value={quantidade}
            required
            onChange={(e) => setQuantidade(e.target.value)}
          />
        </div>

        <DateField
          id="prazo"
          label="Prazo"
          placeholder="Selecione a data"
          className="w-full"
          value={prazo}
          required
          onChange={(e) => setPrazo(e.target.value)}
        />

        <button
          onClick={handleSalvar}
          className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
        >
          Cadastrar Meta
        </button>
      </div>
    </div>
  );
}
