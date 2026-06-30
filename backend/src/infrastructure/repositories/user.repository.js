class UserRepository {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  async create(userData) {
    try {
      return await this.prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: userData.password,
          phone: userData.phone,
          documentId: userData.documentId,
          role: userData.role,
          centerId: userData.centerId
        },
        include: {
          center: true
        }
      });
    } catch (error) {
      console.error('[UserRepository] Error creating user:', error);
      throw new Error(`No se pudo crear el usuario en la base de datos: ${error.message}`);
    }
  }

  async findAllVolunteers(page = 1) {
    try {
      const limit = 6;
      const skip = (page - 1) * limit;

      const volunteers = await this.prisma.user.findMany({
        where: { role: 'VOLUNTEER' },
        include: {
          center: true
        },
        orderBy: { createdAt: 'desc' },
        skip: skip,
        take: limit + 1
      });

      const hasMore = volunteers.length > limit;
      if (hasMore) {
        volunteers.pop();
      }

      return {
        volunteers,
        hasMore
      };
    } catch (error) {
      console.error('[UserRepository] Error fetching volunteers:', error);
      throw new Error(`No se pudieron obtener los voluntarios de la base de datos: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      return await this.prisma.user.findUnique({
        where: { id },
        include: {
          center: true
        }
      });
    } catch (error) {
      console.error(`[UserRepository] Error fetching user by ID ${id}:`, error);
      throw new Error(`Error al buscar el usuario en la base de datos.`);
    }
  }

  async findByEmail(email) {
    try {
      return await this.prisma.user.findUnique({
        where: { email }
      });
    } catch (error) {
      console.error(`[UserRepository] Error fetching user by email ${email}:`, error);
      throw new Error(`Error al buscar el usuario por correo electrónico.`);
    }
  }

  async delete(id) {
    try {
      return await this.prisma.user.delete({
        where: { id }
      });
    } catch (error) {
      console.error(`[UserRepository] Error deleting user by ID ${id}:`, error);
      throw new Error(`No se pudo eliminar/dar de baja al usuario de la base de datos: ${error.message}`);
    }
  }
}

module.exports = UserRepository;
