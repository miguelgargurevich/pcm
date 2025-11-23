-- =============================================
-- SCRIPT: Actualizar estructura de tablas COM en local
-- DESCRIPCIÓN: Actualiza las tablas com* para que coincidan con Supabase
-- FECHA: 2025-11-22
-- =============================================

BEGIN;

-- ===================================
-- 1. RECREAR COM2_CGTD (Comité de Gobierno y Transformación Digital)
-- ===================================

DROP TABLE IF EXISTS com2_cgtd CASCADE;

CREATE TABLE com2_cgtd (
    comcgtd_ent_id BIGINT PRIMARY KEY,
    compromiso_id BIGINT NOT NULL,
    entidad_id BIGINT NOT NULL,
    etapa_formulario CHARACTER VARYING(20) NOT NULL,
    estado CHARACTER VARYING(15) NOT NULL,
    check_privacidad BOOLEAN NOT NULL,
    check_ddjj BOOLEAN NOT NULL,
    estado_PCM CHARACTER VARYING(50) NOT NULL,
    observaciones_PCM CHARACTER VARYING(500) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    fec_registro DATE NOT NULL,
    usuario_registra BIGINT NOT NULL,
    activo BOOLEAN NOT NULL
);

-- ===================================
-- 2. ACTUALIZAR COMITE_MIEMBROS
-- ===================================

-- Primero verificar la estructura actual
DO $$
BEGIN
    -- Eliminar columna antigua si existe
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'comite_miembros' AND column_name = 'com2_id') THEN
        ALTER TABLE comite_miembros DROP COLUMN com2_id CASCADE;
    END IF;
    
    -- Agregar columna nueva si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'comite_miembros' AND column_name = 'com_entidad_id') THEN
        ALTER TABLE comite_miembros ADD COLUMN com_entidad_id BIGINT;
    END IF;
END $$;

-- ===================================
-- 3. ACTUALIZAR CAPACITACIONES_SEGINFO
-- ===================================

-- Eliminar columna created_at si existe (Supabase no la tiene)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'capacitaciones_seginfo' AND column_name = 'created_at') THEN
        ALTER TABLE capacitaciones_seginfo DROP COLUMN created_at;
        RAISE NOTICE '✅ Columna created_at eliminada de capacitaciones_seginfo';
    END IF;
END $$;

-- ===================================
-- 4. ACTUALIZAR PARAMETROS
-- ===================================

-- Restructurar tabla parametros (de 8 a 3 columnas)
DROP TABLE IF EXISTS parametros CASCADE;

CREATE TABLE parametros (
    id BIGINT PRIMARY KEY,
    param_valor CHARACTER VARYING(100) NOT NULL,
    param_nombre CHARACTER VARYING(100) NOT NULL
);

COMMENT ON TABLE parametros IS 'Tabla simplificada de parámetros del sistema';

-- ===================================
-- 5. CREAR LOG_AUDITORIA (falta en local)
-- ===================================

CREATE TABLE IF NOT EXISTS log_auditoria (
    log_id SERIAL PRIMARY KEY,
    usuario_id UUID,
    accion VARCHAR(100) NOT NULL,
    tabla_afectada VARCHAR(100),
    registro_id VARCHAR(100),
    descripcion TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_log_auditoria_usuario ON log_auditoria(usuario_id);
CREATE INDEX IF NOT EXISTS idx_log_auditoria_tabla ON log_auditoria(tabla_afectada);
CREATE INDEX IF NOT EXISTS idx_log_auditoria_fecha ON log_auditoria(created_at);

COMMENT ON TABLE log_auditoria IS 'Registro de auditoría de acciones del sistema';

-- ===================================
-- 6. ACTUALIZAR UBIGEO_BACKUP
-- ===================================

-- Agregar columnas faltantes si no existen
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ubigeo_backup' AND column_name = 'ubigeo_id') THEN
        ALTER TABLE ubigeo_backup ADD COLUMN ubigeo_id UUID;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ubigeo_backup' AND column_name = 'UBDEP') THEN
        ALTER TABLE ubigeo_backup ADD COLUMN UBDEP VARCHAR(10);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ubigeo_backup' AND column_name = 'UBPRV') THEN
        ALTER TABLE ubigeo_backup ADD COLUMN UBPRV VARCHAR(10);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ubigeo_backup' AND column_name = 'UBDIS') THEN
        ALTER TABLE ubigeo_backup ADD COLUMN UBDIS VARCHAR(10);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ubigeo_backup' AND column_name = 'UBLOC') THEN
        ALTER TABLE ubigeo_backup ADD COLUMN UBLOC VARCHAR(20);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ubigeo_backup' AND column_name = 'COREG') THEN
        ALTER TABLE ubigeo_backup ADD COLUMN COREG VARCHAR(10);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ubigeo_backup' AND column_name = 'NOMDEP') THEN
        ALTER TABLE ubigeo_backup ADD COLUMN NOMDEP VARCHAR(100);
    END IF;
END $$;

COMMIT;

-- Verificación
SELECT 
    tablename as "Tabla",
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = tablename AND table_schema = 'public') as "Columnas"
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('com2_cgtd', 'comite_miembros', 'capacitaciones_seginfo', 'parametros', 'log_auditoria', 'ubigeo_backup')
ORDER BY tablename;

SELECT '✅ Estructura local actualizada para coincidir con Supabase' as resultado;
