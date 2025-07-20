'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Chart } from "react-google-charts";

import { SalesFirebaseService } from "@/services/firebase/sales/sales_firebase";
import { UsersFirebaseService } from "@/services/firebase/users/user_firebase";
import { ProductsFirebaseService } from "@/services/firebase/products/products_firebase";
import { UserAuthChecker } from "@/utils/auth/userAuthChecker";
import { Dashboard } from "../../components/coop-farm-components";

type SaleItem = {
  product_name: string;
  product_id: string;
  client_name: string;
  quantity: number;
  unit: string;
  value: number;
  date: string;
};

const ListSalesByProfit: React.FC = () => {
  const [data, setData] = useState<any[][]>([]);
  const [loading, setLoading] = useState(true);
  const [userChecked, setUserChecked] = useState(false);

  const router = useRouter();

  const salesService = new SalesFirebaseService();
  const usersService = new UsersFirebaseService();
  const productService = new ProductsFirebaseService();

  useEffect(() => {
    UserAuthChecker.check({
      onAuthenticated: () => {
        setUserChecked(true);
        loadSales();
      },
      onUnauthenticated: () => {
        alert("Usuário não autenticado");
        router.push("/user/login");
      },
    });
  }, [router]);

  const loadSales = async () => {
    try {
      const user = await usersService.getUser();
      if (!user?.uid) return;

      const sales: SaleItem[] = await salesService.getSales();

      sales.sort((a, b) => {
        const lucroA = (a.quantity ?? 0) * (a.value ?? 0);
        const lucroB = (b.quantity ?? 0) * (b.value ?? 0);
        return lucroB - lucroA;
      });

      const tableRows = await Promise.all(
        sales.map(async (sale) => {
          const costPrice = await productService.getProductsProps(sale.product_id, 'preco_custo');
          const lucroTotal = (sale.value ?? 0) - ((sale.quantity ?? 0) * (costPrice ?? 0));
          return [
            sale.product_name ?? "",
            `${sale.quantity ?? 0} ${sale.unit ?? ""}`,
            { v: sale.value, f: `R$ ${sale.value.toFixed(2)}` },
            { v: lucroTotal, f: `R$ ${lucroTotal.toFixed(2)}` },
            sale.client_name ?? "",
            new Date(sale.date).toLocaleDateString("pt-BR"),
          ];
        })
      );

      const header = [
        "Produto",
        "Quantidade",
        "Valor da Venda",
        "Lucro Total",
        "Cliente",
        "Data da Venda",
      ];

      setData([header, ...tableRows]);
    } catch (error) {
      console.error("Erro ao carregar vendas:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!userChecked || loading) {
    return <p style={{ textAlign: "center", color: "white" }}>Carregando dados...</p>;
  }

  return (
    <Dashboard>
      <div className="header-extrato" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Listagem de Vendas</h2>
      </div>
      <hr />

      <div className="sales-table-container" style={{ marginTop: 16 }}>
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
          <p style={{ color: "white", marginTop: "1rem" }}>Nenhuma venda encontrada.</p>
        )}
      </div>
    </Dashboard>
  );
};

export default ListSalesByProfit;
