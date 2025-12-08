# 📋 INFORME DE DIFERENCIAS: Formularios Frontend vs Base de Datos
## Compromiso 3 - Plan de Gobierno Digital

**Fecha:** 7 de diciembre de 2025  
**Versión:** 1.0

---

## 📌 Resumen Ejecutivo

Este documento detalla las diferencias encontradas entre los formularios del frontend (React/JSX) y las tablas de la base de datos PostgreSQL para el **Compromiso 3 - Plan de Gobierno Digital**.

### Resultado General

| Categoría | Estado |
|-----------|--------|
| **Tablas con diferencias críticas** | 6 de 11 |
| **Campos BD sin representación en Frontend** | ~47 campos |
| **Campos Frontend sin representación en BD** | ~42 campos |
| **Tablas correctamente alineadas** | 2 (objetivos y acciones) |

---

## 1️⃣ TABLA PRINCIPAL: `com3_epgd`

### ✅ Campos Alineados
| Campo BD | Campo Frontend | Estado |
|----------|----------------|--------|
| `comepgd_ent_id` | Auto-generado | ✅ |
| `compromiso_id` | compromisoId | ✅ |
| `entidad_id` | entidadId | ✅ |
| `etapa_formulario` | etapaFormulario | ✅ |
| `estado` | estado | ✅ |
| `check_privacidad` | checkPrivacidad | ✅ |
| `check_ddjj` | checkDdjj | ✅ |
| `estado_PCM` | estadoPcm | ✅ |
| `observaciones_PCM` | observacionesPcm | ✅ |
| `fecha_reporte` | fechaReporte | ✅ |
| `sede` | sede | ✅ |
| `observaciones` | observaciones | ✅ |

### ⚠️ Campos BD sin mapeo claro en Frontend
| Campo BD | Tipo | Observación |
|----------|------|-------------|
| `ubicacion_area_ti` | varchar(255) | No visible en EstructuraOrganizacional.jsx |
| `organigrama_ti` | varchar(255) | No visible en EstructuraOrganizacional.jsx |
| `dependencia_area_ti` | varchar(100) | No visible en EstructuraOrganizacional.jsx |
| `costo_anual_ti` | numeric(12,2) | No visible en EstructuraOrganizacional.jsx |
| `existe_comision_gd_ti` | boolean | No visible en EstructuraOrganizacional.jsx |
| `rutaPDF_normativa` | varchar(500) | No implementado en Frontend |

---

## 2️⃣ PERSONAL TI - `personal_ti` 🔴 CRÍTICO

### Estructura BD
```sql
personal_id          | bigint        | NOT NULL
com_entidad_id       | bigint        | NOT NULL
nombre_persona       | varchar(100)  | NOT NULL
dni                  | varchar(12)   | NOT NULL
cargo                | varchar(100)  | NOT NULL
rol                  | varchar(50)   | NOT NULL
especialidad         | varchar(80)   | NOT NULL
grado_instruccion    | varchar(50)   | NOT NULL
certificacion        | varchar(80)   | NOT NULL
acreditadora         | varchar(80)   | NOT NULL
codigo_certificacion | varchar(50)   | NOT NULL
colegiatura          | varchar(20)   | NOT NULL
email_personal       | varchar(100)  | NOT NULL
telefono             | varchar(30)   | NOT NULL
```

### Estructura Frontend (EstructuraOrganizacional.jsx)
```javascript
formPersonal = {
  apellidosNombres: '',  // → nombre_persona
  dni: '',               // → dni
  cargo: '',             // → cargo
  regimen: '',           // ❌ NO EXISTE EN BD
  condicion: '',         // ❌ NO EXISTE EN BD
  correo: ''             // → email_personal
}
```

### 📊 Análisis de Diferencias

