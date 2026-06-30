const Batch = require('../../domain/batch');
const Movement = require('../../domain/movement');

class RegisterEntry {
  constructor(inventoryRepository, catalogRepository) {
    this.inventoryRepository = inventoryRepository;
    this.catalogRepository = catalogRepository;
  }

  async execute({ itemId, centerId, quantity, origin, createdById }) {
    // 1. Verify Item exists in the catalog
    const item = await this.catalogRepository.findItemById(itemId);
    if (!item) {
      throw new Error('El insumo seleccionado no está registrado en el catálogo.');
    }

    // 2. Instantiate and validate domain entities
    const batchEntity = Batch.create({
      itemId,
      centerId,
      initialQuantity: quantity,
      origin,
      createdById
    });

    const movementEntity = Movement.create({
      type: 'IN',
      quantity,
      itemId,
      centerId,
      createdById
    });

    // 3. Persist atomically using transaction
    return await this.inventoryRepository.registerEntry({
      batchData: batchEntity,
      movementData: movementEntity
    });
  }
}

module.exports = RegisterEntry;
