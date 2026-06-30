const crypto = require('crypto');

class LoginUseCase {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  /**
   * Verifies user credentials and returns user details with center info.
   *
   * @param {Object} credentials Email and password.
   */
  async execute({ email, password }) {
    if (!email || !password) {
      throw new Error('El correo electrónico y la contraseña son obligatorios.');
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { center: true }
    });

    if (!user) {
      throw new Error('Las credenciales proporcionadas son incorrectas.');
    }

    // Verify hash
    const inputPasswordHash = crypto.createHash('sha256').update(password).digest('hex');
    if (user.password !== inputPasswordHash) {
      throw new Error('Las credenciales proporcionadas son incorrectas.');
    }

    return user;
  }
}

module.exports = LoginUseCase;
