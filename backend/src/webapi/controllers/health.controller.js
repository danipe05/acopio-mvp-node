const prisma = require('../../infrastructure/database/prisma-client');
const CheckHealth = require('../../application/use-cases/check-health');
const GetInfo = require('../../application/use-cases/get-info');

const healthController = {
  checkHealth: async (req, res) => {
    try {
      const useCase = new CheckHealth(prisma);
      const result = await useCase.execute();
      res.json(result);
    } catch (error) {
      res.status(500).json({ status: 'error', db: 'disconnected', details: error.message });
    }
  },

  getInfo: (req, res) => {
    const useCase = new GetInfo();
    const result = useCase.execute();
    
    // Retorna el fragmento HTML requerido por HTMX para inyección directa en el frontend
    res.send(`<div class="p-4 bg-green-100 text-green-800 rounded-xl border border-green-200">${result.message}</div>`);
  }
};

module.exports = healthController;
