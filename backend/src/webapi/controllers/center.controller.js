const prisma = require('../../infrastructure/database/prisma-client');
const CenterRepository = require('../../infrastructure/repositories/center.repository');
const CreateCenter = require('../../application/use-cases/create-center');
const UpdateCenter = require('../../application/use-cases/update-center');
const GetCenters = require('../../application/use-cases/get-centers');
const GetCenterById = require('../../application/use-cases/get-center-by-id');
const views = require('../views/center.views');

// Instantiate Repository and Use Cases
const centerRepository = new CenterRepository(prisma);
const createCenterUseCase = new CreateCenter(centerRepository);
const updateCenterUseCase = new UpdateCenter(centerRepository);
const getCentersUseCase = new GetCenters(centerRepository);
const getCenterByIdUseCase = new GetCenterById(centerRepository);

/**
 * Layout wrapper for non-HTMX requests.
 * @param {string} content HTML content to wrap
 */
const fullLayout = (content) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sistema de Gestión - Centros de Acopio</title>
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

const centerController = {
  /**
   * GET /admin/centers
   * Render centers dashboard / list.
   */
  getCenters: async (req, res) => {
    try {
      const centers = await getCentersUseCase.execute();
      const html = views.centersDashboard(centers);
      renderView(req, res, html);
    } catch (error) {
      console.error('[CenterController] Error in getCenters:', error);
      res.status(500).send(
        views.errorBanner('Ocurrió un error inesperado al intentar cargar los centros de acopio.')
      );
    }
  },

  /**
   * GET /admin/centers/new
   * Render center creation form.
   */
  getNewForm: (req, res) => {
    try {
      const html = views.newCenterForm();
      res.send(html);
    } catch (error) {
      console.error('[CenterController] Error in getNewForm:', error);
      res.status(500).send(views.errorBanner('No se pudo cargar el formulario de creación.'));
    }
  },

  /**
   * POST /admin/centers
   * Create a new center.
   */
  createCenter: async (req, res) => {
    try {
      const { name, address, status } = req.body;
      
      // Execute use case
      await createCenterUseCase.execute({ name, address, status });
      
      // Fetch updated list of centers
      const centers = await getCentersUseCase.execute();
      
      // Generate updated list HTML
      const updatedListHtml = views.centersList(centers);
      
      // Clear the form out-of-band and return the updated list
      const oobFormClear = '<div id="center-form-container" hx-swap-oob="true"></div>';
      
      res.send(updatedListHtml + oobFormClear);
    } catch (error) {
      console.warn('[CenterController] Validation or DB error in createCenter:', error.message);
      // Return 422 with out-of-band error injection
      res.status(422).send(
        `<div id="form-error-container" hx-swap-oob="true">${views.errorBanner(error.message)}</div>`
      );
    }
  },

  /**
   * GET /admin/centers/:id/edit
   * Render edit form pre-filled with center data.
   */
  getEditForm: async (req, res) => {
    try {
      const { id } = req.params;
      const center = await getCenterByIdUseCase.execute(id);
      const html = views.editCenterForm(center);
      res.send(html);
    } catch (error) {
      console.error('[CenterController] Error in getEditForm:', error);
      res.status(404).send(views.errorBanner(error.message));
    }
  },

  /**
   * PUT /admin/centers/:id
   * Modify an existing center.
   */
  updateCenter: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, address, status } = req.body;
      
      // Execute use case
      await updateCenterUseCase.execute(id, { name, address, status });
      
      // Fetch updated list
      const centers = await getCentersUseCase.execute();
      
      // Generate updated list HTML
      const updatedListHtml = views.centersList(centers);
      
      // Clear the form out-of-band and return the updated list
      const oobFormClear = '<div id="center-form-container" hx-swap-oob="true"></div>';
      
      res.send(updatedListHtml + oobFormClear);
    } catch (error) {
      console.warn('[CenterController] Validation or DB error in updateCenter:', error.message);
      // Return 422 with out-of-band error injection
      res.status(422).send(
        `<div id="form-error-container" hx-swap-oob="true">${views.errorBanner(error.message)}</div>`
      );
    }
  }
};

module.exports = centerController;
