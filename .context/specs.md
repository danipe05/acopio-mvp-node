# Especificaciones Técnicas del Monolito (Express + HTMX + Prisma)

Este documento especifica el flujo de datos, los endpoints de Express y el comportamiento de HTMX para cada una de las Historias de Usuario (HU). Para optimizar el ancho de banda, **todas las respuestas de HTMX deben ser fragmentos de HTML estructurados (partials), no páginas completas.**

---

## HU-01: Admin crea y modifica centros de acopio

### Flujo de Datos
1. El Administrador accede a la gestión de centros.
2. HTMX solicita el formulario o la lista de centros.
3. El servidor responde con fragmentos HTML para insertar en el layout principal.
4. Al enviar el formulario (Crear/Modificar), se validan los campos en el backend y se actualiza la base de datos vía Prisma.

### Endpoints de Express
* **`GET /admin/centers`**
  * **Middleware**: `isAuthenticated`, `requireRole('ADMIN')`
  * **Descripción**: Renderiza la vista de gestión de centros (lista y botón de creación).
* **`GET /admin/centers/new`**
  * **Middleware**: `isAuthenticated`, `requireRole('ADMIN')`
  * **Descripción**: Devuelve el fragmento HTML del formulario de creación.
* **`POST /admin/centers`**
  * **Middleware**: `isAuthenticated`, `requireRole('ADMIN')`
  * **Descripción**: Crea el centro en la base de datos.
  * **Cuerpo**: `{ name: string, address: string, status: 'ACTIVE' | 'INACTIVE' }`
* **`GET /admin/centers/:id/edit`**
  * **Middleware**: `isAuthenticated`, `requireRole('ADMIN')`
  * **Descripción**: Devuelve el fragmento HTML del formulario de edición.
* **`PUT /admin/centers/:id`**
  * **Middleware**: `isAuthenticated`, `requireRole('ADMIN')`
  * **Descripción**: Modifica el centro de acopio.

### Atributos HTMX Clave
* **Cargar Formulario de Creación**:
  ```html
  <button hx-get="/admin/centers/new" hx-target="#center-form-container" hx-swap="innerHTML" class="...">
    Nuevo Centro
  </button>
  ```
* **Envío de Formulario (Creación)**:
  ```html
  <form hx-post="/admin/centers" hx-target="#centers-list" hx-swap="outerHTML">
    <!-- inputs -->
  </form>
  ```

---

## HU-02: Admin da de alta voluntarios y los asigna a centros

### Flujo de Datos
1. El Administrador visualiza la lista de voluntarios.
2. Al dar de alta, selecciona el centro asignado.
3. El backend vincula el voluntario al `centerId` en el modelo `User`.

### Endpoints de Express
* **`GET /admin/volunteers`**
  * **Middleware**: `isAuthenticated`, `requireRole('ADMIN')`
  * **Descripción**: Retorna la lista de voluntarios.
* **`POST /admin/volunteers`**
  * **Middleware**: `isAuthenticated`, `requireRole('ADMIN')`
  * **Descripción**: Registra un voluntario y genera su credencial/contraseña inicial.
  * **Cuerpo**: `{ name: string, email: string, centerId: string }`
* **`DELETE /admin/volunteers/:id`**
  * **Middleware**: `isAuthenticated`, `requireRole('ADMIN')`
  * **Descripción**: Da de baja o suspende a un voluntario.

### Atributos HTMX Clave
* **Eliminar Voluntario**:
  ```html
  <button hx-delete="/admin/volunteers/123" hx-confirm="¿Seguro que desea dar de baja a este voluntario?" hx-target="closest tr" hx-swap="outerHTML">
    Suspender
  </button>
  ```

---

## HU-03: Admin gestiona catálogo estandarizado de insumos y destinos

### Flujo de Datos
1. El administrador accede al catálogo central.
2. Registra insumos (nombre, categoría, unidad de medida por defecto) o destinos (nombre, urgencia).
3. Los cambios se propagan de inmediato para que los voluntarios los utilicen al ingresar o egresar stock.

### Endpoints de Express
* **`GET /admin/catalog`**
  * **Middleware**: `isAuthenticated`, `requireRole('ADMIN')`
  * **Descripción**: Vista principal del catálogo.
* **`POST /admin/catalog/items`**
  * **Middleware**: `isAuthenticated`, `requireRole('ADMIN')`
  * **Descripción**: Crea un nuevo tipo de insumo (ej. Agua Embotellada, Unidad: Litro).
  * **Cuerpo**: `{ name: string, categoryId: string, unitId: string }`
* **`POST /admin/catalog/destinations`**
  * **Middleware**: `isAuthenticated`, `requireRole('ADMIN')`
  * **Descripción**: Registra un destino y su prioridad de urgencia.
  * **Cuerpo**: `{ name: string, isCritical: boolean }`

### Atributos HTMX Clave
* **Cargar Lista Específica de Catálogo**:
  ```html
  <div hx-get="/admin/catalog/items" hx-trigger="load" hx-swap="innerHTML">
    Cargando insumos...
  </div>
  ```

---

## HU-04: Voluntario registra entrada de insumos (alimenta inventario)

### Flujo de Datos
1. El voluntario en el centro selecciona un insumo del catálogo estandarizado.
2. Ingresa los datos del lote (cantidad, origen, fecha de recepción).
3. El backend crea un registro en el modelo `Batch` (`Lote`) y genera un movimiento de auditoría (`Movement`).

