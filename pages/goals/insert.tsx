'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import {
  TextField,
  NumberField,
  DateField,
  Dashboard,
  UnitLookupField,
  ProductLookupField,
  LookupField,
} from '../../components/coop-farm-components';

import { GoalsFirebaseService } from '@/services/firebase/goals/goals_firebase';
import { UsersFirebaseService } from '@/services/firebase/users/user_firebase';
import { UserAuthChecker } from '@/utils/auth/userAuthChecker';
import { Product } from '@/types/field/product/ProductFireldProps';

const goalService = new GoalsFirebaseService();
const userService = new UsersFirebaseService();
const goalsOptions = ['Venda', 'Produção']

export default function InsertGoalScreen() {
  const router = useRouter();
  const [userChecked, setUserChecked] = useState(false);

  useEffect(() => {
    UserAuthChecker.check({
      onAuthenticated: () => setUserChecked(true),
      onUnauthenticated: () => {
        alert('Usuário não autenticado');
        router.push('/user/login');
      },
    });
  }, [router]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');
  const [valor, setValor] = useState('');
  const [unidade, setUnidade] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [prazo, setPrazo] = useState('');

  useEffect(() => {
    const q = parseFloat(quantidade);
    const preco = selectedProduct?.preco_venda ?? NaN;

    if (!isNaN(q) && !isNaN(preco)) {
      setValor((q * preco).toFixed(2));
    } else {
      setValor('');
    }
  }, [quantidade, selectedProduct]);

  const handleSalvar = async () => {
    if (!nome || !tipo || !valor || !unidade || !quantidade || !prazo || !selectedProduct) {
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
        produto: selectedProduct.productId,
      });

      alert('Meta registrada com sucesso!');

      setSelectedProduct(null);
      setNome('');
      setTipo('');
      setValor('');
      setUnidade('');
      setQuantidade('');
      setPrazo('');
    } catch (e: any) {
      alert(`Erro ao salvar meta: ${e.message || 'Erro desconhecido'}`);
    }
  };

  if (!userChecked) return null;

  return (
    <Dashboard>
      <div
        className="header-extrato"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <h2>Cadastro de Meta</h2>
      </div>
      <hr />
      <div className="grid grid-cols-1 gap-4 mt-6">
        <LookupField
          id="tipo"
          label="Tipo da Meta"
          options={goalsOptions}
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="w-full"
          required
          placeholder="Selecione o tipo da meta"
        />

        <ProductLookupField
          id="produto"
          value={selectedProduct}
          onChange={(p) => {
            setSelectedProduct(p);
            setUnidade(p?.unidade_medida ?? '');
          }}
          className="w-full"
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

        <div className="flex gap-4">
          <UnitLookupField
            id="unidade"
            label="Unidade de Medida"
            className="w-full"
            value={unidade}
            onChange={() => {}}
            readOnly={true}
            placeholder='Selecione uma unidade de medida'
          />
          <NumberField
            id="quantidade"
            label={`Quantidade ${unidade ? `(${unidade})` : ''}`}
            placeholder="0"
            className="w-full"
            value={quantidade}
            required
            onChange={(e) => setQuantidade(e.target.value)}
          />
        </div>

        <NumberField
          id="valor"
          label="Valor da Meta (R$)"
          placeholder="0.00"
          className="w-full"
          value={valor}
          onChange={() => {}}
          readOnly={true}
          required
        />

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
          style={{
            marginTop: '1.5rem',
            padding: '0.8rem 1.2rem',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
          }}
        >
          Cadastrar Meta
        </button>
      </div>
    </Dashboard>
  );
}
