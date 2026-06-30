/**
 * Tailwind-styled HTML Templates for Authentication Views (Landing, Login, and Registration)
 */

/**
 * HTML Layout wrapper for Auth screens.
 */
function authLayout(content) {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>AcopioCentral — Portal de Acceso</title>
      <link rel="stylesheet" href="/output.css">
      <script src="https://unpkg.com/htmx.org@1.9.12"></script>
      <!-- Google Fonts Outfit -->
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Outfit', sans-serif;
        }
      </style>
      <script>
        // Setup HTMX to handle validation errors (status 400/401)
        document.addEventListener('DOMContentLoaded', () => {
          document.body.addEventListener('htmx:beforeSwap', function(evt) {
            if (evt.detail.xhr.status === 400 || evt.detail.xhr.status === 401) {
              evt.detail.shouldSwap = true;
              evt.detail.isError = false;
            }
          });
        });
      </script>
    </head>
    <body class="bg-gray-50/50 min-h-screen flex items-center justify-center p-4 relative antialiased">
      <!-- Decorative background blur blobs -->
      <div class="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl -z-10"></div>
      <div class="absolute bottom-1/4 right-1/4 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl -z-10"></div>

      <div class="w-full max-w-md">
        ${content}
      </div>
    </body>
    </html>
  `;
}

/**
 * Alert banner for rendering errors within the form.
 */
function authErrorAlert(message) {
  return `
    <div id="auth-alert" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl animate-pulse mb-4">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-xs font-bold text-red-800 uppercase tracking-wider">Error de Acceso</h3>
          <p class="text-xs text-red-700 mt-0.5 font-medium">${message}</p>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renders the Login View.
 */
function loginPage() {
  return `
    <div class="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 space-y-6 relative overflow-hidden" 
         style="max-width: 420px; width: 100%; margin: 0 auto;">
      <!-- Top Venezuela flag tricolor line -->
      <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-blue-500 to-red-500"></div>

      <!-- Header -->
      <div class="text-center space-y-2">
        <div class="mx-auto h-12 w-12 bg-gradient-to-tr from-amber-400 via-blue-500 to-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
          <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2M19 11V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-black text-gray-900 tracking-tight">AcopioCentral</h2>
          <p class="text-xs text-gray-400">Portal de Acceso de Ayuda Humanitaria</p>
        </div>
      </div>

      <!-- Error Container for HTMX -->
      <div id="auth-error-container"></div>

      <!-- Login Form -->
      <form hx-post="/auth/login" 
            hx-target="#auth-error-container" 
            hx-indicator="#login-spinner"
            class="space-y-4">
        
        <div>
          <label for="email" class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Correo Electrónico</label>
          <input type="email" name="email" id="email" required placeholder="ejemplo@acopio.com"
                 class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition" />
        </div>

        <div>
          <label for="password" class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Contraseña</label>
          <input type="password" name="password" id="password" required placeholder="••••••••"
                 class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition" />
        </div>

        <button type="submit" 
                class="w-full bg-[#081024] hover:bg-[#00244e] text-white font-bold py-3.5 px-4 rounded-xl transition flex items-center justify-center space-x-2 text-sm shadow-md">
          <span id="login-spinner" class="htmx-indicator animate-spin rounded-full h-4 w-4 border-2 border-amber-400 border-t-transparent mr-1"></span>
          <span>Iniciar Sesión</span>
        </button>
      </form>

      <!-- Footer action -->
      <div class="pt-4 border-t border-gray-100 flex flex-col items-center space-y-2">
        <span class="text-xs text-gray-400 font-semibold">¿Eres un nuevo centro?</span>
        <button hx-get="/auth/register"
                hx-target="body"
                hx-push-url="true"
                class="text-xs font-bold text-blue-600 hover:text-blue-800 transition">
          Crear Centro de Acopio y Administrador
        </button>
      </div>

    </div>
  `;
}

/**
 * Renders the Registration View (Self-Service Onboarding).
 */
function registerPage() {
  return `
    <div class="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 space-y-6 relative overflow-hidden" 
         style="max-width: 460px; width: 100%; margin: 0 auto;">
      <!-- Top Venezuela flag tricolor line -->
      <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-blue-500 to-red-500"></div>

      <!-- Header -->
      <div class="text-center space-y-2">
        <div class="mx-auto h-12 w-12 bg-gradient-to-tr from-amber-400 via-blue-500 to-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
          <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-black text-gray-900 tracking-tight">Crear Centro de Acopio</h2>
          <p class="text-xs text-gray-400">Registra tu centro y cuenta administradora en un paso</p>
        </div>
      </div>

      <!-- Error Container for HTMX -->
      <div id="auth-error-container"></div>

      <!-- Register Form -->
      <form hx-post="/auth/register" 
            hx-target="#auth-error-container" 
            hx-indicator="#register-spinner"
            class="space-y-4">
        
        <!-- Centro fields -->
        <div class="border-b border-gray-100 pb-3">
          <span class="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-3">Datos del Centro</span>
          <div class="space-y-3">
            <div>
              <label for="centerName" class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nombre del Centro de Acopio</label>
              <input type="text" name="centerName" id="centerName" required placeholder="Ej. Centro de Acopio Caracas"
                     class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition" />
            </div>
            <div>
              <label for="address" class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Dirección Física</label>
              <input type="text" name="address" id="address" required placeholder="Ej. Av. Urdaneta, Edif. Central, Caracas"
                     class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition" />
            </div>
          </div>
        </div>

        <!-- Usuario fields -->
        <div class="pb-2">
          <span class="text-[10px] font-black text-amber-500 uppercase tracking-widest block mb-3">Cuenta Administradora</span>
          <div class="space-y-3">
            <div>
              <label for="userName" class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nombre Completo del Admin</label>
              <input type="text" name="userName" id="userName" required placeholder="Ej. Daniel Pinto"
                     class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label for="documentId" class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Cédula</label>
                <input type="text" name="documentId" id="documentId" required placeholder="Ej. 12345678"
                       class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition" />
              </div>
              <div>
                <label for="phone" class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Teléfono</label>
                <input type="text" name="phone" id="phone" required placeholder="Ej. 04121234567"
                       class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition" />
              </div>
            </div>
            <div>
              <label for="email" class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Correo Electrónico</label>
              <input type="email" name="email" id="email" required placeholder="ejemplo@acopio.com"
                     class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition" />
            </div>
            <div>
              <label for="password" class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Contraseña</label>
              <input type="password" name="password" id="password" required placeholder="Mínimo 6 caracteres"
                     class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition" />
            </div>
          </div>
        </div>

        <button type="submit" 
                class="w-full bg-[#081024] hover:bg-[#00244e] text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center space-x-2 text-sm shadow-md">
          <span id="register-spinner" class="htmx-indicator animate-spin rounded-full h-4 w-4 border-2 border-amber-400 border-t-transparent mr-1"></span>
          <span>Registrar y Crear Centro</span>
        </button>
      </form>

      <!-- Footer action -->
      <div class="pt-4 border-t border-gray-100 flex flex-col items-center space-y-2">
        <span class="text-xs text-gray-400 font-semibold">¿Ya tienes cuenta?</span>
        <button hx-get="/auth/login"
                hx-target="body"
                hx-push-url="true"
                class="text-xs font-bold text-blue-600 hover:text-blue-800 transition">
          Iniciar Sesión
        </button>
      </div>

    </div>
  `;
}

module.exports = {
  authLayout,
  authErrorAlert,
  loginPage,
  registerPage
};
