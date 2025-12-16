# Análisis de Integración - Compromiso 3 (Com3_EPGD)

## Fecha: 15 de Diciembre 2025

---

## 1. ESTRUCTURA DE LA TABLA EN BD (Supabase)

### Tabla Principal: `com3_epgd`

```sql
CREATE TABLE com3_epgd (
    -- Campos comunes (header)
    comepgd_ent_id BIGINT PRIMARY KEY,
    compromiso_id BIGINT NOT NULL,
    entidad_id UUID NOT NULL,  -- ⚠️ NOTA: BD usa UUID, no BIGINT
    etapa_formulario VARCHAR(20) NOT NULL,
    estado VARCHAR(15) NOT NULL,
    check_privacidad BOOLEAN NOT NULL,
    check_ddjj BOOLEAN NOT NULL,
    estado_PCM VARCHAR(50) NOT NULL,
    observaciones_PCM VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    fec_registro DATE NOT NULL,
    usuario_registra UUID NOT NULL,  -- ⚠️ NOTA: BD usa UUID, no BIGINT
    activo BOOLEAN NOT NULL,
    
    -- Campos específicos del Compromiso 3
    fecha_reporte DATE NOT NULL,
    sede VARCHAR(100) NOT NULL,
    observaciones VARCHAR(255) NOT NULL,
    ubicacion_area_ti VARCHAR(255) NOT NULL,
    organigrama_ti VARCHAR(255) NOT NULL,        -- URL del PDF del organigrama
    dependencia_area_ti VARCHAR(100) NOT NULL,
    costo_anual_ti NUMERIC(12,2) NOT NULL,
    existe_comision_gd_ti BOOLEAN NOT NULL
    -- ❌ FALTA: ruta_pdf_normativa (nullable)
);
```

### Tablas Relacionadas (Detalle)

#### 1. `personal_ti`
```sql
CREATE TABLE personal_ti (
    personal_id BIGINT PRIMARY KEY,
    com_entidad_id BIGINT NOT NULL,  -- FK a com3_epgd.comepgd_ent_id
    nombre_persona VARCHAR(100) NOT NULL,
    dni VARCHAR(12) NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    rol VARCHAR(50) NOT NULL,
    especialidad VARCHAR(80) NOT NULL,
    grado_instruccion VARCHAR(50) NOT NULL,
    certificacion VARCHAR(80) NOT NULL,
    acreditadora VARCHAR(80) NOT NULL,
    codigo_certificacion VARCHAR(50) NOT NULL,
    colegiatura VARCHAR(20) NOT NULL,
    email_personal VARCHAR(100) NOT NULL,
    telefono VARCHAR(30) NOT NULL
);
```

#### 2. `inventario_software`
```sql
CREATE TABLE inventario_software (
    inv_soft_id BIGINT PRIMARY KEY,
    com_entidad_id BIGINT NOT NULL,
    cod_producto VARCHAR(50) NOT NULL,
    nombre_producto VARCHAR(150) NOT NULL,
    version VARCHAR(50) NOT NULL,
    cantidad_instalaciones BIGINT NOT NULL,
    tipo_software VARCHAR(50) NOT NULL,
    cantidad_licencias BIGINT NOT NULL,
    exceso_deficiencia BIGINT NOT NULL,
    costo_licencias NUMERIC(12,2) NOT NULL
);
```

#### 3. `inventario_sistemas_info`
```sql
CREATE TABLE inventario_sistemas_info (
    inv_si_id BIGINT PRIMARY KEY,
    com_entidad_id BIGINT NOT NULL,
    codigo VARCHAR(20) NOT NULL,
    nombre_sistema VARCHAR(150) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    tipo_sistema VARCHAR(50) NOT NULL,
    lenguaje_programacion VARCHAR(50) NOT NULL,
    base_datos VARCHAR(50) NOT NULL,
    plataforma VARCHAR(10) NOT NULL
);
```

