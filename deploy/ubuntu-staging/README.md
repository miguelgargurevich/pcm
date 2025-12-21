# PCM - Ambiente de Certificación (Ubuntu 24.04)

## 📋 Resumen

Este directorio contiene los scripts para configurar un ambiente de Certificación/Staging en Ubuntu 24.04 LTS.

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                    Ubuntu 24.04 (Parallels)                      │
│                    Ambiente: CERTIFICACIÓN                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────┐      ┌──────────────────────────────────┐     │
│   │   Nginx     │ ───► │  Frontend (React) - /            │     │
│   │  (puerto 80)│      └──────────────────────────────────┘     │
│   │             │      ┌──────────────────────────────────┐     │
│   │             │ ───► │  Backend (.NET 9) - /api         │     │
│   └─────────────┘      │  (puerto 5000)                   │     │
│                        └──────────────────────────────────┘     │
│                                                                  │
│                        ┌──────────────────────────────────┐     │
│                        │  Supabase (Cloud)                │     │
│                        │  • PostgreSQL                    │     │
│                        │  • Storage (PDFs)                │     │
│                        └──────────────────────────────────┘     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Instalación Inicial (Primera vez)

### Paso 1: Copiar scripts a Ubuntu

Desde tu Mac, copia los scripts al Ubuntu:

```bash
# Obtener IP del Ubuntu (ejecutar en Ubuntu)
hostname -I

# Desde Mac, copiar scripts
scp -r deploy/ubuntu-staging/* parallels@<IP_UBUNTU>:~/pcm-setup/
```

O clona el repositorio directamente en Ubuntu:

```bash
# En Ubuntu
cd ~
git clone https://github.com/miguelgargurevich/pcm.git
cp -r pcm/deploy/ubuntu-staging ~/pcm-setup
```

### Paso 2: Ejecutar scripts de instalación

```bash
# En Ubuntu
cd ~/pcm-setup

# Dar permisos de ejecución
chmod +x *.sh

# 1. Instalar dependencias (.NET 9, Node.js, Nginx)
./01-install-dependencies.sh

# 2. Clonar y compilar el proyecto
./02-clone-and-build.sh

# 3. Configurar servicios (systemd, nginx)
./03-configure-services.sh
```

## 🔄 Deploy de Actualizaciones

Para desplegar nuevas versiones después de hacer push a GitHub:

```bash
# Deploy completo (backend + frontend)
./deploy.sh

# Solo backend
./deploy.sh --backend-only

# Solo frontend
./deploy.sh --frontend-only
```

## 📍 URLs de Acceso

Una vez instalado, accede desde tu Mac:

| Servicio | URL |
|----------|-----|
| Frontend | http://10.211.55.4 |
| API | http://10.211.55.4/api |
| Swagger | http://10.211.55.4/swagger |

> **Nota:** Reemplaza `10.211.55.4` con la IP real de tu Ubuntu.

## 🔧 Comandos Útiles

```bash
# Ver estado de servicios
sudo systemctl status pcm-backend
sudo systemctl status nginx

# Reiniciar servicios
sudo systemctl restart pcm-backend
sudo systemctl reload nginx

# Ver logs del backend
sudo journalctl -u pcm-backend -f

# Ver logs de nginx
sudo tail -f /var/www/pcm/logs/nginx-*.log

# Ver logs del backend (archivos)
sudo tail -f /var/www/pcm/logs/backend-*.log
```

## 📁 Estructura de Archivos en Ubuntu

```
/var/www/pcm/
├── source/              # Código fuente (git clone)
│   ├── backend/
│   └── frontend/
├── backend/
│   ├── publish/         # .NET publicado
│   └── .env             # Variables de entorno
├── frontend/
│   └── dist/            # React build
└── logs/
    ├── backend-stdout.log
    ├── backend-stderr.log
    ├── nginx-access.log
    └── nginx-error.log
```

## 🔐 Base de Datos

Este ambiente usa la **misma base de datos de Supabase** que desarrollo.

⚠️ **IMPORTANTE:** En un ambiente real de certificación, deberías tener una base de datos separada para evitar conflictos con los datos de desarrollo.

## 🐛 Troubleshooting

### El backend no inicia
```bash
# Ver logs detallados
sudo journalctl -u pcm-backend -n 100 --no-pager

# Verificar que el archivo existe
ls -la /var/www/pcm/backend/publish/

# Intentar ejecutar manualmente
cd /var/www/pcm/backend/publish
dotnet PCM.API.dll
```

### El frontend no carga
```bash
# Verificar que los archivos existen
ls -la /var/www/pcm/frontend/dist/

# Verificar configuración de nginx
sudo nginx -t

# Ver logs de nginx
sudo tail -f /var/www/pcm/logs/nginx-error.log
```

### No puedo acceder desde Mac
```bash
# Verificar firewall en Ubuntu
sudo ufw status

# Verificar que nginx escucha en puerto 80
sudo netstat -tlnp | grep :80

# Hacer ping desde Mac
ping <IP_UBUNTU>
```
