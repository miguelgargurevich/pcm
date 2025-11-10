-- ====================================
-- RECREAR tabla_tablas CORRECTAMENTE EN SUPABASE
-- ====================================

-- PASO 1: Ver datos actuales (si los hay importantes, guárdalos)
SELECT '=== DATOS ACTUALES (por si necesitas respaldar) ===' as advertencia;
SELECT * FROM tabla_tablas LIMIT 10;

-- PASO 2: Eliminar tabla existente
DROP TABLE IF EXISTS tabla_tablas CASCADE;

-- PASO 3: Crear tabla_tablas con estructura correcta
CREATE TABLE tabla_tablas (
    tabla_id SERIAL PRIMARY KEY,
    nombre_tabla VARCHAR(50) NOT NULL,
    columna_id VARCHAR(20) NOT NULL,
    descripcion VARCHAR(200) NOT NULL,
    valor VARCHAR(200) NOT NULL,
    orden SMALLINT DEFAULT 0,
    activo BOOLEAN NOT NULL DEFAULT true
);

-- PASO 4: Crear índice
CREATE INDEX idx_tabla_tablas_nombre ON tabla_tablas(nombre_tabla);

-- PASO 5: Verificar estructura
SELECT '=== ESTRUCTURA CREADA ===' as paso;
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'tabla_tablas'
ORDER BY ordinal_position;

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
SELECT '=== DATOS INSERTADOS ===' as paso;
SELECT nombre_tabla, COUNT(*) as cantidad
FROM tabla_tablas
GROUP BY nombre_tabla
ORDER BY nombre_tabla;

-- PASO 10: Mostrar todos los registros
SELECT '=== TODOS LOS CATÁLOGOS ===' as detalle;
SELECT tabla_id, nombre_tabla, descripcion, valor
FROM tabla_tablas
ORDER BY nombre_tabla, orden;

SELECT '✓✓✓ tabla_tablas RECREADA Y POBLADA EXITOSAMENTE ✓✓✓' as resultado;
