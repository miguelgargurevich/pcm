-- =====================================================
-- Plataforma de Cumplimiento Digital - Versión Mejorada
-- Fecha: 3 de noviembre de 2025
-- Mejoras aplicadas:
--   - Corrección de tipos de datos
--   - Nomenclatura consistente
--   - Índices para optimización
--   - Constraints mejorados
--   - UUIDs para claves primarias principales
-- =====================================================

-- =====================================================
-- CREACIÓN DE BASE DE DATOS
-- =====================================================

-- Crear la base de datos si no existe
-- Nota: Esta sección debe ejecutarse conectado a la base de datos 'postgres'
CREATE DATABASE plataforma_cumplimiento_digital
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LOCALE_PROVIDER = 'icu'
    ICU_LOCALE = 'es-PE'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    TEMPLATE template0;

COMMENT ON DATABASE plataforma_cumplimiento_digital IS 'Base de datos para la Plataforma de Cumplimiento Digital - Gobierno del Perú';

-- Conectarse a la base de datos recién creada
\c plataforma_cumplimiento_digital

-- Crear extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear extensión para búsqueda de texto completo en español
CREATE EXTENSION IF NOT EXISTS unaccent;

-- =====================================================
-- TABLAS MAESTRAS Y CATÁLOGOS
-- =====================================================