#### 4. `inventario_red`
```sql
CREATE TABLE inventario_red (
    inv_red_id BIGINT PRIMARY KEY,
    com_entidad_id BIGINT NOT NULL,
    tipo_equipo VARCHAR(80) NOT NULL,
    cantidad BIGINT NOT NULL,
    puertos_operativos BIGINT NOT NULL,
    puertos_inoperativos BIGINT NOT NULL,
    total_puertos BIGINT NOT NULL,
    costo_mantenimiento_anual NUMERIC(12,2) NOT NULL,
    observaciones VARCHAR(255) NOT NULL
);
```

#### 5. `inventario_servidores`
```sql
CREATE TABLE inventario_servidores (
    inv_srv_id BIGINT PRIMARY KEY,
    com_entidad_id BIGINT NOT NULL,
    nombre_equipo VARCHAR(100) NOT NULL,
    tipo_equipo VARCHAR(10) NOT NULL,
    estado VARCHAR(30) NOT NULL,
    capa VARCHAR(30) NOT NULL,
    propiedad VARCHAR(20) NOT NULL,
    montaje VARCHAR(20) NOT NULL,
    marca_cpu VARCHAR(50) NOT NULL,
    modelo_cpu VARCHAR(50) NOT NULL,
    velocidad_ghz NUMERIC(5,2) NOT NULL,
    nucleos BIGINT NOT NULL,
    memoria_gb BIGINT NOT NULL,
    marca_memoria VARCHAR(50) NOT NULL,
    modelo_memoria VARCHAR(50) NOT NULL,
    cantidad_memoria BIGINT NOT NULL,
    costo_mantenimiento_anual NUMERIC(12,2) NOT NULL,
    observaciones VARCHAR(255) NOT NULL
);
```

#### 6. `seguridad_info`
```sql
CREATE TABLE seguridad_info (
    seginfo_id BIGINT PRIMARY KEY,
    com_entidad_id BIGINT NOT NULL,
    plan_sgsi BOOLEAN NOT NULL,
    comite_seguridad BOOLEAN NOT NULL,
    oficial_seguridad_en_organigrama BOOLEAN NOT NULL,
    politica_seguridad BOOLEAN NOT NULL,
    inventario_activos BOOLEAN NOT NULL,
    analisis_riesgos BOOLEAN NOT NULL,
    metodologia_riesgos BOOLEAN NOT NULL,
    plan_continuidad BOOLEAN NOT NULL,
    programa_auditorias BOOLEAN NOT NULL,
    informes_direccion BOOLEAN NOT NULL,
    certificacion_iso27001 BOOLEAN NOT NULL,
    observaciones VARCHAR(255) NOT NULL
);
```

#### 7. `capacitaciones_seginfo`
```sql
CREATE TABLE capacitaciones_seginfo (
    capseg_id BIGINT PRIMARY KEY,
    com_entidad_id BIGINT NOT NULL,
    curso VARCHAR(100) NOT NULL,
    cantidad_personas BIGINT NOT NULL
);
```

#### 8. `objetivos_entidades`
```sql
CREATE TABLE objetivos_entidades (
    obj_ent_id BIGINT PRIMARY KEY,
    com_entidad_id BIGINT NOT NULL,
    tipo_obj VARCHAR(1) NOT NULL,  -- 'E' = Estratégico, 'G' = Gobierno Digital
    numeracion_obj VARCHAR(5) NOT NULL,
    descripcion_objetivo VARCHAR(240) NOT NULL
);
```

#### 9. `acciones_objetivos_entidades`
```sql
CREATE TABLE acciones_objetivos_entidades (
    acc_obj_ent_id BIGINT PRIMARY KEY,
    obj_ent_id BIGINT NOT NULL,  -- FK a objetivos_entidades
    numeracion_acc VARCHAR(5) NOT NULL,
    descripcion_accion VARCHAR(240) NOT NULL
);
```

