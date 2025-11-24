-- ============================================
-- MIGRACIÓN: Sincronizar com1_liderg_td con producción
-- ============================================
-- Fecha: 2025-11-24
-- Descripción: 
--   Agregar campo ruta_pdf_normativa a com1_liderg_td
--   Este campo existe en producción pero no en desarrollo
-- ============================================

BEGIN;

-- Agregar columna ruta_pdf_normativa a com1_liderg_td (si no existe)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'com1_liderg_td' 
        AND column_name = 'ruta_pdf_normativa'
    ) THEN
        ALTER TABLE com1_liderg_td 
        ADD COLUMN ruta_pdf_normativa TEXT;
        
        RAISE NOTICE '✓ Columna ruta_pdf_normativa agregada a com1_liderg_td';
    ELSE
        RAISE NOTICE '✓ Columna ruta_pdf_normativa ya existe en com1_liderg_td';
    END IF;
END $$;

-- Agregar comentario a la columna
COMMENT ON COLUMN com1_liderg_td.ruta_pdf_normativa IS 'URL del documento PDF normativo del líder GTD';

-- Verificación final
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'VERIFICACIÓN';
    RAISE NOTICE '========================================';
    
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'com1_liderg_td' 
        AND column_name = 'ruta_pdf_normativa'
    ) THEN
        RAISE NOTICE '✅ com1_liderg_td.ruta_pdf_normativa existe';
    ELSE
        RAISE NOTICE '❌ com1_liderg_td.ruta_pdf_normativa NO existe';
    END IF;
    
    RAISE NOTICE '========================================';
END $$;

COMMIT;

-- Mensaje final
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅ SINCRONIZACIÓN COMPLETADA';
    RAISE NOTICE 'La tabla com1_liderg_td ahora tiene el campo ruta_pdf_normativa';
    RAISE NOTICE '';
END $$;
