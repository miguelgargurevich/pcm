-- ============================================
-- MIGRACIÓN: Sistema de Permisos por Perfil
-- Fecha: 2025-11-20
-- Descripción: Crea tablas para gestión de permisos granulares por perfil
-- ============================================

-- 1. Tabla de Módulos del Sistema
CREATE TABLE IF NOT EXISTS permisos_modulos (
    permiso_modulo_id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    ruta VARCHAR(200),
    icono VARCHAR(50),
    orden INTEGER DEFAULT 0,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE permisos_modulos IS 'Módulos/funcionalidades del sistema';
COMMENT ON COLUMN permisos_modulos.codigo IS 'Código único del módulo (usuarios, entidades, etc)';
COMMENT ON COLUMN permisos_modulos.ruta IS 'Ruta del módulo en el frontend';

-- 2. Tabla de Permisos por Perfil
CREATE TABLE IF NOT EXISTS perfiles_permisos (
    perfil_permiso_id SERIAL PRIMARY KEY,
    perfil_id INTEGER NOT NULL,
    permiso_modulo_id INTEGER NOT NULL,
    tipo_acceso CHAR(1) CHECK (tipo_acceso IN ('T', 'C', 'N')) DEFAULT 'N',
    puede_crear BOOLEAN DEFAULT false,
    puede_editar BOOLEAN DEFAULT false,
    puede_eliminar BOOLEAN DEFAULT false,
    puede_consultar BOOLEAN DEFAULT false,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_perfiles_permisos_perfil FOREIGN KEY (perfil_id) 
        REFERENCES perfiles(perfil_id) ON DELETE CASCADE,
    CONSTRAINT fk_perfiles_permisos_modulo FOREIGN KEY (permiso_modulo_id) 
        REFERENCES permisos_modulos(permiso_modulo_id) ON DELETE CASCADE,
    CONSTRAINT uk_perfil_modulo UNIQUE (perfil_id, permiso_modulo_id)
);

COMMENT ON TABLE perfiles_permisos IS 'Permisos asignados a cada perfil por módulo';
COMMENT ON COLUMN perfiles_permisos.tipo_acceso IS 'T=Total, C=Consulta, N=Sin acceso';

-- 3. Índices para mejor rendimiento
CREATE INDEX idx_perfiles_permisos_perfil ON perfiles_permisos(perfil_id);
CREATE INDEX idx_perfiles_permisos_modulo ON perfiles_permisos(permiso_modulo_id);
CREATE INDEX idx_perfiles_permisos_activo ON perfiles_permisos(activo);
CREATE INDEX idx_permisos_modulos_codigo ON permisos_modulos(codigo);
CREATE INDEX idx_permisos_modulos_activo ON permisos_modulos(activo);

-- 4. Insertar los 8 módulos del sistema
INSERT INTO permisos_modulos (codigo, nombre, descripcion, ruta, icono, orden) VALUES
('usuarios', 'Gestionar Usuarios', 'Gestión de usuarios del sistema', '/dashboard/usuarios', 'Users', 1),
('entidades', 'Gestionar Entidades', 'Gestión de entidades del Estado', '/dashboard/entidades', 'Building2', 2),
('marco_normativo', 'Gestionar Marco Normativo', 'Gestión del marco normativo', '/dashboard/marco-normativo', 'FileText', 3),
('compromisos', 'Gestionar Compromisos G.D.', 'Gestión de compromisos de gobierno digital', '/dashboard/compromisos', 'CheckSquare', 4),
('cumplimiento', 'Cumplimiento Normativo', 'Registro y seguimiento de cumplimiento', '/dashboard/cumplimiento', 'ClipboardCheck', 5),
('seguimiento', 'Seguimiento PGD - PP', 'Seguimiento de Plan de Gobierno Digital', '/dashboard/seguimiento', 'TrendingUp', 6),
('evaluacion', 'Evaluación & Cumplimiento', 'Evaluación y seguimiento de cumplimiento', '/dashboard/evaluacion', 'BarChart3', 7),
('reportes', 'Consultas & Reportes', 'Consultas y generación de reportes', '/dashboard/reportes', 'Search', 8)
ON CONFLICT (codigo) DO NOTHING;

-- 5. Configurar permisos para Perfil 1: Administrador PCM
INSERT INTO perfiles_permisos (perfil_id, permiso_modulo_id, tipo_acceso, puede_crear, puede_editar, puede_eliminar, puede_consultar)
SELECT 
    1 as perfil_id,
    permiso_modulo_id,
    CASE 
        WHEN codigo IN ('usuarios', 'entidades', 'marco_normativo', 'compromisos', 'seguimiento', 'evaluacion', 'reportes') THEN 'T'
        WHEN codigo = 'cumplimiento' THEN 'N'
    END as tipo_acceso,
    CASE WHEN codigo IN ('usuarios', 'entidades', 'marco_normativo', 'compromisos', 'seguimiento', 'evaluacion', 'reportes') THEN true ELSE false END as puede_crear,
    CASE WHEN codigo IN ('usuarios', 'entidades', 'marco_normativo', 'compromisos', 'seguimiento', 'evaluacion', 'reportes') THEN true ELSE false END as puede_editar,
    CASE WHEN codigo IN ('usuarios', 'entidades', 'marco_normativo', 'compromisos', 'seguimiento', 'evaluacion', 'reportes') THEN true ELSE false END as puede_eliminar,
    CASE WHEN codigo IN ('usuarios', 'entidades', 'marco_normativo', 'compromisos', 'seguimiento', 'evaluacion', 'reportes') THEN true ELSE false END as puede_consultar
FROM permisos_modulos
ON CONFLICT (perfil_id, permiso_modulo_id) DO NOTHING;

-- 6. Configurar permisos para Perfil 2: Entidad
INSERT INTO perfiles_permisos (perfil_id, permiso_modulo_id, tipo_acceso, puede_crear, puede_editar, puede_eliminar, puede_consultar)
SELECT 
    2 as perfil_id,
    permiso_modulo_id,
    CASE 
        WHEN codigo IN ('marco_normativo', 'compromisos') THEN 'C'
        WHEN codigo = 'cumplimiento' THEN 'T'
        ELSE 'N'
    END as tipo_acceso,
    CASE WHEN codigo = 'cumplimiento' THEN true ELSE false END as puede_crear,
    CASE WHEN codigo = 'cumplimiento' THEN true ELSE false END as puede_editar,
    CASE WHEN codigo = 'cumplimiento' THEN true ELSE false END as puede_eliminar,
    CASE WHEN codigo IN ('marco_normativo', 'compromisos', 'cumplimiento') THEN true ELSE false END as puede_consultar
FROM permisos_modulos
ON CONFLICT (perfil_id, permiso_modulo_id) DO NOTHING;

-- 7. Configurar permisos para Perfil 3: Operador PCM
INSERT INTO perfiles_permisos (perfil_id, permiso_modulo_id, tipo_acceso, puede_crear, puede_editar, puede_eliminar, puede_consultar)
SELECT 
    3 as perfil_id,
    permiso_modulo_id,
    CASE 
        WHEN codigo IN ('marco_normativo', 'compromisos') THEN 'C'
        WHEN codigo IN ('seguimiento', 'evaluacion', 'reportes') THEN 'T'
        ELSE 'N'
    END as tipo_acceso,
    CASE WHEN codigo IN ('seguimiento', 'evaluacion', 'reportes') THEN true ELSE false END as puede_crear,
    CASE WHEN codigo IN ('seguimiento', 'evaluacion', 'reportes') THEN true ELSE false END as puede_editar,
    CASE WHEN codigo IN ('seguimiento', 'evaluacion', 'reportes') THEN true ELSE false END as puede_eliminar,
    CASE WHEN codigo IN ('marco_normativo', 'compromisos', 'seguimiento', 'evaluacion', 'reportes') THEN true ELSE false END as puede_consultar
FROM permisos_modulos
ON CONFLICT (perfil_id, permiso_modulo_id) DO NOTHING;

-- 8. Configurar permisos para Perfil 4: Invitado
INSERT INTO perfiles_permisos (perfil_id, permiso_modulo_id, tipo_acceso, puede_crear, puede_editar, puede_eliminar, puede_consultar)
SELECT 
    4 as perfil_id,
    permiso_modulo_id,
    CASE 
        WHEN codigo IN ('marco_normativo', 'compromisos') THEN 'C'
        WHEN codigo = 'reportes' THEN 'T'
        ELSE 'N'
    END as tipo_acceso,
    CASE WHEN codigo = 'reportes' THEN true ELSE false END as puede_crear,
    CASE WHEN codigo = 'reportes' THEN true ELSE false END as puede_editar,
    CASE WHEN codigo = 'reportes' THEN true ELSE false END as puede_eliminar,
    CASE WHEN codigo IN ('marco_normativo', 'compromisos', 'reportes') THEN true ELSE false END as puede_consultar
FROM permisos_modulos
ON CONFLICT (perfil_id, permiso_modulo_id) DO NOTHING;

-- 9. Verificación: Mostrar matriz de permisos
SELECT 
    p.nombre as perfil,
    pm.nombre as modulo,
    pp.tipo_acceso,
    pp.puede_crear,
    pp.puede_editar,
    pp.puede_eliminar,
    pp.puede_consultar
FROM perfiles_permisos pp
JOIN perfiles p ON pp.perfil_id = p.perfil_id
JOIN permisos_modulos pm ON pp.permiso_modulo_id = pm.permiso_modulo_id
ORDER BY p.perfil_id, pm.orden;

-- Mensaje de éxito
SELECT 'Migración de permisos completada exitosamente' as mensaje;
