# 🚀 Guía de Despliegue en Servidor Linux del Cliente

Esta guía describe cómo desplegar la aplicación PCM en el servidor Linux del cliente (arquitectura x86_64/amd64).

---

## 📋 Requisitos Previos

### En el Servidor Linux del Cliente

1. **Docker y Docker Compose instalados**
   ```bash
   # Verificar instalación
   docker --version
   docker-compose --version
   
   # Si no están instalados (Ubuntu/Debian):
   sudo apt-get update
   sudo apt-get install -y docker.io docker-compose
   
   # Habilitar Docker al inicio
   sudo systemctl enable docker
   sudo systemctl start docker
   
   # Agregar usuario al grupo docker (opcional, para no usar sudo)
   sudo usermod -aG docker $USER
   # Cerrar sesión y volver a entrar para aplicar cambios
   ```

2. **Git instalado**
   ```bash
   sudo apt-get install -y git
   ```

3. **Acceso a la base de datos PostgreSQL**
   - Host: `101.44.10.71`
   - Puerto: `5432`
   - Base de datos: `pcd_plataforma`
   - Usuario: `postgres`
   - Password: `DB2812PCD...` (verificar el correcto)

---

## 📥 Paso 1: Clonar el Repositorio

```bash
# Opción A: Clonar desde GitHub (si el servidor tiene acceso)
cd /opt  # o la ubicación que prefieras
sudo git clone https://github.com/miguelgargurevich/pcm.git
cd pcm

# Opción B: Transferir desde tu PC (si no hay acceso a GitHub)
# En tu Mac (desde otra terminal):
# scp -r /ruta/al/proyecto usuario@servidor:/opt/pcm
```

---

## ⚙️ Paso 2: Configurar Variables de Entorno

### Backend - Crear/Editar `backend/PCM.API/appsettings.Docker.json`

Verifica que el archivo tenga la configuración correcta:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "Host=101.44.10.71;Port=5432;Database=pcd_plataforma;Username=postgres;Password=DB2812PCD...;Include Error Detail=true;"
  },
  "Jwt": {
    "Key": "PCM_SuperSecretKey_2024_MuySegura_32caracteres!",
    "Issuer": "PCM_API",
    "Audience": "PCM_Client",
    "ExpireMinutes": 480
  },
  "EmailSettings": {
    "Provider": "Smtp",
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": 587,
    "SmtpUsername": "tu-email@gmail.com",
    "SmtpPassword": "tu-contraseña-app",
    "FromEmail": "notificaciones@pcm.gob.pe",
    "FromName": "Plataforma PCM",
    "UseSsl": true
  },
  "FileStorageSettings": {
    "Provider": "Local",
    "LocalStoragePath": "/app/storage",
    "MaxFileSizeBytes": 10485760
  },
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://101.44.10.71:3000",
      "http://101.44.10.71",
      "http://localhost:5173"
    ]
  }
}
```

### Frontend - Verificar `frontend/.env.docker`

```bash
# Backend API en el servidor
VITE_API_URL=http://101.44.10.71:5164/api

# reCAPTCHA
VITE_RECAPTCHA_SITE_KEY=6Lc2mgEsAAAAAMAsjyD9M0MsqCJxpYHS0-prSm9J
```

---

## 🏗️ Paso 3: Construir y Desplegar con Docker

### Opción A: Despliegue Completo (Backend + Frontend)

```bash
# Asegurarse de estar en el directorio raíz del proyecto
cd /opt/pcm

# Construir y levantar los contenedores para arquitectura x86_64
docker-compose -f docker-compose.server.yml up -d --build

# Ver logs en tiempo real
docker-compose -f docker-compose.server.yml logs -f

# O ver logs específicos del backend
docker logs pcm-backend-server -f
```

### Opción B: Solo Backend (si frontend va en otro servidor)

```bash
# Construir solo el backend
docker build --platform=linux/amd64 -t pcm-backend:latest -f Dockerfile.local .

# Ejecutar el contenedor
docker run -d \
  --name pcm-backend-server \
  --platform=linux/amd64 \
  -p 5164:5164 \
  -e ASPNETCORE_ENVIRONMENT=Docker \
  -e ASPNETCORE_URLS=http://+:5164 \
  -v pcm_storage:/app/storage \
  --add-host host.docker.internal:host-gateway \
  pcm-backend:latest

