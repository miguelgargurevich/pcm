-- ====================================
-- SCRIPT DE VERIFICACIÓN DE SCHEMA EN SUPABASE
-- Ejecutar en el SQL Editor de Supabase
-- ====================================

-- 1. Verificar si existe la tabla usuarios
SELECT 
    'Tabla usuarios existe' as status,
    COUNT(*) as registros
FROM usuarios;

-- 2. Ver todas las columnas de la tabla usuarios
SELECT 
    column_name, 
    data_type,
    udt_name,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'usuarios'
ORDER BY ordinal_position;

-- 3. Verificar si existe la tabla perfiles
SELECT 
    column_name, 
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'perfiles'
ORDER BY ordinal_position;

-- 4. Verificar si existe la tabla entidades
SELECT 
    column_name, 
    data_type,
    udt_name,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'entidades'
ORDER BY ordinal_position;

-- 5. Ver qué usuarios existen
SELECT 
    user_id,
    email,
    num_dni,
    nombres,
    perfil_id,
    entidad_id,
    activo,
    CASE 
        WHEN LENGTH(password_hash) > 0 THEN 'Hash presente'
        ELSE 'Sin hash'
    END as password_status
FROM usuarios;

-- 6. Ver tipos de datos de las claves primarias
SELECT 
    t.table_name,
    c.column_name,
    c.data_type,
    c.udt_name,
    tc.constraint_type
FROM information_schema.table_constraints tc
JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
JOIN information_schema.columns c ON c.table_name = tc.table_name AND c.column_name = ccu.column_name
JOIN information_schema.tables t ON t.table_name = tc.table_name
WHERE tc.constraint_type = 'PRIMARY KEY'
  AND t.table_name IN ('usuarios', 'entidades', 'perfiles')
ORDER BY t.table_name;
