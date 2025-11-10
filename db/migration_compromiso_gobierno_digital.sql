-- Migración: Crear tablas para Compromiso Gobierno Digital
-- Fecha: 2025-11-09
-- Descripción: Crea las tablas para gestionar compromisos de gobierno digital con sus normativas y criterios de evaluación

-- Tabla principal: compromiso_gobierno_digital
CREATE TABLE IF NOT EXISTS compromiso_gobierno_digital (
    compromiso_id SERIAL PRIMARY KEY,
    nombre_compromiso VARCHAR(500) NOT NULL,
    descripcion TEXT,
    alcances TEXT NOT NULL, -- Almacenado como valores separados por comas
    fecha_inicio TIMESTAMP NOT NULL,
    fecha_fin TIMESTAMP NOT NULL,
    estado VARCHAR(50) NOT NULL DEFAULT 'pendiente', -- pendiente, en_proceso, completado, vencido
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Índices para compromiso_gobierno_digital
CREATE INDEX IF NOT EXISTS idx_compromiso_gobierno_digital_estado ON compromiso_gobierno_digital(estado);
CREATE INDEX IF NOT EXISTS idx_compromiso_gobierno_digital_activo ON compromiso_gobierno_digital(activo);
CREATE INDEX IF NOT EXISTS idx_compromiso_gobierno_digital_fechas ON compromiso_gobierno_digital(fecha_inicio, fecha_fin);

-- Tabla de relación: compromiso_normativa
-- Une compromisos con marcos normativos
CREATE TABLE IF NOT EXISTS compromiso_normativa (
    compromiso_normativa_id SERIAL PRIMARY KEY,
    compromiso_id INTEGER NOT NULL,
    norma_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_compromiso_normativa_compromiso 
        FOREIGN KEY (compromiso_id) 
        REFERENCES compromiso_gobierno_digital(compromiso_id) 
        ON DELETE CASCADE,
    
    CONSTRAINT fk_compromiso_normativa_norma 
        FOREIGN KEY (norma_id) 
        REFERENCES marco_normativo(norma_id) 
        ON DELETE RESTRICT,
    
    -- Evitar duplicados
    CONSTRAINT uq_compromiso_norma 
        UNIQUE(compromiso_id, norma_id)
);

-- Índices para compromiso_normativa
CREATE INDEX IF NOT EXISTS idx_compromiso_normativa_compromiso ON compromiso_normativa(compromiso_id);
CREATE INDEX IF NOT EXISTS idx_compromiso_normativa_norma ON compromiso_normativa(norma_id);

-- Tabla: criterio_evaluacion
-- Criterios de evaluación asociados a cada compromiso
CREATE TABLE IF NOT EXISTS criterio_evaluacion (
    criterio_evaluacion_id SERIAL PRIMARY KEY,
    compromiso_id INTEGER NOT NULL,
    descripcion TEXT NOT NULL,
    estado VARCHAR(50) NOT NULL DEFAULT 'pendiente', -- pendiente, en_proceso, completado, vencido
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    
    CONSTRAINT fk_criterio_evaluacion_compromiso 
        FOREIGN KEY (compromiso_id) 
        REFERENCES compromiso_gobierno_digital(compromiso_id) 
        ON DELETE CASCADE
);

-- Índices para criterio_evaluacion
CREATE INDEX IF NOT EXISTS idx_criterio_evaluacion_compromiso ON criterio_evaluacion(compromiso_id);
CREATE INDEX IF NOT EXISTS idx_criterio_evaluacion_estado ON criterio_evaluacion(estado);
CREATE INDEX IF NOT EXISTS idx_criterio_evaluacion_activo ON criterio_evaluacion(activo);

-- Comentarios para documentación
COMMENT ON TABLE compromiso_gobierno_digital IS 'Tabla principal para gestionar compromisos de gobierno digital';
COMMENT ON COLUMN compromiso_gobierno_digital.alcances IS 'Alcances del compromiso almacenados como valores separados por comas (ej: "Nacional,Regional,Local")';
COMMENT ON COLUMN compromiso_gobierno_digital.estado IS 'Estado del compromiso: pendiente, en_proceso, completado, vencido';

COMMENT ON TABLE compromiso_normativa IS 'Tabla de relación entre compromisos y marcos normativos';
COMMENT ON TABLE criterio_evaluacion IS 'Criterios de evaluación asociados a cada compromiso de gobierno digital';

-- Verificación
SELECT 'Tablas creadas exitosamente:' as mensaje;
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('compromiso_gobierno_digital', 'compromiso_normativa', 'criterio_evaluacion');
