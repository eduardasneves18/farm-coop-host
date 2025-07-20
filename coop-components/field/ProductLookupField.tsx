'use client';

import React, { useEffect, useState } from 'react';
import { LookupField } from '../../components/coop-farm-components';
import { ProductsFirebaseService } from '@/services/firebase/products/products_firebase';
import { UsersFirebaseService } from '@/services/firebase/users/user_firebase';
import { Product } from '@/types/field/product/ProductFireldProps';


type Props = {
  id: string;
  label?: string;
  className?: string;
  value?: Product | null;
  onChange?: (produto: Product | null) => void;
};

const productService = new ProductsFirebaseService();
const usersService = new UsersFirebaseService();

const ProductLookupField: React.FC<Props> = ({
  id,
  label = 'Produto',
  className = '',
  value,
  onChange,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const user = await usersService.getUser();
      if (!user) {
        console.error('Usuário não autenticado');
        setLoading(false);
        return;
      }

      const data = await productService.getProducts();
      setProducts(data);
      setLoading(false);
    };

    load();
  }, []);

  const options = ['Selecione um produto', ...products.map((p) => p.nome)];
  const selectedName = value?.nome ?? '';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const found = products.find((p) => p.nome === e.target.value) || null;
    onChange(found?.nome === 'Selecione um produto' ? null : found);
  };

  return (
    <div className={className}>
      <LookupField
        id={id}
        label={label}
        options={options}
        value={selectedName}
        onChange={handleChange}
        className="w-full"
        placeholder="Selecione um produto"
      />
      {loading && <p className="text-sm text-gray-400 mt-1">Carregando produtos...</p>}
    </div>
  );
};

export default ProductLookupField;
