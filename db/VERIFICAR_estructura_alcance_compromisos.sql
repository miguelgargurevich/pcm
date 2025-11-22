-- ====================================
-- VERIFICAR ESTRUCTURA DE alcance_compromisos EN PRODUCCIÓN
-- Ejecutar en: Supabase SQL Editor
-- ====================================

-- Verificar si la tabla existe
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'alcance_compromisos')
        THEN '✅ Tabla alcance_compromisos EXISTE'
        ELSE '❌ Tabla alcance_compromisos NO EXISTE'
    END as resultado;

-- Ver estructura completa de la tabla
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'alcance_compromisos'
ORDER BY ordinal_position;

-- Ver constraints
SELECT
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'alcance_compromisos'
ORDER BY tc.constraint_type, kcu.column_name;

-- Contar registros existentes
SELECT COUNT(*) as total_registros FROM alcance_compromisos;
