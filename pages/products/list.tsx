'use client';

import React from 'react';
import { ProductsFirebaseService } from '@/services/firebase/products/products_firebase';
import { UsersFirebaseService } from '@/services/firebase/users/user_firebase';
import { Dashboard } from '../../components/coop-farm-components';

type Product = {
  id?: string;
  nome: string;
  quantidade_disponivel: number;
  unidade_medida: string;
  preco_venda: number;
};

type State = {
  products: Product[];
  isLoading: boolean;
  userChecked: boolean;
};

export default class ListProductsScreen extends React.Component<object, State> {
  private productService = new ProductsFirebaseService();
  private userService = new UsersFirebaseService();

  constructor(props: object) {
    super(props);
    this.state = {
      products: [],
      isLoading: true,
      userChecked: false,
    };
  }

  componentDidMount() {
    this.checkUser();
  }

  async checkUser() {
    const user = await this.userService.getUser();
    if (user) {
      this.setState({ userChecked: true });
      this.loadProducts();
    } else {
      console.warn('Usuário não autenticado');
      this.setState({ isLoading: false });
    }
  }

  async loadProducts() {
    try {
      const rawProducts = await this.productService.getProducts();
      const typedProducts: Product[] = rawProducts.map((p: any) => ({
        id: p.id,
        nome: typeof p.nome === 'string' ? p.nome : '',
        quantidade_disponivel: Number(p.quantidade_disponivel) || 0,
        unidade_medida: typeof p.unidade_medida === 'string' ? p.unidade_medida : '',
        preco_venda: Number(p.preco_venda) || 0,
      }));
      this.setState({ products: typedProducts, isLoading: false });
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { products, isLoading } = this.state;

    return (
      <Dashboard>
          <div className="header-extrato" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Lista de Produtos</h2>
          </div>
          <hr />

          {isLoading ? (
            <p style={{ color: 'white', textAlign: 'center' }}>Carregando produtos...</p>
          ) : (
            <div className="tabela-produtos" >
              {products.length > 0 ? (
                <table>
                  <thead>
                    <tr style={{ backgroundColor: '#2e2e2e', color: '#D5C1A1' }}>
                      <th>Nome</th>
                      <th>Quantidade</th>
                      <th>Unidade</th>
                      <th>Preço de Venda</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} style={{ borderBottom: '1px solid #444', color: 'white' }}>
                        <td style={{ padding: 8 }}>{product.nome}</td>
                        <td style={{ padding: 8 }}>{product.quantidade_disponivel}</td>
                        <td style={{ padding: 8 }}>{product.unidade_medida}</td>
                        <td style={{ padding: 8 }}>R$ {product.preco_venda.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ color: 'white' }}>Nenhum produto encontrado.</p>
              )}
            </div>
          )}
      </Dashboard>
    );
  }
}
