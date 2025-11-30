# Informe de Inconsistencias entre BD, Backend y Frontend - Compromisos 4-21

## Fecha: Análisis realizado en la sesión actual

## Resumen Ejecutivo

Se detectaron **inconsistencias graves** entre la estructura de la base de datos PostgreSQL (Supabase) y el código del backend (.NET). Los handlers, commands, queries y responses fueron creados con campos genéricos/plantilla que no coinciden con las columnas reales de las tablas de la base de datos.

---

## Compromisos Corregidos (Entidades alineadas con BD)

### ✅ Com4-Com8: Sin cambios mayores necesarios
Las entidades ya tenían la estructura correcta.

### ✅ Com9ModeloGestionDocumental
- **Tabla BD**: `com9_imgd`
- **Cambios realizados**: 
  - Corregido nombre de tabla (era `com9_mgd`, ahora `com9_imgd`)
  - Añadido campo `CommgdEntId` (alias de `comimgd_ent_id`)
  - Añadido campo `SistemaPlataformaMgd` → mapea a `sistema_gestion_doc`
  - Añadido campo `InteroperaSistemasMgd` → mapea a `interoperabilidad_mgd`
  - Añadido campo `UpdatedAt` (NotMapped para compatibilidad)

### ✅ Com10DatosAbiertos
- **Tabla BD**: `com10_pnda`
- **Cambios realizados**:
  - Corregido nombre de tabla (era `com10_da`, ahora `com10_pnda`)
  - Renombrados campos para compatibilidad con handlers:
    - `UrlDatosAbiertos` → `url_pnda`
    - `TotalDatasets` → `total_datasets_publicados`
    - `ResponsableDa` → `responsable_pnda`
    - etc.

### ✅ Com20DigitalizacionServiciosFacilita
- **Tabla BD**: `com20_dsfpe`
- **Cambios realizados**: 
  - Actualizados Commands, Responses y Handlers para usar campos reales de BD

---

## Compromisos Pendientes de Corrección

### ⚠️ Com11AportacionGeoPeru
- **Tabla BD**: `com11_agp`
- **Problema**: Handlers usan `FechaInicio`, `FechaFin`, `ServiciosDigitalizados`, etc.
- **BD tiene**: `url_geoperu`, `total_capas_publicadas`, `fecha_ult_actualizacion_gp`, `responsable_gp`, etc.
- **Archivos a corregir**:
  - `PCM.Application/Features/Com11AportacionGeoPeru/Commands/*/`
  - `PCM.Application/Features/Com11AportacionGeoPeru/Queries/*/`
  - `PCM.Infrastructure/Handlers/Com11AportacionGeoPeru/`

### ⚠️ Com12ResponsableSoftwarePublico
- **Tabla BD**: `com12_drsp`
- **Problema**: Handlers usan `FechaElaboracion`, `NumeroDocumento`, `Descripcion`, etc.
- **BD tiene**: `dni_rsp`, `nombre_rsp`, `ape_pat_rsp`, `cargo_rsp`, `fecha_designacion_rsp`, etc.
- **Archivos a corregir**: Similar estructura

### ⚠️ Com13InteroperabilidadPIDE
- **Tabla BD**: `com13_ipide`
- **Problema**: Handlers usan `FechaAprobacion`, `NumeroResolucion`, `RiesgosIdentificados`, etc.
- **BD tiene**: `url_pide`, `cantidad_servicios_pide`, `responsable_ipide`, `fecha_ultimo_servicio_pide`, etc.

### ⚠️ Com14OficialSeguridadDigital
- **Tabla BD**: `com14_doscd`
- **Problema**: Handlers usan `FechaElaboracion`, `PoliticasSeguridad`, `Certificaciones`, etc.
- **BD tiene**: `dni_oscd`, `nombre_oscd`, `cargo_oscd`, `fecha_designacion_oscd`, `comunicado_pcm_oscd`, etc.

### ⚠️ Com15CSIRTInstitucional
- **Tabla BD**: `com15_csirt`
- **Problema**: Handlers usan `FechaConformacion`, `Responsable`, `EmailContacto`, `ArchivoProcedimientos`, etc.
- **BD tiene**: `nombre_csirt`, `fecha_conformacion_csirt`, `responsable_csirt`, `correo_csirt`, `protocolo_incidentes_csirt`, etc.

### ⚠️ Com16SistemaGestionSeguridad
- **Tabla BD**: `com16_sgsi`
- **Problema**: Similar patrón de campos genéricos vs específicos

### ⚠️ Com17PlanTransicionIPv6
- **Tabla BD**: `com17_ptipv6`
- **Problema**: Similar patrón

### ⚠️ Com18AccesoPortalTransparencia
- **Tabla BD**: `com18_sapte`
- **Problema**: Handlers usan `UrlPlataforma`, `FechaImplementacion`, `TramitesDisponibles`, etc.
- **BD tiene**: `responsable_pte`, `fecha_solicitud_pte`, `fecha_acceso_pte`, `estado_acceso_pte`, `enlace_portal_pte`, etc.

### ⚠️ Com19EncuestaNacionalGobDigital
- **Tabla BD**: `com19_engd`
- **Problema**: Similar patrón

### ⚠️ Com21OficialGobiernoDatos
- **Tabla BD**: `com21_dogd`
- **Problema**: Handlers usan `FechaElaboracion`, `NumeroDocumento`, `Procedimientos`, etc.
- **BD tiene**: `dni_ogd`, `nombre_ogd`, `cargo_ogd`, `fecha_designacion_ogd`, `comunicado_pcm_ogd`, etc.

