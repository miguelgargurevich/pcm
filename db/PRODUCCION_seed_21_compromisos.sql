-- Script para PRODUCCIÓN (Supabase): Insertar los 21 compromisos y actualizar tabla com1_liderg_td
-- Ejecutar en Supabase SQL Editor

-- ============================================
-- PARTE 1: INSERTAR LOS 21 COMPROMISOS
-- ============================================

INSERT INTO compromiso_gobierno_digital (
    compromiso_id,
    nombre_compromiso,
    descripcion,
    alcances,
    fecha_inicio,
    fecha_fin,
    estado,
    activo,
    created_at
) VALUES
(1, 'Designar al Líder de Gobierno y Transformación Digital', 
 'Designación oficial del responsable de liderar la transformación digital en la entidad',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP),
(2, 'Constituir el Comité de Gobierno y TD (CGTD)',
 'Conformación del comité que supervisará la implementación de gobierno digital',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP),
(3, 'Elaborar el Plan de Gobierno Digital (PGD)',
 'Desarrollo del plan estratégico de gobierno digital institucional',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP),
(4, 'Incorporar TD en el PEI',
 'Integración de la transformación digital en el Plan Estratégico Institucional',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP),
(5, 'Desplegar la Estrategia Digital',
 'Implementación de la estrategia de transformación digital',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP),
(6, 'Migrar a la Plataforma GOB.PE',
 'Migración del portal institucional a la plataforma GOB.PE',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP),
(7, 'Implementar Mesa de Partes Digital',
 'Implementación del sistema de mesa de partes digital',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP),
(8, 'Publicar el TUPA en GOB.PE',
 'Publicación del Texto Único de Procedimientos Administrativos en GOB.PE',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP),
(9, 'Implementar el Modelo de Gestión Documental (MGD)',
 'Implementación del modelo de gestión documental institucional',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP),
(10, 'Publicar Datos Abiertos (PNDA)',
 'Publicación de datos abiertos en la Plataforma Nacional de Datos Abiertos',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP),
(11, 'Aportar a GEO PERÚ',
 'Contribución con información geoespacial a la plataforma GEO PERÚ',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP),
(12, 'Designar Responsable de Software Público',
 'Designación del responsable de gestionar software público',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP),
(13, 'Publicar/Consumir servicios de la PIDE',
 'Integración con la Plataforma de Interoperabilidad del Estado',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP),
(14, 'Designar al Oficial de Seguridad y Confianza Digital (OSCD/CISO)',
 'Designación del oficial responsable de seguridad digital',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP),
(15, 'Conformar el CSIRT institucional',
 'Conformación del Equipo de Respuesta ante Incidentes de Seguridad',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP),
(16, 'Implementar el SGSI (ISO 27001)',
 'Implementación del Sistema de Gestión de Seguridad de la Información',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP),
(17, 'Formular Plan de Transición a IPv6',
 'Elaboración del plan de migración al protocolo IPv6',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP),
(18, 'Solicitar acceso al Portal de Transparencia Estándar (PTE)',
 'Solicitud de acceso al portal de transparencia estándar',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP),
(19, 'Responder la ENAD',
 'Respuesta a la Encuesta Nacional de Activos Digitales',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP),
(20, 'Digitalizar servicios con Facilita Perú',
 'Digitalización de servicios a través de la plataforma Facilita Perú',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP),
(21, 'Designar al Oficial de Gobierno de Datos (OGD)',
 'Designación del oficial responsable de gobierno de datos',
 'Nacional,Regional,Local', '2025-01-01', '2025-12-31', 1, true, CURRENT_TIMESTAMP)
ON CONFLICT (compromiso_id) DO UPDATE SET
    nombre_compromiso = EXCLUDED.nombre_compromiso,
    descripcion = EXCLUDED.descripcion,
    alcances = EXCLUDED.alcances,
    fecha_inicio = EXCLUDED.fecha_inicio,
    fecha_fin = EXCLUDED.fecha_fin,
    updated_at = CURRENT_TIMESTAMP;

-- ============================================
-- PARTE 2: INSERTAR ALCANCES
-- ============================================

-- Nota: alc_com_id debe generarse como secuencia única
INSERT INTO alcance_compromisos (alc_com_id, compromiso_id, clasificacion_id, activo)
SELECT 
    ROW_NUMBER() OVER (ORDER BY c.compromiso_id, cl.clasificacion_id) + COALESCE((SELECT MAX(alc_com_id) FROM alcance_compromisos), 0),
    c.compromiso_id, 
    cl.clasificacion_id, 
    true
FROM compromiso_gobierno_digital c
CROSS JOIN clasificacion cl
WHERE c.compromiso_id BETWEEN 1 AND 21
  AND cl.nombre IN ('Gobierno Nacional', 'Gobierno Regional', 'Gobierno Local')
ON CONFLICT (compromiso_id, clasificacion_id) DO NOTHING;

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

-- Verificar compromisos insertados
SELECT compromiso_id, nombre_compromiso, activo 
FROM compromiso_gobierno_digital 
WHERE compromiso_id BETWEEN 1 AND 21
ORDER BY compromiso_id;

-- Verificar alcances
SELECT 
    c.compromiso_id,
    c.nombre_compromiso,
    STRING_AGG(cl.nombre, ', ' ORDER BY cl.clasificacion_id) as alcances
FROM compromiso_gobierno_digital c
LEFT JOIN alcance_compromisos ac ON c.compromiso_id = ac.compromiso_id AND ac.activo = true
LEFT JOIN clasificacion cl ON ac.clasificacion_id = cl.clasificacion_id
WHERE c.compromiso_id BETWEEN 1 AND 21
GROUP BY c.compromiso_id, c.nombre_compromiso
ORDER BY c.compromiso_id;

-- Verificar estructura de com1_liderg_td
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'com1_liderg_td' 
ORDER BY ordinal_position;
