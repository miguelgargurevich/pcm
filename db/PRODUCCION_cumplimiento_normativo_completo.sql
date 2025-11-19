-- =====================================================
-- SCRIPT DE PRODUCCIÓN: CUMPLIMIENTO NORMATIVO COMPLETO
-- Base de datos: Supabase (PostgreSQL)
-- Fecha: 2025-11-19
-- Descripción: Crea compromisos base, estados y tabla de cumplimiento normativo
-- =====================================================

-- =====================================================
-- PARTE 1: INSERTAR COMPROMISOS BASE
-- =====================================================

DO $$
DECLARE
    v_count INTEGER;
BEGIN
    -- Verificar si ya existen compromisos
    SELECT COUNT(*) INTO v_count 
    FROM compromiso_gobierno_digital 
    WHERE compromiso_id IN (1, 2, 3, 4);

    IF v_count = 0 THEN
        -- Insertar los 4 compromisos base
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
        (
            1,
            'Designar al Líder de Gobierno y Transformación Digital',
            'La entidad deberá designar mediante Resolución al Líder de Gobierno y Transformación Digital, quien será responsable de liderar la implementación de las políticas y estrategias de gobierno digital.',
            1,
            ARRAY['Nacional', 'Regional', 'Local'],
            1,
            true,
            CURRENT_TIMESTAMP
        ),
        (
            2,
            'Construir el Comité de Gobierno y Transformación Digital',
            'La entidad deberá conformar el Comité de Gobierno y Transformación Digital como órgano colegiado responsable de aprobar y supervisar las iniciativas de transformación digital.',
            2,
            ARRAY['Nacional', 'Regional', 'Local'],
            1,
            true,
            CURRENT_TIMESTAMP
        ),
        (
            3,
            'Elaborar Plan de Gobierno Digital',
            'La entidad deberá elaborar su Plan de Gobierno Digital alineado a los objetivos estratégicos institucionales y a la Agenda Digital al Bicentenario.',
            3,
            ARRAY['Nacional', 'Regional', 'Local'],
            1,
            true,
            CURRENT_TIMESTAMP
        ),
        (
            4,
            'Desplegar la Estrategia Digital',
            'La entidad deberá implementar y desplegar la estrategia de gobierno digital mediante proyectos y actividades que materialicen la transformación digital institucional.',
            4,
            ARRAY['Nacional', 'Regional', 'Local'],
            1,
            true,
            CURRENT_TIMESTAMP
        );

        RAISE NOTICE 'Se insertaron exitosamente los 4 compromisos base de Gobierno Digital';
        
        -- Mostrar los compromisos insertados
        RAISE NOTICE '================================================';
        RAISE NOTICE 'COMPROMISOS BASE INSERTADOS:';
        RAISE NOTICE '================================================';
        
        FOR v_count IN 
            SELECT compromiso_id, nombre_compromiso 
            FROM compromiso_gobierno_digital 
            WHERE compromiso_id IN (1, 2, 3, 4)
            ORDER BY compromiso_id
        LOOP
            RAISE NOTICE '  ID: % - %', 
                (SELECT compromiso_id FROM compromiso_gobierno_digital WHERE compromiso_id = v_count),
                (SELECT nombre_compromiso FROM compromiso_gobierno_digital WHERE compromiso_id = v_count);
        END LOOP;
    ELSE
        RAISE NOTICE 'Los compromisos base ya existen en la base de datos. Se omite la inserción.';
    END IF;
END $$;

-- =====================================================
-- PARTE 2: CREAR CATÁLOGO DE ESTADOS
-- =====================================================

-- Crear tabla de estados de cumplimiento (si no existe)
CREATE TABLE IF NOT EXISTS estado_cumplimiento (
    estado_id INTEGER PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insertar estados (si no existen)
INSERT INTO estado_cumplimiento (estado_id, nombre, descripcion, activo, created_at)
VALUES 
    (1, 'bandeja', 'Cumplimiento en bandeja de entrada, sin iniciar', true, CURRENT_TIMESTAMP),
    (2, 'sin_reportar', 'Cumplimiento iniciado pero sin reportar', true, CURRENT_TIMESTAMP),
    (3, 'publicado', 'Cumplimiento reportado y publicado', true, CURRENT_TIMESTAMP)
ON CONFLICT (estado_id) DO NOTHING;

-- =====================================================
-- PARTE 3: CREAR TABLA CUMPLIMIENTO_NORMATIVO
-- =====================================================

-- Eliminar tabla si existe (para recrearla)
DROP TABLE IF EXISTS cumplimiento_normativo CASCADE;

-- Crear tabla cumplimiento_normativo
CREATE TABLE cumplimiento_normativo (
    -- Identificadores
    cumplimiento_id SERIAL PRIMARY KEY,
    compromiso_id INTEGER NOT NULL,
    entidad_id UUID NOT NULL,
    
    -- PASO 1: DATOS GENERALES DEL LÍDER
    nro_dni VARCHAR(8) NOT NULL,
    nombres VARCHAR(200) NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100) NOT NULL,
    correo_electronico VARCHAR(200) NOT NULL,
    telefono VARCHAR(20),
    rol VARCHAR(200),
    cargo VARCHAR(200),
    fecha_inicio DATE NOT NULL,
    
    -- PASO 2: DOCUMENTO NORMATIVO
    documento_url TEXT,
    documento_nombre VARCHAR(500),
    documento_tamano BIGINT,
    documento_tipo VARCHAR(100),
    documento_fecha_subida TIMESTAMP,
    
    -- PASO 2: VALIDACIONES
    validacion_resolucion_autoridad BOOLEAN NOT NULL DEFAULT false,
    validacion_lider_funcionario BOOLEAN NOT NULL DEFAULT false,
    validacion_designacion_articulo BOOLEAN NOT NULL DEFAULT false,
    validacion_funciones_definidas BOOLEAN NOT NULL DEFAULT false,
    
    -- PASO 3: CONFIRMACIONES
    acepta_politica_privacidad BOOLEAN NOT NULL DEFAULT false,
    acepta_declaracion_jurada BOOLEAN NOT NULL DEFAULT false,
    
    -- CONTROL
    estado INTEGER NOT NULL DEFAULT 1,
    activo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    
    -- FOREIGN KEYS
    CONSTRAINT fk_cumplimiento_compromiso 
        FOREIGN KEY (compromiso_id) 
        REFERENCES compromiso_gobierno_digital(compromiso_id)
        ON DELETE RESTRICT,
    
    CONSTRAINT fk_cumplimiento_entidad 
        FOREIGN KEY (entidad_id) 
        REFERENCES entidades(entidad_id)
        ON DELETE RESTRICT,
    
    CONSTRAINT fk_cumplimiento_estado 
        FOREIGN KEY (estado) 
        REFERENCES estado_cumplimiento(estado_id)
        ON DELETE RESTRICT,
    
    -- CONSTRAINT ÚNICO: Una entidad solo puede tener un cumplimiento por compromiso
    CONSTRAINT uq_cumplimiento_entidad_compromiso 
        UNIQUE (entidad_id, compromiso_id)
);

