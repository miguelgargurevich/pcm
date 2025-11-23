-- =====================================================
-- SINCRONIZAR: Tabla COM6_MPGOBPE de DESA con PROD
-- Fecha: 2025-11-23
-- Descripción: Sincroniza la estructura de desarrollo con producción
-- =====================================================

-- BACKUP: Primero hacer backup de la data existente si la hay
DO $$
DECLARE
    v_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_count FROM com6_mpgobpe;
    IF v_count > 0 THEN
        RAISE NOTICE '⚠️  ADVERTENCIA: La tabla tiene % registros. Se creará backup temporal.', v_count;
        CREATE TEMP TABLE com6_mpgobpe_backup AS SELECT * FROM com6_mpgobpe;
        RAISE NOTICE '✓ Backup temporal creado con % registros', v_count;
    ELSE
        RAISE NOTICE '✓ La tabla está vacía, no se necesita backup';
    END IF;
END $$;

-- Paso 1: Eliminar columnas que no existen en producción
DO $$
BEGIN
    -- Eliminar fecha_aprobacion si existe
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'com6_mpgobpe' AND column_name = 'fecha_aprobacion') THEN
        ALTER TABLE com6_mpgobpe DROP COLUMN fecha_aprobacion;
        RAISE NOTICE '✓ Columna fecha_aprobacion eliminada';
    END IF;

    -- Eliminar numero_resolucion si existe
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'com6_mpgobpe' AND column_name = 'numero_resolucion') THEN
        ALTER TABLE com6_mpgobpe DROP COLUMN numero_resolucion;
        RAISE NOTICE '✓ Columna numero_resolucion eliminada';
    END IF;

    -- Eliminar archivo_marco si existe
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'com6_mpgobpe' AND column_name = 'archivo_marco') THEN
        ALTER TABLE com6_mpgobpe DROP COLUMN archivo_marco;
        RAISE NOTICE '✓ Columna archivo_marco eliminada';
    END IF;

    -- Eliminar descripcion si existe
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'com6_mpgobpe' AND column_name = 'descripcion') THEN
        ALTER TABLE com6_mpgobpe DROP COLUMN descripcion;
        RAISE NOTICE '✓ Columna descripcion eliminada';
    END IF;

    -- Eliminar politicas si existe
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'com6_mpgobpe' AND column_name = 'politicas') THEN
        ALTER TABLE com6_mpgobpe DROP COLUMN politicas;
        RAISE NOTICE '✓ Columna politicas eliminada';
    END IF;

    -- Eliminar lineamientos si existe
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'com6_mpgobpe' AND column_name = 'lineamientos') THEN
        ALTER TABLE com6_mpgobpe DROP COLUMN lineamientos;
        RAISE NOTICE '✓ Columna lineamientos eliminada';
    END IF;

    -- Eliminar fecha_vigencia si existe
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'com6_mpgobpe' AND column_name = 'fecha_vigencia') THEN
        ALTER TABLE com6_mpgobpe DROP COLUMN fecha_vigencia;
        RAISE NOTICE '✓ Columna fecha_vigencia eliminada';
    END IF;
END $$;

