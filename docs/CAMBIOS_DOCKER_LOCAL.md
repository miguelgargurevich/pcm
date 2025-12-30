# 📋 Resumen de Cambios para Deploy Docker Local

Este documento lista todos los archivos creados y modificados para permitir el deploy local con Docker usando SMTP institucional y almacenamiento local en lugar de Resend y Supabase.

## 🆕 Archivos Nuevos Creados

### 1. Servicios de Infraestructura

#### `backend/PCM.Infrastructure/Services/SmtpEmailService.cs`
- **Propósito**: Reemplaza `ResendEmailService` para usar SMTP institucional
- **Características**:
  - Usa `System.Net.Mail.SmtpClient`
  - Soporta SMTP con o sin autenticación
  - Configurable SSL/TLS
  - Mantiene misma interfaz `IEmailService`

#### `backend/PCM.Application/Interfaces/IFileStorageService.cs`
- **Propósito**: Interfaz para servicios de almacenamiento de archivos
- **Métodos**:
  - `UploadFileAsync()`: Subir archivos
  - `DeleteFileAsync()`: Eliminar archivos
  - `FileExistsAsync()`: Verificar existencia
  - `GetPublicUrl()`: Obtener URL pública

#### `backend/PCM.Infrastructure/Services/LocalFileStorageService.cs`
- **Propósito**: Implementación de almacenamiento local (reemplaza Supabase)
- **Características**:
  - Guarda archivos en sistema de archivos local
  - Validación de extensiones y tamaños
  - Sanitización de nombres de archivo
  - URLs públicas via `/api/files/{path}`

#### `backend/PCM.API/Controllers/FilesController.cs`
- **Propósito**: Servir archivos almacenados localmente
- **Endpoint**: `GET /api/files/{*filePath}`
- **Características**:
  - Detección automática de Content-Type
  - Streaming de archivos
  - Manejo de rutas relativas

### 2. Configuración

#### `backend/PCM.API/appsettings.Docker.json`
- **Propósito**: Configuración específica para ambiente Docker
- **Incluye**:
  - ✅ Sección `Smtp` (en lugar de `Resend`)
  - ✅ Sección `FileStorage` (en lugar de `Supabase`)
  - ✅ ConnectionString para PostgreSQL en Docker
  - ✅ CORS para desarrollo local

### 3. Docker

#### `docker-compose.local.yml`
- **Propósito**: Orquestación de servicios para pruebas locales
- **Servicios**:
  - **postgres**: PostgreSQL 15 (puerto 5433)
  - **mailhog**: Servidor SMTP de pruebas (puertos 1025, 8025)
  - **backend**: API .NET 9 (puerto 5164)
- **Volúmenes**:
  - `postgres_data`: Datos de la base de datos
  - `storage_data`: Archivos subidos

#### `Dockerfile.local`
- **Propósito**: Imagen Docker del backend para desarrollo
- **Características**:
  - Multi-stage build (SDK + Runtime)
  - Crea directorio `/app/storage`
  - Health check incluido
  - Ambiente `Docker` por defecto

### 4. Documentación y Scripts

#### `DOCKER_LOCAL_README.md`
- **Propósito**: Guía completa para pruebas locales con Docker
- **Contenido**:
  - Instrucciones de inicio rápido
  - Descripción de servicios
  - Comandos de testing
  - Troubleshooting
  - Diferencias con producción

#### `start-local-docker.sh`
- **Propósito**: Script automatizado para iniciar el ambiente local
- **Funciones**:
  - Verifica Docker esté corriendo
  - Valida puertos disponibles
  - Build y start de servicios
  - Health check automático
  - Abre browser con endpoints
  - Muestra logs en tiempo real

## ✏️ Archivos Modificados

### 1. `backend/PCM.API/Program.cs`
**Cambios realizados**:
```csharp
// ANTES:
builder.Services.AddHttpClient<IEmailService, ResendEmailService>();

// AHORA:
var useSmtp = !string.IsNullOrEmpty(builder.Configuration["Smtp:Host"]);
if (useSmtp)
{
    builder.Services.AddScoped<IEmailService, SmtpEmailService>();
}
else
{
    builder.Services.AddHttpClient<IEmailService, ResendEmailService>();
}

// AGREGADO:
builder.Services.AddScoped<IFileStorageService, LocalFileStorageService>();
```

**Motivo**: Registro condicional de servicios según configuración disponible.

### 2. `backend/PCM.API/Controllers/CumplimientoNormativoController.cs`
**Cambios realizados**:
1. Agregado constructor parameter: `IFileStorageService _fileStorageService`
2. Refactorizado método `UploadDocument()`:
   - **ANTES**: Código hardcoded con HttpClient directo a Supabase
   - **AHORA**: Usa `_fileStorageService.UploadFileAsync()`
3. Removidas 70+ líneas de código de integración directa con Supabase

**Motivo**: Desacoplar lógica de storage del controlador, facilitar testing y mantenimiento.

## 🔧 Configuración de Servicios

### Email Service (SMTP)

**Desarrollo/Docker**:
```json
{
  "Smtp": {
    "Host": "mailhog",
    "Port": 1025,
    "EnableSsl": false,
    "FromEmail": "no-reply@pcm.gob.pe",
    "FromName": "Plataforma de Cumplimiento Digital"
  }
}
```

