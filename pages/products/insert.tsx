'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  TextField,
  NumberField,
} from '../../components/coop-farm-components';

import { ProductsFirebaseService } from '@/services/firebase/products/products_firebase';
import { UserAuthChecker } from '@/utils/userAuthChecker';

const InsertProductScreen: React.FC = () => {
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
  }, [router]); // ✅ Correção: adiciona router como dependência

  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [costPrice, setCostPrice] = useState<number | ''>('');
  const [sellPrice, setSellPrice] = useState<number | ''>('');
  const [profitMargin, setProfitMargin] = useState<string>('');
  const [profitValue, setProfitValue] = useState<number>(0);

  const productService = new ProductsFirebaseService();

  const handleProfitCalc = () => {
    const cost = typeof costPrice === 'string' ? parseFloat(costPrice) : costPrice;
    const sell = typeof sellPrice === 'string' ? parseFloat(sellPrice) : sellPrice;

    if (!cost || !sell || cost <= 0) {
      setProfitMargin('');
      setProfitValue(0);
      return;
    }

    const profit = sell - cost;
    const margin = (profit / cost) * 100;

    setProfitMargin(`${margin.toFixed(2)} %`);
    setProfitValue(profit);
  };

  const handleSubmit = async () => {
    if (!name || !unit || quantity === '' || costPrice === '' || sellPrice === '') {
      alert('Preencha todos os campos corretamente.');
      return;
    }

    try {
      const percentual = parseFloat(profitMargin.replace('%', '').trim()) || 0;

      await productService.createProduct({
        nome: name,
        unidadeMedida: unit,
        quantidadeDisponivel: Number(quantity),
        precoCusto: Number(costPrice),
        precoVenda: Number(sellPrice),
        lucro: profitValue,
        percentualLucro: percentual,
      });

      alert('Produto cadastrado com sucesso!');


      setName('');
      setUnit('');
      setQuantity('');
      setCostPrice('');
      setSellPrice('');
      setProfitMargin('');
      setProfitValue(0);
    } catch (e: unknown) {
      const error = e as Error;
      console.error(error);
      alert('Erro ao cadastrar produto: ' + error.message);
    }
  };

  if (!userChecked) return null;

  return (
    <div>
      <div className="header-extrato" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Cadastro de produtos</h2>
      </div>
      <hr />

      <TextField
        id="name"
        label="Nome do Produto"
        placeholder="Digite o nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="field"
      />

      <TextField
        id="unit"
        label="Unidade de Medida"
        placeholder="Ex: kg, l, un"
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
        className="field"
      />

      <NumberField
        id="quantity"
        label="Quantidade"
        placeholder="Digite a quantidade"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="field"
      />

      <NumberField
        id="costPrice"
        label="Preço de Custo"
        placeholder="Digite o preço de custo"
        value={costPrice}
        onChange={(e) => {
          setCostPrice(Number(e.target.value));
          handleProfitCalc();
        }}
        className="field"
      />

      <NumberField
        id="sellPrice"
        label="Preço de Venda"
        placeholder="Digite o preço de venda"
        value={sellPrice}
        onChange={(e) => {
          setSellPrice(Number(e.target.value));
          handleProfitCalc();
        }}
        className="field"
      />

      <TextField
        id="profitMargin"
        label="Margem de Lucro (%)"
        placeholder="Lucro calculado"
        value={profitMargin}
        className="field" onChange={function (): void {
          throw new Error('Function not implemented.');
        } }      />

      <button
        onClick={handleSubmit}
        style={{
          marginTop: '1.5rem',
          padding: '0.8rem 1.2rem',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
        }}
      >
        Cadastrar Produto
      </button>
    </div>
  );
};

export default InsertProductScreen;
