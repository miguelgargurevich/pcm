# Plataforma de Cumplimiento Digital (PCM)

Sistema web para la gestión de compromisos y cumplimiento normativo en entidades del Estado.

## Resumen

PCM es una solución full stack con:

- Backend en .NET 9 con arquitectura en capas y MediatR (CQRS).
- Frontend en React + Vite + Tailwind.
- Persistencia en PostgreSQL.
- Autenticación JWT y validación con reCAPTCHA.
- Soporte de ejecución local y despliegue con Docker.

## Arquitectura

### Backend

- .NET 9
- Entity Framework Core + Npgsql
- MediatR para comandos/consultas
- Swagger/OpenAPI
- Servicios de correo (Gmail OAuth2, AWS SES, SMTP o Resend según configuración)

### Frontend

- React 19 + Vite
- React Router
- Tailwind CSS
- Axios
- reCAPTCHA v3

## Estructura del repositorio

```text
PCM/
├── backend/
│   ├── PCM.API/              # API, configuración y arranque
│   ├── PCM.Application/      # Casos de uso, DTOs, interfaces
│   ├── PCM.Domain/           # Entidades y reglas de dominio
│   ├── PCM.Infrastructure/   # Persistencia e implementaciones
│   └── PCM.Shared/           # Código transversal
├── frontend/                 # Aplicación React
├── db/                       # Scripts SQL y utilidades de base de datos
├── deploy/                   # Archivos y scripts de despliegue productivo
├── docs/                     # Documentación funcional/técnica
└── docker-compose*.yml       # Orquestación Docker local/servidor
```

## Requisitos

- Git
- Node.js 18 o superior
- npm
- .NET SDK 9.0
- PostgreSQL 15 o superior (o acceso a una instancia remota)
- Docker y Docker Compose (opcional pero recomendado)

## Inicio rápido

### Opción A: Desarrollo full stack sin Docker

1. Instalar dependencias del frontend:

```bash
npm run install:all
```

2. Ejecutar backend y frontend en paralelo:

```bash
npm run dev
```

Servicios esperados:

- Frontend: http://localhost:5173
- Backend API: http://localhost:5165 (por defecto en Program.cs)

Nota: si el frontend apunta a otro puerto de API, revisar la variable VITE_API_URL en el entorno correspondiente.

### Opción B: Ejecución local con Docker

```bash
chmod +x start-local-docker.sh
./start-local-docker.sh
```

Servicios esperados en Docker local:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5164
- Health check: http://localhost:5164/health

## Configuración de entorno

### Frontend

Archivos disponibles:

- frontend/.env
- frontend/.env.local
- frontend/.env.production
- frontend/.env.docker

Variables típicas:

```env
VITE_API_URL=http://localhost:5164/api
VITE_RECAPTCHA_SITE_KEY=tu_site_key
```

### Backend

Archivos disponibles:

- backend/PCM.API/appsettings.json
- backend/PCM.API/appsettings.Development.json
- backend/PCM.API/appsettings.Production.json
- backend/PCM.API/appsettings.Docker.json

Claves importantes a validar:

- ConnectionStrings:DefaultConnection
- JwtSettings:SecretKey / Issuer / Audience
- ReCaptcha:SecretKey
- Sección de proveedor de correo (Gmail, AWS, SMTP o Resend)
- Cors:Origins

## Scripts útiles del repositorio

- npm run dev: ejecuta backend y frontend a la vez
- npm run dev:backend: inicia backend con dotnet watch
- npm run dev:frontend: inicia frontend con Vite
- start-local-docker.sh: entorno local dockerizado
- start-server-docker.sh: arranque para servidor Linux del cliente
- deploy-to-server.sh: utilidad de despliegue a servidor
- delete-from-server.sh: utilidad de limpieza en servidor

## Despliegue

Para despliegue productivo o en servidor Ubuntu, revisar:

- deploy/README.md
- docs/GUIA_DEPLOY_UBUNTU.md
- docker-compose.server.yml
- deploy/docker-compose.prod.yml

### Despliegue separado en Coolify

Si el frontend y el backend van en proyectos distintos, el backend debe recibir estas variables en Coolify:

- `ConnectionStrings__DefaultConnection`
- `JwtSettings__SecretKey`
- `JwtSettings__Issuer`
- `JwtSettings__Audience`
- `JwtSettings__ExpirationMinutes`
- `Cors__Origins__0` con la URL pública del frontend

En ese escenario, no uses `postgres` como host de la cadena de conexión salvo que la base esté en el mismo stack o red de Docker.

## Seguridad

- JWT para autenticación de API
- Hashing de contraseñas
- Validación reCAPTCHA
- CORS configurable por entorno

## Documentación adicional

Documentos relevantes:

- docs/DOCKER_LOCAL_README.md
- docs/MIGRACION_PRODUCCION.md
- docs/VERCEL_ENV_SETUP.md
- docs/CONFIGURACION_SMTP.md
- docs/AWS_SES_CONFIG.md
- docs/PASSWORD_RESET_FEATURE.md

## Estado del proyecto

El repositorio contiene módulos funcionales y módulos en evolución. Para el estado funcional detallado por entregable, revisar la carpeta informes.

## Licencia

Proyecto de uso institucional para la Presidencia del Consejo de Ministros del Peru.
