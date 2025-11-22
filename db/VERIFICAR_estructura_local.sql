-- ====================================
-- VERIFICAR ESTRUCTURA EN BASE DE DATOS LOCAL
-- Ejecutar en: psql o DBeaver local
-- ====================================

-- 1. Verificar estructura de compromiso_gobierno_digital
SELECT 
    'compromiso_gobierno_digital' as tabla,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'compromiso_gobierno_digital'
ORDER BY ordinal_position;

-- 2. Verificar estructura de alcance_compromisos
SELECT 
    'alcance_compromisos' as tabla,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'alcance_compromisos'
ORDER BY ordinal_position;

-- 3. Verificar estructura de com1_liderg_td
SELECT 
    'com1_liderg_td' as tabla,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'com1_liderg_td'
ORDER BY ordinal_position;

-- 4. Verificar si existe tabla compromisos (obsoleta)
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'compromisos')
        THEN '⚠️ Tabla compromisos EXISTE (obsoleta)'
        ELSE '✅ Tabla compromisos NO EXISTE (correcto)'
    END as resultado;

-- 5. Contar registros
SELECT 'compromiso_gobierno_digital' as tabla, COUNT(*) as registros FROM compromiso_gobierno_digital
UNION ALL
SELECT 'alcance_compromisos', COUNT(*) FROM alcance_compromisos
UNION ALL
SELECT 'clasificacion', COUNT(*) FROM clasificacion;
