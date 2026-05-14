# Archivos de Deploy

Esta carpeta contiene todos los archivos necesarios para desplegar la aplicación PCM en un servidor Ubuntu.

## Estructura

```
deploy/
├── GUIA_DEPLOY_UBUNTU.md    # Guía paso a paso
├── deploy.sh                 # Script automatizado de deployment
├── docker-compose.prod.yml   # Docker Compose para producción
├── Dockerfile.backend        # Dockerfile para el backend .NET
├── .env.example              # Variables de entorno de ejemplo
└── nginx/
    └── pcm.conf              # Configuración de Nginx
```

## Uso Rápido

### Opción 1: Script Automatizado (Recomendado)

```bash
# En el servidor Ubuntu, como root:
wget https://raw.githubusercontent.com/miguelgargurevich/pcm/main/deploy/deploy.sh
chmod +x deploy.sh
sudo ./deploy.sh install
```

### Opción 2: Manual

Seguir la guía detallada en `GUIA_DEPLOY_UBUNTU.md`

## Requisitos del Servidor

- Ubuntu Server 22.04 LTS o superior
- Mínimo 2GB RAM
- 20GB de disco
- Acceso SSH
- Dominio (opcional, para SSL)

## Arquitectura

```
Internet → Nginx (80/443) → Frontend (archivos estáticos)
                         → Backend Docker (5000) → PostgreSQL Docker
```

## Despliegue separado en Coolify

Cuando el frontend y el backend se despliegan como proyectos distintos:

- El frontend consume la API usando `VITE_API_URL` apuntando al dominio o URL pública del backend.
- El backend debe recibir por entorno `ConnectionStrings__DefaultConnection`, `JwtSettings__SecretKey`, `JwtSettings__Issuer`, `JwtSettings__Audience` y `JwtSettings__ExpirationMinutes`.
- Si la base de datos vive en otro proyecto o contenedor, la cadena de conexión debe apuntar a un host alcanzable desde el backend; no uses `postgres` salvo que compartan red.
- Agrega el dominio real del frontend a `Cors__Origins__0` para evitar bloqueos por CORS.
- Para backend en Docker, usa `ASPNETCORE_ENVIRONMENT=Production` y `PORT=8080`.

## Comandos del Script

| Comando | Descripción |
|---------|-------------|
| `./deploy.sh install` | Instalación completa |
| `./deploy.sh start` | Iniciar servicios |
| `./deploy.sh stop` | Detener servicios |
| `./deploy.sh restart` | Reiniciar servicios |
| `./deploy.sh logs` | Ver logs en tiempo real |
| `./deploy.sh backup` | Backup de base de datos |
| `./deploy.sh update` | Actualizar desde Git |
