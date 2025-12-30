# 🐳 Guía de Prueba Local con Docker

Esta guía te ayudará a probar el deploy de la Plataforma de Cumplimiento Digital localmente usando Docker.

## 📋 Prerrequisitos

- Docker Desktop instalado y en ejecución
- Al menos 4GB de RAM disponible para Docker
- Puertos disponibles: 5164, 5433, 1025, 8025

## 🚀 Inicio Rápido

### 1. Levantar los servicios

```bash
docker-compose -f docker-compose.local.yml up --build
```

### 2. Verificar que todo esté funcionando

- **API Backend**: http://localhost:5164
- **Swagger UI**: http://localhost:5164 
- **Health Check**: http://localhost:5164/health
- **MailHog UI**: http://localhost:8025 (ver emails de prueba)
- **PostgreSQL**: localhost:5433

## 📦 Servicios Incluidos

### Backend (.NET 9)
- **Puerto**: 5164
- **Ambiente**: Docker
- **Config**: appsettings.Docker.json
- **Storage**: Volumen Docker en `/app/storage`

### PostgreSQL 15
- **Puerto**: 5433 (para evitar conflicto con PostgreSQL local)
- **Usuario**: pcm_user
- **Password**: pcm_pass_2025
- **Base de datos**: pcm_db

### MailHog (SMTP de pruebas)
- **SMTP**: localhost:1025
- **Web UI**: http://localhost:8025
- Todos los emails enviados se capturan aquí

## 🔧 Configuración Aplicada

### Email Service (SMTP)
- ✅ Reemplaza Resend
- Servidor: MailHog (localhost:1025)
- SSL: Deshabilitado (desarrollo)
- Ver emails en: http://localhost:8025

### File Storage (Local)
- ✅ Reemplaza Supabase Storage
- Ruta: `/app/storage` dentro del contenedor
- Volumen persistente: `storage_data`
- Acceso via API: `GET /api/files/{filePath}`

### Base de Datos
- PostgreSQL 15 Alpine
- Volumen persistente: `postgres_data`
- Scripts de inicialización en `/db`

## 🧪 Probar Funcionalidades

### 1. Verificar API

```bash
curl http://localhost:5164/health
```

Respuesta esperada:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-01-29T...",
  "environment": "Docker"
}
```

### 2. Subir un documento

```bash
curl -X POST http://localhost:5164/api/cumplimientonormativo/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@documento.pdf"
```

### 3. Probar envío de email

1. Solicitar recuperación de contraseña desde el frontend
2. Ir a http://localhost:8025
3. Ver el email capturado por MailHog

### 4. Descargar un archivo

```bash
curl http://localhost:5164/api/files/documentos/GUID_nombre-archivo.pdf
```

## 📊 Logs y Debugging

### Ver logs en tiempo real

```bash
# Todos los servicios
docker-compose -f docker-compose.local.yml logs -f

# Solo backend
docker-compose -f docker-compose.local.yml logs -f backend

# Solo PostgreSQL
docker-compose -f docker-compose.local.yml logs -f postgres
```

### Acceder al contenedor del backend

```bash
docker exec -it pcm-backend-local /bin/bash
```

### Ver archivos almacenados

```bash
docker exec pcm-backend-local ls -la /app/storage/documentos
```

### Ver base de datos

```bash
docker exec -it pcm-postgres-local psql -U pcm_user -d pcm_db
```

Comandos PostgreSQL útiles:
```sql
-- Ver todas las tablas
\dt

-- Ver entidades
SELECT * FROM entidades LIMIT 5;

-- Ver usuarios
SELECT * FROM usuarios;

-- Salir
\q
```

## 🛑 Detener y Limpiar

### Detener servicios (mantener datos)

```bash
docker-compose -f docker-compose.local.yml down
```

### Detener y eliminar volúmenes (reset completo)

```bash
docker-compose -f docker-compose.local.yml down -v
```

### Limpiar imágenes huérfanas

```bash
docker system prune -a
```

## 🔄 Actualizar Código

Si haces cambios en el código del backend:

```bash
# Reconstruir solo el backend
docker-compose -f docker-compose.local.yml up --build backend

# O reiniciar todo
docker-compose -f docker-compose.local.yml down
docker-compose -f docker-compose.local.yml up --build
```

## 🐛 Troubleshooting

### Error: Puerto ya en uso

```bash
# Ver qué proceso usa el puerto 5164
lsof -i :5164
# O en Windows
netstat -ano | findstr :5164

# Cambiar puerto en docker-compose.local.yml
ports:
  - "5165:5164"  # Usar 5165 en host
```

### Error: No se puede conectar a la BD

```bash
# Verificar que PostgreSQL esté healthy
docker-compose -f docker-compose.local.yml ps

# Ver logs de PostgreSQL
docker-compose -f docker-compose.local.yml logs postgres
```

### Error: Archivos no se guardan

```bash
# Verificar permisos del volumen
docker exec pcm-backend-local ls -la /app/storage

# Verificar configuración
docker exec pcm-backend-local cat /app/appsettings.Docker.json
```

### Error: Emails no se envían

1. Verificar que MailHog esté corriendo: http://localhost:8025
2. Ver logs del backend para errores SMTP
3. Verificar configuración SMTP en appsettings.Docker.json

## 📝 Notas Importantes

### Diferencias con Producción

| Característica | Local (Docker) | Producción |
|----------------|----------------|------------|
| SMTP | MailHog (puerto 1025) | SMTP institucional PCM |
| Base de Datos | PostgreSQL local | 101.44.10.71:5432 |
| Storage | Volumen Docker local | `/var/www/pcm/storage` |
| SSL | Deshabilitado | Habilitado |
| Puerto | 5164 | 5000 (detrás de Nginx) |

### Migrar a Producción

Para producción, necesitarás actualizar [appsettings.Production.json](backend/PCM.API/appsettings.Production.json):

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=101.44.10.71;Port=5432;Database=pcd_plataforma;Username=postgres;Password=DB2812PCD$$$"
  },
  "Smtp": {
    "Host": "smtp.pcm.gob.pe",
    "Port": 587,
    "Username": "usuario_institucional",
    "Password": "password_smtp",
    "FromEmail": "plataforma@pcm.gob.pe",
    "EnableSsl": true
  },
  "FileStorage": {
    "BasePath": "/var/www/pcm/storage"
  }
}
```

## 🎯 Siguientes Pasos

1. ✅ Probar todas las funcionalidades localmente
2. 📝 Documentar cualquier problema encontrado
3. 🔧 Ajustar configuración si es necesario
4. 🚀 Preparar deploy a servidor Ubuntu de SGTD

## 📚 Referencias

- [Informe 5.2.10 - Transferencia Técnica](informes/5.2.10_Informe_Transferencia_Tecnica_Personal_TI.md)
- [Guía Deploy Ubuntu](docs/GUIA_DEPLOY_UBUNTU.md)
- [Documentación Docker Compose](https://docs.docker.com/compose/)

## 🆘 Ayuda

Si encuentras algún problema:

1. Revisa los logs: `docker-compose logs -f`
2. Verifica el health check: http://localhost:5164/health
3. Consulta la sección de Troubleshooting arriba
4. Revisa los informes técnicos en `/informes`
