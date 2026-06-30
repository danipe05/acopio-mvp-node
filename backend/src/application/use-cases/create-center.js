const Center = require('../../domain/center');

class CreateCenter {
  constructor(centerRepository) {
    this.centerRepository = centerRepository;
  }

  async execute({ name, address, status }) {
    // Instantiate Domain Entity to execute business validations
    const centerEntity = Center.create({ name, address, status });
    
    // Save to database using the repository pattern
    return await this.centerRepository.create(centerEntity);
  }
}

module.exports = CreateCenter;
