-- =====================================================
-- INSERTAR CRITERIOS DE EVALUACIÓN PARA COMPROMISOS 3-21
-- Ejecutar en Supabase SQL Editor
-- =====================================================

-- Primero verificar cuántos criterios existen actualmente
SELECT compromiso_id, COUNT(*) as total_criterios 
FROM criterio_evaluacion 
WHERE activo = true 
GROUP BY compromiso_id 
ORDER BY compromiso_id;

-- =====================================================
-- COMPROMISO 3: Elaborar y/o Actualizar el Plan de Gobierno Digital (PGD)
-- =====================================================
INSERT INTO criterio_evaluacion (compromiso_id, descripcion, estado, activo, created_at) VALUES
(3, 'El Plan de Gobierno Digital está alineado con el Plan Estratégico Institucional (PEI)', 1, true, NOW()),
(3, 'Contiene el diagnóstico de la situación actual de gobierno y transformación digital de la entidad', 1, true, NOW()),
(3, 'Define objetivos estratégicos y/o específicos de gobierno digital', 1, true, NOW()),
(3, 'Incluye la cartera de proyectos de gobierno digital priorizados', 1, true, NOW()),
(3, 'Está aprobado mediante Resolución de la máxima autoridad de la entidad', 1, true, NOW())
ON CONFLICT DO NOTHING;

-- =====================================================
-- COMPROMISO 4: Incorporar la Transformación Digital en el PEI
-- =====================================================
INSERT INTO criterio_evaluacion (compromiso_id, descripcion, estado, activo, created_at) VALUES
(4, 'El PEI vigente incluye al menos un Objetivo Estratégico Institucional relacionado a transformación digital', 1, true, NOW()),
(4, 'El objetivo está alineado con los ejes del Plan de Gobierno Digital Nacional', 1, true, NOW()),
(4, 'Se identifica la Acción Estratégica Institucional vinculada', 1, true, NOW()),
(4, 'El PEI está aprobado mediante documento oficial de la entidad', 1, true, NOW())
ON CONFLICT DO NOTHING;

-- =====================================================
-- COMPROMISO 5: Formular la Estrategia Digital Institucional
-- =====================================================
INSERT INTO criterio_evaluacion (compromiso_id, descripcion, estado, activo, created_at) VALUES
(5, 'La estrategia digital está documentada formalmente', 1, true, NOW()),
(5, 'Define la visión digital de la entidad', 1, true, NOW()),
(5, 'Incluye objetivos y metas de transformación digital', 1, true, NOW()),
(5, 'Está alineada con el Plan de Gobierno Digital de la entidad', 1, true, NOW()),
(5, 'Cuenta con aprobación de la alta dirección', 1, true, NOW())
ON CONFLICT DO NOTHING;

-- =====================================================
-- COMPROMISO 6: Migración a Plataforma GOB.PE
-- =====================================================
INSERT INTO criterio_evaluacion (compromiso_id, descripcion, estado, activo, created_at) VALUES
(6, 'La entidad ha migrado su portal institucional a GOB.PE', 1, true, NOW()),
(6, 'El contenido cumple con los estándares de la Plataforma Digital Única', 1, true, NOW()),
(6, 'La información institucional está actualizada', 1, true, NOW()),
(6, 'Se han migrado los servicios digitales a la plataforma', 1, true, NOW())
ON CONFLICT DO NOTHING;

-- =====================================================
-- COMPROMISO 7: Implementar el Modelo de Prestación de Servicios Digitales (MPD)
-- =====================================================
INSERT INTO criterio_evaluacion (compromiso_id, descripcion, estado, activo, created_at) VALUES
(7, 'La entidad ha identificado los servicios a digitalizar', 1, true, NOW()),
(7, 'Se ha implementado al menos un servicio bajo el modelo MPD', 1, true, NOW()),
(7, 'El servicio cumple con los estándares de interoperabilidad', 1, true, NOW()),
(7, 'Se cuenta con evidencia de la implementación', 1, true, NOW())
ON CONFLICT DO NOTHING;

-- =====================================================
-- COMPROMISO 8: Publicar el TUPA en la Plataforma GOB.PE
-- =====================================================
INSERT INTO criterio_evaluacion (compromiso_id, descripcion, estado, activo, created_at) VALUES
(8, 'El TUPA está publicado en la Plataforma GOB.PE', 1, true, NOW()),
(8, 'La información del TUPA está actualizada', 1, true, NOW()),
(8, 'Los procedimientos incluyen requisitos y costos vigentes', 1, true, NOW()),
(8, 'Se encuentra accesible para la ciudadanía', 1, true, NOW())
ON CONFLICT DO NOTHING;