### Endpoints de Express
* **`GET /volunteer/inventory/in`**
  * **Middleware**: `isAuthenticated`, `requireRole('VOLUNTEER')`
  * **Descripción**: Devuelve el formulario de registro de entrada.
* **`POST /volunteer/inventory/in`**
  * **Middleware**: `isAuthenticated`, `requireRole('VOLUNTEER')`
  * **Descripción**: Guarda la entrada.
  * **Cuerpo**: `{ itemId: string, quantity: number, origin: string, receivedAt: Date }`

### Atributos HTMX Clave
* **Registro Exitoso**:
  ```html
  <form hx-post="/volunteer/inventory/in" hx-target="#form-feedback" hx-swap="innerHTML">
    <!-- inputs -->
    <button type="submit">Registrar Entrada</button>
  </form>
  ```

---

## HU-05: Voluntario registra salida de insumos (descuenta inventario)

### Flujo de Datos
1. El voluntario inicia una salida. Selecciona el insumo y la cantidad.
2. **Validación Backend**: Se verifica que haya stock disponible en los lotes activos del centro.
3. Se descuenta de los lotes utilizando una estrategia FIFO (First In, First Out) o FEFO (First Expired, First Out).
4. Si la validación falla, se retorna un fragmento de error sin modificar la base de datos.
5. Si es exitoso, se genera un movimiento con el destino obligatorio.

### Endpoints de Express
* **`GET /volunteer/inventory/out`**
  * **Middleware**: `isAuthenticated`, `requireRole('VOLUNTEER')`
  * **Descripción**: Devuelve el formulario de salida de insumos.
* **`POST /volunteer/inventory/out`**
  * **Middleware**: `isAuthenticated`, `requireRole('VOLUNTEER')`
  * **Descripción**: Procesa el egreso de inventario.
  * **Cuerpo**: `{ itemId: string, quantity: number, destinationId: string }`

### Atributos HTMX Clave
* **Manejo de Errores por Stock Insuficiente**:
  * Si falla, el servidor responde con código `422 Unprocessable Entity` y el fragmento HTML del mensaje de error para ser inyectado en el banner del formulario.
  ```html
  <div id="error-banner" class="bg-red-100 text-red-700 p-3 rounded">
    Error: Cantidad solicitada (150) supera el stock disponible (120).
  </div>
  ```

---

## HU-06: Voluntario consulta stock actual de su centro

### Flujo de Datos
1. El voluntario visualiza el inventario consolidado.
2. Para evitar sobrecargar la red local, el filtrado/búsqueda se realiza de forma reactiva asíncrona.

### Endpoints de Express
* **`GET /volunteer/inventory/stock`**
  * **Middleware**: `isAuthenticated`, `requireRole('VOLUNTEER')`
  * **Descripción**: Muestra la tabla del stock consolidado de su centro.
* **`GET /volunteer/inventory/stock/search`**
  * **Middleware**: `isAuthenticated`, `requireRole('VOLUNTEER')`
  * **Descripción**: Filtra los insumos según la query. Retorna solo las filas `<tr>` correspondientes.
  * **Query**: `?q=agua`

### Atributos HTMX Clave
* **Búsqueda Reactiva Asíncrona (Optimizado para Redes Lentas)**:
  ```html
  <input type="text" name="q" placeholder="Buscar insumo..."
         hx-get="/volunteer/inventory/stock/search"
         hx-trigger="keyup changed delay:400ms"
         hx-target="#stock-table-body"
         hx-indicator="#search-spinner">
  ```

---

## HU-07: Voluntario revisa historial de movimientos diarios

### Flujo de Datos
1. El voluntario consulta las transacciones del día para control interno.
2. Se listan las entradas y salidas ordenadas cronológicamente de forma descendente.

### Endpoints de Express
* **`GET /volunteer/inventory/movements`**
  * **Middleware**: `isAuthenticated`, `requireRole('VOLUNTEER')`
  * **Descripción**: Retorna la lista de movimientos registrados en el día actual para el centro de acopio asociado al voluntario.

### Atributos HTMX Clave
* **Paginación / Carga Infinita de Bajo Peso**:
  ```html
  <tr hx-get="/volunteer/inventory/movements?page=2" hx-trigger="revealed" hx-swap="afterend">
    <!-- Fila activadora que carga la siguiente página al hacer scroll -->
  </tr>
  ```

---

## HU-08: Admin visualiza dashboard nacional de entradas y salidas

### Flujo de Datos
1. El Administrador centralizado visualiza métricas clave agregadas a nivel nacional.
2. Dado el bajo ancho de banda, **está prohibido enviar bibliotecas pesadas de gráficos JavaScript (ej. Chart.js)**. En su lugar, el dashboard renderiza barras visuales mediante Tailwind CSS puro en el servidor o tablas ligeras de datos consolidados.

### Endpoints de Express
* **`GET /admin/dashboard`**
  * **Middleware**: `isAuthenticated`, `requireRole('ADMIN')`
  * **Descripción**: Renderiza el panel principal con los totales agregados e indicadores críticos.

### Atributos HTMX Clave
* **Auto-refresh Lento del Dashboard**:
  ```html
  <div hx-get="/admin/dashboard/stats" hx-trigger="every 60s" hx-swap="innerHTML">
    <!-- Indicadores nacionales agregados -->
  </div>
  ```
