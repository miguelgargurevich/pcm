-- =============================================
-- Script: INSERT_urls_documentos_politicas.sql
-- Descripción: Insertar URLs de documentos de políticas (Política de Privacidad y Declaración Jurada)
--              en la tabla tabla_tablas para gestión centralizada
-- Fecha: 2024-11-23
-- =============================================

BEGIN;

-- Insertar URL de Política de Privacidad
INSERT INTO tabla_tablas (nombre_tabla, columna_id, descripcion, valor, orden, activo)
VALUES (
    'CONFIG_DOCUMENTOS',
    'URL_POL_PRIVACIDAD',
    'URL del documento de Política de Privacidad en Supabase Storage',
    'https://amzwfwfhllwhjffkqxhn.supabase.co/storage/v1/object/public/cumplimiento-documentos/politicas/politica-privacidad.pdf',
    1,
    true
)
ON CONFLICT DO NOTHING;

-- Insertar URL de Declaración Jurada
INSERT INTO tabla_tablas (nombre_tabla, columna_id, descripcion, valor, orden, activo)
VALUES (
    'CONFIG_DOCUMENTOS',
    'URL_DECL_JURADA',
    'URL del documento de Declaración Jurada en Supabase Storage',
    'https://amzwfwfhllwhjffkqxhn.supabase.co/storage/v1/object/public/cumplimiento-documentos/politicas/declaracion-jurada.pdf',
    2,
    true
)
ON CONFLICT DO NOTHING;

-- Verificar las inserciones
SELECT 
    tabla_id,
    nombre_tabla,
    columna_id,
    descripcion,
    valor,
    orden,
    activo
FROM tabla_tablas
WHERE nombre_tabla = 'CONFIG_DOCUMENTOS'
ORDER BY orden;

COMMIT;

-- =============================================
-- Resultado esperado:
-- ✓ 2 registros insertados en tabla_tablas
-- ✓ nombre_tabla: CONFIG_DOCUMENTOS
-- ✓ columna_id: URL_POLITICA_PRIVACIDAD, URL_DECLARACION_JURADA
-- =============================================
