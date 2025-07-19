import { SalesFirebaseService } from "@/services/firebase/sales/sales_firebase";
import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

const salesService = new SalesFirebaseService();

const SalesDashboardPage: React.FC = () => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true);
      setError(null);
      try {
        const sales = await salesService.getSales();

        // Agrupar vendas por data (ano-mes-dia)
        const grouped: Record<string, number> = {};
        sales.forEach((sale: any) => {
          const day = sale.date?.split(" ")[0] || "Sem data";
          if (!grouped[day]) grouped[day] = 0;
          grouped[day] += Number(sale.value) || 0;
        });

        // Montar dados para Google Charts
        const dataArray = [["Data", "Valor total vendido (R$)"]];
        Object.entries(grouped)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .forEach(([date, total]) => {
            dataArray.push([date, total]);
          });

        setChartData(dataArray);
      } catch (e) {
        console.error("Erro ao carregar vendas:", e);
        setError("Erro ao carregar dados de vendas.");
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  if (loading) return <p>Carregando gráfico de vendas...</p>;
  if (error) return <p>{error}</p>;
  if (chartData.length <= 1) return <p>Sem dados suficientes para exibir o gráfico.</p>;

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 20px" }}>
      <h1>Dashboard de Vendas</h1>
      <Chart
        chartType="ColumnChart"
        width="100%"
        height="400px"
        data={chartData}
        options={{
          title: "Vendas por Data",
          hAxis: { title: "Data", slantedText: true, slantedTextAngle: 45 },
          vAxis: { title: "Valor total vendido (R$)" },
          legend: { position: "none" },
          animation: { startup: true, duration: 500, easing: "out" },
        }}
      />
    </div>
  );
};

export default SalesDashboardPage;
