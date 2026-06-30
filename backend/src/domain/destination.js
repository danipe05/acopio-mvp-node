class Destination {
  constructor({ id, name, isCritical }) {
    this.id = id;
    this.name = name;
    this.isCritical = isCritical === true || isCritical === 'true';
  }

  /**
   * Pure business validation for Destination.
   * Throws Error if validation fails.
   */
  validate() {
    if (!this.name || typeof this.name !== 'string' || this.name.trim() === '') {
      throw new Error('El nombre del destino es obligatorio.');
    }
  }

  static create(data) {
    const destination = new Destination(data);
    destination.validate();
    return destination;
  }
}

module.exports = Destination;
