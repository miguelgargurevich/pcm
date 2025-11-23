-- =============================================
-- SCRIPT: Recrear tablas COM 2-21 en local
-- DESCRIPCIÓN: Recrea todas las tablas com2-com21 con la estructura de Supabase
-- FECHA: 2025-11-22
-- IMPORTANTE: Este script eliminará y recreará las tablas. Asegúrate de hacer backup si tienes datos importantes.
-- =============================================

BEGIN;

-- ===================================
-- COM2_CGTD - Comité de Gobierno y Transformación Digital
-- ===================================
DROP TABLE IF EXISTS com2_cgtd CASCADE;
CREATE TABLE com2_cgtd (
    comcgtd_ent_id BIGSERIAL PRIMARY KEY,
    compromiso_id BIGINT NOT NULL,
    entidad_id BIGINT NOT NULL,
    etapa_formulario VARCHAR(20) NOT NULL,
    estado VARCHAR(15) NOT NULL,
    check_privacidad BOOLEAN NOT NULL,
    check_ddjj BOOLEAN NOT NULL,
    estado_PCM VARCHAR(50) NOT NULL,
    observaciones_PCM VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    fec_registro DATE NOT NULL,
    usuario_registra BIGINT NOT NULL,
    activo BOOLEAN NOT NULL
);

-- ===================================
-- COM3_EPGD - Estrategia de Participación en Gobierno Digital
-- ===================================
DROP TABLE IF EXISTS com3_epgd CASCADE;
CREATE TABLE com3_epgd (
    comepgd_ent_id BIGSERIAL PRIMARY KEY,
    compromiso_id BIGINT NOT NULL,
    entidad_id BIGINT NOT NULL,
    etapa_formulario VARCHAR(20) NOT NULL,
    estado VARCHAR(15) NOT NULL,
    check_privacidad BOOLEAN NOT NULL,
    check_ddjj BOOLEAN NOT NULL,
    estado_PCM VARCHAR(50) NOT NULL,
    observaciones_PCM VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    fec_registro DATE NOT NULL,
    usuario_registra BIGINT NOT NULL,
    activo BOOLEAN NOT NULL,
    -- Campos específicos de COM3
    fecha_aprobacion DATE,
    numero_resolucion VARCHAR(50),
    archivo_estrategia VARCHAR(500),
    descripcion TEXT,
    objetivos TEXT,
    alcance TEXT,
    fecha_inicio DATE,
    fecha_fin DATE
);

-- ===================================
-- COM4_TDPEI - Transformación Digital en el Plan Estratégico Institucional
-- ===================================
DROP TABLE IF EXISTS com4_tdpei CASCADE;
CREATE TABLE com4_tdpei (
    comtdpei_ent_id BIGSERIAL PRIMARY KEY,
    compromiso_id BIGINT NOT NULL,
    entidad_id BIGINT NOT NULL,
    etapa_formulario VARCHAR(20) NOT NULL,
    estado VARCHAR(15) NOT NULL,
    check_privacidad BOOLEAN NOT NULL,
    check_ddjj BOOLEAN NOT NULL,
    estado_PCM VARCHAR(50) NOT NULL,
    observaciones_PCM VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    fec_registro DATE NOT NULL,
    usuario_registra BIGINT NOT NULL,
    activo BOOLEAN NOT NULL,
    -- Campos específicos
    fecha_aprobacion DATE,
    numero_resolucion VARCHAR(50),
    archivo_pei VARCHAR(500),
    descripcion TEXT,
    objetivo_estrategico TEXT,
    indicadores TEXT,
    metas TEXT
);