#### 10. `proyectos_entidades`
```sql
CREATE TABLE proyectos_entidades (
    proy_ent_id BIGINT PRIMARY KEY,
    com_entidad_id BIGINT NOT NULL,
    numeracion_proy VARCHAR(5) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    alcance VARCHAR(240) NOT NULL,
    justificacion VARCHAR(240) NOT NULL,
    tipo_proy VARCHAR(100) NOT NULL,
    area_proy VARCHAR(50) NOT NULL,
    area_ejecuta VARCHAR(50) NOT NULL,
    tipo_beneficiario VARCHAR(100) NOT NULL,
    etapa_proyecto VARCHAR(100) NOT NULL,
    ambito_proyecto VARCHAR(100) NOT NULL,
    fec_ini_prog DATE NOT NULL,
    fec_fin_prog DATE NOT NULL,
    fec_ini_real DATE NOT NULL,
    fec_fin_real DATE NOT NULL,
    alienado_pgd VARCHAR(100) NOT NULL,
    obj_tran_dig VARCHAR(100) NOT NULL,
    obj_est VARCHAR(100) NOT NULL,
    acc_est VARCHAR(100) NOT NULL,
    estado_proyecto BOOLEAN NOT NULL
);
```

---

## 2. ENTIDAD EN BACKEND (.NET)

### Archivo: `PCM.Domain/Entities/Com3EPGD.cs`

```csharp
public class Com3EPGD
{
    // Campos comunes
    public long ComepgdEntId { get; set; }
    public long CompromisoId { get; set; }
    public Guid EntidadId { get; set; }  // ✅ Correcto: UUID
    public string EtapaFormulario { get; set; }
    public string Estado { get; set; }
    public bool CheckPrivacidad { get; set; }
    public bool CheckDdjj { get; set; }
    public string EstadoPcm { get; set; }
    public string ObservacionesPcm { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime FecRegistro { get; set; }
    public Guid UsuarioRegistra { get; set; }  // ✅ Correcto: UUID
    public bool Activo { get; set; }
    
    // Campos específicos
    public DateTime FechaReporte { get; set; }  // ✅ Mapped: DATE -> DateTime
    public string Sede { get; set; }
    public string Observaciones { get; set; }
    public string UbicacionAreaTi { get; set; }
    public string OrganigramaTi { get; set; }
    public string DependenciaAreaTi { get; set; }
    public decimal CostoAnualTi { get; set; }
    public bool ExisteComisionGdTi { get; set; }
    public string? RutaPdfNormativa { get; set; }  // ✅ Existe en código pero ❌ FALTA en BD
    
    // Relaciones de navegación
    public virtual ICollection<PersonalTI>? PersonalTI { get; set; }
    public virtual ICollection<InventarioSoftware>? InventariosSoftware { get; set; }
    public virtual ICollection<InventarioSistemasInfo>? InventariosSistemas { get; set; }
    public virtual ICollection<InventarioRed>? InventariosRed { get; set; }
    public virtual ICollection<InventarioServidores>? InventariosServidores { get; set; }
    public virtual SeguridadInfo? SeguridadInfo { get; set; }
    public virtual ICollection<ObjetivoEntidad>? Objetivos { get; set; }
    public virtual ICollection<ProyectoEntidad>? Proyectos { get; set; }
}
```

### DTOs de Commands/Queries

**CreateCom3EPGDCommand** y **UpdateCom3EPGDCommand** incluyen:
- ✅ Todos los campos de cabecera
- ✅ FechaReporte, Sede, Observaciones
- ✅ UbicacionAreaTi, OrganigramaTi, DependenciaAreaTi, CostoAnualTi
- ✅ ExisteComisionGdTi
- ❌ FALTA: RutaPdfNormativa
- ✅ Lists de DTOs para todas las tablas relacionadas

---

## 3. FRONTEND (React)

### Archivo: `frontend/src/components/Compromiso3/Compromiso3Paso1.jsx`

#### Estructura de Estado:
```javascript
const [formData, setFormData] = useState({
    com3EPGDId: null,
    objetivos: [],  // Incluye tanto 'E' como 'G'
    situacionActual: {
      header: {
        ubicacionAreaTi: '',
        dependenciaAreaTi: '',
        costoAnualTi: 0,
        existeComisionGdTi: false
        // ❌ FALTA: organigramaTi (URL del PDF)
        // ❌ FALTA: rutaPdfNormativa
      },
      personalTI: [],
      inventarioSoftware: [],
      inventarioSistemas: [],
      inventarioRed: [],
      inventarioServidores: [],
      seguridadInfo: {},
      capacitacionesSeginfo: []
    },
    proyectos: []
});
```

