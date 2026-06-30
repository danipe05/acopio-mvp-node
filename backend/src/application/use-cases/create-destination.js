const Destination = require('../../domain/destination');

class CreateDestination {
  constructor(catalogRepository) {
    this.catalogRepository = catalogRepository;
  }

  async execute({ name, isCritical }) {
    // 1. Create and validate domain model
    const destEntity = Destination.create({ name, isCritical });

    // 2. Check for duplicates
    const allDestinations = await this.catalogRepository.findAllDestinations();
    const duplicate = allDestinations.find(
      d => d.name.toLowerCase().trim() === name.toLowerCase().trim()
    );
    if (duplicate) {
      throw new Error(`El destino "${name}" ya está registrado.`);
    }

    // 3. Persist to DB
    return await this.catalogRepository.createDestination(destEntity);
  }
}

module.exports = CreateDestination;
