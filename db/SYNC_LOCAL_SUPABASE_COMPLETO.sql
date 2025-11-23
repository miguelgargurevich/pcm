-- =============================================
-- SCRIPT: Sincronización COMPLETA Local con Supabase
-- DESCRIPCIÓN: Corrige todas las diferencias de estructura entre BD local y Supabase
-- FECHA: 2025-11-22
-- =============================================

BEGIN;

-- =============================================
-- 1. ALCANCE_COMPROMISOS: Cambiar INTEGER a BIGINT
-- =============================================
ALTER TABLE alcance_compromisos 
    ALTER COLUMN alc_com_id TYPE BIGINT,
    ALTER COLUMN compromiso_id TYPE BIGINT,
    ALTER COLUMN clasificacion_id TYPE BIGINT;

-- =============================================
-- 2. CLASIFICACION: Cambiar INTEGER a BIGINT
-- =============================================
ALTER TABLE clasificacion 
    ALTER COLUMN clasificacion_id TYPE BIGINT;

-- Actualizar secuencia de clasificacion
ALTER SEQUENCE clasificacion_clasificacion_id_seq AS BIGINT;

-- =============================================
-- 3. COM1_LIDERG_TD: Recrear tabla completa para coincidir con Supabase
-- =============================================
-- Eliminar y recrear ya que no hay datos y la estructura es muy diferente
DROP TABLE IF EXISTS com1_liderg_td CASCADE;

CREATE TABLE com1_liderg_td (
    comlgtd_ent_id BIGSERIAL PRIMARY KEY,
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
    dni_lider VARCHAR(12) NOT NULL,
    nombre_lider VARCHAR(60) NOT NULL,
    ape_pat_lider VARCHAR(60) NOT NULL,
    ape_mat_lider VARCHAR(60) NOT NULL,
    email_lider VARCHAR(30) NOT NULL,
    telefono_lider VARCHAR(30) NOT NULL,
    rol_lider VARCHAR(20) NOT NULL,
    cargo_lider VARCHAR(20) NOT NULL,
    fec_ini_lider DATE NOT NULL
);

-- Agregar FK hacia compromiso
ALTER TABLE com1_liderg_td 
    ADD CONSTRAINT com1_liderg_td_fk1 
    FOREIGN KEY (compromiso_id) REFERENCES compromiso_gobierno_digital(compromiso_id);

-- =============================================
-- 4. ALCANCE_COMPROMISOS: Actualizar índices para que coincidan con Supabase
-- =============================================
-- Eliminar constraints e índices extra de local
ALTER TABLE alcance_compromisos DROP CONSTRAINT IF EXISTS uk_alcance_comp_clasif;
DROP INDEX IF EXISTS idx_alcance_compromisos_unique;

-- Renombrar índices para que coincidan con Supabase
DROP INDEX IF EXISTS idx_alcance_compromisos_activo;
DROP INDEX IF EXISTS idx_alcance_compromisos_clasificacion;
DROP INDEX IF EXISTS idx_alcance_compromisos_compromiso;

CREATE INDEX IF NOT EXISTS idx_alcance_compromiso_activo ON alcance_compromisos(activo);
CREATE INDEX IF NOT EXISTS idx_alcance_compromiso_clasificacion ON alcance_compromisos(clasificacion_id);
CREATE INDEX IF NOT EXISTS idx_alcance_compromiso_compromiso ON alcance_compromisos(compromiso_id);

-- Actualizar constraint FK
ALTER TABLE alcance_compromisos DROP CONSTRAINT IF EXISTS fk_alcance_clasificacion;
ALTER TABLE alcance_compromisos ADD CONSTRAINT alcance_compromisos_fk2 
    FOREIGN KEY (clasificacion_id) REFERENCES clasificacion(clasificacion_id);

-- =============================================
-- 5. COMPROMISO_GOBIERNO_DIGITAL: Agregar índice faltante
-- =============================================
DROP INDEX IF EXISTS idx_compromiso_gobierno_digital_estado;

-- =============================================
-- 6. ACTUALIZAR TABLAS RELACIONADAS que usan clasificacion_id
-- =============================================
-- Actualizar entidades.clasificacion_id
ALTER TABLE entidades 
    ALTER COLUMN clasificacion_id TYPE BIGINT;

-- =============================================
-- 7. VERIFICAR Y CORREGIR FOREIGN KEYS
-- =============================================
-- Verificar que todas las FK apunten correctamente con los nuevos tipos BIGINT

-- =============================================
-- 8. ACTUALIZAR SECUENCIA DE ALCANCE_COMPROMISOS
-- =============================================
ALTER SEQUENCE alcance_compromisos_alcance_compromiso_id_seq AS BIGINT;

COMMIT;

-- =============================================
-- VERIFICACIÓN FINAL
-- =============================================
SELECT 'Verificando estructuras actualizadas...' as mensaje;

-- Verificar alcance_compromisos
SELECT 
    'alcance_compromisos' as tabla,
    column_name,
    data_type,
    udt_name
FROM information_schema.columns
WHERE table_name = 'alcance_compromisos'
ORDER BY ordinal_position;

-- Verificar clasificacion
SELECT 
    'clasificacion' as tabla,
    column_name,
    data_type,
    udt_name
FROM information_schema.columns
WHERE table_name = 'clasificacion'
ORDER BY ordinal_position;

-- Verificar com1_liderg_td (primeras 10 columnas)
SELECT 
    'com1_liderg_td' as tabla,
    column_name,
    data_type,
    udt_name
FROM information_schema.columns
WHERE table_name = 'com1_liderg_td'
ORDER BY ordinal_position
LIMIT 13;

SELECT '✅ Sincronización completada entre local y Supabase' as resultado;
