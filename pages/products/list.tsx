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

const ListProductsScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userChecked, setUserChecked] = useState(false);

  const productService = new ProductsFirebaseService();
  const usersService = new UsersFirebaseService();

  useEffect(() => {
    const checkUserAndLoad = async () => {
      const user = await usersService.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      setUserChecked(true);
      const data = await productService.getProducts();
      setProducts(data);
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
          products.map((product, index) => (
            <div
              key={index}
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
              <p>Preço por unidade: R$ {product.preco_venda?.toFixed(2)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListProductsScreen;
