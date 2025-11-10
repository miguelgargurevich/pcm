-- ====================================
-- AGREGAR COLUMNAS FALTANTES A marco_normativo
-- ====================================

-- PASO 1: Ver estructura actual
SELECT '=== ESTRUCTURA ACTUAL DE marco_normativo ===' as paso;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'marco_normativo'
ORDER BY ordinal_position;

-- PASO 2: Agregar columna created_at si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'marco_normativo' 
        AND column_name = 'created_at'
    ) THEN
        ALTER TABLE marco_normativo 
        ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        
        -- Actualizar registros existentes
        UPDATE marco_normativo 
        SET created_at = CURRENT_TIMESTAMP 
        WHERE created_at IS NULL;
        
        RAISE NOTICE '✓ Columna created_at agregada';
    ELSE
        RAISE NOTICE '⚠ Columna created_at ya existe';
    END IF;
END $$;

-- PASO 3: Agregar columna updated_at si no existe (por si acaso)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'marco_normativo' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE marco_normativo 
        ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        
        UPDATE marco_normativo 
        SET updated_at = CURRENT_TIMESTAMP 
        WHERE updated_at IS NULL;
        
        RAISE NOTICE '✓ Columna updated_at agregada';
    ELSE
        RAISE NOTICE '⚠ Columna updated_at ya existe';
    END IF;
END $$;

-- PASO 4: Verificar estructura final
SELECT '=== ESTRUCTURA FINAL DE marco_normativo ===' as paso;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'marco_normativo'
ORDER BY ordinal_position;

-- PASO 5: Verificar que las columnas críticas existen
SELECT '=== VERIFICACIÓN DE COLUMNAS CRÍTICAS ===' as verificacion;

SELECT 
    'activo' as columna,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'marco_normativo' AND column_name = 'activo'
    ) THEN '✓ EXISTE' ELSE '✗ FALTA' END as estado;

SELECT 
    'created_at' as columna,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'marco_normativo' AND column_name = 'created_at'
    ) THEN '✓ EXISTE' ELSE '✗ FALTA' END as estado;

SELECT 
    'updated_at' as columna,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'marco_normativo' AND column_name = 'updated_at'
    ) THEN '✓ EXISTE' ELSE '✗ FALTA' END as estado;

SELECT '✓✓✓ COLUMNAS AGREGADAS EXITOSAMENTE ✓✓✓' as resultado;
