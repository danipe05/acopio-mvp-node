const crypto = require('crypto');
const Center = require('../../domain/center');
const User = require('../../domain/user');

class RegisterCenterUseCase {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  /**
   * Registers a new Center and its Administrator atomically within a database transaction.
   *
   * @param {Object} data Onboarding data.
   */
  async execute({ centerName, address, userName, email, password, phone, documentId }) {
    // 1. Instantiate and validate domain entities to enforce rules early
    const centerDomain = Center.create({
      name: centerName,
      address,
      status: 'ACTIVE'
    });

    const fallbackPhone = phone || '0000000000';
    const fallbackDocId = documentId || '00000000';

    if (!password || password.length < 6) {
      throw new Error('La contraseña es obligatoria y debe tener al menos 6 caracteres.');
    }
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    const userDomain = User.create({
      email,
      name: userName,
      password: hashedPassword,
      phone: fallbackPhone,
      documentId: fallbackDocId,
      role: 'ADMIN'
    });

    // 2. Perform atomic database transaction
    return await this.prisma.$transaction(async (tx) => {
      // Check if email already exists
      const existingUser = await tx.user.findUnique({
        where: { email: userDomain.email }
      });
      if (existingUser) {
        throw new Error('El correo electrónico ya está registrado.');
      }

      // Check if center name already exists (prevents duplicate center names)
      const existingCenter = await tx.center.findFirst({
        where: { name: centerDomain.name }
      });
      if (existingCenter) {
        throw new Error('El nombre de este centro de acopio ya está registrado.');
      }

      // Create Center
      const newCenter = await tx.center.create({
        data: {
          name: centerDomain.name,
          address: centerDomain.address,
          status: centerDomain.status
        }
      });

      // Create User associated with Center
      const newUser = await tx.user.create({
        data: {
          email: userDomain.email,
          name: userDomain.name,
          password: userDomain.password,
          phone: userDomain.phone,
          documentId: userDomain.documentId,
          role: 'ADMIN',
          centerId: newCenter.id
        }
      });

      return { center: newCenter, user: newUser };
    });
  }
}

module.exports = RegisterCenterUseCase;
