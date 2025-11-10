-- ====================================
-- AGREGAR COLUMNA activo A LA TABLA marco_normativo
-- ====================================
-- Script simplificado para solo agregar la columna activo
-- Ejecutar este script en Supabase SQL Editor

DO $$
BEGIN
    -- Verificar si la columna activo ya existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'marco_normativo' 
        AND column_name = 'activo'
    ) THEN
        -- Agregar la columna con valor por defecto
        ALTER TABLE marco_normativo 
        ADD COLUMN activo BOOLEAN DEFAULT TRUE NOT NULL;
        
        -- Actualizar registros existentes para asegurar que tengan valor TRUE
        UPDATE marco_normativo 
        SET activo = TRUE 
        WHERE activo IS NULL;
        
        RAISE NOTICE '✓ Columna activo agregada exitosamente a marco_normativo';
    ELSE
        RAISE NOTICE '⚠ La columna activo ya existe en marco_normativo';
    END IF;
END $$;

-- Crear índice para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_marco_normativo_activo ON marco_normativo(activo);

-- Verificar el resultado
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns
WHERE table_name = 'marco_normativo' AND column_name = 'activo';