-- =====================================================
-- COMPROMISO 9: Implementar el Modelo de Gestión Documental
-- =====================================================
INSERT INTO criterio_evaluacion (compromiso_id, descripcion, estado, activo, created_at) VALUES
(9, 'La entidad cuenta con un sistema de gestión documental implementado', 1, true, NOW()),
(9, 'El sistema permite la trazabilidad de documentos', 1, true, NOW()),
(9, 'Se han digitalizado los procesos documentales principales', 1, true, NOW()),
(9, 'Cumple con las normas de archivo y preservación digital', 1, true, NOW())
ON CONFLICT DO NOTHING;

-- =====================================================
-- COMPROMISO 10: Implementar Política de Datos Abiertos
-- =====================================================
INSERT INTO criterio_evaluacion (compromiso_id, descripcion, estado, activo, created_at) VALUES
(10, 'La entidad ha publicado datasets en el Portal de Datos Abiertos', 1, true, NOW()),
(10, 'Los datos publicados cumplen con estándares de calidad', 1, true, NOW()),
(10, 'Se mantiene actualización periódica de los datasets', 1, true, NOW()),
(10, 'Se ha designado al responsable de datos abiertos', 1, true, NOW())
ON CONFLICT DO NOTHING;

-- =====================================================
-- COMPROMISO 11: Implementar la Infraestructura de Datos Espaciales (IDE)
-- =====================================================
INSERT INTO criterio_evaluacion (compromiso_id, descripcion, estado, activo, created_at) VALUES
(11, 'La entidad contribuye con información geoespacial a la IDE Perú', 1, true, NOW()),
(11, 'Los datos geoespaciales cumplen con estándares nacionales', 1, true, NOW()),
(11, 'Se cuenta con metadatos documentados', 1, true, NOW()),
(11, 'La información está disponible en GEO Perú', 1, true, NOW())
ON CONFLICT DO NOTHING;

-- =====================================================
-- COMPROMISO 12: Designar Responsable de Software Público
-- =====================================================
INSERT INTO criterio_evaluacion (compromiso_id, descripcion, estado, activo, created_at) VALUES
(12, 'Se ha designado al responsable de software público mediante documento oficial', 1, true, NOW()),
(12, 'El responsable pertenece al área de TI o afín', 1, true, NOW()),
(12, 'Se han registrado los software desarrollados en el catálogo', 1, true, NOW()),
(12, 'Se promueve la reutilización de software público', 1, true, NOW())
ON CONFLICT DO NOTHING;

-- =====================================================
-- COMPROMISO 13: Implementar Interoperabilidad con PIDE
-- =====================================================
INSERT INTO criterio_evaluacion (compromiso_id, descripcion, estado, activo, created_at) VALUES
(13, 'La entidad está conectada a la Plataforma de Interoperabilidad del Estado (PIDE)', 1, true, NOW()),
(13, 'Se consumen o publican servicios web a través de PIDE', 1, true, NOW()),
(13, 'Los servicios cumplen con estándares de interoperabilidad', 1, true, NOW()),
(13, 'Se cuenta con documentación técnica de los servicios', 1, true, NOW())
ON CONFLICT DO NOTHING;

-- =====================================================
-- COMPROMISO 14: Designar Oficial de Seguridad Digital
-- =====================================================
INSERT INTO criterio_evaluacion (compromiso_id, descripcion, estado, activo, created_at) VALUES
(14, 'Se ha designado al Oficial de Seguridad Digital mediante Resolución', 1, true, NOW()),
(14, 'El oficial reporta directamente a la alta dirección', 1, true, NOW()),
(14, 'Cuenta con funciones definidas en materia de seguridad digital', 1, true, NOW()),
(14, 'Tiene experiencia o capacitación en seguridad de la información', 1, true, NOW())
ON CONFLICT DO NOTHING;

-- =====================================================
-- COMPROMISO 15: Conformar el CSIRT Institucional
-- =====================================================
INSERT INTO criterio_evaluacion (compromiso_id, descripcion, estado, activo, created_at) VALUES
(15, 'Se ha conformado el CSIRT institucional mediante documento oficial', 1, true, NOW()),
(15, 'El equipo cuenta con personal capacitado en ciberseguridad', 1, true, NOW()),
(15, 'Se ha definido el procedimiento de gestión de incidentes', 1, true, NOW()),
(15, 'Se reportan incidentes al PECERT (Centro Nacional de Seguridad Digital)', 1, true, NOW())
ON CONFLICT DO NOTHING;

