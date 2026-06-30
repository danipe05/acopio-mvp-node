const Center = require('../../domain/center');

class UpdateCenter {
  constructor(centerRepository) {
    this.centerRepository = centerRepository;
  }

  async execute(id, { name, address, status }) {
    // Check if the center exists first
    const existing = await this.centerRepository.findById(id);
    if (!existing) {
      throw new Error(`El centro de acopio con ID "${id}" no existe.`);
    }

    // Instantiate Domain Entity to execute business validations
    const centerEntity = Center.create({ id, name, address, status });
    
    // Save updates using repository pattern
    return await this.centerRepository.update(id, centerEntity);
  }
}

module.exports = UpdateCenter;
