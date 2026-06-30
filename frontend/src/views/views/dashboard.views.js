/**
 * Tailwind-styled HTML Templates for the Main Dashboard (HTMX Partials)
 */

/**
 * Renders a stats card.
 */
function statsCard({ title, value, subtext, iconSvg, colorClass }) {
  return `
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-start space-x-4 relative overflow-hidden group hover:shadow transition duration-200">
      <div class="absolute top-0 left-0 w-1 h-full ${colorClass}"></div>
      <div class="p-3 bg-gray-50 rounded-xl text-gray-700 group-hover:bg-gray-100 transition shrink-0">
        ${iconSvg}
      </div>
      <div class="space-y-1">
        <span class="text-xs font-bold text-gray-400 uppercase tracking-widest block">${title}</span>
        <span class="text-2xl font-black text-gray-800 block">${value}</span>
        <span class="text-xs text-gray-500 font-medium block">${subtext}</span>
      </div>
    </div>
  `;
}

/**
 * Renders the top product bar item.
 */
function topProductBar({ name, quantity, percentage, barColorClass }) {
  return `
    <div class="space-y-2">
      <div class="flex justify-between text-sm">
        <span class="font-semibold text-gray-700">${name}</span>
        <span class="font-bold text-[#0b1c3f]">${quantity.toLocaleString()}</span>
      </div>
      <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
        <div class="h-full rounded-full ${barColorClass} transition-all duration-500" style="width: ${percentage}%"></div>
      </div>
    </div>
  `;
}

/**
 * Renders the dashboard stats container.
 */
/**
 * Renders the dashboard stats container.
 */
