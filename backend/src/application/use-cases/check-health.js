class CheckHealth {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async execute() {
    // Verificación de conexión a nivel de infraestructura
    await this.prisma.$queryRaw`SELECT 1`;
    return {
      status: 'ok',
      db: 'connected',
      service: 'acopio-backend'
    };
  }
}

module.exports = CheckHealth;
