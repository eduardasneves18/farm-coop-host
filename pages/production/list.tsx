import { ProductionFirebaseService } from '@/services/firebase/production/production_firebase';
import React, { useEffect, useState } from 'react';

const ProductionList: React.FC = () => {
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(true);
  const productionService = new ProductionFirebaseService();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const items = await productionService.getProductionItems();
        const rows = items.map(item => {
          const { produto, quantidade, unidade_medida, status, data_estimativa_colheita } = item;
          return `['${produto}', '${quantidade} ${unidade_medida}', '${status}', '${data_estimativa_colheita ?? '-'}']`;
        });

        const html = buildHtmlTable(rows.join(',\n'));
        setHtmlContent(html);
      } catch (err) {
        console.error('Erro ao buscar dados de produção:', err);
        setHtmlContent('<p style="color:red;">Erro ao carregar produções</p>');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const buildHtmlTable = (rows: string) => `
    <html>
      <head>
        <style>
          html, body {
            margin: 0;
            padding: 0;
            background: linear-gradient(to bottom, #2A2A28, #4E5D4D);
            height: 100%;
            color: white;
            font-family: sans-serif;
          }
          #scroll_wrapper {
            overflow: auto;
            height: 100vh;
            width: 100vw;
          }
          .google-visualization-table-table {
            background-color: transparent !important;
            color: white;
            font-size: 18px;
            border-spacing: 0;
            width: 100%;
          }
          .google-visualization-table-th {
            background-color: #2A2A28;
            color: #A5D6A7 !important;
            padding: 10px;
            border: 1px solid #5b5b5b !important;
          }
          td {
            border: 1px solid #555 !important;
            padding: 10px;
            text-align: center;
            max-width: 180px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .google-visualization-table-tr-odd {
            background-color: rgba(76, 175, 80, 0.12) !important;
          }
        </style>
        <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
        <script type="text/javascript">
          google.charts.load('current', { packages: ['table'] });
          google.charts.setOnLoadCallback(drawTable);
          function drawTable() {
            const data = new google.visualization.DataTable();
            data.addColumn('string', 'Produto');
            data.addColumn('string', 'Quantidade');
            data.addColumn('string', 'Status');
            data.addColumn('string', 'Data Estimada');
            data.addRows([${rows}]);

            const table = new google.visualization.Table(document.getElementById('table_container'));
            table.draw(data, {
              showRowNumber: false,
              allowHtml: true,
              cssClassNames: {
                headerRow: 'google-visualization-table-th',
                oddTableRow: 'google-visualization-table-tr-odd',
              }
            });
          }
        </script>
      </head>
      <body>
        <div id="scroll_wrapper">
          <div id="table_container"></div>
        </div>
      </body>
    </html>
  `;

  return (
    <div style={{ width: '100%', height: '90vh', padding: '1rem', background: '#121212', borderRadius: '8px' }}>
      <h2 style={{ color: '#A5D6A7', marginBottom: '1rem' }}>Lista de Produções</h2>
      {loading ? (
        <p style={{ color: '#ccc' }}>Carregando...</p>
      ) : (
        <iframe
          title="Productions Table"
          srcDoc={htmlContent}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: 'transparent'
          }}
        />
      )}
    </div>
  );
};

export default ProductionList;
