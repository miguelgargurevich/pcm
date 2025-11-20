# Sistema de Permisos por Perfiles

## Descripción General

El sistema implementa un modelo de control de acceso basado en roles (RBAC) con 4 perfiles de usuario y 8 módulos funcionales. Cada perfil tiene asignado un tipo de acceso específico para cada módulo.

## Tipos de Acceso

- **T (Total)**: Acceso completo con permisos de crear, editar, eliminar y consultar
- **C (Consulta)**: Acceso de solo lectura, únicamente puede consultar
- **N (Sin acceso)**: No tiene acceso al módulo

## Perfiles del Sistema

### 1. Administrador PCM (perfil_id: 1)

**Descripción**: Usuario con privilegios administrativos de la Presidencia del Consejo de Ministros.

**Accesos por Módulo**:

| Módulo | Tipo Acceso | Crear | Editar | Eliminar | Consultar |
|--------|-------------|-------|--------|----------|-----------|
| Gestionar Usuarios | T | ✅ | ✅ | ✅ | ✅ |
| Gestionar Entidades | T | ✅ | ✅ | ✅ | ✅ |
| Gestionar Marco Normativo | T | ✅ | ✅ | ✅ | ✅ |
| Gestionar Compromisos G.D. | T | ✅ | ✅ | ✅ | ✅ |
| **Cumplimiento Normativo** | **N** | ❌ | ❌ | ❌ | ❌ |
| Seguimiento PGD - PP | T | ✅ | ✅ | ✅ | ✅ |
| Evaluación & Cumplimiento | T | ✅ | ✅ | ✅ | ✅ |
| Consultas & Reportes | T | ✅ | ✅ | ✅ | ✅ |

**Responsabilidades**:
- Gestión completa de usuarios y entidades
- Administración del marco normativo y compromisos
- Supervisión de seguimiento y evaluación
- Generación de reportes
- **NO** tiene acceso al módulo de Cumplimiento Normativo (reservado para Entidades)

---

### 2. Entidad (perfil_id: 2)

**Descripción**: Usuario representante de una entidad pública que registra su cumplimiento normativo.

**Accesos por Módulo**:

| Módulo | Tipo Acceso | Crear | Editar | Eliminar | Consultar |
|--------|-------------|-------|--------|----------|-----------|
| Gestionar Usuarios | N | ❌ | ❌ | ❌ | ❌ |
| Gestionar Entidades | N | ❌ | ❌ | ❌ | ❌ |
| **Gestionar Marco Normativo** | **C** | ❌ | ❌ | ❌ | ✅ |
| **Gestionar Compromisos G.D.** | **C** | ❌ | ❌ | ❌ | ✅ |
| **Cumplimiento Normativo** | **T** | ✅ | ✅ | ✅ | ✅ |
| Seguimiento PGD - PP | N | ❌ | ❌ | ❌ | ❌ |
| Evaluación & Cumplimiento | N | ❌ | ❌ | ❌ | ❌ |
| Consultas & Reportes | N | ❌ | ❌ | ❌ | ❌ |

**Responsabilidades**:
- Registro completo de su cumplimiento normativo
- Consulta del marco normativo vigente
- Consulta de compromisos de gobierno digital
- **NO** puede modificar catálogos ni acceder a otros módulos administrativos

---

### 3. Operador PCM (perfil_id: 3)

**Descripción**: Usuario operativo de la PCM enfocado en seguimiento, evaluación y reportes.

**Accesos por Módulo**:

| Módulo | Tipo Acceso | Crear | Editar | Eliminar | Consultar |
|--------|-------------|-------|--------|----------|-----------|
| Gestionar Usuarios | N | ❌ | ❌ | ❌ | ❌ |
| Gestionar Entidades | N | ❌ | ❌ | ❌ | ❌ |
| **Gestionar Marco Normativo** | **C** | ❌ | ❌ | ❌ | ✅ |
| **Gestionar Compromisos G.D.** | **C** | ❌ | ❌ | ❌ | ✅ |
| Cumplimiento Normativo | N | ❌ | ❌ | ❌ | ❌ |
| **Seguimiento PGD - PP** | **T** | ✅ | ✅ | ✅ | ✅ |
| **Evaluación & Cumplimiento** | **T** | ✅ | ✅ | ✅ | ✅ |
| **Consultas & Reportes** | **T** | ✅ | ✅ | ✅ | ✅ |