-- ===================================
-- COM5_DESTRATEGIAD - Designación Estratégica Digital
-- ===================================
DROP TABLE IF EXISTS com5_destrategiad CASCADE;
CREATE TABLE com5_destrategiad (
    comded_ent_id BIGSERIAL PRIMARY KEY,
    compromiso_id BIGINT NOT NULL,
    entidad_id BIGINT NOT NULL,
    etapa_formulario VARCHAR(20) NOT NULL,
    estado VARCHAR(15) NOT NULL,
    check_privacidad BOOLEAN NOT NULL,
    check_ddjj BOOLEAN NOT NULL,
    estado_PCM VARCHAR(50) NOT NULL,
    observaciones_PCM VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    fec_registro DATE NOT NULL,
    usuario_registra BIGINT NOT NULL,
    activo BOOLEAN NOT NULL,
    -- Campos específicos
    fecha_designacion DATE,
    numero_resolucion VARCHAR(50),
    dni_responsable VARCHAR(12),
    nombre_responsable VARCHAR(200),
    cargo VARCHAR(100),
    email VARCHAR(100),
    telefono VARCHAR(30)
);

-- ===================================
-- COM6_MPGOBPE - Marco de Políticas de Gobierno Digital del Perú
-- ===================================
DROP TABLE IF EXISTS com6_mpgobpe CASCADE;
CREATE TABLE com6_mpgobpe (
    commpgobpe_ent_id BIGSERIAL PRIMARY KEY,
    compromiso_id BIGINT NOT NULL,
    entidad_id BIGINT NOT NULL,
    etapa_formulario VARCHAR(20) NOT NULL,
    estado VARCHAR(15) NOT NULL,
    check_privacidad BOOLEAN NOT NULL,
    check_ddjj BOOLEAN NOT NULL,
    estado_PCM VARCHAR(50) NOT NULL,
    observaciones_PCM VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    fec_registro DATE NOT NULL,
    usuario_registra BIGINT NOT NULL,
    activo BOOLEAN NOT NULL,
    -- Campos específicos
    fecha_aprobacion DATE,
    numero_resolucion VARCHAR(50),
    archivo_marco VARCHAR(500),
    descripcion TEXT,
    politicas TEXT,
    lineamientos TEXT,
    fecha_vigencia DATE
);

-- ===================================
-- COM7_IMPD - Implementación de Metodología de Proyectos Digitales
-- ===================================
DROP TABLE IF EXISTS com7_impd CASCADE;
CREATE TABLE com7_impd (
    comimpd_ent_id BIGSERIAL PRIMARY KEY,
    compromiso_id BIGINT NOT NULL,
    entidad_id BIGINT NOT NULL,
    etapa_formulario VARCHAR(20) NOT NULL,
    estado VARCHAR(15) NOT NULL,
    check_privacidad BOOLEAN NOT NULL,
    check_ddjj BOOLEAN NOT NULL,
    estado_PCM VARCHAR(50) NOT NULL,
    observaciones_PCM VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    fec_registro DATE NOT NULL,
    usuario_registra BIGINT NOT NULL,
    activo BOOLEAN NOT NULL,
    -- Campos específicos
    metodologia VARCHAR(100),
    fecha_implementacion DATE,
    numero_resolucion VARCHAR(50),
    archivo_metodologia VARCHAR(500),
    descripcion TEXT,
    herramientas TEXT,
    capacitaciones_realizadas INT
);

-- ===================================
-- COM8_PTUPA - Plataforma de Trámites TUPA
-- ===================================
DROP TABLE IF EXISTS com8_ptupa CASCADE;
CREATE TABLE com8_ptupa (
    comptupa_ent_id BIGSERIAL PRIMARY KEY,
    compromiso_id BIGINT NOT NULL,
    entidad_id BIGINT NOT NULL,
    etapa_formulario VARCHAR(20) NOT NULL,
    estado VARCHAR(15) NOT NULL,
    check_privacidad BOOLEAN NOT NULL,
    check_ddjj BOOLEAN NOT NULL,
    estado_PCM VARCHAR(50) NOT NULL,
    observaciones_PCM VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    fec_registro DATE NOT NULL,
    usuario_registra BIGINT NOT NULL,
    activo BOOLEAN NOT NULL,
    -- Campos específicos
    url_plataforma VARCHAR(200),
    fecha_implementacion DATE,
    tramites_digitalizados INT,
    tramites_total INT,
    porcentaje_digitalizacion DECIMAL(5,2),
    archivo_evidencia VARCHAR(500),
    descripcion TEXT
);

