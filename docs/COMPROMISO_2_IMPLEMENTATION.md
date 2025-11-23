# Implementación del Compromiso 2 - Comité GTD

## Resumen
Se ha implementado completamente el flujo para el Compromiso 2 (Comité de Gobierno y Transformación Digital), que permite registrar múltiples miembros del comité en lugar de un solo líder.

## Backend

### Entidades Creadas
1. **Com2CGTD.cs** - Tabla principal del Compromiso 2
   - Campos: ComcgtdEntId, CompromisoId, EntidadId (UUID), EtapaFormulario, Estado, CheckPrivacidad, CheckDdjj, UrlDocPcm, CriteriosEvaluados (JSONB)
   - Relación 1:N con ComiteMiembro

2. **ComiteMiembro.cs** - Miembros del comité
   - Campos: MiembroId, ComEntidadId (FK), Dni, Nombre, ApellidoPaterno, ApellidoMaterno, Cargo, Email, Telefono, Rol, FechaInicio, Activo
   - FK a Com2CGTD.ComcgtdEntId

### Comandos/Queries
1. **CreateCom2CGTDCommand** + Handler
   - Crea registro principal y miembros
   - Retorna ID del registro creado

2. **UpdateCom2CGTDCommand** + Handler
   - Actualiza registro principal
   - Gestión inteligente de miembros:
     * Inactiva todos los miembros existentes
     * Actualiza miembros con ID (reactiva si estaba inactivo)
     * Crea nuevos miembros sin ID
   - Retorna solo miembros activos

3. **GetCom2CGTDByEntidadQuery** + Handler
   - Obtiene registro por compromisoId y entidadId
   - Incluye solo miembros activos
   - Retorna null si no existe (404)

### Controller
- **Com2CGTDController.cs**
- Endpoints REST:
  * GET /{compromisoId}/entidad/{entidadId}
  * POST /
  * PUT /{id}
- Autenticación JWT (extrae user_id y entidad_id)

### Migraciones
1. **migration_com2_uuid_and_fields.sql** (Local) ✅ Ejecutada
   - Cambió entidad_id/usuario_registra a UUID
   - Añadió url_doc_pcm (TEXT)
   - Añadió criterios_evaluados (JSONB)

2. **SUPABASE_migration_com2_uuid_and_fields.sql** ✅ Verificada
   - Mismos cambios aplicados en Supabase
   - Todas las columnas presentes y con tipos correctos

## Frontend

### Servicio
**com2CGTDService.js**
- Métodos: getByEntidad, create, update
- Normaliza respuestas del backend
- Manejo de errores 404 (retorna null)
- Logging extensivo con emojis (🔍, 📞, 📦, etc.)

### Componente Principal
**CumplimientoNormativoDetalle.jsx** - Modificaciones:

1. **Imports**
   ```javascript
   import com2CGTDService from '../services/com2CGTDService';
   import { Plus, Trash2 } from 'lucide-react';
   ```

2. **Estado Adicional**
   ```javascript
   const [com2RecordId, setCom2RecordId] = useState(null);
   const [miembrosComite, setMiembrosComite] = useState([]);
   const [showModalMiembro, setShowModalMiembro] = useState(false);
   const [miembroActual, setMiembroActual] = useState({
     miembroId: null,
     dni: '',
     nombre: '',
     apellidoPaterno: '',
     apellidoMaterno: '',
     cargo: '',
     rol: '',
     email: '',
     telefono: ''
   });
   ```

3. **useEffect** - Actualizado para detectar Compromiso 2
   ```javascript
   if (['1', '2'].includes(compromisoIdFromUrl)) {
     loadCumplimiento(compromisoIdFromUrl);
   }
   ```

4. **loadCumplimiento** - Caso para Compromiso 2 (líneas ~138-190)
   - Llama a com2CGTDService.getByEntidad
   - Carga miembros en miembrosComite
   - Parsea criteriosEvaluados desde JSONB
   - Maneja 404 (nuevo registro)

5. **guardarProgreso** - Caso para Compromiso 2 (líneas ~624-685)
   - Mapea miembrosComite a request.Miembros
   - Llama a create/update según com2RecordId
   - Actualiza com2RecordId local tras crear

