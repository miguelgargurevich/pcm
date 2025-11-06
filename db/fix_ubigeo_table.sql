-- ====================================
-- FIX: Agregar columnas faltantes a tabla ubigeo
-- ====================================

-- PASO 1: Verificar estructura actual
SELECT 
    '=== ESTRUCTURA ACTUAL DE UBIGEO ===' as info;

SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'ubigeo'
ORDER BY ordinal_position;

-- PASO 2: Agregar columnas faltantes
DO $$
BEGIN
    -- Agregar columna activo si no existe
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'ubigeo' 
        AND column_name = 'activo'
    ) THEN
        ALTER TABLE ubigeo 
        ADD COLUMN activo BOOLEAN DEFAULT true;
        
        -- Actualizar registros existentes
        UPDATE ubigeo SET activo = true WHERE activo IS NULL;
        
        RAISE NOTICE '✓ Columna activo agregada a ubigeo';
    ELSE
        RAISE NOTICE 'La columna activo ya existe en ubigeo';
    END IF;
    
    -- Agregar columna created_at si no existe
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'ubigeo' 
        AND column_name = 'created_at'
    ) THEN
        ALTER TABLE ubigeo 
        ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
        
        -- Actualizar registros existentes
        UPDATE ubigeo SET created_at = NOW() WHERE created_at IS NULL;
        
        RAISE NOTICE '✓ Columna created_at agregada a ubigeo';
    ELSE
        RAISE NOTICE 'La columna created_at ya existe en ubigeo';
    END IF;
    
    -- Agregar columna updated_at si no existe
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'ubigeo' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE ubigeo 
        ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
        
        -- Actualizar registros existentes
        UPDATE ubigeo SET updated_at = NOW() WHERE updated_at IS NULL;
        
        RAISE NOTICE '✓ Columna updated_at agregada a ubigeo';
    ELSE
        RAISE NOTICE 'La columna updated_at ya existe en ubigeo';
    END IF;
END $$;

-- PASO 3: Verificar estructura final
SELECT 
    '=== ESTRUCTURA FINAL DE UBIGEO ===' as info;

SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'ubigeo'
ORDER BY ordinal_position;

-- PASO 4: Verificar algunos datos
SELECT 
    '=== PRIMEROS 5 REGISTROS ===' as info;

SELECT * FROM ubigeo LIMIT 5;

SELECT '✓✓✓ CORRECCIÓN DE UBIGEO COMPLETADA ✓✓✓' as status;