---

## Patrón de Corrección Recomendado

Para cada compromiso, se deben actualizar:

1. **Entidad** (`PCM.Domain/Entities/Com{N}*.cs`):
   - Asegurar que las propiedades usen `[Column("nombre_bd")]` para mapear correctamente
   - Propiedades deben tener nombres PascalCase compatibles con C#

2. **Commands** (`PCM.Application/Features/Com{N}*/Commands/*/`):
   - Actualizar propiedades para que coincidan con la entidad

3. **Queries** (`PCM.Application/Features/Com{N}*/Queries/*/`):
   - Actualizar Response para que coincida con la entidad

4. **Handlers** (`PCM.Infrastructure/Handlers/Com{N}*/`):
   - Actualizar mapeo de request a entity y entity a response

5. **Frontend Services** (`frontend/src/services/com{n}*.js`):
   - Actualizar nombres de campos en las llamadas a la API

---

## Estructura de BD por Compromiso (Referencia)

### com9_imgd (Implementación del MGD)
```sql
comimgd_ent_id, compromiso_id, entidad_id, etapa_formulario, estado,
check_privacidad, check_ddjj, estado_PCM, observaciones_PCM, created_at,
fec_registro, usuario_registra, activo, fecha_aprobacion_mgd,
numero_resolucion_mgd, responsable_mgd, cargo_responsable_mgd,
correo_responsable_mgd, telefono_responsable_mgd, sistema_gestion_doc,
tipo_implantacion_mgd, interoperabilidad_mgd, observacion_mgd,
ruta_pdf_mgd, rutaPDF_normativa
```

### com10_pnda (Datos Abiertos PNDA)
```sql
compnda_ent_id, compromiso_id, entidad_id, ..., url_pnda,
total_datasets_publicados, fecha_ultima_actualizacion_pnda,
responsable_pnda, cargo_responsable_pnda, correo_responsable_pnda,
telefono_responsable_pnda, norma_aprobacion_pnda, fecha_aprobacion_pnda,
observacion_pnda, ruta_pdf_pnda, rutaPDF_normativa
```

### com11_agp (Aportación GeoPeru)
```sql
comagp_ent_id, ..., url_geoperu, total_capas_publicadas,
fecha_ult_actualizacion_gp, responsable_gp, cargo_responsable_gp,
correo_gp, telefono_gp, fecha_inicio_aporte_gp, observacion_gp,
ruta_pdf_gp, rutaPDF_normativa
```

### com12_drsp (Responsable Software Público)
```sql
comdrsp_ent_id, ..., dni_rsp, nombre_rsp, ape_pat_rsp, ape_mat_rsp,
cargo_rsp, correo_rsp, telefono_rsp, fecha_designacion_rsp,
numero_resolucion_rsp, ruta_pdf_rsp, observacion_rsp, rutaPDF_normativa
```

### com14_doscd (Oficial Seguridad Digital)
```sql
comdoscd_ent_id, ..., dni_oscd, nombre_oscd, ape_pat_oscd, ape_mat_oscd,
cargo_oscd, correo_oscd, telefono_oscd, fecha_designacion_oscd,
numero_resolucion_oscd, comunicado_pcm_oscd, ruta_pdf_oscd,
observacion_oscd, rutaPDF_normativa
```

### com15_csirt (CSIRT Institucional)
```sql
comcsirt_ent_id, ..., nombre_csirt, fecha_conformacion_csirt,
numero_resolucion_csirt, responsable_csirt, cargo_responsable_csirt,
correo_csirt, telefono_csirt, protocolo_incidentes_csirt,
comunicado_pcm_csirt, ruta_pdf_csirt, observacion_csirt, rutaPDF_normativa
```

### com18_sapte (Acceso Portal Transparencia)
```sql
comsapte_ent_id, ..., responsable_pte, cargo_responsable_pte,
correo_pte, telefono_pte, fecha_solicitud_pte, fecha_acceso_pte,
numero_oficio_pte, estado_acceso_pte, enlace_portal_pte,
descripcion_pte, ruta_pdf_pte, observacion_pte, rutaPDF_normativa
```

### com20_dsfpe (Digitalización Servicios Facilita)
```sql
comdsfpe_ent_id, ..., responsable_facilita, cargo_responsable_facilita,
correo_facilita, telefono_facilita, estado_implementacion_facilita,
fecha_inicio_facilita, fecha_ultimo_avance_facilita,
total_servicios_digitalizados, ruta_pdf_facilita, observacion_facilita,
rutaPDF_normativa
```

### com21_dogd (Oficial Gobierno de Datos)
```sql
comdogd_ent_id, ..., dni_ogd, nombre_ogd, ape_pat_ogd, ape_mat_ogd,
cargo_ogd, correo_ogd, telefono_ogd, fecha_designacion_ogd,
numero_resolucion_ogd, comunicado_pcm_ogd, ruta_pdf_ogd,
observacion_ogd, rutaPDF_normativa
```

---

## Conclusión

Los handlers y commands fueron creados usando una plantilla genérica sin personalizar para cada compromiso. Las entidades del dominio ahora están alineadas con la BD, pero los handlers de la capa Infrastructure y los DTOs de Application aún necesitan actualización.

**Prioridad de corrección**: Alta - El sistema no compilará hasta que se corrijan estos errores.
