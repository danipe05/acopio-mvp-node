class GetCenters {
  constructor(centerRepository) {
    this.centerRepository = centerRepository;
  }

  async execute() {
    return await this.centerRepository.findAll();
  }
}

module.exports = GetCenters;
