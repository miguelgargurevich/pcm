-- Migración: Crear tabla com5_estrategia_digital
-- Compromiso 5: Estrategia Digital
-- Fecha: 2025-11-22

-- Eliminar tabla si existe (solo para desarrollo)
DROP TABLE IF EXISTS com5_estrategia_digital CASCADE;

-- Crear tabla com5_estrategia_digital
CREATE TABLE com5_estrategia_digital (
    comed_ent_id SERIAL PRIMARY KEY,
    compromiso_id INTEGER NOT NULL DEFAULT 5,
    entidad_id UUID NOT NULL,
    etapa_formulario INTEGER NOT NULL DEFAULT 1,
    estado VARCHAR(50) NOT NULL DEFAULT 'bandeja',
    nombre_estrategia VARCHAR(500),
    anio_inicio INTEGER,
    anio_fin INTEGER,
    fecha_aprobacion DATE,
    objetivos_estrategicos VARCHAR(2000),
    lineas_accion VARCHAR(2000),
    alineado_pgd BOOLEAN NOT NULL DEFAULT FALSE,
    estado_implementacion VARCHAR(100),
    url_doc TEXT,
    criterios_evaluados TEXT,
    check_privacidad BOOLEAN NOT NULL DEFAULT FALSE,
    check_ddjj BOOLEAN NOT NULL DEFAULT FALSE,
    usuario_registra UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_com5_compromiso_id ON com5_estrategia_digital(compromiso_id);
CREATE INDEX idx_com5_entidad_id ON com5_estrategia_digital(entidad_id);
CREATE INDEX idx_com5_estado ON com5_estrategia_digital(estado);
CREATE INDEX idx_com5_created_at ON com5_estrategia_digital(created_at);

-- Comentarios de la tabla
COMMENT ON TABLE com5_estrategia_digital IS 'Tabla para el Compromiso 5: Estrategia Digital';
COMMENT ON COLUMN com5_estrategia_digital.comed_ent_id IS 'ID único del registro (PK)';
COMMENT ON COLUMN com5_estrategia_digital.compromiso_id IS 'ID del compromiso (siempre 5 para Estrategia Digital)';
COMMENT ON COLUMN com5_estrategia_digital.entidad_id IS 'ID de la entidad pública';
COMMENT ON COLUMN com5_estrategia_digital.etapa_formulario IS 'Etapa del formulario: 1=paso1, 2=paso2, 3=paso3';
COMMENT ON COLUMN com5_estrategia_digital.estado IS 'Estado del registro: bandeja, sin_reportar, publicado';
COMMENT ON COLUMN com5_estrategia_digital.nombre_estrategia IS 'Nombre de la estrategia digital';
COMMENT ON COLUMN com5_estrategia_digital.anio_inicio IS 'Año de inicio de la estrategia';
COMMENT ON COLUMN com5_estrategia_digital.anio_fin IS 'Año de fin de la estrategia';
COMMENT ON COLUMN com5_estrategia_digital.fecha_aprobacion IS 'Fecha de aprobación de la estrategia';
COMMENT ON COLUMN com5_estrategia_digital.objetivos_estrategicos IS 'Objetivos estratégicos de la estrategia digital';
COMMENT ON COLUMN com5_estrategia_digital.lineas_accion IS 'Líneas de acción de la estrategia';
COMMENT ON COLUMN com5_estrategia_digital.alineado_pgd IS 'Indica si está alineado con el Plan de Gobierno Digital';
COMMENT ON COLUMN com5_estrategia_digital.estado_implementacion IS 'Estado de implementación de la estrategia';
COMMENT ON COLUMN com5_estrategia_digital.url_doc IS 'URL del documento de la estrategia digital';
COMMENT ON COLUMN com5_estrategia_digital.criterios_evaluados IS 'Criterios evaluados en formato JSON';
COMMENT ON COLUMN com5_estrategia_digital.check_privacidad IS 'Check de aceptación de política de privacidad';
COMMENT ON COLUMN com5_estrategia_digital.check_ddjj IS 'Check de declaración jurada';
COMMENT ON COLUMN com5_estrategia_digital.usuario_registra IS 'ID del usuario que registra';
COMMENT ON COLUMN com5_estrategia_digital.created_at IS 'Fecha de creación del registro';
COMMENT ON COLUMN com5_estrategia_digital.updated_at IS 'Fecha de última actualización';

-- Validaciones y checks
ALTER TABLE com5_estrategia_digital ADD CONSTRAINT chk_com5_etapa CHECK (etapa_formulario IN (1, 2, 3));
ALTER TABLE com5_estrategia_digital ADD CONSTRAINT chk_com5_estado CHECK (estado IN ('bandeja', 'sin_reportar', 'publicado'));
ALTER TABLE com5_estrategia_digital ADD CONSTRAINT chk_com5_anios CHECK (anio_fin IS NULL OR anio_inicio IS NULL OR anio_fin > anio_inicio);

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE 'Tabla com5_estrategia_digital creada exitosamente';
END $$;