-- ===================================
-- COM9_IMGD - Implementación de Marco de Gobernanza Digital
-- ===================================
DROP TABLE IF EXISTS com9_imgd CASCADE;
CREATE TABLE com9_imgd (
    comimgd_ent_id BIGSERIAL PRIMARY KEY,
    compromiso_id BIGINT NOT NULL,
    entidad_id BIGINT NOT NULL,
    etapa_formulario VARCHAR(20) NOT NULL,
    estado VARCHAR(15) NOT NULL,
    check_privacidad BOOLEAN NOT NULL,
    check_ddjj BOOLEAN NOT NULL,
    estado_PCM VARCHAR(50) NOT NULL,
    observaciones_PCM VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    fec_registro DATE NOT NULL,
    usuario_registra BIGINT NOT NULL,
    activo BOOLEAN NOT NULL,
    -- Campos específicos
    fecha_aprobacion DATE,
    numero_resolucion VARCHAR(50),
    archivo_marco VARCHAR(500),
    descripcion TEXT,
    estructura_organizacional TEXT,
    roles_responsabilidades TEXT,
    procesos TEXT
);

-- ===================================
-- COM10_PNDA - Plan Nacional de Datos Abiertos
-- ===================================
DROP TABLE IF EXISTS com10_pnda CASCADE;
CREATE TABLE com10_pnda (
    compnda_ent_id BIGSERIAL PRIMARY KEY,
    compromiso_id BIGINT NOT NULL,
    entidad_id BIGINT NOT NULL,
    etapa_formulario VARCHAR(20) NOT NULL,
    estado VARCHAR(15) NOT NULL,
    check_privacidad BOOLEAN NOT NULL,
    check_ddjj BOOLEAN NOT NULL,
    estado_PCM VARCHAR(50) NOT NULL,
    observaciones_PCM VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    fec_registro DATE NOT NULL,
    usuario_registra BIGINT NOT NULL,
    activo BOOLEAN NOT NULL,
    -- Campos específicos
    url_portal VARCHAR(200),
    datasets_publicados INT,
    fecha_ultima_actualizacion DATE,
    formato_datos VARCHAR(50),
    licencia VARCHAR(100),
    archivo_plan VARCHAR(500),
    descripcion TEXT
);

-- ===================================
-- COM11_AGEOP - Adopción de Gobierno Electrónico y Operaciones
-- ===================================
DROP TABLE IF EXISTS com11_ageop CASCADE;
CREATE TABLE com11_ageop (
    comageop_ent_id BIGSERIAL PRIMARY KEY,
    compromiso_id BIGINT NOT NULL,
    entidad_id BIGINT NOT NULL,
    etapa_formulario VARCHAR(20) NOT NULL,
    estado VARCHAR(15) NOT NULL,
    check_privacidad BOOLEAN NOT NULL,
    check_ddjj BOOLEAN NOT NULL,
    estado_PCM VARCHAR(50) NOT NULL,
    observaciones_PCM VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    fec_registro DATE NOT NULL,
    usuario_registra BIGINT NOT NULL,
    activo BOOLEAN NOT NULL,
    -- Campos específicos
    fecha_inicio DATE,
    fecha_fin DATE,
    servicios_digitalizados INT,
    servicios_total INT,
    porcentaje_digitalizacion DECIMAL(5,2),
    archivo_plan VARCHAR(500),
    descripcion TEXT,
    beneficiarios_estimados INT
);

