-- ====================================
-- MIGRATION PRODUCCIÓN SUPABASE: Crear tablas tipo_norma y estado_compromiso
-- Ejecutar en: Supabase SQL Editor
-- ====================================

-- =====================================
-- 1. CREAR TABLA tipo_norma
-- =====================================
CREATE TABLE IF NOT EXISTS tipo_norma (
    tipo_norma_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(200),
    activo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para tipo_norma
CREATE INDEX IF NOT EXISTS idx_tipo_norma_nombre ON tipo_norma(nombre);
CREATE INDEX IF NOT EXISTS idx_tipo_norma_activo ON tipo_norma(activo);

-- Insertar datos iniciales en tipo_norma
INSERT INTO tipo_norma (tipo_norma_id, nombre, descripcion, activo) VALUES
(1, 'Ley', 'Norma con rango de Ley', true),
(2, 'Decreto Supremo', 'Norma del Poder Ejecutivo', true),
(3, 'Resolución Ministerial', 'Norma de nivel ministerial', true),
(4, 'Resolución Directoral', 'Norma de nivel directoral', true),
(5, 'Ordenanza', 'Norma de gobierno local o regional', true),
(6, 'Decreto Legislativo', 'Norma con rango de Ley emitida por el Ejecutivo', true),
(7, 'Resolución Jefatural', 'Norma de nivel jefatural', true)
ON CONFLICT (nombre) DO NOTHING;

-- Resetear secuencia tipo_norma
SELECT setval('tipo_norma_tipo_norma_id_seq', (SELECT COALESCE(MAX(tipo_norma_id), 1) FROM tipo_norma), true);

-- =====================================
-- 2. CREAR TABLA estado_compromiso
-- =====================================
CREATE TABLE IF NOT EXISTS estado_compromiso (
    estado_id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(200),
    activo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para estado_compromiso
CREATE INDEX IF NOT EXISTS idx_estado_compromiso_nombre ON estado_compromiso(nombre);
CREATE INDEX IF NOT EXISTS idx_estado_compromiso_activo ON estado_compromiso(activo);

-- Insertar datos iniciales en estado_compromiso
INSERT INTO estado_compromiso (estado_id, nombre, descripcion, activo) VALUES
(1, 'pendiente', 'Compromiso pendiente de ejecución', true),
(2, 'en_proceso', 'Compromiso en proceso de ejecución', true),
(3, 'completado', 'Compromiso completado exitosamente', true),
(4, 'cancelado', 'Compromiso cancelado', true)
ON CONFLICT (nombre) DO NOTHING;

-- Resetear secuencia estado_compromiso
SELECT setval('estado_compromiso_estado_id_seq', (SELECT COALESCE(MAX(estado_id), 1) FROM estado_compromiso), true);

-- =====================================
-- 3. ACTUALIZAR TABLA marco_normativo (si existe)
-- =====================================
DO $$
BEGIN
    -- Verificar si la tabla marco_normativo existe
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'marco_normativo') THEN
        -- Verificar si la columna tipo_norma_id existe y su tipo
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'marco_normativo' 
            AND column_name = 'tipo_norma_id'
            AND data_type = 'integer'
        ) THEN
            -- Agregar foreign key si no existe
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.table_constraints 
                WHERE constraint_name = 'fk_marco_normativo_tipo_norma'
                AND table_name = 'marco_normativo'
            ) THEN
                ALTER TABLE marco_normativo
                ADD CONSTRAINT fk_marco_normativo_tipo_norma
                FOREIGN KEY (tipo_norma_id) REFERENCES tipo_norma(tipo_norma_id);
                
                RAISE NOTICE 'Foreign key fk_marco_normativo_tipo_norma agregada';
            ELSE
                RAISE NOTICE 'Foreign key fk_marco_normativo_tipo_norma ya existe';
            END IF;
        ELSE
            RAISE NOTICE 'Columna tipo_norma_id no existe o tiene tipo diferente en marco_normativo';
        END IF;
    ELSE
        RAISE NOTICE 'Tabla marco_normativo no existe';
    END IF;
