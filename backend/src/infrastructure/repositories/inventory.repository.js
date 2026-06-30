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
        const activeBatches = await tx.batch.findMany({
          where: { itemId, centerId, currentQuantity: { gt: 0 } },
          orderBy: { receivedAt: 'asc' }
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
}

module.exports = InventoryRepository;
