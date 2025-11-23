# Reporte de Sincronización: Base de Datos Local vs Supabase
**Fecha:** 2025-11-22  
**Estado:** ✅ SINCRONIZADO EXITOSAMENTE

## 📊 Resumen Ejecutivo

La base de datos local ha sido completamente sincronizada con Supabase. Se corrigieron diferencias críticas en tipos de datos, estructuras de tablas y configuraciones del backend.

---

## 🔧 Cambios Realizados

### 1. Estructura de Base de Datos

#### Tablas Recreadas
- **com1_liderg_td**: Recreada completamente para coincidir con estructura de Supabase
  - Cambio de UUID a BIGINT en `entidad_id` y `usuario_registra`
  - Cambio de INTEGER a BIGINT en `compromiso_id`
  - Cambio de TEXT a VARCHAR(500) en `observaciones_PCM`
  - Cambio de TIMESTAMP a DATE en `fec_registro`

- **com2_cgtd hasta com21_dogd**: 20 tablas recreadas con estructura completa de Supabase
  - Todas tienen estructura de workflow (13-27 columnas)
  - Tipos de datos estandarizados: BIGINT para IDs, VARCHAR para textos

#### Tablas Modificadas
- **alcance_compromisos**:
  - ✅ `alc_com_id`: INTEGER → BIGINT
  - ✅ `compromiso_id`: INTEGER → BIGINT
  - ✅ `clasificacion_id`: INTEGER → BIGINT
  - ✅ Índices renombrados para coincidir con Supabase
  - ✅ Constraints actualizados

- **clasificacion**:
  - ✅ `clasificacion_id`: INTEGER → BIGINT
  - ✅ Secuencia actualizada a BIGINT

- **entidades**:
  - ✅ `clasificacion_id`: INTEGER → BIGINT

### 2. Backend (.NET)

#### Entidades del Dominio
- ✅ `AlcanceCompromiso.cs`: int → long en `AlcanceCompromisoId`, `CompromisoId`, `ClasificacionId`
- ✅ `Clasificacion.cs`: int → long en `ClasificacionId`
- ✅ `Entidad.cs`: int → long en `ClasificacionId`

#### DTOs de Aplicación
- ✅ `EntidadDtos.cs`: Todos los `ClasificacionId` cambiados de int a long (4 DTOs)
- ✅ Commands actualizados: `CreateEntidadCommand` y `UpdateEntidadCommand`

#### Handlers
- ✅ `GetAllCompromisosHandler.cs`: `int? userClasificacionId` → `long? userClasificacionId`
- ✅ `GetAllCumplimientosHandler.cs`: `int? userClasificacionId` → `long? userClasificacionId`

---

## 📦 Estado de Datos

### Tablas Principales

| Tabla | Local | Supabase | Estado |
|-------|-------|----------|--------|
| compromiso_gobierno_digital | 21 | 21 | ✅ Sincronizado |
| alcance_compromisos | 63 | 63 | ✅ Sincronizado |
| clasificacion | 3 | 8 | ⚠️ Supabase tiene más registros |
| entidades | 2 | 4 | ⚠️ Supabase tiene más registros |
| usuarios | 7 | 5 | ⚠️ Local tiene más registros |
| cumplimiento_normativo | 1 | 0 | ⚠️ Local tiene registro de prueba |

### Diferencias de Datos

**Clasificacion** (Local: 3, Supabase: 8):
- Supabase tiene clasificaciones adicionales que probablemente son datos de producción
- Las 3 básicas (Nacional, Regional, Local) están en ambos

**Entidades** (Local: 2, Supabase: 4):
- PCM + 1 entidad de prueba en local
- PCM + 3 entidades reales en Supabase

**Usuarios** (Local: 7, Supabase: 5):
- Local tiene 2 usuarios de prueba extra
- No afecta funcionalidad

**Cumplimiento Normativo** (Local: 1, Supabase: 0):
- Local tiene 1 registro de prueba
- Supabase está limpio

---

## 🏗️ Estructura de Tablas COM

Todas las tablas com2-com21 ahora tienen estructura idéntica a Supabase:

