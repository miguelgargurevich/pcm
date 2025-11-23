-- =====================================================
-- MIGRACIÓN: Recrear com4_tdpei y com5_destrategiad 
-- con el schema correcto de Supabase en BD local
-- Fecha: 2025-11-23
-- =====================================================

BEGIN;

-- =====================================================
-- 1. ELIMINAR TABLAS ANTIGUAS (si existen datos, respaldar primero)
-- =====================================================

-- Backup de datos existentes (si los hay)
CREATE TEMP TABLE backup_com4_tdpei AS SELECT * FROM com4_tdpei;
CREATE TEMP TABLE backup_com5_destrategiad AS SELECT * FROM com5_destrategiad;

-- Eliminar tablas antiguas
DROP TABLE IF EXISTS com4_tdpei CASCADE;
DROP TABLE IF EXISTS com5_destrategiad CASCADE;

-- =====================================================
-- 2. CREAR com4_tdpei CON SCHEMA DE SUPABASE
-- =====================================================

CREATE TABLE com4_tdpei (
    comtdpei_ent_id BIGSERIAL PRIMARY KEY,
    compromiso_id BIGINT NOT NULL,
    entidad_id BIGINT NOT NULL,
    etapa_formulario VARCHAR(20) NOT NULL DEFAULT 'paso1',
    estado VARCHAR(15) NOT NULL DEFAULT 'bandeja',
    check_privacidad BOOLEAN NOT NULL DEFAULT false,
    check_ddjj BOOLEAN NOT NULL DEFAULT false,
    estado_PCM VARCHAR(50) NOT NULL DEFAULT '',
    observaciones_PCM VARCHAR(500) NOT NULL DEFAULT '',
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    fec_registro DATE NOT NULL DEFAULT CURRENT_DATE,
    usuario_registra BIGINT NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT true,
    anio_inicio_pei BIGINT,
    anio_fin_pei BIGINT,
    objetivo_pei VARCHAR(1000),
    descripcion_pei VARCHAR(2000),
    alineado_pgd BOOLEAN NOT NULL DEFAULT false,
    fecha_aprobacion_pei DATE,
    ruta_pdf_pei VARCHAR(255),
    criterios_evaluados JSONB
);

-- Índices
CREATE INDEX idx_com4_tdpei_entidad ON com4_tdpei(entidad_id);
CREATE INDEX idx_com4_tdpei_compromiso ON com4_tdpei(compromiso_id);
CREATE INDEX idx_com4_tdpei_estado ON com4_tdpei(estado);

-- Comentarios
COMMENT ON TABLE com4_tdpei IS 'Compromiso 4: Incorporar Transformación Digital en el Plan Estratégico Institucional (PEI)';
COMMENT ON COLUMN com4_tdpei.comtdpei_ent_id IS 'ID único del registro (PK)';
COMMENT ON COLUMN com4_tdpei.anio_inicio_pei IS 'Año de inicio del PEI';
COMMENT ON COLUMN com4_tdpei.anio_fin_pei IS 'Año de fin del PEI';
COMMENT ON COLUMN com4_tdpei.objetivo_pei IS 'Objetivo estratégico del PEI';
COMMENT ON COLUMN com4_tdpei.descripcion_pei IS 'Descripción de la incorporación de TD en el PEI';
COMMENT ON COLUMN com4_tdpei.ruta_pdf_pei IS 'Ruta del PDF del PEI';
COMMENT ON COLUMN com4_tdpei.criterios_evaluados IS 'Criterios evaluados en formato JSONB';

-- =====================================================
-- 3. CREAR com5_destrategiad CON SCHEMA DE SUPABASE
-- =====================================================

CREATE TABLE com5_destrategiad (
    comded_ent_id BIGSERIAL PRIMARY KEY,
    compromiso_id BIGINT NOT NULL,
    entidad_id BIGINT NOT NULL,
    etapa_formulario VARCHAR(20) NOT NULL DEFAULT 'paso1',
    estado VARCHAR(15) NOT NULL DEFAULT 'bandeja',
    check_privacidad BOOLEAN NOT NULL DEFAULT false,
    check_ddjj BOOLEAN NOT NULL DEFAULT false,
    estado_PCM VARCHAR(50) NOT NULL DEFAULT '',
    observaciones_PCM VARCHAR(500) NOT NULL DEFAULT '',
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    fec_registro DATE NOT NULL DEFAULT CURRENT_DATE,
    usuario_registra BIGINT NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT true,
    nombre_estrategia VARCHAR(150),
    periodo_inicio_estrategia BIGINT,
    periodo_fin_estrategia BIGINT,
    objetivos_estrategicos VARCHAR(2000),
    lineas_accion VARCHAR(2000),
    fecha_aprobacion_estrategia DATE,
    alineado_pgd_estrategia BOOLEAN NOT NULL DEFAULT false,
    estado_implementacion_estrategia VARCHAR(50),
    ruta_pdf_estrategia VARCHAR(255),
    criterios_evaluados JSONB
);

-- Índices
CREATE INDEX idx_com5_destrategiad_entidad ON com5_destrategiad(entidad_id);
CREATE INDEX idx_com5_destrategiad_compromiso ON com5_destrategiad(compromiso_id);
CREATE INDEX idx_com5_destrategiad_estado ON com5_destrategiad(estado);

-- Comentarios
COMMENT ON TABLE com5_destrategiad IS 'Compromiso 5: Contar con una Estrategia de Transformación Digital';
COMMENT ON COLUMN com5_destrategiad.comded_ent_id IS 'ID único del registro (PK)';
COMMENT ON COLUMN com5_destrategiad.nombre_estrategia IS 'Nombre de la estrategia digital';
COMMENT ON COLUMN com5_destrategiad.periodo_inicio_estrategia IS 'Año de inicio de la estrategia';
COMMENT ON COLUMN com5_destrategiad.periodo_fin_estrategia IS 'Año de fin de la estrategia';
COMMENT ON COLUMN com5_destrategiad.objetivos_estrategicos IS 'Objetivos estratégicos de la estrategia';
COMMENT ON COLUMN com5_destrategiad.lineas_accion IS 'Líneas de acción de la estrategia';
COMMENT ON COLUMN com5_destrategiad.alineado_pgd_estrategia IS 'Indica si está alineado con el Plan de Gobierno Digital';
COMMENT ON COLUMN com5_destrategiad.estado_implementacion_estrategia IS 'Estado de implementación de la estrategia';
COMMENT ON COLUMN com5_destrategiad.ruta_pdf_estrategia IS 'Ruta del PDF de la estrategia';
COMMENT ON COLUMN com5_destrategiad.criterios_evaluados IS 'Criterios evaluados en formato JSONB';

COMMIT;

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

SELECT 'Tabla com4_tdpei creada exitosamente' AS status;
SELECT 'Tabla com5_destrategiad creada exitosamente' AS status;

-- Ver estructura
\d com4_tdpei
\d com5_destrategiad
