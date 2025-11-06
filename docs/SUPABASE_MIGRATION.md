# Migración de Base de Datos en Supabase

## 🚀 Solución Rápida: Script Completo

**RECOMENDADO**: Ejecuta el script completo que incluye todas las migraciones necesarias.

### Instrucciones Rápidas

1. Ve a tu proyecto en Supabase
2. Abre **SQL Editor** desde el menú lateral
3. Copia y pega el contenido completo del archivo: **`db/migration_supabase_complete.sql`**
4. Haz clic en **Run**
5. Verifica que todas las verificaciones muestren resultados correctos

Este script hace lo siguiente:
- ✅ Agrega columnas `activo` y `created_at` a tabla `perfiles`
- ✅ Agrega columna `last_login` a tabla `usuarios`
- ✅ **Actualiza el hash de contraseña del usuario admin** (Admin123!)
- ✅ Crea índices necesarios
- ✅ Verifica que todo esté configurado correctamente

---

## 📝 Migraciones Individuales (Opcional)

Si prefieres ejecutar las migraciones paso por paso:

### Paso 1: Agregar columnas a la tabla perfiles

Esta migración agrega las columnas `activo` y `created_at` a la tabla `perfiles` que son requeridas por el código.

### Instrucciones:

1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. En el menú lateral, haz clic en **SQL Editor**
4. Copia y pega el contenido del archivo: `db/migration_perfiles_add_columns.sql`
5. Haz clic en **Run** para ejecutar el script
6. Verifica que la salida muestre las columnas agregadas correctamente

## Paso 2: Agregar columna last_login a usuarios

Esta migración agrega la columna `last_login` a la tabla `usuarios` en Supabase para registrar el último inicio de sesión de cada usuario.

### Instrucciones:

1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. En el menú lateral, haz clic en **SQL Editor**
4. Copia y pega el siguiente script:

```sql
-- Agregar columna last_login a la tabla usuarios
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;

-- Crear índice para mejorar las consultas de auditoría
CREATE INDEX IF NOT EXISTS idx_usuarios_last_login ON usuarios(last_login);

-- Comentario de la columna
COMMENT ON COLUMN usuarios.last_login IS 'Fecha y hora del último inicio de sesión del usuario';

-- Verificar que la columna se agregó correctamente
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'usuarios' AND column_name = 'last_login';
```

5. Haz clic en **Run** para ejecutar el script
6. Verifica que la salida muestre:
   ```
   column_name | data_type                   | is_nullable
   last_login  | timestamp without time zone | YES
   ```

## Paso 3: Actualizar contraseña del usuario admin (si es necesario)

Si el usuario administrador no puede iniciar sesión después del despliegue, ejecuta este script para actualizar su contraseña:

```sql
-- Actualizar hash de contraseña del usuario admin
-- Password: Admin123!
UPDATE usuarios 
SET password_hash = '$2a$11$tF1B9Lph.5xrFtFvlr29YOAZk71wy1QUT4fhBFFB9zNfeTcNX/aLq'
WHERE email = 'admin@pcm.gob.pe';

-- Verificar la actualización
SELECT email, left(password_hash, 30) || '...' as hash_preview 
FROM usuarios 
WHERE email = 'admin@pcm.gob.pe';
```

## Verificación

Una vez completada la migración, verifica que:

1. ✅ La columna `last_login` existe en la tabla `usuarios`
2. ✅ El índice `idx_usuarios_last_login` fue creado
3. ✅ El login funciona correctamente en producción

## Credenciales de prueba

- **Email**: admin@pcm.gob.pe
- **Password**: Admin123!

## Notas

- Esta migración es **idempotente** (puede ejecutarse múltiples veces sin causar errores)
- La columna `last_login` es nullable para permitir usuarios que nunca han iniciado sesión
- El índice mejora el rendimiento de consultas que filtran por fecha de último login
