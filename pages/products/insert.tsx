'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  TextField,
  NumberField,
  UnitLookupField,
} from '../../components/coop-farm-components';

import { ProductsFirebaseService } from '@/services/firebase/products/products_firebase';
import { UserAuthChecker } from '@/utils/auth/userAuthChecker';

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
  }, [router]);

  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [costPrice, setCostPrice] = useState<number | ''>('');
  const [sellPrice, setSellPrice] = useState<number | ''>('');
  const [profitMargin, setProfitMargin] = useState<string>('');
  const [profitValue, setProfitValue] = useState<number>(0);

  const productService = new ProductsFirebaseService();

  const calculateProfit = (cost: number, sell: number) => {
    if (!cost || !sell || cost <= 0) {
      setProfitMargin('');
      setProfitValue(0);
      return;
    }

    const profit = sell - cost;
    const margin = (profit / cost) * 100;

    setProfitValue(profit);
    setProfitMargin(`${margin.toFixed(2)} %`);
  };

  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setCostPrice(value);
    if (sellPrice !== '') {
      calculateProfit(value, Number(sellPrice));
    }
  };

  const handleSellChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setSellPrice(value);
    if (costPrice !== '') {
      calculateProfit(Number(costPrice), value);
    }
  };

  const validateForm = () => {
    if (!name.trim()) {
      alert('O nome do produto é obrigatório.');
      return false;
    }

    if (!unit || unit.trim() === '') {
      alert('Selecione uma unidade de medida.');
      return false;
    }

    if (quantity === '' || Number(quantity) <= 0) {
      alert('Informe uma quantidade válida.');
      return false;
    }

    if (costPrice === '' || Number(costPrice) <= 0) {
      alert('Informe um preço de custo válido.');
      return false;
    }

    if (sellPrice === '' || Number(sellPrice) <= 0) {
      alert('Informe um preço de venda válido.');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {

    try {
      const percentual = parseFloat(profitMargin.replace('%', '').trim()) || 0;

      if (!validateForm()) return;
      
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
      <div
        className="header-extrato"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
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

      <UnitLookupField
        id="unidade"
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
        placeholder='Selecione uma unidade de medida'
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
        label={`Preço de Custo${unit ? ` por ${unit}` : ''}`}
        placeholder="Digite o preço de custo"
        value={costPrice}
        onChange={handleCostChange}
        className="field"
      />

      <NumberField
        id="sellPrice"
        label={`Preço de Venda${unit ? ` por ${unit}` : ''}`}
        placeholder="Digite o preço de venda"
        value={sellPrice}
        onChange={handleSellChange}
        className="field"
      />

      <TextField
        id="profitMargin"
        label="Margem de Lucro (%)"
        placeholder="Lucro calculado"
        value={profitMargin}
        className="field" 
        onChange={(e) => setProfitMargin(e.target.value)}      />

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
