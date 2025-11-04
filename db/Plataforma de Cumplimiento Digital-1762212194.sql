CREATE TABLE IF NOT EXISTS "ubigeo" (
	"ubigeo_id" varchar(36) NOT NULL,
	"codigo" varchar(6) NOT NULL UNIQUE,
	"departamento" varchar(100) NOT NULL,
	"provincia" varchar(100) NOT NULL,
	"distrito" varchar(100) NOT NULL,
	PRIMARY KEY ("ubigeo_id")
);

CREATE TABLE IF NOT EXISTS "entidades" (
	"entidad_id" serial NOT NULL,
	"ruc" varchar(11) NOT NULL,
	"nombre" varchar(300) NOT NULL,
	"direccion" varchar(200) NOT NULL,
	"ubigeo_id" varchar(36) NOT NULL,
	"nivelg_id" bigint NOT NULL,
	"telefono" varchar(20) NOT NULL,
	"email" varchar(60) NOT NULL,
	"web" varchar(100) NOT NULL,
	"sector_id" bigint NOT NULL,
	"clasificacion_id" bigint NOT NULL,
	"nombre_alcalde" varchar(50) NOT NULL,
	"ape_pat_alcalde" varchar(60) NOT NULL,
	"ape_mat_alcalde" varchar(60) NOT NULL,
	"email_alcalde" varchar(20) NOT NULL,
	"activo" smallint NOT NULL DEFAULT '1',
	"fecha_creacion" timestamp without time zone NOT NULL DEFAULT 'current_timestamp',
	PRIMARY KEY ("entidad_id")
);

CREATE TABLE IF NOT EXISTS "usuarios" (
	"user_id" serial NOT NULL,
	"email" varchar(200) NOT NULL,
	"password" varchar(255) NOT NULL,
	"num_dni" varchar(15) NOT NULL,
	"nombres" varchar(50) NOT NULL,
	"ape_paterno" varchar(60) NOT NULL,
	"ape_materno" varchar(60) NOT NULL,
	"direccion" bigint NOT NULL,
	"entidad_id" bigint NOT NULL,
	"activo" boolean NOT NULL DEFAULT '1',
	"perfil_id" smallint NOT NULL,
	"last_login" date NOT NULL,
	"created_at" date NOT NULL DEFAULT 'current_timestamp',
	PRIMARY KEY ("user_id")
);

CREATE TABLE IF NOT EXISTS "perfiles" (
	"perfil_id" smallint NOT NULL,
	"nombre" varchar(50) NOT NULL,
	"descripcion" varchar(200) NOT NULL,
	PRIMARY KEY ("perfil_id")
);

CREATE TABLE IF NOT EXISTS "parametros" (
	"parametro_id" serial NOT NULL,
	"Servicio_SUNAT" varchar(80) NOT NULL,
	"Servicio_RENIEC" varchar(80) NOT NULL,
	PRIMARY KEY ("parametro_id")
);

CREATE TABLE IF NOT EXISTS "tabla_tablas" (
	"tabla_id" smallint NOT NULL,
	"nombre_tabla" varchar(50) NOT NULL,
	"columna_id" varchar(20) NOT NULL,
	"descripcion" varchar(200) NOT NULL,
	"valor" varchar(200) NOT NULL,
	PRIMARY KEY ("tabla_id")
);

CREATE TABLE IF NOT EXISTS "marco_normativo" (
	"norma_id" bigint NOT NULL,
	"tipo_norma_id" bigint NOT NULL,
	"numero" varchar(20) NOT NULL,
	"nombre_norma" varchar(100) NOT NULL,
	"nivel_gob_id" bigint NOT NULL,
	"sector_id" bigint NOT NULL,
	"fecha_pub" date NOT NULL,
	"descripcion" varchar(255) NOT NULL,
	"direccion_web" varchar(255) NOT NULL,
	PRIMARY KEY ("norma_id")
);

CREATE TABLE IF NOT EXISTS "compromisos" (
	"compromiso_id" bigint NOT NULL,
	"numero_compromiso" bigint NOT NULL,
	"activo" boolean NOT NULL,
	"nombre" varchar(200) NOT NULL,
	"descripcion" varchar(255) NOT NULL,
	"ini_periodo" date NOT NULL,
	"fin_periodo" date NOT NULL,
	PRIMARY KEY ("compromiso_id")
);

CREATE TABLE IF NOT EXISTS "alcance_compromisos" (
	"alc_com_id" bigint NOT NULL,
	"compromiso_id" bigint NOT NULL,
	"clasificacion_id" bigint NOT NULL,
	"activo" boolean NOT NULL,
	PRIMARY KEY ("alc_com_id")
);

CREATE TABLE IF NOT EXISTS "normas_compromisos" (
	"nor_com_id" bigint NOT NULL,
	"compromiso_id" bigint NOT NULL,
	"norma_id" bigint NOT NULL,
	"activo" boolean NOT NULL,
	PRIMARY KEY ("nor_com_id")
);

CREATE TABLE IF NOT EXISTS "clasificacion" (
	"clasificacion_id(36)" bigint NOT NULL,
	"nombre" varchar(100) NOT NULL,
	"activo" boolean NOT NULL,
	PRIMARY KEY ("clasificacion_id(36)")
);

CREATE TABLE IF NOT EXISTS "criterios_compromisos" (
	"cri_com_id" bigint NOT NULL,
	"compromiso_id" bigint NOT NULL,
	"nombre_criterio" varchar(200) NOT NULL,
	"activo" boolean NOT NULL,
	PRIMARY KEY ("cri_com_id")
);

CREATE TABLE IF NOT EXISTS "criterios_compromisos_entidades" (
	"cri_com_ent_id" bigint NOT NULL,
	"cri_com_id" bigint NOT NULL,
	"entidad_id" bigint NOT NULL,
	"cumple" boolean NOT NULL,
	PRIMARY KEY ("cri_com_ent_id")
);

CREATE TABLE IF NOT EXISTS "normas_compromisos_entidades" (
	"nor_com_ent_id" bigint NOT NULL,
	"nor_com_id" bigint NOT NULL,
	"entidad_id" bigint NOT NULL,
	"ruta_pdf" varchar(255) NOT NULL,
	"fec_resolucion" date NOT NULL,
	"nro_resolucion" varchar(50) NOT NULL,
	PRIMARY KEY ("nor_com_ent_id")
);

CREATE TABLE IF NOT EXISTS "objetivos_entidades" (
	"obj_ent_id" bigint NOT NULL,
	"com_entidad_id" bigint NOT NULL,
	"tipo_obj" varchar(1) NOT NULL,
	"numeracion_obj" varchar(5) NOT NULL,
	"descripcion_objetivo" varchar(240) NOT NULL,
	PRIMARY KEY ("obj_ent_id")
);

CREATE TABLE IF NOT EXISTS "acciones_objetivos_entidades" (
	"acc_obj_ent_id" bigint NOT NULL,
	"obj_ent_id" bigint NOT NULL,
	"numeracion_acc" varchar(5) NOT NULL,
	"descripcion_accion" varchar(240) NOT NULL,
	PRIMARY KEY ("acc_obj_ent_id")
);