-- ===================================
-- COM12_DRSP - Documento de Requisitos de Seguridad y Privacidad
-- ===================================
DROP TABLE IF EXISTS com12_drsp CASCADE;
CREATE TABLE com12_drsp (
    comdrsp_ent_id BIGSERIAL PRIMARY KEY,
    compromiso_id BIGINT NOT NULL,
    entidad_id BIGINT NOT NULL,
    etapa_formulario VARCHAR(20) NOT NULL,
    estado VARCHAR(15) NOT NULL,
    check_privacidad BOOLEAN NOT NULL,
    check_ddjj BOOLEAN NOT NULL,
    estado_PCM VARCHAR(50) NOT NULL,
    observaciones_PCM VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    fec_registro DATE NOT NULL,
    usuario_registra BIGINT NOT NULL,
    activo BOOLEAN NOT NULL,
    -- Campos específicos
    fecha_elaboracion DATE,
    numero_documento VARCHAR(50),
    archivo_documento VARCHAR(500),
    descripcion TEXT,
    requisitos_seguridad TEXT,
    requisitos_privacidad TEXT,
    fecha_vigencia DATE
);

-- ===================================
-- COM13_PCPIDE - Plan de Continuidad de Proyectos de Infraestructura Digital del Estado
-- ===================================
DROP TABLE IF EXISTS com13_pcpide CASCADE;
CREATE TABLE com13_pcpide (
    compcpide_ent_id BIGSERIAL PRIMARY KEY,
    compromiso_id BIGINT NOT NULL,
    entidad_id BIGINT NOT NULL,
    etapa_formulario VARCHAR(20) NOT NULL,
    estado VARCHAR(15) NOT NULL,
    check_privacidad BOOLEAN NOT NULL,
    check_ddjj BOOLEAN NOT NULL,
    estado_PCM VARCHAR(50) NOT NULL,
    observaciones_PCM VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    fec_registro DATE NOT NULL,
    usuario_registra BIGINT NOT NULL,
    activo BOOLEAN NOT NULL,
    -- Campos específicos
    fecha_aprobacion DATE,
    numero_resolucion VARCHAR(50),
    archivo_plan VARCHAR(500),
    descripcion TEXT,
    riesgos_identificados TEXT,
    estrategias_mitigacion TEXT,
    fecha_revision DATE,
    responsable VARCHAR(200)
);

-- ===================================
-- COM14_DOSCD - Documento de Seguridad y Confianza Digital
-- ===================================
DROP TABLE IF EXISTS com14_doscd CASCADE;
CREATE TABLE com14_doscd (
    comdoscd_ent_id BIGSERIAL PRIMARY KEY,
    compromiso_id BIGINT NOT NULL,
    entidad_id BIGINT NOT NULL,
    etapa_formulario VARCHAR(20) NOT NULL,
    estado VARCHAR(15) NOT NULL,
    check_privacidad BOOLEAN NOT NULL,
    check_ddjj BOOLEAN NOT NULL,
    estado_PCM VARCHAR(50) NOT NULL,
    observaciones_PCM VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    fec_registro DATE NOT NULL,
    usuario_registra BIGINT NOT NULL,
    activo BOOLEAN NOT NULL,
    -- Campos específicos
    fecha_elaboracion DATE,
    numero_documento VARCHAR(50),
    archivo_documento VARCHAR(500),
    descripcion TEXT,
    politicas_seguridad TEXT,
    certificaciones TEXT,
    fecha_vigencia DATE
);

-- ===================================
-- COM15_CSIRT - Centro de Respuesta a Incidentes de Seguridad Informática
-- ===================================
DROP TABLE IF EXISTS com15_csirt CASCADE;
CREATE TABLE com15_csirt (
    comcsirt_ent_id BIGSERIAL PRIMARY KEY,
    compromiso_id BIGINT NOT NULL,
    entidad_id BIGINT NOT NULL,
    etapa_formulario VARCHAR(20) NOT NULL,
    estado VARCHAR(15) NOT NULL,
    check_privacidad BOOLEAN NOT NULL,
    check_ddjj BOOLEAN NOT NULL,
    estado_PCM VARCHAR(50) NOT NULL,
    observaciones_PCM VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    fec_registro DATE NOT NULL,
    usuario_registra BIGINT NOT NULL,
    activo BOOLEAN NOT NULL,
    -- Campos específicos
    fecha_conformacion DATE,
    numero_resolucion VARCHAR(50),
    responsable VARCHAR(200),
    email_contacto VARCHAR(100),
    telefono_contacto VARCHAR(30),
    archivo_procedimientos VARCHAR(500),
    descripcion TEXT
);

