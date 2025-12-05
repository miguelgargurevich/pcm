# Análisis de Integración de los 21 Compromisos PCM

**Fecha de análisis:** 4 de diciembre de 2025

## Resumen Ejecutivo

Este documento presenta el análisis de integración de los 20 compromisos implementados (excluyendo el compromiso 3).

---

## Estado de Integración por Compromiso

| # | Nombre Compromiso | Tabla DB | Entidad | Create Cmd | Update Cmd | Controller | Service FE | UI Pasos |
|---|------------------|----------|---------|------------|------------|------------|------------|----------|
| 1 | Líder GTD | com1_liderg_td | ✅ Com1LiderGTD | ✅ | ✅ | ✅ | ✅ | ✅ 3 pasos |
| 2 | Comité GTD (CGTD) | com2_cgtd | ✅ Com2CGTD | ✅ | ✅ | ✅ | ✅ | ✅ 3 pasos |
| 3 | ~~Estrategia Gob PE~~ | ~~com3_epgd~~ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ Excluido |
| 4 | TD en el PEI | com4_tdpei | ✅ Com4PEI | ✅ | ✅ | ✅ | ✅ | ✅ 3 pasos |
| 5 | Estrategia Digital | com5_destrategiad | ✅ Com5EstrategiaDigital | ✅ | ✅ | ✅ | ✅ | ✅ 3 pasos |
| 6 | Migración GOB.PE | com6_mpgobpe | ✅ Com6MigracionGobPe | ✅ | ✅ | ✅ | ✅ | ✅ 3 pasos |
| 7 | Implementación MPD | com7_impd | ✅ Com7ImplementacionMPD | ✅ | ✅ | ✅ | ✅ | ✅ 3 pasos |
| 8 | Publicación TUPA | com8_ptupa | ✅ Com8PublicacionTUPA | ✅ | ✅ | ✅ | ✅ | ✅ 3 pasos |
| 9 | Modelo Gestión Documental | com9_imgd | ✅ Com9ModeloGestionDocumental | ✅ | ✅ | ✅ | ✅ | ✅ 3 pasos |
| 10 | Datos Abiertos (PNDA) | com10_pnda | ✅ Com10DatosAbiertos | ✅ | ✅ | ✅ | ✅ | ✅ 3 pasos |
| 11 | Aportación GeoPeru | com11_ageop | ✅ Com11AportacionGeoPeru | ✅ | ✅ | ✅ | ✅ | ✅ 3 pasos |
| 12 | Responsable Software Público | com12_drsp | ✅ Com12ResponsableSoftwarePublico | ✅ | ✅ | ✅ | ✅ | ✅ 3 pasos |
| 13 | Interoperabilidad PIDE | com13_pcpide | ✅ Com13InteroperabilidadPIDE | ✅ | ✅ | ✅ | ✅ | ✅ 3 pasos |
| 14 | Oficial Seguridad Digital | com14_doscd | ✅ Com14OficialSeguridadDigital | ✅ | ✅ | ✅ | ✅ | ✅ 3 pasos |
| 15 | CSIRT Institucional | com15_csirt | ✅ Com15CSIRTInstitucional | ✅ | ✅ | ✅ | ✅ | ✅ 3 pasos |
| 16 | Sistema Gestión Seguridad | com16_sgsi | ✅ Com16SistemaGestionSeguridad | ✅ | ✅ | ✅ | ✅ | ✅ 3 pasos |
| 17 | Plan Transición IPv6 | com17_ptipv6 | ✅ Com17PlanTransicionIPv6 | ✅ | ✅ | ✅ | ✅ | ✅ 3 pasos |
| 18 | Acceso Portal Transparencia | com18_sapte | ✅ Com18AccesoPortalTransparencia | ✅ | ✅ | ✅ | ✅ | ✅ 3 pasos |
| 19 | Encuesta Nacional Gob Digital | com19_renad | ✅ Com19EncuestaNacionalGobDigital | ✅ | ✅ | ✅ | ✅ | ✅ 3 pasos |
| 20 | Digitalización Servicios Facilita | com20_dsfpe | ✅ Com20DigitalizacionServiciosFacilita | ✅ | ✅ | ✅ | ✅ | ✅ 3 pasos |
| 21 | Oficial Gobierno de Datos | com21_dogd | ✅ Com21OficialGobiernoDatos | ✅ | ✅ | ✅ | ✅ | ✅ 3 pasos |