END $$;

-- =====================================
-- 4. ACTUALIZAR TABLA compromiso_gobierno_digital (si existe)
-- =====================================
DO $$
BEGIN
    -- Verificar si la tabla compromiso_gobierno_digital existe
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'compromiso_gobierno_digital') THEN
        -- Verificar si la columna estado existe como VARCHAR
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'compromiso_gobierno_digital' 
            AND column_name = 'estado'
            AND data_type = 'character varying'
        ) THEN
            -- Agregar nueva columna temporal
            ALTER TABLE compromiso_gobierno_digital
            ADD COLUMN IF NOT EXISTS estado_id INTEGER;
            
            -- Migrar datos existentes
            UPDATE compromiso_gobierno_digital
            SET estado_id = CASE 
                WHEN estado = 'pendiente' THEN 1
                WHEN estado = 'en_proceso' THEN 2
                WHEN estado = 'completado' THEN 3
                WHEN estado = 'cancelado' THEN 4
                ELSE 1
            END
            WHERE estado_id IS NULL;
            
            -- Eliminar columna antigua
            ALTER TABLE compromiso_gobierno_digital DROP COLUMN IF EXISTS estado;
            
            -- Renombrar columna nueva
            ALTER TABLE compromiso_gobierno_digital RENAME COLUMN estado_id TO estado;
            
            -- Agregar NOT NULL y default
            ALTER TABLE compromiso_gobierno_digital 
            ALTER COLUMN estado SET NOT NULL,
            ALTER COLUMN estado SET DEFAULT 1;
            
            -- Agregar foreign key si no existe
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.table_constraints 
                WHERE constraint_name = 'fk_compromiso_estado'
                AND table_name = 'compromiso_gobierno_digital'
            ) THEN
                ALTER TABLE compromiso_gobierno_digital
                ADD CONSTRAINT fk_compromiso_estado
                FOREIGN KEY (estado) REFERENCES estado_compromiso(estado_id);
                
                RAISE NOTICE 'Columna estado migrada a FK en compromiso_gobierno_digital';
            END IF;
        ELSE
            RAISE NOTICE 'Columna estado ya es INTEGER o no existe en compromiso_gobierno_digital';
        END IF;
    ELSE
        RAISE NOTICE 'Tabla compromiso_gobierno_digital no existe';
    END IF;
END $$;

-- =====================================
-- 5. ACTUALIZAR TABLA criterio_evaluacion (si existe)
-- =====================================
DO $$
BEGIN
    -- Verificar si la tabla criterio_evaluacion existe
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'criterio_evaluacion') THEN
        -- Verificar si la columna estado existe como VARCHAR
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'criterio_evaluacion' 
            AND column_name = 'estado'
            AND data_type = 'character varying'
        ) THEN
            -- Agregar nueva columna temporal
            ALTER TABLE criterio_evaluacion
            ADD COLUMN IF NOT EXISTS estado_id INTEGER;
            
            -- Migrar datos existentes
            UPDATE criterio_evaluacion
            SET estado_id = CASE 
                WHEN estado = 'pendiente' THEN 1
                WHEN estado = 'en_proceso' THEN 2
                WHEN estado = 'completado' THEN 3
                WHEN estado = 'cancelado' THEN 4
                ELSE 1
            END
            WHERE estado_id IS NULL;
            
            -- Eliminar columna antigua
            ALTER TABLE criterio_evaluacion DROP COLUMN IF EXISTS estado;
            
            -- Renombrar columna nueva
            ALTER TABLE criterio_evaluacion RENAME COLUMN estado_id TO estado;
            
            -- Agregar NOT NULL y default
            ALTER TABLE criterio_evaluacion 
            ALTER COLUMN estado SET NOT NULL,
            ALTER COLUMN estado SET DEFAULT 1;
            
            -- Agregar foreign key si no existe
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.table_constraints 
                WHERE constraint_name = 'fk_criterio_estado'
                AND table_name = 'criterio_evaluacion'
            ) THEN
                ALTER TABLE criterio_evaluacion
                ADD CONSTRAINT fk_criterio_estado
                FOREIGN KEY (estado) REFERENCES estado_compromiso(estado_id);
                
                RAISE NOTICE 'Columna estado migrada a FK en criterio_evaluacion';
            END IF;
        ELSE
            RAISE NOTICE 'Columna estado ya es INTEGER o no existe en criterio_evaluacion';
        END IF;
    ELSE
        RAISE NOTICE 'Tabla criterio_evaluacion no existe';
    END IF;
