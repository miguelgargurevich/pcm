-- ====================================
-- MIGRACIÓN: Agregar columnas activo y created_at a perfiles
-- ====================================

-- Agregar columna activo a la tabla perfiles
ALTER TABLE perfiles 
ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;

-- Agregar columna created_at a la tabla perfiles
ALTER TABLE perfiles 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

-- Actualizar registros existentes (por si acaso no tienen valores)
UPDATE perfiles 
SET activo = true 
WHERE activo IS NULL;

UPDATE perfiles 
SET created_at = NOW() 
WHERE created_at IS NULL;

-- Verificar que las columnas se hayan agregado correctamente
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'perfiles'
ORDER BY ordinal_position;

SELECT '✓ Columnas activo y created_at agregadas a perfiles exitosamente' AS status;
