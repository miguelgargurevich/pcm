-- ====================================
-- SCRIPT DEFINITIVO: SINCRONIZAR SUPABASE CON CÓDIGO ACTUAL
-- Este script es IDEMPOTENTE (se puede ejecutar múltiples veces)
-- ====================================

-- ============================================
-- PARTE 1: ACTUALIZAR ESTRUCTURA DE TABLAS
-- ============================================

-- 1.1. Asegurar que la tabla perfiles tiene las columnas necesarias
ALTER TABLE perfiles 
ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;

ALTER TABLE perfiles 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

-- 1.2. Asegurar que la tabla usuarios tiene la columna last_login
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;

-- 1.3. Crear índice para last_login
CREATE INDEX IF NOT EXISTS idx_usuarios_last_login ON usuarios(last_login);

-- ============================================
-- PARTE 2: VERIFICAR Y CORREGIR DATOS
-- ============================================

-- 2.1. Actualizar perfiles existentes con valores por defecto
UPDATE perfiles 
SET activo = COALESCE(activo, true),
    created_at = COALESCE(created_at, NOW())
WHERE perfil_id IN (1, 2);

-- 2.2. Insertar perfiles si no existen
INSERT INTO perfiles (perfil_id, nombre, descripcion, activo, created_at) VALUES
    (1, 'Administrador', 'Acceso completo al sistema', true, NOW()),
    (2, 'Usuario', 'Acceso limitado', true, NOW())
ON CONFLICT (perfil_id) DO UPDATE SET
    activo = EXCLUDED.activo,
    created_at = COALESCE(perfiles.created_at, EXCLUDED.created_at);

-- ============================================
-- PARTE 3: ACTUALIZAR USUARIO ADMIN
-- ============================================

-- 3.1. Actualizar o insertar usuario admin con el hash correcto
-- Password: Admin123!
-- Hash BCrypt correcto: $2a$11$tF1B9Lph.5xrFtFvlr29YOAZk71wy1QUT4fhBFFB9zNfeTcNX/aLq

INSERT INTO usuarios (
    email, 
    num_dni, 
    nombres, 
    ape_paterno, 
    ape_materno, 
    password_hash,
    perfil_id,
    activo,
    entidad_id,
    created_at,
    updated_at
) VALUES (
    'admin@pcm.gob.pe',
    '12345678',
    'Administrador',
    'Sistema',
    'PCM',
    '$2a$11$tF1B9Lph.5xrFtFvlr29YOAZk71wy1QUT4fhBFFB9zNfeTcNX/aLq',
    1,
    true,
    NULL,
    NOW(),
    NOW()
)
ON CONFLICT (email) DO UPDATE SET
    password_hash = '$2a$11$tF1B9Lph.5xrFtFvlr29YOAZk71wy1QUT4fhBFFB9zNfeTcNX/aLq',
    activo = true,
    updated_at = NOW();

-- ============================================
-- PARTE 4: VERIFICACIONES COMPLETAS
-- ============================================

-- 4.1. Verificar estructura de perfiles
SELECT 
    '=== ESTRUCTURA TABLA PERFILES ===' as seccion;
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'perfiles'
ORDER BY ordinal_position;

-- 4.2. Verificar datos de perfiles
SELECT 
    '=== DATOS TABLA PERFILES ===' as seccion;
SELECT * FROM perfiles ORDER BY perfil_id;

-- 4.3. Verificar estructura de usuarios (columnas clave)
SELECT 
    '=== ESTRUCTURA TABLA USUARIOS (Columnas Clave) ===' as seccion;
SELECT 
    column_name, 
    data_type,
    udt_name,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
  AND column_name IN ('user_id', 'password_hash', 'entidad_id', 'perfil_id', 'last_login', 'email')
ORDER BY ordinal_position;

-- 4.4. Verificar usuario admin
SELECT 
    '=== USUARIO ADMIN ===' as seccion;
SELECT 
    email,
    num_dni,
    nombres,
    ape_paterno,
    ape_materno,
    perfil_id,
    activo,
    entidad_id IS NULL as sin_entidad,
    CASE 
        WHEN password_hash = '$2a$11$tF1B9Lph.5xrFtFvlr29YOAZk71wy1QUT4fhBFFB9zNfeTcNX/aLq' 
        THEN '✓ Hash correcto'
        ELSE '✗ Hash incorrecto'
    END as validacion_hash,
    left(password_hash, 30) || '...' as hash_preview
FROM usuarios 
WHERE email = 'admin@pcm.gob.pe';

-- 4.5. Verificar tipos de datos de las primary keys
SELECT 
    '=== TIPOS DE DATOS PRIMARY KEYS ===' as seccion;
SELECT 
    t.table_name,
    c.column_name,
    c.data_type,
    c.udt_name as tipo_postgres
FROM information_schema.table_constraints tc
JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
JOIN information_schema.columns c ON c.table_name = tc.table_name AND c.column_name = ccu.column_name
JOIN information_schema.tables t ON t.table_name = tc.table_name
WHERE tc.constraint_type = 'PRIMARY KEY'
  AND t.table_name IN ('usuarios', 'entidades', 'perfiles')
ORDER BY t.table_name;

-- ============================================
-- MENSAJES FINALES
-- ============================================
SELECT '✓✓✓ MIGRACIÓN COMPLETADA EXITOSAMENTE ✓✓✓' AS status;
SELECT '✓ Tablas actualizadas con columnas necesarias' AS info;
SELECT '✓ Usuario admin@pcm.gob.pe configurado con hash correcto' AS info2;
SELECT '✓ Perfiles actualizados con activo y created_at' AS info3;
SELECT '' AS separador;
SELECT '📋 Revisar las verificaciones arriba para confirmar que todo está correcto' AS nota;
