-- Migración: Crear tabla alcance_compromisos para relación muchos-a-muchos
-- Fecha: 2025-11-21
-- Descripción: Reemplaza el campo texto alcances por una tabla intermedia con clasificacion

-- Crear tabla alcance_compromisos
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
        ON DELETE RESTRICT,
    
    -- Evitar duplicados
    CONSTRAINT uq_compromiso_clasificacion 
        UNIQUE(compromiso_id, clasificacion_id)
);

-- Índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_alcance_compromiso_compromiso ON alcance_compromisos(compromiso_id);
CREATE INDEX IF NOT EXISTS idx_alcance_compromiso_clasificacion ON alcance_compromisos(clasificacion_id);
CREATE INDEX IF NOT EXISTS idx_alcance_compromiso_activo ON alcance_compromisos(activo);

-- Migrar datos existentes del campo texto alcances a la nueva tabla
-- Esto asume que los alcances están guardados como "Nacional,Regional,Local"
DO $$
DECLARE
    compromiso_record RECORD;
    alcance_nombre TEXT;
    clasificacion_record RECORD;
BEGIN
    -- Iterar sobre cada compromiso que tiene alcances
    FOR compromiso_record IN 
        SELECT compromiso_id, alcances 
        FROM compromiso_gobierno_digital 
        WHERE alcances IS NOT NULL AND alcances != ''
    LOOP
        -- Separar los alcances por coma y procesar cada uno
        FOREACH alcance_nombre IN ARRAY string_to_array(compromiso_record.alcances, ',')
        LOOP
            -- Limpiar espacios en blanco
            alcance_nombre := TRIM(alcance_nombre);
            
            -- Buscar la clasificación correspondiente
            SELECT clasificacion_id INTO clasificacion_record
            FROM clasificacion
            WHERE LOWER(nombre) = LOWER(alcance_nombre)
            LIMIT 1;
            
            -- Si se encontró la clasificación, insertar en alcance_compromisos
            IF FOUND THEN
                INSERT INTO alcance_compromisos (compromiso_id, clasificacion_id, activo, created_at)
                VALUES (compromiso_record.compromiso_id, clasificacion_record.clasificacion_id, TRUE, NOW())
                ON CONFLICT (compromiso_id, clasificacion_id) DO NOTHING;
            END IF;
        END LOOP;
    END LOOP;
END $$;

-- Comentarios para documentación
COMMENT ON TABLE alcance_compromisos IS 'Tabla intermedia para relación muchos-a-muchos entre compromisos y clasificaciones (alcances)';
COMMENT ON COLUMN alcance_compromisos.compromiso_id IS 'ID del compromiso de gobierno digital';
COMMENT ON COLUMN alcance_compromisos.clasificacion_id IS 'ID de la clasificación (Nacional, Regional, Local, etc.)';

-- Verificación
SELECT 'Tabla alcance_compromisos creada exitosamente' as mensaje;
SELECT COUNT(*) as total_alcances_migrados FROM alcance_compromisos;
