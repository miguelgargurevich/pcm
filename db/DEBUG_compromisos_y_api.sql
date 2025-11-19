-- =====================================================
-- SCRIPT DE DEBUG: Verificar Compromisos y Datos
-- =====================================================
-- Ejecutar en SQL Editor de Supabase para diagnosticar
-- por qué no aparecen los compromisos en el frontend
-- =====================================================

-- 1. VERIFICAR SI EXISTEN LOS 4 COMPROMISOS BASE
SELECT 
    'COMPROMISOS BASE' as seccion,
    COUNT(*) as total,
    COUNT(CASE WHEN activo = true THEN 1 END) as activos,
    COUNT(CASE WHEN activo = false THEN 1 END) as inactivos
FROM compromiso_gobierno_digital
WHERE compromiso_id IN (1, 2, 3, 4);

-- 2. LISTAR TODOS LOS COMPROMISOS ACTUALES
SELECT 
    compromiso_id,
    nombre_compromiso,
    descripcion,
    orden,
    alcances,
    estado,
    activo,
    created_at
FROM compromiso_gobierno_digital
ORDER BY orden;

-- 3. SI NO HAY COMPROMISOS, EJECUTAR ESTE INSERT:
-- (Descomentar y ejecutar si el resultado de la query anterior es 0 filas)

/*
INSERT INTO compromiso_gobierno_digital (
    compromiso_id,
    nombre_compromiso,
    descripcion,
    orden,
    alcances,
    estado,
    activo,
    created_at
) VALUES
(1, 'Designar al Líder de Gobierno y Transformación Digital', 
 'La entidad deberá designar mediante Resolución al Líder de Gobierno y Transformación Digital, quien será responsable de liderar la implementación de las políticas y estrategias de gobierno digital.', 
 1, ARRAY['Nacional', 'Regional', 'Local'], 1, true, CURRENT_TIMESTAMP),
(2, 'Construir el Comité de Gobierno y Transformación Digital', 
 'La entidad deberá conformar el Comité de Gobierno y Transformación Digital como órgano colegiado responsable de aprobar y supervisar las iniciativas de transformación digital.', 
 2, ARRAY['Nacional', 'Regional', 'Local'], 1, true, CURRENT_TIMESTAMP),
(3, 'Elaborar Plan de Gobierno Digital', 
 'La entidad deberá elaborar su Plan de Gobierno Digital alineado a los objetivos estratégicos institucionales y a la Agenda Digital al Bicentenario.', 
 3, ARRAY['Nacional', 'Regional', 'Local'], 1, true, CURRENT_TIMESTAMP),
(4, 'Desplegar la Estrategia Digital', 
 'La entidad deberá implementar y desplegar la estrategia de gobierno digital mediante proyectos y actividades que materialicen la transformación digital institucional.', 
 4, ARRAY['Nacional', 'Regional', 'Local'], 1, true, CURRENT_TIMESTAMP)
ON CONFLICT (compromiso_id) DO NOTHING;
*/

-- 4. VERIFICAR CUMPLIMIENTOS EXISTENTES
SELECT 
    'CUMPLIMIENTOS REGISTRADOS' as seccion,
    COUNT(*) as total,
    COUNT(CASE WHEN estado = 1 THEN 1 END) as bandeja,
    COUNT(CASE WHEN estado = 2 THEN 1 END) as sin_reportar,
    COUNT(CASE WHEN estado = 3 THEN 1 END) as publicado
FROM cumplimiento_normativo;

-- 5. LISTAR CUMPLIMIENTOS POR COMPROMISO
SELECT 
    cn.cumplimiento_id,
    cn.compromiso_id,
    cgd.nombre_compromiso,
    cn.estado,
    cn.fecha_registro,
    cn.activo
FROM cumplimiento_normativo cn
LEFT JOIN compromiso_gobierno_digital cgd 
    ON cn.compromiso_id = cgd.compromiso_id
ORDER BY cn.compromiso_id;

-- 6. VERIFICAR ESTRUCTURA DE TABLA cumplimiento_normativo
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'cumplimiento_normativo'
ORDER BY ordinal_position;

-- 7. VERIFICAR ESTRUCTURA DE TABLA compromiso_gobierno_digital
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'compromiso_gobierno_digital'
ORDER BY ordinal_position;

-- =====================================================
-- RESULTADOS ESPERADOS:
-- =====================================================
-- Query 1: Debe mostrar total=4, activos=4, inactivos=0
-- Query 2: Debe listar los 4 compromisos con todos sus datos
-- Query 4: Puede mostrar total=0 si no hay cumplimientos (esto es normal)
-- Query 5: Puede estar vacío si no hay cumplimientos
-- Query 6-7: Deben mostrar las columnas de las tablas
-- =====================================================