CREATE TABLE IF NOT EXISTS "proyectos_entidades" (
	"proy_ent_id" bigint NOT NULL,
	"com_entidad_id" bigint NOT NULL,
	"numeracion_proy" varchar(5) NOT NULL,
	"nombre" varchar(100) NOT NULL,
	"alcance" varchar(240) NOT NULL,
	"justificacion" varchar(240) NOT NULL,
	"tipo_proy" varchar(100) NOT NULL,
	"area_proy" varchar(50) NOT NULL,
	"area_ejecuta" varchar(50) NOT NULL,
	"tipo_beneficiario" varchar(100) NOT NULL,
	"etapa_proyecto" varchar(100) NOT NULL,
	"ambito_proyecto" varchar(100) NOT NULL,
	"fec_ini_prog" date NOT NULL,
	"fec_fin_prog" date NOT NULL,
	"fec_ini_real" date NOT NULL,
	"fec_fin_real" date NOT NULL,
	"alienado_pgd" varchar(100) NOT NULL,
	"obj_tran_dig" varchar(100) NOT NULL,
	"obj_est" varchar(100) NOT NULL,
	"acc_est" varchar(100) NOT NULL,
	"estado_proyecto" boolean NOT NULL,
	PRIMARY KEY ("proy_ent_id")
);

CREATE TABLE IF NOT EXISTS "servicios_facilita_entidades" (
	"serv_fac_ent_id" bigint NOT NULL,
	"com_ent_id" bigint NOT NULL,
	"nombre_servicio" varchar(200) NOT NULL,
	"tipo_servicio" varchar(100) NOT NULL,
	"nivel_digitalizacion" varchar(50) NOT NULL,
	"fecha_registro" date NOT NULL,
	"enlace_servicio" varchar(200) NOT NULL,
	"descripcion_servicio" varchar(255) NOT NULL,
	"area_responsable" varchar(100) NOT NULL,
	"estado_operativo" boolean NOT NULL,
	"ruta_pdf_evidencia" varchar(255) NOT NULL,
	PRIMARY KEY ("serv_fac_ent_id")
);

CREATE TABLE IF NOT EXISTS "com1_liderg_td" (
	"comlgtd_ent_id" bigint NOT NULL,
	"compromiso_id" bigint NOT NULL,
	"entidad_id" bigint NOT NULL,
	"etapa_formulario" varchar(20) NOT NULL,
	"estado" varchar(15) NOT NULL,
	"check_privacidad" boolean NOT NULL,
	"check_ddjj" boolean NOT NULL,
	"estado_PCM" varchar(50) NOT NULL,
	"observaciones_PCM" varchar(500) NOT NULL,
	"created_at" timestamp without time zone NOT NULL,
	"fec_registro" date NOT NULL,
	"usuario_registra" bigint NOT NULL,
	"activo" boolean NOT NULL,
	"dni_lider" varchar(12) NOT NULL,
	"nombre_lider" varchar(60) NOT NULL,
	"ape_pat_lider" varchar(60) NOT NULL,
	"ape_mat_lider" varchar(60) NOT NULL,
	"email_lider" varchar(30) NOT NULL,
	"telefono_lider" varchar(30) NOT NULL,
	"rol_lider" varchar(20) NOT NULL,
	"cargo_lider" varchar(20) NOT NULL,
	"fec_ini_lider" date NOT NULL,
	PRIMARY KEY ("comlgtd_ent_id")
);

CREATE TABLE IF NOT EXISTS "com5_destrategiad" (
	"comded_ent_id" bigint NOT NULL,
	"compromiso_id" bigint NOT NULL,
	"entidad_id" bigint NOT NULL,
	"etapa_formulario" varchar(20) NOT NULL,
	"estado" varchar(15) NOT NULL,
	"check_privacidad" boolean NOT NULL,
	"check_ddjj" boolean NOT NULL,
	"estado_PCM" varchar(50) NOT NULL,
	"observaciones_PCM" varchar(500) NOT NULL,
	"created_at" timestamp without time zone NOT NULL,
	"fec_registro" date NOT NULL,
	"usuario_registra" bigint NOT NULL,
	"activo" boolean NOT NULL,
	"nombre_estrategia" varchar(150) NOT NULL,
	"periodo_inicio_estrategia" bigint NOT NULL,
	"periodo_fin_estrategia" bigint NOT NULL,
	"objetivos_estrategicos" varchar(255) NOT NULL,
	"lineas_accion" varchar(255) NOT NULL,
	"fecha_aprobacion_estrategia" date NOT NULL,
	"alineado_pgd_estrategia" boolean NOT NULL,
	"estado_implementacion_estrategia" varchar(50) NOT NULL,
	"ruta_pdf_estrategia" varchar(255) NOT NULL,
	PRIMARY KEY ("comded_ent_id")
);

CREATE TABLE IF NOT EXISTS "com6_mpgobpe" (
	"comded_ent_id" bigint NOT NULL,
	"compromiso_id" bigint NOT NULL,
	"entidad_id" bigint NOT NULL,
	"etapa_formulario" varchar(20) NOT NULL,
	"estado" varchar(15) NOT NULL,
	"check_privacidad" boolean NOT NULL,
	"check_ddjj" boolean NOT NULL,
	"estado_PCM" varchar(50) NOT NULL,
	"observaciones_PCM" varchar(500) NOT NULL,
	"created_at" timestamp without time zone NOT NULL,
	"fec_registro" date NOT NULL,
	"usuario_registra" bigint NOT NULL,
	"activo" boolean NOT NULL,
	"url_gobpe" varchar(150) NOT NULL,
	"fecha_migracion_gobpe" date NOT NULL,
	"fecha_actualizacion_gobpe" date NOT NULL,
	"responsable_gobpe" varchar(100) NOT NULL,
	"correo_responsable_gobpe" varchar(100) NOT NULL,
	"telefono_responsable_gobpe" varchar(30) NOT NULL,
	"tipo_migracion_gobpe" varchar(50) NOT NULL,
	"observacion_gobpe" varchar(255) NOT NULL,
	"ruta_pdf_gobpe" varchar(255) NOT NULL,
	PRIMARY KEY ("comded_ent_id")
);

CREATE TABLE IF NOT EXISTS "com7_impd" (
	"estado" varchar(15) NOT NULL,
	"comimpd_ent_id" bigint NOT NULL,
	"compromiso_id" bigint NOT NULL,
	"entidad_id" bigint NOT NULL,
	"etapa_formulario" varchar(20) NOT NULL,
	"check_privacidad" boolean NOT NULL,
	"check_ddjj" boolean NOT NULL,
	"estado_PCM" varchar(50) NOT NULL,
	"observaciones_PCM" varchar(500) NOT NULL,
	"created_at" timestamp without time zone NOT NULL,
	"fec_registro" date NOT NULL,
	"usuario_registra" bigint NOT NULL,
	"activo" boolean NOT NULL,
	"url_mpd" varchar(150) NOT NULL,
	"fecha_implementacion_mpd" date NOT NULL,
	"responsable_mpd" varchar(100) NOT NULL,
	"cargo_responsable_mpd" varchar(100) NOT NULL,
	"correo_responsable_mpd" varchar(100) NOT NULL,
	"telefono_responsable_mpd" varchar(30) NOT NULL,
	"tipo_mpd" varchar(50) NOT NULL,
	"interoperabilidad_mpd" boolean NOT NULL,
	"observacion_mpd" varchar(255) NOT NULL,
	"ruta_pdf_mpd" varchar(255) NOT NULL,
	PRIMARY KEY ("comimpd_ent_id")
);

