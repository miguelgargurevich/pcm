-- =====================================================
-- FIX: Corregir estructura de tabla COM6_MPGOBPE
-- =====================================================
-- Este script corrige el nombre de la columna PK y agrega campos faltantes

-- 1. Si la PK se llama incorrectamente "comded_ent_id", renombrarla
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'com6_mpgobpe' 
        AND column_name = 'comded_ent_id'
    ) THEN
        ALTER TABLE com6_mpgobpe RENAME COLUMN comded_ent_id TO commpgobpe_ent_id;
        RAISE NOTICE 'Columna comded_ent_id renombrada a commpgobpe_ent_id';
    END IF;
END $$;

-- 2. Agregar columna criterios_evaluados si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'com6_mpgobpe' 
        AND column_name = 'criterios_evaluados'
    ) THEN
        ALTER TABLE com6_mpgobpe ADD COLUMN criterios_evaluados TEXT;
        RAISE NOTICE 'Columna criterios_evaluados agregada';
    END IF;
END $$;

-- 3. Asegurar que usuario_registra sea UUID si existe la tabla
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'com6_mpgobpe' 
        AND column_name = 'usuario_registra'
        AND data_type != 'uuid'
    ) THEN
        ALTER TABLE com6_mpgobpe 
        ALTER COLUMN usuario_registra TYPE uuid USING usuario_registra::text::uuid;
        RAISE NOTICE 'Columna usuario_registra convertida a UUID';
    END IF;
END $$;

-- 4. Verificar estructura final
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'com6_mpgobpe'
ORDER BY ordinal_position;
