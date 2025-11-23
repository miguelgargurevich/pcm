-- =====================================================
-- FIX URGENTE: Corregir estructura completa de COM6_MPGOBPE
-- Fecha: 2025-11-23
-- Descripción: Corrige todos los problemas de estructura de la tabla com6_mpgobpe
-- =====================================================

-- Paso 1: Verificar si la tabla existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'com6_mpgobpe') THEN
        RAISE EXCEPTION 'La tabla com6_mpgobpe no existe. Debe crearla primero.';
    END IF;
    RAISE NOTICE '✓ Tabla com6_mpgobpe existe';
END $$;

-- Paso 2: Renombrar PK si tiene nombre incorrecto
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'com6_mpgobpe' 
        AND column_name = 'comded_ent_id'
    ) THEN
        ALTER TABLE com6_mpgobpe RENAME COLUMN comded_ent_id TO commpgobpe_ent_id;
        RAISE NOTICE '✓ Columna PK renombrada: comded_ent_id → commpgobpe_ent_id';
    ELSE
        RAISE NOTICE '✓ Columna PK ya tiene el nombre correcto: commpgobpe_ent_id';
    END IF;
END $$;

-- Paso 3: Agregar columna criterios_evaluados si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'com6_mpgobpe' 
        AND column_name = 'criterios_evaluados'
    ) THEN
        ALTER TABLE com6_mpgobpe ADD COLUMN criterios_evaluados TEXT;
        RAISE NOTICE '✓ Columna criterios_evaluados agregada';
    ELSE
        RAISE NOTICE '✓ Columna criterios_evaluados ya existe';
    END IF;
END $$;

-- Paso 4: Asegurar que usuario_registra sea UUID
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'com6_mpgobpe' 
        AND column_name = 'usuario_registra'
        AND data_type != 'uuid'
    ) THEN
        -- Si hay datos, intentar convertir
        ALTER TABLE com6_mpgobpe 
        ALTER COLUMN usuario_registra TYPE uuid USING 
            CASE 
                WHEN usuario_registra ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' 
                THEN usuario_registra::uuid
                ELSE '00000000-0000-0000-0000-000000000000'::uuid
            END;
        RAISE NOTICE '✓ Columna usuario_registra convertida a UUID';
    ELSE
        RAISE NOTICE '✓ Columna usuario_registra ya es UUID';
    END IF;
END $$;

-- Paso 5: Renombrar columnas con mayúsculas incorrectas (PostgreSQL es case-sensitive con comillas)
DO $$
BEGIN
    -- Verificar y renombrar estado_pcm
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'com6_mpgobpe' 
        AND column_name = 'estado_PCM'
    ) THEN
        ALTER TABLE com6_mpgobpe RENAME COLUMN "estado_PCM" TO estado_pcm;
        RAISE NOTICE '✓ Columna renombrada: estado_PCM → estado_pcm';
    END IF;

    -- Verificar y renombrar observaciones_pcm  
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'com6_mpgobpe' 
        AND column_name = 'observaciones_PCM'
    ) THEN
        ALTER TABLE com6_mpgobpe RENAME COLUMN "observaciones_PCM" TO observaciones_pcm;
        RAISE NOTICE '✓ Columna renombrada: observaciones_PCM → observaciones_pcm';
    END IF;
    
    RAISE NOTICE '✓ Verificación de mayúsculas completada';
END $$;

-- Paso 6: Verificar estructura final de columnas críticas
DO $$
DECLARE
    v_count INTEGER;
BEGIN
    -- Verificar columnas esenciales
    SELECT COUNT(*) INTO v_count
    FROM information_schema.columns 
    WHERE table_name = 'com6_mpgobpe' 
    AND column_name IN (
        'commpgobpe_ent_id',
        'compromiso_id',
        'entidad_id',
        'etapa_formulario',
        'estado',
        'url_gobpe',
        'fecha_migracion_gobpe',
        'fecha_actualizacion_gobpe',
        'responsable_gobpe',
        'correo_responsable_gobpe',
        'telefono_responsable_gobpe',
        'tipo_migracion_gobpe',
        'observacion_gobpe',
        'ruta_pdf_gobpe',
        'criterios_evaluados',
        'check_privacidad',
        'check_ddjj',
        'estado_pcm',
        'observaciones_pcm',
        'created_at',
        'fec_registro',
        'usuario_registra',
        'activo'
    );

    IF v_count < 23 THEN
        RAISE WARNING '⚠ Solo % de 23 columnas esenciales encontradas. Puede faltar alguna columna.', v_count;
    ELSE
        RAISE NOTICE '✓ Todas las columnas esenciales están presentes (%/23)', v_count;
    END IF;
END $$;

-- Paso 7: Mostrar estructura final
SELECT 
    column_name, 
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'com6_mpgobpe'
ORDER BY ordinal_position;

-- Paso 8: Mostrar resumen
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '==================================================';
    RAISE NOTICE '✓ FIX COM6 COMPLETADO EXITOSAMENTE';
    RAISE NOTICE '==================================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Próximos pasos:';
    RAISE NOTICE '1. Reiniciar el backend si está corriendo';
    RAISE NOTICE '2. Probar la carga del Compromiso 6';
    RAISE NOTICE '';
END $$;
