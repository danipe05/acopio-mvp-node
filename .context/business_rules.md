# Reglas de Negocio y Restricciones del Backend

Este documento compila las reglas de negocio críticas definidas en la ERS y las formaliza como restricciones lógicas que el backend de Node.js (Express + Prisma) debe validar de manera estricta y obligatoria en cada transacción.

---

## 1. Identificación Única (UID)
* **Restricción**: Todos los modelos principales de la base de datos (`Center`, `User`, `Item`, `Batch`, `Movement`, `Destination`) deben utilizar un identificador primario de tipo UUID (versión 4) o CUID.
* **Implementación Prisma**:
  ```prisma
  id String @id @default(cuid())
  ```
* **Validación**: El backend rechazará cualquier inserción que intente forzar un ID manual que no cumpla con este formato.

## 2. Inventario Mínimo y Prevención de Stock Negativo
* **Restricción**: Está estrictamente prohibido realizar una salida de inventario si la cantidad solicitada de un insumo supera la suma acumulada de stock disponible en todos los lotes activos de ese centro.
* **Validación Backend**:
  1. En una transacción atómica (`prisma.$transaction`), consultar los lotes del insumo (`itemId`) en el centro (`centerId`) donde `currentQuantity > 0`.
  2. Sumar la cantidad disponible.
  3. Si la cantidad solicitada es mayor que la suma disponible, abortar la transacción inmediatamente y retornar un código `422 Unprocessable Entity` con un mensaje descriptivo.

## 3. Trazabilidad Obligatoria de Salidas
* **Restricción**: Cada salida de inventario (`Movement` de tipo `OUT`) debe estar explícitamente vinculada a un destino final preconfigurado en el catálogo. No se permiten salidas "huérfanas" o con destino nulo.
* **Validación Backend**:
  * El campo `destinationId` es obligatorio en el payload de creación de salidas y debe existir previamente en la base de datos.
  * La base de datos debe validar esta restricción mediante una relación de clave foránea no anulable (`NOT NULL`).

## 4. Registro por Lotes
* **Restricción**: Los insumos no se acumulan en un contador genérico directo; cada entrada debe generar un lote (`Batch`) individualizado.
* **Validación Backend**:
  * Cada lote debe contener de forma obligatoria:
    * `itemId` (Referencia al catálogo de insumos)
    * `centerId` (Referencia al centro de acopio receptor)
    * `initialQuantity` (Cantidad ingresada)
    * `currentQuantity` (Cantidad disponible residual, inicia igual a `initialQuantity`)
    * `receivedAt` (Fecha de recepción del lote)
    * `origin` (Origen del lote, ej. "Donación Cruz Roja", "Compra Estatal")

## 5. Prioridad de Urgencia en Destinos
* **Restricción**: Ciertos destinos tienen una prioridad crítica (ej. Hospitales, Zonas de Desastre Inmediato).
* **Validación**:
  * El modelo `Destination` debe contar con un campo booleano `isCritical` o un enum `priority` (`LOW`, `MEDIUM`, `HIGH`).
  * En la vista del voluntario y del administrador, los movimientos o destinos catalogados como críticos deben renderizarse de forma prioritaria (visualización destacada con clases de borde y contraste elevado) para optimizar el triaje visual.

## 6. Solo Lectura y Operaciones Offline
* **Restricción**: En situaciones de señal extremadamente baja o nula, la aplicación debe permitir la lectura de catálogos locales y el almacenamiento temporal del estado. Sin embargo, las transacciones que alteren el inventario (entradas y salidas) requieren sincronización o conexión directa al servidor local.
* **Validación**:
  * Las peticiones de lectura deben responder con cabeceras HTTP de caché (`Cache-Control: public, max-age=3600`) para catálogos estáticos.
  * El cliente web utilizará una capa de caché en `localStorage` o `IndexedDB` para permitir que el voluntario visualice la interfaz e incluso busque en el catálogo sin conexión.

## 7. Estandarización de Unidades de Medida
* **Restricción**: No se permite texto libre para las unidades de medida (ej. "paquetes", "cajitas", "kg."). Todas las unidades deben pertenecer al catálogo global administrado por el Administrador.
* **Validación**:
  * El modelo `Item` del catálogo cuenta con una relación requerida a la tabla `Unit` (`Kg`, `Liters`, `Units`, etc.).

## 8. Auditoría de Usuarios Obligatoria
* **Restricción**: Cada acción de alteración de datos (creación, modificación, eliminación, entrada o salida de inventario) debe guardar el identificador del usuario que realizó la acción.
* **Validación**:
  * Los modelos `Batch` y `Movement` deben incluir obligatoriamente el campo `createdById` que referencie al `User` autenticado que ejecutó la transacción.

## 9. Roles Específicos (RBAC)
* **Restricción**: Separación estricta de responsabilidades entre los roles `ADMIN` y `VOLUNTEER`.
* **Validación**:
  * El middleware de Express debe verificar el rol decodificado de la sesión:
    * `/admin/*` requiere el rol `ADMIN`.
    * `/volunteer/*` requiere el rol `VOLUNTEER` o `ADMIN`.
    * Si un usuario intenta acceder a una ruta fuera de su rol, el backend responderá inmediatamente con `403 Forbidden`.
