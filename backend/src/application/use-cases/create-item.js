const Item = require('../../domain/item');

class CreateItem {
  constructor(catalogRepository) {
    this.catalogRepository = catalogRepository;
  }

  async execute({ name, categoryId, unitId }) {
    // 1. Check if Category exists
    const category = await this.catalogRepository.findCategoryById(categoryId);
    if (!category) {
      throw new Error('La categoría seleccionada no existe.');
    }

    // 2. Check if Unit exists
    const unit = await this.catalogRepository.findUnitById(unitId);
    if (!unit) {
      throw new Error('La unidad de medida seleccionada no existe.');
    }

    // 3. Create and validate domain model
    const itemEntity = Item.create({ name, categoryId, unitId });

    // 4. Check for duplicate item name
    const allItems = await this.catalogRepository.findAllItems();
    const duplicate = allItems.find(
      i => i.name.toLowerCase().trim() === name.toLowerCase().trim()
    );
    if (duplicate) {
      throw new Error(`El insumo "${name}" ya está registrado en el catálogo.`);
    }

    // 5. Persist to DB
    return await this.catalogRepository.createItem(itemEntity);
  }
}

module.exports = CreateItem;
