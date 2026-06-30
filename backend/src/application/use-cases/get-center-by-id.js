class GetCenterById {
  constructor(centerRepository) {
    this.centerRepository = centerRepository;
  }

  async execute(id) {
    const center = await this.centerRepository.findById(id);
    if (!center) {
      throw new Error(`El centro de acopio con ID "${id}" no existe.`);
    }
    return center;
  }
}

module.exports = GetCenterById;
