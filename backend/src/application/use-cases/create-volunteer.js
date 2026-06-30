const crypto = require('crypto');
const User = require('../../domain/user');

class CreateVolunteer {
  constructor(userRepository, centerRepository) {
    this.userRepository = userRepository;
    this.centerRepository = centerRepository;
  }

  /**
   * Hashes password using SHA-256 (Node native crypto).
   * @param {string} password Raw password
   */
  hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  async execute({ name, email, password, phone, documentId, centerId }) {
    // 1. Check if center exists
    const center = await this.centerRepository.findById(centerId);
    if (!center) {
      throw new Error(`El centro de acopio seleccionado no existe.`);
    }

    // 2. Check if email is already taken
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error(`El correo electrónico "${email}" ya está registrado.`);
    }

    // 3. Hash the default credential password
    const hashedPassword = this.hashPassword(password);

    // 4. Instantiate and validate domain entity (ensures valid email, fields, and center requirement)
    const userEntity = User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      documentId,
      role: 'VOLUNTEER',
      centerId
    });

    // 5. Persist the volunteer
    return await this.userRepository.create(userEntity);
  }
}

module.exports = CreateVolunteer;
