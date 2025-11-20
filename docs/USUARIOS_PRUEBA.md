# Usuarios de Prueba - Plataforma de Cumplimiento Digital

## Credenciales de Acceso

### 🔐 Contraseña Universal
Todos los usuarios de prueba comparten la misma contraseña para facilitar las pruebas:

**Contraseña:** `Admin123!`

---

## 👥 Usuarios por Perfil

### 1. Administrador PCM

**Email:** `admin.test@pcm.gob.pe`  
**Contraseña:** `Admin123!`  
**DNI:** `87654321`  
**Perfil:** Administrador PCM (ID: 1)  
**Nombre Completo:** Juan Carlos Pérez González  
**Entidad:** Presidencia del Consejo de Ministros

**Permisos:**
- ✅ Gestionar Usuarios (Total)
- ✅ Gestionar Entidades (Total)
- ✅ Gestionar Marco Normativo (Total)
- ✅ Gestionar Compromisos G.D. (Total)
- ❌ Cumplimiento Normativo (Sin acceso)
- ✅ Seguimiento PGD - PP (Total)
- ✅ Evaluación & Cumplimiento (Total)
- ✅ Consultas & Reportes (Total)

**Casos de Uso:**
- Crear y gestionar usuarios del sistema
- Administrar catálogo de entidades
- Mantener marco normativo actualizado
- Gestionar compromisos de gobierno digital
- Supervisar seguimiento y evaluación
- Generar reportes administrativos

---

### 2. Entidad

**Email:** `entidad.test@gob.pe`  
**Contraseña:** `Admin123!`  
**DNI:** `12348765`  
**Perfil:** Entidad (ID: 2)  
**Nombre Completo:** María Elena Torres Ramírez  
**Entidad:** Presidencia del Consejo de Ministros

**Permisos:**
- ❌ Gestionar Usuarios (Sin acceso)
- ❌ Gestionar Entidades (Sin acceso)
- 👁️ Gestionar Marco Normativo (Solo consulta)
- 👁️ Gestionar Compromisos G.D. (Solo consulta)
- ✅ Cumplimiento Normativo (Total)
- ❌ Seguimiento PGD - PP (Sin acceso)
- ❌ Evaluación & Cumplimiento (Sin acceso)
- ❌ Consultas & Reportes (Sin acceso)

**Casos de Uso:**
- Registrar cumplimiento normativo de su entidad
- Consultar normas vigentes
- Consultar compromisos de gobierno digital
- Actualizar evidencias de cumplimiento
- Ver el estado de sus registros

---

### 3. Operador PCM

**Email:** `operador.test@pcm.gob.pe`  
**Contraseña:** `Admin123!`  
**DNI:** `45678912`  
**Perfil:** Operador PCM (ID: 3)  
**Nombre Completo:** Roberto Sánchez Mendoza  
**Entidad:** Presidencia del Consejo de Ministros

**Permisos:**
- ❌ Gestionar Usuarios (Sin acceso)
- ❌ Gestionar Entidades (Sin acceso)
- 👁️ Gestionar Marco Normativo (Solo consulta)
- 👁️ Gestionar Compromisos G.D. (Solo consulta)
- ❌ Cumplimiento Normativo (Sin acceso)
- ✅ Seguimiento PGD - PP (Total)
- ✅ Evaluación & Cumplimiento (Total)
- ✅ Consultas & Reportes (Total)

**Casos de Uso:**
- Dar seguimiento a planes y programas
- Evaluar cumplimiento de entidades
- Generar reportes de seguimiento
- Consultar marco normativo
- Consultar compromisos vigentes
- Analizar indicadores de cumplimiento

---

### 4. Invitado / Consulta

**Email:** `invitado.test@externo.gob.pe`  
**Contraseña:** `Admin123!`  
**DNI:** `78945612`  
**Perfil:** Consulta (ID: 4)  
**Nombre Completo:** Ana Lucía Vásquez Castro  
**Entidad:** Ninguna (Usuario externo)

