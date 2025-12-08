-- ============================================
-- SCRIPT: Resetear usuario entidad.test@gob.pe
-- Contraseña: Test123!
-- Hash BCrypt: $2a$11$tF1B9Lph.5xrFtFvlr29YOAZk71wy1QUT4fhBFFB9zNfeTcNX/aLq
-- ============================================

-- 1. Verificar si el usuario existe
SELECT 
    user_id,
    email,
    num_dni,
    nombres,
    ape_paterno,
    activo,
    perfil_id,
    entidad_id,
    created_at
FROM usuarios 
WHERE email = 'entidad.test@gob.pe';

-- 2. Si el usuario NO existe, crearlo
-- (Descomenta las siguientes líneas si necesitas crearlo)
/*
INSERT INTO usuarios (
    user_id,
    email,
    password,
    num_dni,
    nombres,
    ape_paterno,
    ape_materno,
    perfil_id,
    entidad_id,
    activo,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'entidad.test@gob.pe',
    '$2a$11$tF1B9Lph.5xrFtFvlr29YOAZk71wy1QUT4fhBFFB9zNfeTcNX/aLq',
    '12348765',
    'María Elena',
    'Torres',
    'Ramírez',
    2, -- Perfil: Entidad
    (SELECT entidad_id FROM entidades LIMIT 1), -- Primera entidad disponible
    true,
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;
*/

-- 3. Si el usuario EXISTE pero no puede entrar, resetear contraseña y activar
UPDATE usuarios 
SET 
    password = '$2a$11$tF1B9Lph.5xrFtFvlr29YOAZk71wy1QUT4fhBFFB9zNfeTcNX/aLq',
    activo = true,
    updated_at = NOW()
WHERE email = 'entidad.test@gob.pe';

-- 4. Verificar el resultado
SELECT 
    user_id,
    email,
    activo,
    perfil_id,
    entidad_id,
    updated_at
FROM usuarios 
WHERE email = 'entidad.test@gob.pe';

-- ============================================
-- CREDENCIALES PARA LOGIN:
-- Email: entidad.test@gob.pe
-- Contraseña: Test123!
-- ============================================