CREATE TABLE IF NOT EXISTS "com8_ptupa" (
	"comptupa_ent_id" bigint NOT NULL,
	"compromiso_id" bigint NOT NULL,
	"entidad_id" bigint NOT NULL,
	"etapa_formulario" varchar(20) NOT NULL,
	"estado" varchar(15) NOT NULL,
	"check_privacidad" boolean NOT NULL,
	"check_ddjj" boolean NOT NULL,
	"estado_PCM" varchar(50) NOT NULL,
	"observaciones_PCM" varchar(500) NOT NULL,
	"created_at" timestamp without time zone NOT NULL,
	"fec_registro" date NOT NULL,
	"usuario_registra" bigint NOT NULL,
	"activo" boolean NOT NULL,
	"url_tupa" varchar(150) NOT NULL,
	"numero_resolucion_tupa" varchar(50) NOT NULL,
	"fecha_aprobacion_tupa" date NOT NULL,
	"responsable_tupa" varchar(100) NOT NULL,
	"cargo_responsable_tupa" varchar(100) NOT NULL,
	"correo_responsable_tupa" varchar(100) NOT NULL,
	"telefono_responsable_tupa" varchar(30) NOT NULL,
	"actualizado_tupa" boolean NOT NULL,
	"observacion_tupa" varchar(255) NOT NULL,
	"ruta_pdf_tupa" varchar(255) NOT NULL,
	PRIMARY KEY ("comptupa_ent_id")
);

CREATE TABLE IF NOT EXISTS "com9_imgd" (
	"comimgd_ent_id" bigint NOT NULL,
	"compromiso_id" bigint NOT NULL,
	"entidad_id" bigint NOT NULL,
	"etapa_formulario" varchar(20) NOT NULL,
	"estado" varchar(15) NOT NULL,
	"check_privacidad" boolean NOT NULL,
	"check_ddjj" boolean NOT NULL,
	"estado_PCM" varchar(50) NOT NULL,
	"observaciones_PCM" varchar(500) NOT NULL,
	"created_at" timestamp without time zone NOT NULL,
	"fec_registro" date NOT NULL,
	"usuario_registra" bigint NOT NULL,
	"activo" boolean NOT NULL,
	"fecha_aprobacion_mgd" date NOT NULL,
	"numero_resolucion_mgd" varchar(50) NOT NULL,
	"responsable_mgd" varchar(100) NOT NULL,
	"cargo_responsable_mgd" varchar(100) NOT NULL,
	"correo_responsable_mgd" varchar(100) NOT NULL,
	"telefono_responsable_mgd" varchar(30) NOT NULL,
	"sistema_gestion_doc" varchar(100) NOT NULL,
	"tipo_implantacion_mgd" varchar(50) NOT NULL,
	"interoperabilidad_mgd" boolean NOT NULL,
	"observacion_mgd" varchar(255) NOT NULL,
	"ruta_pdf_mgd" varchar(255) NOT NULL,
	PRIMARY KEY ("comimgd_ent_id")
);

CREATE TABLE IF NOT EXISTS "com10_pnda" (
	"compnda_ent_id" bigint NOT NULL,
	"compromiso_id" bigint NOT NULL,
	"entidad_id" bigint NOT NULL,
	"etapa_formulario" varchar(20) NOT NULL,
	"estado" varchar(15) NOT NULL,
	"check_privacidad" boolean NOT NULL,
	"check_ddjj" boolean NOT NULL,
	"estado_PCM" varchar(50) NOT NULL,
	"observaciones_PCM" varchar(500) NOT NULL,
	"created_at" timestamp without time zone NOT NULL,
	"fec_registro" date NOT NULL,
	"usuario_registra" bigint NOT NULL,
	"activo" boolean NOT NULL,
	"url_pnda" varchar(200) NOT NULL,
	"total_datasets_publicados" bigint NOT NULL,
	"fecha_ultima_actualizacion_pnda" date NOT NULL,
	"responsable_pnda" varchar(100) NOT NULL,
	"cargo_responsable_pnda" varchar(100) NOT NULL,
	"correo_responsable_pnda" varchar(100) NOT NULL,
	"telefono_responsable_pnda" varchar(30) NOT NULL,
	"norma_aprobacion_pnda" varchar(100) NOT NULL,
	"fecha_aprobacion_pnda" date NOT NULL,
	"observacion_pnda" varchar(255) NOT NULL,
	"ruta_pdf_pnda" varchar(255) NOT NULL,
	PRIMARY KEY ("compnda_ent_id")
);

CREATE TABLE IF NOT EXISTS "com11_ageop" (
	"comageop_ent_id" bigint NOT NULL,
	"compromiso_id" bigint NOT NULL,
	"entidad_id" bigint NOT NULL,
	"etapa_formulario" varchar(20) NOT NULL,
	"estado" varchar(15) NOT NULL,
	"check_privacidad" boolean NOT NULL,
	"check_ddjj" boolean NOT NULL,
	"estado_PCM" varchar(50) NOT NULL,
	"observaciones_PCM" varchar(500) NOT NULL,
	"created_at" timestamp without time zone NOT NULL,
	"fec_registro" date NOT NULL,
	"usuario_registra" bigint NOT NULL,
	"activo" boolean NOT NULL,
	"url_geo" varchar(200) NOT NULL,
	"tipo_informacion_geo" varchar(100) NOT NULL,
	"total_capas_publicadas" bigint NOT NULL,
	"fecha_ultima_actualizacion_geo" date NOT NULL,
	"responsable_geo" varchar(100) NOT NULL,
	"cargo_responsable_geo" varchar(100) NOT NULL,
	"correo_responsable_geo" varchar(100) NOT NULL,
	"telefono_responsable_geo" varchar(30) NOT NULL,
	"norma_aprobacion_geo" varchar(100) NOT NULL,
	"fecha_aprobacion_geo" date NOT NULL,
	"interoperabilidad_geo" boolean NOT NULL,
	"observacion_geo" varchar(255) NOT NULL,
	"ruta_pdf_geo" varchar(255) NOT NULL,
	PRIMARY KEY ("comageop_ent_id")
);

CREATE TABLE IF NOT EXISTS "com12_drsp" (
	"comdrsp_ent_id" bigint NOT NULL,
	"compromiso_id" bigint NOT NULL,
	"entidad_id" bigint NOT NULL,
	"etapa_formulario" varchar(20) NOT NULL,
	"estado" varchar(15) NOT NULL,
	"check_privacidad" boolean NOT NULL,
	"check_ddjj" boolean NOT NULL,
	"estado_PCM" varchar(50) NOT NULL,
	"observaciones_PCM" varchar(500) NOT NULL,
	"created_at" timestamp without time zone NOT NULL,
	"fec_registro" date NOT NULL,
	"usuario_registra" bigint NOT NULL,
	"activo" boolean NOT NULL,
	"dni_rsp" varchar(12) NOT NULL,
	"nombre_rsp" varchar(100) NOT NULL,
	"ape_pat_rsp" varchar(60) NOT NULL,
	"ape_mat_rsp" varchar(60) NOT NULL,
	"cargo_rsp" varchar(100) NOT NULL,
	"correo_rsp" varchar(100) NOT NULL,
	"telefono_rsp" varchar(30) NOT NULL,
	"fecha_designacion_rsp" date NOT NULL,
	"numero_resolucion_rsp" varchar(50) NOT NULL,
	"ruta_pdf_rsp" varchar(255) NOT NULL,
	"observacion_rsp" varchar(255) NOT NULL,
	PRIMARY KEY ("comdrsp_ent_id")
);

