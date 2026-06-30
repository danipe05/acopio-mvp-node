const crypto = require('crypto');
const prisma = require('../../infrastructure/database/prisma-client');

const SESSION_SECRET = 'VenezuelaAcopioCentralMVPSecretKey2026';

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

const parseCookies = (cookieHeader) => {
  const list = {};
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    list[parts.shift().trim()] = decodeURI(parts.join('='));
  });
  return list;
};

const verifyToken = (token) => {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [userId, hmac] = parts;
  const expectedHmac = crypto.createHmac('sha256', SESSION_SECRET).update(userId).digest('hex');
  if (hmac === expectedHmac) {
    return userId;
  }
  return null;
};

/**
 * Cryptographic Signed Cookie Session Middleware.
 */
const isAuthenticated = async (req, res, next) => {
  try {
    await seedCatalogBases();

    const cookies = parseCookies(req.headers.cookie);
    const token = cookies.session_token;
    const userId = verifyToken(token);

    if (!userId) {
      if (req.headers['hx-request']) {
        res.setHeader('HX-Redirect', '/auth/login');
        return res.status(401).send('Sesión expirada o no iniciada. Redirigiendo...');
      } else {
        return res.redirect('/auth/login');
      }
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { center: true }
    });

    if (!user) {
      if (req.headers['hx-request']) {
        res.setHeader('HX-Redirect', '/auth/login');
        return res.status(401).send('Usuario no encontrado. Redirigiendo...');
      } else {
        return res.redirect('/auth/login');
      }
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('[Auth Middleware] Authentication failed:', error);
    if (req.headers['hx-request']) {
      res.setHeader('HX-Redirect', '/auth/login');
      return res.status(401).send('Error de autenticación. Redirigiendo...');
    } else {
      return res.redirect('/auth/login');
    }
  }
};

/**
 * Middleware to enforce role-based access control (RBAC).
 * @param {string} role Required role (e.g. 'ADMIN', 'VOLUNTEER')
 */
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      if (req.headers['hx-request']) {
        res.setHeader('HX-Redirect', '/auth/login');
      }
      return res.status(401).send('No autenticado');
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
