const Movement = require('../../domain/movement');

/**
 * Register Exit Use Case.
 * Validates business rules and delegates the FIFO stock discount to the repository.
 */
class RegisterExit {
  constructor(inventoryRepository, catalogRepository) {
    this.inventoryRepository = inventoryRepository;
    this.catalogRepository = catalogRepository;
  }

  /**
   * Executes the stock exit operation.
   * @param {Object} params
   * @param {string} params.itemId - The catalog item to dispatch.
   * @param {string} params.centerId - The center of operation.
   * @param {number} params.quantity - Quantity to dispatch (must be positive integer).
   * @param {string} params.destinationId - The target destination.
   * @param {string} params.createdById - The user performing the exit.
   * @returns {Object} The created Movement record.
   */
  async execute({ itemId, centerId, quantity, destinationId, createdById }) {
    // Guard clause: destinationId is mandatory for OUT movements (BR-03: Trazabilidad Obligatoria).
    if (!destinationId || typeof destinationId !== 'string' || destinationId.trim() === '') {
      throw new Error('El destino de envío es obligatorio para registrar una salida de inventario.');
    }

    // Validate quantity type before domain validation.
    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      throw new Error('La cantidad a despachar debe ser un número entero positivo mayor a cero.');
    }

    // Validate that the item exists in the catalog.
    const item = await this.catalogRepository.findItemById(itemId);
    if (!item) {
      throw new Error('El insumo seleccionado no está registrado en el inventario de donaciones.');
    }

    // Validate that the destination exists.
    const destination = await this.catalogRepository.findDestinationById(destinationId);
    if (!destination) {
      throw new Error('El destino seleccionado no está registrado en el sistema.');
    }

    // Domain entity validation (includes conditional destinationId check for OUT).
    Movement.create({
      type: 'OUT',
      quantity: parsedQuantity,
      itemId,
      centerId,
      destinationId,
      createdById
    });

    // Delegate to repository for the atomic FIFO transaction.
    return await this.inventoryRepository.registerExit({
      itemId,
      centerId,
      quantity: parsedQuantity,
      destinationId,
      createdById
    });
  }
}

module.exports = RegisterExit;
