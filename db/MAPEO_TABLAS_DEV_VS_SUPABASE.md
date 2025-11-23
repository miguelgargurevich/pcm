# Mapeo de Tablas y Columnas: Desarrollo vs Supabase

## Compromiso 4: Incorporar TD en el PEI

### Tabla
- **Desarrollo**: `com4_pei`
- **Supabase**: `com4_tdpei` ✅

### Columnas

| Campo Desarrollo | Campo Supabase | Tipo Desarrollo | Tipo Supabase | Notas |
|-----------------|----------------|-----------------|---------------|-------|
| `compei_ent_id` | `comtdpei_ent_id` | `int` | `bigint` | PK |
| `compromiso_id` | `compromiso_id` | `int` | `bigint` | ✅ |
| `entidad_id` | `entidad_id` | `uuid` | `bigint` | ⚠️ Tipo diferente |
| `etapa_formulario` | `etapa_formulario` | `int` | `varchar(20)` | ⚠️ Tipo diferente |
| `estado` | `estado` | `varchar(50)` | `varchar(15)` | ✅ |
| `anio_inicio` | `anio_inicio_pei` | `int` | `bigint` | ⚠️ Nombre diferente |
| `anio_fin` | `anio_fin_pei` | `int` | `bigint` | ⚠️ Nombre diferente |
| `fecha_aprobacion` | `fecha_aprobacion_pei` | `date` | `date` | ⚠️ Nombre diferente |
| `objetivo_estrategico` | `objetivo_pei` | `varchar(1000)` | `varchar(1000)` | ⚠️ Nombre diferente |
| `descripcion_incorporacion` | `descripcion_pei` | `varchar(2000)` | `varchar(2000)` | ⚠️ Nombre diferente |
| `alineado_pgd` | `alineado_pgd` | `bool` | `bool` | ✅ |
| `url_doc_pei` | `ruta_pdf_pei` | `text` | `varchar(255)` | ⚠️ Nombre diferente |
| `criterios_evaluados` | `criterios_evaluados` | `text` | `jsonb` | ✅ (recién agregado) |
| `check_privacidad` | `check_privacidad` | `bool` | `bool` | ✅ |
| `check_ddjj` | `check_ddjj` | `bool` | `bool` | ✅ |
| `usuario_registra` | `usuario_registra` | `uuid` | `bigint` | ⚠️ Tipo diferente |
| `created_at` | `created_at` | `timestamp` | `timestamp` | ✅ |
| `updated_at` | ❌ NO EXISTE | `timestamp` | - | ⚠️ Falta en Supabase |
| ❌ NO EXISTE | `estado_PCM` | - | `varchar(50)` | ⚠️ Falta en Desarrollo |
| ❌ NO EXISTE | `observaciones_PCM` | - | `varchar(500)` | ⚠️ Falta en Desarrollo |
| ❌ NO EXISTE | `fec_registro` | - | `date` | ⚠️ Falta en Desarrollo |
| ❌ NO EXISTE | `activo` | - | `bool` | ⚠️ Falta en Desarrollo |

---

## Compromiso 5: Estrategia Digital

### Tabla
- **Desarrollo**: `com5_estrategia_digital`
- **Supabase**: `com5_destrategiad` ✅

### Columnas

