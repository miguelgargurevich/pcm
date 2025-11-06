-- Migración: Agregar columna last_login a la tabla usuarios en Supabase
-- Ejecutar este script en el SQL Editor de Supabase

-- Agregar columna last_login a la tabla usuarios
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;

-- Crear índice para mejorar las consultas de auditoría
CREATE INDEX IF NOT EXISTS idx_usuarios_last_login ON usuarios(last_login);

-- Comentario de la columna
COMMENT ON COLUMN usuarios.last_login IS 'Fecha y hora del último inicio de sesión del usuario';

-- Verificar que la columna se agregó correctamente
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'usuarios' AND column_name = 'last_login';
