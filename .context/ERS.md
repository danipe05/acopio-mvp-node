ERS - Sistema de Gestión para Centros de Acopio (Venezuela)
1. Reglas de Negocio
Identificación Única: Cada centro de acopio, usuario, insumo y lote de entrada tendrá un identificador único en el sistema.
Inventario Mínimo: El sistema no permitirá registrar una salida de un insumo si la cantidad disponible en el centro de acopio es menor a la cantidad solicitada para la salida.
Trazabilidad Obligatoria: Cada salida de insumos debe estar asociada a un destino final (ej. Hospital, Comunidad, Otro Centro de Acopio).
Registro por Lotes: Los insumos se registrarán por lotes de entrada, con fecha de llegada, cantidad y proveedor/origen.
Prioridad de Urgencia: Las salidas con destino a "Hospitales" o "Zonas de Afectación Crítica" tendrán prioridad en la interfaz y reportes.
Solo Lectura en Baja Señal: La aplicación detectará baja conectividad y permitirá el modo "solo lectura" del inventario local (cache) para consultas, pero requerirá conexión para transacciones (entradas/salidas).
Estandarización de Unidades: Todos los insumos se medirán en unidades definidas por el administrador (ej. Kg, Litros, Unidades, Paquetes).
Auditoría de Usuarios: Cada acción de entrada o salida de insumos debe quedar registrada con el ID del usuario que la ejecutó.
Roles Específicos: Un usuario no puede realizar funciones administrativas (ej. crear centros, gestionar usuarios) si no tiene el rol de Administrador.
Datos Offline Mínimos: La aplicación almacenará en caché local la lista de centros, insumos y destinos más frecuentes para minimizar el uso de datos y mejorar la velocidad en zonas con mala señal.

2. Actores
Administrador (Admin): Encargado de la configuración global del sistema. Gestiona centros de acopio, usuarios (voluntarios), tipos de insumos y destinos. Visualiza estadísticas globales.
Voluntario (Operador de Centro): Usuario principal en el centro de acopio. Registra entradas de insumos, registra salidas de insumos y consulta el inventario actual y el historial de movimientos de su centro.

3. Historias de Usuario
Módulo de Administración
HU-01: Gestión de Centros de Acopio
Como Administrador, quiero poder crear y modificar centros de acopio para mantener el directorio actualizado.
HU-02: Gestión de Usuarios (Voluntarios)
Como Administrador, quiero dar de alta a los voluntarios y asignarles un centro de acopio para que puedan operar.
HU-03: Gestión de Catálogo de Insumos y Destinos
Como Administrador, quiero estandarizar la lista de insumos y destinos para evitar errores de escritura en los centros.

Módulo de Gestión de Inventario (Voluntario/Admin)
HU-04: Registrar Entrada de Insumos (Donación/Llegada)
Como Voluntario, quiero registrar la llegada de insumos al centro para actualizar el inventario disponible.
HU-05: Registrar Salida de Insumos (Envío a Destino)
Como Voluntario, quiero registrar la salida de insumos hacia un destino para descontar el inventario.

Módulo de Consultas y Estadísticas
HU-06: Consultar Inventario Actual
Como Voluntario, quiero ver el stock actual de todos los insumos en mi centro para saber qué tengo disponible.
HU-07: Ver Historial de Movimientos
Como Voluntario, quiero ver el historial reciente de entradas y salidas para llevar un control diario.
HU-08: Ver Dashboard de Estadísticas
Como Administrador, quiero ver un resumen nacional de entradas y salidas para medir el impacto de la ayuda.