**Permisos:**
- ❌ Gestionar Usuarios (Sin acceso)
- ❌ Gestionar Entidades (Sin acceso)
- 👁️ Gestionar Marco Normativo (Solo consulta)
- 👁️ Gestionar Compromisos G.D. (Solo consulta)
- ❌ Cumplimiento Normativo (Sin acceso)
- ❌ Seguimiento PGD - PP (Sin acceso)
- ❌ Evaluación & Cumplimiento (Sin acceso)
- ✅ Consultas & Reportes (Total)

**Casos de Uso:**
- Generar y descargar reportes públicos
- Consultar información del marco normativo
- Consultar compromisos de gobierno digital
- Acceso de solo lectura a información pública
- Análisis de datos abiertos

---

## 📊 Tabla Comparativa de Accesos

| Usuario | Usuarios | Entidades | Marco Norm. | Compromisos | Cumplimiento | Seguimiento | Evaluación | Reportes |
|---------|----------|-----------|-------------|-------------|--------------|-------------|------------|----------|
| **Admin PCM** | ✅ Total | ✅ Total | ✅ Total | ✅ Total | ❌ Sin acceso | ✅ Total | ✅ Total | ✅ Total |
| **Entidad** | ❌ Sin acceso | ❌ Sin acceso | 👁️ Consulta | 👁️ Consulta | ✅ Total | ❌ Sin acceso | ❌ Sin acceso | ❌ Sin acceso |
| **Operador** | ❌ Sin acceso | ❌ Sin acceso | 👁️ Consulta | 👁️ Consulta | ❌ Sin acceso | ✅ Total | ✅ Total | ✅ Total |
| **Invitado** | ❌ Sin acceso | ❌ Sin acceso | 👁️ Consulta | 👁️ Consulta | ❌ Sin acceso | ❌ Sin acceso | ❌ Sin acceso | ✅ Total |

**Leyenda:**
- ✅ **Total**: Puede crear, editar, eliminar y consultar
- 👁️ **Consulta**: Solo puede ver la información
- ❌ **Sin acceso**: No tiene acceso al módulo

---

## 🚀 Instrucciones de Uso

### Para Pruebas Locales

1. **Acceder al Login:**
   ```
   http://localhost:5173/login
   ```

2. **Iniciar Sesión:**
   - Seleccionar uno de los emails de prueba
   - Ingresar la contraseña: `Admin123!`
   - Hacer clic en "Iniciar Sesión"

3. **Verificar Permisos:**
   - El menú lateral mostrará solo las opciones permitidas para el perfil
   - Los botones de acción (Crear, Editar, Eliminar) solo aparecerán si hay permisos

### Para Pruebas en Producción/Supabase

1. **Ejecutar Migración:**
   ```bash
   # Ejecutar el script SQL en Supabase SQL Editor
   # Archivo: db/PRODUCCION_migration_permisos_perfiles.sql
   ```

2. **Verificar Usuarios Creados:**
   ```sql
   SELECT u.email, u.nombres, p.nombre as perfil, u.activo
   FROM usuarios u
   JOIN perfiles p ON u.perfil_id = p.perfil_id
   WHERE u.email LIKE '%.test@%';
   ```

3. **Acceder a la Aplicación:**
   - URL de producción
   - Usar las credenciales listadas arriba

---

## 🔧 Escenarios de Prueba Recomendados

### Escenario 1: Flujo Completo de Administrador
**Usuario:** `admin.test@pcm.gob.pe`

1. Crear una nueva entidad
2. Crear un usuario con perfil "Entidad" asociado a esa entidad
3. Gestionar el marco normativo (agregar normas)
4. Crear compromisos de gobierno digital
5. Verificar que NO puede acceder a "Cumplimiento Normativo"
6. Generar reportes del sistema

### Escenario 2: Registro de Cumplimiento por Entidad
**Usuario:** `entidad.test@gob.pe`

