-- Migración: Crear tabla para Cumplimiento Normativo
-- Fecha: 2025-11-19
-- Descripción: Tabla para gestionar el cumplimiento normativo de compromisos por cada entidad
--              Incluye datos del líder, documento adjunto, validaciones y confirmaciones

-- Primero, crear tabla de estados de cumplimiento normativo
CREATE TABLE IF NOT EXISTS estado_cumplimiento (
    estado_id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insertar estados para cumplimiento normativo
INSERT INTO estado_cumplimiento (estado_id, nombre, descripcion) VALUES
    (1, 'bandeja', 'Cumplimiento en bandeja de entrada, sin iniciar'),
    (2, 'sin_reportar', 'Cumplimiento iniciado pero sin reportar'),
    (3, 'publicado', 'Cumplimiento reportado y publicado')
ON CONFLICT (estado_id) DO NOTHING;

-- Tabla principal: cumplimiento_normativo
CREATE TABLE IF NOT EXISTS cumplimiento_normativo (
    cumplimiento_id SERIAL PRIMARY KEY,
    compromiso_id INTEGER NOT NULL,
    entidad_id UUID NOT NULL,
    
    -- ============================================
    -- PASO 1: DATOS GENERALES DEL LÍDER
    -- ============================================
    nro_dni VARCHAR(8) NOT NULL,
    nombres VARCHAR(200) NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100) NOT NULL,
    correo_electronico VARCHAR(200) NOT NULL,
    telefono VARCHAR(20),
    rol VARCHAR(100),
    cargo VARCHAR(200),
    fecha_inicio DATE NOT NULL,
    
    -- ============================================
    -- PASO 2: NORMATIVA (Documento y Validaciones)
    -- ============================================
    documento_url TEXT, -- Ruta física o URL (flexible: Supabase Storage o servidor local)
    documento_nombre VARCHAR(500),
    documento_tamano BIGINT, -- Tamaño en bytes
    documento_tipo VARCHAR(100), -- MIME type (application/pdf)
    documento_fecha_subida TIMESTAMP,
    
    -- Checkboxes de Validación (Paso 2)
    validacion_resolucion_autoridad BOOLEAN NOT NULL DEFAULT FALSE,
    validacion_lider_funcionario BOOLEAN NOT NULL DEFAULT FALSE,
    validacion_designacion_articulo BOOLEAN NOT NULL DEFAULT FALSE,
    validacion_funciones_definidas BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- ============================================
    -- PASO 3: CONFIRMACIÓN
    -- ============================================
    acepta_politica_privacidad BOOLEAN NOT NULL DEFAULT FALSE,
    acepta_declaracion_jurada BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- ============================================
    -- METADATOS
    -- ============================================
    estado INTEGER NOT NULL DEFAULT 1, -- FK a estado_cumplimiento (1=bandeja)
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    
    -- ============================================
    -- FOREIGN KEYS
    -- ============================================
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
    
    -- UNA ENTIDAD SOLO PUEDE TENER UN CUMPLIMIENTO POR COMPROMISO
    CONSTRAINT uq_cumplimiento_entidad_compromiso 
        UNIQUE(entidad_id, compromiso_id)
);

-- ============================================
-- ÍNDICES PARA OPTIMIZAR CONSULTAS
-- ============================================
CREATE INDEX IF NOT EXISTS idx_cumplimiento_compromiso ON cumplimiento_normativo(compromiso_id);
CREATE INDEX IF NOT EXISTS idx_cumplimiento_entidad ON cumplimiento_normativo(entidad_id);
CREATE INDEX IF NOT EXISTS idx_cumplimiento_estado ON cumplimiento_normativo(estado);
CREATE INDEX IF NOT EXISTS idx_cumplimiento_activo ON cumplimiento_normativo(activo);
CREATE INDEX IF NOT EXISTS idx_cumplimiento_dni ON cumplimiento_normativo(nro_dni);
CREATE INDEX IF NOT EXISTS idx_cumplimiento_created_at ON cumplimiento_normativo(created_at);

-- ============================================
-- COMENTARIOS PARA DOCUMENTACIÓN
-- ============================================
COMMENT ON TABLE cumplimiento_normativo IS 'Gestión del cumplimiento normativo de compromisos de gobierno digital por entidad';
COMMENT ON COLUMN cumplimiento_normativo.nro_dni IS 'DNI del líder designado (8 dígitos)';
COMMENT ON COLUMN cumplimiento_normativo.documento_url IS 'URL o ruta física del documento PDF de resolución';
COMMENT ON COLUMN cumplimiento_normativo.validacion_resolucion_autoridad IS 'Checkbox: Resolución emitida por máxima autoridad';
COMMENT ON COLUMN cumplimiento_normativo.validacion_lider_funcionario IS 'Checkbox: Líder es funcionario o asesor de alta dirección';
COMMENT ON COLUMN cumplimiento_normativo.validacion_designacion_articulo IS 'Checkbox: Designación definida en artículo de resolución';
COMMENT ON COLUMN cumplimiento_normativo.validacion_funciones_definidas IS 'Checkbox: Funciones definidas o referenciadas en normativa';
COMMENT ON COLUMN cumplimiento_normativo.acepta_politica_privacidad IS 'Checkbox: Acepta política de privacidad';
COMMENT ON COLUMN cumplimiento_normativo.acepta_declaracion_jurada IS 'Checkbox: Acepta declaración jurada de veracidad';
COMMENT ON COLUMN cumplimiento_normativo.estado IS 'Estado: 1=bandeja, 2=sin_reportar, 3=publicado';

COMMENT ON TABLE estado_cumplimiento IS 'Catálogo de estados para cumplimiento normativo';

-- ============================================
-- VERIFICACIÓN
-- ============================================
SELECT 'Tabla cumplimiento_normativo creada exitosamente' as mensaje;

-- Mostrar estructura de la tabla
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'cumplimiento_normativo'
ORDER BY ordinal_position;
