-- ====================================
-- FIX: Verificar y corregir tabla clasificacion
-- ====================================

-- PASO 1: Verificar estructura actual de la tabla clasificacion
SELECT 
    '=== ESTRUCTURA ACTUAL DE CLASIFICACION ===' as info;
    
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'clasificacion'
ORDER BY ordinal_position;

-- PASO 2: Verificar constraint de primary key
SELECT 
    '=== PRIMARY KEY ACTUAL ===' as info;
    
SELECT 
    tc.constraint_name,
    kcu.column_name,
    tc.constraint_type
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'clasificacion' 
    AND tc.constraint_type = 'PRIMARY KEY';

-- PASO 3: Ver datos actuales (sin especificar orden por ahora)
SELECT 
    '=== DATOS ACTUALES ===' as info;
    
SELECT * FROM clasificacion LIMIT 10;

-- PASO 4: Verificar foreign key desde entidades
SELECT 
    '=== FOREIGN KEYS ===' as info;
    
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name = 'entidades'
    AND kcu.column_name LIKE '%clasificacion%';
