class DashboardRepository {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  /**
   * Fetches consolidated metrics at the national level.
   * Leverages Prisma aggregation functions for performant statistics.
   *
   * @returns {Promise<Object>} Aggregated dashboard statistics.
   */
  async getNationalStats() {
    try {
      const centersTotal = await this.prisma.center.count();
      const centersActive = await this.prisma.center.count({ where: { status: 'ACTIVE' } });
      const volunteersCount = await this.prisma.user.count({ where: { role: 'VOLUNTEER' } });
      const batchesCount = await this.prisma.batch.count();

      // Consolidated stock volume
      const stockAggregate = await this.prisma.batch.aggregate({
        _sum: {
          currentQuantity: true
        }
      });
      const totalStock = stockAggregate._sum.currentQuantity || 0;

      // Aggregated national entries (IN)
      const inAggregate = await this.prisma.movement.aggregate({
        where: { type: 'IN' },
        _sum: { quantity: true }
      });
      const totalIn = inAggregate._sum.quantity || 0;

      // Aggregated national exits (OUT)
      const outAggregate = await this.prisma.movement.aggregate({
        where: { type: 'OUT' },
        _sum: { quantity: true }
      });
      const totalOut = outAggregate._sum.quantity || 0;

      // Top 3 centers with the most movements
      const movementsByCenter = await this.prisma.movement.groupBy({
        by: ['centerId'],
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: 'desc'
          }
        },
        take: 3
      });

      const centerIds = movementsByCenter.map(c => c.centerId);
      const centers = await this.prisma.center.findMany({
        where: { id: { in: centerIds } }
      });

      const topCenters = movementsByCenter.map(m => {
        const centerObj = centers.find(c => c.id === m.centerId);
        return {
          name: centerObj ? centerObj.name : 'Centro Desconocido',
          count: m._count.id
        };
      });

      // Top 5 products in stock
      const activeBatches = await this.prisma.batch.findMany({
        where: { currentQuantity: { gt: 0 } },
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

      const topProducts = Object.entries(itemTotals)
        .map(([name, quantity]) => ({ name, quantity }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

      return {
        centersTotal,
        centersActive,
        volunteersCount,
        batchesCount,
        totalStock,
        totalIn,
        totalOut,
        topCenters,
        topProducts
      };
    } catch (error) {
      console.error('[DashboardRepository] Error fetching national stats:', error);
      throw new Error(`Error al recopilar estadísticas nacionales: ${error.message}`);
    }
  }
}

module.exports = DashboardRepository;
