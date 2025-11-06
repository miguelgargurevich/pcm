-- Eliminar tablas si existen para recrearlas con tipos correctos
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF NOT EXISTS entidades CASCADE;

-- Crear tabla usuarios
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
    reset_password_token VARCHAR(100),
    reset_password_expiry TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla entidades
CREATE TABLE entidades (
    entidad_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ruc VARCHAR(11) UNIQUE NOT NULL,
    nombre VARCHAR(300) NOT NULL,
    direccion VARCHAR(200),
    ubigeo_id VARCHAR(36),
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

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_dni ON usuarios(num_dni);
CREATE INDEX IF NOT EXISTS idx_usuarios_entidad ON usuarios(entidad_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_perfil ON usuarios(perfil_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_reset_token ON usuarios(reset_password_token);

CREATE INDEX IF NOT EXISTS idx_entidades_ruc ON entidades(ruc);
CREATE INDEX IF NOT EXISTS idx_entidades_ubigeo ON entidades(ubigeo_id);
CREATE INDEX IF NOT EXISTS idx_entidades_nivel_gobierno ON entidades(nivel_gobierno_id);
CREATE INDEX IF NOT EXISTS idx_entidades_sector ON entidades(sector_id);
CREATE INDEX IF NOT EXISTS idx_entidades_clasificacion ON entidades(clasificacion_id);

-- Foreign keys
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

-- Insertar usuario admin de prueba (password: Admin123!)
-- Hash BCrypt de "Admin123!": $2a$11$vqE0rJ8bVvWYZYqk6SXxR.gKbAOXjnVe6.4t9LbKNnYGmhQGbVV6a
INSERT INTO usuarios (
    email, 
    num_dni, 
    nombres, 
    ape_paterno, 
    ape_materno, 
    password_hash,
    perfil_id,
    activo
) VALUES (
    'admin@pcm.gob.pe',
    '12345678',
    'Administrador',
    'Sistema',
    'PCM',
    '$2a$11$vqE0rJ8bVvWYZYqk6SXxR.gKbAOXjnVe6.4t9LbKNnYGmhQGbVV6a',
    1,
    true
) ON CONFLICT (email) DO NOTHING;

SELECT 'Tablas usuarios y entidades creadas exitosamente' AS status;
