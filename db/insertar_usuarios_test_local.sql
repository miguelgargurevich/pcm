-- =============================================
-- Script: Insertar Usuarios de Prueba - Local
-- Descripción: Inserta usuarios de prueba con sus perfiles
-- Fecha: 20 de noviembre de 2025
-- =============================================

-- Contraseña para todos los usuarios: Admin123!
-- Hash BCrypt: $2a$11$tF1B9Lph.5xrFtFvlr29YOAZk71wy1QUT4fhBFFB9zNfeTcNX/aLq

-- Verificar que existen los perfiles necesarios
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM perfiles WHERE perfil_id = 1) THEN
        RAISE EXCEPTION 'No existe el perfil con ID 1 (Administrador PCM)';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM perfiles WHERE perfil_id = 2) THEN
        RAISE EXCEPTION 'No existe el perfil con ID 2 (Entidad)';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM perfiles WHERE perfil_id = 3) THEN
        RAISE EXCEPTION 'No existe el perfil con ID 3 (Operador PCM)';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM perfiles WHERE perfil_id = 4) THEN
        RAISE EXCEPTION 'No existe el perfil con ID 4 (Consulta)';
    END IF;
END $$;

-- Insertar usuarios de prueba
INSERT INTO usuarios (
    user_id,
    email,
    password_hash,
    num_dni,
    nombres,
    ape_paterno,
    ape_materno,
    perfil_id,
    entidad_id,
    activo,
    created_at,
    updated_at
) VALUES
-- 1. Administrador PCM
(
    gen_random_uuid(),
    'admin.test@pcm.gob.pe',
    '$2a$11$tF1B9Lph.5xrFtFvlr29YOAZk71wy1QUT4fhBFFB9zNfeTcNX/aLq',
    '87654321',
    'Juan Carlos',
    'Pérez',
    'González',
    1, -- Administrador PCM
    (SELECT entidad_id FROM entidades WHERE ruc = '20131370645' LIMIT 1), -- PCM
    true,
    NOW(),
    NOW()
),
-- 2. Entidad
(
    gen_random_uuid(),
    'entidad.test@gob.pe',
    '$2a$11$tF1B9Lph.5xrFtFvlr29YOAZk71wy1QUT4fhBFFB9zNfeTcNX/aLq',
    '12348765',
    'María Elena',
    'Torres',
    'Ramírez',
    2, -- Entidad
    (SELECT entidad_id FROM entidades WHERE ruc = '20131370645' LIMIT 1), -- PCM
    true,
    NOW(),
    NOW()
),
-- 3. Operador PCM
(
    gen_random_uuid(),
    'operador.test@pcm.gob.pe',
    '$2a$11$tF1B9Lph.5xrFtFvlr29YOAZk71wy1QUT4fhBFFB9zNfeTcNX/aLq',
    '45678912',
    'Roberto',
    'Sánchez',
    'Mendoza',
    3, -- Operador PCM
    (SELECT entidad_id FROM entidades WHERE ruc = '20131370645' LIMIT 1), -- PCM
    true,
    NOW(),
    NOW()
),
-- 4. Invitado / Consulta
(
    gen_random_uuid(),
    'invitado.test@externo.gob.pe',
    '$2a$11$tF1B9Lph.5xrFtFvlr29YOAZk71wy1QUT4fhBFFB9zNfeTcNX/aLq',
    '78945612',
    'Ana Lucía',
    'Vásquez',
    'Castro',
    4, -- Consulta
    NULL, -- Sin entidad asignada
    true,
    NOW(),
    NOW()
)
ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    num_dni = EXCLUDED.num_dni,
    nombres = EXCLUDED.nombres,
    ape_paterno = EXCLUDED.ape_paterno,
    ape_materno = EXCLUDED.ape_materno,
    perfil_id = EXCLUDED.perfil_id,
    entidad_id = EXCLUDED.entidad_id,
    activo = EXCLUDED.activo,
    updated_at = NOW();

-- Verificar usuarios creados
SELECT 
    u.email,
    u.num_dni,
    u.nombres || ' ' || u.ape_paterno || ' ' || u.ape_materno as nombre_completo,
    p.nombre as perfil,
    e.razon_social as entidad,
    u.activo
FROM usuarios u
JOIN perfiles p ON u.perfil_id = p.perfil_id
LEFT JOIN entidades e ON u.entidad_id = e.entidad_id
WHERE u.email LIKE '%.test@%'
ORDER BY p.perfil_id;

-- Resultado esperado:
-- ✅ 4 usuarios de prueba creados/actualizados
-- ✅ Todos con contraseña: Admin123!
-- ✅ Perfiles: Administrador PCM, Entidad, Operador PCM, Consulta

DO $$
BEGIN
    RAISE NOTICE '✅ Usuarios de prueba insertados correctamente';
    RAISE NOTICE '📧 Emails: admin.test@pcm.gob.pe, entidad.test@gob.pe, operador.test@pcm.gob.pe, invitado.test@externo.gob.pe';
    RAISE NOTICE '🔑 Contraseña universal: Admin123!';
END $$;
