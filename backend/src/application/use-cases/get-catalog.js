class GetCatalog {
  constructor(catalogRepository) {
    this.catalogRepository = catalogRepository;
  }

  async execute() {
    const items = await this.catalogRepository.findAllItems();
    const destinations = await this.catalogRepository.findAllDestinations();
    const categories = await this.catalogRepository.findAllCategories();
    const units = await this.catalogRepository.findAllUnits();

    return {
      items,
      destinations,
      categories,
      units
    };
  }
}

module.exports = GetCatalog;
