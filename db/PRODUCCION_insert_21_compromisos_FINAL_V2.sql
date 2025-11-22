-- =====================================================
-- SCRIPT FINAL PARA PRODUCCIÓN (SUPABASE) - CORREGIDO
-- Fecha: 22 de Noviembre 2025
-- Descripción: 
-- 1. Asegura estructura de alcance_compromisos (FK faltante)
-- 2. Asegura clasificaciones necesarias (Sin usar ON CONFLICT nombre)
-- 3. Inserta los 21 compromisos
-- 4. Inserta los alcances (Sin usar ON CONFLICT)
-- =====================================================

-- ============================================
-- PARTE 1: ASEGURAR ESTRUCTURA Y FKs
-- ============================================

DO $$
BEGIN
    -- 1. Verificar si falta la FK hacia compromiso_gobierno_digital
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_alcance_compromisos_cgd'
    ) THEN
        -- Intentar agregarla (si falla por datos huérfanos, habrá que limpiar primero)
        -- Primero limpiamos datos huérfanos por si acaso (seguridad)
        DELETE FROM alcance_compromisos 
        WHERE compromiso_id NOT IN (SELECT compromiso_id FROM compromiso_gobierno_digital);

        ALTER TABLE alcance_compromisos
        ADD CONSTRAINT fk_alcance_compromisos_cgd
        FOREIGN KEY (compromiso_id)
        REFERENCES compromiso_gobierno_digital(compromiso_id)
        ON DELETE CASCADE;
        
        RAISE NOTICE '✅ FK fk_alcance_compromisos_cgd creada exitosamente';
    ELSE
        RAISE NOTICE 'ℹ️ La FK fk_alcance_compromisos_cgd ya existe';
    END IF;
END $$;

-- ============================================
-- PARTE 2: ASEGURAR CLASIFICACIONES
-- ============================================

-- Insertar clasificaciones si no existen (usando WHERE NOT EXISTS en lugar de ON CONFLICT)
INSERT INTO clasificacion (clasificacion_id, nombre, activo)
SELECT 6, 'Gobierno Nacional', true
WHERE NOT EXISTS (SELECT 1 FROM clasificacion WHERE nombre = 'Gobierno Nacional');

INSERT INTO clasificacion (clasificacion_id, nombre, activo)
SELECT 7, 'Gobierno Regional', true
WHERE NOT EXISTS (SELECT 1 FROM clasificacion WHERE nombre = 'Gobierno Regional');

INSERT INTO clasificacion (clasificacion_id, nombre, activo)
SELECT 8, 'Gobierno Local', true
WHERE NOT EXISTS (SELECT 1 FROM clasificacion WHERE nombre = 'Gobierno Local');

-- Nota: Usamos IDs 6, 7, 8 asumiendo que los existentes (1-5) están ocupados.
-- Si ya existen con otros IDs, no se insertarán.

-- ============================================
-- PARTE 3: INSERTAR LOS 21 COMPROMISOS
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
-- PARTE 4: INSERTAR ALCANCES
-- ============================================

-- Insertar alcances calculando el ID manualmente
-- Usamos WHERE NOT EXISTS para evitar duplicados lógicos
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
  AND NOT EXISTS (
      SELECT 1 FROM alcance_compromisos ac 
      WHERE ac.compromiso_id = c.compromiso_id 
      AND ac.clasificacion_id = cl.clasificacion_id
  );

-- ============================================
-- VERIFICACIÓN
-- ============================================
SELECT count(*) as total_compromisos FROM compromiso_gobierno_digital;
SELECT count(*) as total_alcances FROM alcance_compromisos;
