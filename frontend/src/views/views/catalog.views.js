/**
 * Tailwind-styled HTML Templates for Catalog Management (HTMX Partials)
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
 * Renders a single row in the items table.
 * @param {object} item Item model instance
 */
function itemRow(item) {
  return `
    <tr class="hover:bg-gray-50/70 border-b border-gray-100 transition duration-150">
      <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">${item.name}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/50">
          ${item.category ? item.category.name : 'Sin Categoría'}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-100">
          ${item.unit ? item.unit.name : 'Sin Unidad'}
        </span>
      </td>
    </tr>
  `;
}

/**
 * Renders a single row in the destinations table.
 * Highlights isCritical = true destinations visually.
 * @param {object} dest Destination model instance
 */
function destinationRow(dest) {
  const criticalClass = dest.isCritical 
    ? 'border-l-4 border-l-red-500 bg-red-50/10 hover:bg-red-55/20' 
    : 'hover:bg-gray-50/70';

  const badge = dest.isCritical
    ? `
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-red-100 text-red-800 border border-red-200 animate-pulse">
        <span class="h-1.5 w-1.5 rounded-full mr-1.5 bg-red-600"></span>
        CRÍTICO
      </span>
    `
    : `
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200/50">
        Estándar
      </span>
    `;

  return `
    <tr class="${criticalClass} border-b border-gray-100 transition duration-150">
      <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800 ${dest.isCritical ? 'text-red-750' : ''}">${dest.name}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
        ${badge}
      </td>
    </tr>
  `;
}

/**
 * Renders the items list table container.
 * @param {Array} items
 */
