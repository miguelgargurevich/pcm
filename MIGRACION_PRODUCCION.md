# 🚀 Guía de Migración a Producción

Esta guía te ayudará a llevar los cambios de Docker local a producción en el servidor de SGTD.

## 📋 Prerrequisitos

- Servidor Ubuntu 24.04 LTS
- Docker y Docker Compose instalados
- Acceso SSH al servidor
- Credenciales SMTP institucionales de PCM
- Base de datos PostgreSQL accesible

## 🔧 Configuración para Producción

### 1. Actualizar `appsettings.Production.json`

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "Host=101.44.10.71;Port=5432;Database=pcd_plataforma;Username=postgres;Password=DB2812PCD$$$"
  },
  "JwtSettings": {
    "SecretKey": "PCM_SecretKey_2025_Production_CAMBIAR_EN_PRODUCCION",
    "Issuer": "PCM.API",
    "Audience": "PCM.Client",
    "ExpirationMinutes": 60,
    "RefreshTokenExpirationDays": 7
  },
  "Smtp": {
    "Host": "smtp.pcm.gob.pe",
    "Port": 587,
    "Username": "plataforma@pcm.gob.pe",
    "Password": "SOLICITAR_A_TI",
    "FromEmail": "plataforma@pcm.gob.pe",
    "FromName": "Plataforma de Cumplimiento Digital",
    "FrontendUrl": "https://plataforma.pcm.gob.pe",
    "EnableSsl": true
  },
  "FileStorage": {
    "BasePath": "/var/www/pcm/storage",
    "BaseUrl": "/api/files",
    "MaxFileSizeMB": 10,
    "AllowedExtensions": ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
  },
  "ReCaptcha": {
    "SecretKey": "SOLICITAR_NUEVA_KEY",
    "VerifyUrl": "https://www.google.com/recaptcha/api/siteverify",
    "MinScore": 0.5
  },
  "Cors": {
    "Origins": [
      "https://plataforma.pcm.gob.pe",
      "https://www.plataforma.pcm.gob.pe"
    ]
  },
  "Sunat": {
    "ApiToken": "TOKEN_ACTUAL",
    "UseMockData": false
  }
}
```

### 2. Variables de Entorno para Docker

Crear archivo `.env` en el servidor:

```bash
# Database
POSTGRES_HOST=101.44.10.71
POSTGRES_PORT=5432
POSTGRES_DB=pcd_plataforma
POSTGRES_USER=postgres
POSTGRES_PASSWORD=DB2812PCD$$$

# JWT
JWT_SECRET=PCM_SecretKey_2025_Production_GENERAR_NUEVO

# SMTP
SMTP_HOST=smtp.pcm.gob.pe
SMTP_PORT=587
SMTP_USERNAME=plataforma@pcm.gob.pe
SMTP_PASSWORD=SOLICITAR_A_TI
SMTP_FROM_EMAIL=plataforma@pcm.gob.pe
SMTP_ENABLE_SSL=true

# File Storage
FILE_STORAGE_PATH=/var/www/pcm/storage
FILE_STORAGE_MAX_SIZE_MB=10

# Frontend
FRONTEND_URL=https://plataforma.pcm.gob.pe

# Cors
CORS_ORIGINS=https://plataforma.pcm.gob.pe,https://www.plataforma.pcm.gob.pe
```

### 3. Docker Compose para Producción

Actualizar `deploy/docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  backend:
    image: pcm-backend:latest
    build:
      context: ..
      dockerfile: deploy/Dockerfile.backend
    container_name: pcm-backend
    restart: unless-stopped
    ports:
      - "5000:5000"
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ASPNETCORE_URLS=http://+:5000
      - ConnectionStrings__DefaultConnection=${POSTGRES_HOST}:${POSTGRES_PORT};Database=${POSTGRES_DB};Username=${POSTGRES_USER};Password=${POSTGRES_PASSWORD}
      - JwtSettings__SecretKey=${JWT_SECRET}
      - Smtp__Host=${SMTP_HOST}
      - Smtp__Port=${SMTP_PORT}
      - Smtp__Username=${SMTP_USERNAME}
      - Smtp__Password=${SMTP_PASSWORD}
      - Smtp__FromEmail=${SMTP_FROM_EMAIL}
      - Smtp__EnableSsl=${SMTP_ENABLE_SSL}
      - FileStorage__BasePath=${FILE_STORAGE_PATH}
      - FileStorage__MaxFileSizeMB=${FILE_STORAGE_MAX_SIZE_MB}
    volumes:
      - /var/www/pcm/storage:/var/www/pcm/storage
    networks:
      - pcm-network

  nginx:
    image: nginx:alpine
    container_name: pcm-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/pcm.conf:/etc/nginx/conf.d/default.conf:ro
      - /var/www/pcm/frontend:/usr/share/nginx/html:ro
      - /var/www/pcm/storage:/var/www/pcm/storage:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on:
      - backend
    networks:
      - pcm-network

