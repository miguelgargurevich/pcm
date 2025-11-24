-- ============================================
-- MIGRACIÓN: Mover criterios_evaluados a cumplimiento_normativo
-- ============================================
-- Fecha: 2025-11-24
-- Descripción: 
--   Los criterios evaluados son dinámicos y comunes para todos los compromisos.
--   Se mueven desde las tablas específicas (com1, com2, etc.) a la tabla genérica
--   cumplimiento_normativo para centralizar la información del paso 2.
-- ============================================

BEGIN;

-- Paso 1: Verificar si criterios_evaluados ya existe en cumplimiento_normativo
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'cumplimiento_normativo' 
        AND column_name = 'criterios_evaluados'
    ) THEN
        -- Agregar columna criterios_evaluados a cumplimiento_normativo
        ALTER TABLE cumplimiento_normativo 
        ADD COLUMN criterios_evaluados JSONB;
        
        RAISE NOTICE '✓ Columna criterios_evaluados agregada a cumplimiento_normativo';
    ELSE
        RAISE NOTICE '✓ Columna criterios_evaluados ya existe en cumplimiento_normativo';
    END IF;
END $$;

-- Paso 2: Eliminar columna criterios_evaluados de com1_liderg_td (si existe)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'com1_liderg_td' 
        AND column_name = 'criterios_evaluados'
    ) THEN
        ALTER TABLE com1_liderg_td DROP COLUMN criterios_evaluados;
        RAISE NOTICE '✓ Columna criterios_evaluados eliminada de com1_liderg_td';
    ELSE
        RAISE NOTICE '✓ Columna criterios_evaluados no existe en com1_liderg_td';
    END IF;
END $$;

-- Paso 3: Eliminar columna criterios_evaluados de com2_consejo_gtd (si existe)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'com2_consejo_gtd' 
        AND column_name = 'criterios_evaluados'
    ) THEN
        ALTER TABLE com2_consejo_gtd DROP COLUMN criterios_evaluados;
        RAISE NOTICE '✓ Columna criterios_evaluados eliminada de com2_consejo_gtd';
    ELSE
        RAISE NOTICE '✓ Columna criterios_evaluados no existe en com2_consejo_gtd';
    END IF;
END $$;

-- Paso 4: Eliminar columna criterios_evaluados de com4_tdpei (si existe)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'com4_tdpei' 
        AND column_name = 'criterios_evaluados'
    ) THEN
        ALTER TABLE com4_tdpei DROP COLUMN criterios_evaluados;
        RAISE NOTICE '✓ Columna criterios_evaluados eliminada de com4_tdpei';
    ELSE
        RAISE NOTICE '✓ Columna criterios_evaluados no existe en com4_tdpei';
    END IF;
END $$;

-- Paso 5: Eliminar columna criterios_evaluados de com5_destrategiad (si existe)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'com5_destrategiad' 
        AND column_name = 'criterios_evaluados'
    ) THEN
        ALTER TABLE com5_destrategiad DROP COLUMN criterios_evaluados;
        RAISE NOTICE '✓ Columna criterios_evaluados eliminada de com5_destrategiad';
    ELSE
        RAISE NOTICE '✓ Columna criterios_evaluados no existe en com5_destrategiad';
    END IF;
END $$;

-- Paso 6: Eliminar columna criterios_evaluados de com6_mpgobpe (si existe)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'com6_mpgobpe' 
        AND column_name = 'criterios_evaluados'
    ) THEN
        ALTER TABLE com6_mpgobpe DROP COLUMN criterios_evaluados;
        RAISE NOTICE '✓ Columna criterios_evaluados eliminada de com6_mpgobpe';
    ELSE
        RAISE NOTICE '✓ Columna criterios_evaluados no existe en com6_mpgobpe';
    END IF;
END $$;

-- Paso 7: Eliminar columna criterios_evaluados de com7_imeplemp (si existe)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'com7_imeplemp' 
        AND column_name = 'criterios_evaluados'
    ) THEN
        ALTER TABLE com7_imeplemp DROP COLUMN criterios_evaluados;
        RAISE NOTICE '✓ Columna criterios_evaluados eliminada de com7_imeplemp';
    ELSE
        RAISE NOTICE '✓ Columna criterios_evaluados no existe en com7_imeplemp';
    END IF;
END $$;

-- Paso 8: Eliminar columna criterios_evaluados de com8_pubtupa (si existe)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'com8_pubtupa' 
        AND column_name = 'criterios_evaluados'
    ) THEN
        ALTER TABLE com8_pubtupa DROP COLUMN criterios_evaluados;
        RAISE NOTICE '✓ Columna criterios_evaluados eliminada de com8_pubtupa';
    ELSE
        RAISE NOTICE '✓ Columna criterios_evaluados no existe en com8_pubtupa';
    END IF;
END $$;

-- Paso 9: Eliminar columna criterios_evaluados de com9_mgesdoc (si existe)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'com9_mgesdoc' 
        AND column_name = 'criterios_evaluados'
    ) THEN
        ALTER TABLE com9_mgesdoc DROP COLUMN criterios_evaluados;
        RAISE NOTICE '✓ Columna criterios_evaluados eliminada de com9_mgesdoc';
    ELSE
        RAISE NOTICE '✓ Columna criterios_evaluados no existe en com9_mgesdoc';
    END IF;
END $$;

-- Paso 10: Eliminar columna criterios_evaluados de com10_datab (si existe)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'com10_datab' 
        AND column_name = 'criterios_evaluados'
    ) THEN
        ALTER TABLE com10_datab DROP COLUMN criterios_evaluados;
        RAISE NOTICE '✓ Columna criterios_evaluados eliminada de com10_datab';
    ELSE
        RAISE NOTICE '✓ Columna criterios_evaluados no existe en com10_datab';
    END IF;
END $$;

-- Verificación final
DO $$
DECLARE
    tabla TEXT;
    tiene_columna BOOLEAN;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'VERIFICACIÓN FINAL';
    RAISE NOTICE '========================================';
    
    -- Verificar cumplimiento_normativo
    SELECT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'cumplimiento_normativo' 
        AND column_name = 'criterios_evaluados'
    ) INTO tiene_columna;
    
    IF tiene_columna THEN
        RAISE NOTICE '✅ cumplimiento_normativo TIENE criterios_evaluados';
    ELSE
        RAISE NOTICE '❌ cumplimiento_normativo NO TIENE criterios_evaluados';
    END IF;
    
    -- Verificar tablas com
    FOR tabla IN 
        SELECT unnest(ARRAY['com1_liderg_td', 'com2_consejo_gtd', 'com4_tdpei', 
                            'com5_destrategiad', 'com6_mpgobpe', 'com7_imeplemp',
                            'com8_pubtupa', 'com9_mgesdoc', 'com10_datab'])
    LOOP
        SELECT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = tabla
            AND column_name = 'criterios_evaluados'
        ) INTO tiene_columna;
        
        IF tiene_columna THEN
            RAISE NOTICE '❌ % todavía TIENE criterios_evaluados', tabla;
        ELSE
            RAISE NOTICE '✅ % NO TIENE criterios_evaluados', tabla;
        END IF;
    END LOOP;
    
    RAISE NOTICE '========================================';
END $$;

COMMIT;

-- Mensaje final
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅ MIGRACIÓN COMPLETADA EXITOSAMENTE';
    RAISE NOTICE 'Los criterios_evaluados ahora están centralizados en cumplimiento_normativo';
    RAISE NOTICE '';
END $$;
