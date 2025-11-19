-- SCRIPT DE VERIFICACIÓN: Compromisos en Supabase
-- Ejecutar en SQL Editor de Supabase

-- 1. Verificar si existen compromisos
SELECT 
    compromiso_id,
    nombre_compromiso,
    alcances,
    estado,
    activo
FROM compromiso_gobierno_digital
WHERE compromiso_id IN (1, 2, 3, 4)
ORDER BY compromiso_id;

-- 2. Si no hay resultados, ejecutar el siguiente INSERT:
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
(1, 'Designar al Líder de Gobierno y Transformación Digital', 'La entidad deberá designar mediante Resolución al Líder de Gobierno y Transformación Digital, quien será responsable de liderar la implementación de las políticas y estrategias de gobierno digital.', 1, ARRAY['Nacional', 'Regional', 'Local'], 1, true, CURRENT_TIMESTAMP),
(2, 'Construir el Comité de Gobierno y Transformación Digital', 'La entidad deberá conformar el Comité de Gobierno y Transformación Digital como órgano colegiado responsable de aprobar y supervisar las iniciativas de transformación digital.', 2, ARRAY['Nacional', 'Regional', 'Local'], 1, true, CURRENT_TIMESTAMP),
(3, 'Elaborar Plan de Gobierno Digital', 'La entidad deberá elaborar su Plan de Gobierno Digital alineado a los objetivos estratégicos institucionales y a la Agenda Digital al Bicentenario.', 3, ARRAY['Nacional', 'Regional', 'Local'], 1, true, CURRENT_TIMESTAMP),
(4, 'Desplegar la Estrategia Digital', 'La entidad deberá implementar y desplegar la estrategia de gobierno digital mediante proyectos y actividades que materialicen la transformación digital institucional.', 4, ARRAY['Nacional', 'Regional', 'Local'], 1, true, CURRENT_TIMESTAMP)
ON CONFLICT (compromiso_id) DO NOTHING;
*/