-- =====================================================
-- COMPROMISO 16: Implementar Sistema de Gestión de Seguridad de la Información
-- =====================================================
INSERT INTO criterio_evaluacion (compromiso_id, descripcion, estado, activo, created_at) VALUES
(16, 'Se ha implementado un SGSI basado en ISO 27001 o equivalente', 1, true, NOW()),
(16, 'Se cuenta con políticas de seguridad de la información aprobadas', 1, true, NOW()),
(16, 'Se realizan evaluaciones de riesgo periódicas', 1, true, NOW()),
(16, 'Se cuenta con plan de continuidad del negocio', 1, true, NOW())
ON CONFLICT DO NOTHING;

-- =====================================================
-- COMPROMISO 17: Implementar Plan de Transición a IPv6
-- =====================================================
INSERT INTO criterio_evaluacion (compromiso_id, descripcion, estado, activo, created_at) VALUES
(17, 'Se ha elaborado el plan de transición a IPv6', 1, true, NOW()),
(17, 'Se ha iniciado la implementación del protocolo IPv6', 1, true, NOW()),
(17, 'Los servicios públicos son accesibles vía IPv6', 1, true, NOW()),
(17, 'Se cuenta con personal capacitado en IPv6', 1, true, NOW())
ON CONFLICT DO NOTHING;

-- =====================================================
-- COMPROMISO 18: Garantizar Acceso al Portal de Transparencia
-- =====================================================
INSERT INTO criterio_evaluacion (compromiso_id, descripcion, estado, activo, created_at) VALUES
(18, 'El Portal de Transparencia está operativo y accesible', 1, true, NOW()),
(18, 'La información está actualizada conforme a la normativa', 1, true, NOW()),
(18, 'Se publican los rubros obligatorios del Portal', 1, true, NOW()),
(18, 'Se atienden las solicitudes de acceso a la información', 1, true, NOW())
ON CONFLICT DO NOTHING;

-- =====================================================
-- COMPROMISO 19: Participar en Encuesta Nacional de Gobierno Digital
-- =====================================================
INSERT INTO criterio_evaluacion (compromiso_id, descripcion, estado, activo, created_at) VALUES
(19, 'La entidad ha completado la Encuesta Nacional de Gobierno Digital', 1, true, NOW()),
(19, 'La información proporcionada es veraz y verificable', 1, true, NOW()),
(19, 'Se ha cumplido con los plazos establecidos', 1, true, NOW())
ON CONFLICT DO NOTHING;

-- =====================================================
-- COMPROMISO 20: Digitalizar Servicios según Decreto Facilita
-- =====================================================
INSERT INTO criterio_evaluacion (compromiso_id, descripcion, estado, activo, created_at) VALUES
(20, 'Se han identificado los servicios a digitalizar según el Decreto Facilita', 1, true, NOW()),
(20, 'Se han digitalizado los servicios priorizados', 1, true, NOW()),
(20, 'Los servicios digitalizados están disponibles en GOB.PE', 1, true, NOW()),
(20, 'Se ha simplificado la tramitación para el ciudadano', 1, true, NOW())
ON CONFLICT DO NOTHING;

-- =====================================================
-- COMPROMISO 21: Designar Oficial de Gobierno de Datos
-- =====================================================
INSERT INTO criterio_evaluacion (compromiso_id, descripcion, estado, activo, created_at) VALUES
(21, 'Se ha designado al Oficial de Gobierno de Datos mediante documento oficial', 1, true, NOW()),
(21, 'El oficial tiene funciones definidas en gestión de datos', 1, true, NOW()),
(21, 'Se ha elaborado la política de gobernanza de datos', 1, true, NOW()),
(21, 'Se promueve la calidad y uso de datos en la entidad', 1, true, NOW())
ON CONFLICT DO NOTHING;

-- =====================================================
-- VERIFICAR INSERCIÓN
-- =====================================================
SELECT compromiso_id, COUNT(*) as total_criterios 
FROM criterio_evaluacion 
WHERE activo = true 
GROUP BY compromiso_id 
ORDER BY compromiso_id;

-- Ver detalle de criterios insertados
SELECT compromiso_id, criterio_evaluacion_id, descripcion 
FROM criterio_evaluacion 
WHERE compromiso_id >= 3 AND activo = true
ORDER BY compromiso_id, criterio_evaluacion_id;
