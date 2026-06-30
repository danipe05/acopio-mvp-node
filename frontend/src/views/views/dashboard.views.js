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
function dashboardStatsHTML({
  centersTotal,
  centersActive,
  volunteersCount,
  batchesCount,
  totalStock,
  topProducts,
  isMockData
}) {
  const activePercent = centersTotal > 0 ? Math.round((centersActive / centersTotal) * 100) : 0;
  
  // Stats cards data
  const cards = [
    statsCard({
      title: "Centros Operativos",
      value: `${centersActive} / ${centersTotal}`,
      subtext: `${activePercent}% de los centros de acopio activos`,
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
      title: "Lotes Recibidos",
      value: batchesCount.toString(),
      subtext: "Cargamentos registrados en el inventario",
      iconSvg: `
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      `,
      colorClass: "bg-red-500"
    }),
    statsCard({
      title: "Insumos en Stock",
      value: `${totalStock.toLocaleString()} unds`,
      subtext: "Volumen total de insumos de ayuda",
      iconSvg: `
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      `,
      colorClass: "bg-gradient-to-r from-amber-400 via-blue-500 to-red-500"
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

  // Get current date formatted
  const currentDate = new Date().toLocaleDateString('es-VE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

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
          <span class="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          <span class="text-xs font-bold uppercase tracking-wider text-amber-400">Sistema Activo</span>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        ${cards}
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

        <!-- Right Side: Server Telemetry & Status -->
        <div class="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6 relative overflow-hidden flex flex-col justify-between">
          <div class="space-y-4">
            <div class="border-b border-gray-50 pb-4">
              <h2 class="text-lg font-bold text-gray-800">Estado del Sistema</h2>
              <p class="text-xs text-gray-400">Detalles de conexión y fecha operativa actual.</p>
            </div>

            <div class="space-y-3.5">
              <div class="flex justify-between items-center text-sm py-1 border-b border-gray-50">
                <span class="text-gray-400 font-semibold uppercase text-xs tracking-wider">Fecha Operativa</span>
                <span class="font-bold text-gray-700 capitalize text-right text-xs">${currentDate}</span>
              </div>
              <div class="flex justify-between items-center text-sm py-1 border-b border-gray-50">
                <span class="text-gray-400 font-semibold uppercase text-xs tracking-wider">Motor DB</span>
                <span class="font-bold text-gray-700 text-xs">PostgreSQL 15</span>
              </div>
              <div class="flex justify-between items-center text-sm py-1 border-b border-gray-50">
                <span class="text-gray-400 font-semibold uppercase text-xs tracking-wider">Sincronización</span>
                <span class="font-bold text-green-600 text-xs flex items-center">
                  <svg class="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  En línea
                </span>
              </div>
              <div class="flex justify-between items-center text-sm py-1 border-b border-gray-50">
                <span class="text-gray-400 font-semibold uppercase text-xs tracking-wider">Servidor Web</span>
                <span class="font-bold text-gray-700 text-xs">Node.js / Express</span>
              </div>
            </div>
          </div>

          <div class="pt-4 border-t border-gray-50 mt-6 lg:mt-0">
            <button hx-get="/api/info" 
                    hx-target="#diagnose-status-dash" 
                    hx-swap="innerHTML"
                    class="w-full bg-[#0b1c3f] hover:bg-[#00244e] text-white border border-amber-500/20 hover:border-amber-500/50 font-bold py-2.5 px-4 rounded-xl transition flex items-center justify-center space-x-2">
              <svg class="w-4 h-4 text-amber-400 animate-spin" id="diagnose-spinner" style="display:none;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.235" />
              </svg>
              <span>Ejecutar Diagnóstico</span>
            </button>
            <div id="diagnose-status-dash" class="text-center text-xs font-semibold text-gray-500 mt-2"></div>
          </div>
        </div>

      </div>
    </div>
  `;
}

module.exports = {
  dashboardStatsHTML
};
