class Item {
  constructor({ id, name, categoryId, unitId }) {
    this.id = id;
    this.name = name;
    this.categoryId = categoryId;
    this.unitId = unitId;
  }

  /**
   * Pure business validation for Item.
   * Throws Error if validation fails.
   */
  validate() {
    if (!this.name || typeof this.name !== 'string' || this.name.trim() === '') {
      throw new Error('El nombre del insumo es obligatorio.');
    }

    if (!this.categoryId || typeof this.categoryId !== 'string' || this.categoryId.trim() === '') {
      throw new Error('La categoría del insumo es obligatoria.');
    }

    if (!this.unitId || typeof this.unitId !== 'string' || this.unitId.trim() === '') {
      throw new Error('La unidad de medida del insumo es obligatoria.');
    }
  }

  static create(data) {
    const item = new Item(data);
    item.validate();
    return item;
  }
}

module.exports = Item;
