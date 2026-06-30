/**
 * Movement Domain Entity.
 * Encapsulates business validation rules for inventory movements.
 */
class Movement {
  constructor({ id, type, quantity, itemId, centerId, batchId, destinationId, createdById }) {
    this.id = id;
    this.type = type;
    this.quantity = parseInt(quantity, 10);
    this.itemId = itemId;
    this.centerId = centerId;
    this.batchId = batchId;
    this.destinationId = destinationId;
    this.createdById = createdById;
  }

  /**
   * Pure business validation for Movement.
   * Throws Error if validation fails.
   */
  validate() {
    if (this.type !== 'IN' && this.type !== 'OUT') {
      throw new Error('El tipo de movimiento debe ser IN (Entrada) u OUT (Salida).');
    }

    if (isNaN(this.quantity) || this.quantity <= 0) {
      throw new Error('La cantidad del movimiento debe ser un número entero positivo mayor a cero.');
    }

    if (!this.itemId || typeof this.itemId !== 'string' || this.itemId.trim() === '') {
      throw new Error('El insumo es obligatorio.');
    }

    if (!this.centerId || typeof this.centerId !== 'string' || this.centerId.trim() === '') {
      throw new Error('El centro de acopio es obligatorio.');
    }

    if (!this.createdById || typeof this.createdById !== 'string' || this.createdById.trim() === '') {
      throw new Error('El usuario creador es obligatorio.');
    }

    // When the movement is an exit, the destination is mandatory.
    if (this.type === 'OUT') {
      if (!this.destinationId || typeof this.destinationId !== 'string' || this.destinationId.trim() === '') {
        throw new Error('El destino de envío es obligatorio para los movimientos de salida.');
      }
    }
  }

  static create(data) {
    const movement = new Movement(data);
    movement.validate();
    return movement;
  }
}

module.exports = Movement;
