'use client';

import React, { useEffect, useState } from 'react';
import {
  TextField,
  NumberField,
  Dashboard,
  UnitLookupField,
  ProductLookupField,
  DateField,
} from '../../components/coop-farm-components';

import { SalesFirebaseService } from '@/services/firebase/sales/sales_firebase';
import { ProductsFirebaseService } from '@/services/firebase/products/products_firebase';
import { Product } from '@/types/field/product/ProductFireldProps';
import { format } from 'date-fns';
import { GoalsFirebaseService } from '@/services/firebase/goals/goals_firebase';

export default function RegisterSaleScreen() {

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantidade, setQuantidade] = useState<string>('');
  const [valor, setValor] = useState<string>('');
  const [unit, setUnit] = useState<string>('');
  const [cliente, setCliente] = useState<string>('');
  const [formaPagamento, setFormaPagamento] = useState<string>('');
  const [dataVenda, setDataVenda] = useState<string>(() =>
    format(new Date(), 'yyyy-MM-dd')
  );

  const salesService = new SalesFirebaseService();
  const goalService = new GoalsFirebaseService();
  const productsService = new ProductsFirebaseService();

  useEffect(() => {
    const q = parseFloat(quantidade);
    const preco = selectedProduct?.preco_venda ?? NaN;

    if (!isNaN(q) && !isNaN(preco)) {
      setValor((q * preco).toFixed(2));
    } else {
      setValor('');
    }
  }, [quantidade, selectedProduct]);

  const handleSubmit = async () => {
    const q = parseFloat(quantidade);
    const v = parseFloat(valor);

    if (
      !selectedProduct ||
      !cliente ||
      !unit ||
      !formaPagamento ||
      !dataVenda ||
      isNaN(q) ||
      isNaN(v)
    ) {
      alert('Preencha todos os campos corretamente.');
      return;
    }

    try {
      await salesService.createSale({
        productId: selectedProduct.productId,
        productName: selectedProduct.nome,
        quantity: q,
        value: v,
        unit: unit,
        clientName: cliente,
        paymentMethod: formaPagamento,
        date: dataVenda,
      });

      await goalService.VerifyGoals(selectedProduct.productId, v, dataVenda);

      const estoqueAtual = selectedProduct.quantidade_disponivel ?? 0;
      const novoEstoque = estoqueAtual - q;
      await productsService.updateProductQuantity(selectedProduct.productId, novoEstoque);

      alert('Venda registrada com sucesso!');

      setSelectedProduct(null);
      setQuantidade('');
      setValor('');
      setUnit('');
      setCliente('');
      setFormaPagamento('');
      setDataVenda(format(new Date(), 'yyyy-MM-dd'));
    } catch (err) {
      if (err instanceof Error) {
        alert(`Erro ao registrar venda: ${err.message}`);
      } else {
        alert('Erro desconhecido ao registrar venda.');
      }
    }
  };

  return (
    <Dashboard>
      <div
        className="header-extrato"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <h2>Cadastro de vendas</h2>
      </div>
      <hr />
      <div className="grid grid-cols-1 gap-4 mt-6">
        <ProductLookupField
          id="produto"
          value={selectedProduct}
          onChange={(p) => {
            setSelectedProduct(p);
            setUnit(p?.unidade_medida ?? '');
            setQuantidade('');
          }}
          className="w-full"
        />

        <NumberField
          id="quantidade"
          label={`Quantidade ${unit ? `(${unit})` : ''}`}
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
          readOnly={true}
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

        <UnitLookupField
          id="unidade"
          value={unit}
          onChange={() => {}}
          readOnly={true}
          placeholder='Selecione uma unidade de medida'
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

        <DateField
          id="data-venda"
          label="Data da Venda"
          placeholder="Selecione a data"
          value={dataVenda}
          onChange={(e) => setDataVenda(e.target.value)}
          className="w-full"
          required
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
