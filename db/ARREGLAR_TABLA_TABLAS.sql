-- ====================================
-- ARREGLAR Y POBLAR tabla_tablas EN SUPABASE
-- ====================================

-- PASO 1: Verificar estructura actual
SELECT '=== 1. ESTRUCTURA ACTUAL DE tabla_tablas ===' as paso;
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'tabla_tablas'
ORDER BY ordinal_position;

-- PASO 2: Agregar columna orden si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'tabla_tablas' 
        AND column_name = 'orden'
    ) THEN
        ALTER TABLE tabla_tablas 
        ADD COLUMN orden SMALLINT DEFAULT 0;
        
        RAISE NOTICE '✓ Columna orden agregada';
    ELSE
        RAISE NOTICE '⚠ Columna orden ya existe';
    END IF;
END $$;

-- PASO 3: Agregar columna activo si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'tabla_tablas' 
        AND column_name = 'activo'
    ) THEN
        ALTER TABLE tabla_tablas 
        ADD COLUMN activo BOOLEAN DEFAULT TRUE NOT NULL;
        
        RAISE NOTICE '✓ Columna activo agregada';
    ELSE
        RAISE NOTICE '⚠ Columna activo ya existe';
    END IF;
END $$;

-- PASO 4: Verificar estructura corregida
SELECT '=== 2. ESTRUCTURA CORREGIDA ===' as paso;
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'tabla_tablas'
ORDER BY ordinal_position;

-- PASO 5: Limpiar datos anteriores
DELETE FROM tabla_tablas WHERE nombre_tabla IN ('TIPO_NORMA', 'NIVEL_GOBIERNO', 'SECTOR');

-- PASO 6: Insertar TIPO_NORMA
INSERT INTO tabla_tablas (nombre_tabla, columna_id, descripcion, valor, orden, activo) VALUES
('TIPO_NORMA', '1', 'Ley', 'Ley', 1, true),
('TIPO_NORMA', '2', 'Decreto Supremo', 'Decreto Supremo', 2, true),
('TIPO_NORMA', '3', 'Resolución Ministerial', 'Resolución Ministerial', 3, true),
('TIPO_NORMA', '4', 'Resolución Directoral', 'Resolución Directoral', 4, true),
('TIPO_NORMA', '5', 'Ordenanza', 'Ordenanza', 5, true),
('TIPO_NORMA', '6', 'Decreto Legislativo', 'Decreto Legislativo', 6, true),
('TIPO_NORMA', '7', 'Resolución Jefatural', 'Resolución Jefatural', 7, true);

-- PASO 7: Insertar NIVEL_GOBIERNO
INSERT INTO tabla_tablas (nombre_tabla, columna_id, descripcion, valor, orden, activo) VALUES
('NIVEL_GOBIERNO', '1', 'Nacional', 'Nacional', 1, true),
('NIVEL_GOBIERNO', '2', 'Regional', 'Regional', 2, true),
('NIVEL_GOBIERNO', '3', 'Local', 'Local', 3, true);

-- PASO 8: Insertar SECTOR
INSERT INTO tabla_tablas (nombre_tabla, columna_id, descripcion, valor, orden, activo) VALUES
('SECTOR', '1', 'Presidencia del Consejo de Ministros', 'PCM', 1, true),
('SECTOR', '2', 'Educación', 'MINEDU', 2, true),
('SECTOR', '3', 'Salud', 'MINSA', 3, true),
('SECTOR', '4', 'Economía y Finanzas', 'MEF', 4, true),
('SECTOR', '5', 'Interior', 'MININTER', 5, true),
('SECTOR', '6', 'Defensa', 'MINDEF', 6, true),
('SECTOR', '7', 'Justicia y Derechos Humanos', 'MINJUSDH', 7, true),
('SECTOR', '8', 'Relaciones Exteriores', 'MRE', 8, true),
('SECTOR', '9', 'Trabajo y Promoción del Empleo', 'MTPE', 9, true),
('SECTOR', '10', 'Agricultura y Riego', 'MIDAGRI', 10, true),
('SECTOR', '11', 'Producción', 'PRODUCE', 11, true),
('SECTOR', '12', 'Comercio Exterior y Turismo', 'MINCETUR', 12, true),
('SECTOR', '13', 'Energía y Minas', 'MINEM', 13, true),
('SECTOR', '14', 'Transportes y Comunicaciones', 'MTC', 14, true),
('SECTOR', '15', 'Vivienda, Construcción y Saneamiento', 'MVCS', 15, true),
('SECTOR', '16', 'Ambiente', 'MINAM', 16, true),
('SECTOR', '17', 'Mujer y Poblaciones Vulnerables', 'MIMP', 17, true),
('SECTOR', '18', 'Desarrollo e Inclusión Social', 'MIDIS', 18, true),
('SECTOR', '19', 'Cultura', 'MINCU', 19, true),
('SECTOR', '20', 'Desarrollo Agrario y Riego', 'MIDAGRI', 20, true);

-- PASO 9: Verificar datos insertados
SELECT '=== 3. DATOS INSERTADOS ===' as paso;
SELECT nombre_tabla, COUNT(*) as cantidad
FROM tabla_tablas
GROUP BY nombre_tabla
ORDER BY nombre_tabla;

-- PASO 10: Mostrar catálogos
SELECT '=== TIPOS DE NORMA ===' as detalle;
SELECT tabla_id, descripcion FROM tabla_tablas 
WHERE nombre_tabla = 'TIPO_NORMA' 
ORDER BY orden;

SELECT '=== NIVELES DE GOBIERNO ===' as detalle;
SELECT tabla_id, descripcion FROM tabla_tablas 
WHERE nombre_tabla = 'NIVEL_GOBIERNO' 
ORDER BY orden;

SELECT '=== SECTORES ===' as detalle;
SELECT tabla_id, descripcion FROM tabla_tablas 
WHERE nombre_tabla = 'SECTOR' 
ORDER BY orden;

SELECT '✓✓✓ tabla_tablas CORREGIDA Y POBLADA EXITOSAMENTE ✓✓✓' as resultado;
