-- =====================================================
-- FIX: Corregir nombres de columnas estado_pcm y observaciones_pcm
-- a estado_PCM y observaciones_PCM en Com4, Com5, Com7 y Com8
-- =====================================================

-- COM4_PEI
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'com4_pei' AND column_name = 'estado_pcm'
    ) THEN
        ALTER TABLE com4_pei RENAME COLUMN estado_pcm TO "estado_PCM";
        RAISE NOTICE 'Com4: estado_pcm → estado_PCM';
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'com4_pei' AND column_name = 'observaciones_pcm'
    ) THEN
        ALTER TABLE com4_pei RENAME COLUMN observaciones_pcm TO "observaciones_PCM";
        RAISE NOTICE 'Com4: observaciones_pcm → observaciones_PCM';
    END IF;
END $$;

-- COM5_ED
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'com5_ed' AND column_name = 'estado_pcm'
    ) THEN
        ALTER TABLE com5_ed RENAME COLUMN estado_pcm TO "estado_PCM";
        RAISE NOTICE 'Com5: estado_pcm → estado_PCM';
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'com5_ed' AND column_name = 'observaciones_pcm'
    ) THEN
        ALTER TABLE com5_ed RENAME COLUMN observaciones_pcm TO "observaciones_PCM";
        RAISE NOTICE 'Com5: observaciones_pcm → observaciones_PCM';
    END IF;
END $$;

-- COM7_IMPMPD
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'com7_impmpd' AND column_name = 'estado_pcm'
    ) THEN
        ALTER TABLE com7_impmpd RENAME COLUMN estado_pcm TO "estado_PCM";
        RAISE NOTICE 'Com7: estado_pcm → estado_PCM';
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'com7_impmpd' AND column_name = 'observaciones_pcm'
    ) THEN
        ALTER TABLE com7_impmpd RENAME COLUMN observaciones_pcm TO "observaciones_PCM";
        RAISE NOTICE 'Com7: observaciones_pcm → observaciones_PCM';
    END IF;
END $$;

-- COM8_PTUPA
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'com8_ptupa' AND column_name = 'estado_pcm'
    ) THEN
        ALTER TABLE com8_ptupa RENAME COLUMN estado_pcm TO "estado_PCM";
        RAISE NOTICE 'Com8: estado_pcm → estado_PCM';
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'com8_ptupa' AND column_name = 'observaciones_pcm'
    ) THEN
        ALTER TABLE com8_ptupa RENAME COLUMN observaciones_pcm TO "observaciones_PCM";
        RAISE NOTICE 'Com8: observaciones_pcm → observaciones_PCM';
    END IF;
END $$;

-- Verificar resultados
SELECT 'com4_pei' as tabla, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'com4_pei' AND column_name ILIKE '%estado%pcm%' OR column_name ILIKE '%observaciones%pcm%' AND table_name = 'com4_pei'
UNION ALL
SELECT 'com5_ed' as tabla, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'com5_ed' AND column_name ILIKE '%estado%pcm%' OR column_name ILIKE '%observaciones%pcm%' AND table_name = 'com5_ed'
UNION ALL
SELECT 'com7_impmpd' as tabla, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'com7_impmpd' AND column_name ILIKE '%estado%pcm%' OR column_name ILIKE '%observaciones%pcm%' AND table_name = 'com7_impmpd'
UNION ALL
SELECT 'com8_ptupa' as tabla, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'com8_ptupa' AND column_name ILIKE '%estado%pcm%' OR column_name ILIKE '%observaciones%pcm%' AND table_name = 'com8_ptupa'
ORDER BY tabla, column_name;