| Campo BD | Campo Frontend | Estado |
|----------|----------------|--------|
| `nombre_persona` | apellidosNombres | ✅ Mapeable |
| `dni` | dni | ✅ OK |
| `cargo` | cargo | ✅ OK |
| `rol` | - | ❌ **FALTA EN FRONTEND** |
| `especialidad` | - | ❌ **FALTA EN FRONTEND** |
| `grado_instruccion` | - | ❌ **FALTA EN FRONTEND** |
| `certificacion` | - | ❌ **FALTA EN FRONTEND** |
| `acreditadora` | - | ❌ **FALTA EN FRONTEND** |
| `codigo_certificacion` | - | ❌ **FALTA EN FRONTEND** |
| `colegiatura` | - | ❌ **FALTA EN FRONTEND** |
| `email_personal` | correo | ✅ Mapeable |
| `telefono` | - | ❌ **FALTA EN FRONTEND** |
| - | regimen | ❌ **NO EXISTE EN BD** |
| - | condicion | ❌ **NO EXISTE EN BD** |

### 🎯 Acción Requerida
- **8 campos de BD** no tienen representación en Frontend
- **2 campos de Frontend** no existen en BD

---

## 3️⃣ INVENTARIO SOFTWARE - `inventario_software` 🔴 CRÍTICO

### Estructura BD
```sql
inv_soft_id           | bigint        | NOT NULL
com_entidad_id        | bigint        | NOT NULL
cod_producto          | varchar(50)   | NOT NULL
nombre_producto       | varchar(150)  | NOT NULL
version               | varchar(50)   | NOT NULL
cantidad_instalaciones| bigint        | NOT NULL
tipo_software         | varchar(50)   | NOT NULL
cantidad_licencias    | bigint        | NOT NULL
exceso_deficiencia    | bigint        | NOT NULL
costo_licencias       | numeric(12,2) | NOT NULL
```

### Estructura Frontend (InventarioSoftwareTab.jsx)
```javascript
formItem = {
  nombreSoftware: '',      // → nombre_producto
  version: '',             // → version
  tipoSoftware: '',        // → tipo_software
  licencia: '',            // ❌ NO EXISTE EN BD
  cantidadLicencias: '',   // → cantidad_licencias
  vigenciaLicencia: '',    // ❌ NO EXISTE EN BD
  proveedor: '',           // ❌ NO EXISTE EN BD
  observaciones: ''        // ❌ NO EXISTE EN BD
}
```

### 📊 Análisis de Diferencias

| Campo BD | Campo Frontend | Estado |
|----------|----------------|--------|
| `cod_producto` | - | ❌ **FALTA EN FRONTEND** |
| `nombre_producto` | nombreSoftware | ✅ Mapeable |
| `version` | version | ✅ OK |
| `tipo_software` | tipoSoftware | ✅ OK |
| `cantidad_instalaciones` | - | ❌ **FALTA EN FRONTEND** |
| `cantidad_licencias` | cantidadLicencias | ✅ OK |
| `exceso_deficiencia` | - | ❌ **FALTA EN FRONTEND** |
| `costo_licencias` | - | ❌ **FALTA EN FRONTEND** |
| - | licencia | ❌ **NO EXISTE EN BD** |
| - | vigenciaLicencia | ❌ **NO EXISTE EN BD** |
| - | proveedor | ❌ **NO EXISTE EN BD** |
| - | observaciones | ❌ **NO EXISTE EN BD** |

### 🎯 Acción Requerida
- **4 campos de BD** no tienen representación en Frontend
- **4 campos de Frontend** no existen en BD

---

## 4️⃣ INVENTARIO SISTEMAS - `inventario_sistemas_info` 🟡 MEDIO

### Estructura BD
```sql
inv_si_id             | bigint        | NOT NULL
com_entidad_id        | bigint        | NOT NULL
codigo                | varchar(20)   | NOT NULL
nombre_sistema        | varchar(150)  | NOT NULL
descripcion           | varchar(255)  | NOT NULL
tipo_sistema          | varchar(50)   | NOT NULL
lenguaje_programacion | varchar(50)   | NOT NULL
base_datos            | varchar(50)   | NOT NULL
plataforma            | varchar(10)   | NOT NULL  -- ⚠️ Solo 10 caracteres
```

