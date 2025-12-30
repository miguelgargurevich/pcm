# 🌐 Configuración del Frontend para Servidor Linux

El frontend **YA ESTÁ INCLUIDO** en el despliegue automático. Cuando ejecutas `./start-server-docker.sh`, se construyen y levantan **AMBOS** servicios: backend y frontend.

---

## ✅ El Frontend se Despliega Automáticamente

Al ejecutar los comandos que mencionaste:

```bash
ssh usuario@101.44.10.71
cd /opt
sudo git clone https://github.com/miguelgargurevich/pcm.git
cd pcm
sudo chown -R $USER:$USER /opt/pcm
./start-server-docker.sh
```

El script `start-server-docker.sh` ejecuta:
```bash
docker-compose -f docker-compose.server.yml up -d --build
```

Esto construye y levanta:
1. ✅ **Backend** (puerto 5164)
2. ✅ **Frontend** (puerto 3000)

---

## 🔧 Configuración del Frontend

### Variables de Entorno en Build Time

El `docker-compose.server.yml` ya está configurado para pasar las variables correctas:

```yaml
frontend:
  build:
    args:
      - VITE_API_URL=http://101.44.10.71:5164/api
      - VITE_RECAPTCHA_SITE_KEY=6Lc2mgEsAAAAAMAsjyD9M0MsqCJxpYHS0-prSm9J
```

### Dockerfile Multi-etapa

El `frontend/Dockerfile` usa:
1. **Etapa 1 (Build)**: Node.js 20 Alpine
   - Instala dependencias
   - Recibe variables de entorno vía ARG
   - Ejecuta `npm run build` con las variables
   
2. **Etapa 2 (Serve)**: Nginx Alpine
   - Copia el build al directorio de nginx
   - Sirve la aplicación en puerto 80
   - Mapeo externo: puerto 3000

---

## 🌐 URLs de Acceso

Una vez desplegado:

- **Frontend**: `http://101.44.10.71:3000`
- **Backend API**: `http://101.44.10.71:5164`
- **Health Check**: `http://101.44.10.71:5164/health`
- **Swagger**: `http://101.44.10.71:5164/swagger`

---

## 🔍 Verificar el Frontend

### 1. Verificar que el contenedor esté corriendo

```bash
docker ps | grep pcm-frontend-server
```

Debería mostrar:
```
CONTAINER ID   IMAGE                    STATUS         PORTS
abc123def456   pcm_frontend            Up 5 minutes   0.0.0.0:3000->80/tcp
```

### 2. Verificar logs del frontend

```bash
docker logs pcm-frontend-server
```

### 3. Verificar que responde

```bash
# Desde el servidor
curl -I http://localhost:3000

# Desde tu Mac (reemplaza la IP)
curl -I http://101.44.10.71:3000
```

### 4. Verificar variables de entorno en el build

```bash
# Inspeccionar el contenedor
docker inspect pcm-frontend-server | grep -A 10 Env

# O entrar al contenedor y verificar el build
docker exec -it pcm-frontend-server cat /usr/share/nginx/html/index.html | grep -o "http://101.44.10.71:5164"
```

---

## 🛠️ Comandos Útiles para el Frontend

### Ver logs en tiempo real

```bash
docker logs pcm-frontend-server -f
```

### Reiniciar solo el frontend

```bash
docker-compose -f docker-compose.server.yml restart frontend
```

### Reconstruir solo el frontend (sin caché)

```bash
docker-compose -f docker-compose.server.yml build --no-cache frontend
docker-compose -f docker-compose.server.yml up -d frontend
```

### Verificar nginx dentro del contenedor

```bash
# Entrar al contenedor
docker exec -it pcm-frontend-server sh

# Dentro del contenedor:
ls -la /usr/share/nginx/html/
cat /etc/nginx/conf.d/default.conf
nginx -t
exit
```

---

## 🔄 Actualizar Solo el Frontend

Si haces cambios solo en el frontend:

```bash
# En el servidor:
cd /opt/pcm
git pull origin main

# Reconstruir y reiniciar solo el frontend
docker-compose -f docker-compose.server.yml up -d --build frontend
```

---

## ⚠️ Troubleshooting Frontend

### Problema: Frontend no carga / Error 404

```bash
# Verificar que el build se haya generado correctamente
docker exec pcm-frontend-server ls -la /usr/share/nginx/html/

# Debe mostrar archivos como:
# index.html
# assets/
# vite.svg
```

### Problema: API no responde desde el frontend

```bash
# Verificar que la URL del API sea correcta
docker exec pcm-frontend-server cat /usr/share/nginx/html/assets/index-*.js | grep -o "http://[^\"]*5164"

# Debe mostrar: http://101.44.10.71:5164
```

### Problema: Error CORS

```bash
# Verificar configuración CORS en el backend
docker logs pcm-backend-server | grep -i cors

# Agregar la IP del servidor a appsettings.Docker.json:
# "Cors": {
#   "AllowedOrigins": [
#     "http://101.44.10.71:3000",
#     "http://101.44.10.71"
#   ]
# }
```

### Problema: Variables de entorno no se aplican

Las variables de entorno de Vite se "hornean" (bake) en el código durante el build. Si cambias las variables, debes reconstruir:

```bash
# Editar docker-compose.server.yml si es necesario
nano docker-compose.server.yml

# Reconstruir SIN caché
docker-compose -f docker-compose.server.yml build --no-cache frontend
docker-compose -f docker-compose.server.yml up -d frontend
```

---

## 📊 Monitoreo del Frontend

```bash
# Ver uso de recursos
docker stats pcm-frontend-server

# Ver tamaño de la imagen
docker images | grep frontend

# Ver historial del contenedor
docker history pcm_frontend:latest
```

---

## 🎯 Resumen

| Aspecto | Detalle |
|---------|---------|
| **Puerto** | 3000 (externo) → 80 (interno) |
| **Servidor Web** | Nginx Alpine |
| **Build Tool** | Vite |
| **Arquitectura** | linux/amd64 |
| **Variables** | VITE_API_URL, VITE_RECAPTCHA_SITE_KEY |
| **Contenedor** | pcm-frontend-server |

**No necesitas hacer nada adicional** - el frontend se despliega automáticamente junto con el backend cuando ejecutas `./start-server-docker.sh` 🚀
