-- =====================================================
-- FIX: Corregir nombres de columnas en COM6_MPGOBPE
-- Asegurar que estado_PCM y observaciones_PCM tengan mayúsculas correctas
-- =====================================================

-- Verificar nombres actuales de columnas
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'com6_mpgobpe' 
AND column_name IN ('estado_pcm', 'estado_PCM', 'observaciones_pcm', 'observaciones_PCM')
ORDER BY column_name;

-- Si existen con minúsculas, renombrarlas
DO $$
BEGIN
    -- Renombrar estado_pcm a estado_PCM si existe
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'com6_mpgobpe' 
        AND column_name = 'estado_pcm'
    ) THEN
        ALTER TABLE com6_mpgobpe RENAME COLUMN estado_pcm TO "estado_PCM";
        RAISE NOTICE 'Columna estado_pcm renombrada a estado_PCM';
    END IF;

    -- Renombrar observaciones_pcm a observaciones_PCM si existe
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'com6_mpgobpe' 
        AND column_name = 'observaciones_pcm'
    ) THEN
        ALTER TABLE com6_mpgobpe RENAME COLUMN observaciones_pcm TO "observaciones_PCM";
        RAISE NOTICE 'Columna observaciones_pcm renombrada a observaciones_PCM';
    END IF;
END $$;

-- Verificar resultado
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'com6_mpgobpe' 
AND column_name ILIKE '%estado%pcm%' OR column_name ILIKE '%observaciones%pcm%'
ORDER BY column_name;
