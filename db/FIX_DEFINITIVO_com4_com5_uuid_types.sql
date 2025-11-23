-- =====================================================
-- MIGRACIÓN DEFINITIVA: Corregir com4_tdpei y com5_destrategiad
-- Cambiar entidad_id y usuario_registra de BIGINT a UUID
-- para mantener consistencia con entidades y usuarios
-- Fecha: 2025-11-23
-- =====================================================

BEGIN;

-- =====================================================
-- 1. RECREAR com4_tdpei CON TIPOS CORRECTOS (UUID)
-- =====================================================

DROP TABLE IF EXISTS com4_tdpei CASCADE;

CREATE TABLE com4_tdpei (
    comtdpei_ent_id BIGSERIAL PRIMARY KEY,
    compromiso_id BIGINT NOT NULL,
    entidad_id UUID NOT NULL,                      -- UUID para FK
    etapa_formulario VARCHAR(20) NOT NULL DEFAULT 'paso1',
    estado VARCHAR(15) NOT NULL DEFAULT 'bandeja',
    check_privacidad BOOLEAN NOT NULL DEFAULT false,
    check_ddjj BOOLEAN NOT NULL DEFAULT false,
    estado_pcm VARCHAR(50) NOT NULL DEFAULT '',
    observaciones_pcm VARCHAR(500) NOT NULL DEFAULT '',
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    fec_registro DATE NOT NULL DEFAULT CURRENT_DATE,
    usuario_registra UUID NOT NULL,                -- UUID para FK
    activo BOOLEAN NOT NULL DEFAULT true,
    anio_inicio_pei BIGINT,
    anio_fin_pei BIGINT,
    objetivo_pei VARCHAR(1000),
    descripcion_pei VARCHAR(2000),
    alineado_pgd BOOLEAN NOT NULL DEFAULT false,
    fecha_aprobacion_pei DATE,
    ruta_pdf_pei VARCHAR(255),
    criterios_evaluados JSONB,
    
    -- Foreign Keys
    CONSTRAINT fk_com4_entidad FOREIGN KEY (entidad_id) REFERENCES entidades(entidad_id),
    CONSTRAINT fk_com4_usuario FOREIGN KEY (usuario_registra) REFERENCES usuarios(user_id)
);

-- Índices
CREATE INDEX idx_com4_tdpei_entidad ON com4_tdpei(entidad_id);
CREATE INDEX idx_com4_tdpei_compromiso ON com4_tdpei(compromiso_id);
CREATE INDEX idx_com4_tdpei_estado ON com4_tdpei(estado);

COMMENT ON TABLE com4_tdpei IS 'Compromiso 4: Incorporar Transformación Digital en el PEI';

-- =====================================================
-- 2. RECREAR com5_destrategiad CON TIPOS CORRECTOS (UUID)
-- =====================================================

DROP TABLE IF EXISTS com5_destrategiad CASCADE;

CREATE TABLE com5_destrategiad (
    comded_ent_id BIGSERIAL PRIMARY KEY,
    compromiso_id BIGINT NOT NULL,
    entidad_id UUID NOT NULL,                      -- UUID para FK
    etapa_formulario VARCHAR(20) NOT NULL DEFAULT 'paso1',
    estado VARCHAR(15) NOT NULL DEFAULT 'bandeja',
    check_privacidad BOOLEAN NOT NULL DEFAULT false,
    check_ddjj BOOLEAN NOT NULL DEFAULT false,
    estado_pcm VARCHAR(50) NOT NULL DEFAULT '',
    observaciones_pcm VARCHAR(500) NOT NULL DEFAULT '',
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    fec_registro DATE NOT NULL DEFAULT CURRENT_DATE,
    usuario_registra UUID NOT NULL,                -- UUID para FK
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
    criterios_evaluados JSONB,
    
    -- Foreign Keys
    CONSTRAINT fk_com5_entidad FOREIGN KEY (entidad_id) REFERENCES entidades(entidad_id),
    CONSTRAINT fk_com5_usuario FOREIGN KEY (usuario_registra) REFERENCES usuarios(user_id)
);

-- Índices
CREATE INDEX idx_com5_destrategiad_entidad ON com5_destrategiad(entidad_id);
CREATE INDEX idx_com5_destrategiad_compromiso ON com5_destrategiad(compromiso_id);
CREATE INDEX idx_com5_destrategiad_estado ON com5_destrategiad(estado);

COMMENT ON TABLE com5_destrategiad IS 'Compromiso 5: Contar con una Estrategia de Transformación Digital';

COMMIT;

-- Verificación
SELECT 'com4_tdpei recreada con UUID' AS status;
SELECT 'com5_destrategiad recreada con UUID' AS status;

\d com4_tdpei
\d com5_destrategiad
