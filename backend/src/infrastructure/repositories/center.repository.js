class CenterRepository {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  async create(centerData) {
    try {
      return await this.prisma.center.create({
        data: {
          name: centerData.name,
          address: centerData.address,
          status: centerData.status
        }
      });
    } catch (error) {
      console.error('[CenterRepository] Error creating center:', error);
      throw new Error(`No se pudo crear el centro de acopio en la base de datos: ${error.message}`);
    }
  }

  async update(id, centerData) {
    try {
      return await this.prisma.center.update({
        where: { id },
        data: {
          name: centerData.name,
          address: centerData.address,
          status: centerData.status
        }
      });
    } catch (error) {
      console.error('[CenterRepository] Error updating center:', error);
      throw new Error(`No se pudo actualizar el centro de acopio en la base de datos: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.prisma.center.findMany({
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      console.error('[CenterRepository] Error fetching all centers:', error);
      throw new Error(`No se pudieron obtener los centros de acopio de la base de datos: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      return await this.prisma.center.findUnique({
        where: { id }
      });
    } catch (error) {
      console.error(`[CenterRepository] Error fetching center by id ${id}:`, error);
      throw new Error(`No se pudo buscar el centro de acopio en la base de datos: ${error.message}`);
    }
  }
}

module.exports = CenterRepository;
