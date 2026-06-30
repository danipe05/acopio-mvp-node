const crypto = require('crypto');
const prisma = require('../../infrastructure/database/prisma-client');

const seedCatalogBases = async () => {
  try {
    const categoriesCount = await prisma.category.count();
    if (categoriesCount === 0) {
      await prisma.category.createMany({
        data: [
          { name: 'Alimentos' },
          { name: 'Agua y Bebidas' },
          { name: 'Medicamentos' },
          { name: 'Higiene Personal' },
          { name: 'Ropa y Mantas' },
          { name: 'Herramientas y Refugio' }
        ],
        skipDuplicates: true
      });
    }

    const unitsCount = await prisma.unit.count();
    if (unitsCount === 0) {
      await prisma.unit.createMany({
        data: [
          { name: 'Kg' },
          { name: 'Litros' },
          { name: 'Unidades' },
          { name: 'Kits' }
        ],
        skipDuplicates: true
      });
    }
  } catch (error) {
    console.error('[Auth Middleware] Error seeding catalog bases:', error);
  }
};

const getOrCreateMockAdmin = async () => {
  try {
    // Run catalog bases seed
    await seedCatalogBases();

    let admin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (!admin) {
      const defaultPasswordHash = crypto.createHash('sha256').update('admin123').digest('hex');
      admin = await prisma.user.create({
        data: {
          email: 'admin@acopio.com',
          name: 'Administrador Default',
          role: 'ADMIN',
          password: defaultPasswordHash,
          phone: '0000000000',
          documentId: '00000000'
        }
      });
    }

    return admin;
  } catch (error) {
    console.error('[Auth Middleware] Error getting/creating mock admin:', error);
    throw error;
  }
};

/**
 * Middleware to mock authenticated users and set req.user.
 */
const isAuthenticated = async (req, res, next) => {
  try {
    // In a production system, this would decode a JWT or verify a session cookie.
    // For this MVP, we fetch/create our default ADMIN user to guarantee audit compliance.
    const admin = await getOrCreateMockAdmin();
    req.user = admin;
    next();
  } catch (error) {
    console.error('[Auth Middleware] Authentication failed:', error);
    res.status(500).send('<div class="p-4 bg-red-100 text-red-800 rounded-xl border border-red-200">Error interno de autenticación</div>');
  }
};

/**
 * Middleware to enforce role-based access control (RBAC).
 * @param {string} role Required role (e.g. 'ADMIN', 'VOLUNTEER')
 */
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).send('<div class="p-4 bg-red-100 text-red-800 rounded-xl border border-red-200">No autenticado</div>');
    }

    if (req.user.role === role || req.user.role === 'ADMIN') {
      return next();
    }

    res.status(403).send('<div class="p-4 bg-red-100 text-red-800 rounded-xl border border-red-200">Acceso denegado: rol insuficiente</div>');
  };
};

module.exports = {
  isAuthenticated,
  requireRole
};
