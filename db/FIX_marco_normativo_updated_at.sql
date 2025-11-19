-- =====================================================
-- FIX: Agregar columna updated_at a marco_normativo
-- Base de datos: Supabase (PostgreSQL)
-- Fecha: 2025-11-19
-- Descripción: Agrega la columna updated_at si no existe
-- =====================================================

-- Agregar columna updated_at
DO $$
BEGIN
    -- Verificar si la columna existe
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'marco_normativo' 
        AND column_name = 'updated_at'
    ) THEN
        -- Agregar la columna
        ALTER TABLE marco_normativo 
        ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        
        -- Establecer valores iniciales
        UPDATE marco_normativo 
        SET updated_at = created_at 
        WHERE updated_at IS NULL;
        
        RAISE NOTICE '✅ Columna updated_at agregada exitosamente a marco_normativo';
    ELSE
        RAISE NOTICE '⚠️  La columna updated_at ya existe en marco_normativo';
    END IF;
END $$;

-- Verificar resultado
SELECT 
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'marco_normativo'
AND column_name IN ('created_at', 'updated_at')
ORDER BY column_name;

-- Mostrar mensaje final
DO $$
BEGIN
    RAISE NOTICE '================================================';
    RAISE NOTICE '✅ SCRIPT EJECUTADO EXITOSAMENTE';
    RAISE NOTICE 'Tabla: marco_normativo';
    RAISE NOTICE 'Columna: updated_at agregada';
    RAISE NOTICE '================================================';
END $$;
