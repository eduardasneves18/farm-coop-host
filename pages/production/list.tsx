// components/ProductionTable.tsx

import { ProductionFirebaseService } from "@/services/firebase/production/production_firebase";
import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

type ProductionItem = {
  id?: string;
  produto: string;
  quantidade: number;
  unidade_medida: string;
  status: string;
  data_estimativa_colheita: string;
  timestamp: string;
};

const productionService = new ProductionFirebaseService();

const ProductionTable: React.FC = () => {
  const [data, setData] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduction = async () => {
      try {
        const items: ProductionItem[] = await productionService.getProductionItems();

        const tableData = [
          [
            "Produto",
            "Quantidade",
            "Unidade de Medida",
            "Status",
            "Data Estimada de Colheita",
            "Data de Criação",
          ],
          ...items.map((item) => [
            item.produto,
            item.quantidade,
            item.unidade_medida,
            item.status,
            item.data_estimativa_colheita,
            new Date(item.timestamp).toLocaleString("pt-BR"),
          ]),
        ];

        setData(tableData);
      } catch (e) {
        console.error("Erro ao carregar itens de produção:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchProduction();
  }, []);

  if (loading) return <p>Carregando dados...</p>;

  return (
    <>
      <div className="header-extrato" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Controle de produção</h2>
      </div>
      <hr />
      <div className="production-table-container">
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
      </div>
    </>
    
  );
};

export default ProductionTable;
