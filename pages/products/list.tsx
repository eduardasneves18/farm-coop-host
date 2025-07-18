'use client';

import React, { useEffect, useState } from 'react';
import { ProductsFirebaseService } from '@/services/firebase/products/products_firebase';
import { UsersFirebaseService } from '@/services/firebase/users/user_firebase';

type Product = {
  id?: string;
  nome: string;
  quantidade_disponivel: number;
  unidade_medida: string;
  preco_venda: number;
};

type RawProduct = {
  id?: string;
  nome?: unknown;
  quantidade_disponivel?: unknown;
  unidade_medida?: unknown;
  preco_venda?: unknown;
};

const ListProductsScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserAndLoad = async () => {
      const usersService = new UsersFirebaseService();
      const productService = new ProductsFirebaseService();

      const user = await usersService.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const rawProducts: RawProduct[] = await productService.getProducts();

      const typedProducts: Product[] = rawProducts.map((p) => ({
        id: p.id,
        nome: typeof p.nome === 'string' ? p.nome : '',
        quantidade_disponivel: Number(p.quantidade_disponivel) || 0,
        unidade_medida: typeof p.unidade_medida === 'string' ? p.unidade_medida : '',
        preco_venda: Number(p.preco_venda) || 0,
      }));

      setProducts(typedProducts);
      setIsLoading(false);
    };

    checkUserAndLoad();
  }, []);

  if (isLoading) {
    return <div style={{ textAlign: 'center', marginTop: 40 }}>Carregando...</div>;
  }

  return (
    <div style={{ padding: 16, color: '#D5C1A1', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ fontSize: '1.5rem' }}>Produtos</h2>
      <div style={{ marginTop: 16 }}>
        {products.length === 0 ? (
          <div style={{ color: 'white', textAlign: 'center' }}>Nenhum produto encontrado.</div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              style={{
                backgroundColor: '#1e1e1e',
                borderRadius: 10,
                padding: 16,
                marginBottom: 12,
                color: 'white',
              }}
            >
              <h3 style={{ fontSize: '1.2rem', marginBottom: 8 }}>{product.nome}</h3>
              <p>
                Quantidade total: {product.quantidade_disponivel} {product.unidade_medida}
              </p>
              <p>Preço por unidade: R$ {product.preco_venda.toFixed(2)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListProductsScreen;
