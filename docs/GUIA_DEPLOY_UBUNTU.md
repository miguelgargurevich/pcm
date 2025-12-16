# Guía de Deployment - PCM en Ubuntu Server

## Requisitos Previos
- Ubuntu Server 22.04 LTS o superior
- Acceso SSH con usuario sudo
- Dominio apuntando al servidor (opcional pero recomendado para SSL)
- Mínimo 2GB RAM, 20GB disco

---

## FASE 1: Preparación del Servidor

### 1.1 Actualizar el sistema
```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Instalar utilidades básicas
```bash
sudo apt install -y curl wget git unzip nano htop
```

### 1.3 Configurar firewall
```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

---

## FASE 2: Instalar Docker

### 2.1 Instalar Docker Engine
```bash
# Agregar repositorio oficial de Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Agregar usuario actual al grupo docker (evita usar sudo)
sudo usermod -aG docker $USER

# Cerrar sesión y volver a entrar para aplicar cambios
exit
# Volver a conectar por SSH
```

### 2.2 Instalar Docker Compose
```bash
sudo apt install docker-compose-plugin -y

# Verificar instalación
docker --version
docker compose version
```

---

## FASE 3: Instalar Nginx

### 3.1 Instalar Nginx
```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 3.2 Verificar que funciona
```bash
curl http://localhost
# Debería mostrar "Welcome to nginx!"
```

---

## FASE 4: Crear Estructura de Directorios

```bash
# Crear directorios para la aplicación
sudo mkdir -p /opt/pcm/backend
sudo mkdir -p /opt/pcm/data/postgres
sudo mkdir -p /var/www/pcm

# Dar permisos
sudo chown -R $USER:$USER /opt/pcm
sudo chown -R www-data:www-data /var/www/pcm
```

---

## FASE 5: Configurar Base de Datos y Backend (Docker)

### 5.1 Crear archivo docker-compose.yml
```bash
nano /opt/pcm/docker-compose.yml
```

Contenido (copiar del archivo `deploy/docker-compose.prod.yml` del repositorio):

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: pcm-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-pcm_user}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB:-pcm_db}
    volumes:
      - /opt/pcm/data/postgres:/var/lib/postgresql/data
    networks:
      - pcm-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-pcm_user} -d ${POSTGRES_DB:-pcm_db}"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    image: pcm-backend:latest
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: pcm-backend
    restart: unless-stopped
    ports:
      - "5000:8080"
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ASPNETCORE_URLS=http://+:8080
      - ConnectionStrings__DefaultConnection=Host=postgres;Port=5432;Database=${POSTGRES_DB:-pcm_db};Username=${POSTGRES_USER:-pcm_user};Password=${POSTGRES_PASSWORD}
      - JwtSettings__Secret=${JWT_SECRET}
      - JwtSettings__Issuer=${JWT_ISSUER:-PCM}
      - JwtSettings__Audience=${JWT_AUDIENCE:-PCM-Users}
      - JwtSettings__ExpirationInMinutes=${JWT_EXPIRATION:-60}
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - pcm-network

networks:
  pcm-network:
    driver: bridge
```

### 5.2 Crear archivo .env
```bash
nano /opt/pcm/.env
```

Contenido:
```env
# Base de Datos
POSTGRES_USER=pcm_user
POSTGRES_PASSWORD=TuPasswordSeguro123!
POSTGRES_DB=pcm_db

# JWT
JWT_SECRET=TuClaveSecretaMuyLargaYSeguraDeAlMenos32Caracteres!
JWT_ISSUER=PCM
JWT_AUDIENCE=PCM-Users
JWT_EXPIRATION=60

# Opcional: Configuración adicional
ASPNETCORE_ENVIRONMENT=Production
```

⚠️ **IMPORTANTE**: Cambia las contraseñas por valores seguros.

### 5.3 Crear Dockerfile para el Backend
```bash
nano /opt/pcm/backend/Dockerfile
```

Contenido (copiar del archivo `deploy/backend/Dockerfile` del repositorio)

---

## FASE 6: Subir el Código al Servidor

### Opción A: Clonar desde Git
```bash
cd /opt/pcm
git clone https://github.com/miguelgargurevich/pcm.git repo
cp -r repo/backend/* /opt/pcm/backend/
```

### Opción B: Subir con SCP desde tu máquina local
```bash
# Desde tu máquina local (Mac)
scp -r ./backend/* usuario@tu-servidor:/opt/pcm/backend/
```

---

## FASE 7: Construir y Ejecutar Backend

### 7.1 Construir imagen Docker
```bash
cd /opt/pcm
docker compose build
```

### 7.2 Iniciar servicios
```bash
docker compose up -d
```

### 7.3 Verificar que está corriendo
```bash
docker compose ps
docker compose logs -f backend

# Probar endpoint de health
curl http://localhost:5000/api/health
```