---

## Detalle por Componente

### 1. Entidades de Dominio (`PCM.Domain/Entities/`)

Todos los 20 compromisos tienen sus entidades definidas:

| Compromiso | Archivo | Tabla DB | PK |
|------------|---------|----------|-----|
| 1 | Com1LiderGTD.cs | com1_liderg_td | comlgtd_ent_id |
| 2 | Com2CGTD.cs | com2_cgtd | comcgtd_ent_id |
| 4 | Com4PEI.cs | com4_tdpei | comtdpei_ent_id |
| 5 | Com5EstrategiaDigital.cs | com5_destrategiad | comded_ent_id |
| 6 | Com6MigracionGobPe.cs | com6_mpgobpe | commpgobpe_ent_id |
| 7 | Com7ImplementacionMPD.cs | com7_impd | comimpd_ent_id |
| 8 | Com8PublicacionTUPA.cs | com8_ptupa | comptupa_ent_id |
| 9 | Com9ModeloGestionDocumental.cs | com9_imgd | comimgd_ent_id |
| 10 | Com10DatosAbiertos.cs | com10_pnda | compnda_ent_id |
| 11 | Com11AportacionGeoPeru.cs | com11_ageop | comageop_ent_id |
| 12 | Com12ResponsableSoftwarePublico.cs | com12_drsp | comdrsp_ent_id |
| 13 | Com13InteroperabilidadPIDE.cs | com13_pcpide | compcpide_ent_id |
| 14 | Com14OficialSeguridadDigital.cs | com14_doscd | comdoscd_ent_id |
| 15 | Com15CSIRTInstitucional.cs | com15_csirt | comcsirt_ent_id |
| 16 | Com16SistemaGestionSeguridad.cs | com16_sgsi | comsgsi_ent_id |
| 17 | Com17PlanTransicionIPv6.cs | com17_ptipv6 | comptipv6_ent_id |
| 18 | Com18AccesoPortalTransparencia.cs | com18_sapte | comsapte_ent_id |
| 19 | Com19EncuestaNacionalGobDigital.cs | com19_renad | comrenad_ent_id |
| 20 | Com20DigitalizacionServiciosFacilita.cs | com20_dsfpe | comdsfpe_ent_id |
| 21 | Com21OficialGobiernoDatos.cs | com21_dogd | comdogd_ent_id |

---

### 2. Commands/Handlers (`PCM.Application/Features/`)

Todos los compromisos tienen carpetas Create y Update:

| Compromiso | CreateCommand | UpdateCommand | Estructura |
|------------|---------------|---------------|------------|
| 1 | ✅ CreateCom1LiderGTD/ | ✅ UpdateCom1LiderGTD/ | Carpetas |
| 2 | ✅ CreateCom2CGTD/ | ✅ UpdateCom2CGTD/ | Carpetas |
| 4 | ✅ CreateCom4PEI/ | ✅ UpdateCom4PEI/ | Carpetas |
| 5 | ✅ CreateCom5EstrategiaDigitalCommand.cs | ✅ UpdateCom5EstrategiaDigitalCommand.cs | Archivos |
| 6 | ✅ CreateCom6MigracionGobPe/ | ✅ UpdateCom6MigracionGobPe/ | Carpetas |
| 7 | ✅ CreateCom7ImplementacionMPD/ | ✅ UpdateCom7ImplementacionMPD/ | Carpetas |
| 8 | ✅ CreateCom8PublicacionTUPA/ | ✅ UpdateCom8PublicacionTUPA/ | Carpetas |
| 9 | ✅ CreateCom9ModeloGestionDocumental/ | ✅ UpdateCom9ModeloGestionDocumental/ | Carpetas |
| 10 | ✅ CreateCom10DatosAbiertos/ | ✅ UpdateCom10DatosAbiertos/ | Carpetas |
| 11 | ✅ CreateCom11AportacionGeoPeru/ | ✅ UpdateCom11AportacionGeoPeru/ | Carpetas |
| 12 | ✅ CreateCom12ResponsableSoftwarePublico/ | ✅ UpdateCom12ResponsableSoftwarePublico/ | Carpetas |
| 13 | ✅ CreateCom13InteroperabilidadPIDE/ | ✅ UpdateCom13InteroperabilidadPIDE/ | Carpetas |
| 14 | ✅ CreateCom14OficialSeguridadDigital/ | ✅ UpdateCom14OficialSeguridadDigital/ | Carpetas |
| 15 | ✅ CreateCom15CSIRTInstitucional/ | ✅ UpdateCom15CSIRTInstitucional/ | Carpetas |
| 16 | ✅ CreateCom16SistemaGestionSeguridad/ | ✅ UpdateCom16SistemaGestionSeguridad/ | Carpetas |
| 17 | ✅ CreateCom17PlanTransicionIPv6/ | ✅ UpdateCom17PlanTransicionIPv6/ | Carpetas |
| 18 | ✅ CreateCom18AccesoPortalTransparencia/ | ✅ UpdateCom18AccesoPortalTransparencia/ | Carpetas |
| 19 | ✅ CreateCom19EncuestaNacionalGobDigital/ | ✅ UpdateCom19EncuestaNacionalGobDigital/ | Carpetas |
| 20 | ✅ CreateCom20DigitalizacionServiciosFacilita/ | ✅ UpdateCom20DigitalizacionServiciosFacilita/ | Carpetas |
| 21 | ✅ CreateCom21OficialGobiernoDatos/ | ✅ UpdateCom21OficialGobiernoDatos/ | Carpetas |

