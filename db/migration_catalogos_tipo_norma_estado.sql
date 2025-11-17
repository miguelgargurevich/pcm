-- ====================================
-- MIGRATION: Crear tablas tipo_norma y estado_compromiso
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

-- Índice para búsquedas por nombre
CREATE INDEX IF NOT EXISTS idx_tipo_norma_nombre ON tipo_norma(nombre);

-- Índice para filtrar activos
CREATE INDEX IF NOT EXISTS idx_tipo_norma_activo ON tipo_norma(activo);

-- Insertar datos iniciales
INSERT INTO tipo_norma (tipo_norma_id, nombre, descripcion, activo) VALUES
(1, 'Ley', 'Norma con rango de Ley', true),
(2, 'Decreto Supremo', 'Norma del Poder Ejecutivo', true),
(3, 'Resolución Ministerial', 'Norma de nivel ministerial', true),
(4, 'Resolución Directoral', 'Norma de nivel directoral', true),
(5, 'Ordenanza', 'Norma de gobierno local o regional', true),
(6, 'Decreto Legislativo', 'Norma con rango de Ley emitida por el Ejecutivo', true),
(7, 'Resolución Jefatural', 'Norma de nivel jefatural', true)
ON CONFLICT (nombre) DO NOTHING;

-- Resetear secuencia
SELECT setval('tipo_norma_tipo_norma_id_seq', (SELECT MAX(tipo_norma_id) FROM tipo_norma));

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

-- Índice para búsquedas por nombre
CREATE INDEX IF NOT EXISTS idx_estado_compromiso_nombre ON estado_compromiso(nombre);

-- Índice para filtrar activos
CREATE INDEX IF NOT EXISTS idx_estado_compromiso_activo ON estado_compromiso(activo);

-- Insertar datos iniciales
INSERT INTO estado_compromiso (estado_id, nombre, descripcion, activo) VALUES
(1, 'pendiente', 'Compromiso pendiente de ejecución', true),
(2, 'en_proceso', 'Compromiso en proceso de ejecución', true),
(3, 'completado', 'Compromiso completado exitosamente', true),
(4, 'cancelado', 'Compromiso cancelado', true)
ON CONFLICT (nombre) DO NOTHING;

-- Resetear secuencia
SELECT setval('estado_compromiso_estado_id_seq', (SELECT MAX(estado_id) FROM estado_compromiso));

-- =====================================
-- 3. ACTUALIZAR TABLA marco_normativo
-- =====================================
-- Agregar columna tipo_norma_id si no existe (puede que ya esté como integer)
DO $$
BEGIN
    -- Verificar si la columna existe y su tipo
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
        ) THEN
            ALTER TABLE marco_normativo
            ADD CONSTRAINT fk_marco_normativo_tipo_norma
            FOREIGN KEY (tipo_norma_id) REFERENCES tipo_norma(tipo_norma_id);
            
            RAISE NOTICE 'Foreign key fk_marco_normativo_tipo_norma agregada';
        END IF;
    ELSE
        RAISE NOTICE 'Columna tipo_norma_id no existe o tiene tipo diferente en marco_normativo';
    END IF;
END $$;

-- =====================================
-- 4. ACTUALIZAR TABLA compromiso_gobierno_digital
-- =====================================
-- Cambiar estado de VARCHAR a FK hacia estado_compromiso
DO $$
BEGIN
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
        
        -- Agregar foreign key
        ALTER TABLE compromiso_gobierno_digital
        ADD CONSTRAINT fk_compromiso_estado
        FOREIGN KEY (estado) REFERENCES estado_compromiso(estado_id);
        
        RAISE NOTICE 'Columna estado migrada a FK en compromiso_gobierno_digital';
    ELSE
        RAISE NOTICE 'Columna estado ya es INTEGER o no existe';
    END IF;
END $$;

-- =====================================
-- 5. ACTUALIZAR TABLA criterio_evaluacion
-- =====================================
DO $$
BEGIN
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
        
        -- Agregar foreign key
        ALTER TABLE criterio_evaluacion
        ADD CONSTRAINT fk_criterio_estado
        FOREIGN KEY (estado) REFERENCES estado_compromiso(estado_id);
        
        RAISE NOTICE 'Columna estado migrada a FK en criterio_evaluacion';
    ELSE
        RAISE NOTICE 'Columna estado ya es INTEGER o no existe';
    END IF;
END $$;

-- =====================================
-- 6. VERIFICACIÓN
-- =====================================
SELECT '=== VERIFICACIÓN DE TABLAS CREADAS ===' as paso;

SELECT 
    'tipo_norma' as tabla,
    COUNT(*) as registros
FROM tipo_norma
UNION ALL
SELECT 
    'estado_compromiso' as tabla,
    COUNT(*) as registros
FROM estado_compromiso;

SELECT '=== DATOS EN tipo_norma ===' as detalle;
SELECT tipo_norma_id, nombre, descripcion, activo 
FROM tipo_norma 
ORDER BY tipo_norma_id;

SELECT '=== DATOS EN estado_compromiso ===' as detalle;
SELECT estado_id, nombre, descripcion, activo 
FROM estado_compromiso 
ORDER BY estado_id;

SELECT '✓✓✓ MIGRATION COMPLETADA ✓✓✓' as resultado;
