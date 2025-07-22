'use client';

import React, { useEffect, useState } from 'react';
import router from 'next/router';

import { UserAuthChecker } from '@/utils/auth/userAuthChecker';
import { FirebaseServiceGeneric } from '@/services/firebase/FirebaseServiceGeneric';
import { UsersFirebaseService } from '@/services/firebase/users/user_firebase';

import {
  DateField,
  NumberField,
  UnitLookupField,
  Dashboard,
  ProductLookupField,
  LookupField,
} from '../../components/coop-farm-components';
import { Product } from '@/types/field/product/ProductFireldProps';

const statusOptions = ['Aguardando', 'Em Produção', 'Colhido'];

export default function RegisterProductionScreen() {
  const [userChecked, setUserChecked] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantidade, setQuantidade] = useState('');
  const [unidadeSelecionada, setUnidadeSelecionada] = useState('');
  const [dataEstimada, setDataEstimada] = useState('');
  const [statusSelecionado, setStatusSelecionado] = useState('');

  const firebaseService = new FirebaseServiceGeneric();
  const usersService = new UsersFirebaseService();

  useEffect(() => {
    UserAuthChecker.check({
      onAuthenticated: () => setUserChecked(true),
      onUnauthenticated: () => {
        router.push('/user/login');
      },
    });
  }, []);

  const limparCampos = () => {
    setSelectedProduct(null);
    setQuantidade('');
    setUnidadeSelecionada('');
    setDataEstimada('');
    setStatusSelecionado('');
  };

  const validarCampos = () => {
    return (
      selectedProduct &&
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
        produto: selectedProduct?.productId,
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
      <div className="w-screen h-screen flex justify-center items-center">
        <div>Carregando...</div>
      </div>
    );
  }

  return (
    <Dashboard>
      <div>
        <h2>Registro de Produção</h2>
        <hr className="my-4" />

        <div className="">
          <ProductLookupField
            id="produto"
            value={selectedProduct}
            onChange={(p) => {
              setSelectedProduct(p);
              setUnidadeSelecionada(p?.unidade_medida ?? '');
            }}
            className="w-full"
          />

          <UnitLookupField
            id="unidade"
            value={unidadeSelecionada}
            onChange={(e) => setUnidadeSelecionada(e.target.value)}
            label="Unidade de Medida"
            className="w-full"
            placeholder='Selecione uma unidade de medida'
          />

          <NumberField
            id="quantidade"
            label={`Quantidade (${unidadeSelecionada || 'unidade'})`}
            placeholder="Informe a quantidade"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            className="w-full"
            required
          />

          <LookupField
            id="status"
            label="Status da Produção"
            options={statusOptions}
            value={statusSelecionado}
            onChange={(e) => {
              const value = e.target.value;
              setStatusSelecionado(value);
              if (value === 'Colhido') setDataEstimada('');
            }}
            className="w-full"
            placeholder="Selecione o status"
          />

          <DateField
            id="data-estimada"
            label="Data Estimada para Colheita"
            placeholder="Selecione a data"
            value={dataEstimada}
            onChange={(e) => setDataEstimada(e.target.value)}
            className="w-full"
            required={statusSelecionado !== 'Colhido'}
          />

          <button
            onClick={salvarProducao}
            style={{
              marginTop: '1rem',
              padding: '0.8rem 1.2rem',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
            }}
          >
            Registrar
          </button>
        </div>
      </div>
    </Dashboard>
  );
}