1. Consultar marco normativo disponible
2. Consultar compromisos de gobierno digital
3. Registrar un nuevo cumplimiento normativo
4. Adjuntar documentos de evidencia
5. Verificar que NO puede editar catálogos
6. Verificar que NO puede acceder a otros módulos

### Escenario 3: Seguimiento y Evaluación
**Usuario:** `operador.test@pcm.gob.pe`

1. Consultar marco normativo y compromisos
2. Revisar cumplimientos registrados por entidades
3. Registrar seguimiento de planes y programas
4. Evaluar cumplimiento de entidades
5. Generar reportes de seguimiento
6. Verificar que NO puede modificar usuarios ni entidades

### Escenario 4: Acceso de Solo Consulta
**Usuario:** `invitado.test@externo.gob.pe`

1. Consultar marco normativo vigente
2. Consultar compromisos de gobierno digital
3. Generar y descargar reportes
4. Verificar modo "Solo Consulta" en módulos permitidos
5. Verificar que NO aparecen botones de edición
6. Verificar acceso limitado al menú

---

## 🔍 Verificación de Permisos

### Endpoints de API para Verificar

1. **Obtener permisos de un perfil:**
   ```http
   GET /api/permisos/perfil/1
   Authorization: Bearer {token}
   ```

2. **Verificar permiso específico:**
   ```http
   GET /api/permisos/verificar?perfilId=1&codigoModulo=usuarios&accion=crear
   Authorization: Bearer {token}
   ```

### Queries SQL para Verificar

```sql
-- Ver todos los permisos configurados
SELECT 
    p.nombre as perfil,
    pm.nombre as modulo,
    pp.tipo_acceso,
    pp.puede_crear,
    pp.puede_editar,
    pp.puede_eliminar,
    pp.puede_consultar
FROM perfiles_permisos pp
JOIN perfiles p ON pp.perfil_id = p.perfil_id
JOIN permisos_modulos pm ON pp.permiso_modulo_id = pm.permiso_modulo_id
ORDER BY p.perfil_id, pm.orden;
```

---

## ⚠️ Notas Importantes

1. **Contraseña Hash BCrypt:**
   - El hash almacenado: `$2a$11$tF1B9Lph.5xrFtFvlr29YOAZk71wy1QUT4fhBFFB9zNfeTcNX/aLq`
   - Corresponde a: `Admin123!`

2. **Usuarios de Prueba:**
   - Todos tienen `activo = true`
   - Se identifican por el patrón `.test@` en el email
   - Usar `ON CONFLICT` permite re-ejecutar el script sin duplicados

3. **Seguridad:**
   - Estos usuarios son SOLO para pruebas
   - Eliminar o desactivar antes de producción
   - Cambiar contraseñas en ambiente productivo

4. **Entidades Asignadas:**
   - Los usuarios están asociados a la PCM (RUC: 20131370645)
   - El usuario Invitado NO tiene entidad asignada (NULL)

---

## 📝 Cambiar Contraseña de Usuario de Prueba

Si necesitas cambiar la contraseña, usa este script:

```bash
# Generar nuevo hash (requiere dotnet script con BCrypt)
dotnet script -c 'Console.WriteLine(BCrypt.Net.BCrypt.HashPassword("NuevaContraseña123"));'

# Actualizar en la base de datos
UPDATE usuarios 
SET password_hash = '$2a$11$nuevo_hash_aqui', 
    updated_at = NOW() 
WHERE email = 'admin.test@pcm.gob.pe';
```

---

## 📞 Soporte

Para reportar problemas con los usuarios de prueba o permisos:
1. Verificar que la migración se ejecutó correctamente
2. Revisar logs del backend para errores de autenticación
3. Consultar la consola del navegador para errores del frontend
4. Verificar que el token JWT contiene el `perfil_id` correcto

---

**Fecha de Creación:** 20 de noviembre de 2025  
**Última Actualización:** 20 de noviembre de 2025  
**Versión:** 1.0
