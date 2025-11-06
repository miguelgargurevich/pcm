-- Migración: Actualizar base de datos local para usar UUID como en Supabase
-- ADVERTENCIA: Esto eliminará todos los datos existentes y recreará las tablas

BEGIN;

-- 1. Eliminar tablas con dependencias
DROP TABLE IF EXISTS log_auditoria CASCADE;
DROP TABLE IF EXISTS compromisos_entidades_base CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS entidades CASCADE;

-- 2. Recrear tabla usuarios con UUID (como en Supabase)
CREATE TABLE usuarios (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(100) UNIQUE NOT NULL,
    num_dni VARCHAR(8) UNIQUE NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    ape_paterno VARCHAR(60) NOT NULL,
    ape_materno VARCHAR(60) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    direccion VARCHAR(200),
    entidad_id UUID,
    perfil_id SMALLINT NOT NULL,
    activo BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    reset_password_token VARCHAR(100),
    reset_password_expiry TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Recrear tabla entidades con UUID
CREATE TABLE entidades (
    entidad_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ruc VARCHAR(11) UNIQUE NOT NULL,
    nombre VARCHAR(300) NOT NULL,
    direccion VARCHAR(200),
    ubigeo_id UUID,
    nivel_gobierno_id INTEGER,
    telefono VARCHAR(20),
    email VARCHAR(100),
    web VARCHAR(100),
    sector_id INTEGER,
    clasificacion_id INTEGER,
    nombre_alcalde VARCHAR(100),
    ape_pat_alcalde VARCHAR(60),
    ape_mat_alcalde VARCHAR(60),
    email_alcalde VARCHAR(100),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Crear índices
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_dni ON usuarios(num_dni);
CREATE INDEX IF NOT EXISTS idx_usuarios_entidad ON usuarios(entidad_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_perfil ON usuarios(perfil_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_reset_token ON usuarios(reset_password_token);
CREATE INDEX IF NOT EXISTS idx_usuarios_last_login ON usuarios(last_login);

CREATE INDEX IF NOT EXISTS idx_entidades_ruc ON entidades(ruc);
CREATE INDEX IF NOT EXISTS idx_entidades_ubigeo ON entidades(ubigeo_id);
CREATE INDEX IF NOT EXISTS idx_entidades_nivel_gobierno ON entidades(nivel_gobierno_id);
CREATE INDEX IF NOT EXISTS idx_entidades_sector ON entidades(sector_id);
CREATE INDEX IF NOT EXISTS idx_entidades_clasificacion ON entidades(clasificacion_id);

-- 5. Foreign keys
ALTER TABLE usuarios 
    ADD CONSTRAINT fk_usuarios_entidad 
    FOREIGN KEY (entidad_id) REFERENCES entidades(entidad_id) ON DELETE SET NULL;

ALTER TABLE usuarios 
    ADD CONSTRAINT fk_usuarios_perfil 
    FOREIGN KEY (perfil_id) REFERENCES perfiles(perfil_id);

ALTER TABLE entidades 
    ADD CONSTRAINT fk_entidades_ubigeo 
    FOREIGN KEY (ubigeo_id) REFERENCES ubigeo(ubigeo_id);

ALTER TABLE entidades 
    ADD CONSTRAINT fk_entidades_nivel_gobierno 
    FOREIGN KEY (nivel_gobierno_id) REFERENCES nivel_gobierno(nivel_gobierno_id);

ALTER TABLE entidades 
    ADD CONSTRAINT fk_entidades_sector 
    FOREIGN KEY (sector_id) REFERENCES sector(sector_id);

ALTER TABLE entidades 
    ADD CONSTRAINT fk_entidades_clasificacion 
    FOREIGN KEY (clasificacion_id) REFERENCES clasificacion(clasificacion_id);

-- 6. Insertar entidad PCM de prueba
INSERT INTO entidades (
    ruc,
    nombre,
    direccion,
    ubigeo_id,
    nivel_gobierno_id,
    telefono,
    email,
    sector_id,
    clasificacion_id,
    nombre_alcalde,
    ape_pat_alcalde,
    ape_mat_alcalde,
    email_alcalde,
    activo
) VALUES (
    '20131370645',
    'Presidencia del Consejo de Ministros',
    'Jr. Carabaya Nro. 801',
    (SELECT ubigeo_id FROM ubigeo WHERE codigo = '150101' LIMIT 1),
    1,
    '01-2196000',
    'webmaster@pcm.gob.pe',
    1,
    1,
    'Representante',
    'Legal',
    'PCM',
    'legal@pcm.gob.pe',
    true
);

-- 7. Insertar usuario admin de prueba
-- Password: Admin123!
-- Hash BCrypt: $2a$11$vqE0rJ8bVvWYZYqk6SXxR.gKbAOXjnVe6.4t9LbKNnYGmhQGbVV6a
INSERT INTO usuarios (
    email, 
    num_dni, 
    nombres, 
    ape_paterno, 
    ape_materno, 
    password_hash,
    entidad_id,
    perfil_id,
    activo
) VALUES (
    'admin@pcm.gob.pe',
    '12345678',
    'Administrador',
    'Sistema',
    'PCM',
    '$2a$11$vqE0rJ8bVvWYZYqk6SXxR.gKbAOXjnVe6.4t9LbKNnYGmhQGbVV6a',
    (SELECT entidad_id FROM entidades WHERE ruc = '20131370645' LIMIT 1),
    1,
    true
);

COMMIT;

SELECT '✓ Base de datos local migrada a UUID exitosamente' AS status;
SELECT '✓ Usuario admin: admin@pcm.gob.pe / Admin123!' AS info;
