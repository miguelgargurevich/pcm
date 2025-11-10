-- ====================================
-- CREAR TABLA marco_normativo Y AGREGAR COLUMNA activo
-- ====================================

-- PASO 1: Crear la tabla marco_normativo si no existe
CREATE TABLE IF NOT EXISTS marco_normativo (
    norma_id SERIAL PRIMARY KEY,
    tipo_norma_id INTEGER NOT NULL,
    numero VARCHAR(20) NOT NULL,
    nombre_norma VARCHAR(150) NOT NULL,
    nivel_gobierno_id INTEGER NOT NULL,
    sector_id INTEGER NOT NULL,
    fecha_publicacion DATE NOT NULL,
    descripcion TEXT,
    url VARCHAR(500),
    activo BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PASO 2: Agregar columna activo si la tabla ya existía y no la tiene
DO $$
DECLARE
    tabla_existe BOOLEAN;
BEGIN
    -- Verificar si la tabla marco_normativo existe
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'marco_normativo'
    ) INTO tabla_existe;
    
    IF tabla_existe THEN
        RAISE NOTICE '✓ La tabla marco_normativo EXISTE';
        
        -- Verificar si ya tiene la columna activo
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'marco_normativo' 
            AND column_name = 'activo'
        ) THEN
            -- Agregar la columna con valor por defecto
            ALTER TABLE marco_normativo 
            ADD COLUMN activo BOOLEAN DEFAULT TRUE NOT NULL;
            
            -- Actualizar registros existentes para asegurar que tengan valor TRUE
            UPDATE marco_normativo 
            SET activo = TRUE 
            WHERE activo IS NULL;
            
            RAISE NOTICE '✓ Columna activo agregada exitosamente a marco_normativo';
        ELSE
            RAISE NOTICE '⚠ La columna activo ya existe en marco_normativo';
        END IF;
    ELSE
        RAISE NOTICE '✗ ERROR: La tabla marco_normativo NO EXISTE en Supabase';
        RAISE NOTICE 'Verifica el nombre de la tabla en los resultados del PASO 1';
    END IF;
END $$;

-- PASO 3: Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_marco_normativo_tipo_norma ON marco_normativo(tipo_norma_id);
CREATE INDEX IF NOT EXISTS idx_marco_normativo_nivel_gobierno ON marco_normativo(nivel_gobierno_id);
CREATE INDEX IF NOT EXISTS idx_marco_normativo_sector ON marco_normativo(sector_id);
CREATE INDEX IF NOT EXISTS idx_marco_normativo_activo ON marco_normativo(activo);
CREATE INDEX IF NOT EXISTS idx_marco_normativo_fecha_pub ON marco_normativo(fecha_publicacion);

-- PASO 4: Verificar el resultado final
SELECT 
    '=== ✓ TABLA marco_normativo CREADA/ACTUALIZADA ===' as resultado;
    
SELECT 
    '=== ESTRUCTURA DE LA TABLA ===' as info;
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns
WHERE table_name = 'marco_normativo'
ORDER BY ordinal_position;

SELECT 
    '=== ÍNDICES CREADOS ===' as indices;
SELECT 
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'marco_normativo'
ORDER BY indexname;
