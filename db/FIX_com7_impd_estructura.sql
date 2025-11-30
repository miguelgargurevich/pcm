-- =====================================================
-- Script: FIX_com7_impd_estructura.sql
-- Descripción: Corregir estructura de tabla com7_impd
--              para Mesa de Partes Digital
-- Fecha: 2025-11-26
-- =====================================================

-- 1. Eliminar columnas obsoletas
ALTER TABLE com7_impd DROP COLUMN IF EXISTS metodologia;
ALTER TABLE com7_impd DROP COLUMN IF EXISTS numero_resolucion;
ALTER TABLE com7_impd DROP COLUMN IF EXISTS archivo_metodologia;
ALTER TABLE com7_impd DROP COLUMN IF EXISTS descripcion;
ALTER TABLE com7_impd DROP COLUMN IF EXISTS herramientas;
ALTER TABLE com7_impd DROP COLUMN IF EXISTS capacitaciones_realizadas;

-- 2. Renombrar fecha_implementacion a fecha_implementacion_mpd
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'com7_impd' 
        AND column_name = 'fecha_implementacion'
    ) THEN
        ALTER TABLE com7_impd RENAME COLUMN fecha_implementacion TO fecha_implementacion_mpd;
    END IF;
END $$;

-- 3. Agregar columnas nuevas para Mesa de Partes Digital
ALTER TABLE com7_impd ADD COLUMN IF NOT EXISTS url_mpd VARCHAR(500);
ALTER TABLE com7_impd ADD COLUMN IF NOT EXISTS responsable_mpd VARCHAR(200);
ALTER TABLE com7_impd ADD COLUMN IF NOT EXISTS cargo_responsable_mpd VARCHAR(200);
ALTER TABLE com7_impd ADD COLUMN IF NOT EXISTS correo_responsable_mpd VARCHAR(200);
ALTER TABLE com7_impd ADD COLUMN IF NOT EXISTS telefono_responsable_mpd VARCHAR(50);
ALTER TABLE com7_impd ADD COLUMN IF NOT EXISTS tipo_mpd VARCHAR(100);
ALTER TABLE com7_impd ADD COLUMN IF NOT EXISTS interoperabilidad_mpd BOOLEAN;
ALTER TABLE com7_impd ADD COLUMN IF NOT EXISTS observacion_mpd VARCHAR(1000);
ALTER TABLE com7_impd ADD COLUMN IF NOT EXISTS ruta_pdf_mpd VARCHAR(500);

-- 4. Verificar estructura final
SELECT 
    column_name, 
    data_type, 
    character_maximum_length,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'com7_impd'
ORDER BY ordinal_position;
