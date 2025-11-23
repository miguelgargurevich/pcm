-- Migración para crear tabla com4_pei (Compromiso 4: Incorporar TD en el PEI)
-- Fecha: 22 de noviembre de 2025

-- Crear tabla com4_pei
CREATE TABLE IF NOT EXISTS com4_pei (
    compei_ent_id SERIAL PRIMARY KEY,
    compromiso_id INTEGER NOT NULL,
    entidad_id UUID NOT NULL,
    etapa_formulario INTEGER NOT NULL DEFAULT 1,
    estado VARCHAR(50) DEFAULT 'bandeja',
    anio_inicio INTEGER NOT NULL,
    anio_fin INTEGER NOT NULL,
    fecha_aprobacion TIMESTAMP NOT NULL,
    objetivo_estrategico VARCHAR(1000) NOT NULL,
    descripcion_incorporacion VARCHAR(2000) NOT NULL,
    alineado_pgd BOOLEAN NOT NULL DEFAULT FALSE,
    url_doc_pei TEXT,
    criterios_evaluados TEXT,
    check_privacidad BOOLEAN NOT NULL DEFAULT FALSE,
    check_ddjj BOOLEAN NOT NULL DEFAULT FALSE,
    usuario_registra UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_com4_pei_compromiso ON com4_pei(compromiso_id);
CREATE INDEX IF NOT EXISTS idx_com4_pei_entidad ON com4_pei(entidad_id);
CREATE INDEX IF NOT EXISTS idx_com4_pei_estado ON com4_pei(estado);

-- Comentarios
COMMENT ON TABLE com4_pei IS 'Tabla para registrar el cumplimiento del Compromiso 4: Incorporar TD en el Plan Estratégico Institucional (PEI)';
COMMENT ON COLUMN com4_pei.compei_ent_id IS 'ID único del registro';
COMMENT ON COLUMN com4_pei.compromiso_id IS 'ID del compromiso (debe ser 4)';
COMMENT ON COLUMN com4_pei.entidad_id IS 'ID de la entidad que registra';
COMMENT ON COLUMN com4_pei.etapa_formulario IS 'Etapa actual del formulario (1, 2, 3)';
COMMENT ON COLUMN com4_pei.estado IS 'Estado del cumplimiento (En Proceso, Completado)';
COMMENT ON COLUMN com4_pei.anio_inicio IS 'Año de inicio del PEI';
COMMENT ON COLUMN com4_pei.anio_fin IS 'Año de fin del PEI';
COMMENT ON COLUMN com4_pei.fecha_aprobacion IS 'Fecha de aprobación del PEI';
COMMENT ON COLUMN com4_pei.objetivo_estrategico IS 'Objetivo estratégico vinculado a la TD';
COMMENT ON COLUMN com4_pei.descripcion_incorporacion IS 'Descripción de cómo se incorporó la TD en el PEI';
COMMENT ON COLUMN com4_pei.alineado_pgd IS 'Indica si el PEI está alineado con el Plan de Gobierno Digital';
COMMENT ON COLUMN com4_pei.url_doc_pei IS 'URL del documento PEI en Supabase Storage';
COMMENT ON COLUMN com4_pei.criterios_evaluados IS 'Criterios de evaluación marcados (JSONB)';
COMMENT ON COLUMN com4_pei.check_privacidad IS 'Checkbox de aceptación de política de privacidad';
COMMENT ON COLUMN com4_pei.check_ddjj IS 'Checkbox de aceptación de declaración jurada';
COMMENT ON COLUMN com4_pei.usuario_registra IS 'Usuario que registra el compromiso';
COMMENT ON COLUMN com4_pei.created_at IS 'Fecha de creación del registro';
COMMENT ON COLUMN com4_pei.updated_at IS 'Fecha de última actualización';