CREATE TABLE IF NOT EXISTS ubigeo (
	ubigeo_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	codigo VARCHAR(6) NOT NULL UNIQUE,
	departamento VARCHAR(100) NOT NULL,
	provincia VARCHAR(100) NOT NULL,
	distrito VARCHAR(100) NOT NULL,
	activo BOOLEAN NOT NULL DEFAULT true,
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ubigeo_codigo ON ubigeo(codigo);
CREATE INDEX idx_ubigeo_departamento ON ubigeo(departamento);

-- =====================================================

CREATE TABLE IF NOT EXISTS clasificacion (
	clasificacion_id SERIAL PRIMARY KEY,
	nombre VARCHAR(100) NOT NULL,
	descripcion VARCHAR(255),
	activo BOOLEAN NOT NULL DEFAULT true,
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_clasificacion_nombre ON clasificacion(nombre);

-- =====================================================

CREATE TABLE IF NOT EXISTS tabla_tablas (
	tabla_id SERIAL PRIMARY KEY,
	nombre_tabla VARCHAR(50) NOT NULL,
	columna_id VARCHAR(20) NOT NULL,
	descripcion VARCHAR(200) NOT NULL,
	valor VARCHAR(200) NOT NULL,
	orden SMALLINT DEFAULT 0,
	activo BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX idx_tabla_tablas_nombre ON tabla_tablas(nombre_tabla);

-- =====================================================

CREATE TABLE IF NOT EXISTS perfiles (
	perfil_id SERIAL PRIMARY KEY,
	nombre VARCHAR(50) NOT NULL UNIQUE,
	descripcion VARCHAR(200) NOT NULL,
	activo BOOLEAN NOT NULL DEFAULT true,
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================

CREATE TABLE IF NOT EXISTS entidades (
	entidad_id SERIAL PRIMARY KEY,
	ruc VARCHAR(11) NOT NULL UNIQUE,
	nombre VARCHAR(300) NOT NULL,
	direccion VARCHAR(200) NOT NULL,
	ubigeo_id UUID NOT NULL,
	nivel_gobierno_id INTEGER NOT NULL,
	telefono VARCHAR(20),
	email VARCHAR(100) NOT NULL,
	web VARCHAR(100),
	sector_id INTEGER NOT NULL,
	clasificacion_id INTEGER NOT NULL,
	nombre_alcalde VARCHAR(100) NOT NULL,
	ape_pat_alcalde VARCHAR(60) NOT NULL,
	ape_mat_alcalde VARCHAR(60) NOT NULL,
	email_alcalde VARCHAR(100) NOT NULL,
	activo BOOLEAN NOT NULL DEFAULT true,
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT fk_entidades_ubigeo FOREIGN KEY (ubigeo_id) REFERENCES ubigeo(ubigeo_id),
	CONSTRAINT fk_entidades_clasificacion FOREIGN KEY (clasificacion_id) REFERENCES clasificacion(clasificacion_id)
);

CREATE INDEX idx_entidades_ruc ON entidades(ruc);
CREATE INDEX idx_entidades_nombre ON entidades(nombre);
CREATE INDEX idx_entidades_activo ON entidades(activo);

-- =====================================================

CREATE TABLE IF NOT EXISTS usuarios (
	user_id SERIAL PRIMARY KEY,
	email VARCHAR(200) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	num_dni VARCHAR(15) NOT NULL UNIQUE,
	nombres VARCHAR(100) NOT NULL,
	ape_paterno VARCHAR(60) NOT NULL,
	ape_materno VARCHAR(60) NOT NULL,
	direccion VARCHAR(200),
	entidad_id INTEGER NOT NULL,
	activo BOOLEAN NOT NULL DEFAULT true,
	perfil_id INTEGER NOT NULL,
	last_login TIMESTAMP WITHOUT TIME ZONE,
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT fk_usuarios_entidad FOREIGN KEY (entidad_id) REFERENCES entidades(entidad_id),
	CONSTRAINT fk_usuarios_perfil FOREIGN KEY (perfil_id) REFERENCES perfiles(perfil_id)
);

CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_dni ON usuarios(num_dni);
CREATE INDEX idx_usuarios_entidad ON usuarios(entidad_id);

-- =====================================================

CREATE TABLE IF NOT EXISTS parametros (
	parametro_id SERIAL PRIMARY KEY,
	nombre VARCHAR(100) NOT NULL UNIQUE,
	valor TEXT NOT NULL,
	descripcion VARCHAR(255),
	tipo VARCHAR(50),
	activo BOOLEAN NOT NULL DEFAULT true,
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================

CREATE TABLE IF NOT EXISTS marco_normativo (
	norma_id SERIAL PRIMARY KEY,
	tipo_norma_id INTEGER NOT NULL,
	numero VARCHAR(20) NOT NULL,
	nombre_norma VARCHAR(150) NOT NULL,
	nivel_gobierno_id INTEGER NOT NULL,
	sector_id INTEGER NOT NULL,
	fecha_publicacion DATE NOT NULL,
	descripcion TEXT,
	url VARCHAR(500),
	activo BOOLEAN NOT NULL DEFAULT true,
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_marco_normativo_numero ON marco_normativo(numero);
CREATE INDEX idx_marco_normativo_tipo ON marco_normativo(tipo_norma_id);

-- =====================================================
-- COMPROMISOS
-- =====================================================

CREATE TABLE IF NOT EXISTS compromisos (
	compromiso_id SERIAL PRIMARY KEY,
	numero_compromiso INTEGER NOT NULL UNIQUE,
	codigo VARCHAR(20) NOT NULL UNIQUE,
	nombre VARCHAR(200) NOT NULL,
	descripcion TEXT,
	periodo_inicio DATE NOT NULL,
	periodo_fin DATE NOT NULL,
	activo BOOLEAN NOT NULL DEFAULT true,
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_compromisos_numero ON compromisos(numero_compromiso);
CREATE INDEX idx_compromisos_activo ON compromisos(activo);

-- =====================================================

CREATE TABLE IF NOT EXISTS alcance_compromisos (
	alcance_compromiso_id SERIAL PRIMARY KEY,
	compromiso_id INTEGER NOT NULL,
	clasificacion_id INTEGER NOT NULL,
	activo BOOLEAN NOT NULL DEFAULT true,
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT fk_alcance_compromiso FOREIGN KEY (compromiso_id) REFERENCES compromisos(compromiso_id),
	CONSTRAINT fk_alcance_clasificacion FOREIGN KEY (clasificacion_id) REFERENCES clasificacion(clasificacion_id),
	CONSTRAINT uk_alcance_comp_clasif UNIQUE (compromiso_id, clasificacion_id)
);

-- =====================================================

CREATE TABLE IF NOT EXISTS normas_compromisos (
	norma_compromiso_id SERIAL PRIMARY KEY,
	compromiso_id INTEGER NOT NULL,
	norma_id INTEGER NOT NULL,
	activo BOOLEAN NOT NULL DEFAULT true,
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT fk_normas_comp_compromiso FOREIGN KEY (compromiso_id) REFERENCES compromisos(compromiso_id),
	CONSTRAINT fk_normas_comp_norma FOREIGN KEY (norma_id) REFERENCES marco_normativo(norma_id),
	CONSTRAINT uk_norma_compromiso UNIQUE (compromiso_id, norma_id)
);

-- =====================================================

CREATE TABLE IF NOT EXISTS criterios_compromisos (
	criterio_compromiso_id SERIAL PRIMARY KEY,
	compromiso_id INTEGER NOT NULL,
	nombre_criterio VARCHAR(200) NOT NULL,
	descripcion TEXT,
	orden SMALLINT DEFAULT 0,
	activo BOOLEAN NOT NULL DEFAULT true,
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT fk_criterios_compromiso FOREIGN KEY (compromiso_id) REFERENCES compromisos(compromiso_id)
);

-- =====================================================

CREATE TABLE IF NOT EXISTS criterios_compromisos_entidades (
	criterio_compromiso_entidad_id SERIAL PRIMARY KEY,
	criterio_compromiso_id INTEGER NOT NULL,
	entidad_id INTEGER NOT NULL,
	cumple BOOLEAN NOT NULL DEFAULT false,
	observaciones TEXT,
	fecha_evaluacion DATE,
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT fk_cce_criterio FOREIGN KEY (criterio_compromiso_id) REFERENCES criterios_compromisos(criterio_compromiso_id),
	CONSTRAINT fk_cce_entidad FOREIGN KEY (entidad_id) REFERENCES entidades(entidad_id),
	CONSTRAINT uk_criterio_entidad UNIQUE (criterio_compromiso_id, entidad_id)
);

-- =====================================================

CREATE TABLE IF NOT EXISTS normas_compromisos_entidades (
	norma_compromiso_entidad_id SERIAL PRIMARY KEY,
	norma_compromiso_id INTEGER NOT NULL,
	entidad_id INTEGER NOT NULL,
	ruta_pdf VARCHAR(500),
	fecha_resolucion DATE NOT NULL,
	numero_resolucion VARCHAR(50) NOT NULL,
	observaciones TEXT,
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT fk_nce_norma_compromiso FOREIGN KEY (norma_compromiso_id) REFERENCES normas_compromisos(norma_compromiso_id),
	CONSTRAINT fk_nce_entidad FOREIGN KEY (entidad_id) REFERENCES entidades(entidad_id)
);

-- =====================================================
-- TABLA BASE PARA COMPROMISOS ENTIDADES (Herencia)
-- =====================================================

CREATE TABLE IF NOT EXISTS compromisos_entidades_base (
	compromiso_entidad_id SERIAL PRIMARY KEY,
	compromiso_id INTEGER NOT NULL,
	entidad_id INTEGER NOT NULL,
	tipo_compromiso VARCHAR(20) NOT NULL,
	etapa_formulario VARCHAR(20) NOT NULL DEFAULT 'BORRADOR',
	estado VARCHAR(15) NOT NULL DEFAULT 'PENDIENTE',
	check_privacidad BOOLEAN NOT NULL DEFAULT false,
	check_ddjj BOOLEAN NOT NULL DEFAULT false,
	estado_pcm VARCHAR(50) DEFAULT 'POR_REVISAR',
	observaciones_pcm TEXT,
	fecha_registro DATE NOT NULL DEFAULT CURRENT_DATE,
	usuario_registra INTEGER NOT NULL,
	activo BOOLEAN NOT NULL DEFAULT true,
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT fk_ceb_compromiso FOREIGN KEY (compromiso_id) REFERENCES compromisos(compromiso_id),
	CONSTRAINT fk_ceb_entidad FOREIGN KEY (entidad_id) REFERENCES entidades(entidad_id),
	CONSTRAINT fk_ceb_usuario FOREIGN KEY (usuario_registra) REFERENCES usuarios(user_id),
	CONSTRAINT uk_comp_ent_tipo UNIQUE (compromiso_id, entidad_id, tipo_compromiso)
);

CREATE INDEX idx_ceb_entidad ON compromisos_entidades_base(entidad_id);
CREATE INDEX idx_ceb_compromiso ON compromisos_entidades_base(compromiso_id);
CREATE INDEX idx_ceb_estado ON compromisos_entidades_base(estado);

-- =====================================================
-- COMPROMISO 1: LIDERAZGO EN TRANSFORMACIÓN DIGITAL
-- =====================================================

CREATE TABLE IF NOT EXISTS com1_liderg_td (
	com1_id SERIAL PRIMARY KEY,
	compromiso_entidad_id INTEGER NOT NULL UNIQUE,
	dni_lider VARCHAR(12) NOT NULL,
	nombre_lider VARCHAR(100) NOT NULL,
	ape_pat_lider VARCHAR(60) NOT NULL,
	ape_mat_lider VARCHAR(60) NOT NULL,
	email_lider VARCHAR(100) NOT NULL,
	telefono_lider VARCHAR(30),
	rol_lider VARCHAR(50),
	cargo_lider VARCHAR(100),
	fecha_inicio_lider DATE NOT NULL,
	fecha_fin_lider DATE,
	CONSTRAINT fk_com1_base FOREIGN KEY (compromiso_entidad_id) REFERENCES compromisos_entidades_base(compromiso_entidad_id) ON DELETE CASCADE
);

CREATE INDEX idx_com1_dni ON com1_liderg_td(dni_lider);

-- =====================================================
-- COMPROMISO 2: COMITÉ DE GOBIERNO DIGITAL
-- =====================================================

CREATE TABLE IF NOT EXISTS com2_cgtd (
	com2_id SERIAL PRIMARY KEY,
	compromiso_entidad_id INTEGER NOT NULL UNIQUE,
	fecha_conformacion DATE NOT NULL,
	numero_resolucion VARCHAR(50) NOT NULL,
	CONSTRAINT fk_com2_base FOREIGN KEY (compromiso_entidad_id) REFERENCES compromisos_entidades_base(compromiso_entidad_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comite_miembros (
	miembro_id SERIAL PRIMARY KEY,
	com2_id INTEGER NOT NULL,
	numero_miembro SMALLINT NOT NULL,
	dni_miembro VARCHAR(12) NOT NULL,
	nombre_miembro VARCHAR(100) NOT NULL,
	ape_pat_miembro VARCHAR(60) NOT NULL,
	ape_mat_miembro VARCHAR(60) NOT NULL,
	email_miembro VARCHAR(100) NOT NULL,
	telefono_miembro VARCHAR(30),
	cargo_miembro VARCHAR(100) NOT NULL,
	rol_en_comite VARCHAR(50) NOT NULL,
	fecha_designacion DATE NOT NULL,
	fecha_fin DATE,
	activo BOOLEAN NOT NULL DEFAULT true,
	CONSTRAINT fk_miembros_comite FOREIGN KEY (com2_id) REFERENCES com2_cgtd(com2_id) ON DELETE CASCADE
);

CREATE INDEX idx_miembros_com2 ON comite_miembros(com2_id);

-- =====================================================
-- COMPROMISO 3: ESTADO DEL GOBIERNO DIGITAL
-- =====================================================

CREATE TABLE IF NOT EXISTS com3_epgd (
	com3_id SERIAL PRIMARY KEY,
	compromiso_entidad_id INTEGER NOT NULL UNIQUE,
	fecha_reporte DATE NOT NULL,
	sede VARCHAR(100),
	observaciones TEXT,
	ubicacion_area_ti VARCHAR(255),
	organigrama_ti VARCHAR(500),
	dependencia_area_ti VARCHAR(100),
	presupuesto_anual_ti NUMERIC(15,2),
	existe_comision_gd_ti BOOLEAN NOT NULL DEFAULT false,
	CONSTRAINT fk_com3_base FOREIGN KEY (compromiso_entidad_id) REFERENCES compromisos_entidades_base(compromiso_entidad_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS personal_ti (
	personal_id SERIAL PRIMARY KEY,
	com3_id INTEGER NOT NULL,
	nombre_completo VARCHAR(200) NOT NULL,
	dni VARCHAR(12) NOT NULL,
	cargo VARCHAR(100) NOT NULL,
	rol VARCHAR(50),
	especialidad VARCHAR(100),
	grado_instruccion VARCHAR(50),
	certificacion VARCHAR(100),
	entidad_certificadora VARCHAR(100),
	codigo_certificacion VARCHAR(50),
	numero_colegiatura VARCHAR(30),
	email_personal VARCHAR(100),
	telefono VARCHAR(30),
	CONSTRAINT fk_personal_com3 FOREIGN KEY (com3_id) REFERENCES com3_epgd(com3_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS inventario_software (
	software_id SERIAL PRIMARY KEY,
	com3_id INTEGER NOT NULL,
	codigo_producto VARCHAR(50),
	nombre_producto VARCHAR(150) NOT NULL,
	version VARCHAR(50),
	cantidad_instalaciones INTEGER DEFAULT 0,
	tipo_software VARCHAR(50),
	cantidad_licencias INTEGER DEFAULT 0,
	exceso_deficiencia INTEGER DEFAULT 0,
	costo_licencias NUMERIC(12,2),
	CONSTRAINT fk_software_com3 FOREIGN KEY (com3_id) REFERENCES com3_epgd(com3_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS inventario_sistemas_info (
	sistema_id SERIAL PRIMARY KEY,
	com3_id INTEGER NOT NULL,
	codigo VARCHAR(20),
	nombre_sistema VARCHAR(150) NOT NULL,
	descripcion TEXT,
	tipo_sistema VARCHAR(50),
	lenguaje_programacion VARCHAR(50),
	base_datos VARCHAR(50),
	plataforma VARCHAR(20),
	CONSTRAINT fk_sistemas_com3 FOREIGN KEY (com3_id) REFERENCES com3_epgd(com3_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS inventario_red (
	red_id SERIAL PRIMARY KEY,
	com3_id INTEGER NOT NULL,
	tipo_equipo VARCHAR(80) NOT NULL,
	cantidad INTEGER DEFAULT 0,
	puertos_operativos INTEGER DEFAULT 0,
	puertos_inoperativos INTEGER DEFAULT 0,
	total_puertos INTEGER DEFAULT 0,
	costo_mantenimiento_anual NUMERIC(12,2),
	observaciones TEXT,
	CONSTRAINT fk_red_com3 FOREIGN KEY (com3_id) REFERENCES com3_epgd(com3_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS inventario_servidores (
	servidor_id SERIAL PRIMARY KEY,
	com3_id INTEGER NOT NULL,
	nombre_equipo VARCHAR(100) NOT NULL,
	tipo_equipo VARCHAR(20),
	estado VARCHAR(30),
	capa VARCHAR(30),
	propiedad VARCHAR(20),
	montaje VARCHAR(20),
	marca_cpu VARCHAR(50),
	modelo_cpu VARCHAR(50),
	velocidad_ghz NUMERIC(5,2),
	nucleos INTEGER,
	memoria_gb INTEGER,
	marca_memoria VARCHAR(50),
	modelo_memoria VARCHAR(50),
	cantidad_memoria INTEGER,
	costo_mantenimiento_anual NUMERIC(12,2),
	observaciones TEXT,
	CONSTRAINT fk_servidores_com3 FOREIGN KEY (com3_id) REFERENCES com3_epgd(com3_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS seguridad_info (
	seguridad_id SERIAL PRIMARY KEY,
	com3_id INTEGER NOT NULL UNIQUE,
	plan_sgsi BOOLEAN NOT NULL DEFAULT false,
	comite_seguridad BOOLEAN NOT NULL DEFAULT false,
	oficial_seguridad_en_organigrama BOOLEAN NOT NULL DEFAULT false,
	politica_seguridad BOOLEAN NOT NULL DEFAULT false,
	inventario_activos BOOLEAN NOT NULL DEFAULT false,
	analisis_riesgos BOOLEAN NOT NULL DEFAULT false,
	metodologia_riesgos VARCHAR(100),
	plan_continuidad BOOLEAN NOT NULL DEFAULT false,
	programa_auditorias BOOLEAN NOT NULL DEFAULT false,
	informes_direccion BOOLEAN NOT NULL DEFAULT false,
	certificacion_iso27001 BOOLEAN NOT NULL DEFAULT false,
	observaciones TEXT,
	CONSTRAINT fk_seguridad_com3 FOREIGN KEY (com3_id) REFERENCES com3_epgd(com3_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS capacitaciones_seginfo (
	capacitacion_id SERIAL PRIMARY KEY,
	com3_id INTEGER NOT NULL,
	curso VARCHAR(150) NOT NULL,
	cantidad_personas INTEGER DEFAULT 0,
	fecha_capacitacion DATE,
	CONSTRAINT fk_capacitaciones_com3 FOREIGN KEY (com3_id) REFERENCES com3_epgd(com3_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS objetivos_entidades (
	objetivo_id SERIAL PRIMARY KEY,
	com3_id INTEGER NOT NULL,
	tipo_objetivo VARCHAR(1) NOT NULL,
	numeracion_objetivo VARCHAR(5) NOT NULL,
	descripcion_objetivo TEXT NOT NULL,
	CONSTRAINT fk_objetivos_com3 FOREIGN KEY (com3_id) REFERENCES com3_epgd(com3_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS acciones_objetivos_entidades (
	accion_id SERIAL PRIMARY KEY,
	objetivo_id INTEGER NOT NULL,
	numeracion_accion VARCHAR(5) NOT NULL,
	descripcion_accion TEXT NOT NULL,
	CONSTRAINT fk_acciones_objetivo FOREIGN KEY (objetivo_id) REFERENCES objetivos_entidades(objetivo_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS proyectos_entidades (
	proyecto_id SERIAL PRIMARY KEY,
	com3_id INTEGER NOT NULL,
	numeracion_proyecto VARCHAR(10) NOT NULL,
	nombre VARCHAR(150) NOT NULL,
	alcance TEXT,
	justificacion TEXT,
	tipo_proyecto VARCHAR(100),
	area_proyecto VARCHAR(100),
	area_ejecuta VARCHAR(100),
	tipo_beneficiario VARCHAR(100),
	etapa_proyecto VARCHAR(100),
	ambito_proyecto VARCHAR(100),
	fecha_inicio_programada DATE,
	fecha_fin_programada DATE,
	fecha_inicio_real DATE,
	fecha_fin_real DATE,
	alineado_pgd VARCHAR(100),
	objetivo_transformacion_digital VARCHAR(100),
	objetivo_estrategico VARCHAR(100),
	accion_estrategica VARCHAR(100),
	estado_proyecto VARCHAR(50) DEFAULT 'ACTIVO',
	CONSTRAINT fk_proyectos_com3 FOREIGN KEY (com3_id) REFERENCES com3_epgd(com3_id) ON DELETE CASCADE
);

-- =====================================================
-- COMPROMISO 4: TRANSFORMACIÓN DIGITAL EN PEI
-- =====================================================

CREATE TABLE IF NOT EXISTS com4_tdpei (
	com4_id SERIAL PRIMARY KEY,
	compromiso_entidad_id INTEGER NOT NULL UNIQUE,
	anio_inicio_pei INTEGER NOT NULL,
	anio_fin_pei INTEGER NOT NULL,
	objetivo_pei TEXT,
	descripcion_pei TEXT,
	alineado_pgd BOOLEAN NOT NULL DEFAULT false,
	fecha_aprobacion_pei DATE NOT NULL,
	ruta_pdf_pei VARCHAR(500),
	CONSTRAINT fk_com4_base FOREIGN KEY (compromiso_entidad_id) REFERENCES compromisos_entidades_base(compromiso_entidad_id) ON DELETE CASCADE
);

-- =====================================================
-- COMPROMISO 5: DISEÑO DE ESTRATEGIA DIGITAL
-- =====================================================

CREATE TABLE IF NOT EXISTS com5_destrategiad (
	com5_id SERIAL PRIMARY KEY,
	compromiso_entidad_id INTEGER NOT NULL UNIQUE,
	nombre_estrategia VARCHAR(200) NOT NULL,
	periodo_inicio INTEGER NOT NULL,
	periodo_fin INTEGER NOT NULL,
	objetivos_estrategicos TEXT,
	lineas_accion TEXT,
	fecha_aprobacion DATE NOT NULL,
	alineado_pgd BOOLEAN NOT NULL DEFAULT false,
	estado_implementacion VARCHAR(50),
	ruta_pdf_estrategia VARCHAR(500),
	CONSTRAINT fk_com5_base FOREIGN KEY (compromiso_entidad_id) REFERENCES compromisos_entidades_base(compromiso_entidad_id) ON DELETE CASCADE
);

-- =====================================================
-- COMPROMISO 6: MIGRACIÓN A PLATAFORMA GOB.PE
-- =====================================================

CREATE TABLE IF NOT EXISTS com6_mpgobpe (
	com6_id SERIAL PRIMARY KEY,
	compromiso_entidad_id INTEGER NOT NULL UNIQUE,
	url_gobpe VARCHAR(200) NOT NULL,
	fecha_migracion DATE NOT NULL,
	fecha_actualizacion DATE,
	responsable VARCHAR(150) NOT NULL,
	correo_responsable VARCHAR(100) NOT NULL,
	telefono_responsable VARCHAR(30),
	tipo_migracion VARCHAR(50),
	observacion TEXT,
	ruta_pdf VARCHAR(500),
	CONSTRAINT fk_com6_base FOREIGN KEY (compromiso_entidad_id) REFERENCES compromisos_entidades_base(compromiso_entidad_id) ON DELETE CASCADE
);

-- =====================================================
-- COMPROMISO 7: IMPLEMENTACIÓN DE MPD
-- =====================================================

CREATE TABLE IF NOT EXISTS com7_impd (
	com7_id SERIAL PRIMARY KEY,
	compromiso_entidad_id INTEGER NOT NULL UNIQUE,
	url_mpd VARCHAR(200) NOT NULL,
	fecha_implementacion DATE NOT NULL,
	responsable VARCHAR(150) NOT NULL,
	cargo_responsable VARCHAR(100),
	correo_responsable VARCHAR(100) NOT NULL,
	telefono_responsable VARCHAR(30),
	tipo_mpd VARCHAR(50),
	interoperabilidad BOOLEAN NOT NULL DEFAULT false,
	observacion TEXT,
	ruta_pdf VARCHAR(500),
	CONSTRAINT fk_com7_base FOREIGN KEY (compromiso_entidad_id) REFERENCES compromisos_entidades_base(compromiso_entidad_id) ON DELETE CASCADE
);

-- =====================================================
-- COMPROMISO 8: PUBLICACIÓN DE TUPA
-- =====================================================

CREATE TABLE IF NOT EXISTS com8_ptupa (
	com8_id SERIAL PRIMARY KEY,
	compromiso_entidad_id INTEGER NOT NULL UNIQUE,
	url_tupa VARCHAR(200) NOT NULL,
	numero_resolucion VARCHAR(50) NOT NULL,
	fecha_aprobacion DATE NOT NULL,
	responsable VARCHAR(150) NOT NULL,
	cargo_responsable VARCHAR(100),
	correo_responsable VARCHAR(100) NOT NULL,
	telefono_responsable VARCHAR(30),
	actualizado BOOLEAN NOT NULL DEFAULT true,
	observacion TEXT,
	ruta_pdf VARCHAR(500),
	CONSTRAINT fk_com8_base FOREIGN KEY (compromiso_entidad_id) REFERENCES compromisos_entidades_base(compromiso_entidad_id) ON DELETE CASCADE
);

-- =====================================================
-- COMPROMISO 9: IMPLEMENTACIÓN DE MGD
-- =====================================================

CREATE TABLE IF NOT EXISTS com9_imgd (
	com9_id SERIAL PRIMARY KEY,
	compromiso_entidad_id INTEGER NOT NULL UNIQUE,
	fecha_aprobacion DATE NOT NULL,
	numero_resolucion VARCHAR(50) NOT NULL,
	responsable VARCHAR(150) NOT NULL,
	cargo_responsable VARCHAR(100),
	correo_responsable VARCHAR(100) NOT NULL,
	telefono_responsable VARCHAR(30),
	sistema_gestion_documental VARCHAR(150),
	tipo_implementacion VARCHAR(50),
	interoperabilidad BOOLEAN NOT NULL DEFAULT false,
	observacion TEXT,
	ruta_pdf VARCHAR(500),
	CONSTRAINT fk_com9_base FOREIGN KEY (compromiso_entidad_id) REFERENCES compromisos_entidades_base(compromiso_entidad_id) ON DELETE CASCADE
);

-- =====================================================
-- COMPROMISO 10: PUBLICACIÓN EN DATOS ABIERTOS
-- =====================================================

CREATE TABLE IF NOT EXISTS com10_pnda (
	com10_id SERIAL PRIMARY KEY,
	compromiso_entidad_id INTEGER NOT NULL UNIQUE,
	url_pnda VARCHAR(200) NOT NULL,
	total_datasets_publicados INTEGER DEFAULT 0,
	fecha_ultima_actualizacion DATE,
	responsable VARCHAR(150) NOT NULL,
	cargo_responsable VARCHAR(100),
	correo_responsable VARCHAR(100) NOT NULL,
	telefono_responsable VARCHAR(30),
	norma_aprobacion VARCHAR(100),
	fecha_aprobacion DATE,
	observacion TEXT,
	ruta_pdf VARCHAR(500),
	CONSTRAINT fk_com10_base FOREIGN KEY (compromiso_entidad_id) REFERENCES compromisos_entidades_base(compromiso_entidad_id) ON DELETE CASCADE
);

-- =====================================================
-- COMPROMISO 11: ACCESO A GEOPORTAL
-- =====================================================

CREATE TABLE IF NOT EXISTS com11_ageop (
	com11_id SERIAL PRIMARY KEY,
	compromiso_entidad_id INTEGER NOT NULL UNIQUE,
	url_geoportal VARCHAR(200) NOT NULL,
	tipo_informacion VARCHAR(100),
	total_capas_publicadas INTEGER DEFAULT 0,
	fecha_ultima_actualizacion DATE,
	responsable VARCHAR(150) NOT NULL,
	cargo_responsable VARCHAR(100),
	correo_responsable VARCHAR(100) NOT NULL,
	telefono_responsable VARCHAR(30),
	norma_aprobacion VARCHAR(100),
	fecha_aprobacion DATE,
	interoperabilidad BOOLEAN NOT NULL DEFAULT false,
	observacion TEXT,
	ruta_pdf VARCHAR(500),
	CONSTRAINT fk_com11_base FOREIGN KEY (compromiso_entidad_id) REFERENCES compromisos_entidades_base(compromiso_entidad_id) ON DELETE CASCADE
);

-- =====================================================
-- COMPROMISO 12: DESIGNACIÓN RSP
-- =====================================================

CREATE TABLE IF NOT EXISTS com12_drsp (
	com12_id SERIAL PRIMARY KEY,
	compromiso_entidad_id INTEGER NOT NULL UNIQUE,
	dni_rsp VARCHAR(12) NOT NULL,
	nombre_rsp VARCHAR(100) NOT NULL,
	ape_pat_rsp VARCHAR(60) NOT NULL,
	ape_mat_rsp VARCHAR(60) NOT NULL,
	cargo_rsp VARCHAR(100) NOT NULL,
	correo_rsp VARCHAR(100) NOT NULL,
	telefono_rsp VARCHAR(30),
	fecha_designacion DATE NOT NULL,
	numero_resolucion VARCHAR(50) NOT NULL,
	ruta_pdf VARCHAR(500),
	observacion TEXT,
	CONSTRAINT fk_com12_base FOREIGN KEY (compromiso_entidad_id) REFERENCES compromisos_entidades_base(compromiso_entidad_id) ON DELETE CASCADE
);

-- =====================================================
-- COMPROMISO 13: PARTICIPACIÓN EN PIDE
-- =====================================================

CREATE TABLE IF NOT EXISTS com13_pcpide (
	com13_id SERIAL PRIMARY KEY,
	compromiso_entidad_id INTEGER NOT NULL UNIQUE,
	tipo_integracion VARCHAR(50) NOT NULL,
	nombre_servicio VARCHAR(200) NOT NULL,
	descripcion_servicio TEXT,
	fecha_inicio_operacion DATE NOT NULL,
	responsable VARCHAR(150) NOT NULL,
	cargo_responsable VARCHAR(100),
	correo_responsable VARCHAR(100) NOT NULL,
	telefono_responsable VARCHAR(30),
	numero_convenio VARCHAR(50),
	fecha_convenio DATE,
	interoperabilidad BOOLEAN NOT NULL DEFAULT true,
	url_servicio VARCHAR(200),
	observacion TEXT,
	ruta_pdf VARCHAR(500),
	CONSTRAINT fk_com13_base FOREIGN KEY (compromiso_entidad_id) REFERENCES compromisos_entidades_base(compromiso_entidad_id) ON DELETE CASCADE
);

-- =====================================================
-- COMPROMISO 14: DESIGNACIÓN OSCD
-- =====================================================

CREATE TABLE IF NOT EXISTS com14_doscd (
	com14_id SERIAL PRIMARY KEY,
	compromiso_entidad_id INTEGER NOT NULL UNIQUE,
	dni_oscd VARCHAR(12) NOT NULL,
	nombre_oscd VARCHAR(100) NOT NULL,
	ape_pat_oscd VARCHAR(60) NOT NULL,
	ape_mat_oscd VARCHAR(60) NOT NULL,
	cargo_oscd VARCHAR(100) NOT NULL,
	correo_oscd VARCHAR(100) NOT NULL,
	telefono_oscd VARCHAR(30),
	fecha_designacion DATE NOT NULL,
	numero_resolucion VARCHAR(50) NOT NULL,
	comunicado_pcm BOOLEAN NOT NULL DEFAULT false,
	ruta_pdf VARCHAR(500),
	observacion TEXT,
	CONSTRAINT fk_com14_base FOREIGN KEY (compromiso_entidad_id) REFERENCES compromisos_entidades_base(compromiso_entidad_id) ON DELETE CASCADE
);

-- =====================================================
-- COMPROMISO 15: CSIRT
-- =====================================================

CREATE TABLE IF NOT EXISTS com15_csirt (
	com15_id SERIAL PRIMARY KEY,
	compromiso_entidad_id INTEGER NOT NULL UNIQUE,
	nombre_csirt VARCHAR(200) NOT NULL,
	fecha_conformacion DATE NOT NULL,
	numero_resolucion VARCHAR(50) NOT NULL,
	responsable VARCHAR(150) NOT NULL,
	cargo_responsable VARCHAR(100),
	correo_csirt VARCHAR(100) NOT NULL,
	telefono_csirt VARCHAR(30),
	protocolo_incidentes BOOLEAN NOT NULL DEFAULT false,
	comunicado_pcm BOOLEAN NOT NULL DEFAULT false,
	ruta_pdf VARCHAR(500),
	observacion TEXT,
	CONSTRAINT fk_com15_base FOREIGN KEY (compromiso_entidad_id) REFERENCES compromisos_entidades_base(compromiso_entidad_id) ON DELETE CASCADE
);

-- =====================================================
-- COMPROMISO 16: SGSI
-- =====================================================

CREATE TABLE IF NOT EXISTS com16_sgsi (
	com16_id SERIAL PRIMARY KEY,
	compromiso_entidad_id INTEGER NOT NULL UNIQUE,
	responsable VARCHAR(150) NOT NULL,
	cargo_responsable VARCHAR(100),
	correo_sgsi VARCHAR(100) NOT NULL,
	telefono_sgsi VARCHAR(30),
	estado_implementacion VARCHAR(50),
	alcance TEXT,
	fecha_inicio DATE,
	fecha_certificacion DATE,
	entidad_certificadora VARCHAR(150),
	version_norma VARCHAR(20),
	ruta_pdf_certificado VARCHAR(500),
	ruta_pdf_politicas VARCHAR(500),
	observacion TEXT,
	CONSTRAINT fk_com16_base FOREIGN KEY (compromiso_entidad_id) REFERENCES compromisos_entidades_base(compromiso_entidad_id) ON DELETE CASCADE
);

-- =====================================================
-- COMPROMISO 17: PLAN DE TRANSICIÓN IPV6
-- =====================================================

CREATE TABLE IF NOT EXISTS com17_ptipv6 (
	com17_id SERIAL PRIMARY KEY,
	compromiso_entidad_id INTEGER NOT NULL UNIQUE,
	responsable VARCHAR(150) NOT NULL,
	cargo_responsable VARCHAR(100),
	correo_ipv6 VARCHAR(100) NOT NULL,
	telefono_ipv6 VARCHAR(30),
	estado_plan VARCHAR(50),
	fecha_formulacion DATE,
	fecha_aprobacion DATE,
	fecha_inicio DATE,
	fecha_fin DATE,
	descripcion_plan TEXT,
	ruta_pdf VARCHAR(500),
	observacion TEXT,
	CONSTRAINT fk_com17_base FOREIGN KEY (compromiso_entidad_id) REFERENCES compromisos_entidades_base(compromiso_entidad_id) ON DELETE CASCADE
);

-- =====================================================
-- COMPROMISO 18: SOLICITUD ACCESO PTE
-- =====================================================

CREATE TABLE IF NOT EXISTS com18_sapte (
	com18_id SERIAL PRIMARY KEY,
	compromiso_entidad_id INTEGER NOT NULL UNIQUE,
	responsable VARCHAR(150) NOT NULL,
	cargo_responsable VARCHAR(100),
	correo_pte VARCHAR(100) NOT NULL,
	telefono_pte VARCHAR(30),
	fecha_solicitud DATE NOT NULL,
	fecha_acceso DATE,
	numero_oficio VARCHAR(50) NOT NULL,
	estado_acceso VARCHAR(50),
	enlace_portal VARCHAR(200),
	descripcion TEXT,
	ruta_pdf VARCHAR(500),
	observacion TEXT,
	CONSTRAINT fk_com18_base FOREIGN KEY (compromiso_entidad_id) REFERENCES compromisos_entidades_base(compromiso_entidad_id) ON DELETE CASCADE
);

-- =====================================================
-- COMPROMISO 19: REPORTE ENAD
-- =====================================================

CREATE TABLE IF NOT EXISTS com19_renad (
	com19_id SERIAL PRIMARY KEY,
	compromiso_entidad_id INTEGER NOT NULL UNIQUE,
	anio_enad INTEGER NOT NULL,
	responsable VARCHAR(150) NOT NULL,
	cargo_responsable VARCHAR(100),
	correo_enad VARCHAR(100) NOT NULL,
	telefono_enad VARCHAR(30),
	fecha_envio DATE NOT NULL,
	estado_respuesta VARCHAR(50),
	enlace_formulario VARCHAR(200),
	observacion TEXT,
	ruta_pdf VARCHAR(500),
	CONSTRAINT fk_com19_base FOREIGN KEY (compromiso_entidad_id) REFERENCES compromisos_entidades_base(compromiso_entidad_id) ON DELETE CASCADE
);

-- =====================================================
-- COMPROMISO 20: DIGITALIZACIÓN SERVICIOS FACILITA PERÚ
-- =====================================================

CREATE TABLE IF NOT EXISTS com20_dsfpe (
	com20_id SERIAL PRIMARY KEY,
	compromiso_entidad_id INTEGER NOT NULL UNIQUE,
	responsable VARCHAR(150) NOT NULL,
	cargo_responsable VARCHAR(100),
	correo_facilita VARCHAR(100) NOT NULL,
	telefono_facilita VARCHAR(30),
	estado_implementacion VARCHAR(50),
	fecha_inicio DATE,
	fecha_ultimo_avance DATE,
	total_servicios_digitalizados INTEGER DEFAULT 0,
	ruta_pdf VARCHAR(500),
	observacion TEXT,
	CONSTRAINT fk_com20_base FOREIGN KEY (compromiso_entidad_id) REFERENCES compromisos_entidades_base(compromiso_entidad_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS servicios_facilita_entidades (
	servicio_facilita_id SERIAL PRIMARY KEY,
	com20_id INTEGER NOT NULL,
	nombre_servicio VARCHAR(200) NOT NULL,
	tipo_servicio VARCHAR(100),
	nivel_digitalizacion VARCHAR(50),
	fecha_registro DATE NOT NULL,
	enlace_servicio VARCHAR(200),
	descripcion_servicio TEXT,
	area_responsable VARCHAR(100),
	estado_operativo BOOLEAN NOT NULL DEFAULT true,
	ruta_pdf_evidencia VARCHAR(500),
	CONSTRAINT fk_servicios_com20 FOREIGN KEY (com20_id) REFERENCES com20_dsfpe(com20_id) ON DELETE CASCADE
);

-- =====================================================
-- COMPROMISO 21: DESIGNACIÓN OGD
-- =====================================================

CREATE TABLE IF NOT EXISTS com21_dogd (
	com21_id SERIAL PRIMARY KEY,
	compromiso_entidad_id INTEGER NOT NULL UNIQUE,
	dni_ogd VARCHAR(12) NOT NULL,
	nombre_ogd VARCHAR(100) NOT NULL,
	ape_pat_ogd VARCHAR(60) NOT NULL,
	ape_mat_ogd VARCHAR(60) NOT NULL,
	cargo_ogd VARCHAR(100) NOT NULL,
	correo_ogd VARCHAR(100) NOT NULL,
	telefono_ogd VARCHAR(30),
	fecha_designacion DATE NOT NULL,
	numero_resolucion VARCHAR(50) NOT NULL,
	comunicado_pcm BOOLEAN NOT NULL DEFAULT false,
	ruta_pdf VARCHAR(500),
	observacion TEXT,
	CONSTRAINT fk_com21_base FOREIGN KEY (compromiso_entidad_id) REFERENCES compromisos_entidades_base(compromiso_entidad_id) ON DELETE CASCADE
);

-- =====================================================
-- LOG DE AUDITORÍA
-- =====================================================

CREATE TABLE IF NOT EXISTS log_auditoria (
	log_id SERIAL PRIMARY KEY,
	entidad_id INTEGER NOT NULL,
	compromiso_id INTEGER,
	usuario_id INTEGER NOT NULL,
	accion VARCHAR(100) NOT NULL,
	tabla_afectada VARCHAR(100),
	registro_id INTEGER,
	detalle TEXT,
	ip_address VARCHAR(45),
	user_agent VARCHAR(255),
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT fk_log_entidad FOREIGN KEY (entidad_id) REFERENCES entidades(entidad_id),
	CONSTRAINT fk_log_compromiso FOREIGN KEY (compromiso_id) REFERENCES compromisos(compromiso_id),
	CONSTRAINT fk_log_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(user_id)
);

CREATE INDEX idx_log_entidad ON log_auditoria(entidad_id);
CREATE INDEX idx_log_compromiso ON log_auditoria(compromiso_id);
CREATE INDEX idx_log_created_at ON log_auditoria(created_at);

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a tablas con updated_at
CREATE TRIGGER update_ubigeo_updated_at BEFORE UPDATE ON ubigeo
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_entidades_updated_at BEFORE UPDATE ON entidades
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parametros_updated_at BEFORE UPDATE ON parametros
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_compromisos_updated_at BEFORE UPDATE ON compromisos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ceb_updated_at BEFORE UPDATE ON compromisos_entidades_base
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMENTARIOS EN TABLAS
-- =====================================================

COMMENT ON TABLE compromisos_entidades_base IS 'Tabla base que centraliza información común de todos los compromisos por entidad';
COMMENT ON TABLE ubigeo IS 'Catálogo de ubigeos del Perú (departamento, provincia, distrito)';
COMMENT ON TABLE clasificacion IS 'Clasificación de entidades por categoría';
COMMENT ON TABLE entidades IS 'Entidades públicas registradas en la plataforma';
COMMENT ON TABLE usuarios IS 'Usuarios del sistema';
COMMENT ON TABLE compromisos IS 'Catálogo de compromisos de gobierno digital';
COMMENT ON TABLE log_auditoria IS 'Registro de auditoría de todas las acciones en el sistema';

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
