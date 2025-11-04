# Plataforma de Cumplimiento Digital (PCM)

Sistema integral para la gestión de cumplimiento normativo y gobierno digital en entidades públicas del Perú.

## 🏗️ Arquitectura

### Backend (.NET 9.0)
- **Clean Architecture** con CQRS pattern
- **Entity Framework Core** con PostgreSQL
- **JWT Authentication** con refresh tokens
- **MediatR** para Commands y Queries
- **Swagger** para documentación de API

### Frontend (React + Vite)
- **React 19** con React Router DOM
- **Tailwind CSS** para estilos
- **Axios** para llamadas HTTP
- **reCAPTCHA v3** para seguridad
- **Lucide React** para iconos

## 📦 Estructura del Proyecto

```
PCM/
├── backend/
│   ├── PCM.API/              # Web API con controladores
│   ├── PCM.Application/      # Commands, Queries, DTOs
│   ├── PCM.Domain/           # Entidades del dominio
│   ├── PCM.Infrastructure/   # Handlers, DbContext, Services
│   └── PCM.Shared/           # Utilidades compartidas
├── frontend/
│   ├── src/
│   │   ├── components/       # Componentes reutilizables
│   │   ├── pages/           # Páginas de la aplicación
│   │   ├── layouts/         # Layouts (Dashboard, etc.)
│   │   ├── services/        # Servicios de API
│   │   ├── context/         # Context API de React
│   │   └── hooks/           # Custom hooks
│   └── public/              # Recursos estáticos
├── db/                       # Scripts SQL y backups
└── docs/                     # Documentación del proyecto
```

## 🚀 Tecnologías

### Backend
- .NET 9.0
- PostgreSQL 15+
- Entity Framework Core 9.0
- BCrypt.Net para hashing de contraseñas
- FluentValidation

### Frontend
- React 19.1
- Vite 7.1
- Tailwind CSS 3
- React Router DOM 7
- Axios
- react-google-recaptcha-v3

## 📋 Requisitos Previos

- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL 15+](https://www.postgresql.org/download/) o Docker
- [Git](https://git-scm.com/)

## 🔧 Configuración

### 1. Base de Datos

**Opción A: Docker (Recomendado)**
```bash
docker run --name pg-dashboard -e POSTGRES_PASSWORD=dashboard_pass -e POSTGRES_USER=dashboard_user -e POSTGRES_DB=plataforma_cumplimiento_digital -p 5433:5432 -d postgres:15
```

**Opción B: PostgreSQL local**
- Crear base de datos: `plataforma_cumplimiento_digital`
- Ejecutar script: `db/Plataforma de Cumplimiento Digital-1762212194.sql`

### 2. Backend

```bash
cd backend/PCM.API
dotnet restore
dotnet build
dotnet run
```

El backend estará disponible en: http://localhost:5164

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en: http://localhost:5173

### 4. Variables de Entorno

**Frontend (.env)**
```env
VITE_RECAPTCHA_SITE_KEY=your_site_key_here
VITE_API_URL=http://localhost:5164/api
```

**Backend (appsettings.json)**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5433;Database=plataforma_cumplimiento_digital;Username=dashboard_user;Password=dashboard_pass"
  },
  "JwtSettings": {
    "SecretKey": "your_secret_key_minimum_32_characters",
    "ExpirationMinutes": 60
  },
  "ReCaptcha": {
    "SecretKey": "your_recaptcha_secret_key"
  }
}
```

## 👤 Usuario de Prueba

- **Email**: admin@pcm.gob.pe
- **Contraseña**: Admin123!

## 🎨 Paleta de Colores

- **Primary**: #2E3791 (Azul institucional)
- **Primary Dark**: #1e2563
- **Primary Light**: #3d47a8

## 📚 Módulos Implementados

### ✅ Completados
- [x] Autenticación JWT
- [x] Gestión de Usuarios
- [x] Gestión de Entidades Públicas
- [x] Marco Normativo

### 🚧 En Desarrollo
- [ ] Compromisos de Gobierno Digital
- [ ] Cumplimiento Normativo
- [ ] Seguimiento PGD-PP
- [ ] Evaluación y Cumplimiento
- [ ] Consultas y Reportes

## 🔒 Seguridad

- JWT con refresh tokens
- BCrypt para hashing de contraseñas
- reCAPTCHA v3 en login
- CORS configurado
- SQL Injection prevention con EF Core

## 📄 Licencia

Este proyecto es propiedad de la Presidencia del Consejo de Ministros (PCM) del Perú.

## 👥 Equipo de Desarrollo

Desarrollado por el equipo de Transformación Digital de la PCM.

---

**Versión**: 1.0.0  
**Última actualización**: Noviembre 2025
