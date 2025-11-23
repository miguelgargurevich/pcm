-- Migración: Actualizar tabla com5_destrategiad para homologar con Supabase
-- Compromiso 5: Estrategia Digital
-- Fecha: 2025-11-23

-- Eliminar tabla local si existe
DROP TABLE IF EXISTS com5_estrategia_digital CASCADE;

-- Crear tabla com5_destrategiad según schema de Supabase
CREATE TABLE com5_destrategiad (
    comded_ent_id SERIAL PRIMARY KEY,
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
    nombre_estrategia VARCHAR(150) NOT NULL,
    periodo_inicio_estrategia BIGINT NOT NULL,
    periodo_fin_estrategia BIGINT NOT NULL,
    objetivos_estrategicos VARCHAR(255) NOT NULL,
    lineas_accion VARCHAR(255) NOT NULL,
    fecha_aprobacion_estrategia DATE NOT NULL,
    alineado_pgd_estrategia BOOLEAN NOT NULL,
    estado_implementacion_estrategia VARCHAR(50) NOT NULL,
    ruta_pdf_estrategia VARCHAR(255) NOT NULL
);

-- Crear índices
CREATE INDEX idx_com5_destrategiad_compromiso ON com5_destrategiad(compromiso_id);
CREATE INDEX idx_com5_destrategiad_entidad ON com5_destrategiad(entidad_id);
CREATE INDEX idx_com5_destrategiad_estado ON com5_destrategiad(estado);

-- Comentarios
COMMENT ON TABLE com5_destrategiad IS 'Compromiso 5: Estrategia Digital';
COMMENT ON COLUMN com5_destrategiad.comded_ent_id IS 'ID único del registro';
COMMENT ON COLUMN com5_destrategiad.nombre_estrategia IS 'Nombre de la estrategia digital';
COMMENT ON COLUMN com5_destrategiad.periodo_inicio_estrategia IS 'Año de inicio';
COMMENT ON COLUMN com5_destrategiad.periodo_fin_estrategia IS 'Año de fin';

DO $$
BEGIN
    RAISE NOTICE 'Tabla com5_destrategiad creada exitosamente';
END $$;
