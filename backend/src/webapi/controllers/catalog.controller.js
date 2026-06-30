const prisma = require('../../infrastructure/database/prisma-client');
const CatalogRepository = require('../../infrastructure/repositories/catalog.repository');
const CreateItem = require('../../application/use-cases/create-item');
const CreateDestination = require('../../application/use-cases/create-destination');
const GetCatalog = require('../../application/use-cases/get-catalog');
const views = require('../views/catalog.views');

// Instantiate Repository
const catalogRepository = new CatalogRepository(prisma);

// Instantiate Use Cases
const createItemUseCase = new CreateItem(catalogRepository);
const createDestinationUseCase = new CreateDestination(catalogRepository);
const getCatalogUseCase = new GetCatalog(catalogRepository);

/**
 * Layout wrapper for non-HTMX requests.
 */
const fullLayout = (content) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sistema de Gestión - Catálogo</title>
  <link rel="stylesheet" href="/output.css">
  <script src="https://unpkg.com/htmx.org@1.9.12"></script>
</head>
<body class="bg-gray-50 min-h-screen p-6 font-sans">
  <div class="max-w-6xl mx-auto">
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

const catalogController = {
  /**
   * GET /admin/catalog
   * Render catalog dashboard (dashboard frame).
   */
  getCatalog: async (req, res) => {
    try {
      const categories = await catalogRepository.findAllCategories();
      const units = await catalogRepository.findAllUnits();
      const html = views.catalogDashboard(categories, units);
      renderView(req, res, html);
    } catch (error) {
      console.error('[CatalogController] Error in getCatalog:', error);
      res.status(500).send(
        views.errorBanner('Ocurrió un error al cargar el panel de catálogo.')
      );
    }
  },

  /**
   * GET /admin/catalog/items
   * Render items table list (async loading).
   */
  getItems: async (req, res) => {
    try {
      const items = await catalogRepository.findAllItems();
      const html = views.itemsList(items);
      res.send(html);
    } catch (error) {
      console.error('[CatalogController] Error in getItems:', error);
      res.status(500).send(
        views.errorBanner('Error al obtener la lista de insumos.')
      );
    }
  },

  /**
   * GET /admin/catalog/destinations
   * Render destinations table list (async loading).
   */
  getDestinations: async (req, res) => {
    try {
      const destinations = await catalogRepository.findAllDestinations();
      const html = views.destinationsList(destinations);
      res.send(html);
    } catch (error) {
      console.error('[CatalogController] Error in getDestinations:', error);
      res.status(500).send(
        views.errorBanner('Error al obtener la lista de destinos.')
      );
    }
  },

  /**
   * POST /admin/catalog/items
   * Register a new item in catalog.
   */
  createItem: async (req, res) => {
    try {
      const { name, categoryId, unitId } = req.body;

      const newItem = await createItemUseCase.execute({
        name,
        categoryId,
        unitId
      });

      const rowHtml = views.itemRow(newItem);
      const oobClearError = '<div id="item-error-container" hx-swap-oob="true"></div>';
      const resetFormScript = `<script>document.querySelector("form[hx-post*='catalog/items']").reset();</script>`;

      res.send(rowHtml + oobClearError + resetFormScript);
    } catch (error) {
      console.warn('[CatalogController] Error in createItem:', error.message);
      res.status(422).send(
        `<div id="item-error-container" hx-swap-oob="true">${views.errorBanner(error.message)}</div>`
      );
    }
  },

  /**
   * POST /admin/catalog/destinations
   * Register a new destination in catalog.
   */
  createDestination: async (req, res) => {
    try {
      const { name, isCritical } = req.body;

      const newDest = await createDestinationUseCase.execute({
        name,
        isCritical: isCritical === 'true' || isCritical === true
      });

      const rowHtml = views.destinationRow(newDest);
      const oobClearError = '<div id="dest-error-container" hx-swap-oob="true"></div>';
      const resetFormScript = `<script>document.querySelector("form[hx-post*='catalog/destinations']").reset();</script>`;

      res.send(rowHtml + oobClearError + resetFormScript);
    } catch (error) {
      console.warn('[CatalogController] Error in createDestination:', error.message);
      res.status(422).send(
        `<div id="dest-error-container" hx-swap-oob="true">${views.errorBanner(error.message)}</div>`
      );
    }
  }
};

module.exports = catalogController;
