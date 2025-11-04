-- =====================================================
-- Script de Migración: Tablas de Catálogo
-- Fecha: 4 de noviembre de 2025
-- Descripción: Crea las tablas nivel_gobierno y sector
-- =====================================================

-- Crear tabla nivel_gobierno
CREATE TABLE IF NOT EXISTS nivel_gobierno (
    nivel_gobierno_id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(200),
    activo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos en nivel_gobierno
INSERT INTO nivel_gobierno (nivel_gobierno_id, nombre, descripcion, activo, created_at)
VALUES 
    (1, 'Nacional', 'Gobierno Nacional', true, CURRENT_TIMESTAMP),
    (2, 'Regional', 'Gobierno Regional', true, CURRENT_TIMESTAMP),
    (3, 'Local', 'Gobierno Local', true, CURRENT_TIMESTAMP)
ON CONFLICT (nivel_gobierno_id) DO NOTHING;

-- Crear tabla sector
CREATE TABLE IF NOT EXISTS sector (
    sector_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(200),
    activo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos en sector
INSERT INTO sector (sector_id, nombre, descripcion, activo, created_at)
VALUES 
    (1, 'Presidencia del Consejo de Ministros', 'PCM', true, CURRENT_TIMESTAMP),
    (2, 'Educación', 'MINEDU', true, CURRENT_TIMESTAMP),
    (3, 'Salud', 'MINSA', true, CURRENT_TIMESTAMP),
    (4, 'Economía y Finanzas', 'MEF', true, CURRENT_TIMESTAMP),
    (5, 'Interior', 'MININTER', true, CURRENT_TIMESTAMP),
    (6, 'Defensa', 'MINDEF', true, CURRENT_TIMESTAMP),
    (7, 'Justicia y Derechos Humanos', 'MINJUSDH', true, CURRENT_TIMESTAMP),
    (8, 'Relaciones Exteriores', 'MRE', true, CURRENT_TIMESTAMP),
    (9, 'Trabajo y Promoción del Empleo', 'MTPE', true, CURRENT_TIMESTAMP),
    (10, 'Agricultura y Riego', 'MIDAGRI', true, CURRENT_TIMESTAMP),
    (11, 'Producción', 'PRODUCE', true, CURRENT_TIMESTAMP),
    (12, 'Comercio Exterior y Turismo', 'MINCETUR', true, CURRENT_TIMESTAMP),
    (13, 'Energía y Minas', 'MINEM', true, CURRENT_TIMESTAMP),
    (14, 'Transportes y Comunicaciones', 'MTC', true, CURRENT_TIMESTAMP),
    (15, 'Vivienda, Construcción y Saneamiento', 'MVCS', true, CURRENT_TIMESTAMP),
    (16, 'Ambiente', 'MINAM', true, CURRENT_TIMESTAMP),
    (17, 'Mujer y Poblaciones Vulnerables', 'MIMP', true, CURRENT_TIMESTAMP),
    (18, 'Desarrollo e Inclusión Social', 'MIDIS', true, CURRENT_TIMESTAMP),
    (19, 'Cultura', 'MINCU', true, CURRENT_TIMESTAMP),
    (20, 'Desarrollo Agrario y Riego', 'MIDAGRI', true, CURRENT_TIMESTAMP)
ON CONFLICT (sector_id) DO NOTHING;

-- Agregar foreign keys a la tabla entidades
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_entidades_nivel_gobierno' 
        AND table_name = 'entidades'
    ) THEN
        ALTER TABLE entidades 
            ADD CONSTRAINT fk_entidades_nivel_gobierno 
            FOREIGN KEY (nivel_gobierno_id) REFERENCES nivel_gobierno(nivel_gobierno_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_entidades_sector' 
        AND table_name = 'entidades'
    ) THEN
        ALTER TABLE entidades 
            ADD CONSTRAINT fk_entidades_sector 
            FOREIGN KEY (sector_id) REFERENCES sector(sector_id);
    END IF;
END $$;

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_nivel_gobierno_nombre ON nivel_gobierno(nombre);
CREATE INDEX IF NOT EXISTS idx_sector_nombre ON sector(nombre);

-- Comentarios
COMMENT ON TABLE nivel_gobierno IS 'Catálogo de niveles de gobierno (Nacional, Regional, Local)';
COMMENT ON TABLE sector IS 'Catálogo de sectores del gobierno peruano';
