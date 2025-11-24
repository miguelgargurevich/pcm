# Migración: CriteriosEvaluados centralizado en cumplimiento_normativo

**Fecha**: 24 de noviembre de 2025  
**Objetivo**: Mover el campo `criterios_evaluados` de las tablas específicas de cada compromiso a la tabla genérica `cumplimiento_normativo`

## ✅ Cambios Completados

### 1. Base de Datos

#### Script de Migración: `db/migration_move_criterios_to_cumplimiento.sql`

- ✅ Asegurado que `criterios_evaluados` (JSONB) existe en `cumplimiento_normativo`
- ✅ Eliminado `criterios_evaluados` de las siguientes tablas:
  - `com1_liderg_td`
  - `com2_consejo_gtd`
  - `com4_tdpei`
  - `com5_destrategiad`
  - `com6_mpgobpe`
  - `com7_imeplemp`
  - `com8_pubtupa`
  - `com9_mgesdoc`
  - `com10_datab`

#### Ejecución
- ✅ Migración ejecutada en **Local** (plataforma_cumplimiento_digital)
- ✅ Migración ejecutada en **Supabase** (producción)

### 2. Backend - Entidades (Domain Layer)

Eliminado el campo `CriteriosEvaluados` de todas las entidades de compromisos específicos:

- ✅ `Com2CGTD.cs`
- ✅ `Com4PEI.cs`
- ✅ `Com5EstrategiaDigital.cs`
- ✅ `Com6MigracionGobPe.cs`
- ✅ `Com7ImplementacionMPD.cs`
- ✅ `Com8PublicacionTUPA.cs`
- ✅ `Com9ModeloGestionDocumental.cs`
- ✅ `Com10DatosAbiertos.cs`

✅ El campo **permanece** en `CumplimientoNormativo.cs` con la anotación correcta:
```csharp
[Column("criterios_evaluados", TypeName = "jsonb")]
public string? CriteriosEvaluados { get; set; }
```

### 3. Backend - Commands y Responses

Eliminado `CriteriosEvaluados` de todos los Commands/Responses de compromisos específicos:

- ✅ `CreateCom1LiderGTDCommand.cs` y `Com1LiderGTDResponse`
- ✅ `UpdateCom1LiderGTDCommand.cs`
- ✅ `CreateCom2CGTDCommand.cs` y `Com2CGTDResponse`
- ✅ `UpdateCom2CGTDCommand.cs`
- ✅ `CreateCom4PEICommand.cs` y `Com4PEIResponse`
- ✅ `UpdateCom4PEICommand.cs`
- ✅ `CreateCom5EstrategiaDigitalCommand.cs`
- ✅ `UpdateCom5EstrategiaDigitalCommand.cs`
- ✅ `CreateCom6MigracionGobPeCommand.cs`
- ✅ `UpdateCom6MigracionGobPeCommand.cs`
- ✅ `CreateCom7ImplementacionMPDCommand.cs`
- ✅ `UpdateCom7ImplementacionMPDCommand.cs`
- ✅ `CreateCom8PublicacionTUPACommand.cs`
- ✅ `UpdateCom8PublicacionTUPACommand.cs`
- ✅ `CreateCom9ModeloGestionDocumentalCommand.cs`
- ✅ `UpdateCom9ModeloGestionDocumentalCommand.cs`
- ✅ `CreateCom10DatosAbiertosCommand.cs`
- ✅ `UpdateCom10DatosAbiertosCommand.cs`

✅ El campo **permanece** en:
- `CreateCumplimientoCommand.cs`
- `UpdateCumplimientoCommand.cs`
- `CumplimientoResponseDto.cs`

### 4. Backend - Handlers

✅ Eliminadas todas las referencias a `CriteriosEvaluados` de los handlers de compromisos específicos (Create, Update, Get)

✅ El campo se maneja **únicamente** en:
- `CreateCumplimientoHandler.cs`
- `UpdateCumplimientoHandler.cs`
- `GetCumplimientoByIdHandler.cs`

### 5. Backend - DbContext

✅ Eliminado el mapeo de `criterios_evaluados` de las entidades de compromisos específicos en `PCMDbContext.cs`

✅ Agregado/Verificado el mapeo correcto en `CumplimientoNormativo`:
```csharp
entity.Property(e => e.CriteriosEvaluados)
    .HasColumnName("criterios_evaluados")
    .HasColumnType("jsonb");
```

### 6. Frontend

✅ Eliminadas las líneas que enviaban `criteriosEvaluados` a los endpoints específicos de compromisos en `CumplimientoNormativoDetalle.jsx`:
- Eliminado del payload de `com4PEIService`
- Eliminado del payload de `com5EstrategiaDigitalService`
- Eliminado del payload de `com6MigracionGobPeService`
- Eliminado del payload de `com7ImplementacionMPDService`
- Eliminado del payload de `com8PublicacionTUPAService`
- Eliminado del payload de `com9ModeloGestionDocumentalService`
- Eliminado del payload de `com10DatosAbiertosService`

✅ El campo **YA se estaba enviando** correctamente a `cumplimientoService.create/update`:
```javascript
...(pasoActual === 2 && formData.criteriosEvaluados && formData.criteriosEvaluados.length > 0 && { 
  criteriosEvaluados: JSON.stringify(formData.criteriosEvaluados) 
}),
```

✅ El frontend **YA estaba leyendo** correctamente de `cumplimientoData.criteriosEvaluados`

## 🎯 Resultado

### Antes
- Cada tabla de compromiso (com1, com2, com4, com5, etc.) tenía su propia columna `criterios_evaluados`
- Duplicación de datos y lógica
- Difícil de mantener

### Después
- ✅ Un único campo `criterios_evaluados` en `cumplimiento_normativo`
- ✅ Centralización de datos dinámicos del paso 2
- ✅ Más fácil de mantener y extender
- ✅ Consistencia en todos los compromisos

## 📊 Impacto

### Sin Impacto en Funcionalidad
- Los usuarios no verán ningún cambio en la interfaz
- Los criterios se siguen guardando y mostrando igual
- Compatible con datos existentes

### Mejoras Arquitectónicas
- Código más limpio y mantenible
- Mejor separación de responsabilidades
- Preparado para futuros compromisos

## 🔍 Verificación

Para verificar que todo funciona correctamente:

1. **Base de Datos**: Ejecutar query de verificación
```sql
-- Verificar que cumplimiento_normativo tiene la columna
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'cumplimiento_normativo' 
AND column_name = 'criterios_evaluados';

-- Verificar que las tablas comX NO tienen la columna
SELECT table_name 
FROM information_schema.columns 
WHERE column_name = 'criterios_evaluados' 
AND table_name LIKE 'com%';
```

2. **Backend**: Compilar sin errores
```bash
cd backend
dotnet build
```

3. **Frontend**: Probar flujo completo
- Crear nuevo cumplimiento
- Llenar paso 1 (datos generales)
- Llenar paso 2 (criterios) → Debe guardarse en cumplimiento_normativo
- Verificar que los criterios se cargan correctamente al volver

## 📝 Notas Técnicas

- El campo es de tipo JSONB en PostgreSQL
- Se almacena como string JSON serializado en el backend
- El frontend lo maneja como array de objetos: `[{criterioId: number, cumple: boolean}]`
- Compatible con la estructura existente de `criterio_evaluacion` (catálogo)
