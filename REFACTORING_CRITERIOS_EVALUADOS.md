# Refactorización: Centralización de CriteriosEvaluados
**Fecha:** 24 de noviembre de 2025

## Resumen
Se movió el campo `CriteriosEvaluados` desde las tablas específicas de cada compromiso (com1, com2, com4-com10) a la tabla genérica `cumplimiento_normativo`, ya que los criterios evaluados del paso 2 son dinámicos y comunes para todos los compromisos.

## Cambios Realizados

### 1. Base de Datos
#### ✅ LOCAL (localhost:5433)
- Ejecutada migración: `migration_move_criterios_to_cumplimiento.sql`
- Ejecutada migración: `migration_sync_com1_rutaPDF_normativa.sql`

#### ✅ PRODUCCIÓN (Supabase)
- Ejecutada migración: `migration_move_criterios_to_cumplimiento.sql`
- Ejecutada migración: `migration_sync_com1_rutaPDF_normativa.sql`

**Cambios en BD:**
- ✅ Campo `criterios_evaluados` agregado a `cumplimiento_normativo`
- ✅ Campo `criterios_evaluados` eliminado de: com1_liderg_td, com2_consejo_gtd, com4_tdpei, com5_destrategiad, com6_mpgobpe, com7_imeplemp, com8_pubtupa, com9_mgesdoc, com10_datab
- ✅ Campo `ruta_pdf_normativa` agregado a `com1_liderg_td` (sincronización con producción)

### 2. Backend - Entidades (Domain)
**Archivos modificados:**
- `Com1LiderGTD.cs` - Agregado campo `RutaPdfNormativa`
- `Com2CGTD.cs` - Eliminado campo `CriteriosEvaluados`
- `Com4PEI.cs` - Eliminado campo `CriteriosEvaluados`
- `Com5EstrategiaDigital.cs` - Eliminado campo `CriteriosEvaluados`
- `Com6MigracionGobPe.cs` - Eliminado campo `CriteriosEvaluados`
- `Com7ImplementacionMPD.cs` - Eliminado campo `CriteriosEvaluados`
- `Com8PublicacionTUPA.cs` - Eliminado campo `CriteriosEvaluados`
- `Com9ModeloGestionDocumental.cs` - Eliminado campo `CriteriosEvaluados`
- `Com10DatosAbiertos.cs` - Eliminado campo `CriteriosEvaluados`
- `CumplimientoNormativo.cs` - Campo `CriteriosEvaluados` ya existía (confirmado)

### 3. Backend - Commands (Application)
**Eliminado `CriteriosEvaluados` de todos los Commands:**
- Com1: CreateCom1LiderGTDCommand, UpdateCom1LiderGTDCommand
- Com2: CreateCom2CGTDCommand, UpdateCom2CGTDCommand
- Com4: CreateCom4PEICommand, UpdateCom4PEICommand
- Com5: CreateCom5EstrategiaDigitalCommand, UpdateCom5EstrategiaDigitalCommand
- Com6: CreateCom6MigracionGobPeCommand, UpdateCom6MigracionGobPeCommand
- Com7: CreateCom7ImplementacionMPDCommand, UpdateCom7ImplementacionMPDCommand
- Com8: CreateCom8PublicacionTUPACommand, UpdateCom8PublicacionTUPACommand
- Com9: CreateCom9ModeloGestionDocumentalCommand, UpdateCom9ModeloGestionDocumentalCommand
- Com10: CreateCom10DatosAbiertosCommand, UpdateCom10DatosAbiertosCommand

### 4. Backend - Handlers (Infrastructure)
**Eliminadas todas las referencias a `CriteriosEvaluados`** de los handlers de compromisos específicos mediante script automatizado.

### 5. Backend - DbContext (Infrastructure)
- ✅ Eliminado mapeo de `criterios_evaluados` de Com1LiderGTD y Com2CGTD
- ✅ Agregado mapeo de `criterios_evaluados` a CumplimientoNormativo
- ✅ Agregado mapeo de `etapa_formulario` a CumplimientoNormativo
- ✅ Agregado mapeo de `ruta_pdf_normativa` a Com1LiderGTD

### 6. Frontend
**Archivo:** `CumplimientoNormativoDetalle.jsx`
- ✅ Eliminadas líneas que enviaban `criteriosEvaluados` a los servicios específicos (com4PEIService, com5Service, etc.)
- ✅ Mantenido el envío de `criteriosEvaluados` solo a `cumplimientoService` (tabla genérica)
- ✅ El frontend ya leía correctamente `criteriosEvaluados` desde `cumplimientoData`

## Verificación
### Backend
```bash
cd backend && dotnet build
```
✅ Sin errores de compilación

### Base de Datos Local
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'cumplimiento_normativo' AND column_name = 'criterios_evaluados';
```
✅ Campo existe en cumplimiento_normativo

```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name IN ('com1_liderg_td', 'com2_consejo_gtd', 'com4_tdpei', 'com5_destrategiad', 
                     'com6_mpgobpe', 'com7_imeplemp', 'com8_pubtupa', 'com9_mgesdoc', 'com10_datab') 
AND column_name = 'criterios_evaluados';
```
✅ Campo NO existe en ninguna tabla específica

### Base de Datos Producción (Supabase)
✅ Mismas verificaciones ejecutadas y confirmadas

## Beneficios
1. **Centralización**: Los criterios evaluados ahora están en un solo lugar
2. **Mantenibilidad**: Más fácil agregar o modificar criterios sin tocar múltiples tablas
3. **Consistencia**: Un solo punto de verdad para los criterios del paso 2
4. **Flexibilidad**: Los criterios dinámicos se manejan de forma genérica para todos los compromisos

## Próximos Pasos
- ✅ Código listo para commit
- ⏳ Probar el flujo completo en desarrollo
- ⏳ Validar que el guardado y lectura de criterios funcione correctamente
- ⏳ Verificar que los reportes y consultas funcionen con la nueva estructura
