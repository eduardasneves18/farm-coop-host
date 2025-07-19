'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { TextField, NumberField, Dashboard } from '../../components/coop-farm-components';

import { SalesFirebaseService } from '@/services/firebase/sales/sales_firebase';
import { ProductsFirebaseService } from '@/services/firebase/products/products_firebase';
import { UserAuthChecker } from '@/utils/userAuthChecker';

interface Produto {
  id: string;
  nome: string;
  quantidade_disponivel: number;
  unidade_medida: string;
  preco_venda: number;
}

export default function RegisterSaleScreen() {
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
  }, [router]);

  const [produto, setProduto] = useState<Produto | null>(null);
  const [produtoId, setProdutoId] = useState<string>('');
  const [produtoNome, setProdutoNome] = useState<string>('');
  const [quantidade, setQuantidade] = useState<string>('');
  const [precoVenda, setPrecoVenda] = useState<string>('');
  const [valor, setValor] = useState<string>('');
  const [unidade, setUnidade] = useState<string>('');
  const [cliente, setCliente] = useState<string>('');
  const [formaPagamento, setFormaPagamento] = useState<string>('');

  const salesService = new SalesFirebaseService();
  const productsService = new ProductsFirebaseService();

  useEffect(() => {
    const q = parseFloat(quantidade);
    const preco = parseFloat(precoVenda);
    if (!isNaN(q) && !isNaN(preco)) {
      setValor((q * preco).toFixed(2));
    } else {
      setValor('');
    }
  }, [quantidade, precoVenda]);

const handleSubmit = async () => {
  const q = parseFloat(quantidade);
  const v = parseFloat(valor);

  if (
    !produtoId ||
    !produtoNome ||
    !cliente ||
    !unidade ||
    !formaPagamento ||
    isNaN(q) ||
    isNaN(v)
  ) {
    alert('Preencha todos os campos corretamente.');
    return;
  }

  try {
    await salesService.createSale({
      productId: produtoId,
      productName: produtoNome,
      quantity: q,
      value: v,
      unit: unidade,
      clientName: cliente,
      paymentMethod: formaPagamento,
    });

    const estoqueAtual = produto?.quantidade_disponivel ?? 0;
    const novoEstoque = estoqueAtual - q;
    await productsService.updateProductQuantity(produtoId, novoEstoque);

    alert('Venda registrada com sucesso!');

    setProduto(null);
    setProdutoId('');
    setProdutoNome('');
    setQuantidade('');
    setPrecoVenda('');
    setValor('');
    setUnidade('');
    setCliente('');
    setFormaPagamento('');
  } catch (err) {
    if (err instanceof Error) {
      alert(`Erro ao registrar venda: ${err.message}`);
    } else {
      alert('Erro desconhecido ao registrar venda.');
    }
  }
};

  if (!userChecked) return null;

  return (
    <Dashboard>
      <div className="header-extrato" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Cadastro de vendas</h2>
      </div>
      <hr /> 
      <div className="grid grid-cols-1 gap-4 mt-6">
        <TextField
          id="produto"
          label="Produto (temporário)"
          placeholder="ID do Produto"
          className="w-full"
          value={produtoId}
          required
          onChange={(e) => {
            const id = e.target.value;
            setProdutoId(id);
            setProdutoNome(id);
            // Opcional: buscar produto por ID
            // productsService.getProductById(id).then(p => setProduto(p));
          }}
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

        <NumberField
          id="valor"
          label="Valor da Venda (R$)"
          placeholder="0.00"
          className="w-full"
          value={valor}
          required
          onChange={() => {}}
        />

        <TextField
          id="cliente"
          label="Nome do Cliente"
          placeholder="Digite o nome"
          className="w-full"
          value={cliente}
          required
          onChange={(e) => setCliente(e.target.value)}
        />

        <TextField
          id="unidade"
          label="Unidade"
          placeholder="kg, l, g..."
          className="w-full"
          value={unidade}
          required
          onChange={(e) => setUnidade(e.target.value)}
        />

        <TextField
          id="formaPagamento"
          label="Forma de Pagamento"
          placeholder="Pix, Dinheiro, Cartão..."
          className="w-full"
          value={formaPagamento}
          required
          onChange={(e) => setFormaPagamento(e.target.value)}
        />

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
        Registrar
      </button>
      </div>
    </Dashboard>
  );
}