6. **validarPaso** - Validación específica para Compromiso 2
   ```javascript
   if (parseInt(formData.compromisoId) === 2) {
     if (miembrosComite.length === 0) {
       nuevosErrores.miembrosComite = 'Debe agregar al menos un miembro del comité';
       showErrorToast('Debe agregar al menos un miembro del comité');
     }
   }
   ```

7. **Paso 1 Rendering** - Condicional (líneas ~802-905)
   - **Compromiso 2**: Tabla de miembros del comité
     * Columnas: DNI, Nombres, Apellidos, Cargo, Rol, Correo, Teléfono, Acciones
     * Botón "Agregar Miembro" con icono Plus
     * Botón de eliminación por fila (Trash2)
     * Mensaje de estado vacío
   - **Otros compromisos**: Formulario de líder original

8. **Modal de Miembro** - Nuevo componente (líneas ~1360-1518)
   - Backdrop con overlay negro 50%
   - Formulario con 8 campos:
     * DNI (8 dígitos)
     * Nombres
     * Apellido Paterno
     * Apellido Materno
     * Cargo
     * Rol (select: Presidente, Vicepresidente, Secretario Técnico, Miembro)
     * Correo (email)
     * Teléfono
   - Validación: Todos los campos obligatorios
   - Botones: Cancelar, Agregar
   - Gestión: Edición si tiene miembroId, creación si es nuevo

### Navegación
**CumplimientoNormativo.jsx** - Actualizada
- Detecta compromisoId === 2
- Navega con parámetro ?compromiso=2
- Buttons Ver/Editar funcionan correctamente

## Flujo de Usuario

### Crear Nuevo Compromiso 2
1. Usuario hace clic en "Registrar" en fila del Compromiso 2
2. Navega a /dashboard/cumplimiento/detalle?compromiso=2
3. **Paso 1**: Agrega miembros del comité
   - Clic en "Agregar Miembro"
   - Completa formulario (8 campos)
   - Miembro se añade a la tabla
   - Puede agregar múltiples miembros
   - Puede eliminar miembros (icono basura)
   - Validación: Al menos 1 miembro requerido
4. Clic "Siguiente" → guarda en backend (com2_cgtd + comite_miembros)
5. **Paso 2**: Sube PDF, marca criterios (lógica compartida)
6. **Paso 3**: Acepta checkboxes, confirma
7. Sistema guarda todo y muestra éxito

### Editar Compromiso 2 Existente
1. Usuario hace clic en "Editar" en tabla de cumplimientos
2. Sistema carga datos existentes:
   - com2RecordId se establece
   - miembrosComite se llena con miembros activos
   - PDF y criterios se cargan
3. Usuario puede:
   - Agregar nuevos miembros
   - Eliminar miembros (se inactivan en backend)
   - Modificar paso 2/3
4. Al guardar, backend actualiza:
   - Inactiva todos los miembros previos
   - Reactiva/actualiza miembros con ID
   - Crea nuevos miembros sin ID

### Ver Compromiso 2 (Solo Lectura)
1. Usuario hace clic en "Ver" (icono ojo)
2. viewMode = true
3. Tabla de miembros visible, botones de acción ocultos
4. Navegación entre pasos permitida
5. No se permite edición

## Estructura de Datos

### Request Create/Update
```json
{
  "CompromisoId": 2,
  "EntidadId": "uuid-entidad",
  "EtapaFormulario": 1,
  "UrlDocPcm": "https://...",
  "CriteriosEvaluados": [
    { "CriterioId": 1, "Cumple": true }
  ],
  "CheckPrivacidad": false,
  "CheckDdjj": false,
  "Miembros": [
    {
      "MiembroId": null, // null para nuevo, ID para actualizar
      "Dni": "12345678",
      "Nombre": "Juan",
      "ApellidoPaterno": "García",
      "ApellidoMaterno": "López",
      "Cargo": "Director de TI",
      "Rol": "Presidente",
      "Email": "juan@gob.pe",
      "Telefono": "987654321"
    }
  ]
}
```