---

## FASE 8: Compilar y Desplegar Frontend

### 8.1 Instalar Node.js (en tu máquina local o en el servidor)

**Opción A: Compilar en el servidor**
```bash
# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar
node --version
npm --version
```

**Opción B: Compilar localmente y subir** (Recomendado)
```bash
# En tu Mac, dentro del directorio frontend
cd frontend
npm install
npm run build

# Subir el contenido de dist al servidor
scp -r dist/* usuario@tu-servidor:/var/www/pcm/
```

### 8.2 Si compilas en el servidor
```bash
cd /opt/pcm/repo/frontend
npm install
npm run build

# Copiar archivos compilados
sudo cp -r dist/* /var/www/pcm/
sudo chown -R www-data:www-data /var/www/pcm
```

---

## FASE 9: Configurar Nginx

### 9.1 Crear configuración del sitio
```bash
sudo nano /etc/nginx/sites-available/pcm
```

Contenido:
```nginx
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;
    # Si no tienes dominio, usa: server_name _;

    root /var/www/pcm;
    index index.html;

    # Logs
    access_log /var/log/nginx/pcm_access.log;
    error_log /var/log/nginx/pcm_error.log;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml;

    # Frontend - SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API - Proxy reverso
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 90;
    }

    # Cache de archivos estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 9.2 Habilitar el sitio
```bash
# Crear enlace simbólico
sudo ln -s /etc/nginx/sites-available/pcm /etc/nginx/sites-enabled/

# Desactivar sitio por defecto (opcional)
sudo rm /etc/nginx/sites-enabled/default

# Verificar configuración
sudo nginx -t

# Recargar Nginx
sudo systemctl reload nginx
```

---

## FASE 10: Configurar SSL con Let's Encrypt (Opcional pero Recomendado)

### 10.1 Instalar Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 10.2 Obtener certificado SSL
```bash
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com
```

### 10.3 Verificar renovación automática
```bash
sudo certbot renew --dry-run
```

---

## FASE 11: Comandos Útiles de Mantenimiento

### Ver logs
```bash
# Logs del backend
docker compose logs -f backend

# Logs de Nginx
sudo tail -f /var/log/nginx/pcm_access.log
sudo tail -f /var/log/nginx/pcm_error.log
```

### Reiniciar servicios
```bash
# Backend
cd /opt/pcm
docker compose restart backend

# Nginx
sudo systemctl restart nginx
```

### Actualizar la aplicación
```bash
# 1. Actualizar código
cd /opt/pcm/repo
git pull origin main

# 2. Actualizar backend
cp -r backend/* /opt/pcm/backend/
cd /opt/pcm
docker compose build backend
docker compose up -d backend

# 3. Actualizar frontend
cd /opt/pcm/repo/frontend
npm install
npm run build
sudo cp -r dist/* /var/www/pcm/
```

### Backup de la base de datos
```bash
# Crear backup
docker exec pcm-postgres pg_dump -U pcm_user pcm_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar backup
cat backup.sql | docker exec -i pcm-postgres psql -U pcm_user pcm_db
```

### Monitoreo
```bash
# Estado de Docker
docker compose ps
docker stats

# Uso de disco
df -h

# Uso de memoria
free -h
htop
```

---

## Resumen de Puertos

| Servicio | Puerto Interno | Puerto Externo |
|----------|---------------|----------------|
| PostgreSQL | 5432 | No expuesto |
| Backend .NET | 8080 | 5000 |
| Nginx HTTP | 80 | 80 |
| Nginx HTTPS | 443 | 443 |

---

## Checklist Final

- [ ] Servidor actualizado
- [ ] Docker instalado y corriendo
- [ ] Nginx instalado y corriendo
- [ ] Base de datos PostgreSQL funcionando
- [ ] Backend respondiendo en http://localhost:5000
- [ ] Frontend accesible via Nginx
- [ ] API proxeada correctamente (/api/*)
- [ ] SSL configurado (si tienes dominio)
- [ ] Firewall configurado
- [ ] Backups configurados

---

## Troubleshooting

### El backend no inicia
```bash
docker compose logs backend
# Verificar variables de entorno
docker compose config
```

### Error de conexión a la base de datos
```bash
# Verificar que postgres está corriendo
docker compose ps postgres
docker compose logs postgres
```

### Error 502 Bad Gateway en Nginx
```bash
# Verificar que el backend está corriendo
curl http://localhost:5000/api/health
# Verificar configuración de Nginx
sudo nginx -t
```

### El frontend no carga correctamente
```bash
# Verificar permisos
ls -la /var/www/pcm/
# Verificar logs de Nginx
sudo tail -f /var/log/nginx/pcm_error.log
```
