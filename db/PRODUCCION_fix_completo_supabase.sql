-- =====================================================
-- FIX COMPLETO SUPABASE: Cumplimiento Normativo
-- =====================================================
-- Ejecutar en SQL Editor de Supabase
-- Este script hace 2 cosas:
-- 1. Agrega columna updated_at a marco_normativo
-- 2. Inserta los 4 compromisos base
-- =====================================================

-- ============================================
-- FIX 1: Agregar updated_at a marco_normativo
-- ============================================

DO $$
BEGIN
    -- Verificar si la columna existe
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'marco_normativo' 
        AND column_name = 'updated_at'
    ) THEN
        -- Agregar la columna
        ALTER TABLE marco_normativo 
        ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        
        -- Establecer valores iniciales
        UPDATE marco_normativo 
        SET updated_at = created_at 
        WHERE updated_at IS NULL;
        
        RAISE NOTICE '✅ Columna updated_at agregada exitosamente a marco_normativo';
    ELSE
        RAISE NOTICE '⚠️  La columna updated_at ya existe en marco_normativo';
    END IF;
END $$;

-- ============================================
-- FIX 2: Insertar 4 Compromisos Base
-- ============================================

INSERT INTO compromiso_gobierno_digital (
    nombre_compromiso,
    descripcion,
    alcances,
    fecha_inicio,
    fecha_fin,
    estado,
    activo,
    created_at
) VALUES
('Designar al Líder de Gobierno y Transformación Digital', 
 'La entidad deberá designar mediante Resolución al Líder de Gobierno y Transformación Digital, quien será responsable de liderar la implementación de las políticas y estrategias de gobierno digital.', 
 'Nacional,Regional,Local', CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year', 1, true, CURRENT_TIMESTAMP),
('Construir el Comité de Gobierno y Transformación Digital', 
 'La entidad deberá conformar el Comité de Gobierno y Transformación Digital como órgano colegiado responsable de apobar y supervisar las iniciativas de transformación digital.', 
 'Nacional,Regional,Local', CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year', 1, true, CURRENT_TIMESTAMP),
('Elaborar Plan de Gobierno Digital', 
 'La entidad deberá elaborar su Plan de Gobierno Digital alineado a los objetivos estratégicos institucionales y a la Agenda Digital al Bicentenario.', 
 'Nacional,Regional,Local', CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year', 1, true, CURRENT_TIMESTAMP),
('Desplegar la Estrategia Digital', 
 'La entidad deberá implementar y desplegar la estrategia de gobierno digital mediante proyectos y actividades que materialicen la transformación digital institucional.', 
 'Nacional,Regional,Local', CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year', 1, true, CURRENT_TIMESTAMP);

-- ============================================
-- VERIFICACIÓN FINAL
-- ============================================

-- 1. Verificar updated_at en marco_normativo
SELECT 
    'VERIFICACIÓN: marco_normativo.updated_at' as check_point,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'marco_normativo'
AND column_name = 'updated_at';

-- 2. Verificar compromisos insertados
SELECT 
    'VERIFICACIÓN: Compromisos insertados' as check_point,
    COUNT(*) as total_compromisos,
    COUNT(CASE WHEN activo = true THEN 1 END) as activos
FROM compromiso_gobierno_digital
WHERE compromiso_id IN (1, 2, 3, 4);

-- 3. Listar compromisos
SELECT 
    compromiso_id,
    nombre_compromiso,
    alcances,
    estado,
    activo,
    fecha_inicio,
    fecha_fin
FROM compromiso_gobierno_digital
ORDER BY compromiso_id;

-- =====================================================
-- RESULTADO ESPERADO:
-- =====================================================
-- ✅ updated_at debe aparecer en marco_normativo
-- ✅ Deben existir 4 compromisos (IDs: 1, 2, 3, 4)
-- ✅ Todos deben estar activos (activo = true)
-- =====================================================

-- Mensaje final
DO $$
BEGIN
    RAISE NOTICE '================================================';
    RAISE NOTICE '✅ FIX COMPLETADO EXITOSAMENTE';
    RAISE NOTICE '   1. Columna updated_at agregada a marco_normativo';
    RAISE NOTICE '   2. 4 Compromisos base insertados';
    RAISE NOTICE '================================================';
END $$;
