-- Script para PRODUCCIÓN: Eliminar tabla compromisos obsoleta
-- Ejecutar en Supabase SQL Editor
-- IMPORTANTE: Ejecutar DESPUÉS de haber insertado los 21 compromisos en compromiso_gobierno_digital

-- ============================================
-- VERIFICAR QUE EXISTAN LOS DATOS EN LA TABLA CORRECTA
-- ============================================

-- Verificar que compromiso_gobierno_digital tiene los 21 compromisos
DO $$
DECLARE
    count_compromisos INTEGER;
BEGIN
    SELECT COUNT(*) INTO count_compromisos 
    FROM compromiso_gobierno_digital 
    WHERE compromiso_id BETWEEN 1 AND 21;
    
    IF count_compromisos < 21 THEN
        RAISE EXCEPTION 'ERROR: Solo hay % compromisos en compromiso_gobierno_digital. Se esperan 21. No se puede continuar.', count_compromisos;
    ELSE
        RAISE NOTICE '✅ Verificación OK: Existen % compromisos en compromiso_gobierno_digital', count_compromisos;
    END IF;
END $$;

-- ============================================
-- ELIMINAR TABLA OBSOLETA
-- ============================================

-- Verificar si la tabla compromisos existe
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'compromisos'
    ) THEN
        -- Eliminar la tabla y todas sus dependencias en cascada
        DROP TABLE IF EXISTS compromisos CASCADE;
        RAISE NOTICE '✅ Tabla compromisos eliminada correctamente';
    ELSE
        RAISE NOTICE '⚠️  La tabla compromisos no existe (ya fue eliminada o nunca existió)';
    END IF;
END $$;

-- ============================================
-- VERIFICACIÓN FINAL
-- ============================================

-- Listar todas las tablas relacionadas con compromisos
SELECT 
    table_name,
    CASE 
        WHEN table_name = 'compromiso_gobierno_digital' THEN '✅ Tabla correcta'
        WHEN table_name = 'alcance_compromisos' THEN '✅ Tabla correcta'
        WHEN table_name = 'compromiso_normativa' THEN '✅ Tabla correcta'
        WHEN table_name LIKE '%compromiso%' THEN '⚠️  Verificar si es necesaria'
        ELSE ''
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE '%compromiso%'
ORDER BY table_name;

-- Verificar compromisos en la tabla correcta
SELECT 
    compromiso_id,
    nombre_compromiso,
    activo,
    created_at
FROM compromiso_gobierno_digital
WHERE compromiso_id BETWEEN 1 AND 21
ORDER BY compromiso_id;
