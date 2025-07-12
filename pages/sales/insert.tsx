'use client';

import React, { useEffect, useState } from 'react';
import { Header, TextField, NumberField } from 'generic-components-web';
import { SalesFirebaseService } from '@/services/firebase/sales/sales_firebase';
import { ProductsFirebaseService } from '@/services/firebase/products/products_firebase';

export default function RegisterSaleScreen() {
  const [produto, setProduto] = useState<null>(null);
  const [produtoId, setProdutoId] = useState('');
  const [produtoNome, setProdutoNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [precoVenda, setPrecoVenda] = useState('');
  const [valor, setValor] = useState('');
  const [unidade, setUnidade] = useState('');
  const [cliente, setCliente] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('');

  const salesService = new SalesFirebaseService();
  const productsService = new ProductsFirebaseService();

  // Atualiza valor da venda automaticamente
  useEffect(() => {
    const q = parseFloat(quantidade);
    const preco = parseFloat(precoVenda);
    if (!isNaN(q) && !isNaN(preco)) {
      const total = q * preco;
      setValor(total.toFixed(2));
    } else {
      setValor('');
    }
  }, [quantidade, precoVenda]);

  const handleSubmit = async () => {
    const q = parseFloat(quantidade);
    const v = parseFloat(valor);
    if (!produtoId || !produtoNome || !cliente || !unidade || !formaPagamento || isNaN(q) || isNaN(v)) {
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

      const estoqueAtual = parseFloat(produto?.quantidade_disponivel?.toString() ?? '0') || 0;
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
      alert(`Erro ao registrar venda: ${err}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 text-white">

      <div className="grid grid-cols-1 gap-4 mt-6">
        {/* Substituir por LookupField de produtos */}
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

        {/* Substituir por LookupField de unidade */}
        <TextField
          id="unidade"
          label="Unidade"
          placeholder="kg, l, g..."
          className="w-full"
          value={unidade}
          required
          onChange={(e) => setUnidade(e.target.value)}
        />

        {/* Substituir por LookupField de pagamento */}
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
          className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
        >
          Registrar Venda
        </button>
      </div>
    </div>
  );
}