# Ver logs
docker logs pcm-backend-server -f
```

---

## ✅ Paso 4: Verificar el Despliegue

### 1. Health Check del Backend

```bash
# Desde el servidor
curl http://localhost:5164/health

# Respuesta esperada:
# {"status":"healthy","database":"connected"}

# Verificar desde otro equipo (reemplaza IP)
curl http://101.44.10.71:5164/health
```

### 2. Verificar el Frontend

```bash
# Abrir en navegador:
# http://101.44.10.71:3000

# O verificar con curl
curl -I http://localhost:3000
```

### 3. Verificar Logs

```bash
# Ver logs del backend
docker logs pcm-backend-server --tail 50

# Ver logs del frontend
docker logs pcm-frontend-server --tail 50

# Ver logs en vivo de ambos
docker-compose -f docker-compose.server.yml logs -f
```

### 4. Probar Login

```bash
# Acceder a: http://101.44.10.71:3000
# Usuario: admin@pcm.gob.pe
# Password: Admin2024!
```

---

## 🔧 Comandos Útiles

### Gestión de Contenedores

```bash
# Ver contenedores corriendo
docker ps

# Ver todos los contenedores (incluyendo detenidos)
docker ps -a

# Detener contenedores
docker-compose -f docker-compose.server.yml down

# Detener y eliminar volúmenes (CUIDADO: borra archivos subidos)
docker-compose -f docker-compose.server.yml down -v

# Reiniciar un servicio específico
docker-compose -f docker-compose.server.yml restart backend

# Reconstruir solo el backend sin caché
docker-compose -f docker-compose.server.yml build --no-cache backend
```

### Ver y Limpiar Recursos

```bash
# Ver uso de espacio en disco
docker system df

# Ver imágenes
docker images

# Limpiar imágenes no usadas
docker image prune -a

# Limpiar todo (contenedores, imágenes, volúmenes, redes)
docker system prune -a --volumes
```

### Acceder a Contenedores

```bash
# Acceder al bash del backend
docker exec -it pcm-backend-server /bin/bash

# Verificar archivos dentro del contenedor
docker exec -it pcm-backend-server ls -la /app/storage/documentos

# Ver variables de entorno del contenedor
docker exec -it pcm-backend-server env
```

---

## 🗂️ Gestión de Archivos Subidos

Los archivos subidos (PDFs, documentos) se almacenan en un volumen Docker:

```bash
# Ver volúmenes
docker volume ls

# Inspeccionar el volumen de storage
docker volume inspect pcm_storage_data

# Hacer backup del volumen (importante antes de actualizaciones)
docker run --rm -v pcm_storage_data:/data -v $(pwd):/backup \
  alpine tar czf /backup/storage_backup_$(date +%Y%m%d_%H%M%S).tar.gz -C /data .

# Restaurar desde backup
docker run --rm -v pcm_storage_data:/data -v $(pwd):/backup \
  alpine tar xzf /backup/storage_backup_20241230_120000.tar.gz -C /data
```

---

## 🔄 Actualizar la Aplicación

### Desde Git (si el servidor tiene acceso)

```bash
cd /opt/pcm

# Hacer backup del storage primero
docker run --rm -v pcm_storage_data:/data -v $(pwd):/backup \
  alpine tar czf /backup/storage_backup_$(date +%Y%m%d_%H%M%S).tar.gz -C /data .

# Traer últimos cambios
git pull origin main

# Reconstruir y reiniciar
docker-compose -f docker-compose.server.yml up -d --build

# Ver logs para verificar
docker-compose -f docker-compose.server.yml logs -f
```

### Transferencia Manual (sin acceso a Git)

```bash
# En tu Mac:
cd /ruta/al/proyecto
tar czf pcm_update.tar.gz --exclude node_modules --exclude .git .
scp pcm_update.tar.gz usuario@101.44.10.71:/tmp/

# En el servidor:
cd /opt/pcm
docker-compose -f docker-compose.server.yml down
cd ..
mv pcm pcm_backup_$(date +%Y%m%d)
mkdir pcm && cd pcm
tar xzf /tmp/pcm_update.tar.gz
docker-compose -f docker-compose.server.yml up -d --build
```

---

## 🔍 Troubleshooting

### Problema: Backend no puede conectar a la base de datos

```bash
# Verificar conectividad desde el servidor
telnet 101.44.10.71 5432
# o
nc -zv 101.44.10.71 5432