**Responsabilidades**:
- Gestión completa de seguimiento de planes y programas
- Evaluación del cumplimiento normativo
- Generación y gestión de reportes
- Consulta del marco normativo y compromisos
- **NO** puede gestionar usuarios, entidades ni registrar cumplimientos

---

### 4. Invitado / Consulta (perfil_id: 4)

**Descripción**: Usuario externo con acceso limitado, principalmente para consultas y reportes.

**Accesos por Módulo**:

| Módulo | Tipo Acceso | Crear | Editar | Eliminar | Consultar |
|--------|-------------|-------|--------|----------|-----------|
| Gestionar Usuarios | N | ❌ | ❌ | ❌ | ❌ |
| Gestionar Entidades | N | ❌ | ❌ | ❌ | ❌ |
| **Gestionar Marco Normativo** | **C** | ❌ | ❌ | ❌ | ✅ |
| **Gestionar Compromisos G.D.** | **C** | ❌ | ❌ | ❌ | ✅ |
| Cumplimiento Normativo | N | ❌ | ❌ | ❌ | ❌ |
| Seguimiento PGD - PP | N | ❌ | ❌ | ❌ | ❌ |
| Evaluación & Cumplimiento | N | ❌ | ❌ | ❌ | ❌ |
| **Consultas & Reportes** | **T** | ✅ | ✅ | ✅ | ✅ |

**Responsabilidades**:
- Acceso completo al módulo de consultas y reportes
- Consulta del marco normativo y compromisos
- **NO** tiene acceso a módulos operativos o administrativos

---

## Matriz Resumen de Permisos

| Módulo | Administrador PCM | Entidad | Operador PCM | Invitado |
|--------|-------------------|---------|--------------|----------|
| Gestionar Usuarios | **T** | N | N | N |
| Gestionar Entidades | **T** | N | N | N |
| Marco Normativo | **T** | **C** | **C** | **C** |
| Compromisos G.D. | **T** | **C** | **C** | **C** |
| Cumplimiento Normativo | N | **T** | N | N |
| Seguimiento PGD - PP | **T** | N | **T** | N |
| Evaluación & Cumplimiento | **T** | N | **T** | N |
| Consultas & Reportes | **T** | N | **T** | **T** |

---

## Usuarios de Prueba

### Producción / Supabase

| Email | Contraseña | Perfil | DNI |
|-------|------------|--------|-----|
| admin.test@pcm.gob.pe | Admin123! | Administrador PCM | 87654321 |
| entidad.test@gob.pe | Admin123! | Entidad | 12348765 |
| operador.test@pcm.gob.pe | Admin123! | Operador PCM | 45678912 |
| invitado.test@externo.gob.pe | Admin123! | Invitado | 78945612 |

---

## Implementación Técnica

### Backend

**Tablas de Base de Datos**:
- `permisos_modulos`: Catálogo de módulos del sistema
- `perfiles_permisos`: Matriz de permisos por perfil y módulo

**Endpoints API**:
- `GET /api/permisos/perfil/{perfilId}`: Obtiene todos los permisos de un perfil
- `GET /api/permisos/verificar`: Verifica si un perfil tiene permiso específico

**Archivos Clave**:
- `PCM.Domain/Entities/PermisoModulo.cs`
- `PCM.Domain/Entities/PerfilPermiso.cs`
- `PCM.Infrastructure/Handlers/Permisos/GetPermisosByPerfilHandler.cs`
- `PCM.Infrastructure/Handlers/Permisos/VerificarPermisoHandler.cs`
- `PCM.API/Controllers/PermisosController.cs`