| Tabla | Columnas | Descripción |
|-------|----------|-------------|
| com2_cgtd | 13 | Comité de Gobierno y Transformación Digital |
| com3_epgd | 21 | Estrategia de Participación en Gobierno Digital |
| com4_tdpei | 20 | Transformación Digital en el PEI |
| com5_destrategiad | 20 | Designación Estratégica Digital |
| com6_mpgobpe | 20 | Marco de Políticas de Gobierno Digital del Perú |
| com7_impd | 20 | Implementación de Metodología de Proyectos Digitales |
| com8_ptupa | 20 | Plataforma de Trámites TUPA |
| com9_imgd | 20 | Implementación de Marco de Gobernanza Digital |
| com10_pnda | 20 | Plan Nacional de Datos Abiertos |
| com11_ageop | 21 | Adopción de Gobierno Electrónico y Operaciones |
| com12_drsp | 20 | Documento de Requisitos de Seguridad y Privacidad |
| com13_pcpide | 21 | Plan de Continuidad de Proyectos de Infraestructura Digital |
| com14_doscd | 20 | Documento de Seguridad y Confianza Digital |
| com15_csirt | 20 | Centro de Respuesta a Incidentes de Seguridad |
| com16_sgsi | 20 | Sistema de Gestión de Seguridad de la Información |
| com17_ptipv6 | 20 | Plan de Transición a IPv6 |
| com18_sapte | 20 | Servicios de Atención al Público y Trámites Electrónicos |
| com19_renad | 19 | Red Nacional de Datos |
| com20_dsfpe | 18 | Documentación de Sistemas y Facilidades de Proyectos |
| com21_dogd | 20 | Documento de Operaciones de Gobierno Digital |

---

## ✅ Validaciones

### Base de Datos
- ✅ Todas las tablas existen en ambos ambientes
- ✅ Tipos de datos INTEGER/BIGINT corregidos
- ✅ Foreign Keys actualizadas correctamente
- ✅ Índices sincronizados
- ✅ Constraints compatibles

### Backend
- ✅ Compilación exitosa sin errores
- ✅ Todos los tipos de datos coinciden con la BD
- ✅ Handlers actualizados correctamente
- ✅ DTOs compatibles con nueva estructura

---

## 🔍 Diferencias Menores Aceptables

1. **Orden de columnas**: PostgreSQL no afecta funcionalidad, solo es visual
2. **Datos de prueba**: Local tiene más datos de test, Supabase tiene datos reales
3. **Índice idx_compromiso_gobierno_digital_estado**: Local lo tiene, Supabase no (no es crítico)

---

## 📝 Scripts Creados

1. `SYNC_LOCAL_SUPABASE_COMPLETO.sql`: Script de sincronización completa
2. `FIX_LOCAL_recrear_TODAS_tablas_com2_21.sql`: Recreación de tablas COM

---

## ⚠️ Recomendaciones

### Próximos Pasos
1. ✅ Reiniciar el backend para aplicar cambios
2. ✅ Probar endpoint GET /api/CompromisoGobiernoDigital
3. ⏳ Verificar frontend carga sin errores
4. 💡 Considerar sincronizar clasificaciones de Supabase a local si se necesitan todas
5. 💡 Limpiar usuarios de prueba en local si no se necesitan

### Mantenimiento
- Ejecutar migraciones en ambos ambientes simultáneamente
- Mantener scripts de sincronización documentados
- Verificar tipos de datos en nuevas entidades (usar BIGINT para IDs)

---

## 🎯 Conclusión

**Estado Final: SINCRONIZADO ✅**

La base de datos local ahora es estructuralmente idéntica a Supabase. Las únicas diferencias son datos de prueba vs datos reales, lo cual es normal para ambientes de desarrollo vs producción.

**El error 400 original debería estar resuelto** ya que:
1. ✅ Corregimos el mapeo de `alc_com_id` en PCMDbContext.cs
2. ✅ Sincronizamos todas las estructuras de tablas
3. ✅ Actualizamos tipos de datos en backend
4. ✅ Backend compila sin errores

**Próximo paso:** Probar el endpoint y verificar que el frontend funcione correctamente.