function itemsList(items) {
  const rows = items.length === 0
    ? `
      <tr>
        <td colspan="3" class="px-6 py-8 text-center text-sm text-gray-400">
          No hay insumos registrados en el inventario de donaciones.
        </td>
      </tr>
    `
    : items.map(item => itemRow(item)).join('');

  return `
    <div id="items-list-container" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-5 border-b border-gray-50 flex items-center justify-between">
        <div>
          <h3 class="text-sm font-bold text-gray-800 uppercase tracking-wider">Insumos Estandarizados</h3>
          <p class="text-xs text-gray-400">Artículos disponibles para ingreso/egreso de stock.</p>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-100">
          <thead class="bg-gray-50/50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Nombre</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Categoría</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Unidad</th>
            </tr>
          </thead>
          <tbody id="items-table-body" class="divide-y divide-gray-100">
            ${rows}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/**
 * Renders the destinations list table container.
 * @param {Array} destinations
 */
function destinationsList(destinations) {
  const rows = destinations.length === 0
    ? `
      <tr>
        <td colspan="2" class="px-6 py-8 text-center text-sm text-gray-400">
          No hay destinos registrados.
        </td>
      </tr>
    `
    : destinations.map(dest => destinationRow(dest)).join('');

  return `
    <div id="destinations-list-container" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-5 border-b border-gray-50 flex items-center justify-between">
        <div>
          <h3 class="text-sm font-bold text-gray-800 uppercase tracking-wider">Destinos de Envío</h3>
          <p class="text-xs text-gray-400">Puntos autorizados de entrega final.</p>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-100">
          <thead class="bg-gray-50/50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Nombre del Destino</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Urgencia</th>
            </tr>
          </thead>
          <tbody id="destinations-table-body" class="divide-y divide-gray-100">
            ${rows}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/**
 * Renders the main dashboard for catalog management.
 */
function catalogDashboard(categories, units) {
  const categoryOptions = categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  const unitOptions = units.map(u => `<option value="${u.id}">${u.name}</option>`).join('');

  return `
    <div class="space-y-6">
      
      <!-- Page Title -->
      <div>
        <h1 class="text-2xl font-black text-gray-900 tracking-tight flex items-center space-x-2">
          <span class="bg-gradient-to-tr from-amber-400 via-blue-500 to-red-500 text-white p-2 rounded-xl">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </span>
          <span>Donación de Insumos y Destinos</span>
        </h1>
        <p class="text-sm text-gray-500 mt-1">Estandarizar las donaciones y registrar los destinos oficiales de entrega.</p>
      </div>

      <!-- Main Layout Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        <!-- Left Column: Forms (1/3 Width) -->
        <div class="lg:col-span-1 space-y-6">
          
          <!-- Item Form Card -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4 relative overflow-hidden">
            <div class="absolute top-0 left-0 right-0 h-1 bg-[#0b1c3f]"></div>
            <div>
              <h2 class="text-md font-bold text-gray-800 uppercase tracking-wider">Registrar Insumo</h2>
              <p class="text-xs text-gray-400">Añadir artículo estandarizado al inventario de donaciones.</p>
            </div>
            
            <div id="item-error-container"></div>
            
            <form hx-post="/api/admin/catalog/items" 
                  hx-target="#items-table-body" 
                  hx-swap="afterbegin" 
                  hx-indicator="#item-spinner"
                  class="space-y-3.5">
              <div>
                <label for="item-name" class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nombre</label>
                <input type="text" name="name" id="item-name" required placeholder="Ej. Agua Mineral 1.5L"
                       class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label for="item-category" class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Categoría</label>
                  <select name="categoryId" id="item-category" required
                          class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition">
                    <option value="" disabled selected>Elegir...</option>
                    ${categoryOptions}
                  </select>
                </div>
                <div>
                  <label for="item-unit" class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Unidad</label>
                  <select name="unitId" id="item-unit" required
                          class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition">
                    <option value="" disabled selected>Elegir...</option>
                    ${unitOptions}
                  </select>
                </div>
              </div>
              <button type="submit" 
                      class="w-full bg-[#0b1c3f] hover:bg-[#00244e] text-white border border-amber-500/20 hover:border-amber-500/50 font-semibold py-2.5 px-4 rounded-xl shadow-sm hover:shadow transition flex items-center justify-center space-x-2 text-xs">
                <span id="item-spinner" class="htmx-indicator animate-spin rounded-full h-4.5 w-4.5 border-2 border-white border-t-transparent mr-1"></span>
                <span>Guardar Insumo</span>
              </button>
            </form>
          </div>

          <!-- Destination Form Card -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4 relative overflow-hidden">
            <div class="absolute top-0 left-0 right-0 h-1 bg-red-500"></div>
            <div>
              <h2 class="text-md font-bold text-gray-800 uppercase tracking-wider">Registrar Destino</h2>
              <p class="text-xs text-gray-400">Añadir punto final de entrega (ej. Hospitales, Zonas críticas).</p>
            </div>
            
            <div id="dest-error-container"></div>
            
            <form hx-post="/api/admin/catalog/destinations" 
                  hx-target="#destinations-table-body" 
                  hx-swap="afterbegin" 
                  hx-indicator="#dest-spinner"
                  class="space-y-3.5">
              <div>
                <label for="dest-name" class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nombre del Lugar</label>
                <input type="text" name="name" id="dest-name" required placeholder="Ej. Hospital Central de Caracas"
                       class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition" />
              </div>
              <div class="flex items-center space-x-3.5 py-1">
                <input type="checkbox" name="isCritical" id="dest-is-critical" value="true"
                       class="h-4.5 w-4.5 text-red-600 focus:ring-red-500 border-gray-300 rounded cursor-pointer" />
                <label for="dest-is-critical" class="text-xs font-semibold text-gray-600 cursor-pointer select-none">
                  Marcar como destino crítico (Urgencia Máxima)
                </label>
              </div>
              <button type="submit" 
                      class="w-full bg-[#0b1c3f] hover:bg-[#00244e] text-white border border-amber-500/20 hover:border-amber-500/50 font-semibold py-2.5 px-4 rounded-xl shadow-sm hover:shadow transition flex items-center justify-center space-x-2 text-xs">
                <span id="dest-spinner" class="htmx-indicator animate-spin rounded-full h-4.5 w-4.5 border-2 border-white border-t-transparent mr-1"></span>
                <span>Guardar Destino</span>
              </button>
            </form>
          </div>

        </div>

        <!-- Right Column: Async Tables Lists (2/3 Width) -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Async Items List Placeholder -->
          <div hx-get="/api/admin/catalog/items" hx-trigger="load" hx-swap="outerHTML">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col justify-center items-center space-y-3">
              <span class="animate-spin rounded-full h-7 w-7 border-2 border-amber-500 border-t-transparent"></span>
              <span class="text-xs font-semibold text-gray-400 uppercase tracking-widest animate-pulse">Cargando Insumos...</span>
            </div>
          </div>

          <!-- Async Destinations List Placeholder -->
          <div hx-get="/api/admin/catalog/destinations" hx-trigger="load" hx-swap="outerHTML">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col justify-center items-center space-y-3">
              <span class="animate-spin rounded-full h-7 w-7 border-2 border-amber-500 border-t-transparent"></span>
              <span class="text-xs font-semibold text-gray-400 uppercase tracking-widest animate-pulse">Cargando Destinos...</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  `;
}

module.exports = {
  errorBanner,
  itemRow,
  destinationRow,
  itemsList,
  destinationsList,
  catalogDashboard
};