### Estructura Frontend (InventarioSistemasTab.jsx)
```javascript
formItem = {
  nombreSistema: '',         // → nombre_sistema
  siglas: '',                // → codigo (?)
  descripcion: '',           // → descripcion
  tipoSistema: '',           // → tipo_sistema
  lenguajeProgramacion: '',  // → lenguaje_programacion
  baseDatos: '',             // → base_datos
  plataforma: '',            // → plataforma
  estadoSistema: '',         // ❌ NO EXISTE EN BD
  anoImplementacion: '',     // ❌ NO EXISTE EN BD
  responsable: '',           // ❌ NO EXISTE EN BD
  url: '',                   // ❌ NO EXISTE EN BD
  observaciones: ''          // ❌ NO EXISTE EN BD
}
```

### ⚠️ Problema de Longitud
El campo `plataforma` en BD solo permite **10 caracteres**, pero el Frontend tiene opciones como:
- "On-Premise" (10 chars) ✅
- "Híbrido" (7 chars) ✅
- Pero los valores del dropdown son más largos en visualización

### 🎯 Acción Requerida
- **5 campos de Frontend** no existen en BD
- Verificar longitud de `plataforma`

---

## 5️⃣ INVENTARIO RED - `inventario_red` 🔴 CRÍTICO

### ⚠️ DISEÑO COMPLETAMENTE DIFERENTE

### Estructura BD (enfoque en cantidades agregadas)
```sql
inv_red_id              | bigint        | NOT NULL
com_entidad_id          | bigint        | NOT NULL
tipo_equipo             | varchar(80)   | NOT NULL
cantidad                | bigint        | NOT NULL
puertos_operativos      | bigint        | NOT NULL
puertos_inoperativos    | bigint        | NOT NULL
total_puertos           | bigint        | NOT NULL
costo_mantenimiento_anual| numeric(12,2)| NOT NULL
observaciones           | varchar(255)  | NOT NULL
```

### Estructura Frontend (enfoque en inventario individual)
```javascript
formItem = {
  tipoEquipo: '',        // → tipo_equipo
  marca: '',             // ❌ NO EXISTE EN BD
  modelo: '',            // ❌ NO EXISTE EN BD
  serie: '',             // ❌ NO EXISTE EN BD
  ubicacion: '',         // ❌ NO EXISTE EN BD
  estado: '',            // ❌ NO EXISTE EN BD
  anoAdquisicion: '',    // ❌ NO EXISTE EN BD
  garantiaVigente: false,// ❌ NO EXISTE EN BD
  observaciones: ''      // → observaciones
}
```

### 📊 Problema Fundamental
- **BD**: Diseñada para registrar **cantidades totales** por tipo de equipo (ej: "10 switches con 240 puertos operativos")
- **Frontend**: Diseñada para registrar **cada equipo individual** con sus características

### 🎯 Acción Requerida
**DECISIÓN CRÍTICA**: Elegir uno de los dos enfoques y alinear el otro.

---

## 6️⃣ INVENTARIO SERVIDORES - `inventario_servidores` 🔴 CRÍTICO

### Estructura BD (17 campos)
```sql
inv_srv_id              | bigint        | NOT NULL
com_entidad_id          | bigint        | NOT NULL
nombre_equipo           | varchar(100)  | NOT NULL
tipo_equipo             | varchar(10)   | NOT NULL
estado                  | varchar(30)   | NOT NULL
capa                    | varchar(30)   | NOT NULL
propiedad               | varchar(20)   | NOT NULL
montaje                 | varchar(20)   | NOT NULL
marca_cpu               | varchar(50)   | NOT NULL
modelo_cpu              | varchar(50)   | NOT NULL
velocidad_ghz           | numeric(5,2)  | NOT NULL
nucleos                 | bigint        | NOT NULL
memoria_gb              | bigint        | NOT NULL
marca_memoria           | varchar(50)   | NOT NULL
modelo_memoria          | varchar(50)   | NOT NULL
cantidad_memoria        | bigint        | NOT NULL
costo_mantenimiento_anual| numeric(12,2)| NOT NULL
observaciones           | varchar(255)  | NOT NULL
```

