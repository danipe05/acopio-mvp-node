const prisma = require('../../infrastructure/database/prisma-client');
const views = require('../views/dashboard.views');

const dashboardController = {
  getStats: async (req, res) => {
    try {
      const centersTotal = await prisma.center.count();
      const centersActive = await prisma.center.count({ where: { status: 'ACTIVE' } });
      const volunteersCount = await prisma.user.count({ where: { role: 'VOLUNTEER' } });
      const batchesCount = await prisma.batch.count();

      // Aggregate sum of current quantity of all batches
      const stockAggregate = await prisma.batch.aggregate({
        _sum: {
          currentQuantity: true
        }
      });
      const totalStock = stockAggregate._sum.currentQuantity || 0;

      // Group batches by item
      const activeBatches = await prisma.batch.findMany({
        include: {
          item: {
            include: {
              unit: true
            }
          }
        }
      });

      const itemTotals = {};
      for (const b of activeBatches) {
        if (!b.item) continue;
        const itemName = b.item.name;
        const unitName = b.item.unit ? b.item.unit.name : 'Unidades';
        const key = `${itemName} (${unitName})`;
        if (!itemTotals[key]) {
          itemTotals[key] = 0;
        }
        itemTotals[key] += b.currentQuantity;
      }

      let topProducts = Object.entries(itemTotals)
        .map(([name, quantity]) => ({ name, quantity }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

      let isMockData = false;
      
      // If there are no products in database, show highly realistic emergency aid telemetry!
      if (topProducts.length === 0) {
        isMockData = true;
        topProducts = [
          { name: "Agua Potable Envasada (Litros)", quantity: 12500 },
          { name: "Alimentos No Perecederos (Kg)", quantity: 8400 },
          { name: "Medicamentos de Emergencia (Kits)", quantity: 1200 },
          { name: "Mantas y Sacos de Dormir (Unidades)", quantity: 950 },
          { name: "Kits de Higiene y Aseo Personal (Kits)", quantity: 620 }
        ];
      }

      const html = views.dashboardStatsHTML({
        centersTotal,
        centersActive,
        volunteersCount,
        batchesCount,
        totalStock: isMockData ? 23670 : totalStock,
        topProducts,
        isMockData
      });

      res.send(html);
    } catch (error) {
      console.error('[DashboardController] Error generating stats:', error);
      res.status(500).send('<div class="p-4 bg-red-100 text-red-800 rounded-xl">Error al cargar estadísticas</div>');
    }
  }
};

module.exports = dashboardController;
