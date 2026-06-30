const prisma = require('../../infrastructure/database/prisma-client');
const DashboardRepository = require('../../infrastructure/repositories/dashboard.repository');
const views = require('../views/dashboard.views');

const dashboardRepository = new DashboardRepository(prisma);

/**
 * Layout wrapper for direct, non-HTMX administrative dashboard requests.
 */
const fullLayout = (content) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sistema de Gestión - Dashboard Nacional</title>
  <link rel="stylesheet" href="/output.css">
  <script src="https://unpkg.com/htmx.org@1.9.12"></script>
</head>
<body class="bg-gray-50 min-h-screen p-6 font-sans">
  <div class="max-w-6xl mx-auto">
    ${content}
  </div>
</body>
</html>
`;

/**
 * Helper to render depending on hx-request header.
 */
const renderView = (req, res, htmlContent) => {
  if (req.headers['hx-request']) {
    res.send(htmlContent);
  } else {
    res.send(fullLayout(htmlContent));
  }
};

const dashboardController = {
  /**
   * GET /admin/dashboard
   * Renders the national dashboard shell structure containing the polling container.
   */
  getDashboardView: async (req, res) => {
    try {
      const html = views.dashboardShell();
      renderView(req, res, html);
    } catch (error) {
      console.error('[DashboardController] Error rendering dashboard view:', error);
      res.status(500).send(
        '<div class="p-4 bg-red-100 text-red-800 rounded-xl">Error al cargar el panel de administración</div>'
      );
    }
  },

  /**
   * GET /admin/dashboard/stats
   * Endpoint for HTMX polling that returns the statistics partial.
   */
  getStats: async (req, res) => {
    try {
      const stats = await dashboardRepository.getNationalStats();

      let isMockData = false;
      // Fallback to demo data if the system contains no products (brand new DB)
      if (stats.topProducts.length === 0) {
        isMockData = true;
        stats.topProducts = [
          { name: "Agua Potable Envasada (Litros)", quantity: 12500 },
          { name: "Alimentos No Perecederos (Kg)", quantity: 8400 },
          { name: "Medicamentos de Emergencia (Kits)", quantity: 1200 },
          { name: "Mantas y Sacos de Dormir (Unidades)", quantity: 950 },
          { name: "Kits de Higiene y Aseo Personal (Kits)", quantity: 620 }
        ];
        stats.totalStock = 23670;
        stats.totalIn = 35000;
        stats.totalOut = 11330;
        stats.topCenters = [
          { name: "Centro de Acopio Caracas", count: 45 },
          { name: "Centro de Acopio Zulia", count: 28 },
          { name: "Centro de Acopio Táchira", count: 19 }
        ];
      }

      const html = views.dashboardStatsHTML({
        ...stats,
        isMockData
      });

      res.send(html);
    } catch (error) {
      console.error('[DashboardController] Error generating stats:', error);
      res.status(500).send(
        '<div class="p-4 bg-red-100 text-red-800 rounded-xl">Error al cargar estadísticas en tiempo real</div>'
      );
    }
  }
};

module.exports = dashboardController;