| Campo Desarrollo | Campo Supabase | Tipo Desarrollo | Tipo Supabase | Notas |
|-----------------|----------------|-----------------|---------------|-------|
| `comed_ent_id` | `comded_ent_id` | `int` | `bigint` | PK |
| `compromiso_id` | `compromiso_id` | `int` | `bigint` | ✅ |
| `entidad_id` | `entidad_id` | `uuid` | `bigint` | ⚠️ Tipo diferente |
| `etapa_formulario` | `etapa_formulario` | `int` | `varchar(20)` | ⚠️ Tipo diferente |
| `estado` | `estado` | `varchar(50)` | `varchar(15)` | ✅ |
| `nombre_estrategia` | `nombre_estrategia` | `varchar(500)` | `varchar(150)` | ✅ |
| `anio_inicio` | `periodo_inicio_estrategia` | `int` | `bigint` | ⚠️ Nombre diferente |
| `anio_fin` | `periodo_fin_estrategia` | `int` | `bigint` | ⚠️ Nombre diferente |
| `fecha_aprobacion` | `fecha_aprobacion_estrategia` | `date` | `date` | ⚠️ Nombre diferente |
| `objetivos_estrategicos` | `objetivos_estrategicos` | `varchar(2000)` | `varchar(2000)` | ✅ |
| `lineas_accion` | `lineas_accion` | `varchar(2000)` | `varchar(2000)` | ✅ |
| `alineado_pgd` | `alineado_pgd_estrategia` | `bool` | `bool` | ⚠️ Nombre diferente |
| `estado_implementacion` | `estado_implementacion_estrategia` | `varchar(100)` | `varchar(50)` | ⚠️ Nombre diferente |
| `url_doc` | `ruta_pdf_estrategia` | `text` | `varchar(255)` | ⚠️ Nombre diferente |
| `criterios_evaluados` | `criterios_evaluados` | `text` | `jsonb` | ✅ (recién agregado) |
| `check_privacidad` | `check_privacidad` | `bool` | `bool` | ✅ |
| `check_ddjj` | `check_ddjj` | `bool` | `bool` | ✅ |
| `usuario_registra` | `usuario_registra` | `uuid` | `bigint` | ⚠️ Tipo diferente |
| `created_at` | `created_at` | `timestamp` | `timestamp` | ✅ |
| `updated_at` | ❌ NO EXISTE | `timestamp` | - | ⚠️ Falta en Supabase |
| ❌ NO EXISTE | `estado_PCM` | - | `varchar(50)` | ⚠️ Falta en Desarrollo |
| ❌ NO EXISTE | `observaciones_PCM` | - | `varchar(500)` | ⚠️ Falta en Desarrollo |
| ❌ NO EXISTE | `fec_registro` | - | `date` | ⚠️ Falta en Desarrollo |
| ❌ NO EXISTE | `activo` | - | `bool` | ⚠️ Falta en Desarrollo |

---

## Problemas Críticos a Resolver

### 1. Tipos de Dato Incompatibles
- **`entidad_id`**: UUID en desarrollo vs BIGINT en Supabase
- **`usuario_registra`**: UUID en desarrollo vs BIGINT en Supabase
- **`etapa_formulario`**: INT en desarrollo vs VARCHAR en Supabase

### 2. Nombres de Columnas Diferentes
- Desarrollo usa nombres cortos, Supabase usa sufijos descriptivos
- Ejemplos: `anio_inicio` vs `anio_inicio_pei`, `url_doc` vs `ruta_pdf_estrategia`

### 3. Campos Faltantes en Supabase
- `updated_at` - Timestamp de última actualización

### 4. Campos Faltantes en Desarrollo
- `estado_PCM` - Estado de validación PCM
- `observaciones_PCM` - Observaciones de PCM
- `fec_registro` - Fecha de registro
- `activo` - Flag de registro activo

---

## Soluciones Propuestas

### Opción 1: Actualizar Código Backend (Recomendado)
Modificar entidades, handlers y configuraciones de EF Core para usar el schema de Supabase.

**Pros**: Compatible con producción inmediatamente
**Contras**: Requiere cambios en múltiples archivos

### Opción 2: Crear Vistas en Supabase
Crear vistas SQL que expongan el schema esperado por el desarrollo.

**Pros**: No requiere cambios en código
**Contras**: Mantener dos layers de abstracción

### Opción 3: Usar Mapeo Dinámico
Configurar EF Core para mapear dinámicamente según el entorno.

**Pros**: Flexible para dev/prod
**Contras**: Más complejo de mantener
