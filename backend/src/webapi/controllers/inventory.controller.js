const prisma = require('../../infrastructure/database/prisma-client');
const CatalogRepository = require('../../infrastructure/repositories/catalog.repository');
const InventoryRepository = require('../../infrastructure/repositories/inventory.repository');
const RegisterEntry = require('../../application/use-cases/register-entry');
const RegisterExit = require('../../application/use-cases/register-exit');
const views = require('../views/inventory.views');

// Instantiate Repositories
const catalogRepository = new CatalogRepository(prisma);
const inventoryRepository = new InventoryRepository(prisma);

// Instantiate Use Cases
const registerEntryUseCase = new RegisterEntry(inventoryRepository, catalogRepository);
const registerExitUseCase = new RegisterExit(inventoryRepository, catalogRepository);

/**
 * Layout wrapper for non-HTMX requests.
 */
const fullLayout = (content) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sistema de Gestión - Inventario</title>
  <link rel="stylesheet" href="/output.css">
  <script src="https://unpkg.com/htmx.org@1.9.12"></script>
</head>
<body class="bg-gray-50 min-h-screen p-6 font-sans">
  <div class="max-w-4xl mx-auto">
    ${content}
  </div>
</body>
</html>
`;

/**
 * Helper to render view depending on request type.
 */
const renderView = (req, res, htmlContent) => {
  if (req.headers['hx-request']) {
    res.send(htmlContent);
  } else {
    res.send(fullLayout(htmlContent));
  }
};

/**
 * Helper to resolve centerId from the authenticated user session.
 * Falls back to the first active center for admin mock testing.
 * @returns {string} centerId
 */
const resolveCenterId = async (req, res) => {
  let centerId = req.user.centerId;

  if (!centerId) {
    const firstActiveCenter = await prisma.center.findFirst({ where: { status: 'ACTIVE' } });
    if (!firstActiveCenter) {
      res.status(422).send(
        views.errorBanner('Operación Inválida: No hay ningún centro de acopio activo registrado en el sistema. Primero cree un Centro.')
      );
      return null;
    }
    centerId = firstActiveCenter.id;
  }

  return centerId;
};

const inventoryController = {
  /**
   * GET /volunteer/inventory/in
   * Renders the stock entry form.
   */
  getEntryForm: async (req, res) => {
    try {
      const items = await catalogRepository.findAllItems();
      const html = views.registerEntryForm(items);
      renderView(req, res, html);
    } catch (error) {
      console.error('[InventoryController] Error rendering entry form:', error);
      res.status(500).send(
        views.errorBanner('Ocurrió un error al cargar el formulario de entrada de inventario.')
      );
    }
  },

  /**
   * POST /volunteer/inventory/in
   * Processes the stock entry registration.
   */
  registerEntry: async (req, res) => {
    try {
      const { itemId, quantity, origin } = req.body;
      const createdById = req.user.id;

      const centerId = await resolveCenterId(req, res);
      if (!centerId) return;

      const newBatch = await registerEntryUseCase.execute({
        itemId,
        centerId,
        quantity: parseInt(quantity, 10),
        origin,
        createdById
      });

      const unitName = newBatch.item.unit ? newBatch.item.unit.name : 'Unidades';
      const successHtml = views.successBanner(
        `Lote de <strong>${newBatch.item.name}</strong> registrado exitosamente. Cantidad recibida: <strong>${newBatch.initialQuantity} ${unitName}</strong> de <em>"${newBatch.origin}"</em>.`
      );
      
      const resetScript = `<script>document.querySelector("form[hx-post*='inventory/in']").reset();</script>`;

      res.send(successHtml + resetScript);
    } catch (error) {
      console.warn('[InventoryController] Error registering entry:', error.message);
      res.status(422).send(
        views.errorBanner(error.message)
      );
    }
  },

  /**
   * GET /volunteer/inventory/out
   * Renders the stock exit form with items and destinations.
   */
  getExitForm: async (req, res) => {
    try {
      const [items, destinations] = await Promise.all([
        catalogRepository.findAllItems(),
        catalogRepository.findAllDestinations()
      ]);
      const html = views.registerExitForm(items, destinations);
      renderView(req, res, html);
    } catch (error) {
      console.error('[InventoryController] Error rendering exit form:', error);
      res.status(500).send(
        views.errorBanner('Ocurrió un error al cargar el formulario de salida de inventario.')
      );
    }
  },

  /**
   * POST /volunteer/inventory/out
   * Processes the stock exit with FIFO discount.
   */
  registerExit: async (req, res) => {
    try {
      const { itemId, quantity, destinationId } = req.body;
      const createdById = req.user.id;

      const centerId = await resolveCenterId(req, res);
      if (!centerId) return;

      const movement = await registerExitUseCase.execute({
        itemId,
        centerId,
        quantity: parseInt(quantity, 10),
        destinationId,
        createdById
      });

      const unitName = movement.item.unit ? movement.item.unit.name : 'Unidades';
      const destName = movement.destination ? movement.destination.name : 'Destino desconocido';

      const successHtml = views.successBanner(
        `Despacho exitoso de <strong>${movement.quantity} ${unitName}</strong> de <strong>${movement.item.name}</strong> hacia <em>"${destName}"</em>. Stock descontado automáticamente (FIFO).`
      );
      
      const resetScript = `<script>document.querySelector("form[hx-post*='inventory/out']").reset();</script>`;

      res.send(successHtml + resetScript);
    } catch (error) {
      console.warn('[InventoryController] Error registering exit:', error.message);
      res.status(422).send(
        views.errorBanner(error.message)
      );
    }
  },

  /**
   * GET /volunteer/inventory/stock
   * Renders the full stock dashboard with search bar and table.
   */
  getStockView: async (req, res) => {
    try {
      const centerId = await resolveCenterId(req, res);
      if (!centerId) return;

      // Fetch center name for the dashboard header.
      const center = await prisma.center.findUnique({ where: { id: centerId } });
      const centerName = center ? center.name : 'Centro Desconocido';

      const stockRows = await inventoryRepository.getConsolidatedStock(centerId);
      const html = views.stockDashboard(stockRows, centerName);
      renderView(req, res, html);
    } catch (error) {
      console.error('[InventoryController] Error rendering stock view:', error);
      res.status(500).send(
        views.errorBanner('Ocurrió un error al cargar el inventario actual.')
      );
    }
  },

  /**
   * GET /volunteer/inventory/stock/search?q=term
   * Returns only the filtered table rows as an HTMX partial.
   */
  searchStock: async (req, res) => {
    try {
      const centerId = await resolveCenterId(req, res);
      if (!centerId) return;

      const searchTerm = req.query.q || '';
      const stockRows = await inventoryRepository.getConsolidatedStock(centerId, searchTerm);
      res.send(views.stockTableRows(stockRows));
    } catch (error) {
      console.error('[InventoryController] Error searching stock:', error);
      res.status(500).send(
        views.errorBanner('Ocurrió un error al buscar en el inventario.')
      );
    }
  },

  /**
   * GET /volunteer/inventory/movements
   * Renders the movements history.
   * If normal request, returns full layout with dashboard wrapper.
   * If HTMX request, returns only <tr> rows for infinite scroll pagination.
   */
  getMovementsHistory: async (req, res) => {
    try {
      const centerId = await resolveCenterId(req, res);
      if (!centerId) return;

      const page = parseInt(req.query.page, 10) || 1;
      const limit = 20;

      const movements = await inventoryRepository.getMovementsHistory({
        centerId,
        page,
        limit
      });

      if (req.headers['hx-request']) {
        // Return only the rows. If empty, returns empty string which stops infinite scroll trigger.
        res.send(views.movementTableRows(movements, page, limit));
      } else {
        const center = await prisma.center.findUnique({ where: { id: centerId } });
        const centerName = center ? center.name : 'Centro Desconocido';
        const html = views.movementsHistoryDashboard(movements, centerName, page, limit);
        renderView(req, res, html);
      }
    } catch (error) {
      console.error('[InventoryController] Error fetching movements history:', error);
      res.status(500).send(
        views.errorBanner('Ocurrió un error al cargar el historial de movimientos.')
      );
    }
  }
};

module.exports = inventoryController;

