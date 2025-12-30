# 🔄 Migración de PDFs desde Supabase a Storage Local

## ⚠️ Si tienes PDFs ya subidos en Supabase

Si ya hay documentos en Supabase Storage, necesitas migrarlos al nuevo sistema.

## 📊 Verificar si hay PDFs en Supabase

```sql
-- Conectar a tu PostgreSQL local (puerto 5433)
-- Buscar URLs de Supabase en la base de datos

SELECT 
    'com2_cgtd' as tabla,
    COUNT(*) as cantidad
FROM com2_cgtd 
WHERE ruta_pdf_normativa LIKE '%supabase%'

UNION ALL

SELECT 
    'com4_tdpei' as tabla,
    COUNT(*) as cantidad
FROM com4_tdpei 
WHERE ruta_pdf_pei LIKE '%supabase%' OR ruta_pdf_normativa LIKE '%supabase%'

-- ... repetir para cada tabla con PDFs
```

## 🛠️ Opción 1: Script de Migración Manual

### 1. Descargar PDFs de Supabase

```bash
#!/bin/bash
# migrate-pdfs.sh

# Crear directorio temporal
mkdir -p /tmp/pcm-pdfs

# Descargar PDFs de Supabase (si tienes acceso)
# Ejemplo con curl:
curl "https://amzwfwfhllwhjffkqxhn.supabase.co/storage/v1/object/public/cumplimiento-documentos/archivo.pdf" \
  -o "/tmp/pcm-pdfs/archivo.pdf"
```

### 2. Subir al nuevo storage

```bash
# Copiar al volumen Docker
docker cp /tmp/pcm-pdfs/. pcm-backend-local:/app/storage/documentos/

# O en producción:
scp -r /tmp/pcm-pdfs/* servidor:/var/www/pcm/storage/documentos/
```

### 3. Actualizar URLs en la base de datos

```sql
-- Actualizar URLs de Supabase a rutas locales
-- EJEMPLO para com2_cgtd:

UPDATE com2_cgtd
SET ruta_pdf_normativa = REPLACE(
    ruta_pdf_normativa,
    'https://amzwfwfhllwhjffkqxhn.supabase.co/storage/v1/object/public/cumplimiento-documentos/',
    '/api/files/documentos/'
)
WHERE ruta_pdf_normativa LIKE '%supabase%';

-- Repetir para todas las tablas con PDFs
```

## 🛠️ Opción 2: API de Migración (Recomendado)

### Crear endpoint temporal de migración

```csharp
// Agregar a FilesController.cs temporalmente

[HttpPost("migrate-from-supabase")]
[Authorize(Roles = "Administrador")]
public async Task<IActionResult> MigrateFromSupabase()
{
    // 1. Buscar todas las URLs de Supabase en la BD
    // 2. Descargar cada archivo
    // 3. Guardar en storage local
    // 4. Actualizar URL en la BD
    
    return Ok(new { message = "Migración completada" });
}
```

## 📋 Tablas con PDFs a revisar

| Tabla | Campos con PDFs |
|-------|----------------|
| `com2_cgtd` | `ruta_pdf_normativa` |
| `com4_tdpei` | `ruta_pdf_pei`, `ruta_pdf_normativa` |
| `com5_destrategiad` | `ruta_pdf_normativa` |
| `com6_gobpe` | `ruta_pdf_normativa`, `ruta_pdf_gobpe` |
| `com7_mpd` | `ruta_pdf_normativa`, `ruta_pdf_mpd` |
| `com8_tupa` | `ruta_pdf_normativa`, `ruta_pdf_tupa` |
| `com9_imgd` | `ruta_pdf_normativa`, `ruta_pdf_mgd` |
| `com10_pnda` | `ruta_pdf_normativa`, `ruta_pdf_pnda` |
| `com11_ageop` | `archivo_plan`, `ruta_pdf_normativa` |
| `com12_drsp` | `archivo_documento`, `ruta_pdf_normativa` |
| `com13_pcpide` | `archivo_plan`, `ruta_pdf_normativa` |
| `com14_doscd` | `archivo_documento`, `ruta_pdf_normativa` |
| `com15_csirt` | `ruta_pdf_normativa` |
| `com16_sgsi` | `ruta_pdf_normativa` |
| `com17_ptipv6` | `ruta_pdf_ptipv6`, `ruta_pdf_normativa` |
| `com18_sapte` | `ruta_pdf_apte`, `ruta_pdf_normativa` |
| `com19_enad` | `ruta_pdf_enad`, `ruta_pdf_normativa` |
| `com20_dsfpe` | `ruta_pdf_dsfp`, `ruta_pdf_normativa` |
| `com21_dogd` | `ruta_pdf_ogd`, `ruta_pdf_normativa` |
| `cumplimiento_normativo` | `documento_url` |

## ✅ Si NO tienes PDFs en Supabase aún

**¡Perfecto!** No necesitas migrar nada. Todo funcionará automáticamente:
- Nuevos PDFs se guardarán en storage local
- URLs serán `/api/files/documentos/...`
- Todo listo para usar

## 🔍 Verificar después de migración

```bash
# Ver archivos en el volumen Docker
docker exec pcm-backend-local ls -lah /app/storage/documentos/

# Probar descarga
curl -H "Authorization: Bearer TU_JWT_TOKEN" \
  http://localhost:5164/api/files/documentos/archivo.pdf
```

## ⚠️ IMPORTANTE

- **NO eliminar** archivos de Supabase hasta confirmar que la migración funcionó
- **Hacer backup** antes de actualizar URLs en la BD
- **Probar** descargas antes de ir a producción
