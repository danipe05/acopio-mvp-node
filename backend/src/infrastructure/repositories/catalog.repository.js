class CatalogRepository {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  async createItem(itemData) {
    try {
      return await this.prisma.item.create({
        data: {
          name: itemData.name,
          categoryId: itemData.categoryId,
          unitId: itemData.unitId
        },
        include: {
          category: true,
          unit: true
        }
      });
    } catch (error) {
      console.error('[CatalogRepository] Error creating item:', error);
      throw new Error(`Error al crear el insumo en la base de datos: ${error.message}`);
    }
  }

  async createDestination(destData) {
    try {
      return await this.prisma.destination.create({
        data: {
          name: destData.name,
          isCritical: destData.isCritical
        }
      });
    } catch (error) {
      console.error('[CatalogRepository] Error creating destination:', error);
      throw new Error(`Error al crear el destino en la base de datos: ${error.message}`);
    }
  }

  async findAllItems() {
    try {
      return await this.prisma.item.findMany({
        include: {
          category: true,
          unit: true
        },
        orderBy: { name: 'asc' }
      });
    } catch (error) {
      console.error('[CatalogRepository] Error listing items:', error);
      throw new Error('Error al obtener la lista de insumos.');
    }
  }

  async findAllDestinations() {
    try {
      return await this.prisma.destination.findMany({
        orderBy: [
          { isCritical: 'desc' },
          { name: 'asc' }
        ]
      });
    } catch (error) {
      console.error('[CatalogRepository] Error listing destinations:', error);
      throw new Error('Error al obtener la lista de destinos.');
    }
  }

  async findAllCategories() {
    try {
      return await this.prisma.category.findMany({
        orderBy: { name: 'asc' }
      });
    } catch (error) {
      console.error('[CatalogRepository] Error listing categories:', error);
      throw new Error('Error al obtener las categorías.');
    }
  }

  async findAllUnits() {
    try {
      return await this.prisma.unit.findMany({
        orderBy: { name: 'asc' }
      });
    } catch (error) {
      console.error('[CatalogRepository] Error listing units:', error);
      throw new Error('Error al obtener las unidades de medida.');
    }
  }

  async findItemById(id) {
    try {
      return await this.prisma.item.findUnique({
        where: { id },
        include: {
          category: true,
          unit: true
        }
      });
    } catch (error) {
      console.error(`[CatalogRepository] Error finding item ${id}:`, error);
      throw new Error('Error al buscar el insumo en el catálogo.');
    }
  }

  async findDestinationById(id) {
    try {
      return await this.prisma.destination.findUnique({
        where: { id }
      });
    } catch (error) {
      console.error(`[CatalogRepository] Error finding destination ${id}:`, error);
      throw new Error('Error al buscar el destino en la base de datos.');
    }
  }

  async findCategoryById(id) {
    try {
      return await this.prisma.category.findUnique({
        where: { id }
      });
    } catch (error) {
      console.error(`[CatalogRepository] Error finding category ${id}:`, error);
      throw new Error('Error al buscar la categoría.');
    }
  }

  async findUnitById(id) {
    try {
      return await this.prisma.unit.findUnique({
        where: { id }
      });
    } catch (error) {
      console.error(`[CatalogRepository] Error finding unit ${id}:`, error);
      throw new Error('Error al buscar la unidad de medida.');
    }
  }
}

module.exports = CatalogRepository;