### Estructura Frontend (13 campos)
```javascript
formItem = {
  tipoServidor: '',      // → tipo_equipo
  marca: '',             // ❌ NO EXISTE EN BD
  modelo: '',            // ❌ NO EXISTE EN BD
  serie: '',             // ❌ NO EXISTE EN BD
  procesador: '',        // ❌ NO EXISTE EN BD (BD tiene marca_cpu, modelo_cpu, velocidad_ghz)
  memoria: '',           // → memoria_gb (pero BD es bigint, Frontend es string)
  almacenamiento: '',    // ❌ NO EXISTE EN BD
  sistemaOperativo: '',  // ❌ NO EXISTE EN BD
  ubicacion: '',         // ❌ NO EXISTE EN BD
  estado: '',            // → estado
  anoAdquisicion: '',    // ❌ NO EXISTE EN BD
  garantiaVigente: false,// ❌ NO EXISTE EN BD
  observaciones: ''      // → observaciones
}
```

### 📊 Análisis
- **14 campos de BD** sin representación directa en Frontend
- **9 campos de Frontend** sin representación en BD

---

## 7️⃣ SEGURIDAD INFO - `seguridad_info` 🟡 MEDIO

### Estructura BD
```sql
seginfo_id                    | bigint  | NOT NULL
com_entidad_id                | bigint  | NOT NULL
plan_sgsi                     | boolean | NOT NULL
comite_seguridad              | boolean | NOT NULL
oficial_seguridad_en_organigrama | boolean | NOT NULL
politica_seguridad            | boolean | NOT NULL
inventario_activos            | boolean | NOT NULL
analisis_riesgos              | boolean | NOT NULL
metodologia_riesgos           | boolean | NOT NULL
plan_continuidad              | boolean | NOT NULL
programa_auditorias           | boolean | NOT NULL
informes_direccion            | boolean | NOT NULL
certificacion_iso27001        | boolean | NOT NULL
observaciones                 | varchar(255) | NOT NULL
```

### Checkboxes Frontend vs BD

| Campo BD | Campo Frontend | Estado |
|----------|----------------|--------|
| `plan_sgsi` | cuentaSGSI | ✅ |
| `comite_seguridad` | cuentaComiteSeguridad | ✅ |
| `oficial_seguridad_en_organigrama` | cuentaOficialSeguridad | ✅ |
| `politica_seguridad` | cuentaPoliticaSeguridad | ✅ |
| `inventario_activos` | - | ❌ **FALTA EN FRONTEND** |
| `analisis_riesgos` | realizaAnalisisRiesgos | ✅ |
| `metodologia_riesgos` | - | ❌ **FALTA EN FRONTEND** |
| `plan_continuidad` | cuentaPlanContingencia | ✅ |
| `programa_auditorias` | - | ❌ **FALTA EN FRONTEND** |
| `informes_direccion` | - | ❌ **FALTA EN FRONTEND** |
| `certificacion_iso27001` | cuentaNormaISO27001 | ✅ |
| - | cuentaBackupPeriodico | ❌ **NO EXISTE EN BD** |
| - | cuentaAntivirusCorporativo | ❌ **NO EXISTE EN BD** |
| - | cuentaFirewall | ❌ **NO EXISTE EN BD** |
| - | cuentaCertificadosSSL | ❌ **NO EXISTE EN BD** |
| - | realizaPruebasPenetracion | ❌ **NO EXISTE EN BD** |

---

## 8️⃣ CAPACITACIONES SEGINFO - `capacitaciones_seginfo` 🟡 MEDIO

### Estructura BD
```sql
capseg_id         | bigint        | NOT NULL
com_entidad_id    | bigint        | NOT NULL
curso             | varchar(100)  | NOT NULL
cantidad_personas | bigint        | NOT NULL
```

### Estructura Frontend
```javascript
formItem = {
  nombreCapacitacion: '', // → curso
  fechaCapacitacion: '',  // ❌ NO EXISTE EN BD
  duracionHoras: '',      // ❌ NO EXISTE EN BD
  participantes: '',      // → cantidad_personas
  proveedor: '',          // ❌ NO EXISTE EN BD
  modalidad: '',          // ❌ NO EXISTE EN BD
  observaciones: ''       // ❌ NO EXISTE EN BD
}
```

