# 🔍 DEBUG: Compromisos no aparecen en el frontend

## Estado Actual
✅ **Frontend:** Código limpio, sin errores de compilación
✅ **Tabla:** Diseñada para mostrar compromisos con botones de acción
⚠️ **Problema:** Los 4 compromisos base no se visualizan en la tabla

---

## 📋 Checklist de Verificación

### 1️⃣ Verificar Backend (C#)
```bash
# Verificar que el backend esté corriendo
# URL: https://tu-backend.render.com/api/CompromisoGobiernoDigital
```

**Respuesta esperada:**
```json
{
  "isSuccess": true,
  "data": [
    {
      "compromisoId": 1,
      "nombreCompromiso": "Designar al Líder de Gobierno y Transformación Digital",
      "descripcion": "...",
      "orden": 1,
      "alcances": ["Nacional", "Regional", "Local"],
      "estado": 1,
      "activo": true
    },
    // ... 3 más
  ]
}
```

### 2️⃣ Verificar Base de Datos (Supabase)
Ejecutar en **SQL Editor de Supabase**:

```sql
-- Ejecutar archivo: db/DEBUG_compromisos_y_api.sql
-- O copiar query:
SELECT 
    compromiso_id,
    nombre_compromiso,
    orden,
    activo
FROM compromiso_gobierno_digital
ORDER BY orden;
```

**Resultado esperado:** 4 filas con compromiso_id 1, 2, 3, 4

### 3️⃣ Si NO hay compromisos en Supabase
Ejecutar el INSERT que está comentado en `DEBUG_compromisos_y_api.sql`:

```sql
INSERT INTO compromiso_gobierno_digital (
    compromiso_id,
    nombre_compromiso,
    descripcion,
    orden,
    alcances,
    estado,
    activo,
    created_at
) VALUES
(1, 'Designar al Líder de Gobierno y Transformación Digital', 
 'La entidad deberá designar mediante Resolución...', 
 1, ARRAY['Nacional', 'Regional', 'Local'], 1, true, CURRENT_TIMESTAMP),
(2, 'Construir el Comité de Gobierno y Transformación Digital', 
 'La entidad deberá conformar el Comité...', 
 2, ARRAY['Nacional', 'Regional', 'Local'], 1, true, CURRENT_TIMESTAMP),
(3, 'Elaborar Plan de Gobierno Digital', 
 'La entidad deberá elaborar su Plan...', 
 3, ARRAY['Nacional', 'Regional', 'Local'], 1, true, CURRENT_TIMESTAMP),
(4, 'Desplegar la Estrategia Digital', 
 'La entidad deberá implementar y desplegar...', 
 4, ARRAY['Nacional', 'Regional', 'Local'], 1, true, CURRENT_TIMESTAMP)
ON CONFLICT (compromiso_id) DO NOTHING;
```

### 4️⃣ Verificar Frontend (Consola del Navegador)
Abrir DevTools → Console:

```javascript
// Ver qué está recibiendo el frontend
// Buscar en Console:
"Error al cargar datos:"
// O buscar en Network tab:
// Request: GET /api/CompromisoGobiernoDigital
```

### 5️⃣ Verificar Variables de Entorno
Archivo: `frontend/.env` o `frontend/.env.production`

```bash
VITE_API_URL=https://tu-backend.render.com/api
```

---

## 🐛 Posibles Causas

| # | Causa | Solución |
|---|-------|----------|
| 1 | Compromisos no insertados en Supabase | Ejecutar INSERT del paso 3️⃣ |
| 2 | Backend no está levantado | Verificar Render dashboard |
| 3 | URL del backend incorrecta | Revisar VITE_API_URL |
| 4 | Error CORS | Verificar AllowOrigins en Program.cs |
| 5 | Error en el endpoint | Revisar CompromisoGobiernoDigitalController |

---

## 📝 Logs a Revisar

### Backend (Render)
```
[INFO] GET /api/CompromisoGobiernoDigital
[INFO] Query: SELECT * FROM compromiso_gobierno_digital WHERE activo = true
[INFO] Returned: 4 records
```

### Frontend (Browser Console)
```javascript
// Logs esperados:
console.log('Compromisos response:', compromisosResponse);
// Debe mostrar: { isSuccess: true, data: [4 items] }
```

---

## ✅ Test Rápido

Desde el navegador (DevTools → Console):

```javascript
// Test directo del API
fetch('https://tu-backend.render.com/api/CompromisoGobiernoDigital')
  .then(r => r.json())
  .then(d => console.log('Compromisos:', d));
```

**Respuesta exitosa:** Array con 4 compromisos
**Respuesta fallida:** Error 404, 500, o CORS

---

## 🎯 Próximo Paso

Una vez que los compromisos aparezcan en la tabla:

1. ✅ Verás 4 filas con botón "Registrar"
2. Click en "Registrar" → Abre wizard con compromiso pre-seleccionado
3. Completa los 3 pasos → Guarda
4. Regresa a tabla → Botones cambian a "Ver" y "Modificar"

---

## 📂 Archivos de Referencia

- **Frontend:** `frontend/src/pages/CumplimientoNormativo.jsx` ✅
- **Service:** `frontend/src/services/compromisosService.js` ✅
- **Backend:** `PCM.API/Controllers/CompromisoGobiernoDigitalController.cs`
- **Migration:** `db/PRODUCCION_cumplimiento_normativo_completo.sql`
- **Debug:** `db/DEBUG_compromisos_y_api.sql` ⭐