### Response
```json
{
  "success": true,
  "data": {
    "comcgtdEntId": 123,
    "compromisoId": 2,
    "entidadId": "uuid",
    "etapaFormulario": 1,
    "urlDocPcm": "https://...",
    "criteriosEvaluados": [...],
    "checkPrivacidad": false,
    "checkDdjj": false,
    "miembros": [
      {
        "miembroId": 456,
        "dni": "12345678",
        "nombre": "Juan",
        // ... otros campos
        "activo": true
      }
    ]
  }
}
```

## Testing

### Checklist de Pruebas
- [ ] Crear nuevo Compromiso 2
  - [ ] Agregar múltiples miembros
  - [ ] Validar campos obligatorios
  - [ ] Eliminar miembro antes de guardar
  - [ ] Validar al menos 1 miembro requerido
  - [ ] Guardar y verificar en BD (com2_cgtd + comite_miembros)
- [ ] Cargar Compromiso 2 existente
  - [ ] Ver miembros cargados correctamente
  - [ ] PDF y criterios cargados
- [ ] Editar Compromiso 2
  - [ ] Agregar nuevo miembro
  - [ ] Eliminar miembro existente (se inactiva en BD)
  - [ ] Actualizar y verificar en BD
- [ ] Ver Compromiso 2 (modo lectura)
  - [ ] Tabla de miembros visible
  - [ ] Botones de acción ocultos
  - [ ] Navegación entre pasos funcional
- [ ] Validaciones
  - [ ] DNI 8 dígitos
  - [ ] Email formato válido
  - [ ] Todos los campos requeridos
  - [ ] Al menos 1 miembro para avanzar paso

## Archivos Modificados/Creados

### Backend
- backend/PCM.Domain/Entities/Com2CGTD.cs (nuevo)
- backend/PCM.Domain/Entities/ComiteMiembro.cs (nuevo)
- backend/PCM.Application/Commands/Com2/CreateCom2CGTDCommand.cs (nuevo)
- backend/PCM.Application/Commands/Com2/CreateCom2CGTDHandler.cs (nuevo)
- backend/PCM.Application/Commands/Com2/UpdateCom2CGTDCommand.cs (nuevo)
- backend/PCM.Application/Commands/Com2/UpdateCom2CGTDHandler.cs (nuevo)
- backend/PCM.Application/Queries/Com2/GetCom2CGTDByEntidadQuery.cs (nuevo)
- backend/PCM.Application/Queries/Com2/GetCom2CGTDByEntidadHandler.cs (nuevo)
- backend/PCM.API/Controllers/Com2CGTDController.cs (nuevo)
- backend/PCM.Infrastructure/Persistence/PCMDbContext.cs (modificado)

### Frontend
- frontend/src/services/com2CGTDService.js (nuevo)
- frontend/src/pages/CumplimientoNormativoDetalle.jsx (modificado)
- frontend/src/pages/CumplimientoNormativo.jsx (modificado)

### Database
- db/migration_com2_uuid_and_fields.sql (nuevo)
- db/SUPABASE_migration_com2_uuid_and_fields.sql (nuevo)
- db/SUPABASE_verify_com2_structure.sql (nuevo)

## Notas Técnicas

1. **Gestión de Miembros**: El backend usa un patrón de "soft delete" - inactiva miembros en lugar de eliminarlos, permitiendo trazabilidad.

2. **Normalización de Respuestas**: com2CGTDService normaliza las respuestas del backend para consistencia.

3. **Validación en Capas**: 
   - Frontend: Validación de formato y campos requeridos
   - Backend: Validación de negocio y consistencia de datos

4. **Estado Local**: Los miembros se gestionan en el estado local del componente hasta guardar, evitando múltiples llamadas al backend.

5. **Compatibilidad**: El componente mantiene compatibilidad con Compromiso 1 y otros compromisos mediante renderizado condicional.

## Próximos Pasos

1. **Testing Completo**: Ejecutar checklist de pruebas
2. **Validaciones Adicionales**:
   - Verificar DNI único en el comité
   - Validar al menos 1 Presidente/Secretario Técnico
3. **Mejoras UX**:
   - Botón de editar miembro en la tabla
   - Confirmación antes de eliminar miembro
   - Preview de miembros antes de guardar
4. **Otros Compromisos**: Implementar compromisos 3, 4, etc. siguiendo el mismo patrón