#### Componentes hijos:
1. **ObjetivosEstrategicos.jsx** - Maneja objetivos tipo 'E'
2. **ObjetivosGobiernoDigital.jsx** - Maneja objetivos tipo 'G'
3. **SituacionActualGD.jsx** - Maneja header + inventarios + seguridad
4. **PortafolioProyectos.jsx** - Maneja proyectos

---

## 4. PROBLEMAS IDENTIFICADOS

### 🔴 CRÍTICOS (Bloquean funcionalidad)

1. **FALTA campo `rutaPDF_normativa` en la tabla `com3_epgd`**
   - Existe en la entidad backend (`RutaPdfNormativa`)
   - NO existe en la tabla de BD
   - NO se está usando en el frontend
   - **ACCIÓN**: Agregar columna a la BD

2. **FALTA campo `organigrama_ti` en el frontend**
   - Existe en BD como VARCHAR(255) para guardar URL del PDF
   - Existe en backend como `OrganigramaTi`
   - NO está en el formulario del frontend
   - **ACCIÓN**: Agregar input de archivo en `SituacionActualGD.jsx`

3. **FALTA campos de cabecera en el formulario principal**
   - `fecha_reporte` (DATE NOT NULL) - No visible en ningún paso
   - `sede` (VARCHAR(100) NOT NULL) - No visible
   - `observaciones` (VARCHAR(255) NOT NULL) - No visible
   - **ACCIÓN**: Agregar estos campos en el Paso 1 o crear un paso 0

### 🟡 ADVERTENCIAS (Pueden causar errores)

4. **Mapeo de fechas incompleto**
   - Backend usa `DateTime` para campos DATE
   - Frontend debe enviar formato ISO string: `YYYY-MM-DD`
   - Verificar conversión en proyectos: `fec_ini_prog`, `fec_fin_prog`, etc.

5. **Validaciones de NOT NULL**
   - Muchos campos son NOT NULL en BD
   - El frontend permite guardar sin validar todos
   - **ACCIÓN**: Agregar validaciones antes del submit

### 🟢 MEJORAS (No bloquean pero son recomendables)

6. **Nomenclatura inconsistente**
   - BD: snake_case (`fecha_reporte`)
   - Backend: PascalCase (`FechaReporte`)
   - Frontend: camelCase (`fechaReporte`)
   - Mapeo funciona pero puede confundir

7. **Campos calculados en `inventario_software`**
   - `exceso_deficiencia` debería calcularse automáticamente:
     ```
     exceso_deficiencia = cantidad_instalaciones - cantidad_licencias
     ```
   - Actualmente el frontend lo calcula pero se podría hacer en backend

8. **Tablas relacionadas sin soft delete**
   - Las tablas de detalle NO tienen campo `activo`
   - Solo se pueden eliminar físicamente
   - **RIESGO**: Pérdida de datos históricos

---

## 5. COMPARACIÓN CON OTROS COMPROMISOS

### Compromiso 1 (Líder G.D.)
- ✅ Estructura simple: solo campos en la tabla principal
- ✅ No tiene tablas relacionadas
- ✅ Fechas bien manejadas
- **LECCIÓN**: Compromiso 3 es mucho más complejo

### Compromiso 2 (Comité)
- ✅ Tiene tabla relacionada: `comite_miembros`
- ✅ Campos NOT NULL bien validados
- ✅ Frontend maneja lista de miembros correctamente
- **APLICAR A COM3**: Usar mismo patrón para listas

---

## 6. PLAN DE ACCIÓN RECOMENDADO