function dashboardStatsHTML({
  centersTotal,
  centersActive,
  volunteersCount,
  batchesCount,
  totalStock,
  totalIn,
  totalOut,
  topCenters,
  topProducts,
  isMockData
}) {
  const activePercent = centersTotal > 0 ? Math.round((centersActive / centersTotal) * 100) : 0;
  
  // Stats cards data
  const cards = [
    statsCard({
      title: "Centros Operativos",
      value: `${centersActive} / ${centersTotal}`,
      subtext: `${activePercent}% de los centros activos`,
      iconSvg: `
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      `,
      colorClass: "bg-amber-400"
    }),
    statsCard({
      title: "Voluntarios Activos",
      value: volunteersCount.toString(),
      subtext: "Personal desplegado a nivel nacional",
      iconSvg: `
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      `,
      colorClass: "bg-blue-500"
    }),
    statsCard({
      title: "Entradas (Histórico)",
      value: `${totalIn.toLocaleString()} unds`,
      subtext: "Total de ayuda recibida",
      iconSvg: `
        <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      `,
      colorClass: "bg-green-500"
    }),
    statsCard({
      title: "Salidas (Histórico)",
      value: `${totalOut.toLocaleString()} unds`,
      subtext: "Total de ayuda despachada",
      iconSvg: `
        <svg class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      `,
      colorClass: "bg-red-500"
    })
  ].join('');

  // Top products calculation
  const maxQty = topProducts.length > 0 ? Math.max(...topProducts.map(p => p.quantity)) : 1;
  const barColors = [
    "bg-amber-400",
    "bg-blue-600",
    "bg-[#0b1c3f]",
    "bg-red-500",
    "bg-red-600"
  ];

  const productsHTML = topProducts.map((p, index) => {
    const percentage = Math.round((p.quantity / maxQty) * 100);
    const color = barColors[index % barColors.length];
    return topProductBar({
      name: p.name,
      quantity: p.quantity,
      percentage: percentage,
      barColorClass: color
    });
  }).join('');

  // Top Centers HTML
  const maxCenterMoves = topCenters.length > 0 ? Math.max(...topCenters.map(tc => tc.count)) : 1;
  const topCentersHTML = topCenters.length === 0
    ? `<div class="text-xs text-gray-400 py-2 text-center">No hay actividad de movimientos registrada en ningún centro.</div>`
    : topCenters.map((c, index) => {
        const percentage = Math.round((c.count / maxCenterMoves) * 100);
        return `
          <div class="space-y-1.5">
            <div class="flex justify-between text-xs">
              <span class="font-semibold text-gray-700">${index + 1}. ${c.name}</span>
              <span class="font-bold text-[#0b1c3f]">${c.count} operaciones</span>
            </div>
            <div class="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div class="h-full bg-blue-500 rounded-full transition-all duration-500" style="width: ${percentage}%"></div>
            </div>
          </div>
        `;
      }).join('');

  // Flows percentage calculation (Entries vs Exits)
  const totalFlow = totalIn + totalOut;
  const inPercent = totalFlow > 0 ? Math.round((totalIn / totalFlow) * 100) : 50;
  const outPercent = totalFlow > 0 ? 100 - inPercent : 50;

  // Get current date formatted
  const currentDate = new Date().toLocaleDateString('es-VE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <div class="space-y-6">
      
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        ${cards}
      </div>

      <!-- Comparative Flow Section (Tailwind visual bar) -->
      <div class="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div>
          <h2 class="text-lg font-bold text-gray-800">Distribución de Flujo Nacional</h2>
          <p class="text-xs text-gray-400">Proporción general entre insumos ingresados y egresados de la red de acopio.</p>
        </div>
        
        <div class="space-y-2">
          <div class="flex justify-between text-xs font-bold">
            <span class="text-green-700">Entradas: ${inPercent}% (${totalIn.toLocaleString()} unds)</span>
            <span class="text-red-600">Salidas: ${outPercent}% (${totalOut.toLocaleString()} unds)</span>
          </div>
          <div class="w-full h-4 rounded-full flex overflow-hidden bg-gray-100">
            <div class="h-full bg-green-500 transition-all duration-500" style="width: ${inPercent}%"></div>
            <div class="h-full bg-red-500 transition-all duration-500" style="width: ${outPercent}%"></div>
          </div>
        </div>
      </div>

      <!-- Detail Charts & Controls -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Left Side: Top Products In Stock -->
        <div class="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6 relative overflow-hidden">
          <div class="flex items-center justify-between border-b border-gray-50 pb-4">
            <div>
              <h2 class="text-lg font-bold text-gray-800">Top Productos en Almacén</h2>
              <p class="text-xs text-gray-400">Categorías de ayuda humanitaria con mayor disponibilidad en la red.</p>
            </div>
            ${isMockData ? `
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                Datos Demostrativos
              </span>
            ` : `
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-800 border border-green-200">
                Datos Reales
              </span>
            `}
          </div>

          <div class="space-y-5">
            ${productsHTML}
          </div>
        </div>

        <!-- Right Side: Top Centers -->
        <div class="space-y-6">
          
          <!-- Top 3 Centers Card -->
          <div class="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div class="border-b border-gray-50 pb-3">
              <h2 class="text-base font-bold text-gray-800">Top 3 Centros con más Actividad</h2>
              <p class="text-[11px] text-gray-400">Centros de acopio con mayor volumen transaccional.</p>
            </div>
            <div class="space-y-3.5">
              ${topCentersHTML}
            </div>
          </div>

        </div>

      </div>
    </div>
  `;
}

/**
 * Renders the outer shell container that auto-refreshes every 60s via HTMX polling.
 */
function dashboardShell() {
  return `
    <div class="space-y-6">
      
      <!-- Dashboard Welcome Banner (Tricolor Accent) -->
      <div class="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 relative overflow-hidden">
        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-blue-500 to-red-500"></div>
        <div>
          <h1 class="text-2xl font-black text-gray-900 tracking-tight flex items-center space-x-2">
            <span>Panel de Telemetría Nacional</span>
          </h1>
          <p class="text-sm text-gray-500 mt-1">Supervisión en tiempo real de insumos, personal y logística de emergencia.</p>
        </div>
        <div class="bg-[#0b1c3f] border border-amber-500/20 px-4 py-2 rounded-2xl flex items-center space-x-2 shadow-sm text-white">
          <span id="stats-spinner" class="htmx-indicator animate-spin rounded-full h-3 w-3 border-2 border-amber-400 border-t-transparent mr-1"></span>
          <span class="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          <span class="text-xs font-bold uppercase tracking-wider text-amber-400">Sistema Activo</span>
        </div>
      </div>

      <!-- HTMX Autopolling stats container (every 60s as per specs.md) -->
      <div hx-get="/admin/dashboard/stats" 
           hx-trigger="load, every 60s" 
           hx-swap="innerHTML"
           hx-indicator="#stats-spinner">
        <div class="flex flex-col justify-center items-center py-20 space-y-4">
          <span class="animate-spin rounded-full h-10 w-10 border-4 border-amber-400 border-t-[#0b1c3f]"></span>
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-widest animate-pulse">Cargando Estadísticas...</p>
        </div>
      </div>

    </div>
  `;
}

module.exports = {
  dashboardStatsHTML,
  dashboardShell
};
