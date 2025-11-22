-- Script para LOCAL: Actualizar tabla com1_liderg_td para igualar a PRODUCCIÓN
-- Extraído de PRODUCCION_seed_21_compromisos.sql (PARTE 3)

-- ============================================
-- PARTE 3: ACTUALIZAR TABLA COM1_LIDERG_TD
-- ============================================

-- Agregar nuevas columnas necesarias
ALTER TABLE com1_liderg_td
  ADD COLUMN IF NOT EXISTS comlgtd_ent_id BIGSERIAL,
  ADD COLUMN IF NOT EXISTS compromiso_id INTEGER,
  ADD COLUMN IF NOT EXISTS entidad_id UUID,
  ADD COLUMN IF NOT EXISTS etapa_formulario VARCHAR(20) DEFAULT 'paso1',
  ADD COLUMN IF NOT EXISTS estado VARCHAR(20) DEFAULT 'bandeja',
  ADD COLUMN IF NOT EXISTS check_privacidad BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS check_ddjj BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS estado_PCM VARCHAR(20) DEFAULT 'en_revision',
  ADD COLUMN IF NOT EXISTS observaciones_PCM TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS fec_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS usuario_registra UUID,
  ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;

-- Renombrar columna
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'com1_liderg_td' AND column_name = 'fecha_inicio_lider'
  ) THEN
    ALTER TABLE com1_liderg_td RENAME COLUMN fecha_inicio_lider TO fec_ini_lider;
  END IF;
END $$;

-- Eliminar columna no necesaria
ALTER TABLE com1_liderg_td DROP COLUMN IF EXISTS fecha_fin_lider;

-- Hacer columnas nullable
ALTER TABLE com1_liderg_td
  ALTER COLUMN dni_lider DROP NOT NULL,
  ALTER COLUMN nombre_lider DROP NOT NULL,
  ALTER COLUMN ape_pat_lider DROP NOT NULL,
  ALTER COLUMN ape_mat_lider DROP NOT NULL,
  ALTER COLUMN email_lider DROP NOT NULL,
  ALTER COLUMN fec_ini_lider DROP NOT NULL;

-- Eliminar constraint antigua
ALTER TABLE com1_liderg_td DROP CONSTRAINT IF EXISTS com1_liderg_td_compromiso_entidad_id_key;

-- Cambiar primary key
ALTER TABLE com1_liderg_td DROP CONSTRAINT IF EXISTS com1_liderg_td_pkey;
ALTER TABLE com1_liderg_td ADD CONSTRAINT com1_liderg_td_pkey PRIMARY KEY (comlgtd_ent_id);

-- Crear constraint única (con bloque condicional)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'com1_liderg_td_unique_compromiso_entidad'
  ) THEN
    ALTER TABLE com1_liderg_td
      ADD CONSTRAINT com1_liderg_td_unique_compromiso_entidad 
      UNIQUE (compromiso_id, entidad_id);
  END IF;
END $$;

-- Agregar foreign keys (con bloque condicional)
DO $$ 
BEGIN
  -- Eliminar constraints anteriores si existen
  ALTER TABLE com1_liderg_td DROP CONSTRAINT IF EXISTS com1_liderg_td_fk1;
  ALTER TABLE com1_liderg_td DROP CONSTRAINT IF EXISTS com1_liderg_td_fk2;
  
  -- Crear foreign key 1
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'com1_liderg_td_fk1'
  ) THEN
    ALTER TABLE com1_liderg_td
      ADD CONSTRAINT com1_liderg_td_fk1 
      FOREIGN KEY (compromiso_id) 
      REFERENCES compromiso_gobierno_digital(compromiso_id);
  END IF;
  
  -- Crear foreign key 2
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'com1_liderg_td_fk2'
  ) THEN
    ALTER TABLE com1_liderg_td
      ADD CONSTRAINT com1_liderg_td_fk2 
      FOREIGN KEY (entidad_id) 
      REFERENCES entidades(entidad_id);
  END IF;
END $$;

-- Eliminar columnas antiguas
ALTER TABLE com1_liderg_td
  DROP COLUMN IF EXISTS com1_id,
  DROP COLUMN IF EXISTS compromiso_entidad_id;

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Verificar estructura de com1_liderg_td
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'com1_liderg_td' 
ORDER BY ordinal_position;
