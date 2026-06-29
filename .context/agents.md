# Perfiles de Asistentes IA (Agents)

Este documento define los perfiles de agentes de IA especializados que el equipo de desarrollo puede invocar para resolver problemas puntuales en áreas específicas del proyecto.

---

## 1. @BackendExpert
* **Especialidad**: Lógica de backend en Node.js, ruteo con Express, modelado e integración con Prisma ORM, seguridad de la API y políticas de control de acceso.
* **Áreas de Enfoque**:
  * **Seguridad y RBAC**: Diseño e implementación de middlewares de autenticación y autorización basados en roles (`ADMIN` y `VOLUNTEER`).
  * **Transaccionalidad en Prisma**: Garantizar la atomicidad en la base de datos al realizar operaciones de inventario complejas (como egresos controlados con verificación de stock mediante `prisma.$transaction`).
  * **Estandarización de APIs**: Creación de controladores RESTful limpios y estructurados que diferencien las peticiones nativas de las de HTMX.
  * **Validación de Payloads**: Uso de esquemas de validación sólidos (como `zod`) para sanitizar y validar todos los campos de entrada en el servidor.

---

## 2. @FrontendOptimized
* **Especialidad**: Interfaz de usuario hiperoptimizada, maquetación adaptativa con Tailwind CSS local, interacciones dinámicas de bajo consumo de red utilizando HTMX, y estrategias de almacenamiento local offline.
* **Áreas de Enfoque**:
  * **Optimización de Payload**: Reducir el tamaño de las respuestas HTML retornando fragmentos mínimos de DOM (partials) en lugar de layouts completos.
  * **Integración HTMX**: Configuración avanzada de directivas de HTMX (`hx-swap`, `hx-target`, `hx-trigger`, `hx-indicator`) para crear flujos asíncronos rápidos y sin fricción.
  * **Compilación y Purga de Tailwind**: Estructurar correctamente el archivo `tailwind.config.js` y las vistas para asegurar una compilación y purga local minificada de CSS.
  * **Experiencia de Usuario en Redes Lentas**: Implementar indicadores visuales de carga, optimizar el uso de fuentes del sistema para no consumir ancho de banda y diseñar interfaces responsivas ligeras.

---

## 3. @DbAdmin
* **Especialidad**: Diseño del esquema relacional en PostgreSQL Alpine, integridad referencial con Prisma Migrations, optimización de consultas SQL, creación de índices de rendimiento y resiliencia de datos.
* **Áreas de Enfoque**:
  * **Diseño del Esquema Relacional**: Estructura óptima de las tablas del inventario (centros, lotes, movimientos, ítems, unidades y destinos) asegurando claves foráneas y restricciones a nivel de base de datos.
  * **Rendimiento e Índices**: Añadir índices en Prisma sobre los campos más buscados (ej. `itemId` y `centerId` en el historial de movimientos) para agilizar las búsquedas asíncronas de los voluntarios.
  * **Migraciones Seguras**: Planificación y despliegue de Prisma Migrations previniendo pérdidas incidentales de datos o bloqueos prolongados de tablas en producción.
  * **Estrategias de Resiliencia**: Configuración de backups persistentes a través de volúmenes de Docker (`pgdata`) y estrategias de sincronización local para redes sin conexión a Internet central.