---

### 3. Controllers (`PCM.API/Controllers/`)

Todos los compromisos tienen su Controller:

- ✅ Com1LiderGTDController.cs
- ✅ Com2CGTDController.cs
- ✅ Com4PEIController.cs
- ✅ Com5EstrategiaDigitalController.cs
- ✅ Com6MigracionGobPeController.cs
- ✅ Com7ImplementacionMPDController.cs
- ✅ Com8PublicacionTUPAController.cs
- ✅ Com9ModeloGestionDocumentalController.cs
- ✅ Com10DatosAbiertosController.cs
- ✅ Com11AportacionGeoPeruController.cs
- ✅ Com12ResponsableSoftwarePublicoController.cs
- ✅ Com13InteroperabilidadPIDEController.cs
- ✅ Com14OficialSeguridadDigitalController.cs
- ✅ Com15CSIRTInstitucionalController.cs
- ✅ Com16SistemaGestionSeguridadController.cs
- ✅ Com17PlanTransicionIPv6Controller.cs
- ✅ Com18AccesoPortalTransparenciaController.cs
- ✅ Com19EncuestaNacionalGobDigitalController.cs
- ✅ Com20DigitalizacionServiciosFacilitaController.cs
- ✅ Com21OficialGobiernoDatosController.cs

---

### 4. Services Frontend (`frontend/src/services/`)

Todos los compromisos tienen su servicio:

- ✅ com1LiderGTDService.js
- ✅ com2CGTDService.js
- ✅ com4PEIService.js
- ✅ com5EstrategiaDigitalService.js
- ✅ com6MigracionGobPeService.js
- ✅ com7ImplementacionMPDService.js
- ✅ com8PublicacionTUPAService.js
- ✅ com9ModeloGestionDocumentalService.js
- ✅ com10DatosAbiertosService.js
- ✅ com11AportacionGeoPeruService.js
- ✅ com12ResponsableSoftwarePublicoService.js
- ✅ com13InteroperabilidadPIDEService.js
- ✅ com14OficialSeguridadDigitalService.js
- ✅ com15CSIRTInstitucionalService.js
- ✅ com16SistemaGestionSeguridadService.js
- ✅ com17PlanTransicionIPv6Service.js
- ✅ com18AccesoPortalTransparenciaService.js
- ✅ com19EncuestaNacionalGobDigitalService.js
- ✅ com20DigitalizacionServiciosFacilitaService.js
- ✅ com21OficialGobiernoDatosService.js

---

### 5. UI en CumplimientoNormativoDetalle.jsx

El archivo importa todos los servicios y tiene secciones para cada compromiso:

