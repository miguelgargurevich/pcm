-- ====================================
-- RECREAR TABLA marco_normativo COMPLETA
-- ====================================

-- PASO 1: Ver datos actuales (IMPORTANTE: respaldar si hay datos)
SELECT '=== DATOS ACTUALES (RESPALDAR SI ES NECESARIO) ===' as advertencia;
SELECT * FROM marco_normativo LIMIT 5;

SELECT 'Total registros:' as info, COUNT(*) as cantidad FROM marco_normativo;

-- PASO 2: Eliminar tabla existente
DROP TABLE IF EXISTS marco_normativo CASCADE;

-- PASO 3: Crear tabla marco_normativo con TODAS las columnas
CREATE TABLE marco_normativo (
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PASO 4: Crear índices
CREATE INDEX IF NOT EXISTS idx_marco_normativo_tipo_norma ON marco_normativo(tipo_norma_id);
CREATE INDEX IF NOT EXISTS idx_marco_normativo_nivel_gobierno ON marco_normativo(nivel_gobierno_id);
CREATE INDEX IF NOT EXISTS idx_marco_normativo_sector ON marco_normativo(sector_id);
CREATE INDEX IF NOT EXISTS idx_marco_normativo_activo ON marco_normativo(activo);
CREATE INDEX IF NOT EXISTS idx_marco_normativo_fecha_pub ON marco_normativo(fecha_publicacion);

-- PASO 5: Insertar datos de prueba (opcional)
INSERT INTO marco_normativo (
    tipo_norma_id, numero, nombre_norma, nivel_gobierno_id, sector_id, 
    fecha_publicacion, descripcion, url, activo
) VALUES 
(1, 'LEY-001-2024', 'Ley de Prueba 1', 1, 1, '2024-01-15', 'Descripción de prueba 1', 'https://ejemplo.com/ley1', true),
(2, 'DS-002-2024', 'Decreto Supremo de Prueba', 2, 2, '2024-02-20', 'Descripción de prueba 2', 'https://ejemplo.com/ds2', true),
(3, 'RM-003-2024', 'Resolución Ministerial de Prueba', 3, 3, '2024-03-10', 'Descripción de prueba 3', 'https://ejemplo.com/rm3', true);

-- PASO 6: Verificar estructura final
SELECT '=== ESTRUCTURA FINAL DE marco_normativo ===' as paso;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'marco_normativo'
ORDER BY ordinal_position;

-- PASO 7: Verificar datos insertados
SELECT '=== DATOS DE PRUEBA INSERTADOS ===' as paso;
SELECT norma_id, numero, nombre_norma, fecha_publicacion, activo, created_at
FROM marco_normativo
ORDER BY norma_id;

-- PASO 8: Verificar índices
SELECT '=== ÍNDICES CREADOS ===' as paso;
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'marco_normativo'
ORDER BY indexname;

-- PASO 9: Verificación de columnas críticas
SELECT '=== VERIFICACIÓN DE TODAS LAS COLUMNAS ===' as verificacion;

SELECT column_name, 
       CASE WHEN column_name IN ('norma_id', 'tipo_norma_id', 'numero', 'nombre_norma', 
                                  'nivel_gobierno_id', 'sector_id', 'fecha_publicacion', 
                                  'descripcion', 'url', 'activo', 'created_at', 'updated_at')
       THEN '✓ OK' ELSE '⚠ EXTRA' END as estado
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'marco_normativo'
ORDER BY ordinal_position;

SELECT '✓✓✓ TABLA marco_normativo RECREADA COMPLETAMENTE ✓✓✓' as resultado;
