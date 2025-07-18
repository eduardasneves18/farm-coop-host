import React, { useEffect, useState } from 'react';
import router from 'next/router';

import { UserAuthChecker } from '@/utils/userAuthChecker';
import { FirebaseServiceGeneric } from '@/services/firebase/FirebaseServiceGeneric';
import { UsersFirebaseService } from '@/services/firebase/users/user_firebase';

import { DateField, NumberField } from '../../components/coop-farm-components';

interface Product {
  productId: string;
  unidade_medida: string;
  [key: string]: unknown;
}

const statusOptions = ['Aguardando', 'Em Produção', 'Colhido'];

export default function RegisterProductionScreen() {
  const [userChecked, setUserChecked] = useState(false);

  const [produtoSelecionado, setProdutoSelecionado] = useState<Product | null>(null);
  const [quantidade, setQuantidade] = useState<string>('');
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<string | null>(null);
  const [dataEstimada, setDataEstimada] = useState<string>('');
  const [statusSelecionado, setStatusSelecionado] = useState<string | null>(null);

  const firebaseService = new FirebaseServiceGeneric();
  const usersService = new UsersFirebaseService();

  useEffect(() => {
    UserAuthChecker.check({
      onAuthenticated: () => setUserChecked(true),
      onUnauthenticated: () => {
        alert('Usuário não autenticado');
        router.push('/home');
      },
    });
  }, []);

  const limparCampos = () => {
    setProdutoSelecionado(null);
    setQuantidade('');
    setUnidadeSelecionada(null);
    setDataEstimada('');
    setStatusSelecionado(null);
  };

  const validarCampos = () => {
    return (
      produtoSelecionado &&
      quantidade &&
      parseFloat(quantidade) > 0 &&
      unidadeSelecionada &&
      statusSelecionado &&
      (statusSelecionado === 'Colhido' || dataEstimada)
    );
  };

  const salvarProducao = async () => {
    if (!validarCampos()) {
      alert('Preencha todos os campos obrigatórios corretamente.');
      return;
    }

    try {
      const user = await usersService.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      await firebaseService.create('productions', {
        usuario_id: user.uid,
        produto: produtoSelecionado?.productId,
        quantidade: parseFloat(quantidade),
        unidade: unidadeSelecionada,
        data_estimada: statusSelecionado === 'Colhido' ? null : dataEstimada,
        status: statusSelecionado,
        created_at: new Date().toISOString(),
      });

      alert('Produção registrada com sucesso!');
      limparCampos();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`Erro ao salvar produção: ${errorMessage}`);
    }
  };

  if (!userChecked) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div>Carregando...</div>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 600,
        margin: 'auto',
        padding: 20,
        color: '#D5C1A1',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#D5C1A1' }}>
        Registrar Produção
      </h1>

      <div style={{ marginBottom: 10 }}>
        <label style={{ color: '#D5C1A1', display: 'block', marginBottom: 4 }}>Produto</label>
        <select
          value={produtoSelecionado?.productId || ''}
          onChange={(e) => {
            const selectedId = e.target.value;
            const produto = selectedId ? { productId: selectedId, unidade_medida: 'kg' } : null;
            setProdutoSelecionado(produto);
            setUnidadeSelecionada(produto?.unidade_medida ?? null);
          }}
          style={{ width: '100%', padding: 8, borderRadius: 4, borderColor: '#4CAF50' }}
        >
          <option value="">Selecione o produto</option>
          <option value="prod1">Produto 1</option>
          <option value="prod2">Produto 2</option>
          <option value="prod3">Produto 3</option>
        </select>
      </div>

      <div style={{ marginBottom: 10 }}>
        <NumberField
          id="quantidade"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          label={`Quantidade${unidadeSelecionada ? ` (${unidadeSelecionada})` : ''}`}
          placeholder="Informe a quantidade"
          className=""
          required
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ color: '#D5C1A1', display: 'block', marginBottom: 4 }}>Unidade</label>
        <select
          value={unidadeSelecionada || ''}
          onChange={(e) => setUnidadeSelecionada(e.target.value)}
          style={{ width: '100%', padding: 8, borderRadius: 4, borderColor: '#4CAF50' }}
        >
          <option value="">Selecione a unidade</option>
          <option value="kg">kg</option>
          <option value="un">un</option>
          <option value="l">l</option>
        </select>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ color: '#D5C1A1', display: 'block', marginBottom: 4 }}>Status da Produção</label>
        <select
          value={statusSelecionado || ''}
          onChange={(e) => {
            const value = e.target.value;
            setStatusSelecionado(value);
            if (value === 'Colhido') setDataEstimada('');
          }}
          style={{ width: '100%', padding: 8, borderRadius: 4, borderColor: '#4CAF50' }}
        >
          <option value="">Selecione o status</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 30 }}>
        <DateField
          id="data-estimada"
          value={dataEstimada}
          onChange={(e) => setDataEstimada(e.target.value)}
          label="Data Estimada para Colheita"
          placeholder="Selecione a data"
          className=""
          required={statusSelecionado !== 'Colhido'}
        />
      </div>

      <button
        onClick={salvarProducao}
        style={{
          width: '100%',
          padding: '14px 0',
          backgroundColor: '#4CAF50',
          color: '#fff',
          border: 'none',
          borderRadius: 10,
          fontSize: 16,
          cursor: 'pointer',
        }}
      >
        Cadastrar Produção
      </button>
    </div>
  );
}