| Compromiso | Import Service | loadCumplimiento | Línea |
|------------|----------------|------------------|-------|
| 1 | ✅ | ✅ `compromisoId === 1` | 479 |
| 2 | ✅ | ✅ `compromisoId === 2` | 620 |
| 3 | ❌ (comentado) | ❌ (comentado) | 549 |
| 4 | ✅ | ✅ `compromisoId === 4` | 682 |
| 5 | ✅ | ✅ `compromisoId === 5` | 773 |
| 6 | ✅ | ✅ `compromisoId === 6` | 857 |
| 7 | ✅ | ✅ `compromisoId === 7` | 957 |
| 8 | ✅ | ✅ `compromisoId === 8` | 1037 |
| 9 | ✅ | ✅ `compromisoId === 9` | 1117 |
| 10 | ✅ | ✅ `compromisoId === 10` | 1198 |
| 11 | ✅ | ✅ `compromisoId === 11` | 1279 |
| 12 | ✅ | ✅ `compromisoId === 12` | 1352 |
| 13 | ✅ | ✅ `compromisoId === 13` | 1424 |
| 14 | ✅ | ✅ `compromisoId === 14` | 1497 |
| 15 | ✅ | ✅ `compromisoId === 15` | 1569 |
| 16 | ✅ | ✅ `compromisoId === 16` | 1628 |
| 17 | ✅ | ✅ `compromisoId === 17` | 1687 |
| 18 | ✅ | ✅ `compromisoId === 18` | 1752 |
| 19 | ✅ | ✅ `compromisoId === 19` | 1817 |
| 20 | ✅ | ✅ `compromisoId === 20` | 1881 |
| 21 | ✅ | ✅ `compromisoId === 21` | 1955 |

---

## Análisis de Uso de [JsonPropertyName]

### Compromisos que USAN [JsonPropertyName]:

| Compromiso | Formato | Ejemplo |
|------------|---------|---------|
| 4 (Com4PEI) | ✅ Mixto (snake_case para IDs, camelCase para campos) | `[JsonPropertyName("compromiso_id")]`, `[JsonPropertyName("anioInicioPei")]` |
| CumplimientoNormativo | ✅ snake_case | `[JsonPropertyName("cumplimiento_id")]` |

### Compromisos que NO USAN [JsonPropertyName]:

| Compromiso | Formato usado |
|------------|---------------|
| 1 (Com1LiderGTD) | ❌ Solo PascalCase nativo |
| 5 (Com5EstrategiaDigital) | ❌ Solo PascalCase nativo |
| 6 (Com6MigracionGobPe) | ❌ Solo PascalCase nativo |
| 10 (Com10DatosAbiertos) | ❌ Solo PascalCase nativo |
| 15 (Com15CSIRTInstitucional) | ❌ Solo PascalCase nativo |
| 21 (Com21OficialGobiernoDatos) | ❌ Solo PascalCase nativo |
| (y todos los demás) | ❌ Solo PascalCase nativo |

---

## Inconsistencias Detectadas

### 1. Estructura de Commands
- **Com5EstrategiaDigital**: Los commands están como archivos directos (`CreateCom5EstrategiaDigitalCommand.cs`), mientras los demás usan carpetas (`CreateCom5EstrategiaDigital/`).

### 2. Uso de JsonPropertyName
- **Inconsistente**: Solo Com4PEI y CumplimientoNormativo usan `[JsonPropertyName]`
- **Riesgo**: Los demás compromisos dependen del binding automático con PascalCase

### 3. Entidades sin atributos Table/Column
- **Com1LiderGTD** y **Com2CGTD**: No usan atributos `[Table]` ni `[Column]`, las demás sí los usan

---

## Recomendaciones

1. **Homologar uso de JsonPropertyName**: Decidir si todos los Commands deben usar `[JsonPropertyName]` o ninguno.

2. **Estandarizar estructura de Commands**: Todos deberían usar carpetas o todos archivos directos.

3. **Agregar atributos a entidades faltantes**: Com1LiderGTD y Com2CGTD deberían tener `[Table]` y `[Column]`.

4. **Compromiso 3**: Está completamente excluido - confirmar si es intencional.

---

## Conclusión

El proyecto tiene una integración **COMPLETA** para los 20 compromisos activos:
- ✅ 20/20 Entidades de dominio
- ✅ 20/20 Create Commands
- ✅ 20/20 Update Commands  
- ✅ 20/20 Controllers
- ✅ 20/20 Services Frontend
- ✅ 20/20 UI (CumplimientoNormativoDetalle.jsx)

Las únicas inconsistencias son de formato/estilo, no de funcionalidad.