**Producción** (ejemplo):
```json
{
  "Smtp": {
    "Host": "smtp.pcm.gob.pe",
    "Port": 587,
    "Username": "usuario_smtp",
    "Password": "password_smtp",
    "EnableSsl": true,
    "FromEmail": "plataforma@pcm.gob.pe",
    "FromName": "Plataforma de Cumplimiento Digital"
  }
}
```

### File Storage

**Desarrollo/Docker**:
```json
{
  "FileStorage": {
    "BasePath": "/app/storage",
    "BaseUrl": "/api/files",
    "MaxFileSizeMB": 10,
    "AllowedExtensions": ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
  }
}
```

**Producción**:
```json
{
  "FileStorage": {
    "BasePath": "/var/www/pcm/storage",
    "BaseUrl": "/api/files",
    "MaxFileSizeMB": 10,
    "AllowedExtensions": ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
  }
}
```

## 🎯 Impacto de los Cambios

### ✅ Beneficios

1. **Independencia de servicios externos**
   - No requiere Resend API
   - No requiere Supabase Storage

2. **Flexibilidad**
   - Fácil cambio entre SMTP providers
   - Storage configurable (local, NFS, etc.)

3. **Costos**
   - Sin costos de Resend ($20/mes)
   - Sin costos de Supabase Storage

4. **Control**
   - Archivos en servidor propio
   - SMTP institucional
   - Cumplimiento de políticas de SGTD

5. **Testing**
   - MailHog captura emails sin enviarlos
   - Pruebas locales sin servicios externos

### ⚠️ Consideraciones

1. **Email en Desarrollo**
   - MailHog solo para desarrollo
   - En producción usar SMTP institucional de PCM

2. **Storage en Producción**
   - Configurar backups del directorio `/var/www/pcm/storage`
   - Asegurar permisos correctos (chown www-data:www-data)
   - Considerar límite de espacio en disco

3. **Migración de Datos Existentes**
   - Si hay archivos en Supabase, migrarlos manualmente
   - Actualizar URLs en base de datos

## 🚀 Cómo Usar

### Desarrollo Local con Docker

```bash
# Opción 1: Script automatizado
./start-local-docker.sh

# Opción 2: Manual
docker-compose -f docker-compose.local.yml up --build
```

### Verificación

```bash
# Health check
curl http://localhost:5164/health

# Subir archivo (requiere JWT)
curl -X POST http://localhost:5164/api/cumplimientonormativo/upload \
  -H "Authorization: Bearer TOKEN" \
  -F "file=@documento.pdf"

# Ver emails capturados
open http://localhost:8025
```

### Producción

1. Actualizar `appsettings.Production.json` con:
   - Credenciales SMTP institucionales
   - Ruta storage: `/var/www/pcm/storage`
   
2. Usar `docker-compose.prod.yml` o deploy directo

## 📊 Compatibilidad

| Componente | Versión Anterior | Nueva Implementación |
|------------|------------------|----------------------|
| Email Service | Resend API | System.Net.Mail SMTP |
| File Storage | Supabase Storage | Sistema archivos local |
| Interfaz `IEmailService` | ✅ Sin cambios | ✅ Sin cambios |
| API Endpoints | ✅ Sin cambios | ✅ Sin cambios |
| Frontend | ✅ Sin cambios | ✅ Sin cambios |

**Nota**: Los cambios son **transparentes** para el frontend. Las URLs de API y respuestas JSON se mantienen igual.

## 🔄 Rollback

Si necesitas volver a Resend/Supabase:

1. En `appsettings.json`, comentar sección `Smtp` (deja `Resend`)
2. `Program.cs` detectará automáticamente y usará `ResendEmailService`
3. Para storage, necesitarías revertir cambios en `CumplimientoNormativoController`

## 📚 Archivos de Referencia

- **Informe 5.2.10**: [informes/5.2.10_Informe_Transferencia_Tecnica_Personal_TI.md](informes/5.2.10_Informe_Transferencia_Tecnica_Personal_TI.md)
- **Guía Deploy Ubuntu**: [docs/GUIA_DEPLOY_UBUNTU.md](docs/GUIA_DEPLOY_UBUNTU.md)
- **Documentación Docker Local**: [DOCKER_LOCAL_README.md](DOCKER_LOCAL_README.md)

## ✅ Checklist de Verificación

Antes de considerar completo el testing local:

- [ ] Backend levanta correctamente
- [ ] Health check responde OK
- [ ] PostgreSQL se conecta
- [ ] Swagger UI accesible
- [ ] Login de usuario funciona
- [ ] JWT tokens se generan
- [ ] Subida de PDF funciona
- [ ] Archivo se guarda en volumen Docker
- [ ] Archivo se puede descargar via `/api/files`
- [ ] Recuperación de contraseña genera email
- [ ] Email aparece en MailHog (http://localhost:8025)
- [ ] Link de reset funciona
- [ ] Logs no muestran errores críticos

---

**Fecha de Cambios**: 29 de Enero 2025  
**Autor**: Miguel Fernández Gargurevich  
**Versión**: 1.0
