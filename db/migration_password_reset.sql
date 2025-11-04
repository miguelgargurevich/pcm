-- Migration: Agregar campos de recuperación de contraseña a tabla usuarios
-- Fecha: 2025-11-04
-- Descripción: Agrega reset_password_token y reset_password_expiry para funcionalidad de "Olvidaste tu contraseña"

-- Agregar columnas si no existen
DO $$ 
BEGIN
    -- Agregar reset_password_token
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'usuarios' AND column_name = 'reset_password_token'
    ) THEN
        ALTER TABLE usuarios ADD COLUMN reset_password_token VARCHAR(100) NULL;
        COMMENT ON COLUMN usuarios.reset_password_token IS 'Token único para recuperación de contraseña';
    END IF;

    -- Agregar reset_password_expiry
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'usuarios' AND column_name = 'reset_password_expiry'
    ) THEN
        ALTER TABLE usuarios ADD COLUMN reset_password_expiry TIMESTAMP NULL;
        COMMENT ON COLUMN usuarios.reset_password_expiry IS 'Fecha y hora de expiración del token de recuperación';
    END IF;
END $$;

-- Crear índice para búsqueda por token
CREATE INDEX IF NOT EXISTS idx_usuarios_reset_token 
ON usuarios(reset_password_token) 
WHERE reset_password_token IS NOT NULL;

-- Verificación
SELECT 
    column_name, 
    data_type, 
    character_maximum_length,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'usuarios' 
AND column_name IN ('reset_password_token', 'reset_password_expiry')
ORDER BY ordinal_position;

-- Mostrar resultado
SELECT 'Migración de recuperación de contraseña completada exitosamente' AS status;