CREATE TABLE IF NOT EXISTS "com13_pcpide" (
	"compcpide_ent_id" bigint NOT NULL,
	"compromiso_id" bigint NOT NULL,
	"entidad_id" bigint NOT NULL,
	"etapa_formulario" varchar(20) NOT NULL,
	"estado" varchar(15) NOT NULL,
	"check_privacidad" boolean NOT NULL,
	"check_ddjj" boolean NOT NULL,
	"estado_PCM" varchar(50) NOT NULL,
	"observaciones_PCM" varchar(500) NOT NULL,
	"created_at" timestamp without time zone NOT NULL,
	"fec_registro" date NOT NULL,
	"usuario_registra" bigint NOT NULL,
	"activo" boolean NOT NULL,
	"tipo_integracion_pide" varchar(30) NOT NULL,
	"nombre_servicio_pide" varchar(150) NOT NULL,
	"descripcion_servicio_pide" varchar(255) NOT NULL,
	"fecha_inicio_operacion_pide" date NOT NULL,
	"responsable_pide" varchar(100) NOT NULL,
	"cargo_responsable_pide" varchar(100) NOT NULL,
	"correo_responsable_pide" varchar(100) NOT NULL,
	"telefono_responsable_pide" varchar(30) NOT NULL,
	"numero_convenio_pide" varchar(50) NOT NULL,
	"fecha_convenio_pide" date NOT NULL,
	"interoperabilidad_pide" boolean NOT NULL,
	"url_servicio_pide" varchar(200) NOT NULL,
	"observacion_pide" varchar(255) NOT NULL,
	"ruta_pdf_pide" varchar(255) NOT NULL,
	PRIMARY KEY ("compcpide_ent_id")
);

CREATE TABLE IF NOT EXISTS "com14_doscd" (
	"comdoscd_ent_id" bigint NOT NULL,
	"compromiso_id" bigint NOT NULL,
	"entidad_id" bigint NOT NULL,
	"etapa_formulario" varchar(20) NOT NULL,
	"estado" varchar(15) NOT NULL,
	"check_privacidad" boolean NOT NULL,
	"check_ddjj" boolean NOT NULL,
	"estado_PCM" varchar(50) NOT NULL,
	"observaciones_PCM" varchar(500) NOT NULL,
	"created_at" timestamp without time zone NOT NULL,
	"fec_registro" date NOT NULL,
	"usuario_registra" bigint NOT NULL,
	"activo" boolean NOT NULL,
	"dni_oscd" varchar(12) NOT NULL,
	"nombre_oscd" varchar(100) NOT NULL,
	"ape_pat_oscd" varchar(60) NOT NULL,
	"ape_mat_oscd" varchar(60) NOT NULL,
	"cargo_oscd" varchar(100) NOT NULL,
	"correo_oscd" varchar(100) NOT NULL,
	"telefono_oscd" varchar(30) NOT NULL,
	"fecha_designacion_oscd" date NOT NULL,
	"numero_resolucion_oscd" varchar(50) NOT NULL,
	"comunicado_pcm_oscd" boolean NOT NULL,
	"ruta_pdf_oscd" varchar(255) NOT NULL,
	"observacion_oscd" varchar(255) NOT NULL,
	PRIMARY KEY ("comdoscd_ent_id")
);

CREATE TABLE IF NOT EXISTS "com15_csirt" (
	"comcsirt_ent_id" bigint NOT NULL,
	"compromiso_id" bigint NOT NULL,
	"entidad_id" bigint NOT NULL,
	"etapa_formulario" varchar(20) NOT NULL,
	"estado" varchar(15) NOT NULL,
	"check_privacidad" boolean NOT NULL,
	"check_ddjj" boolean NOT NULL,
	"estado_PCM" varchar(50) NOT NULL,
	"observaciones_PCM" varchar(500) NOT NULL,
	"created_at" timestamp without time zone NOT NULL,
	"fec_registro" date NOT NULL,
	"usuario_registra" bigint NOT NULL,
	"activo" boolean NOT NULL,
	"nombre_csirt" varchar(150) NOT NULL,
	"fecha_conformacion_csirt" date NOT NULL,
	"numero_resolucion_csirt" varchar(50) NOT NULL,
	"responsable_csirt" varchar(100) NOT NULL,
	"cargo_responsable_csirt" varchar(100) NOT NULL,
	"correo_csirt" varchar(100) NOT NULL,
	"telefono_csirt" varchar(30) NOT NULL,
	"protocolo_incidentes_csirt" boolean NOT NULL,
	"comunicado_pcm_csirt" boolean NOT NULL,
	"ruta_pdf_csirt" varchar(255) NOT NULL,
	"observacion_csirt" varchar(255) NOT NULL,
	PRIMARY KEY ("comcsirt_ent_id")
);

CREATE TABLE IF NOT EXISTS "com16_sgsi" (
	"comsgsi_ent_id" bigint NOT NULL,
	"compromiso_id" bigint NOT NULL,
	"entidad_id" bigint NOT NULL,
	"etapa_formulario" varchar(20) NOT NULL,
	"estado" varchar(15) NOT NULL,
	"check_privacidad" boolean NOT NULL,
	"check_ddjj" boolean NOT NULL,
	"estado_PCM" varchar(50) NOT NULL,
	"observaciones_PCM" varchar(500) NOT NULL,
	"created_at" timestamp without time zone NOT NULL,
	"fec_registro" date NOT NULL,
	"usuario_registra" bigint NOT NULL,
	"activo" boolean NOT NULL,
	"responsable_sgsi" varchar(100) NOT NULL,
	"cargo_responsable_sgsi" varchar(100) NOT NULL,
	"correo_sgsi" varchar(100) NOT NULL,
	"telefono_sgsi" varchar(30) NOT NULL,
	"estado_implementacion_sgsi" varchar(50) NOT NULL,
	"alcance_sgsi" varchar(255) NOT NULL,
	"fecha_inicio_sgsi" date NOT NULL,
	"fecha_certificacion_sgsi" date NOT NULL,
	"entidad_certificadora_sgsi" varchar(150) NOT NULL,
	"version_norma_sgsi" varchar(20) NOT NULL,
	"ruta_pdf_certificado_sgsi" varchar(255) NOT NULL,
	"ruta_pdf_politicas_sgsi" varchar(255) NOT NULL,
	"observacion_sgsi" varchar(255) NOT NULL,
	PRIMARY KEY ("comsgsi_ent_id")
);

