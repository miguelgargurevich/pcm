# Migración de Catálogos - Nivel de Gobierno y Sector

## Descripción
Este script crea las tablas de catálogo `nivel_gobierno` y `sector` con sus datos iniciales, y actualiza las relaciones en la tabla `entidades`.

## Pasos de Ejecución

### 1. Ejecutar el Script SQL

Conéctate a tu base de datos PostgreSQL y ejecuta el script:

```bash
psql -U postgres -d plataforma_cumplimiento_digital -f db/migration_catalogos.sql
```

O desde pgAdmin/DBeaver, abre y ejecuta el archivo `db/migration_catalogos.sql`.

### 2. Crear la Migración en .NET (Opcional)

Si prefieres usar Entity Framework Migrations:

```bash
cd backend/PCM.API
dotnet ef migrations add AddNivelGobiernoAndSectorTables
dotnet ef database update
```

### 3. Verificar la Migración

```sql
-- Verificar que las tablas se crearon
SELECT * FROM nivel_gobierno;
SELECT * FROM sector;

-- Verificar las foreign keys
SELECT constraint_name, table_name 
FROM information_schema.table_constraints 
WHERE constraint_type = 'FOREIGN KEY' 
AND table_name = 'entidades';
```

## Cambios Realizados

### Backend

1. ✅ **Entidades de Dominio Creadas:**
   - `PCM.Domain.Entities.NivelGobierno`
   - `PCM.Domain.Entities.Sector`

2. ✅ **Navigation Properties Agregadas:**
   - `Entidad.NivelGobierno`
   - `Entidad.Sector`

3. ✅ **DbContext Actualizado:**
   - DbSets: `NivelesGobierno`, `Sectores`
   - Configuraciones de entidades con seed data
   - Foreign keys configuradas

4. ✅ **Handler Actualizado:**
   - `GetAllEntidadesHandler` ahora incluye JOINs con `NivelGobierno` y `Sector`
   - Mapeo correcto en el `Select` del DTO

### Base de Datos

1. ✅ **Tabla `nivel_gobierno`:**
   - 3 registros: Nacional, Regional, Local

2. ✅ **Tabla `sector`:**
   - 20 sectores del gobierno peruano (PCM, MINEDU, MINSA, etc.)

3. ✅ **Foreign Keys:**
   - `fk_entidades_nivel_gobierno`
   - `fk_entidades_sector`

## Resultados Esperados

Después de ejecutar la migración, el listado de entidades mostrará:
- **Nivel de Gobierno**: Nacional/Regional/Local (en lugar de IDs hardcoded)
- **Sector**: Nombre completo del sector (en lugar de "Sector 1", "Sector 2")

## Rollback (Si es necesario)

```sql
-- Eliminar foreign keys
ALTER TABLE entidades DROP CONSTRAINT IF EXISTS fk_entidades_nivel_gobierno;
ALTER TABLE entidades DROP CONSTRAINT IF EXISTS fk_entidades_sector;

-- Eliminar tablas
DROP TABLE IF EXISTS sector;
DROP TABLE IF EXISTS nivel_gobierno;
```
