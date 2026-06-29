# Directrices Técnicas y Estándares de Desarrollo (Skills)

Este documento define las directrices técnicas del proyecto para el equipo de desarrollo. Su objetivo es garantizar la consistencia, el rendimiento óptimo en redes lentas y el correcto funcionamiento offline de la aplicación.

---

## 1. Arquitectura Limpia (Clean Architecture) y Estructura del Monolito
El backend se organiza estrictamente bajo los principios de **Clean Architecture**, dividiéndose en 4 capas desacopladas con flujo de dependencia unidireccional hacia el dominio:

* **Estructura de Capas (`/src/`)**:
  * **`domain/` (Dominio)**: Contiene las entidades de negocio, reglas lógicas puras y definiciones de interfaces/repositorios. No depende de ninguna otra capa ni de librerías externas.
  * **`application/` (Aplicación)**: Contiene los Casos de Uso (Use Cases) del sistema. Coordina el flujo de datos desde y hacia las entidades del dominio y los repositorios.
  * **`infrastructure/` (Infraestructura)**: Contiene las implementaciones tecnológicas concretas, adaptadores, el cliente de Prisma ORM (`prisma-client.js`) y las implementaciones de los repositorios que se conectan a PostgreSQL.
  * **`webapi/` (WebApi/Presentación)**: Define los controladores de Express, enrutamiento, middlewares HTTP de validación/seguridad y respuestas específicas (incluyendo fragmentos HTML para HTMX).
  * **`app.js`**: Punto de entrada (bootstrap) de la aplicación que arranca el servidor Express.

* **Principios de Desarrollo**:
  * **Regla de Dependencia**: El código de las capas externas (ej. `webapi` e `infrastructure`) puede depender de capas más internas (ej. `application` y `domain`), pero nunca al revés.
  * **KISS (Keep It Simple, Stupid)**: Evitar sobre-ingeniería innecesaria en el MVP manteniendo las abstracciones lo más simples y directas posible.
  * **Middlewares de Validación**: Utilizar librerías ligeras como `zod` o validaciones nativas para sanear el input antes de que llegue a los controladores.

## 2. Acceso a Datos con Prisma ORM
* **Uso Obligatorio**: Queda prohibido escribir consultas SQL crudas a menos que sea un caso de optimización extrema aprobado por el Lead Técnico.
* **Transacciones**: Las operaciones críticas (como egresos de stock que involucren FIFO/FEFO sobre múltiples lotes) deben implementarse dentro de un bloque `prisma.$transaction` para evitar condiciones de carrera (race conditions).
* **Manejo de Conexiones**: Asegurar el cierre o reutilización correcta del cliente Prisma en entornos contenerizados para evitar la saturación del pool de conexiones de PostgreSQL.

## 3. Optimización con HTMX (Asincronismo Eficiente)
* **Retorno de HTML Parcial**:
  * Express no debe devolver la vista completa (con cabeceras, scripts y estilos) en peticiones AJAX realizadas por HTMX.
  * El backend detectará si la solicitud proviene de HTMX inspeccionando la cabecera `HX-Request`.
  * Ejemplo de middleware/función auxiliar en el controlador:
    ```javascript
    const renderView = (req, res, partialName, fullLayoutName, data) => {
      if (req.headers['hx-request']) {
        res.render(partialName, data); // Retorna solo el fragmento HTML
      } else {
        res.render(fullLayoutName, data); // Retorna la página completa
      }
    };
    ```
* **Manejo de Errores e Indicadores**:
  * Usar `hx-indicator` en botones de envío para deshabilitar el botón y mostrar un spinner ligero de carga. Esto previene dobles envíos en conexiones lentas.
  * Los mensajes de error del backend deben inyectarse en contenedores dedicados del DOM mediante `hx-target` y códigos de estado HTTP semánticos (ej. `422`, `400`).

## 4. Estilos con Tailwind CSS (Local Compilado)
* **Restricción Crítica**: Está estrictamente prohibido usar el CDN de Tailwind mediante etiquetas `<script>`.
* **Compilación Local**:
  * Tailwind debe compilarse de forma local a través de su CLI.
  * El comando de compilación debe ejecutarse en el contenedor de Docker (en la etapa de construcción) y en el entorno de desarrollo local.
  * Comando oficial de desarrollo:
    ```bash
    npx tailwindcss -i ./src/input.css -o ./public/output.css --watch
    ```
  * Comando oficial de producción (con minificación y purga activa):
    ```bash
    npx tailwindcss -i ./src/input.css -o ./public/output.css --minify
    ```
* **Optimización de Ancho de Banda**:
  * Configurar `tailwind.config.js` adecuadamente para purgar las clases CSS no utilizadas en las vistas.
  * Evitar el uso de clases dinámicas interpoladas (ej. `class="bg-${color}-500"`) para que el purgador de Tailwind pueda detectar las clases estáticas en tiempo de compilación.