networks:
  pcm-network:
    driver: bridge
```

### 4. Actualizar Dockerfile de Producción

Crear/actualizar `deploy/Dockerfile.backend`:

```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copiar y restaurar
COPY backend/PCM.Domain/*.csproj ./backend/PCM.Domain/
COPY backend/PCM.Application/*.csproj ./backend/PCM.Application/
COPY backend/PCM.Infrastructure/*.csproj ./backend/PCM.Infrastructure/
COPY backend/PCM.Shared/*.csproj ./backend/PCM.Shared/
COPY backend/PCM.API/*.csproj ./backend/PCM.API/

RUN dotnet restore backend/PCM.API/PCM.API.csproj

# Copiar código y compilar
COPY backend/ ./backend/
WORKDIR /src/backend/PCM.API
RUN dotnet publish -c Release -o /app/publish

# Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .

# Crear directorio storage
RUN mkdir -p /var/www/pcm/storage && \
    chmod 755 /var/www/pcm/storage

EXPOSE 5000

ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:5000

ENTRYPOINT ["dotnet", "PCM.API.dll"]
```

### 5. Configuración de Nginx

Actualizar `deploy/nginx/pcm.conf`:

```nginx
upstream backend_api {
    server backend:5000;
}

server {
    listen 80;
    server_name plataforma.pcm.gob.pe www.plataforma.pcm.gob.pe;
    
    # Redirigir a HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name plataforma.pcm.gob.pe www.plataforma.pcm.gob.pe;

    # Certificados SSL
    ssl_certificate /etc/letsencrypt/live/plataforma.pcm.gob.pe/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/plataforma.pcm.gob.pe/privkey.pem;

    # Frontend
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }

    # API Backend
    location /api/ {
        proxy_pass http://backend_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Archivos almacenados
    location /api/files/ {
        alias /var/www/pcm/storage/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Swagger (solo en desarrollo/staging)
    # location /swagger/ {
    #     proxy_pass http://backend_api;
    # }
}
```

## 📦 Pasos de Deployment

### 1. Preparar Servidor

```bash
# Conectar al servidor
ssh usuario@servidor-pcm

# Crear directorios
sudo mkdir -p /var/www/pcm/storage
sudo mkdir -p /var/www/pcm/frontend
sudo chown -R www-data:www-data /var/www/pcm/storage
sudo chmod -R 755 /var/www/pcm/storage

# Clonar repositorio
cd /opt
sudo git clone <REPO_URL> pcm
cd pcm
```

### 2. Configurar Variables

```bash
# Copiar .env template
cp .env.example .env

# Editar con credenciales reales
sudo nano .env

# Proteger archivo
sudo chmod 600 .env
```

### 3. Build y Deploy

```bash
# Build backend
cd /opt/pcm
sudo docker-compose -f deploy/docker-compose.prod.yml build

# Iniciar servicios
sudo docker-compose -f deploy/docker-compose.prod.yml up -d

# Ver logs
sudo docker-compose -f deploy/docker-compose.prod.yml logs -f
```

### 4. Verificar Deployment

```bash
# Health check
curl https://plataforma.pcm.gob.pe/api/health

# Verificar SSL
curl -I https://plataforma.pcm.gob.pe

# Ver logs del backend
sudo docker logs pcm-backend -f
```

## ✅ Checklist de Producción

### Antes del Deploy

- [ ] Obtener credenciales SMTP de PCM TI
- [ ] Generar nuevo JWT Secret
- [ ] Solicitar certificado SSL (o configurar Let's Encrypt)
- [ ] Verificar acceso a BD producción (101.44.10.71:5432)
- [ ] Actualizar DNS apuntando a servidor
- [ ] Backup de BD actual
- [ ] Probar en ambiente local/staging

### Durante el Deploy

- [ ] Crear directorio `/var/www/pcm/storage`
- [ ] Configurar permisos correctos
- [ ] Copiar `.env` con credenciales reales
- [ ] Build de imágenes Docker
- [ ] Iniciar servicios
- [ ] Verificar logs sin errores

### Después del Deploy

- [ ] Probar login de usuario
- [ ] Probar recuperación de contraseña
- [ ] Verificar email recibido (real)
- [ ] Subir documento de prueba
- [ ] Descargar documento subido
- [ ] Verificar HTTPS funcionando
- [ ] Probar todos los endpoints críticos
- [ ] Monitorear logs por 24h

## 🔒 Seguridad

### 1. Proteger Archivos de Configuración

```bash
# Permisos restrictivos
sudo chmod 600 /opt/pcm/.env
sudo chmod 600 /opt/pcm/backend/PCM.API/appsettings.Production.json

# Owner correcto
sudo chown root:root /opt/pcm/.env
```

### 2. Firewall

```bash
# Permitir solo puertos necesarios
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

### 3. Secrets Management (Opcional)

Considerar usar Docker Secrets o Azure Key Vault:

```yaml
# docker-compose.prod.yml
secrets:
  smtp_password:
    external: true
  jwt_secret:
    external: true
```

## 🔄 Actualización de Código

Para actualizar el código en producción:

```bash
# Conectar al servidor
ssh usuario@servidor-pcm

# Ir al directorio
cd /opt/pcm

# Pull cambios
sudo git pull origin main

# Rebuild
sudo docker-compose -f deploy/docker-compose.prod.yml build

# Restart con zero-downtime
sudo docker-compose -f deploy/docker-compose.prod.yml up -d --no-deps --build backend

# Verificar
curl https://plataforma.pcm.gob.pe/api/health
```

## 🐛 Troubleshooting Producción

### Emails no se envían

```bash
# Ver logs SMTP
sudo docker logs pcm-backend | grep -i smtp

# Verificar conectividad al servidor SMTP
sudo docker exec pcm-backend nc -zv smtp.pcm.gob.pe 587

# Probar credenciales SMTP
sudo docker exec -it pcm-backend /bin/bash
```

### Archivos no se guardan

```bash
# Verificar permisos
ls -la /var/www/pcm/storage

# Verificar espacio en disco
df -h

# Ver logs de upload
sudo docker logs pcm-backend | grep -i upload
```

### Base de datos no conecta

```bash
# Verificar conectividad
sudo docker exec pcm-backend nc -zv 101.44.10.71 5432

# Ver connection string (ofuscar password)
sudo docker exec pcm-backend printenv | grep ConnectionStrings

# Ver logs de EF Core
sudo docker logs pcm-backend | grep -i "EntityFramework"
```

## 📊 Monitoreo

### Logs

```bash
# Ver logs en tiempo real
sudo docker logs pcm-backend -f --tail 100

# Buscar errores
sudo docker logs pcm-backend | grep -i error

# Logs de nginx
sudo docker logs pcm-nginx -f
```

### Recursos

```bash
# Ver uso de recursos
sudo docker stats

# Espacio en disco
df -h /var/www/pcm/storage
```

### Backup

```bash
# Backup de archivos
sudo tar -czf /backups/storage-$(date +%Y%m%d).tar.gz /var/www/pcm/storage

# Backup de base de datos (desde servidor BD)
pg_dump -h 101.44.10.71 -U postgres pcd_plataforma > backup_$(date +%Y%m%d).sql
```

## 📞 Contactos

| Rol | Contacto | Para |
|-----|----------|------|
| TI PCM | ti@pcm.gob.pe | Credenciales SMTP, acceso servidor |
| SGTD | sgtd@pcm.gob.pe | Autorizaciones, políticas |
| DBA | dba@pcm.gob.pe | Acceso base de datos |
| Desarrollador | miguel.gargurevich@gmail.com | Soporte técnico |

## 🔗 Referencias

- [DOCKER_LOCAL_README.md](DOCKER_LOCAL_README.md) - Pruebas locales
- [CAMBIOS_DOCKER_LOCAL.md](CAMBIOS_DOCKER_LOCAL.md) - Resumen de cambios
- [Informe 5.2.10](informes/5.2.10_Informe_Transferencia_Tecnica_Personal_TI.md) - Transferencia técnica
- [GUIA_DEPLOY_UBUNTU.md](docs/GUIA_DEPLOY_UBUNTU.md) - Deploy en Ubuntu

---

**Última actualización**: 29 de Enero 2025
