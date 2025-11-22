-- Migración para actualizar tabla com1_liderg_td con los campos necesarios del sistema PCM
-- Ejecutar en la base de datos local

-- Paso 1: Agregar nuevas columnas necesarias
ALTER TABLE com1_liderg_td
  -- Cambiar primary key de com1_id a comlgtd_ent_id
  ADD COLUMN IF NOT EXISTS comlgtd_ent_id BIGSERIAL,
  
  -- Separar compromiso_entidad_id en compromiso_id y entidad_id
  ADD COLUMN IF NOT EXISTS compromiso_id INTEGER,
  ADD COLUMN IF NOT EXISTS entidad_id UUID,
  
  -- Campos de workflow
  ADD COLUMN IF NOT EXISTS etapa_formulario VARCHAR(20) DEFAULT 'paso1',
  ADD COLUMN IF NOT EXISTS estado VARCHAR(20) DEFAULT 'bandeja',
  
  -- Campos de aceptación
  ADD COLUMN IF NOT EXISTS check_privacidad BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS check_ddjj BOOLEAN DEFAULT false,
  
  -- Campos de estado PCM
  ADD COLUMN IF NOT EXISTS estado_PCM VARCHAR(20) DEFAULT 'en_revision',
  ADD COLUMN IF NOT EXISTS observaciones_PCM TEXT,
  
  -- Campos de auditoría
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS fec_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS usuario_registra UUID,
  ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;

-- Paso 2: Renombrar fecha_inicio_lider a fec_ini_lider para consistencia
ALTER TABLE com1_liderg_td
  RENAME COLUMN fecha_inicio_lider TO fec_ini_lider;

-- Paso 3: Eliminar fecha_fin_lider (no es necesaria según requerimientos)
ALTER TABLE com1_liderg_td
  DROP COLUMN IF EXISTS fecha_fin_lider;

-- Paso 4: Hacer las columnas de líder nullable (pueden completarse en pasos)
ALTER TABLE com1_liderg_td
  ALTER COLUMN dni_lider DROP NOT NULL,
  ALTER COLUMN nombre_lider DROP NOT NULL,
  ALTER COLUMN ape_pat_lider DROP NOT NULL,
  ALTER COLUMN ape_mat_lider DROP NOT NULL,
  ALTER COLUMN email_lider DROP NOT NULL,
  ALTER COLUMN fec_ini_lider DROP NOT NULL;

-- Paso 5: Poblar compromiso_id y entidad_id desde compromiso_entidad_id (si hay datos)
-- UPDATE com1_liderg_td SET 
--   compromiso_id = 1,
--   entidad_id = (SELECT entidad_id FROM compromisos_entidades WHERE compromiso_entidad_id = com1_liderg_td.compromiso_entidad_id);

-- Paso 6: Eliminar la constraint única de compromiso_entidad_id
ALTER TABLE com1_liderg_td
  DROP CONSTRAINT IF EXISTS com1_liderg_td_compromiso_entidad_id_key;

-- Paso 7: Cambiar el primary key de com1_id a comlgtd_ent_id
ALTER TABLE com1_liderg_td
  DROP CONSTRAINT IF EXISTS com1_liderg_td_pkey;

ALTER TABLE com1_liderg_td
  ADD CONSTRAINT com1_liderg_td_pkey PRIMARY KEY (comlgtd_ent_id);

-- Paso 8: Crear constraint única para compromiso_id + entidad_id
ALTER TABLE com1_liderg_td
  ADD CONSTRAINT com1_liderg_td_unique_compromiso_entidad 
  UNIQUE (compromiso_id, entidad_id);

-- Paso 9: Agregar foreign keys
ALTER TABLE com1_liderg_td
  ADD CONSTRAINT com1_liderg_td_fk1 
  FOREIGN KEY (compromiso_id) 
  REFERENCES compromisos(compromiso_id);

ALTER TABLE com1_liderg_td
  ADD CONSTRAINT com1_liderg_td_fk2 
  FOREIGN KEY (entidad_id) 
  REFERENCES entidades(entidad_id);

-- Paso 10: Eliminar columnas antiguas que ya no se usan
ALTER TABLE com1_liderg_td
  DROP COLUMN IF EXISTS com1_id,
  DROP COLUMN IF EXISTS compromiso_entidad_id;

-- Verificar la nueva estructura
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'com1_liderg_td' 
ORDER BY ordinal_position;