CREATE TABLE IF NOT EXISTS "com17_ptipv6" (
	"comptipv6_ent_id" bigint NOT NULL,
	"compromiso_id" bigint NOT NULL,
	"entidad_id" bigint NOT NULL,
	"etapa_formulario" varchar(20) NOT NULL,
	"estado" varchar(15) NOT NULL,
	"check_privacidad" boolean NOT NULL,
	"check_ddjj" boolean NOT NULL,
	"estado_PCM" varchar(50) NOT NULL,
	"observaciones_PCM" varchar(500) NOT NULL,
	"created_at" timestamp without time zone NOT NULL,
	"fec_registro" date NOT NULL,
	"usuario_registra" bigint NOT NULL,
	"activo" boolean NOT NULL,
	"responsable_ipv6" varchar(100) NOT NULL,
	"cargo_responsable_ipv6" varchar(100) NOT NULL,
	"correo_ipv6" varchar(100) NOT NULL,
	"telefono_ipv6" varchar(30) NOT NULL,
	"estado_plan_ipv6" varchar(50) NOT NULL,
	"fecha_formulacion_ipv6" date NOT NULL,
	"fecha_aprobacion_ipv6" date NOT NULL,
	"fecha_inicio_ipv6" date NOT NULL,
	"fecha_fin_ipv6" date NOT NULL,
	"descripcion_plan_ipv6" varchar(255) NOT NULL,
	"ruta_pdf_plan_ipv6" varchar(255) NOT NULL,
	"observacion_ipv6" varchar(255) NOT NULL,
	PRIMARY KEY ("comptipv6_ent_id")
);

CREATE TABLE IF NOT EXISTS "com18_sapte" (
	"comsapte_ent_id" bigint NOT NULL,
	"compromiso_id" bigint NOT NULL,
	"entidad_id" bigint NOT NULL,
	"etapa_formulario" varchar(20) NOT NULL,
	"estado" varchar(15) NOT NULL,
	"check_privacidad" boolean NOT NULL,
	"check_ddjj" boolean NOT NULL,
	"estado_PCM" varchar(50) NOT NULL,
	"observaciones_PCM" varchar(500) NOT NULL,
	"created_at" timestamp without time zone NOT NULL,
	"fec_registro" date NOT NULL,
	"usuario_registra" bigint NOT NULL,
	"activo" boolean NOT NULL,
	"responsable_pte" varchar(100) NOT NULL,
	"cargo_responsable_pte" varchar(100) NOT NULL,
	"correo_pte" varchar(100) NOT NULL,
	"telefono_pte" varchar(30) NOT NULL,
	"fecha_solicitud_pte" date NOT NULL,
	"fecha_acceso_pte" date NOT NULL,
	"numero_oficio_pte" varchar(50) NOT NULL,
	"estado_acceso_pte" varchar(50) NOT NULL,
	"enlace_portal_pte" varchar(200) NOT NULL,
	"descripcion_pte" varchar(255) NOT NULL,
	"ruta_pdf_pte" varchar(255) NOT NULL,
	"observacion_pte" varchar(255) NOT NULL,
	PRIMARY KEY ("comsapte_ent_id")
);

CREATE TABLE IF NOT EXISTS "com19_renad" (
	"comrenad_ent_id" bigint NOT NULL,
	"compromiso_id" bigint NOT NULL,
	"entidad_id" bigint NOT NULL,
	"etapa_formulario" varchar(20) NOT NULL,
	"estado" varchar(15) NOT NULL,
	"check_privacidad" boolean NOT NULL,
	"check_ddjj" boolean NOT NULL,
	"estado_PCM" varchar(50) NOT NULL,
	"observaciones_PCM" varchar(500) NOT NULL,
	"created_at" timestamp without time zone NOT NULL,
	"fec_registro" date NOT NULL,
	"usuario_registra" bigint NOT NULL,
	"activo" boolean NOT NULL,
	"anio_enad" bigint NOT NULL,
	"responsable_enad" varchar(100) NOT NULL,
	"cargo_responsable_enad" varchar(100) NOT NULL,
	"correo_enad" varchar(100) NOT NULL,
	"telefono_enad" varchar(30) NOT NULL,
	"fecha_envio_enad" date NOT NULL,
	"estado_respuesta_enad" varchar(50) NOT NULL,
	"enlace_formulario_enad" varchar(200) NOT NULL,
	"observacion_enad" varchar(255) NOT NULL,
	"ruta_pdf_enad" varchar(255) NOT NULL,
	PRIMARY KEY ("comrenad_ent_id")
);

CREATE TABLE IF NOT EXISTS "com20_dsfpe" (
	"comdsfpe_ent_id" bigint NOT NULL,
	"compromiso_id" bigint NOT NULL,
	"entidad_id" bigint NOT NULL,
	"etapa_formulario" varchar(20) NOT NULL,
	"estado" varchar(15) NOT NULL,
	"check_privacidad" boolean NOT NULL,
	"check_ddjj" boolean NOT NULL,
	"estado_PCM" varchar(50) NOT NULL,
	"observaciones_PCM" varchar(500) NOT NULL,
	"created_at" timestamp without time zone NOT NULL,
	"fec_registro" date NOT NULL,
	"usuario_registra" bigint NOT NULL,
	"activo" boolean NOT NULL,
	"responsable_facilita" varchar(100) NOT NULL,
	"cargo_responsable_facilita" varchar(100) NOT NULL,
	"correo_facilita" varchar(100) NOT NULL,
	"telefono_facilita" varchar(30) NOT NULL,
	"estado_implementacion_facilita" varchar(50) NOT NULL,
	"fecha_inicio_facilita" date NOT NULL,
	"fecha_ultimo_avance_facilita" date NOT NULL,
	"total_servicios_digitalizados" bigint NOT NULL,
	"ruta_pdf_facilita" varchar(255) NOT NULL,
	"observacion_facilita" varchar(255) NOT NULL,
	PRIMARY KEY ("comdsfpe_ent_id")
);

CREATE TABLE IF NOT EXISTS "com21_dogd" (
	"comdogd_ent_id" bigint NOT NULL,
	"compromiso_id" bigint NOT NULL,
	"entidad_id" bigint NOT NULL,
	"etapa_formulario" varchar(20) NOT NULL,
	"estado" varchar(15) NOT NULL,
	"check_privacidad" boolean NOT NULL,
	"check_ddjj" boolean NOT NULL,
	"estado_PCM" varchar(50) NOT NULL,
	"observaciones_PCM" varchar(500) NOT NULL,
	"created_at" timestamp without time zone NOT NULL,
	"fec_registro" date NOT NULL,
	"usuario_registra" bigint NOT NULL,
	"activo" boolean NOT NULL,
	"dni_ogd" varchar(12) NOT NULL,
	"nombre_ogd" varchar(100) NOT NULL,
	"ape_pat_ogd" varchar(60) NOT NULL,
	"ape_mat_ogd" varchar(60) NOT NULL,
	"cargo_ogd" varchar(100) NOT NULL,
	"correo_ogd" varchar(100) NOT NULL,
	"telefono_ogd" varchar(30) NOT NULL,
	"fecha_designacion_ogd" date NOT NULL,
	"numero_resolucion_ogd" varchar(50) NOT NULL,
	"comunicado_pcm_ogd" boolean NOT NULL,
	"ruta_pdf_ogd" varchar(255) NOT NULL,
	"observacion_ogd" varchar(255) NOT NULL,
	PRIMARY KEY ("comdogd_ent_id")
);

