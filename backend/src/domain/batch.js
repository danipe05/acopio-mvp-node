class Batch {
  constructor({ id, itemId, centerId, initialQuantity, currentQuantity, origin, createdById }) {
    this.id = id;
    this.itemId = itemId;
    this.centerId = centerId;
    this.initialQuantity = parseInt(initialQuantity, 10);
    this.currentQuantity = currentQuantity !== undefined ? parseInt(currentQuantity, 10) : this.initialQuantity;
    this.origin = origin;
    this.createdById = createdById;
  }

  /**
   * Pure business validation for Batch.
   * Throws Error if validation fails.
   */
  validate() {
    if (!this.itemId || typeof this.itemId !== 'string' || this.itemId.trim() === '') {
      throw new Error('El insumo seleccionado es inválido.');
    }

    if (!this.centerId || typeof this.centerId !== 'string' || this.centerId.trim() === '') {
      throw new Error('El centro de acopio es obligatorio.');
    }

    if (isNaN(this.initialQuantity) || this.initialQuantity <= 0) {
      throw new Error('La cantidad inicial debe ser un número entero positivo mayor a cero.');
    }

    if (!this.origin || typeof this.origin !== 'string' || this.origin.trim() === '') {
      throw new Error('El origen del lote es obligatorio.');
    }

    if (!this.createdById || typeof this.createdById !== 'string' || this.createdById.trim() === '') {
      throw new Error('El usuario creador es obligatorio.');
    }
  }

  static create(data) {
    const batch = new Batch(data);
    batch.validate();
    return batch;
  }
}

module.exports = Batch;
