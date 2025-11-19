# 🚀 SOLUCIÓN RÁPIDA: Compromisos no cargan

## 🔴 El Problema
El backend muestra este error:
```
❌ column m.updated_at does not exist
```

## ✅ La Solución

Ejecuta **UNO** de estos fixes dependiendo de tu entorno:

---

### 🏠 Para Base de Datos LOCAL

**Opción 1: Script automático (RECOMENDADO)**
```bash
cd "/Users/miguelfernandezgargurevich/Library/Mobile Documents/com~apple~CloudDocs/Personal/Proyectos/repositorios/PCM"

./db/fix_local_completo.sh
```

Te pedirá:
- Host: `localhost` (presiona Enter)
- Puerto: `5432` (presiona Enter)
- Base de datos: `pcm_db` (o el nombre que uses)
- Usuario: `postgres` (o tu usuario)
- Password: (escribe tu password)

**Opción 2: Manual (SQL directo)**
```bash
psql -U postgres -d pcm_db -f db/PRODUCCION_fix_completo_supabase.sql
```

---

### ☁️ Para SUPABASE (Producción)

1. Abre **Supabase Dashboard** → **SQL Editor**
2. Abre el archivo: `db/PRODUCCION_fix_completo_supabase.sql`
3. Copia todo el contenido
4. Pega en SQL Editor
5. Click en **RUN**

---

## 🎯 Qué hace el FIX

1. ✅ Agrega columna `updated_at` a tabla `marco_normativo`
2. ✅ Inserta 4 compromisos base:
   - Designar al Líder de Gobierno Digital
   - Construir el Comité de Gobierno Digital
   - Elaborar Plan de Gobierno Digital
   - Desplegar la Estrategia Digital

---

## 🧪 Verificar que Funcionó

Después de ejecutar el fix:

### 1. Backend (logs)
Busca en la terminal del backend:
```
✅ Ya NO debe aparecer: "column m.updated_at does not exist"
✅ Debe cargar sin errores
```

### 2. Frontend
Recarga: http://localhost:5173
```
✅ Deberías ver una TABLA con 4 compromisos
✅ Cada uno con botón "Registrar"
```

### 3. Test API directo
```bash
curl http://localhost:5164/api/CompromisoGobiernoDigital
```
Debe retornar JSON con 4 compromisos.

---

## 🐛 Si sigue sin funcionar

**Problema: "connection refused"**
- Verifica que el backend esté corriendo en puerto 5164
- Revisa: `backend/PCM.API/Properties/launchSettings.json`

**Problema: "Authorization has been denied"**
- El endpoint requiere autenticación
- Inicia sesión en el frontend primero

**Problema: Otros errores de SQL**
- Verifica que las migraciones previas estén ejecutadas
- Ejecuta: `db/PRODUCCION_cumplimiento_normativo_completo.sql`

---

## 📂 Archivos Relacionados

- `db/fix_local_completo.sh` - Script para local ⭐
- `db/PRODUCCION_fix_completo_supabase.sql` - Script para Supabase ⭐
- `db/FIX_marco_normativo_updated_at.sql` - Solo fix updated_at
- `db/FIX_LOCAL_insertar_compromisos.sql` - Solo insertar compromisos

---

## 🎉 Resultado Final Esperado

**Frontend:**
```
┌─────────────────────────────────────────────────┐
│ Gestión de Cumplimiento Normativo              │
│ Compromisos de Gobierno Digital                │
└─────────────────────────────────────────────────┘

# │ Nombre                            │ Estado        │ Acciones
──┼───────────────────────────────────┼───────────────┼──────────
1 │ Designar al Líder de Gobierno... │ Sin registrar │ [Registrar]
2 │ Construir el Comité de Gobiern...│ Sin registrar │ [Registrar]
3 │ Elaborar Plan de Gobierno Digi...│ Sin registrar │ [Registrar]
4 │ Desplegar la Estrategia Digita...│ Sin registrar │ [Registrar]
```

**Flujo Completo:**
1. Click en "Registrar" → Abre wizard
2. Paso 1: Datos del líder
3. Paso 2: Subir normativa (PDF)
4. Paso 3: Confirmación
5. Guardar → Regresas a tabla
6. Botones cambian a "Ver" y "Modificar"

---

✅ **Todo listo para trabajar!**
