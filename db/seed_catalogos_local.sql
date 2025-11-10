-- ====================================
-- CREAR Y POBLAR TABLA tabla_tablas
-- Script para crear la tabla de catálogos y cargar datos
-- ====================================

-- PASO 1: Crear la tabla tabla_tablas si no existe
CREATE TABLE IF NOT EXISTS tabla_tablas (
    tabla_id SERIAL PRIMARY KEY,
    nombre_tabla VARCHAR(50) NOT NULL,
    columna_id VARCHAR(20) NOT NULL,
    descripcion VARCHAR(200) NOT NULL,
    valor VARCHAR(200) NOT NULL,
    orden SMALLINT DEFAULT 0,
    activo BOOLEAN NOT NULL DEFAULT true
);

-- Crear índice para mejorar búsquedas
CREATE INDEX IF NOT EXISTS idx_tabla_tablas_nombre ON tabla_tablas(nombre_tabla);

-- PASO 2: Limpiar datos existentes de estos catálogos (si existen)
DELETE FROM tabla_tablas WHERE nombre_tabla IN ('TIPO_NORMA', 'NIVEL_GOBIERNO', 'SECTOR');

-- ====================================
-- TIPO_NORMA (7 tipos)
-- ====================================
INSERT INTO tabla_tablas (nombre_tabla, columna_id, descripcion, valor, orden, activo) VALUES
('TIPO_NORMA', '1', 'Ley', 'Ley', 1, true),
('TIPO_NORMA', '2', 'Decreto Supremo', 'Decreto Supremo', 2, true),
('TIPO_NORMA', '3', 'Resolución Ministerial', 'Resolución Ministerial', 3, true),
('TIPO_NORMA', '4', 'Resolución Directoral', 'Resolución Directoral', 4, true),
('TIPO_NORMA', '5', 'Ordenanza', 'Ordenanza', 5, true),
('TIPO_NORMA', '6', 'Decreto Legislativo', 'Decreto Legislativo', 6, true),
('TIPO_NORMA', '7', 'Resolución Jefatural', 'Resolución Jefatural', 7, true);

-- ====================================
-- NIVEL_GOBIERNO (3 niveles)
-- ====================================
INSERT INTO tabla_tablas (nombre_tabla, columna_id, descripcion, valor, orden, activo) VALUES
('NIVEL_GOBIERNO', '1', 'Nacional', 'Nacional', 1, true),
('NIVEL_GOBIERNO', '2', 'Regional', 'Regional', 2, true),
('NIVEL_GOBIERNO', '3', 'Local', 'Local', 3, true);

-- ====================================
-- SECTOR (20 sectores del gobierno peruano)
-- ====================================
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

-- ====================================
-- VERIFICACIÓN
-- ====================================
SELECT '=== CATÁLOGOS INSERTADOS ===' as status;

SELECT 
    nombre_tabla,
    COUNT(*) as cantidad
FROM tabla_tablas
WHERE nombre_tabla IN ('TIPO_NORMA', 'NIVEL_GOBIERNO', 'SECTOR')
GROUP BY nombre_tabla
ORDER BY nombre_tabla;

SELECT '=== TIPOS DE NORMA ===' as detalle;
SELECT tabla_id, columna_id, descripcion, valor FROM tabla_tablas 
WHERE nombre_tabla = 'TIPO_NORMA' 
ORDER BY orden;

SELECT '=== NIVELES DE GOBIERNO ===' as detalle;
SELECT tabla_id, columna_id, descripcion, valor FROM tabla_tablas 
WHERE nombre_tabla = 'NIVEL_GOBIERNO' 
ORDER BY orden;

SELECT '=== SECTORES ===' as detalle;
SELECT tabla_id, columna_id, descripcion, valor FROM tabla_tablas 
WHERE nombre_tabla = 'SECTOR' 
ORDER BY orden;
