-- ========================================
-- SCRIPT DE HOMOLOGACIÓN SUPABASE
-- Actualización de tablas com4_tdpei y com5_destrategiad
-- Fecha: 2025-11-23
-- ========================================

-- NOTA IMPORTANTE:
-- Las tablas com4_tdpei y com5_destrategiad YA EXISTEN en Supabase
-- Este script solo agrega/modifica campos faltantes si es necesario

-- ========================================
-- COM4_TDPEI: Verificar y agregar campos faltantes
-- ========================================

-- Agregar columna criterios_evaluados si no existe (para paso 2)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'com4_tdpei' 
                   AND column_name = 'criterios_evaluados') THEN
        ALTER TABLE com4_tdpei ADD COLUMN criterios_evaluados JSONB;
        RAISE NOTICE 'Columna criterios_evaluados agregada a com4_tdpei';
    ELSE
        RAISE NOTICE 'Columna criterios_evaluados ya existe en com4_tdpei';
    END IF;
END $$;

-- Modificar tipos de columnas de texto para permitir más contenido
ALTER TABLE com4_tdpei 
    ALTER COLUMN objetivo_pei TYPE VARCHAR(1000),
    ALTER COLUMN descripcion_pei TYPE VARCHAR(2000);

-- Hacer nullable campos que pueden ser opcionales inicialmente
ALTER TABLE com4_tdpei 
    ALTER COLUMN estado_PCM DROP NOT NULL,
    ALTER COLUMN observaciones_PCM DROP NOT NULL,
    ALTER COLUMN ruta_pdf_pei DROP NOT NULL,
    ALTER COLUMN anio_inicio_pei DROP NOT NULL,
    ALTER COLUMN anio_fin_pei DROP NOT NULL,
    ALTER COLUMN objetivo_pei DROP NOT NULL,
    ALTER COLUMN descripcion_pei DROP NOT NULL,
    ALTER COLUMN fecha_aprobacion_pei DROP NOT NULL;

-- Actualizar defaults
ALTER TABLE com4_tdpei 
    ALTER COLUMN estado_PCM SET DEFAULT '',
    ALTER COLUMN observaciones_PCM SET DEFAULT '',
    ALTER COLUMN ruta_pdf_pei SET DEFAULT '',
    ALTER COLUMN alineado_pgd SET DEFAULT false,
    ALTER COLUMN check_privacidad SET DEFAULT false,
    ALTER COLUMN check_ddjj SET DEFAULT false,
    ALTER COLUMN fec_registro SET DEFAULT CURRENT_DATE;

COMMENT ON COLUMN com4_tdpei.criterios_evaluados IS 'Criterios de evaluación en formato JSON';

-- ========================================
-- COM5_DESTRATEGIAD: Verificar y agregar campos faltantes
-- ========================================

-- Agregar columna criterios_evaluados si no existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'com5_destrategiad' 
                   AND column_name = 'criterios_evaluados') THEN
        ALTER TABLE com5_destrategiad ADD COLUMN criterios_evaluados JSONB;
        RAISE NOTICE 'Columna criterios_evaluados agregada a com5_destrategiad';
    ELSE
        RAISE NOTICE 'Columna criterios_evaluados ya existe en com5_destrategiad';
    END IF;
END $$;

-- Modificar tipos de columnas para permitir más contenido
ALTER TABLE com5_destrategiad 
    ALTER COLUMN objetivos_estrategicos TYPE VARCHAR(2000),
    ALTER COLUMN lineas_accion TYPE VARCHAR(2000);

-- Hacer nullable campos opcionales
ALTER TABLE com5_destrategiad 
    ALTER COLUMN estado_PCM DROP NOT NULL,
    ALTER COLUMN observaciones_PCM DROP NOT NULL,
    ALTER COLUMN ruta_pdf_estrategia DROP NOT NULL,
    ALTER COLUMN nombre_estrategia DROP NOT NULL,
    ALTER COLUMN periodo_inicio_estrategia DROP NOT NULL,
    ALTER COLUMN periodo_fin_estrategia DROP NOT NULL,
    ALTER COLUMN objetivos_estrategicos DROP NOT NULL,
    ALTER COLUMN lineas_accion DROP NOT NULL,
    ALTER COLUMN fecha_aprobacion_estrategia DROP NOT NULL;

-- Actualizar defaults
ALTER TABLE com5_destrategiad 
    ALTER COLUMN estado_PCM SET DEFAULT '',
    ALTER COLUMN observaciones_PCM SET DEFAULT '',
    ALTER COLUMN ruta_pdf_estrategia SET DEFAULT '',
    ALTER COLUMN alineado_pgd_estrategia SET DEFAULT false,
    ALTER COLUMN check_privacidad SET DEFAULT false,
    ALTER COLUMN check_ddjj SET DEFAULT false,
    ALTER COLUMN fec_registro SET DEFAULT CURRENT_DATE;

COMMENT ON COLUMN com5_destrategiad.criterios_evaluados IS 'Criterios de evaluación en formato JSON';

-- ========================================
-- VERIFICACIÓN FINAL
-- ========================================

-- Mostrar estructura actualizada de com4_tdpei
\echo '\n=== Estructura COM4_TDPEI ==='
\d com4_tdpei

-- Mostrar estructura actualizada de com5_destrategiad
\echo '\n=== Estructura COM5_DESTRATEGIAD ==='
\d com5_destrategiad

-- Mensaje final
DO $$
BEGIN
    RAISE NOTICE '✅ Homologación completada exitosamente';
    RAISE NOTICE '📋 Tablas actualizadas: com4_tdpei, com5_destrategiad';
    RAISE NOTICE '🔧 Campos modificados para soportar aplicación';
END $$;
