# ============================================
# Dockerfile para Frontend - Multi-arquitectura
# ============================================

# Etapa 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Argumentos de build para variables de entorno
ARG VITE_API_URL=https://api.pcm.gargurevich.dev/api
ARG VITE_RECAPTCHA_SITE_KEY=6LfEE8csAAAAAHg7Nbk0Ly-obOi6877B6Y7esrwz

# Establecer como variables de entorno para el build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_RECAPTCHA_SITE_KEY=$VITE_RECAPTCHA_SITE_KEY

# Copiar package files
COPY package*.json ./

# Instalar dependencias (incluyendo devDependencies para build)
RUN npm ci

# Copiar código fuente
COPY . .

# Build para producción con las variables de entorno
RUN npm run build

# Etapa 2: Servir con nginx
FROM nginx:alpine

# Copiar build al directorio de nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:80/ || exit 1

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]
