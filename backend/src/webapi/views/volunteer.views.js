/**
 * Tailwind-styled HTML Templates for Volunteer Management (HTMX Partials)
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
 * Renders a single row in the volunteers table.
 * Used for inserting newly created volunteers dynamically.
 * @param {object} volunteer User model instance
 */
function volunteerRow(volunteer) {
  const centerName = volunteer.center ? volunteer.center.name : 'No asignado';
  return `
    <tr class="hover:bg-gray-50/70 border-b border-gray-100 transition duration-150">
      <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">${volunteer.name}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">${volunteer.documentId}</td>
      <td class="px-6 py-4 text-sm text-gray-500">${volunteer.email}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">${volunteer.phone}</td>
      <td class="px-6 py-4 text-sm font-medium text-gray-600">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-100">
          ${centerName}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
        <button hx-delete="/api/admin/volunteers/${volunteer.id}" 
                hx-confirm="¿Seguro que desea dar de baja y suspender a este voluntario?" 
                hx-target="closest tr" 
                hx-swap="outerHTML"
                class="text-red-600 hover:text-red-800 font-semibold transition flex items-center justify-end space-x-1 ml-auto group">
          <svg class="w-4 h-4 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>Suspender</span>
        </button>
      </td>
    </tr>
  `;
}

/**
 * Renders the creation form for adding a volunteer.
 * @param {Array} centers List of available active centers
 */
function newVolunteerForm(centers) {
  const options = centers.length === 0
    ? '<option value="" disabled>No hay centros activos. Registra un centro primero.</option>'
    : centers.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

  return `
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6 relative overflow-hidden">
      <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-blue-500 to-red-500"></div>

      <div>
        <h2 class="text-lg font-bold text-gray-800">Crear Voluntario</h2>
        <p class="text-xs text-gray-400">Registrar y asignar un voluntario a un centro.</p>
      </div>

      <!-- Contenedor para inyección de alertas de error -->
      <div id="form-error-container"></div>

      <form hx-post="/api/admin/volunteers" 
            hx-target="#volunteers-table-body" 
            hx-swap="afterbegin" 
            hx-indicator="#submit-spinner"
            class="space-y-4">
        
        <div>
          <label for="name" class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nombre Completo</label>
          <input type="text" name="name" id="name" required placeholder="Ej. Daniel Pinto"
                 class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="documentId" class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Cédula</label>
            <input type="text" name="documentId" id="documentId" required placeholder="Ej. 12345678"
                   class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition" />
          </div>

          <div>
            <label for="phone" class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Teléfono</label>
            <input type="text" name="phone" id="phone" required placeholder="Ej. +56912345678"
                   class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition" />
          </div>
        </div>

        <div>
          <label for="email" class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Correo Electrónico</label>
          <input type="email" name="email" id="email" required placeholder="correo@gmail.com"
                 class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition" />
        </div>

        <div>
          <label for="password" class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Contraseña Inicial</label>
          <input type="password" name="password" id="password" required placeholder="Contraseña temporal (mín. 6)"
                 class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition" />
        </div>

        <div>
          <label for="centerId" class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Centro de Acopio Asignado</label>
          <select name="centerId" id="centerId" required
                  class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition">
            <option value="" disabled selected>Seleccione un centro...</option>
            ${options}
          </select>
        </div>

        <button type="submit" 
                class="w-full bg-[#0b1c3f] hover:bg-[#00244e] text-white border border-amber-500/20 hover:border-amber-500/50 font-semibold py-2.5 px-4 rounded-xl shadow-sm hover:shadow transition flex items-center justify-center space-x-2">
          <span id="submit-spinner" class="htmx-indicator animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
          <span>Crear Voluntario</span>
        </button>
      </form>
    </div>
  `;
}

/**
 * Renders the full volunteers administration dashboard.
 * @param {Array} volunteers List of volunteers
 * @param {Array} centers List of active centers
 * @param {boolean} hasMore Does another page of volunteers exist?
 * @param {number} currentPage Current page number
 */
function volunteersDashboard(volunteers, centers, hasMore = false, currentPage = 1) {
  let rows = volunteers.length === 0
    ? `
      <tr id="empty-row">
        <td colspan="6" class="px-6 py-10 text-center text-sm text-gray-400">
          <svg class="mx-auto h-8 w-8 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          No hay voluntarios registrados.
        </td>
      </tr>
    `
    : volunteers.map(volunteer => volunteerRow(volunteer)).join('');

  // Append pagination trigger if there are more records
  if (hasMore) {
    rows += `
      <tr id="revealer-row">
        <td colspan="6" class="px-6 py-4 text-center text-xs text-gray-400">
          <div hx-get="/api/admin/volunteers?page=${currentPage + 1}"
               hx-trigger="revealed"
               hx-target="#revealer-row"
               hx-swap="outerHTML"
               class="flex items-center justify-center space-x-2 text-blue-800 font-semibold cursor-pointer">
            <span class="animate-spin rounded-full h-3.5 w-3.5 border-2 border-blue-800 border-t-transparent"></span>
            <span>Cargando más voluntarios...</span>
          </div>
        </td>
      </tr>
    `;
  }

  return `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-black text-gray-900 tracking-tight flex items-center space-x-2">
          <span class="bg-gradient-to-tr from-amber-400 via-blue-500 to-red-500 text-white p-2 rounded-xl">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </span>
          <span>Gestión de Voluntarios</span>
        </h1>
        <p class="text-sm text-gray-500 mt-1">Registrar credenciales y asignar voluntarios a los centros de acopio nacionales.</p>
      </div>

      <!-- Diseño a dos columnas (Formulario + Tabla) -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        <!-- Formulario (1 Columna en desktop) -->
        <div class="lg:col-span-1">
          ${newVolunteerForm(centers)}
        </div>

        <!-- Tabla (2 Columnas en desktop) -->
        <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-100">
              <thead class="bg-gray-50/50">
                <tr>
                  <th scope="col" class="px-6 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Nombre</th>
                  <th scope="col" class="px-6 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Cédula</th>
                  <th scope="col" class="px-6 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Correo</th>
                  <th scope="col" class="px-6 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Teléfono</th>
                  <th scope="col" class="px-6 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Centro</th>
                  <th scope="col" class="relative px-6 py-3.5"><span class="sr-only">Acciones</span></th>
                </tr>
              </thead>
              <tbody id="volunteers-table-body" class="divide-y divide-gray-100">
                ${rows}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  `;
}

module.exports = {
  errorBanner,
  volunteerRow,
  newVolunteerForm,
  volunteersDashboard
};
