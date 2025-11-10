-- ====================================
-- VERIFICACIÓN COMPLETA DEL SCHEMA EN SUPABASE
-- Ejecutar en el SQL Editor de Supabase
-- ====================================

-- 1. LISTAR TODAS LAS TABLAS
SELECT 
    '=== TABLAS EXISTENTES ===' as info;
SELECT 
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

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
    '=== TIPOS DE DATOS PRIMARY KEYS ===' as info;
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
  AND t.table_schema = 'public'
ORDER BY t.table_name;

-- 7. VERIFICAR ÍNDICES
SELECT 
    '=== ÍNDICES EXISTENTES ===' as info;
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- 8. VERIFICAR FOREIGN KEYS
SELECT 
    '=== FOREIGN KEYS ===' as info;
SELECT 
    tc.table_name,
    tc.constraint_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_name;

-- 9. CONTEO DE REGISTROS EN TODAS LAS TABLAS
SELECT 
    '=== CONTEO DE REGISTROS ===' as info;
