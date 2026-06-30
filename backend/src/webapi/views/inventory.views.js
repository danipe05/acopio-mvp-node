/**
 * Tailwind-styled HTML Templates for Inventory Operations (HTMX Partials)
 */

/**
 * Renders the error banner partial.
 */
function errorBanner(message) {
  return `
    <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl mb-4">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-semibold text-red-800">Error en Operación</h3>
          <p class="text-xs text-red-700 mt-1 font-medium">${message}</p>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renders the success banner partial.
 */
function successBanner(message) {
  return `
    <div class="bg-green-50 border-l-4 border-green-500 p-4 rounded-xl mb-4">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-semibold text-green-800">Registro Exitoso</h3>
          <p class="text-xs text-green-700 mt-1 font-medium">${message}</p>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renders the stock entry form.
 * @param {Array} items - Catalog items with unit relation.
 */
function registerEntryForm(items) {
  const itemOptions = items.map(item => `
    <option value="${item.id}">${item.name} (${item.unit ? item.unit.name : 'Unidad'})</option>
  `).join('');

  return `
    <div class="max-w-2xl mx-auto space-y-6">
      
      <!-- Page Title -->
      <div>
        <h1 class="text-2xl font-black text-gray-900 tracking-tight flex items-center space-x-2">
          <span class="bg-gradient-to-tr from-amber-400 via-blue-500 to-red-500 text-white p-2 rounded-xl">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </span>
          <span>Registrar Entrada de Inventario</span>
        </h1>
        <p class="text-sm text-gray-500 mt-1">Registrar donaciones o cargamentos de ayuda entrantes al centro de acopio.</p>
      </div>

      <!-- Form Card -->
      <div class="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm relative overflow-hidden">
        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-blue-500 to-red-500"></div>

        <!-- Feedback Container for HTMX -->
        <div id="feedback-container"></div>

        <form hx-post="/api/volunteer/inventory/in" 
              hx-target="#feedback-container" 
              hx-swap="innerHTML" 
              hx-indicator="#submit-spinner"
              class="space-y-5">
              
          <div>
            <label for="itemId" class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Insumo</label>
            <select name="itemId" id="itemId" required
                    class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition cursor-pointer">
              <option value="" disabled selected>Seleccione el insumo a registrar...</option>
              ${itemOptions}
            </select>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="quantity" class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Cantidad Recibida</label>
              <input type="number" name="quantity" id="quantity" required min="1" placeholder="Ej. 250"
                     class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition" />
            </div>
            <div>
              <label for="origin" class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Origen / Donante</label>
              <input type="text" name="origin" id="origin" required placeholder="Ej. Cruz Roja Venezolana"
                     class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition" />
            </div>
          </div>

          <div class="pt-4 border-t border-gray-50 flex justify-end">
            <button type="submit" 
                    class="bg-[#0b1c3f] hover:bg-[#00244e] text-white border border-amber-500/20 hover:border-amber-500/50 font-bold py-3 px-6 rounded-xl shadow-sm hover:shadow transition flex items-center space-x-2 text-sm">
              <span id="submit-spinner" class="htmx-indicator animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-1"></span>
              <span>Registrar Entrada</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  `;
}

/**
 * Renders the stock exit form.
 * Destinations marked as critical are grouped in a separate optgroup.
 * @param {Array} items - Catalog items with unit relation.
 * @param {Array} destinations - Destinations sorted by isCritical desc.
 */
function registerExitForm(items, destinations) {
  const itemOptions = items.map(item => `
    <option value="${item.id}">${item.name} (${item.unit ? item.unit.name : 'Unidad'})</option>
  `).join('');

  const criticalDests = destinations.filter(d => d.isCritical);
  const normalDests = destinations.filter(d => !d.isCritical);

  let destinationOptions = '';
  if (criticalDests.length > 0) {
    destinationOptions += `<optgroup label="🚨 Destinos Críticos (Urgencia Máxima)">`;
    destinationOptions += criticalDests.map(d => `<option value="${d.id}">⚠️ ${d.name}</option>`).join('');
    destinationOptions += `</optgroup>`;
  }
  if (normalDests.length > 0) {
    destinationOptions += `<optgroup label="Destinos Regulares">`;
    destinationOptions += normalDests.map(d => `<option value="${d.id}">${d.name}</option>`).join('');
    destinationOptions += `</optgroup>`;
  }

  return `
    <div class="max-w-2xl mx-auto space-y-6">
      
      <!-- Page Title -->
      <div>
        <h1 class="text-2xl font-black text-gray-900 tracking-tight flex items-center space-x-2">
          <span class="bg-gradient-to-tr from-red-500 via-amber-400 to-amber-500 text-white p-2 rounded-xl">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </span>
          <span>Registrar Salida de Inventario</span>
        </h1>
        <p class="text-sm text-gray-500 mt-1">Despachar insumos hacia un destino oficial de entrega. Se descuenta automáticamente del stock usando estrategia FIFO.</p>
      </div>

      <!-- Form Card -->
      <div class="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm relative overflow-hidden">
        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-400 to-amber-500"></div>

        <!-- Feedback Container for HTMX -->
        <div id="exit-feedback-container"></div>

        <form hx-post="/api/volunteer/inventory/out" 
              hx-target="#exit-feedback-container" 
              hx-swap="innerHTML" 
              hx-indicator="#exit-submit-spinner"
              class="space-y-5">
              
          <div>
            <label for="exit-itemId" class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Insumo a Despachar</label>
            <select name="itemId" id="exit-itemId" required
                    class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:bg-white transition cursor-pointer">
              <option value="" disabled selected>Seleccione el insumo a despachar...</option>
              ${itemOptions}
            </select>
          </div>

          <div>
            <label for="exit-destinationId" class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Destino de Envío</label>
            <select name="destinationId" id="exit-destinationId" required
                    class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:bg-white transition cursor-pointer">
              <option value="" disabled selected>Seleccione el destino de entrega...</option>
              ${destinationOptions}
            </select>
          </div>

          <div>
            <label for="exit-quantity" class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Cantidad a Enviar</label>
            <input type="number" name="quantity" id="exit-quantity" required min="1" placeholder="Ej. 100"
                   class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:bg-white transition" />
          </div>

          <div class="pt-4 border-t border-gray-50 flex justify-end">
            <button type="submit" 
                    class="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl shadow-sm hover:shadow transition flex items-center space-x-2 text-sm">
              <span id="exit-submit-spinner" class="htmx-indicator animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-1"></span>
              <span>Despachar Salida</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  `;
}

module.exports = {
  errorBanner,
  successBanner,
  registerEntryForm,
  registerExitForm
};