### 🎯 Acción Requerida
- **5 campos de Frontend** no existen en BD
- BD muy simplificada vs Frontend más detallado

---

## 9️⃣ OBJETIVOS ESTRATÉGICOS - `objetivos_entidades` ✅ OK

### Estructura BD
```sql
obj_ent_id           | bigint       | NOT NULL
com_entidad_id       | bigint       | NOT NULL
tipo_obj             | varchar(1)   | NOT NULL  -- 'E' para Estratégico
numeracion_obj       | varchar(5)   | NOT NULL
descripcion_objetivo | varchar(240) | NOT NULL
```

### Estructura Frontend
```javascript
newObjetivo = {
  tipoObj: 'E',
  numeracionObj: 'OE-01',
  descripcionObjetivo: ''
}
```

✅ **Correctamente alineado**

---

## 🔟 ACCIONES OBJETIVOS - `acciones_objetivos_entidades` ✅ OK

### Estructura BD
```sql
acc_obj_ent_id    | bigint       | NOT NULL
obj_ent_id        | bigint       | NOT NULL
numeracion_acc    | varchar(5)   | NOT NULL
descripcion_accion| varchar(240) | NOT NULL
```

### Estructura Frontend
```javascript
newAccion = {
  numeracionAcc: 'OE-01.01',
  descripcionAccion: ''
}
```

✅ **Correctamente alineado**

---

## 1️⃣1️⃣ PROYECTOS - `proyectos_entidades` 🔴 CRÍTICO

### Estructura BD (22 campos)
```sql
proy_ent_id        | bigint       | NOT NULL
com_entidad_id     | bigint       | NOT NULL
numeracion_proy    | varchar(5)   | NOT NULL
nombre             | varchar(100) | NOT NULL
alcance            | varchar(240) | NOT NULL
justificacion      | varchar(240) | NOT NULL
tipo_proy          | varchar(100) | NOT NULL
area_proy          | varchar(50)  | NOT NULL
area_ejecuta       | varchar(50)  | NOT NULL
tipo_beneficiario  | varchar(100) | NOT NULL
etapa_proyecto     | varchar(100) | NOT NULL
ambito_proyecto    | varchar(100) | NOT NULL
fec_ini_prog       | date         | NOT NULL
fec_fin_prog       | date         | NOT NULL
fec_ini_real       | date         | NOT NULL
fec_fin_real       | date         | NOT NULL
alienado_pgd       | varchar(100) | NOT NULL
obj_tran_dig       | varchar(100) | NOT NULL
obj_est            | varchar(100) | NOT NULL
acc_est            | varchar(100) | NOT NULL
estado_proyecto    | boolean      | NOT NULL  -- ⚠️ Es boolean, no string
porcentaje_avance  | smallint     | DEFAULT 0
informo_avance     | boolean      | DEFAULT false
```

### Estructura Frontend (14 campos)
```javascript
formProyecto = {
  codigoProyecto: '',         // → numeracion_proy (formato diferente)
  nombreProyecto: '',         // → nombre
  descripcion: '',            // ❌ NO EXISTE EN BD
  tipoProyecto: '',           // → tipo_proy
  objetivoEstrategico: '',    // → obj_est
  objetivoGD: '',             // → obj_tran_dig
  responsable: '',            // ❌ NO EXISTE EN BD
  presupuesto: '',            // ❌ NO EXISTE EN BD
  fuenteFinanciamiento: '',   // ❌ NO EXISTE EN BD
  fechaInicio: '',            // → fec_ini_prog
  fechaFin: '',               // → fec_fin_prog
  estado: '',                 // → estado_proyecto (⚠️ BD es boolean!)
  porcentajeAvance: 0,        // → porcentaje_avance
  observaciones: ''           // ❌ NO EXISTE EN BD
}
```

