class Center {
  constructor({ id, name, address, status }) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.status = status || 'ACTIVE';
  }

  /**
   * Pure business validation for Center entity.
   * Throws Error if validation fails.
   */
  validate() {
    if (!this.name || typeof this.name !== 'string' || this.name.trim() === '') {
      throw new Error('El nombre del centro es obligatorio y debe ser un texto válido.');
    }
    if (!this.address || typeof this.address !== 'string' || this.address.trim() === '') {
      throw new Error('La dirección del centro es obligatoria y debe ser un texto válido.');
    }
    if (this.status !== 'ACTIVE' && this.status !== 'INACTIVE') {
      throw new Error('El estado del centro debe ser ACTIVE o INACTIVE.');
    }
  }

  static create(data) {
    const center = new Center(data);
    center.validate();
    return center;
  }
}

module.exports = Center;