-- ===================================
-- COM16_SGSI - Sistema de Gestión de Seguridad de la Información
-- ===================================
DROP TABLE IF EXISTS com16_sgsi CASCADE;
CREATE TABLE com16_sgsi (
    comsgsi_ent_id BIGSERIAL PRIMARY KEY,
    compromiso_id BIGINT NOT NULL,
    entidad_id BIGINT NOT NULL,
    etapa_formulario VARCHAR(20) NOT NULL,
    estado VARCHAR(15) NOT NULL,
    check_privacidad BOOLEAN NOT NULL,
    check_ddjj BOOLEAN NOT NULL,
    estado_PCM VARCHAR(50) NOT NULL,
    observaciones_PCM VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    fec_registro DATE NOT NULL,
    usuario_registra BIGINT NOT NULL,
    activo BOOLEAN NOT NULL,
    -- Campos específicos
    fecha_implementacion DATE,
    norma_aplicable VARCHAR(50),
    certificacion VARCHAR(100),
    fecha_certificacion DATE,
    archivo_certificado VARCHAR(500),
    descripcion TEXT,
    alcance TEXT
);

-- ===================================
-- COM17_PTIPV6 - Plan de Transición a IPv6
-- ===================================
DROP TABLE IF EXISTS com17_ptipv6 CASCADE;
CREATE TABLE com17_ptipv6 (
    comptipv6_ent_id BIGSERIAL PRIMARY KEY,
    compromiso_id BIGINT NOT NULL,
    entidad_id BIGINT NOT NULL,
    etapa_formulario VARCHAR(20) NOT NULL,
    estado VARCHAR(15) NOT NULL,
    check_privacidad BOOLEAN NOT NULL,
    check_ddjj BOOLEAN NOT NULL,
    estado_PCM VARCHAR(50) NOT NULL,
    observaciones_PCM VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    fec_registro DATE NOT NULL,
    usuario_registra BIGINT NOT NULL,
    activo BOOLEAN NOT NULL,
    -- Campos específicos
    fecha_inicio_transicion DATE,
    fecha_fin_transicion DATE,
    porcentaje_avance DECIMAL(5,2),
    sistemas_migrados INT,
    sistemas_total INT,
    archivo_plan VARCHAR(500),
    descripcion TEXT
);

-- ===================================
-- COM18_SAPTE - Servicios de Atención al Público y Trámites Electrónicos
-- ===================================
DROP TABLE IF EXISTS com18_sapte CASCADE;
CREATE TABLE com18_sapte (
    comsapte_ent_id BIGSERIAL PRIMARY KEY,
    compromiso_id BIGINT NOT NULL,
    entidad_id BIGINT NOT NULL,
    etapa_formulario VARCHAR(20) NOT NULL,
    estado VARCHAR(15) NOT NULL,
    check_privacidad BOOLEAN NOT NULL,
    check_ddjj BOOLEAN NOT NULL,
    estado_PCM VARCHAR(50) NOT NULL,
    observaciones_PCM VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    fec_registro DATE NOT NULL,
    usuario_registra BIGINT NOT NULL,
    activo BOOLEAN NOT NULL,
    -- Campos específicos
    url_plataforma VARCHAR(200),
    fecha_implementacion DATE,
    tramites_disponibles INT,
    usuarios_registrados INT,
    tramites_procesados INT,
    archivo_evidencia VARCHAR(500),
    descripcion TEXT
);

-- ===================================
-- COM19_RENAD - Red Nacional de Datos
-- ===================================
DROP TABLE IF EXISTS com19_renad CASCADE;
CREATE TABLE com19_renad (
    comrenad_ent_id BIGSERIAL PRIMARY KEY,
    compromiso_id BIGINT NOT NULL,
    entidad_id BIGINT NOT NULL,
    etapa_formulario VARCHAR(20) NOT NULL,
    estado VARCHAR(15) NOT NULL,
    check_privacidad BOOLEAN NOT NULL,
    check_ddjj BOOLEAN NOT NULL,
    estado_PCM VARCHAR(50) NOT NULL,
    observaciones_PCM VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    fec_registro DATE NOT NULL,
    usuario_registra BIGINT NOT NULL,
    activo BOOLEAN NOT NULL,
    -- Campos específicos
    fecha_conexion DATE,
    tipo_conexion VARCHAR(50),
    ancho_banda VARCHAR(50),
    proveedor VARCHAR(100),
    archivo_contrato VARCHAR(500),
    descripcion TEXT
);