-- =====================================================
-- PARTE 4: CREAR ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

CREATE INDEX idx_cumplimiento_compromiso ON cumplimiento_normativo(compromiso_id);
CREATE INDEX idx_cumplimiento_entidad ON cumplimiento_normativo(entidad_id);
CREATE INDEX idx_cumplimiento_estado ON cumplimiento_normativo(estado);
CREATE INDEX idx_cumplimiento_activo ON cumplimiento_normativo(activo);
CREATE INDEX idx_cumplimiento_dni ON cumplimiento_normativo(nro_dni);
CREATE INDEX idx_cumplimiento_created_at ON cumplimiento_normativo(created_at);

-- =====================================================
-- PARTE 5: COMENTARIOS PARA DOCUMENTACIÓN
-- =====================================================

COMMENT ON TABLE cumplimiento_normativo IS 'Registro de cumplimiento normativo de compromisos de Gobierno Digital por entidad';
COMMENT ON COLUMN cumplimiento_normativo.cumplimiento_id IS 'Identificador único del cumplimiento';
COMMENT ON COLUMN cumplimiento_normativo.compromiso_id IS 'Referencia al compromiso de Gobierno Digital';
COMMENT ON COLUMN cumplimiento_normativo.entidad_id IS 'Referencia a la entidad que reporta';
COMMENT ON COLUMN cumplimiento_normativo.nro_dni IS 'DNI del Líder de Gobierno Digital (8 dígitos)';
COMMENT ON COLUMN cumplimiento_normativo.validacion_resolucion_autoridad IS 'La Resolución fue emitida por autoridad competente';
COMMENT ON COLUMN cumplimiento_normativo.validacion_lider_funcionario IS 'El Líder es un funcionario de la entidad';
COMMENT ON COLUMN cumplimiento_normativo.validacion_designacion_articulo IS 'La Resolución indica el artículo de designación';
COMMENT ON COLUMN cumplimiento_normativo.validacion_funciones_definidas IS 'Las funciones del Líder están definidas en la Resolución';
COMMENT ON COLUMN cumplimiento_normativo.acepta_politica_privacidad IS 'Aceptación de política de privacidad y protección de datos';
COMMENT ON COLUMN cumplimiento_normativo.acepta_declaracion_jurada IS 'Declaración jurada de veracidad de la información';

-- =====================================================
-- PARTE 6: VERIFICACIÓN FINAL
-- =====================================================

-- Verificar estructura de la tabla
SELECT 
    'Tabla cumplimiento_normativo creada exitosamente' as mensaje;

-- Mostrar estructura de columnas
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'cumplimiento_normativo'
ORDER BY ordinal_position;

-- Verificar estados insertados
SELECT 
    estado_id,
    nombre,
    descripcion,
    activo
FROM estado_cumplimiento
ORDER BY estado_id;

-- Verificar constraints
SELECT 
    conname as constraint_name,
    CASE contype
        WHEN 'p' THEN 'PRIMARY KEY'
        WHEN 'f' THEN 'FOREIGN KEY'
        WHEN 'u' THEN 'UNIQUE'
        WHEN 'c' THEN 'CHECK'
    END as constraint_type
FROM pg_constraint
WHERE conrelid = 'cumplimiento_normativo'::regclass
ORDER BY contype, conname;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================

-- Mensaje final
DO $$
BEGIN
    RAISE NOTICE '================================================';
    RAISE NOTICE '✅ SCRIPT EJECUTADO EXITOSAMENTE';
    RAISE NOTICE '================================================';
    RAISE NOTICE 'Tabla: cumplimiento_normativo';
    RAISE NOTICE 'Estados: 3 (bandeja, sin_reportar, publicado)';
    RAISE NOTICE 'Compromisos base: 4';
    RAISE NOTICE 'Índices: 6';
    RAISE NOTICE 'Constraints: 4 (1 PK + 3 FK + 1 UNIQUE)';
    RAISE NOTICE '================================================';
END $$;
