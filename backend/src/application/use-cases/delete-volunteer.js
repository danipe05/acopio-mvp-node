class DeleteVolunteer {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(id) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error(`El usuario con ID "${id}" no existe.`);
    }

    if (user.role !== 'VOLUNTEER') {
      throw new Error(`Sólo se permite dar de baja a usuarios con rol voluntario.`);
    }

    return await this.userRepository.delete(id);
  }
}

module.exports = DeleteVolunteer;
