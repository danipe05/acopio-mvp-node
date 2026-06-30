class GetVolunteers {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(page = 1) {
    return await this.userRepository.findAllVolunteers(page);
  }
}

module.exports = GetVolunteers;