# Verificar que el firewall permita la conexión
sudo ufw status
sudo ufw allow 5432/tcp  # Si es necesario

# Ver logs del backend
docker logs pcm-backend-server | grep -i "database\|postgres\|connection"
```

### Problema: "Platform mismatch" o errores de arquitectura

```bash
# Forzar reconstrucción para amd64
docker buildx build --platform linux/amd64 -t pcm-backend:latest -f Dockerfile.local .

# O usar buildx si está disponible
docker buildx create --use
docker buildx build --platform linux/amd64 -t pcm-backend:latest -f Dockerfile.local .
```

### Problema: Puerto ya en uso

```bash
# Ver qué está usando el puerto 5164
sudo netstat -tlnp | grep 5164
# o
sudo lsof -i :5164

# Detener el proceso o cambiar el puerto en docker-compose.server.yml
# Cambiar "5164:5164" a "5165:5164" por ejemplo
```

### Problema: Frontend no carga o error CORS

```bash
# Verificar que la URL del backend sea correcta
docker exec pcm-frontend-server cat /etc/nginx/conf.d/default.conf

# Verificar logs del navegador (F12 > Console)
# Si hay error CORS, agregar la IP al appsettings.Docker.json en Cors.AllowedOrigins
```

---

## 📊 Monitoreo

### Ver recursos utilizados

```bash
# Ver uso de CPU y memoria en tiempo real
docker stats

# Ver solo los contenedores PCM
docker stats pcm-backend-server pcm-frontend-server
```

### Logs estructurados

```bash
# Ver solo errores
docker logs pcm-backend-server 2>&1 | grep -i "error\|exception\|fail"

# Ver conexiones de base de datos
docker logs pcm-backend-server | grep -i "database\|postgres"

# Guardar logs en archivo
docker logs pcm-backend-server > /tmp/backend_logs_$(date +%Y%m%d_%H%M%S).log
```

---

## 🔐 Seguridad

### Consideraciones Importantes

1. **Firewall**: Asegúrate de que solo los puertos necesarios estén expuestos
   ```bash
   sudo ufw enable
   sudo ufw allow 22/tcp      # SSH
   sudo ufw allow 80/tcp      # HTTP
   sudo ufw allow 443/tcp     # HTTPS (si usas)
   sudo ufw allow 3000/tcp    # Frontend (temporal)
   sudo ufw allow 5164/tcp    # Backend (temporal)
   ```

2. **Passwords**: Cambiar todas las contraseñas por defecto en producción

3. **SSL/TLS**: En producción, usar nginx o traefik como proxy reverso con certificados SSL

4. **Backups**: Programar backups automáticos del volumen de storage y base de datos

---

## 📞 Soporte

### Información del Sistema

```bash
# Ver información del servidor
uname -a
cat /etc/os-release

# Ver versiones de Docker
docker --version
docker-compose --version

# Ver recursos del sistema
free -h
df -h
```

### Generar reporte de estado

```bash
#!/bin/bash
# Guardar como: /opt/pcm/status_report.sh

echo "=== PCM Status Report ==="
echo "Date: $(date)"
echo ""
echo "=== Docker Containers ==="
docker ps -a
echo ""
echo "=== Docker Resources ==="
docker stats --no-stream
echo ""
echo "=== Backend Logs (last 20 lines) ==="
docker logs pcm-backend-server --tail 20
echo ""
echo "=== Health Check ==="
curl -s http://localhost:5164/health
echo ""
```

---

## 📝 Notas Adicionales

- **Arquitectura**: Este despliegue está optimizado para servidores Linux x86_64/amd64
- **Base de datos**: Se usa la base de datos PostgreSQL externa (101.44.10.71:5432)
- **Storage**: Los archivos se guardan localmente en volumen Docker
- **Email**: Configurar SMTP real antes de producción
- **Producción**: Para producción real, considerar usar Kubernetes, nginx proxy, SSL/TLS, etc.

---

**Última actualización**: 30 de diciembre de 2025