CREATE TABLE IF NOT EXISTS "com3_epgd" (
	"comepgd_ent_id" bigint NOT NULL,
	"compromiso_id" bigint NOT NULL,
	"entidad_id" bigint NOT NULL,
	"etapa_formulario" varchar(20) NOT NULL,
	"estado" varchar(15) NOT NULL,
	"check_privacidad" boolean NOT NULL,
	"check_ddjj" boolean NOT NULL,
	"estado_PCM" varchar(50) NOT NULL,
	"observaciones_PCM" varchar(500) NOT NULL,
	"created_at" timestamp without time zone NOT NULL,
	"fec_registro" date NOT NULL,
	"usuario_registra" bigint NOT NULL,
	"activo" boolean NOT NULL,
	"fecha_reporte" date NOT NULL,
	"sede" varchar(100) NOT NULL,
	"observaciones" varchar(255) NOT NULL,
	"ubicacion_area_ti" varchar(255) NOT NULL,
	"organigrama_ti" varchar(255) NOT NULL,
	"dependencia_area_ti" varchar(100) NOT NULL,
	"costo_anual_ti" numeric(12,2) NOT NULL,
	"existe_comision_gd_ti" boolean NOT NULL,
	PRIMARY KEY ("comepgd_ent_id")
);

CREATE TABLE IF NOT EXISTS "personal_ti" (
	"personal_id" bigint NOT NULL,
	"com_entidad_id" bigint NOT NULL,
	"nombre_persona" varchar(100) NOT NULL,
	"dni" varchar(12) NOT NULL,
	"cargo" varchar(100) NOT NULL,
	"rol" varchar(50) NOT NULL,
	"especialidad" varchar(80) NOT NULL,
	"grado_instruccion" varchar(50) NOT NULL,
	"certificacion" varchar(80) NOT NULL,
	"acreditadora" varchar(80) NOT NULL,
	"codigo_certificacion" varchar(50) NOT NULL,
	"colegiatura" varchar(20) NOT NULL,
	"email_personal" varchar(100) NOT NULL,
	"telefono" varchar(30) NOT NULL,
	PRIMARY KEY ("personal_id")
);

CREATE TABLE IF NOT EXISTS "inventario_software" (
	"inv_soft_id" bigint NOT NULL,
	"com_entidad_id" bigint NOT NULL,
	"cod_producto" varchar(50) NOT NULL,
	"nombre_producto" varchar(150) NOT NULL,
	"version" varchar(50) NOT NULL,
	"cantidad_instalaciones" bigint NOT NULL,
	"tipo_software" varchar(50) NOT NULL,
	"cantidad_licencias" bigint NOT NULL,
	"exceso_deficiencia" bigint NOT NULL,
	"costo_licencias" numeric(12,2) NOT NULL,
	PRIMARY KEY ("inv_soft_id")
);

CREATE TABLE IF NOT EXISTS "inventario_sistemas_info" (
	"inv_si_id" bigint NOT NULL,
	"com_entidad_id" bigint NOT NULL,
	"codigo" varchar(20) NOT NULL,
	"nombre_sistema" varchar(150) NOT NULL,
	"descripcion" varchar(255) NOT NULL,
	"tipo_sistema" varchar(50) NOT NULL,
	"lenguaje_programacion" varchar(50) NOT NULL,
	"base_datos" varchar(50) NOT NULL,
	"plataforma" varchar(10) NOT NULL,
	PRIMARY KEY ("inv_si_id")
);

CREATE TABLE IF NOT EXISTS "inventario_red" (
	"inv_red_id" bigint NOT NULL,
	"com_entidad_id" bigint NOT NULL,
	"tipo_equipo" varchar(80) NOT NULL,
	"cantidad" bigint NOT NULL,
	"puertos_operativos" bigint NOT NULL,
	"puertos_inoperativos" bigint NOT NULL,
	"total_puertos" bigint NOT NULL,
	"costo_mantenimiento_anual" numeric(12,2) NOT NULL,
	"observaciones" varchar(255) NOT NULL,
	PRIMARY KEY ("inv_red_id")
);

CREATE TABLE IF NOT EXISTS "inventario_servidores" (
	"inv_srv_id" bigint NOT NULL,
	"com_entidad_id" bigint NOT NULL,
	"nombre_equipo" varchar(100) NOT NULL,
	"tipo_equipo" varchar(10) NOT NULL,
	"estado" varchar(30) NOT NULL,
	"capa" varchar(30) NOT NULL,
	"propiedad" varchar(20) NOT NULL,
	"montaje" varchar(20) NOT NULL,
	"marca_cpu" varchar(50) NOT NULL,
	"modelo_cpu" varchar(50) NOT NULL,
	"velocidad_ghz" numeric(5,2) NOT NULL,
	"nucleos" bigint NOT NULL,
	"memoria_gb" bigint NOT NULL,
	"marca_memoria" varchar(50) NOT NULL,
	"modelo_memoria" varchar(50) NOT NULL,
	"cantidad_memoria" bigint NOT NULL,
	"costo_mantenimiento_anual" numeric(12,2) NOT NULL,
	"observaciones" varchar(255) NOT NULL,
	PRIMARY KEY ("inv_srv_id")
);

CREATE TABLE IF NOT EXISTS "seguridad_info" (
	"seginfo_id" bigint NOT NULL,
	"com_entidad_id" bigint NOT NULL,
	"plan_sgsi" boolean NOT NULL,
	"comite_seguridad" boolean NOT NULL,
	"oficial_seguridad_en_organigrama" boolean NOT NULL,
	"politica_seguridad" boolean NOT NULL,
	"inventario_activos" boolean NOT NULL,
	"analisis_riesgos" boolean NOT NULL,
	"metodologia_riesgos" boolean NOT NULL,
	"plan_continuidad" boolean NOT NULL,
	"programa_auditorias" boolean NOT NULL,
	"informes_direccion" boolean NOT NULL,
	"certificacion_iso27001" boolean NOT NULL,
	"observaciones" varchar(255) NOT NULL,
	PRIMARY KEY ("seginfo_id")
);

CREATE TABLE IF NOT EXISTS "capacitaciones_seginfo" (
	"capseg_id" bigint NOT NULL,
	"com_entidad_id" bigint NOT NULL,
	"curso" varchar(100) NOT NULL,
	"cantidad_personas" bigint NOT NULL,
	PRIMARY KEY ("capseg_id")
);

CREATE TABLE IF NOT EXISTS "com4_tdpei" (
	"comtdpei_ent_id" bigint NOT NULL,
	"compromiso_id" bigint NOT NULL,
	"entidad_id" bigint NOT NULL,
	"etapa_formulario" varchar(20) NOT NULL,
	"estado" varchar(15) NOT NULL,
	"check_privacidad" boolean NOT NULL,
	"check_ddjj" boolean NOT NULL,
	"estado_PCM" varchar(50) NOT NULL,
	"observaciones_PCM" varchar(500) NOT NULL,
	"created_at" timestamp without time zone NOT NULL,
	"fec_registro" date NOT NULL,
	"usuario_registra" bigint NOT NULL,
	"activo" boolean NOT NULL,
	"anio_inicio_pei" bigint NOT NULL,
	"anio_fin_pei" bigint NOT NULL,
	"objetivo_pei" varchar(255) NOT NULL,
	"descripcion_pei" varchar(255) NOT NULL,
	"alineado_pgd" boolean NOT NULL,
	"fecha_aprobacion_pei" date NOT NULL,
	"ruta_pdf_pei" varchar(255) NOT NULL,
	PRIMARY KEY ("comtdpei_ent_id")
);

