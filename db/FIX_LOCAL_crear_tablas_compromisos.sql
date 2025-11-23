-- =============================================
-- SCRIPT: Crear tablas de Compromisos de Gobierno Digital
-- DESCRIPCIÓN: Crea todas las tablas necesarias para el módulo de Compromisos
-- FECHA: 2025-11-22
-- =============================================

BEGIN;

-- 1. Crear tabla principal: compromiso_gobierno_digital
CREATE TABLE IF NOT EXISTS compromiso_gobierno_digital (
    compromiso_id SERIAL PRIMARY KEY,
    nombre_compromiso VARCHAR(200) NOT NULL,
    descripcion TEXT,
    alcances VARCHAR(500) NOT NULL DEFAULT '',
    fecha_inicio TIMESTAMP NOT NULL,
    fecha_fin TIMESTAMP NOT NULL,
    estado INTEGER NOT NULL DEFAULT 1,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Índices para compromiso_gobierno_digital
CREATE INDEX IF NOT EXISTS idx_compromiso_gobierno_digital_estado ON compromiso_gobierno_digital(estado);
CREATE INDEX IF NOT EXISTS idx_compromiso_gobierno_digital_activo ON compromiso_gobierno_digital(activo);
CREATE INDEX IF NOT EXISTS idx_compromiso_gobierno_digital_fechas ON compromiso_gobierno_digital(fecha_inicio, fecha_fin);

-- 2. Crear tabla: compromiso_normativa
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
        ON DELETE RESTRICT
);

-- Índices para compromiso_normativa
CREATE INDEX IF NOT EXISTS idx_compromiso_normativa_compromiso ON compromiso_normativa(compromiso_id);
CREATE INDEX IF NOT EXISTS idx_compromiso_normativa_norma ON compromiso_normativa(norma_id);

-- 3. Crear tabla: criterio_evaluacion
CREATE TABLE IF NOT EXISTS criterio_evaluacion (
    criterio_evaluacion_id SERIAL PRIMARY KEY,
    compromiso_id INTEGER NOT NULL,
    descripcion TEXT NOT NULL,
    estado INTEGER NOT NULL DEFAULT 1,
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

-- 4. Crear tabla: alcance_compromisos
CREATE TABLE IF NOT EXISTS alcance_compromisos (
    alcance_compromiso_id SERIAL PRIMARY KEY,
    compromiso_id INTEGER NOT NULL,
    clasificacion_id INTEGER NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_alcance_compromiso_compromiso
        FOREIGN KEY (compromiso_id) 
        REFERENCES compromiso_gobierno_digital(compromiso_id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_alcance_compromiso_clasificacion
        FOREIGN KEY (clasificacion_id) 
        REFERENCES clasificacion(clasificacion_id) 
        ON DELETE RESTRICT
);

-- Índices para alcance_compromisos
CREATE INDEX IF NOT EXISTS idx_alcance_compromisos_compromiso ON alcance_compromisos(compromiso_id);
CREATE INDEX IF NOT EXISTS idx_alcance_compromisos_clasificacion ON alcance_compromisos(clasificacion_id);
CREATE INDEX IF NOT EXISTS idx_alcance_compromisos_activo ON alcance_compromisos(activo);

-- Evitar duplicados de alcance para el mismo compromiso y clasificación
CREATE UNIQUE INDEX IF NOT EXISTS idx_alcance_compromisos_unique 
    ON alcance_compromisos(compromiso_id, clasificacion_id);

-- Comentarios
COMMENT ON TABLE compromiso_gobierno_digital IS 'Tabla principal para gestionar compromisos de gobierno digital';
COMMENT ON COLUMN compromiso_gobierno_digital.alcances IS 'Alcances del compromiso almacenados como valores separados por comas (ej: "Nacional,Regional,Local")';
COMMENT ON COLUMN compromiso_gobierno_digital.estado IS 'Estado del compromiso: FK a estado_compromiso';

COMMENT ON TABLE compromiso_normativa IS 'Relación muchos a muchos entre compromisos y normativas del marco normativo';
COMMENT ON TABLE criterio_evaluacion IS 'Criterios de evaluación asociados a cada compromiso';
COMMENT ON TABLE alcance_compromisos IS 'Alcances de los compromisos por clasificación de entidad';

-- Verificación
DO $$
BEGIN
    RAISE NOTICE '✅ Verificando tablas creadas...';
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'compromiso_gobierno_digital') THEN
        RAISE NOTICE '✅ Tabla compromiso_gobierno_digital creada correctamente';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'compromiso_normativa') THEN
        RAISE NOTICE '✅ Tabla compromiso_normativa creada correctamente';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'criterio_evaluacion') THEN
        RAISE NOTICE '✅ Tabla criterio_evaluacion creada correctamente';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'alcance_compromisos') THEN
        RAISE NOTICE '✅ Tabla alcance_compromisos creada correctamente';
    END IF;
END $$;

COMMIT;

-- Mostrar resumen
SELECT 
    tablename as tabla,
    CASE 
        WHEN tablename = 'compromiso_gobierno_digital' THEN '✅ Tabla principal de compromisos'
        WHEN tablename = 'compromiso_normativa' THEN '✅ Relación con marco normativo'
        WHEN tablename = 'criterio_evaluacion' THEN '✅ Criterios de evaluación'
        WHEN tablename = 'alcance_compromisos' THEN '✅ Alcances por clasificación'
    END as descripcion
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('compromiso_gobierno_digital', 'compromiso_normativa', 'criterio_evaluacion', 'alcance_compromisos')
ORDER BY tablename;