### Frontend

**Archivos Clave**:
- `frontend/src/config/permissions.js`: Constantes y helpers
- `frontend/src/services/permisosService.js`: Cliente API
- `frontend/src/hooks/usePermissions.js`: Hook personalizado
- `frontend/src/components/ProtectedAction.jsx`: Componente protector
- `frontend/src/components/ConsultaBadge.jsx`: Indicador de modo consulta
- `frontend/src/layouts/DashboardLayout.jsx`: Menú filtrado por permisos

**Funciones Helper**:
```javascript
tieneAcceso(permisos, codigoModulo)          // Verifica si tiene acceso (T o C)
tienePermisoTotal(permisos, codigoModulo)    // Verifica acceso total (T)
soloConsulta(permisos, codigoModulo)         // Verifica modo consulta (C)
puedeRealizarAccion(permisos, modulo, accion) // Verifica acción específica
```

---

## Flujo de Autenticación y Permisos

1. **Login**: Usuario se autentica con email/password
2. **Token JWT**: Backend genera token con `perfil_id` incluido
3. **Carga de Permisos**: Frontend solicita permisos usando `perfil_id`
4. **Filtrado de Menú**: Hook `usePermissions` filtra opciones del menú
5. **Protección de Acciones**: Componente `ProtectedAction` oculta/muestra botones
6. **Validación Backend**: Endpoints protegen operaciones CRUD

---

## Reglas de Negocio

1. **Separación de Responsabilidades**:
   - Administradores gestionan catálogos y configuración
   - Entidades registran sus propios cumplimientos
   - Operadores supervisan y evalúan
   - Invitados solo consultan información pública

2. **Modo Consulta**:
   - Usuarios con acceso tipo "C" ven un badge visual
   - No se muestran botones de creación, edición o eliminación
   - Solo pueden navegar y visualizar información

3. **Segregación de Funciones**:
   - Administradores NO pueden registrar cumplimientos (evita conflicto de interés)
   - Entidades NO pueden modificar catálogos (mantiene integridad de datos)
   - Operadores NO pueden gestionar usuarios (previene escalada de privilegios)

---

## Scripts de Migración

**Local**:
```bash
psql -h localhost -p 5433 -U dashboard_user -d plataforma_cumplimiento_digital \
  -f db/migration_permisos_perfiles.sql
```

**Supabase**:
- Archivo: `db/PRODUCCION_migration_permisos_perfiles.sql`
- Incluye: Tablas, índices, permisos y usuarios de prueba

---

## Mantenimiento

### Agregar Nuevo Módulo

1. Insertar en `permisos_modulos`:
```sql
INSERT INTO permisos_modulos (codigo, nombre, descripcion, ruta, icono, orden) 
VALUES ('nuevo_modulo', 'Nombre Módulo', 'Descripción', '/dashboard/ruta', 'Icon', 9);
```

2. Asignar permisos a cada perfil:
```sql
INSERT INTO perfiles_permisos (perfil_id, permiso_modulo_id, tipo_acceso, ...)
SELECT perfil_id, (SELECT permiso_modulo_id FROM permisos_modulos WHERE codigo='nuevo_modulo'), 'T', ...
FROM perfiles WHERE perfil_id = 1;
```

3. Actualizar frontend: Agregar al array `allMenuItems` en `DashboardLayout.jsx`

### Modificar Permisos Existentes

```sql
UPDATE perfiles_permisos 
SET tipo_acceso = 'C', puede_crear = false, puede_editar = false 
WHERE perfil_id = 2 AND permiso_modulo_id = (
  SELECT permiso_modulo_id FROM permisos_modulos WHERE codigo = 'usuarios'
);
```

---

**Fecha de Implementación**: 20 de noviembre de 2025  
**Versión**: 1.0  
**Última Actualización**: 20 de noviembre de 2025
