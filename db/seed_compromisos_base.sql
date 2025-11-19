-- Seed: Insertar los 4 compromisos base de Gobierno Digital
-- Fecha: 2025-11-19
-- Descripción: Catálogo de compromisos base según normativa de Gobierno Digital

-- Verificar si ya existen compromisos base
DO $$
BEGIN
    -- Solo insertar si no existen compromisos en la tabla
    IF NOT EXISTS (SELECT 1 FROM compromiso_gobierno_digital LIMIT 1) THEN
        
        -- Compromiso 1: Designar al Líder de Gobierno y Transformación Digital
        INSERT INTO compromiso_gobierno_digital (
            nombre_compromiso, 
            descripcion, 
            alcances, 
            fecha_inicio, 
            fecha_fin, 
            estado, 
            activo
        ) VALUES (
            'Designar al Líder de Gobierno y Transformación Digital',
            'La entidad debe designar formalmente mediante resolución al Líder de Gobierno y Transformación Digital, quien será responsable de liderar la implementación de iniciativas digitales.',
            'Nacional,Regional,Local',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP + INTERVAL '365 days',
            1, -- Estado: pendiente (FK a estado_compromiso)
            TRUE
        );

        -- Compromiso 2: Construir el Comité de Gobierno y Transformación Digital
        INSERT INTO compromiso_gobierno_digital (
            nombre_compromiso, 
            descripcion, 
            alcances, 
            fecha_inicio, 
            fecha_fin, 
            estado, 
            activo
        ) VALUES (
            'Construir el Comité de Gobierno y Transformación Digital',
            'Conformación del Comité de Gobierno y Transformación Digital con representantes de las áreas estratégicas de la entidad para coordinar y supervisar iniciativas digitales.',
            'Nacional,Regional,Local',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP + INTERVAL '365 days',
            1, -- Estado: pendiente
            TRUE
        );

        -- Compromiso 3: Elaborar Plan de Gobierno Digital
        INSERT INTO compromiso_gobierno_digital (
            nombre_compromiso, 
            descripcion, 
            alcances, 
            fecha_inicio, 
            fecha_fin, 
            estado, 
            activo
        ) VALUES (
            'Elaborar Plan de Gobierno Digital',
            'Desarrollo e implementación del Plan de Gobierno Digital de la entidad, alineado con los objetivos estratégicos institucionales y la Política Nacional de Transformación Digital.',
            'Nacional,Regional,Local',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP + INTERVAL '365 days',
            1, -- Estado: pendiente
            TRUE
        );

        -- Compromiso 4: Desplegar la Estrategia Digital
        INSERT INTO compromiso_gobierno_digital (
            nombre_compromiso, 
            descripcion, 
            alcances, 
            fecha_inicio, 
            fecha_fin, 
            estado, 
            activo
        ) VALUES (
            'Desplegar la Estrategia Digital',
            'Implementación y ejecución de la Estrategia Digital de la entidad, incluyendo proyectos de transformación digital, servicios digitales y mejora de procesos.',
            'Nacional,Regional,Local',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP + INTERVAL '365 days',
            1, -- Estado: pendiente
            TRUE
        );

        RAISE NOTICE 'Se insertaron exitosamente los 4 compromisos base de Gobierno Digital';
    ELSE
        RAISE NOTICE 'Ya existen compromisos en la base de datos. No se insertaron duplicados.';
    END IF;
END $$;

-- Verificar los compromisos insertados
SELECT 
    compromiso_id,
    nombre_compromiso,
    alcances,
    estado,
    activo
FROM compromiso_gobierno_digital
WHERE activo = TRUE
ORDER BY compromiso_id;
