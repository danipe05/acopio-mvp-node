# Etapa 1: Compilación de Tailwind CSS
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY tailwind.config.js ./
COPY src ./src
COPY public ./public

# Compilar Tailwind CSS y purgar los estilos no utilizados
RUN npm run build:css

# Etapa 2: Servidor Web Nginx
FROM nginx:alpine

# Copiar la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los recursos compilados y vistas estáticas
COPY --from=builder /usr/src/app/public /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
