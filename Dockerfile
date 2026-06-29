# ==========================================
# Etapa 1: Construcción (builder)
# ==========================================
FROM node:20-alpine AS builder

# Instalar dependencias del sistema necesarias para compilar o para Prisma
RUN apk add --no-cache openssl libc6-compat

WORKDIR /usr/src/app

# Copiar archivos de definición de dependencias
COPY package*.json ./

# Instalar dependencias (incluyendo devDependencies para Tailwind y Prisma)
RUN npm install

# Copiar esquema de Prisma y generar el cliente
COPY prisma ./prisma/
RUN npx prisma generate

# Copiar el código fuente de la aplicación
COPY . .

# Compilar, purgar y minificar el CSS usando Tailwind CSS CLI de forma local (offline)
# Asume que el input está en ./src/input.css y el output va a ./public/output.css
RUN npx tailwindcss -i ./src/input.css -o ./public/output.css --minify

# ==========================================
# Etapa 2: Producción (runner)
# ==========================================
FROM node:20-alpine AS runner

# Configurar entorno de producción
ENV NODE_ENV=production

# Instalar dependencias mínimas del sistema requeridas en runtime (Prisma necesita openssl)
RUN apk add --no-cache openssl

WORKDIR /usr/src/app

# Copiar archivos de dependencia para la instalación de producción
COPY package*.json ./

# Instalar únicamente las dependencias de producción
RUN npm install --only=production

# Copiar el cliente de Prisma generado en la etapa anterior
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/app/node_modules/@prisma/client ./node_modules/@prisma/client

# Copiar el esquema de Prisma por si se necesitan ejecutar migraciones o introspecciones en runtime
COPY --from=builder /usr/src/app/prisma ./prisma

# Copiar el código fuente y los recursos estáticos compilados
COPY --from=builder /usr/src/app/src ./src
COPY --from=builder /usr/src/app/public ./public

# Si el proyecto cuenta con otros directorios como "views" (para motores de plantillas fuera de src),
# se pueden copiar descomentando la siguiente línea:
# COPY --from=builder /usr/src/app/views ./views

# Exponer el puerto de la aplicación (Express por defecto en 3000)
EXPOSE 3000

# Comando de inicio de la aplicación
# Nota: Si el punto de entrada es diferente (ej. src/index.js o npm start), ajustarlo aquí.
CMD ["node", "src/app.js"]
