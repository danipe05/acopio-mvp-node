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
            ${criticalDests.length > 0 ? `
              <p class="mt-1.5 text-xs text-red-600 flex items-center space-x-1">
                <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
                <span>Los destinos marcados como <strong>URGENTE</strong> tienen prioridad de despacho inmediato.</span>
              </p>
            ` : ''}
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

/**
 * Renders a single stock table row.
 * @param {Object} row - { item: { name, category, unit }, totalStock }
 */
function stockTableRow(row) {
  return `
    <tr class="hover:bg-gray-50/70 border-b border-gray-100 transition duration-150">
      <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">${row.item.name}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/50">
          ${row.item.category ? row.item.category.name : '—'}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${row.totalStock > 0 ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}">
          ${row.totalStock}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600 hidden sm:table-cell">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-100">
          ${row.item.unit ? row.item.unit.name : '—'}
        </span>
      </td>
    </tr>
  `;
}

/**
 * Renders only the table rows (used by the HTMX search endpoint).
 * @param {Array} stockRows - Array of { item, totalStock }.
 */
function stockTableRows(stockRows) {
  if (stockRows.length === 0) {
    return `
      <tr>
        <td colspan="4" class="px-6 py-10 text-center text-sm text-gray-400">
          <svg class="mx-auto h-8 w-8 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          No se encontraron insumos.
        </td>
      </tr>
    `;
  }

  return stockRows.map(row => stockTableRow(row)).join('');
}

/**
 * Renders the full stock dashboard with search bar and table.
 * @param {Array} stockRows - Array of { item, totalStock }.
 * @param {string} centerName - Name of the current center.
 */
function stockDashboard(stockRows, centerName) {
  return `
    <div class="space-y-6">

      <!-- Page Title -->
      <div>
        <h1 class="text-2xl font-black text-gray-900 tracking-tight flex items-center space-x-2">
          <span class="bg-gradient-to-tr from-blue-500 via-amber-400 to-blue-600 text-white p-2 rounded-xl">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </span>
          <span>Inventario Actual</span>
        </h1>
        <p class="text-sm text-gray-500 mt-1">Stock consolidado en tiempo real del centro <strong class="text-gray-700">${centerName}</strong>.</p>
      </div>

      <!-- Search Bar -->
      <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm relative">
        <div class="flex items-center space-x-3">
          <div class="relative flex-1">
            <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" name="q" placeholder="Buscar insumo por nombre..."
                   hx-get="/volunteer/inventory/stock/search"
                   hx-trigger="keyup changed delay:400ms"
                   hx-target="#stock-table-body"
                   hx-indicator="#search-spinner"
                   class="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition" />
          </div>
          <span id="search-spinner" class="htmx-indicator flex items-center">
            <svg class="animate-spin h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
        </div>
      </div>

      <!-- Stock Table -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-100">
            <thead class="bg-gray-50/50">
              <tr>
                <th scope="col" class="px-6 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Insumo</th>
                <th scope="col" class="px-6 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Categoría</th>
                <th scope="col" class="px-6 py-3.5 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Stock</th>
                <th scope="col" class="px-6 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Unidad</th>
              </tr>
            </thead>
            <tbody id="stock-table-body" class="divide-y divide-gray-100">
              ${stockTableRows(stockRows)}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

/**
 * Renders a single row in the movements table.
 * If isLast is true and we have a nextPage, attaches HTMX infinite scroll triggers.
 *
 * @param {Object} movement - The movement object.
 * @param {boolean} isLast - Whether this is the last element in the current page.
 * @param {number} [nextPage] - The number of the next page to fetch.
 */
function movementTableRow(movement, isLast = false, nextPage = null) {
  const typeText = movement.type === 'IN' ? 'Entrada' : 'Salida';
  const typeClass = movement.type === 'IN' 
    ? 'bg-green-50 text-green-700 border-green-200' 
    : 'bg-red-50 text-red-700 border-red-200';
  const quantityText = `${movement.quantity} ${movement.item.unit ? movement.item.unit.name : 'Unidades'}`;
  const destinationText = movement.type === 'OUT' && movement.destination 
    ? `<span class="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded ${movement.destination.isCritical ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}">${movement.destination.isCritical ? '🚨 ' : ''}${movement.destination.name}</span>`
    : '<span class="text-gray-400">—</span>';
  
  const creatorName = movement.createdBy ? movement.createdBy.name : 'Sistema';
  const formattedDate = new Date(movement.createdAt).toLocaleString('es-VE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const htmxAttrs = isLast && nextPage 
    ? ` hx-get="/volunteer/inventory/movements?page=${nextPage}" hx-trigger="revealed" hx-swap="afterend"` 
    : '';

  return `
    <tr class="hover:bg-gray-50/70 border-b border-gray-100 transition duration-150"${htmxAttrs}>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold">
        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${typeClass}">
          ${typeText === 'Entrada' ? '📥' : '📤'} ${typeText}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold">
        ${movement.item.name}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right sm:text-left">
        ${quantityText}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm hidden sm:table-cell">
        ${destinationText}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
        ${creatorName}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono hidden sm:table-cell">
        ${formattedDate}
      </td>
    </tr>
  `;
}

/**
 * Maps an array of movements to rows, applying infinite scroll logic to the last item.
 */
function movementTableRows(movements, page = 1, limit = 20) {
  if (movements.length === 0) {
    if (page === 1) {
      return `
        <tr>
          <td colspan="6" class="px-6 py-10 text-center text-sm text-gray-400">
            <svg class="mx-auto h-8 w-8 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            No hay movimientos registrados.
          </td>
        </tr>
      `;
    }
    // For later pages, return empty response so HTMX doesn't append anything
    return '';
  }

  // If we fetched a full page, there might be a next page.
  const hasMore = movements.length === limit;
  const nextPage = hasMore ? page + 1 : null;

  return movements.map((movement, idx) => {
    const isLast = idx === movements.length - 1;
    return movementTableRow(movement, isLast, nextPage);
  }).join('');
}

/**
 * Renders the initial dashboard wrapper for movements history.
 */
function movementsHistoryDashboard(movements, centerName, page = 1, limit = 20) {
  return `
    <div class="space-y-6">

      <!-- Page Title -->
      <div>
        <h1 class="text-2xl font-black text-gray-900 tracking-tight flex items-center space-x-2">
          <span class="bg-gradient-to-tr from-[#0b1c3f] via-blue-800 to-amber-500 text-white p-2 rounded-xl">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <span>Historial de Movimientos</span>
        </h1>
        <p class="text-sm text-gray-500 mt-1">Bitácora cronológica de entradas y salidas en el centro <strong class="text-gray-700">${centerName}</strong>.</p>
      </div>

      <!-- History Table Container -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-100">
            <thead class="bg-gray-50/50">
              <tr>
                <th scope="col" class="px-6 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Operación</th>
                <th scope="col" class="px-6 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Insumo</th>
                <th scope="col" class="px-6 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Cantidad</th>
                <th scope="col" class="px-6 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Destino</th>
                <th scope="col" class="px-6 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Registrado por</th>
                <th scope="col" class="px-6 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Fecha y Hora</th>
              </tr>
            </thead>
            <tbody id="movements-table-body" class="divide-y divide-gray-100">
              ${movementTableRows(movements, page, limit)}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

module.exports = {
  errorBanner,
  successBanner,
  registerEntryForm,
  registerExitForm,
  stockTableRows,
  stockDashboard,
  movementTableRow,
  movementTableRows,
  movementsHistoryDashboard
};

