class User {
  constructor({ id, email, name, password, phone, documentId, role, centerId }) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.password = password;
    this.phone = phone;
    this.documentId = documentId;
    this.role = role || 'VOLUNTEER';
    this.centerId = centerId;
  }

  /**
   * Pure business validation for User/Volunteer.
   * Throws Error if validation fails.
   */
  validate() {
    if (!this.name || typeof this.name !== 'string' || this.name.trim() === '') {
      throw new Error('El nombre del usuario es obligatorio.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email || !emailRegex.test(this.email)) {
      throw new Error('El formato del correo electrónico es inválido.');
    }

    if (!this.password || typeof this.password !== 'string' || this.password.length < 6) {
      throw new Error('La contraseña es obligatoria y debe tener al menos 6 caracteres.');
    }

    if (!this.phone || typeof this.phone !== 'string' || this.phone.trim() === '') {
      throw new Error('El teléfono es obligatorio.');
    }

    if (!this.documentId || typeof this.documentId !== 'string' || this.documentId.trim() === '') {
      throw new Error('La cédula (documento de identidad) es obligatoria.');
    }

    if (this.role !== 'ADMIN' && this.role !== 'VOLUNTEER') {
      throw new Error('El rol debe ser ADMIN o VOLUNTEER.');
    }

    // Business Rule: Volunteer must be assigned to a Center
    if (this.role === 'VOLUNTEER' && (!this.centerId || this.centerId.trim() === '')) {
      throw new Error('El voluntario debe estar obligatoriamente asignado a un centro de acopio.');
    }
  }

  static create(data) {
    const user = new User(data);
    user.validate();
    return user;
  }
}

module.exports = User;