### 📊 Campos BD sin Frontend
- `alcance`
- `justificacion`
- `area_proy`
- `area_ejecuta`
- `tipo_beneficiario`
- `etapa_proyecto`
- `ambito_proyecto`
- `fec_ini_real`
- `fec_fin_real`
- `alienado_pgd`
- `acc_est`
- `informo_avance`

### ⚠️ Problema de Tipos
- `estado_proyecto` en BD es **boolean** pero Frontend usa **string** con valores como "Planificado", "En ejecución", etc.

---

## 📊 RESUMEN CONSOLIDADO

### Severidad por Tabla

| Tabla | Severidad | Campos BD sin FE | Campos FE sin BD |
|-------|-----------|------------------|------------------|
| `personal_ti` | 🔴 CRÍTICO | 8 | 2 |
| `inventario_software` | 🔴 CRÍTICO | 4 | 4 |
| `inventario_sistemas_info` | 🟡 MEDIO | 0 | 5 |
| `inventario_red` | 🔴 CRÍTICO | 6 | 7 |
| `inventario_servidores` | 🔴 CRÍTICO | 14 | 9 |
| `seguridad_info` | 🟡 MEDIO | 4 | 5 |
| `capacitaciones_seginfo` | 🟡 MEDIO | 0 | 5 |
| `objetivos_entidades` | ✅ OK | 0 | 0 |
| `acciones_objetivos` | ✅ OK | 0 | 0 |
| `proyectos_entidades` | 🔴 CRÍTICO | 12 | 5 |

---

## 🎯 OPCIONES DE SOLUCIÓN

### Opción A: Ajustar Frontend a BD
**Esfuerzo estimado: ALTO**
- Modificar todos los formularios JSX
- Agregar campos faltantes en Frontend
- Eliminar campos que no están en BD
- Ajustar mapeos en handlers

### Opción B: Ajustar BD a Frontend  
**Esfuerzo estimado: MEDIO-ALTO**
- Crear scripts SQL ALTER TABLE
- Agregar columnas faltantes
- Modificar entidades en backend (.NET)
- Actualizar DbContext y handlers

### Opción C: Rediseño Mixto (RECOMENDADO)
**Esfuerzo estimado: MEDIO**
1. Definir qué campos son realmente necesarios según el negocio
2. Crear nueva estructura consensuada
3. Ajustar ambos lados según la nueva estructura
4. Migrar datos existentes si aplica

---

## 📋 PRÓXIMOS PASOS SUGERIDOS

1. **Revisión con stakeholders** - Definir campos realmente necesarios
2. **Decisión de arquitectura** - Elegir Opción A, B o C
3. **Scripts de migración** - Si se modifica BD
4. **Actualización Frontend** - Si se modifica formularios
5. **Pruebas integradas** - Validar flujo completo
6. **Documentación** - Actualizar mapeos finales

---

## 📎 Archivos Relacionados

### Frontend
- `frontend/src/components/Compromiso3/SituacionActual/EstructuraOrganizacional.jsx`
- `frontend/src/components/Compromiso3/SituacionActual/InventarioSoftwareTab.jsx`
- `frontend/src/components/Compromiso3/SituacionActual/InventarioSistemasTab.jsx`
- `frontend/src/components/Compromiso3/SituacionActual/InventarioRedTab.jsx`
- `frontend/src/components/Compromiso3/SituacionActual/InventarioServidoresTab.jsx`
- `frontend/src/components/Compromiso3/SituacionActual/SeguridadInfoTab.jsx`
- `frontend/src/components/Compromiso3/ObjetivosEstrategicos.jsx`
- `frontend/src/components/Compromiso3/PortafolioProyectos.jsx`

### Backend
- `backend/PCM.Domain/Entities/` - Entidades
- `backend/PCM.Infrastructure/Data/PCMDbContext.cs` - Configuración EF
- `backend/PCM.Infrastructure/Handlers/Com3EPGD/` - Handlers CRUD

### Base de Datos
- Supabase PostgreSQL: `aws-1-us-east-1.pooler.supabase.com`

---

*Documento generado automáticamente - PCM Project*
