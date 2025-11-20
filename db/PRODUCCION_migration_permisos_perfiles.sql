-- =====================================================
-- MIGRACIÓN DE SISTEMA DE PERMISOS Y PERFILES
-- Base de datos: Supabase (PostgreSQL)
-- Fecha: 20 de noviembre de 2025
-- Descripción: Implementación completa del sistema RBAC
-- =====================================================

-- =====================================================
-- 1. CREAR TABLA DE PERMISOS MÓDULOS
-- =====================================================
CREATE TABLE IF NOT EXISTS permisos_modulos (
    permiso_modulo_id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    ruta VARCHAR(200),
    icono VARCHAR(50),
    orden SMALLINT DEFAULT 0,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE permisos_modulos IS 'Catálogo de módulos del sistema con sus rutas y configuraciones';
COMMENT ON COLUMN permisos_modulos.codigo IS 'Código único identificador del módulo (ej: usuarios, entidades)';
COMMENT ON COLUMN permisos_modulos.ruta IS 'Ruta de navegación del módulo en el frontend';

-- =====================================================
-- 2. CREAR TABLA DE PERMISOS POR PERFIL
-- =====================================================
CREATE TABLE IF NOT EXISTS perfiles_permisos (
    perfil_permiso_id SERIAL PRIMARY KEY,
    perfil_id SMALLINT NOT NULL,
    permiso_modulo_id INTEGER NOT NULL,
    tipo_acceso CHAR(1) NOT NULL CHECK (tipo_acceso IN ('T', 'C', 'N')),
    puede_crear BOOLEAN DEFAULT false,
    puede_editar BOOLEAN DEFAULT false,
    puede_eliminar BOOLEAN DEFAULT false,
    puede_consultar BOOLEAN DEFAULT false,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (perfil_id) REFERENCES perfiles(perfil_id) ON DELETE CASCADE,
    FOREIGN KEY (permiso_modulo_id) REFERENCES permisos_modulos(permiso_modulo_id) ON DELETE CASCADE
);

COMMENT ON TABLE perfiles_permisos IS 'Matriz de permisos asignados a cada perfil de usuario';
COMMENT ON COLUMN perfiles_permisos.tipo_acceso IS 'T=Total, C=Consulta, N=Sin acceso';

-- =====================================================
-- 3. CREAR ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_permisos_modulos_codigo ON permisos_modulos(codigo);
CREATE INDEX IF NOT EXISTS idx_permisos_modulos_activo ON permisos_modulos(activo);
CREATE INDEX IF NOT EXISTS idx_perfiles_permisos_perfil ON perfiles_permisos(perfil_id);
CREATE INDEX IF NOT EXISTS idx_perfiles_permisos_modulo ON perfiles_permisos(permiso_modulo_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_perfiles_permisos_unique ON perfiles_permisos(perfil_id, permiso_modulo_id);

-- =====================================================
-- 4. INSERTAR MÓDULOS DEL SISTEMA
-- =====================================================
INSERT INTO permisos_modulos (codigo, nombre, descripcion, ruta, icono, orden) VALUES
('usuarios', 'Gestionar Usuarios', 'Administración de usuarios del sistema', '/dashboard/usuarios', 'Users', 1),
('entidades', 'Gestionar Entidades', 'Gestión de entidades públicas', '/dashboard/entidades', 'Building2', 2),
('marco_normativo', 'Gestionar Marco Normativo', 'Catálogo de normas y regulaciones', '/dashboard/marco-normativo', 'FileText', 3),
('compromisos', 'Gestionar Compromisos G.D.', 'Compromisos de Gobierno Digital', '/dashboard/compromisos', 'CheckSquare', 4),
('cumplimiento', 'Cumplimiento Normativo', 'Registro de cumplimiento normativo', '/dashboard/cumplimiento', 'ClipboardCheck', 5),
('seguimiento', 'Seguimiento PGD - PP', 'Seguimiento de planes y programas', '/dashboard/seguimiento', 'TrendingUp', 6),
('evaluacion', 'Evaluación & Cumplimiento', 'Evaluación de cumplimiento', '/dashboard/evaluacion', 'BarChart3', 7),
('reportes', 'Consultas & Reportes', 'Generación de reportes y consultas', '/dashboard/reportes', 'Search', 8)
ON CONFLICT (codigo) DO NOTHING;

-- =====================================================
-- 5. CONFIGURAR PERMISOS POR PERFIL
-- =====================================================

-- 5.1 PERFIL: ADMINISTRADOR PCM (perfil_id = 1)
-- Acceso Total (T) a todos los módulos EXCEPTO cumplimiento (N)
INSERT INTO perfiles_permisos (perfil_id, permiso_modulo_id, tipo_acceso, puede_crear, puede_editar, puede_eliminar, puede_consultar)
SELECT 
    1 as perfil_id,
    pm.permiso_modulo_id,
    CASE 
        WHEN pm.codigo = 'cumplimiento' THEN 'N'
        ELSE 'T'
    END as tipo_acceso,
    CASE WHEN pm.codigo = 'cumplimiento' THEN false ELSE true END as puede_crear,
    CASE WHEN pm.codigo = 'cumplimiento' THEN false ELSE true END as puede_editar,
    CASE WHEN pm.codigo = 'cumplimiento' THEN false ELSE true END as puede_eliminar,
    CASE WHEN pm.codigo = 'cumplimiento' THEN false ELSE true END as puede_consultar
FROM permisos_modulos pm
ON CONFLICT (perfil_id, permiso_modulo_id) DO UPDATE SET
    tipo_acceso = EXCLUDED.tipo_acceso,
    puede_crear = EXCLUDED.puede_crear,
    puede_editar = EXCLUDED.puede_editar,
    puede_eliminar = EXCLUDED.puede_eliminar,
    puede_consultar = EXCLUDED.puede_consultar,
    updated_at = NOW();

-- 5.2 PERFIL: ENTIDAD (perfil_id = 2)
-- Acceso Total (T) solo a cumplimiento
-- Consulta (C) a marco_normativo y compromisos
-- Sin acceso (N) al resto
INSERT INTO perfiles_permisos (perfil_id, permiso_modulo_id, tipo_acceso, puede_crear, puede_editar, puede_eliminar, puede_consultar)
SELECT 
    2 as perfil_id,
    pm.permiso_modulo_id,
    CASE 
        WHEN pm.codigo = 'cumplimiento' THEN 'T'
        WHEN pm.codigo IN ('marco_normativo', 'compromisos') THEN 'C'
        ELSE 'N'
    END as tipo_acceso,
    CASE WHEN pm.codigo = 'cumplimiento' THEN true ELSE false END as puede_crear,
    CASE WHEN pm.codigo = 'cumplimiento' THEN true ELSE false END as puede_editar,
    CASE WHEN pm.codigo = 'cumplimiento' THEN true ELSE false END as puede_eliminar,
    CASE WHEN pm.codigo IN ('cumplimiento', 'marco_normativo', 'compromisos') THEN true ELSE false END as puede_consultar
FROM permisos_modulos pm
ON CONFLICT (perfil_id, permiso_modulo_id) DO UPDATE SET
    tipo_acceso = EXCLUDED.tipo_acceso,
    puede_crear = EXCLUDED.puede_crear,
    puede_editar = EXCLUDED.puede_editar,
    puede_eliminar = EXCLUDED.puede_eliminar,
    puede_consultar = EXCLUDED.puede_consultar,
    updated_at = NOW();

-- 5.3 PERFIL: OPERADOR PCM (perfil_id = 3)
-- Acceso Total (T) a seguimiento, evaluacion, reportes
-- Consulta (C) a marco_normativo y compromisos
-- Sin acceso (N) al resto
INSERT INTO perfiles_permisos (perfil_id, permiso_modulo_id, tipo_acceso, puede_crear, puede_editar, puede_eliminar, puede_consultar)
SELECT 
    3 as perfil_id,
    pm.permiso_modulo_id,
    CASE 
        WHEN pm.codigo IN ('seguimiento', 'evaluacion', 'reportes') THEN 'T'
        WHEN pm.codigo IN ('marco_normativo', 'compromisos') THEN 'C'
        ELSE 'N'
    END as tipo_acceso,
    CASE WHEN pm.codigo IN ('seguimiento', 'evaluacion', 'reportes') THEN true ELSE false END as puede_crear,
    CASE WHEN pm.codigo IN ('seguimiento', 'evaluacion', 'reportes') THEN true ELSE false END as puede_editar,
    CASE WHEN pm.codigo IN ('seguimiento', 'evaluacion', 'reportes') THEN true ELSE false END as puede_eliminar,
    CASE WHEN pm.codigo IN ('seguimiento', 'evaluacion', 'reportes', 'marco_normativo', 'compromisos') THEN true ELSE false END as puede_consultar
FROM permisos_modulos pm
ON CONFLICT (perfil_id, permiso_modulo_id) DO UPDATE SET
    tipo_acceso = EXCLUDED.tipo_acceso,
    puede_crear = EXCLUDED.puede_crear,
    puede_editar = EXCLUDED.puede_editar,
    puede_eliminar = EXCLUDED.puede_eliminar,
    puede_consultar = EXCLUDED.puede_consultar,
    updated_at = NOW();

-- 5.4 PERFIL: INVITADO/CONSULTA (perfil_id = 4)
-- Acceso Total (T) solo a reportes
-- Consulta (C) a marco_normativo y compromisos
-- Sin acceso (N) al resto
INSERT INTO perfiles_permisos (perfil_id, permiso_modulo_id, tipo_acceso, puede_crear, puede_editar, puede_eliminar, puede_consultar)
SELECT 
    4 as perfil_id,
    pm.permiso_modulo_id,
    CASE 
        WHEN pm.codigo = 'reportes' THEN 'T'
        WHEN pm.codigo IN ('marco_normativo', 'compromisos') THEN 'C'
        ELSE 'N'
    END as tipo_acceso,
    CASE WHEN pm.codigo = 'reportes' THEN true ELSE false END as puede_crear,
    CASE WHEN pm.codigo = 'reportes' THEN true ELSE false END as puede_editar,
    CASE WHEN pm.codigo = 'reportes' THEN true ELSE false END as puede_eliminar,
    CASE WHEN pm.codigo IN ('reportes', 'marco_normativo', 'compromisos') THEN true ELSE false END as puede_consultar
FROM permisos_modulos pm
ON CONFLICT (perfil_id, permiso_modulo_id) DO UPDATE SET
    tipo_acceso = EXCLUDED.tipo_acceso,
    puede_crear = EXCLUDED.puede_crear,
    puede_editar = EXCLUDED.puede_editar,
    puede_eliminar = EXCLUDED.puede_eliminar,
    puede_consultar = EXCLUDED.puede_consultar,
    updated_at = NOW();

-- =====================================================
-- 6. CREAR USUARIOS DE PRUEBA
-- =====================================================

-- Nota: Las contraseñas están hasheadas con BCrypt
-- Contraseña para todos: Admin123!
-- Hash BCrypt: $2a$11$tF1B9Lph.5xrFtFvlr29YOAZk71wy1QUT4fhBFFB9zNfeTcNX/aLq

-- 6.1 Usuario Administrador PCM (perfil_id = 1)
INSERT INTO usuarios (
    email, 
    num_dni, 
    nombres, 
    ape_paterno, 
    ape_materno, 
    password_hash, 
    perfil_id, 
    entidad_id,
    activo
) VALUES (
    'admin.test@pcm.gob.pe',
    '87654321',
    'Juan Carlos',
    'Pérez',
    'González',
    '$2a$11$tF1B9Lph.5xrFtFvlr29YOAZk71wy1QUT4fhBFFB9zNfeTcNX/aLq',
    1,
    (SELECT entidad_id FROM entidades WHERE ruc = '20131370645' LIMIT 1),
    true
) ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    updated_at = NOW();

-- 6.2 Usuario Entidad (perfil_id = 2)
INSERT INTO usuarios (
    email, 
    num_dni, 
    nombres, 
    ape_paterno, 
    ape_materno, 
    password_hash, 
    perfil_id, 
    entidad_id,
    activo
) VALUES (
    'entidad.test@gob.pe',
    '12348765',
    'María Elena',
    'Torres',
    'Ramírez',
    '$2a$11$tF1B9Lph.5xrFtFvlr29YOAZk71wy1QUT4fhBFFB9zNfeTcNX/aLq',
    2,
    (SELECT entidad_id FROM entidades WHERE ruc = '20131370645' LIMIT 1),
    true
) ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    updated_at = NOW();

-- 6.3 Usuario Operador PCM (perfil_id = 3)
INSERT INTO usuarios (
    email, 
    num_dni, 
    nombres, 
    ape_paterno, 
    ape_materno, 
    password_hash, 
    perfil_id, 
    entidad_id,
    activo
) VALUES (
    'operador.test@pcm.gob.pe',
    '45678912',
    'Roberto',
    'Sánchez',
    'Mendoza',
    '$2a$11$tF1B9Lph.5xrFtFvlr29YOAZk71wy1QUT4fhBFFB9zNfeTcNX/aLq',
    3,
    (SELECT entidad_id FROM entidades WHERE ruc = '20131370645' LIMIT 1),
    true
) ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    updated_at = NOW();

-- 6.4 Usuario Invitado/Consulta (perfil_id = 4)
INSERT INTO usuarios (
    email, 
    num_dni, 
    nombres, 
    ape_paterno, 
    ape_materno, 
    password_hash, 
    perfil_id, 
    entidad_id,
    activo
) VALUES (
    'invitado.test@externo.gob.pe',
    '78945612',
    'Ana Lucía',
    'Vásquez',
    'Castro',
    '$2a$11$tF1B9Lph.5xrFtFvlr29YOAZk71wy1QUT4fhBFFB9zNfeTcNX/aLq',
    4,
    NULL,
    true
) ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    updated_at = NOW();

-- =====================================================
-- 7. VERIFICACIÓN DE LA MIGRACIÓN
-- =====================================================
SELECT 
    'Módulos creados:' as verificacion,
    COUNT(*) as total
FROM permisos_modulos;

SELECT 
    'Permisos configurados:' as verificacion,
    COUNT(*) as total
FROM perfiles_permisos;

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

SELECT 
    'Usuarios de prueba creados:' as verificacion,
    COUNT(*) as total
FROM usuarios
WHERE email LIKE '%.test@%';

SELECT 
    u.email,
    u.nombres || ' ' || u.ape_paterno as nombre_completo,
    p.nombre as perfil,
    u.activo
FROM usuarios u
JOIN perfiles p ON u.perfil_id = p.perfil_id
WHERE u.email LIKE '%.test@%'
ORDER BY u.perfil_id;

SELECT '✅ Migración de permisos completada exitosamente' as mensaje;