-- ===================================
-- COM20_DSFPE - Documentación de Sistemas y Facilidades de Proyectos del Estado
-- ===================================
DROP TABLE IF EXISTS com20_dsfpe CASCADE;
CREATE TABLE com20_dsfpe (
    comdsfpe_ent_id BIGSERIAL PRIMARY KEY,
    compromiso_id BIGINT NOT NULL,
    entidad_id BIGINT NOT NULL,
    etapa_formulario VARCHAR(20) NOT NULL,
    estado VARCHAR(15) NOT NULL,
    check_privacidad BOOLEAN NOT NULL,
    check_ddjj BOOLEAN NOT NULL,
    estado_PCM VARCHAR(50) NOT NULL,
    observaciones_PCM VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    fec_registro DATE NOT NULL,
    usuario_registra BIGINT NOT NULL,
    activo BOOLEAN NOT NULL,
    -- Campos específicos
    sistemas_documentados INT,
    sistemas_total INT,
    porcentaje_documentacion DECIMAL(5,2),
    archivo_repositorio VARCHAR(500),
    descripcion TEXT
);

-- ===================================
-- COM21_DOGD - Documento de Operaciones de Gobierno Digital
-- ===================================
DROP TABLE IF EXISTS com21_dogd CASCADE;
CREATE TABLE com21_dogd (
    comdogd_ent_id BIGSERIAL PRIMARY KEY,
    compromiso_id BIGINT NOT NULL,
    entidad_id BIGINT NOT NULL,
    etapa_formulario VARCHAR(20) NOT NULL,
    estado VARCHAR(15) NOT NULL,
    check_privacidad BOOLEAN NOT NULL,
    check_ddjj BOOLEAN NOT NULL,
    estado_PCM VARCHAR(50) NOT NULL,
    observaciones_PCM VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    fec_registro DATE NOT NULL,
    usuario_registra BIGINT NOT NULL,
    activo BOOLEAN NOT NULL,
    -- Campos específicos
    fecha_elaboracion DATE,
    numero_documento VARCHAR(50),
    archivo_documento VARCHAR(500),
    descripcion TEXT,
    procedimientos TEXT,
    responsables TEXT,
    fecha_vigencia DATE
);

-- ===================================
-- Actualizar COMITE_MIEMBROS y CAPACITACIONES_SEGINFO
-- ===================================

DROP TABLE IF EXISTS comite_miembros CASCADE;
CREATE TABLE comite_miembros (
    miembro_id BIGSERIAL PRIMARY KEY,
    com_entidad_id BIGINT,
    dni VARCHAR(12),
    nombre VARCHAR(100),
    apellido_paterno VARCHAR(60),
    apellido_materno VARCHAR(60),
    cargo VARCHAR(100),
    email VARCHAR(100),
    telefono VARCHAR(30),
    rol VARCHAR(50),
    fecha_inicio DATE,
    fecha_fin DATE,
    activo BOOLEAN,
    created_at TIMESTAMP
);

DROP TABLE IF EXISTS capacitaciones_seginfo CASCADE;
CREATE TABLE capacitaciones_seginfo (
    capseg_id BIGSERIAL PRIMARY KEY,
    com_entidad_id BIGINT,
    curso VARCHAR(200),
    cantidad_personas INT
);

COMMIT;

-- Verificación
SELECT 
    tablename as "Tabla",
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = tablename AND table_schema = 'public') as "Columnas"
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename LIKE 'com%'
ORDER BY tablename;

SELECT '✅ Todas las tablas COM 2-21 recreadas correctamente' as resultado;
