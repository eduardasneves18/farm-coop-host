'use client';

import { GoalsFirebaseService } from '@/services/firebase/goals/goals_firebase';
import { ProductionFirebaseService } from '@/services/firebase/production/production_firebase';
import { ProductsFirebaseService } from '@/services/firebase/products/products_firebase';
import { SalesFirebaseService } from '@/services/firebase/sales/sales_firebase';
import { UserAuthChecker } from '@/utils/auth/userAuthChecker';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const goalsService = new GoalsFirebaseService();
const salesService = new SalesFirebaseService();
const productionService = new ProductionFirebaseService();
const productService = new ProductsFirebaseService();

type Meta = {
  id?: string;
  nome?: string;
  tipo: string;
  produto: string;
  valor: number;
  valor_atual: number;
  unidade: string;
  prazo: string;
  timestamp: string;
  nome_produto?: string;
  quantidade?: number;
};

const ListGoalsScreen: React.FC = () => {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userChecked, setUserChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    UserAuthChecker.check({
      onAuthenticated: () => {
        setUserChecked(true);
        loadMetas();
      },
      onUnauthenticated: () => {
        router.push('/user/login');
      },
    });
  }, [router]);

  const loadMetas = async () => {
    try {
      const metasRaw = await goalsService.getGoalItems();

      const metasCompletas = await Promise.all(
        metasRaw.map(async (meta) => {
          let valorAtual: number | string | null = null;

          if (meta.tipo === 'Venda') {
            valorAtual = await salesService.getSalesProps(meta.produto, 'valor');
          } else {
            valorAtual = await productionService.getProductionProp(meta.produto, 'quantidade');
          }

          const productName = await productService.getProductsProps(meta.produto, 'nome');

          return {
            ...meta,
            nome_produto: productName,
            valor_atual: typeof valorAtual === 'number'
              ? valorAtual
              : Number(valorAtual) || 0,
            valor: Number(meta.valor) || 0,
          };
        })
      );

      setMetas(metasCompletas);
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (meta: Meta) => {
    const valorAtual = meta.valor_atual ?? 0;
    const metaAlvo = meta.tipo === 'Venda' ? (meta.valor ?? 0) : (meta.quantidade ?? 0);

    if (valorAtual >= metaAlvo) return 'green';
    if (valorAtual > 0) return 'orange';
    return 'red';
  };

  if (!userChecked || isLoading) {
    return <div style={{ textAlign: 'center' }}>Carregando...</div>;
  }

  if (metas.length === 0) {
    return <div style={{ textAlign: 'center' }}>Nenhuma meta cadastrada.</div>;
  }

  return (
    <div style={{ padding: 16, color: '#D5C1A1', fontFamily: 'Arial, sans-serif' }}>
      <h2>Metas Cadastradas</h2>
      <div style={{ marginTop: 16 }}>
        {metas.map((meta) => {
          const statusColor = getStatusColor(meta);
          const metaAlvo = meta.tipo === 'Venda'
            ? meta.valor.toFixed(2)
            : (meta.quantidade ?? 0).toFixed(2);
          const atual = (meta.valor_atual ?? 0).toFixed(2);

          return (
            <div
              key={meta.id}
              style={{
                border: `2px solid ${statusColor}`,
                borderRadius: 12,
                padding: 12,
                marginBottom: 12,
                backgroundColor: '#333',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <strong>{meta.nome}</strong>
                <div style={{ fontSize: 14, color: '#ccc' }}>
                  Tipo: {meta.tipo}
                  <br />
                  Poduto: {meta.nome_produto}
                  <br />
                  Meta: {meta.valor} - {meta.quantidade} {meta.unidade} | Atual: {atual}
                  <br />
                  Prazo: {meta.prazo}
                </div>
              </div>
              <div style={{ fontSize: 24, color: statusColor }}>
                🚩
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListGoalsScreen;
