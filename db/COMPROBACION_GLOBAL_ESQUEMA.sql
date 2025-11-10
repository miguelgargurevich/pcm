-- ====================================
-- COMPROBACIÓN GLOBAL DEL ESQUEMA EN SUPABASE
-- Ejecuta este script para verificar que todo esté correcto
-- ====================================

SELECT '========================================' as separador;
SELECT '   COMPROBACIÓN GLOBAL DEL ESQUEMA PCM' as titulo;
SELECT '========================================' as separador;

-- ==========================================
-- 1. LISTADO DE TODAS LAS TABLAS
-- ==========================================
SELECT '=== 1. TABLAS EN LA BASE DE DATOS ===' as seccion;
SELECT 
    table_name,
    CASE 
        WHEN table_name IN ('usuarios', 'entidades', 'marco_normativo', 'tabla_tablas', 
                           'perfiles', 'clasificacion', 'sector', 'nivel_gobierno', 'ubigeo') 
        THEN '✓ OK'
        ELSE '⚠ EXTRA'
    END as estado
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- ==========================================
-- 2. VERIFICAR marco_normativo
-- ==========================================
SELECT '=== 2. ESTRUCTURA DE marco_normativo ===' as seccion;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'marco_normativo'
ORDER BY ordinal_position;

SELECT 'Registros en marco_normativo:' as info, COUNT(*) as total
FROM marco_normativo;

SELECT 'Registros activos:' as info, 
       COUNT(*) FILTER (WHERE activo = true) as activos,
       COUNT(*) FILTER (WHERE activo = false) as inactivos
FROM marco_normativo;

-- ==========================================
-- 3. VERIFICAR tabla_tablas
-- ==========================================
SELECT '=== 3. ESTRUCTURA DE tabla_tablas ===' as seccion;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'tabla_tablas'
ORDER BY ordinal_position;

SELECT '=== CATÁLOGOS EN tabla_tablas ===' as info;
SELECT 
    nombre_tabla,
    COUNT(*) as cantidad,
    CASE 
        WHEN nombre_tabla = 'TIPO_NORMA' AND COUNT(*) = 7 THEN '✓ OK'
        WHEN nombre_tabla = 'NIVEL_GOBIERNO' AND COUNT(*) = 3 THEN '✓ OK'
        WHEN nombre_tabla = 'SECTOR' AND COUNT(*) = 20 THEN '✓ OK'
        ELSE '⚠ VERIFICAR'
    END as estado
FROM tabla_tablas
GROUP BY nombre_tabla
ORDER BY nombre_tabla;

-- ==========================================
-- 4. VERIFICAR TABLAS CATÁLOGO
-- ==========================================
SELECT '=== 4. TABLAS CATÁLOGO ===' as seccion;

SELECT 'perfiles:' as tabla, COUNT(*) as registros FROM perfiles;
SELECT 'nivel_gobierno:' as tabla, COUNT(*) as registros FROM nivel_gobierno;
SELECT 'sector:' as tabla, COUNT(*) as registros FROM sector;
SELECT 'clasificacion:' as tabla, COUNT(*) as registros FROM clasificacion;

-- ==========================================
-- 5. VERIFICAR TABLAS PRINCIPALES
-- ==========================================
SELECT '=== 5. TABLAS PRINCIPALES ===' as seccion;

SELECT 'ubigeo:' as tabla, COUNT(*) as registros FROM ubigeo;
SELECT 'entidades:' as tabla, COUNT(*) as registros FROM entidades;
SELECT 'usuarios:' as tabla, COUNT(*) as registros FROM usuarios;

-- ==========================================
-- 6. VERIFICAR ÍNDICES
-- ==========================================
SELECT '=== 6. ÍNDICES CREADOS ===' as seccion;
SELECT 
    tablename,
    indexname,
    CASE 
        WHEN indexname LIKE 'idx_%' OR indexname LIKE '%_pkey' THEN '✓ OK'
        ELSE '⚠ VERIFICAR'
    END as estado
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- ==========================================
-- 7. VERIFICAR FOREIGN KEYS
-- ==========================================
SELECT '=== 7. RELACIONES (FOREIGN KEYS) ===' as seccion;
SELECT
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
AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- ==========================================
-- 8. VERIFICAR COLUMNAS CRÍTICAS
-- ==========================================
SELECT '=== 8. VERIFICACIÓN DE COLUMNAS CRÍTICAS ===' as seccion;

SELECT 
    'marco_normativo.activo' as columna,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'marco_normativo' AND column_name = 'activo'
    ) THEN '✓ EXISTE' ELSE '✗ FALTA' END as estado;

SELECT 
    'tabla_tablas.orden' as columna,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tabla_tablas' AND column_name = 'orden'
    ) THEN '✓ EXISTE' ELSE '✗ FALTA' END as estado;

SELECT 
    'tabla_tablas.nombre_tabla' as columna,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tabla_tablas' AND column_name = 'nombre_tabla'
    ) THEN '✓ EXISTE' ELSE '✗ FALTA' END as estado;

-- ==========================================
-- 9. RESUMEN FINAL
-- ==========================================
SELECT '========================================' as separador;
SELECT '   RESUMEN DE LA COMPROBACIÓN' as titulo;
SELECT '========================================' as separador;

SELECT 
    'Tablas principales:' as categoria,
    COUNT(*) as cantidad,
    '✓ OK' as estado
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
AND table_name IN ('usuarios', 'entidades', 'marco_normativo', 'tabla_tablas', 
                   'perfiles', 'clasificacion', 'sector', 'nivel_gobierno', 'ubigeo');

SELECT 
    'Catálogos en tabla_tablas:' as categoria,
    COUNT(DISTINCT nombre_tabla) as cantidad,
    CASE WHEN COUNT(DISTINCT nombre_tabla) = 3 THEN '✓ OK' ELSE '⚠ VERIFICAR' END as estado
FROM tabla_tablas;

SELECT 
    'Total registros en tabla_tablas:' as categoria,
    COUNT(*) as cantidad,
    CASE WHEN COUNT(*) = 30 THEN '✓ OK' ELSE '⚠ VERIFICAR' END as estado
FROM tabla_tablas;

SELECT '========================================' as separador;
SELECT '✓✓✓ COMPROBACIÓN GLOBAL COMPLETADA ✓✓✓' as resultado;
SELECT '========================================' as separador;
