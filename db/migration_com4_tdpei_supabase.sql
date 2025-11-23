-- Migración: Actualizar tabla com4_tdpei para homologar con Supabase
-- Compromiso 4: Incorporar TD en el PEI
-- Fecha: 2025-11-23

-- Eliminar tabla local si existe
DROP TABLE IF EXISTS com4_pei CASCADE;

-- Crear tabla com4_tdpei según schema de Supabase
CREATE TABLE com4_tdpei (
    comtdpei_ent_id SERIAL PRIMARY KEY,
    compromiso_id BIGINT NOT NULL,
    entidad_id BIGINT NOT NULL,
    etapa_formulario VARCHAR(20) NOT NULL,
    estado VARCHAR(15) NOT NULL,
    check_privacidad BOOLEAN NOT NULL,
    check_ddjj BOOLEAN NOT NULL,
    estado_PCM VARCHAR(50) NOT NULL,
    observaciones_PCM VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fec_registro DATE NOT NULL,
    usuario_registra BIGINT NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT true,
    anio_inicio_pei BIGINT NOT NULL,
    anio_fin_pei BIGINT NOT NULL,
    objetivo_pei VARCHAR(255) NOT NULL,
    descripcion_pei VARCHAR(255) NOT NULL,
    alineado_pgd BOOLEAN NOT NULL,
    fecha_aprobacion_pei DATE NOT NULL,
    ruta_pdf_pei VARCHAR(255) NOT NULL
);

-- Crear índices
CREATE INDEX idx_com4_tdpei_compromiso ON com4_tdpei(compromiso_id);
CREATE INDEX idx_com4_tdpei_entidad ON com4_tdpei(entidad_id);
CREATE INDEX idx_com4_tdpei_estado ON com4_tdpei(estado);

-- Comentarios
COMMENT ON TABLE com4_tdpei IS 'Compromiso 4: Incorporar TD en el PEI';
COMMENT ON COLUMN com4_tdpei.comtdpei_ent_id IS 'ID único del registro';
COMMENT ON COLUMN com4_tdpei.anio_inicio_pei IS 'Año de inicio del PEI';
COMMENT ON COLUMN com4_tdpei.anio_fin_pei IS 'Año de fin del PEI';
COMMENT ON COLUMN com4_tdpei.objetivo_pei IS 'Objetivo estratégico vinculado a TD';
COMMENT ON COLUMN com4_tdpei.descripcion_pei IS 'Descripción de incorporación de TD';

DO $$
BEGIN
    RAISE NOTICE 'Tabla com4_tdpei creada exitosamente';
END $$;
