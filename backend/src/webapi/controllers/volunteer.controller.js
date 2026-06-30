const prisma = require('../../infrastructure/database/prisma-client');
const UserRepository = require('../../infrastructure/repositories/user.repository');
const CenterRepository = require('../../infrastructure/repositories/center.repository');
const CreateVolunteer = require('../../application/use-cases/create-volunteer');
const DeleteVolunteer = require('../../application/use-cases/delete-volunteer');
const GetVolunteers = require('../../application/use-cases/get-volunteers');
const GetCenters = require('../../application/use-cases/get-centers');
const views = require('../views/volunteer.views');

// Instantiate Repositories
const userRepository = new UserRepository(prisma);
const centerRepository = new CenterRepository(prisma);

// Instantiate Use Cases
const createVolunteerUseCase = new CreateVolunteer(userRepository, centerRepository);
const deleteVolunteerUseCase = new DeleteVolunteer(userRepository);
const getVolunteersUseCase = new GetVolunteers(userRepository);
const getCentersUseCase = new GetCenters(centerRepository);

/**
 * Layout wrapper for non-HTMX requests.
 */
const fullLayout = (content) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sistema de Gestión - Voluntarios</title>
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

const volunteerController = {
  /**
   * GET /admin/volunteers
   * Render volunteers dashboard / paginated scroll.
   */
  getVolunteers: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const { volunteers, hasMore } = await getVolunteersUseCase.execute(page);
      
      // If request is from HTMX and page > 1, return only the rows (partial infinite scroll)
      if (req.headers['hx-request'] && req.query.page) {
        let html = volunteers.map(v => views.volunteerRow(v)).join('');
        if (hasMore) {
          html += `
            <tr id="revealer-row">
              <td colspan="6" class="px-6 py-4 text-center text-xs text-gray-400">
                <div hx-get="/api/admin/volunteers?page=${page + 1}"
                     hx-trigger="revealed"
                     hx-target="#revealer-row"
                     hx-swap="outerHTML"
                     class="flex items-center justify-center space-x-2 text-blue-500 font-semibold cursor-pointer">
                  <span class="animate-spin rounded-full h-3.5 w-3.5 border-2 border-blue-500 border-t-transparent"></span>
                  <span>Cargando más voluntarios...</span>
                </div>
              </td>
            </tr>
          `;
        }
        return res.send(html);
      }

      // Default full dashboard rendering
      const centers = await getCentersUseCase.execute();
      const html = views.volunteersDashboard(volunteers, centers, hasMore, page);
      renderView(req, res, html);
    } catch (error) {
      console.error('[VolunteerController] Error in getVolunteers:', error);
      res.status(500).send(
        views.errorBanner('Ocurrió un error al cargar la gestión de voluntarios.')
      );
    }
  },

  /**
   * POST /admin/volunteers
   * Register a new volunteer with phone and documentId.
   */
  createVolunteer: async (req, res) => {
    try {
      const { name, email, password, phone, documentId, centerId } = req.body;

      // Execute use case with all required fields
      const newVolunteer = await createVolunteerUseCase.execute({
        name,
        email,
        password,
        phone,
        documentId,
        centerId
      });

      // Render the new table row
      const rowHtml = views.volunteerRow(newVolunteer);

      // Clear the form error container and reset form inputs using a small inline script
      const oobClearError = '<div id="form-error-container" hx-swap-oob="true"></div>';
      const resetFormScript = `<script>document.querySelector("form").reset();</script>`;
      
      // If there was an "empty" row indicator, we remove it. 
      const removeEmptyRowScript = `
        <script>
          const emptyRow = document.getElementById("empty-row");
          if (emptyRow) emptyRow.remove();
        </script>
      `;

      res.send(rowHtml + oobClearError + resetFormScript + removeEmptyRowScript);
    } catch (error) {
      console.warn('[VolunteerController] Error in createVolunteer:', error.message);
      // Return 422 with out-of-band error injection
      res.status(422).send(
        `<div id="form-error-container" hx-swap-oob="true">${views.errorBanner(error.message)}</div>`
      );
    }
  },

  /**
   * DELETE /admin/volunteers/:id
   * Delete / suspend a volunteer.
   */
  deleteVolunteer: async (req, res) => {
    try {
      const { id } = req.params;

      // Execute usecase
      await deleteVolunteerUseCase.execute(id);

      // Return empty response (so HTMX removes the closest tr)
      res.status(200).send('');
    } catch (error) {
      console.warn('[VolunteerController] Error in deleteVolunteer:', error.message);
      res.status(400).send(views.errorBanner(error.message));
    }
  }
};

module.exports = volunteerController;
