# Etapa 1: Build
FROM node:20-alpine AS builder

# Instalar dependencias necesarias para Prisma
RUN apk add --no-cache openssl libc6-compat

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# Generar cliente de Prisma
COPY prisma ./prisma/
RUN npx prisma generate

COPY . .

# Etapa 2: Producción
FROM node:20-alpine AS runner

ENV NODE_ENV=production
RUN apk add --no-cache openssl

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --only=production

# Copiar el cliente generado de Prisma
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/src ./src

EXPOSE 3000

CMD ["node", "src/app.js"]