END $$;

-- =====================================
-- 6. VERIFICACIÓN FINAL
-- =====================================
DO $$
DECLARE
    tipo_norma_count INTEGER;
    estado_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO tipo_norma_count FROM tipo_norma;
    SELECT COUNT(*) INTO estado_count FROM estado_compromiso;
    
    RAISE NOTICE '=== VERIFICACIÓN COMPLETADA ===';
    RAISE NOTICE 'Registros en tipo_norma: %', tipo_norma_count;
    RAISE NOTICE 'Registros en estado_compromiso: %', estado_count;
    RAISE NOTICE '=== MIGRATION EXITOSA ===';
END $$;

-- =====================================
-- 7. LIMPIAR Y AGREGAR ALCANCES A tabla_tablas
-- =====================================
DO $$
BEGIN
    -- Verificar si tabla_tablas existe
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tabla_tablas') THEN
        -- Limpiar datos duplicados de catálogos que tienen tablas dedicadas
        DELETE FROM tabla_tablas 
        WHERE nombre_tabla IN ('TIPO_NORMA', 'NIVEL_GOBIERNO', 'SECTOR');
        
        RAISE NOTICE 'tabla_tablas limpiada (eliminados TIPO_NORMA, NIVEL_GOBIERNO, SECTOR)';
        
        -- Insertar ALCANCES (única entidad que debe estar en tabla_tablas)
        INSERT INTO tabla_tablas (nombre_tabla, columna_id, descripcion, valor, orden, activo) VALUES
        ('ALCANCE', '1', 'Nacional', 'nacional', 1, true),
        ('ALCANCE', '2', 'Regional', 'regional', 2, true),
        ('ALCANCE', '3', 'Local', 'local', 3, true),
        ('ALCANCE', '4', 'Sectorial', 'sectorial', 4, true)
        ON CONFLICT DO NOTHING;
        
        RAISE NOTICE 'ALCANCES insertados en tabla_tablas';
    ELSE
        RAISE NOTICE 'Tabla tabla_tablas no existe, saltando inserción de ALCANCES';
    END IF;
END $$;

-- Mostrar datos insertados
SELECT 'TIPOS DE NORMA:' as tabla, tipo_norma_id as id, nombre, descripcion 
FROM tipo_norma 
ORDER BY tipo_norma_id;

SELECT 'ESTADOS:' as tabla, estado_id as id, nombre, descripcion 
FROM estado_compromiso 
ORDER BY estado_id;

-- Verificar contenido final de tabla_tablas (solo debe tener ALCANCES)
DO $$
DECLARE
    alcance_count INTEGER;
    other_count INTEGER;
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tabla_tablas') THEN
        SELECT COUNT(*) INTO alcance_count 
        FROM tabla_tablas 
        WHERE nombre_tabla = 'ALCANCE';
        
        SELECT COUNT(*) INTO other_count 
        FROM tabla_tablas 
        WHERE nombre_tabla != 'ALCANCE';
        
        RAISE NOTICE '=== VERIFICACIÓN tabla_tablas ===';
        RAISE NOTICE 'Registros ALCANCE: %', alcance_count;
        RAISE NOTICE 'Otros registros (debe ser 0): %', other_count;
        
        IF other_count > 0 THEN
            RAISE WARNING 'Existen registros adicionales en tabla_tablas que deberían eliminarse';
        END IF;
    END IF;
END $$;

-- Mostrar ALCANCES
SELECT 'ALCANCES:' as tabla, tabla_id as id, descripcion as nombre, valor
FROM tabla_tablas
WHERE nombre_tabla = 'ALCANCE'
ORDER BY orden;