CREATE TABLE IF NOT EXISTS "com2_cgtd" (
	"comcgtd_ent_id" bigint NOT NULL,
	"compromiso_id" bigint NOT NULL,
	"entidad_id" bigint NOT NULL,
	"etapa_formulario" varchar(20) NOT NULL,
	"estado" varchar(15) NOT NULL,
	"check_privacidad" boolean NOT NULL,
	"check_ddjj" boolean NOT NULL,
	"estado_PCM" varchar(50) NOT NULL,
	"observaciones_PCM" varchar(500) NOT NULL,
	"created_at" timestamp without time zone NOT NULL,
	"fec_registro" date NOT NULL,
	"usuario_registra" bigint NOT NULL,
	"activo" boolean NOT NULL,
	PRIMARY KEY ("comcgtd_ent_id")
);

CREATE TABLE IF NOT EXISTS "comite_miembros" (
	"comite_miembros_id" bigint NOT NULL,
	"com_entidad_id" bigint NOT NULL,
	"num_miembro" bigint NOT NULL,
	"dni_miembro" varchar(12) NOT NULL,
	"nombre_miembro" varchar(60) NOT NULL,
	"ape_pat_miembro" varchar(60) NOT NULL,
	"ape_mat_miembro" varchar(60) NOT NULL,
	"email_miembro" varchar(60) NOT NULL,
	"telef_miembro" varchar(20) NOT NULL,
	"cargo_miembro" varchar(80) NOT NULL,
	"rol_en_comite" varchar(40) NOT NULL,
	"fecha_designacion" date NOT NULL,
	"activo" boolean NOT NULL,
	PRIMARY KEY ("comite_miembros_id")
);

CREATE TABLE IF NOT EXISTS "log_auditoria" (
	"log_id" integer NOT NULL,
	"entidad_id" bigint NOT NULL,
	"compromiso_id" bigint NOT NULL,
	"usuario_id" bigint NOT NULL,
	"accion" varchar(50) NOT NULL,
	"fecha" timestamp without time zone NOT NULL,
	"detalle" varchar(255) NOT NULL,
	PRIMARY KEY ("log_id")
);



ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_fk8" FOREIGN KEY ("entidad_id") REFERENCES "entidades"("entidad_id");

ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_fk10" FOREIGN KEY ("perfil_id") REFERENCES "perfiles"("perfil_id");





ALTER TABLE "alcance_compromisos" ADD CONSTRAINT "alcance_compromisos_fk1" FOREIGN KEY ("compromiso_id") REFERENCES "compromisos"("compromiso_id");

ALTER TABLE "alcance_compromisos" ADD CONSTRAINT "alcance_compromisos_fk2" FOREIGN KEY ("clasificacion_id") REFERENCES "clasificacion"("clasificacion_id(36)");
ALTER TABLE "normas_compromisos" ADD CONSTRAINT "normas_compromisos_fk1" FOREIGN KEY ("compromiso_id") REFERENCES "compromisos"("compromiso_id");

ALTER TABLE "normas_compromisos" ADD CONSTRAINT "normas_compromisos_fk2" FOREIGN KEY ("norma_id") REFERENCES "marco_normativo"("norma_id");

ALTER TABLE "criterios_compromisos" ADD CONSTRAINT "criterios_compromisos_fk1" FOREIGN KEY ("compromiso_id") REFERENCES "compromisos"("compromiso_id");
ALTER TABLE "criterios_compromisos_entidades" ADD CONSTRAINT "criterios_compromisos_entidades_fk1" FOREIGN KEY ("cri_com_id") REFERENCES "criterios_compromisos"("cri_com_id");

ALTER TABLE "criterios_compromisos_entidades" ADD CONSTRAINT "criterios_compromisos_entidades_fk2" FOREIGN KEY ("entidad_id") REFERENCES "entidades"("entidad_id");
ALTER TABLE "normas_compromisos_entidades" ADD CONSTRAINT "normas_compromisos_entidades_fk1" FOREIGN KEY ("nor_com_id") REFERENCES "normas_compromisos"("nor_com_id");

ALTER TABLE "normas_compromisos_entidades" ADD CONSTRAINT "normas_compromisos_entidades_fk2" FOREIGN KEY ("entidad_id") REFERENCES "entidades"("entidad_id");
ALTER TABLE "objetivos_entidades" ADD CONSTRAINT "objetivos_entidades_fk1" FOREIGN KEY ("com_entidad_id") REFERENCES "com3_epgd"("comepgd_ent_id");
ALTER TABLE "acciones_objetivos_entidades" ADD CONSTRAINT "acciones_objetivos_entidades_fk1" FOREIGN KEY ("obj_ent_id") REFERENCES "objetivos_entidades"("obj_ent_id");
ALTER TABLE "proyectos_entidades" ADD CONSTRAINT "proyectos_entidades_fk1" FOREIGN KEY ("com_entidad_id") REFERENCES "com3_epgd"("comepgd_ent_id");
ALTER TABLE "servicios_facilita_entidades" ADD CONSTRAINT "servicios_facilita_entidades_fk1" FOREIGN KEY ("com_ent_id") REFERENCES "com20_dsfpe"("comdsfpe_ent_id");
ALTER TABLE "com1_liderg_td" ADD CONSTRAINT "com1_liderg_td_fk1" FOREIGN KEY ("compromiso_id") REFERENCES "compromisos"("compromiso_id");

ALTER TABLE "com1_liderg_td" ADD CONSTRAINT "com1_liderg_td_fk2" FOREIGN KEY ("entidad_id") REFERENCES "entidades"("entidad_id");
ALTER TABLE "com5_destrategiad" ADD CONSTRAINT "com5_destrategiad_fk1" FOREIGN KEY ("compromiso_id") REFERENCES "compromisos"("compromiso_id");

ALTER TABLE "com5_destrategiad" ADD CONSTRAINT "com5_destrategiad_fk2" FOREIGN KEY ("entidad_id") REFERENCES "entidades"("entidad_id");
ALTER TABLE "com6_mpgobpe" ADD CONSTRAINT "com6_mpgobpe_fk1" FOREIGN KEY ("compromiso_id") REFERENCES "compromisos"("compromiso_id");

ALTER TABLE "com6_mpgobpe" ADD CONSTRAINT "com6_mpgobpe_fk2" FOREIGN KEY ("entidad_id") REFERENCES "entidades"("entidad_id");
ALTER TABLE "com7_impd" ADD CONSTRAINT "com7_impd_fk2" FOREIGN KEY ("compromiso_id") REFERENCES "compromisos"("compromiso_id");

ALTER TABLE "com7_impd" ADD CONSTRAINT "com7_impd_fk3" FOREIGN KEY ("entidad_id") REFERENCES "entidades"("entidad_id");
ALTER TABLE "com8_ptupa" ADD CONSTRAINT "com8_ptupa_fk1" FOREIGN KEY ("compromiso_id") REFERENCES "compromisos"("compromiso_id");

ALTER TABLE "com8_ptupa" ADD CONSTRAINT "com8_ptupa_fk2" FOREIGN KEY ("entidad_id") REFERENCES "entidades"("entidad_id");
ALTER TABLE "com9_imgd" ADD CONSTRAINT "com9_imgd_fk1" FOREIGN KEY ("compromiso_id") REFERENCES "compromisos"("compromiso_id");

ALTER TABLE "com9_imgd" ADD CONSTRAINT "com9_imgd_fk2" FOREIGN KEY ("entidad_id") REFERENCES "entidades"("entidad_id");
ALTER TABLE "com10_pnda" ADD CONSTRAINT "com10_pnda_fk1" FOREIGN KEY ("compromiso_id") REFERENCES "compromisos"("compromiso_id");

