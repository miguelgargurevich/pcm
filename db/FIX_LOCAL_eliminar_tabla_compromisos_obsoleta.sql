-- =============================================
-- SCRIPT: Eliminar tabla compromisos obsoleta
-- DESCRIPCIÓN: Elimina la tabla compromisos y sus tablas relacionadas que fueron reemplazadas por compromiso_gobierno_digital
-- FECHA: 2025-11-22
-- NOTA: Solo elimina si las tablas están vacías (sin datos)
-- =============================================

BEGIN;

-- Verificar que las tablas estén vacías antes de eliminar
DO $$
DECLARE
    count_compromisos INTEGER;
    count_criterios INTEGER;
    count_normas INTEGER;
BEGIN
    SELECT COUNT(*) INTO count_compromisos FROM compromisos;
    SELECT COUNT(*) INTO count_criterios FROM criterios_compromisos;
    SELECT COUNT(*) INTO count_normas FROM normas_compromisos;
    
    IF count_compromisos > 0 OR count_criterios > 0 OR count_normas > 0 THEN
        RAISE EXCEPTION 'ERROR: Las tablas contienen datos. No se puede eliminar. compromisos: %, criterios: %, normas: %', 
            count_compromisos, count_criterios, count_normas;
    END IF;
    
    RAISE NOTICE '✅ Verificación OK: Las tablas están vacías y pueden ser eliminadas';
END $$;

-- Eliminar las tablas relacionadas primero (las que tienen FK hacia compromisos)
DROP TABLE IF EXISTS criterios_compromisos_entidades CASCADE;
DROP TABLE IF EXISTS normas_compromisos_entidades CASCADE;
DROP TABLE IF EXISTS criterios_compromisos CASCADE;
DROP TABLE IF EXISTS normas_compromisos CASCADE;

-- Eliminar la tabla principal compromisos
DROP TABLE IF EXISTS compromisos CASCADE;

-- Verificación final
DO $$
BEGIN
    RAISE NOTICE '✅ Tablas obsoletas eliminadas correctamente';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Resumen:';
    RAISE NOTICE '   ❌ compromisos (eliminada) → ✅ compromiso_gobierno_digital (activa)';
    RAISE NOTICE '   ❌ criterios_compromisos (eliminada) → ✅ criterio_evaluacion (activa)';
    RAISE NOTICE '   ❌ normas_compromisos (eliminada) → ✅ compromiso_normativa (activa)';
END $$;

COMMIT;

-- Mostrar tablas restantes de compromisos
SELECT 
    tablename as "Tablas de Compromisos Activas",
    CASE 
        WHEN tablename = 'compromiso_gobierno_digital' THEN '✅ Tabla principal'
        WHEN tablename = 'alcance_compromisos' THEN '✅ Alcances por clasificación'
        WHEN tablename = 'compromiso_normativa' THEN '✅ Relación con normativas'
        WHEN tablename = 'criterio_evaluacion' THEN '✅ Criterios de evaluación'
    END as descripcion
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('compromiso_gobierno_digital', 'alcance_compromisos', 'compromiso_normativa', 'criterio_evaluacion')
ORDER BY tablename;
