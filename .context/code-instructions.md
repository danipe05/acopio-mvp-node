# REGLAS ESTRICTAS DE CÓDIGO Y ARQUITECTURA (MVP CENTROS DE ACOPIO)

El IDE DEBE respetar obligatoriamente las siguientes directrices al generar, refactorizar o sugerir código. Toda violación a estas reglas será considerada un error crítico.

## 1. PRINCIPIOS SOLID
- Single Responsibility Principle (SRP): Los controladores (Controllers) NUNCA deben contener lógica de negocio compleja ni consultas directas a la base de datos. Su única responsabilidad es recibir la petición (HTTP), llamar al servicio correspondiente y devolver la respuesta (HTML/HTMX o JSON).
- Dependency Inversion / Liskov Substitution: Mantener el acoplamiento bajo. Las reglas de negocio no deben depender de Express o HTMX directamente.

## 2. PATRONES DE DISEÑO
- Arquitectura en 3 Capas (MVC adaptado):
  1. Rutas (Routes): Solo definen los endpoints y el middleware.
  2. Controladores (Controllers): Orquestan la solicitud y la respuesta.
  3. Servicios (Services): Contienen TODA la regla de negocio (ej. validaciones de inventario mínimo, cálculos).
- Patrón Repositorio (Repository Pattern): Toda interacción con la base de datos a través de Prisma DEBE estar encapsulada en archivos separados (ej. `insumo.repository.js`). Un controlador nunca debe llamar a `prisma.insumo.create()` directamente.

## 3. CLEAN CODE Y BUENAS PRÁCTICAS
- Nomenclatura Intuitiva: Las variables y funciones deben ser descriptivas (ej. `verificarStockDisponible()` en lugar de `check()`). Usar camelCase para variables/funciones y PascalCase para Clases.
- Early Returns (Cláusulas de Guarda): Evitar el anidamiento profundo de condicionales (If-Else if-Else). Retornar errores o validaciones fallidas lo más pronto posible al inicio de la función.
- DRY (Don't Repeat Yourself): Si un fragmento de código HTML (Tailwind) o lógica de validación se usa en más de dos lugares, DEBE extraerse a un componente (Partial/Macro en el motor de plantillas) o a una función de utilidad (Utils).

## 4. MANEJO DE ERRORES Y ROBUSTEZ
- Try-Catch Obligatorio: Toda operación asíncrona (conexiones a BD, llamadas a Prisma) debe estar envuelta en bloques `try-catch`.
- Manejador de Errores Centralizado: Usar un middleware en Express para capturar errores de forma global. La aplicación NUNCA debe "crashear" (caerse) por una excepción no manejada.
- Respuestas Amigables con HTMX: Si ocurre un error, el servidor debe devolver un fragmento HTML con una alerta visual de error (Tailwind) que reemplace el formulario actual, no un objeto JSON crudo ni una página en blanco.

## 5. RESTRICCIONES DEL STACK
- Frontend: Cero JavaScript del lado del cliente a menos que sea estrictamente necesario para accesibilidad. Toda la interactividad se maneja vía HTMX (`hx-get`, `hx-post`, `hx-target`).
- Estilos: Prohibido usar estilos en línea (`style="..."`). Usar exclusivamente clases utilitarias de Tailwind.
- Optimización de Consultas: Al usar Prisma, seleccionar únicamente los campos necesarios usando `select: { ... }` para minimizar el consumo de memoria y acelerar el tiempo de respuesta. No hacer "Over-fetching".