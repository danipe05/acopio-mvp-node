const prisma = require('../../infrastructure/database/prisma-client');
const RegisterCenterUseCase = require('../../application/use-cases/register-center');
const LoginUseCase = require('../../application/use-cases/login');
const views = require('../views/auth.views');
const crypto = require('crypto');

const registerCenterUseCase = new RegisterCenterUseCase(prisma);
const loginUseCase = new LoginUseCase(prisma);

const SESSION_SECRET = 'VenezuelaAcopioCentralMVPSecretKey2026';

const signToken = (userId) => {
  const hmac = crypto.createHmac('sha256', SESSION_SECRET).update(userId).digest('hex');
  return `${userId}.${hmac}`;
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

const authController = {
  /**
   * GET /auth/login
   * Renders the login page wrapper or fragment.
   */
  getLoginView: async (req, res) => {
    try {
      const cookies = parseCookies(req.headers.cookie);
      const userId = verifyToken(cookies.session_token);
      if (userId) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (user) {
          const redirectPath = user.role === 'ADMIN' ? '/admin/dashboard' : '/volunteer/inventory/stock';
          return res.redirect(redirectPath);
        }
      }
    } catch (e) {
      console.error('[AuthController] Error checking session:', e);
    }

    const html = views.loginPage();
    if (req.headers['hx-request']) {
      res.send(html);
    } else {
      res.send(views.authLayout(html));
    }
  },

  /**
   * GET /auth/register
   * Renders the center registration page.
   */
  getRegisterView: async (req, res) => {
    try {
      const cookies = parseCookies(req.headers.cookie);
      const userId = verifyToken(cookies.session_token);
      if (userId) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (user) {
          const redirectPath = user.role === 'ADMIN' ? '/admin/dashboard' : '/volunteer/inventory/stock';
          return res.redirect(redirectPath);
        }
      }
    } catch (e) {
      console.error('[AuthController] Error checking session:', e);
    }

    const html = views.registerPage();
    if (req.headers['hx-request']) {
      res.send(html);
    } else {
      res.send(views.authLayout(html));
    }
  },

  /**
   * POST /auth/login
   * Validates credentials and writes a signed session cookie.
   */
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await loginUseCase.execute({ email, password });

      const token = signToken(user.id);
      res.setHeader('Set-Cookie', `session_token=${token}; Path=/; HttpOnly; SameSite=Lax`);

      // Redirect depending on user role
      const redirectPath = user.role === 'ADMIN' ? '/admin/dashboard' : '/volunteer/inventory/stock';

      res.setHeader('HX-Redirect', redirectPath);
      res.send('Inicio de sesión exitoso. Redirigiendo...');
    } catch (error) {
      console.error('[AuthController] Login error:', error);
      res.status(401).send(views.authErrorAlert(error.message));
    }
  },

  /**
   * POST /auth/register
   * Performs atomic center + user creation.
   */
  register: async (req, res) => {
    try {
      const { centerName, address, userName, email, password, phone, documentId } = req.body;
      const { user } = await registerCenterUseCase.execute({
        centerName,
        address,
        userName,
        email,
        password,
        phone,
        documentId
      });

      const token = signToken(user.id);
      res.setHeader('Set-Cookie', `session_token=${token}; Path=/; HttpOnly; SameSite=Lax`);

      // Admin redirected to dashboard
      const redirectPath = '/admin/dashboard';
      if (req.headers['hx-request']) {
        res.setHeader('HX-Redirect', redirectPath);
        res.send('Registro completado. Iniciando sesión...');
      } else {
        res.redirect(redirectPath);
      }
    } catch (error) {
      console.error('[AuthController] Registration error:', error);
      res.status(400).send(views.authErrorAlert(error.message));
    }
  },

  /**
   * GET /auth/logout
   * Clears session cookie and redirects.
   */
  logout: (req, res) => {
    res.setHeader('Set-Cookie', 'session_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly');
    if (req.headers['hx-request']) {
      res.setHeader('HX-Redirect', '/auth/login');
      res.send('Cerrando sesión...');
    } else {
      res.redirect('/auth/login');
    }
  }
};

module.exports = authController;
