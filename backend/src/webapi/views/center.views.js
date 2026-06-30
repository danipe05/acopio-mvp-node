/**
 * Tailwind-styled HTML Templates for Center Management (HTMX Partials)
 */

/**
 * Renders the error banner partial to be placed inside the form.
 * @param {string} message Error message
 */
function errorBanner(message) {
  return `
    <div id="error-banner" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-pulse mb-4">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-semibold text-red-800">Error de Validación</h3>
          <p class="text-xs text-red-700 mt-1 font-medium">${message}</p>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renders the creation form partial.
 */
function newCenterForm() {
  return `
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6 transition duration-200 relative overflow-hidden">
      <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-blue-500 to-red-500"></div>
      
      <div class="flex items-center justify-between border-b border-gray-50 pb-4">
        <div>
          <h2 class="text-lg font-bold text-gray-800">Nuevo Centro de Acopio</h2>
          <p class="text-xs text-gray-400">Registrar un nuevo punto de recepción física.</p>
        </div>
        <button onclick="document.getElementById('center-form-container').innerHTML = ''" class="text-gray-400 hover:text-gray-600 transition">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Contenedor para inyección de alertas de error de validación -->
      <div id="form-error-container"></div>

      <form hx-post="/api/admin/centers" 
            hx-target="#centers-list" 
            hx-swap="outerHTML" 
            hx-indicator="#submit-spinner"
            class="space-y-4">
        
        <div>
          <label for="name" class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nombre del Centro</label>
          <input type="text" name="name" id="name" required placeholder="Ej. Centro Deportivo Norte"
                 class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition" />
        </div>

        <div>
          <label for="address" class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Dirección Física</label>
          <input type="text" name="address" id="address" required placeholder="Ej. Av. Bolívar, Caracas"
                 class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition" />
        </div>

        <div>
          <label for="status" class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Estado Operativo</label>
          <select name="status" id="status" 
                  class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition">
            <option value="ACTIVE" selected>Activo (Operativo)</option>
            <option value="INACTIVE">Inactivo (Temporalmente cerrado)</option>
          </select>
        </div>

        <div class="flex items-center space-x-3 pt-2">
          <button type="submit" 
                  class="flex-1 bg-[#0b1c3f] hover:bg-[#00244e] text-white border border-amber-500/20 hover:border-amber-500/50 font-semibold py-2.5 px-4 rounded-xl shadow-sm hover:shadow transition flex items-center justify-center space-x-2">
            <span id="submit-spinner" class="htmx-indicator animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
            <span>Registrar Centro</span>
          </button>
          
          <button type="button" 
                  onclick="document.getElementById('center-form-container').innerHTML = ''"
                  class="bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2.5 px-4 rounded-xl transition">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  `;
}

/**
 * Renders the editing form partial.
 * @param {object} center Center model instance
 */
function editCenterForm(center) {
  return `
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6 transition duration-200 relative overflow-hidden">
      <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-blue-500 to-red-500"></div>

      <div class="flex items-center justify-between border-b border-gray-50 pb-4">
        <div>
          <h2 class="text-lg font-bold text-gray-800">Modificar Centro</h2>
          <p class="text-xs text-gray-400">Actualizar información del centro de acopio.</p>
        </div>
        <button onclick="document.getElementById('center-form-container').innerHTML = ''" class="text-gray-400 hover:text-gray-600 transition">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Contenedor para inyección de alertas de error de validación -->
      <div id="form-error-container"></div>

      <form hx-put="/api/admin/centers/${center.id}" 
            hx-target="#centers-list" 
            hx-swap="outerHTML" 
            hx-indicator="#submit-spinner"
            class="space-y-4">
        
        <div>
          <label for="name" class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nombre del Centro</label>
          <input type="text" name="name" id="name" required value="${center.name}"
                 class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition" />
        </div>

        <div>
          <label for="address" class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Dirección Física</label>
          <input type="text" name="address" id="address" required value="${center.address}"
                 class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition" />
        </div>

        <div>
          <label for="status" class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Estado Operativo</label>
          <select name="status" id="status" 
                  class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition">
            <option value="ACTIVE" ${center.status === 'ACTIVE' ? 'selected' : ''}>Activo (Operativo)</option>
            <option value="INACTIVE" ${center.status === 'INACTIVE' ? 'selected' : ''}>Inactivo (Temporalmente cerrado)</option>
          </select>
        </div>

        <div class="flex items-center space-x-3 pt-2">
          <button type="submit" 
                  class="flex-1 bg-[#0b1c3f] hover:bg-[#00244e] text-white border border-amber-500/20 hover:border-amber-500/50 font-semibold py-2.5 px-4 rounded-xl shadow-sm hover:shadow transition flex items-center justify-center space-x-2">
            <span id="submit-spinner" class="htmx-indicator animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
            <span>Guardar Cambios</span>
          </button>
          
          <button type="button" 
                  onclick="document.getElementById('center-form-container').innerHTML = ''"
                  class="bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2.5 px-4 rounded-xl transition">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  `;
}

/**
 * Renders the table list of centers.
 * @param {Array} centers Array of center models
 */
function centersList(centers) {
  // Generate rows
  const rows = centers.length === 0 
    ? `
      <tr>
        <td colspan="4" class="px-6 py-10 text-center text-sm text-gray-400">
          <svg class="mx-auto h-8 w-8 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2M19 11V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          No hay centros de acopio registrados.
        </td>
      </tr>
    `
    : centers.map(center => `
      <tr class="hover:bg-gray-50/70 border-b border-gray-100 transition duration-150">
        <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">${center.name}</td>
        <td class="px-6 py-4 text-sm text-gray-500">${center.address}</td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wider ${
            center.status === 'ACTIVE' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }">
            <span class="h-1.5 w-1.5 rounded-full mr-1.5 ${center.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}"></span>
            ${center.status === 'ACTIVE' ? 'ACTIVO' : 'INACTIVO'}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
          <button hx-get="/api/admin/centers/${center.id}/edit" 
                  hx-target="#center-form-container" 
                  hx-swap="innerHTML"
                  class="text-blue-800 hover:text-[#0b1c3f] font-semibold transition flex items-center justify-end space-x-1.5 ml-auto group">
            <svg class="w-4 h-4 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Editar</span>
          </button>
        </td>
      </tr>
    `).join('');

  return `
    <div id="centers-list" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-100">
          <thead class="bg-gray-50/50">
            <tr>
              <th scope="col" class="px-6 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Nombre</th>
              <th scope="col" class="px-6 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Dirección</th>
              <th scope="col" class="px-6 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</th>
              <th scope="col" class="relative px-6 py-3.5"><span class="sr-only">Acciones</span></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            ${rows}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/**
 * Renders the main administration panel for centers (view layout + controls + empty placeholders).
 * @param {Array} centers Array of centers
 */
function centersDashboard(centers) {
  return `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 class="text-2xl font-black text-gray-900 tracking-tight flex items-center space-x-2">
            <span class="bg-gradient-to-tr from-amber-400 via-blue-500 to-red-500 text-white p-2 rounded-xl">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </span>
            <span>Centros de Acopio</span>
          </h1>
          <p class="text-sm text-gray-500 mt-1">Configuración y alta de centros de distribución de ayuda a nivel nacional.</p>
        </div>
        
        <button hx-get="/api/admin/centers/new" 
                hx-target="#center-form-container" 
                hx-swap="innerHTML" 
                class="inline-flex items-center justify-center space-x-2 bg-[#0b1c3f] hover:bg-[#00244e] text-white border border-amber-500/20 hover:border-amber-500/50 font-semibold py-2.5 px-5 rounded-xl shadow-sm hover:shadow transition duration-150">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Nuevo Centro</span>
        </button>
      </div>

      <!-- Contenedor dinámico para formularios de Creación / Edición -->
      <div id="center-form-container" class="transition-all duration-300"></div>

      <!-- Tabla / Lista de centros de acopio -->
      ${centersList(centers)}
    </div>
  `;
}

module.exports = {
  errorBanner,
  newCenterForm,
  editCenterForm,
  centersList,
  centersDashboard
};
