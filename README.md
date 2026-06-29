# MVP: Sistema de Gestión de Centros de Acopio (Venezuela)

Este proyecto es un Producto Mínimo Viable (MVP) diseñado para optimizar la gestión de inventario en centros de acopio. La arquitectura está **hiperoptimizada para un consumo de ancho de banda extremadamente bajo** y preparada para funcionar en **redes locales completamente offline** (sin acceso a internet).

---

## 🛠️ Arquitectura y Componentes
El proyecto utiliza una arquitectura monolítica modular distribuida en tres servicios orquestados a través de Docker:

1. **Base de Datos (`db`)**: PostgreSQL 15 corriendo sobre Alpine Linux. Utiliza un volumen local persistente para asegurar la integridad de la base de datos de manera offline.
2. **Backend (`backend`)**: Aplicación Node.js (Express + Prisma ORM) estructurada bajo los principios de **Clean Architecture** (WebApi, Aplicación, Dominio e Infraestructura). Expone una API ligera y responde con fragmentos de HTML directos cuando detecta solicitudes de HTMX.
3. **Frontend (`frontend`)**: Servidor Nginx Alpine ultraligero que sirve los archivos HTML de la interfaz y la hoja de estilos de Tailwind CSS **compilada y minificada localmente** (cero llamadas a CDNs externos). Cuenta con configuración de proxy inverso para enrutar las peticiones `/api` de manera transparente hacia el backend.

---

## 📋 Requisitos Previos
* **Docker** instalado en la máquina.
* **Docker Compose** (generalmente incluido con Docker Desktop).

---

## 🚀 Guía de Levantamiento de Contenedores

Sigue estos sencillos pasos para levantar todo el entorno local:

### 1. Clonar o navegar a la carpeta raíz del proyecto
Asegúrate de estar posicionado en el directorio que contiene el archivo `docker-compose.yml`.

### 2. Configurar Variables de Entorno (Opcional)
El sistema cuenta con valores por defecto listos para desarrollo offline. Si deseas personalizarlos, puedes crear un archivo `.env` en la raíz del proyecto con la siguiente estructura:
```env
POSTGRES_USER=tu_usuario
POSTGRES_PASSWORD=tu_contrasena
POSTGRES_DB=nombre_db
```
*El backend generará automáticamente la URL de conexión a partir de estas variables.*

### 3. Levantar los Servicios en Docker
Ejecuta el siguiente comando en tu terminal para construir y levantar los contenedores:
```bash
docker compose up --build
```
Este comando realizará las siguientes tareas automatizadas:
* Compilar localmente las directivas de Tailwind CSS del frontend, purgando los estilos no utilizados.
* Generar los tipos del cliente Prisma a nivel de contenedor en el backend.
* Levantar PostgreSQL en la red privada interna.
* Esperar a que la base de datos esté saludable (`healthcheck` activo) antes de levantar y arrancar el servidor backend de Express.
* Servir el frontend estático mediante Nginx en el puerto `80`.

### 4. Puertos y Acceso Local
Una vez levantado el entorno, puedes acceder a los servicios desde los siguientes puertos locales:
* **Frontend Web**: [http://localhost](http://localhost) (Puerto 80)
* **Backend API**: [http://localhost:3000](http://localhost:3000) (Puerto 3000)
* **Base de Datos**: `localhost:5432` (Puerto 5432)

---

## 🔍 Verificación del Funcionamiento
Una vez que accedas a la interfaz web en `http://localhost`, verás una tarjeta de control con el botón **"Verificar Servidor y DB"**. 

Al hacer clic:
1. **HTMX** enviará una petición asíncrona hacia `/api/info` en Nginx.
2. **Nginx** la redireccionará internamente al contenedor `backend` (Express).
3. El backend consultará a la base de datos `db` (PostgreSQL) usando **Prisma**.
4. El backend procesará la respuesta y devolverá un fragmento de HTML puro estilizado con Tailwind.
5. El frontend reemplazará dinámicamente el estado sin recargar la página.

---

## 📁 Estructura del Proyecto
* **[.context/](file:///c:/Users/danpe/Documents/PERSONAL/acopio-mvp-node/.context/)**: Directrices técnicas, reglas de negocio y especificaciones de las Historias de Usuario (HU).
* **[backend/](file:///c:/Users/danpe/Documents/PERSONAL/acopio-mvp-node/backend/)**: Código fuente del backend (Clean Architecture).
* **[frontend/](file:///c:/Users/danpe/Documents/PERSONAL/acopio-mvp-node/frontend/)**: Vistas HTML/HTMX, configuración de Tailwind y servidor Nginx.
* **[docker-compose.yml](file:///c:/Users/danpe/Documents/PERSONAL/acopio-mvp-node/docker-compose.yml)**: Orquestador de contenedores.
* **[Dockerfile](file:///c:/Users/danpe/Documents/PERSONAL/acopio-mvp-node/Dockerfile)**: Dockerfile raíz heredado para desarrollos monolíticos integrados.