ALTER TABLE "com10_pnda" ADD CONSTRAINT "com10_pnda_fk2" FOREIGN KEY ("entidad_id") REFERENCES "entidades"("entidad_id");
ALTER TABLE "com11_ageop" ADD CONSTRAINT "com11_ageop_fk1" FOREIGN KEY ("compromiso_id") REFERENCES "compromisos"("compromiso_id");

ALTER TABLE "com11_ageop" ADD CONSTRAINT "com11_ageop_fk2" FOREIGN KEY ("entidad_id") REFERENCES "entidades"("entidad_id");
ALTER TABLE "com12_drsp" ADD CONSTRAINT "com12_drsp_fk1" FOREIGN KEY ("compromiso_id") REFERENCES "compromisos"("compromiso_id");

ALTER TABLE "com12_drsp" ADD CONSTRAINT "com12_drsp_fk2" FOREIGN KEY ("entidad_id") REFERENCES "entidades"("entidad_id");
ALTER TABLE "com13_pcpide" ADD CONSTRAINT "com13_pcpide_fk1" FOREIGN KEY ("compromiso_id") REFERENCES "compromisos"("compromiso_id");

ALTER TABLE "com13_pcpide" ADD CONSTRAINT "com13_pcpide_fk2" FOREIGN KEY ("entidad_id") REFERENCES "entidades"("entidad_id");
ALTER TABLE "com14_doscd" ADD CONSTRAINT "com14_doscd_fk1" FOREIGN KEY ("compromiso_id") REFERENCES "compromisos"("compromiso_id");

ALTER TABLE "com14_doscd" ADD CONSTRAINT "com14_doscd_fk2" FOREIGN KEY ("entidad_id") REFERENCES "entidades"("entidad_id");
ALTER TABLE "com15_csirt" ADD CONSTRAINT "com15_csirt_fk1" FOREIGN KEY ("compromiso_id") REFERENCES "compromisos"("compromiso_id");

ALTER TABLE "com15_csirt" ADD CONSTRAINT "com15_csirt_fk2" FOREIGN KEY ("entidad_id") REFERENCES "entidades"("entidad_id");
ALTER TABLE "com16_sgsi" ADD CONSTRAINT "com16_sgsi_fk1" FOREIGN KEY ("compromiso_id") REFERENCES "compromisos"("compromiso_id");

ALTER TABLE "com16_sgsi" ADD CONSTRAINT "com16_sgsi_fk2" FOREIGN KEY ("entidad_id") REFERENCES "entidades"("entidad_id");
ALTER TABLE "com17_ptipv6" ADD CONSTRAINT "com17_ptipv6_fk1" FOREIGN KEY ("compromiso_id") REFERENCES "compromisos"("compromiso_id");

ALTER TABLE "com17_ptipv6" ADD CONSTRAINT "com17_ptipv6_fk2" FOREIGN KEY ("entidad_id") REFERENCES "entidades"("entidad_id");
ALTER TABLE "com18_sapte" ADD CONSTRAINT "com18_sapte_fk1" FOREIGN KEY ("compromiso_id") REFERENCES "compromisos"("compromiso_id");

ALTER TABLE "com18_sapte" ADD CONSTRAINT "com18_sapte_fk2" FOREIGN KEY ("entidad_id") REFERENCES "entidades"("entidad_id");
ALTER TABLE "com19_renad" ADD CONSTRAINT "com19_renad_fk1" FOREIGN KEY ("compromiso_id") REFERENCES "compromisos"("compromiso_id");

ALTER TABLE "com19_renad" ADD CONSTRAINT "com19_renad_fk2" FOREIGN KEY ("entidad_id") REFERENCES "entidades"("entidad_id");
ALTER TABLE "com20_dsfpe" ADD CONSTRAINT "com20_dsfpe_fk1" FOREIGN KEY ("compromiso_id") REFERENCES "compromisos"("compromiso_id");

ALTER TABLE "com20_dsfpe" ADD CONSTRAINT "com20_dsfpe_fk2" FOREIGN KEY ("entidad_id") REFERENCES "entidades"("entidad_id");
ALTER TABLE "com21_dogd" ADD CONSTRAINT "com21_dogd_fk1" FOREIGN KEY ("compromiso_id") REFERENCES "compromisos"("compromiso_id");

ALTER TABLE "com21_dogd" ADD CONSTRAINT "com21_dogd_fk2" FOREIGN KEY ("entidad_id") REFERENCES "entidades"("entidad_id");
ALTER TABLE "com3_epgd" ADD CONSTRAINT "com3_epgd_fk1" FOREIGN KEY ("compromiso_id") REFERENCES "compromisos"("compromiso_id");

ALTER TABLE "com3_epgd" ADD CONSTRAINT "com3_epgd_fk2" FOREIGN KEY ("entidad_id") REFERENCES "entidades"("entidad_id");
ALTER TABLE "personal_ti" ADD CONSTRAINT "personal_ti_fk1" FOREIGN KEY ("com_entidad_id") REFERENCES "com3_epgd"("comepgd_ent_id");
ALTER TABLE "inventario_software" ADD CONSTRAINT "inventario_software_fk1" FOREIGN KEY ("com_entidad_id") REFERENCES "com3_epgd"("comepgd_ent_id");
ALTER TABLE "inventario_sistemas_info" ADD CONSTRAINT "inventario_sistemas_info_fk1" FOREIGN KEY ("com_entidad_id") REFERENCES "com3_epgd"("comepgd_ent_id");
ALTER TABLE "inventario_red" ADD CONSTRAINT "inventario_red_fk1" FOREIGN KEY ("com_entidad_id") REFERENCES "com3_epgd"("comepgd_ent_id");
ALTER TABLE "inventario_servidores" ADD CONSTRAINT "inventario_servidores_fk1" FOREIGN KEY ("com_entidad_id") REFERENCES "com3_epgd"("comepgd_ent_id");
ALTER TABLE "seguridad_info" ADD CONSTRAINT "seguridad_info_fk1" FOREIGN KEY ("com_entidad_id") REFERENCES "com3_epgd"("comepgd_ent_id");
ALTER TABLE "capacitaciones_seginfo" ADD CONSTRAINT "capacitaciones_seginfo_fk1" FOREIGN KEY ("com_entidad_id") REFERENCES "com3_epgd"("comepgd_ent_id");
ALTER TABLE "com4_tdpei" ADD CONSTRAINT "com4_tdpei_fk1" FOREIGN KEY ("compromiso_id") REFERENCES "compromisos"("compromiso_id");

ALTER TABLE "com4_tdpei" ADD CONSTRAINT "com4_tdpei_fk2" FOREIGN KEY ("entidad_id") REFERENCES "entidades"("entidad_id");
ALTER TABLE "com2_cgtd" ADD CONSTRAINT "com2_cgtd_fk1" FOREIGN KEY ("compromiso_id") REFERENCES "compromisos"("compromiso_id");

ALTER TABLE "com2_cgtd" ADD CONSTRAINT "com2_cgtd_fk2" FOREIGN KEY ("entidad_id") REFERENCES "entidades"("entidad_id");
ALTER TABLE "comite_miembros" ADD CONSTRAINT "comite_miembros_fk1" FOREIGN KEY ("com_entidad_id") REFERENCES "com2_cgtd"("comcgtd_ent_id");
