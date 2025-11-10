-- ====================================
-- ELIMINAR TODAS LAS TABLAS DEL PROYECTO PCM
-- ⚠️ CUIDADO: Esto eliminará TODAS las tablas y datos
-- ====================================

-- PASO 1: Ver las tablas que se van a eliminar
SELECT '=== TABLAS QUE SE ELIMINARÁN ===' as advertencia;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- PASO 2: Eliminar todas las tablas del proyecto (en orden de dependencias)
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS entidades CASCADE;
DROP TABLE IF EXISTS marco_normativo CASCADE;
DROP TABLE IF EXISTS tabla_tablas CASCADE;
DROP TABLE IF EXISTS perfiles CASCADE;
DROP TABLE IF EXISTS clasificacion CASCADE;
DROP TABLE IF EXISTS sector CASCADE;
DROP TABLE IF EXISTS nivel_gobierno CASCADE;
DROP TABLE IF EXISTS ubigeo CASCADE;

-- PASO 3: Eliminar cualquier otra tabla que pueda existir
-- (agrega aquí otras tablas si las hay)

-- PASO 4: Eliminar todos los índices
DROP INDEX IF EXISTS idx_usuarios_email;
DROP INDEX IF EXISTS idx_usuarios_dni;
DROP INDEX IF EXISTS idx_entidades_ruc;
DROP INDEX IF EXISTS idx_marco_normativo_activo;
DROP INDEX IF EXISTS idx_marco_normativo_tipo_norma;
DROP INDEX IF EXISTS idx_marco_normativo_nivel_gobierno;
DROP INDEX IF EXISTS idx_marco_normativo_sector;
DROP INDEX IF EXISTS idx_marco_normativo_fecha_pub;
DROP INDEX IF EXISTS idx_tabla_tablas_nombre;

-- PASO 5: Verificar que TODO se eliminó
SELECT '=== VERIFICACIÓN: Tablas restantes ===' as info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

SELECT '✓ TODAS LAS TABLAS DEL PROYECTO ELIMINADAS' as resultado;