-- Paso 2: Agregar columnas que existen en producción pero no en desarrollo
DO $$
BEGIN
    -- url_gobpe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'com6_mpgobpe' AND column_name = 'url_gobpe') THEN
        ALTER TABLE com6_mpgobpe ADD COLUMN url_gobpe VARCHAR(150) NOT NULL DEFAULT '';
        RAISE NOTICE '✓ Columna url_gobpe agregada';
    END IF;

    -- fecha_migracion_gobpe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'com6_mpgobpe' AND column_name = 'fecha_migracion_gobpe') THEN
        ALTER TABLE com6_mpgobpe ADD COLUMN fecha_migracion_gobpe DATE NOT NULL DEFAULT CURRENT_DATE;
        RAISE NOTICE '✓ Columna fecha_migracion_gobpe agregada';
    END IF;

    -- fecha_actualizacion_gobpe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'com6_mpgobpe' AND column_name = 'fecha_actualizacion_gobpe') THEN
        ALTER TABLE com6_mpgobpe ADD COLUMN fecha_actualizacion_gobpe DATE NOT NULL DEFAULT CURRENT_DATE;
        RAISE NOTICE '✓ Columna fecha_actualizacion_gobpe agregada';
    END IF;

    -- responsable_gobpe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'com6_mpgobpe' AND column_name = 'responsable_gobpe') THEN
        ALTER TABLE com6_mpgobpe ADD COLUMN responsable_gobpe VARCHAR(100) NOT NULL DEFAULT '';
        RAISE NOTICE '✓ Columna responsable_gobpe agregada';
    END IF;

    -- correo_responsable_gobpe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'com6_mpgobpe' AND column_name = 'correo_responsable_gobpe') THEN
        ALTER TABLE com6_mpgobpe ADD COLUMN correo_responsable_gobpe VARCHAR(100) NOT NULL DEFAULT '';
        RAISE NOTICE '✓ Columna correo_responsable_gobpe agregada';
    END IF;

    -- telefono_responsable_gobpe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'com6_mpgobpe' AND column_name = 'telefono_responsable_gobpe') THEN
        ALTER TABLE com6_mpgobpe ADD COLUMN telefono_responsable_gobpe VARCHAR(30) NOT NULL DEFAULT '';
        RAISE NOTICE '✓ Columna telefono_responsable_gobpe agregada';
    END IF;

    -- tipo_migracion_gobpe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'com6_mpgobpe' AND column_name = 'tipo_migracion_gobpe') THEN
        ALTER TABLE com6_mpgobpe ADD COLUMN tipo_migracion_gobpe VARCHAR(50) NOT NULL DEFAULT '';
        RAISE NOTICE '✓ Columna tipo_migracion_gobpe agregada';
    END IF;

    -- observacion_gobpe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'com6_mpgobpe' AND column_name = 'observacion_gobpe') THEN
        ALTER TABLE com6_mpgobpe ADD COLUMN observacion_gobpe VARCHAR(255) NOT NULL DEFAULT '';
        RAISE NOTICE '✓ Columna observacion_gobpe agregada';
    END IF;

    -- ruta_pdf_gobpe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'com6_mpgobpe' AND column_name = 'ruta_pdf_gobpe') THEN
        ALTER TABLE com6_mpgobpe ADD COLUMN ruta_pdf_gobpe VARCHAR(255) NOT NULL DEFAULT '';
        RAISE NOTICE '✓ Columna ruta_pdf_gobpe agregada';
    END IF;
END $$;

-- Paso 3: Ajustar tipos y restricciones NOT NULL para que coincidan con producción
DO $$
BEGIN
    -- Ajustar etapa_formulario
    ALTER TABLE com6_mpgobpe ALTER COLUMN etapa_formulario TYPE VARCHAR(20);
    ALTER TABLE com6_mpgobpe ALTER COLUMN etapa_formulario SET NOT NULL;
    
    -- Ajustar estado
    ALTER TABLE com6_mpgobpe ALTER COLUMN estado TYPE VARCHAR(15);
    ALTER TABLE com6_mpgobpe ALTER COLUMN estado SET NOT NULL;
    
    -- Ajustar estado_pcm
    ALTER TABLE com6_mpgobpe ALTER COLUMN estado_pcm TYPE VARCHAR(50);
    ALTER TABLE com6_mpgobpe ALTER COLUMN estado_pcm SET NOT NULL;
    
    -- Ajustar observaciones_pcm
    ALTER TABLE com6_mpgobpe ALTER COLUMN observaciones_pcm TYPE VARCHAR(500);
    ALTER TABLE com6_mpgobpe ALTER COLUMN observaciones_pcm SET NOT NULL;
    
    RAISE NOTICE '✓ Tipos de datos ajustados';
END $$;

-- Paso 4: Verificar estructura final
SELECT 
    column_name, 
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'com6_mpgobpe'
ORDER BY ordinal_position;

-- Paso 5: Contar registros finales
DO $$
DECLARE
    v_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_count FROM com6_mpgobpe;
    
    RAISE NOTICE '';
    RAISE NOTICE '==================================================';
    RAISE NOTICE '✓ SINCRONIZACIÓN COMPLETADA EXITOSAMENTE';
    RAISE NOTICE '==================================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Registros en la tabla: %', v_count;
    RAISE NOTICE '';
    RAISE NOTICE 'Próximos pasos:';
    RAISE NOTICE '1. Reiniciar el backend';
    RAISE NOTICE '2. Probar la carga del Compromiso 6';
    RAISE NOTICE '';
END $$;
