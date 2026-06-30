/**
 * Inventory Repository.
 * Encapsulates all transactional database operations for stock entries and exits.
 */
class InventoryRepository {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  /**
   * Registers a new inventory entry (IN).
   * Atomic: creates a Batch and its audit Movement within a single transaction.
   * @param {Object} params - { batchData, movementData }
   * @returns {Object} The created Batch with item and center relations.
   */
  async registerEntry({ batchData, movementData }) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const newBatch = await tx.batch.create({
          data: {
            itemId: batchData.itemId,
            centerId: batchData.centerId,
            initialQuantity: batchData.initialQuantity,
            currentQuantity: batchData.currentQuantity,
            origin: batchData.origin,
            createdById: batchData.createdById
          },
          include: {
            item: {
              include: {
                unit: true,
                category: true
              }
            },
            center: true
          }
        });

        await tx.movement.create({
          data: {
            type: movementData.type,
            quantity: movementData.quantity,
            itemId: movementData.itemId,
            centerId: movementData.centerId,
            batchId: newBatch.id,
            createdById: movementData.createdById
          }
        });

        return newBatch;
      });
    } catch (error) {
      console.error('[InventoryRepository] Entry transaction failed:', error);
      throw new Error(`Error en la transacción de entrada: ${error.message}`);
    }
  }

  /**
   * Registers an inventory exit (OUT) using FIFO strategy.
   * Atomic transaction: validates stock, discounts from oldest batches, creates audit Movement.
   *
   * @param {Object} params
   * @param {string} params.itemId - The catalog item to dispatch.
   * @param {string} params.centerId - The center from which stock is removed.
   * @param {number} params.quantity - The total quantity to dispatch.
   * @param {string} params.destinationId - The destination for the shipment.
   * @param {string} params.createdById - The user performing the operation.
   * @returns {Object} The created Movement record with item and destination relations.
   */
  async registerExit({ itemId, centerId, quantity, destinationId, createdById }) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        // Step 1: Calculate total available stock for this item in this center.
        const stockAggregate = await tx.batch.aggregate({
          where: { itemId, centerId, currentQuantity: { gt: 0 } },
          _sum: { currentQuantity: true }
        });

        const totalStock = stockAggregate._sum.currentQuantity || 0;

        if (quantity > totalStock) {
          throw new Error(
            `Stock insuficiente. Disponible: ${totalStock} unidades. Solicitado: ${quantity} unidades.`
          );
        }

        // Step 2: Fetch active batches ordered by receivedAt ascending (FIFO).
        // Select only fields needed for discount to avoid over-fetching (code-instructions §5).
        const activeBatches = await tx.batch.findMany({
          where: { itemId, centerId, currentQuantity: { gt: 0 } },
          orderBy: { receivedAt: 'asc' },
          select: { id: true, currentQuantity: true }
        });

        // Step 3: Iterative FIFO discount.
        let remaining = quantity;

        for (const batch of activeBatches) {
          if (remaining <= 0) break;

          const deduction = Math.min(batch.currentQuantity, remaining);
          const newQuantity = batch.currentQuantity - deduction;

          await tx.batch.update({
            where: { id: batch.id },
            data: { currentQuantity: newQuantity }
          });

          remaining -= deduction;
        }

        // Step 4: Create a single audit Movement of type OUT.
        const movement = await tx.movement.create({
          data: {
            type: 'OUT',
            quantity,
            itemId,
            centerId,
            destinationId,
            createdById
          },
          include: {
            item: { include: { unit: true } },
            destination: true
          }
        });

        return movement;
      });
    } catch (error) {
      // Re-throw domain/validation errors without wrapping them.
      if (error.message.includes('Stock insuficiente')) {
        throw error;
      }
      console.error('[InventoryRepository] Exit transaction failed:', error);
      throw new Error(`Error en la transacción de salida: ${error.message}`);
    }
  }

  /**
   * Retrieves consolidated stock for a given center.
   * Groups batches by itemId, sums currentQuantity, and enriches with item details.
   * Optionally filters by item name (case-insensitive partial match).
   *
   * @param {string} centerId - The center to query stock for.
   * @param {string} [searchTerm] - Optional partial name filter.
   * @returns {Array<Object>} Array of { item, totalStock } objects.
   */
  async getConsolidatedStock(centerId, searchTerm = '') {
    try {
      // Build item filter for the search term.
      const itemFilter = searchTerm.trim()
        ? { name: { contains: searchTerm.trim(), mode: 'insensitive' } }
        : {};

      // Fetch items that match the filter and belong to the center via batches.
      const items = await this.prisma.item.findMany({
        where: {
          ...itemFilter,
          batches: {
            some: {
              centerId,
              currentQuantity: { gt: 0 }
            }
          }
        },
        include: {
          category: true,
          unit: true,
          batches: {
            where: {
              centerId,
              currentQuantity: { gt: 0 }
            },
            select: {
              currentQuantity: true
            }
          }
        },
        orderBy: { name: 'asc' }
      });

      // Map to consolidated rows summing batch quantities.
      return items.map(item => ({
        item: {
          id: item.id,
          name: item.name,
          category: item.category,
          unit: item.unit
        },
        totalStock: item.batches.reduce((sum, b) => sum + b.currentQuantity, 0)
      }));
    } catch (error) {
      console.error('[InventoryRepository] Error fetching consolidated stock:', error);
      throw new Error('Error al consultar el inventario consolidado.');
    }
  }

  /**
   * Retrieves paged movement history for a specific center.
   * Ordered by createdAt desc (most recent first).
   *
   * @param {Object} params
   * @param {string} params.centerId - Center of operations.
   * @param {number} [params.page] - Page number (1-indexed).
   * @param {number} [params.limit] - Page size.
   * @returns {Promise<Array<Object>>} List of movement records.
   */
  async getMovementsHistory({ centerId, page = 1, limit = 20 }) {
    try {
      const skip = (page - 1) * limit;
      return await this.prisma.movement.findMany({
        where: { centerId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          item: {
            include: { unit: true }
          },
          createdBy: {
            select: { name: true }
          },
          destination: true
        }
      });
    } catch (error) {
      console.error('[InventoryRepository] Error fetching movements history:', error);
      throw new Error('Error al consultar el historial de movimientos.');
    }
  }
}

module.exports = InventoryRepository;

