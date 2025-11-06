-- ====================================
-- SCRIPT COMPLETO DE MIGRACIÓN PARA SUPABASE
-- Ejecutar en el SQL Editor de Supabase
-- ====================================

-- PASO 1: Agregar columnas faltantes a la tabla perfiles
ALTER TABLE perfiles 
ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;

ALTER TABLE perfiles 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

-- PASO 2: Agregar columna last_login a la tabla usuarios
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;

-- PASO 3: Crear índice para last_login
CREATE INDEX IF NOT EXISTS idx_usuarios_last_login ON usuarios(last_login);

-- PASO 4: Actualizar el hash de contraseña del usuario admin
-- Password: Admin123!
-- Nuevo hash BCrypt: $2a$11$tF1B9Lph.5xrFtFvlr29YOAZk71wy1QUT4fhBFFB9zNfeTcNX/aLq
UPDATE usuarios 
SET password_hash = '$2a$11$tF1B9Lph.5xrFtFvlr29YOAZk71wy1QUT4fhBFFB9zNfeTcNX/aLq'
WHERE email = 'admin@pcm.gob.pe';

-- ====================================
-- VERIFICACIONES
-- ====================================

-- Verificar columnas de perfiles
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'perfiles'
ORDER BY ordinal_position;

-- Verificar columnas de usuarios
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
  AND column_name IN ('user_id', 'password_hash', 'entidad_id', 'perfil_id', 'last_login')
ORDER BY ordinal_position;

-- Verificar usuario admin
SELECT 
    email,
    num_dni,
    nombres,
    perfil_id,
    activo,
    left(password_hash, 30) || '...' as hash_preview,
    entidad_id IS NULL as sin_entidad
FROM usuarios 
WHERE email = 'admin@pcm.gob.pe';

-- Mostrar mensajes de éxito
SELECT '✓ Migración completada exitosamente' AS status;
SELECT '✓ Usuario admin actualizado con nuevo hash' AS info;
SELECT '✓ Columnas agregadas a perfiles y usuarios' AS info2;