### FASE 1: Correcciones de BD (URGENTE)
```sql
-- 1. Agregar columna faltante en com3_epgd
ALTER TABLE com3_epgd 
ADD COLUMN rutaPDF_normativa VARCHAR(255);

-- 2. Verificar tipos de datos
-- ✅ entidad_id es UUID
-- ✅ usuario_registra es UUID
-- ✅ fecha_reporte, fec_registro son DATE
```

### FASE 2: Actualizar Backend
```csharp
// Verificar que CreateCom3EPGDCommand incluya:
// - RutaPdfNormativa (opcional)
// - OrganigramaTi (obligatorio)
// - FechaReporte (obligatorio)
// - Sede (obligatorio)
// - Observaciones (obligatorio)
```

### FASE 3: Actualizar Frontend

#### 3.1 Crear componente de cabecera
```jsx
// Nuevo: Compromiso3Header.jsx
- Fecha de Reporte (date input)
- Sede (text input)
- Observaciones generales (textarea)
```

#### 3.2 Actualizar SituacionActualGD.jsx
```jsx
// Agregar en el header:
- Organigrama TI (file upload) -> Guardar URL en organigramaTi
- Archivo normativa (file upload) -> Guardar URL en rutaPdfNormativa
```

#### 3.3 Agregar validaciones
```javascript
// Antes de submit, validar:
✅ fechaReporte != null
✅ sede != ''
✅ ubicacionAreaTi != ''
✅ dependenciaAreaTi != ''
✅ costoAnualTi > 0
✅ organigramaTi != '' (URL del PDF)
```

### FASE 4: Testing
- [ ] Probar creación completa (CREATE)
- [ ] Probar actualización (UPDATE)
- [ ] Probar carga de datos existentes (GET)
- [ ] Validar todas las fechas
- [ ] Validar subida de archivos PDF
- [ ] Verificar cálculos automáticos (exceso/deficiencia)

---

## 7. SCRIPTS SQL DE MIGRACIÓN

```sql
-- ====================================
-- MIGRACIÓN: Agregar campos faltantes
-- ====================================

BEGIN;

-- Agregar columna rutaPDF_normativa
ALTER TABLE com3_epgd 
ADD COLUMN IF NOT EXISTS "rutaPDF_normativa" VARCHAR(255);

-- Comentarios para documentación
COMMENT ON COLUMN com3_epgd.rutaPDF_normativa IS 'URL del PDF de la normativa de conformación de comisión GD/TI';
COMMENT ON COLUMN com3_epgd.organigrama_ti IS 'URL del PDF del organigrama del área TI';

-- Verificar estructura final
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'com3_epgd'
ORDER BY ordinal_position;

COMMIT;
```

---

## 8. RESUMEN DE ESTADO

| Componente | Estado | Observaciones |
|------------|--------|---------------|
| **Base de Datos** | 🟡 90% | Falta campo rutaPDF_normativa |
| **Backend Entity** | ✅ 100% | Completa, incluye campo que falta en BD |
| **Backend Commands** | 🟡 95% | Falta incluir RutaPdfNormativa en DTOs |
| **Backend Handlers** | ✅ 100% | Funcionando correctamente |
| **Frontend Estado** | 🟡 85% | Falta organigramaTi y rutaPdfNormativa |
| **Frontend Formulario** | 🔴 70% | Faltan campos de cabecera (fecha, sede, obs) |
| **Frontend Validaciones** | 🔴 60% | Faltan validaciones de NOT NULL |
| **Subida de Archivos** | 🔴 50% | No implementada para PDFs |

### Leyenda:
- ✅ Completo y funcionando
- 🟡 Funcional pero con mejoras pendientes
- 🔴 Incompleto o con errores

---

## 9. SIGUIENTE PASO INMEDIATO

**PRIORIDAD 1**: Ejecutar migración de BD para agregar `rutaPDF_normativa`

**PRIORIDAD 2**: Agregar campos de cabecera en el frontend:
- Fecha de reporte
- Sede  
- Observaciones generales
- Organigrama TI (upload PDF)
- Normativa comisión (upload PDF)

**PRIORIDAD 3**: Implementar sistema de subida de archivos PDF
