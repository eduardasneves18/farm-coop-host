'use client';

import { ProductionFirebaseService } from "@/services/firebase/production/production_firebase";
import { ProductsFirebaseService } from "@/services/firebase/products/products_firebase";
import { Dashboard } from "../../components/coop-farm-components";
import { UserAuthChecker } from "@/utils/auth/userAuthChecker";

import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { useRouter } from "next/router";

type ProductionItem = {
  id?: string;
  produto: string;
  quantidade: number;
  unidadeMedida: string;
  status: string;
  dataEstimadaColheita: string;
  timestamp: string;
};

const productionService = new ProductionFirebaseService();
const productService = new ProductsFirebaseService();

const ProductionTable: React.FC = () => {
  const [data, setData] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [userChecked, setUserChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    UserAuthChecker.check({
      onAuthenticated: () => {
        setUserChecked(true);
        fetchProduction();
      },
      onUnauthenticated: () => {
        alert("Usuário não autenticado");
        router.push("/user/login");
      },
    });
  }, [router]);

  const fetchProduction = async () => {
    try {
      const items: ProductionItem[] = await productionService.getProductionItems();

      const rows = await Promise.all(
        items.map(async (item) => {
          const productName = await productService.getProductsProps(item.produto, "nome");

          return [
            productName,
            item.quantidade,
            item.unidadeMedida,
            item.status,
            new Date(item.dataEstimadaColheita).toLocaleDateString("pt-BR"),
            new Date(item.timestamp).toLocaleDateString("pt-BR"),
          ];
        })
      );

      const tableData = [
        [
          "Produto",
          "Quantidade",
          "Unidade de Medida",
          "Status",
          "Data Estimada de Colheita",
          "Data de Criação",
        ],
        ...rows,
      ];

      setData(tableData);
    } catch (e) {
      console.error("Erro ao carregar itens de produção:", e);
    } finally {
      setLoading(false);
    }
  };

  if (!userChecked || loading) return <p style={{ textAlign: 'center' }}>Carregando dados...</p>;

  return (
    <Dashboard>
      <div className="header-extrato" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Controle de produção</h2>
      </div>
      <hr />

      <div className="production-table-container" style={{ marginTop: 16 }}>
        {data.length > 1 ? (
          <Chart
            chartType="Table"
            width="100%"
            height="auto"
            data={data}
            options={{
              showRowNumber: true,
              allowHtml: true,
              sortColumn: 5,
              sortAscending: false,
              cssClassNames: {
                tableCell: "table-cell",
                headerRow: "table-header",
                headerCell: "table-header-cell",
                rowNumberCell: "row-number-cell",
              },
            }}
          />
        ) : (
          <p style={{ color: "white", marginTop: "1rem" }}>Nenhum dado disponível.</p>
        )}
      </div>
    </Dashboard>
  );
};

export default ProductionTable;
