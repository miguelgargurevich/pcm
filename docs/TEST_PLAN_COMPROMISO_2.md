# Plan de Pruebas - Compromiso 2

## Ambiente de Pruebas
- **Backend**: http://localhost:5190
- **Frontend**: http://localhost:5173
- **Base de Datos Local**: PostgreSQL puerto 5433
- **Supabase**: Configurado y sincronizado

## Prerrequisitos
1. Backend ejecutándose: `cd backend/PCM.API && dotnet run`
2. Frontend ejecutándose: `cd frontend && npm run dev`
3. Usuario autenticado con JWT válido
4. Entidad asignada al usuario (entidad_id en claims)

## Caso de Prueba 1: Crear Nuevo Compromiso 2

### Pasos
1. Navegar a Dashboard → Cumplimiento Normativo
2. Buscar fila "Compromiso 2 - Comité GTD"
3. Clic en botón "Registrar"
4. Verificar que se abre el formulario con Paso 1

### Paso 1: Agregar Miembros del Comité
**Acción 1**: Verificar UI inicial
- ✅ Se muestra título "Paso 1: Constituir el Comité de Gobierno y TD (CGTD)"
- ✅ Se muestra tabla vacía con mensaje "No hay miembros registrados..."
- ✅ Botón "Agregar Miembro" visible

**Acción 2**: Agregar primer miembro
1. Clic en "Agregar Miembro"
2. Verificar que se abre modal
3. Completar formulario:
   - DNI: 12345678
   - Nombres: Juan Carlos
   - Apellido Paterno: García
   - Apellido Materno: López
   - Cargo: Director de Tecnologías
   - Rol: Presidente
   - Correo: juan.garcia@gob.pe
   - Teléfono: 987654321
4. Clic en "Agregar"
5. **Resultado esperado**:
   - Modal se cierra
   - Toast: "Miembro agregado exitosamente"
   - Miembro aparece en la tabla

**Acción 3**: Agregar segundo miembro (Secretario Técnico)
1. Clic en "Agregar Miembro"
2. Completar formulario:
   - DNI: 87654321
   - Nombres: María Elena
   - Apellido Paterno: Rodríguez
   - Apellido Materno: Sánchez
   - Cargo: Jefe de Proyectos TI
   - Rol: Secretario Técnico
   - Correo: maria.rodriguez@gob.pe
   - Teléfono: 912345678
3. Clic en "Agregar"
4. **Resultado esperado**: 2 miembros en la tabla

**Acción 4**: Agregar tercer miembro (Miembro)
1. Completar formulario con datos válidos
2. Rol: Miembro
3. **Resultado esperado**: 3 miembros en la tabla

**Acción 5**: Eliminar un miembro
1. Clic en icono de basura del segundo miembro
2. **Resultado esperado**: Miembro se elimina de la tabla (quedan 2)

**Acción 6**: Validación de campos obligatorios
1. Clic en "Agregar Miembro"
2. Dejar campos vacíos
3. Clic en "Agregar"
4. **Resultado esperado**: Toast "Todos los campos son obligatorios"

**Acción 7**: Validación de DNI
1. Ingresar DNI con menos de 8 dígitos: "1234567"
2. Completar otros campos
3. Intentar agregar
4. **Resultado esperado**: Validación (si se implementa) o se agrega normalmente

**Acción 8**: Intentar avanzar sin miembros
1. Eliminar todos los miembros de la tabla
2. Clic en "Siguiente"
3. **Resultado esperado**: Toast "Debe agregar al menos un miembro del comité"

**Acción 9**: Guardar progreso con miembros
1. Agregar al menos 1 miembro válido
2. Clic en "Siguiente"
3. **Resultado esperado**:
   - Loading state visible
   - Request POST a /api/Com2CGTD
   - Toast: "Progreso guardado exitosamente"
   - Avanza a Paso 2

### Verificación en Base de Datos
```sql
-- Verificar registro principal
SELECT * FROM com2_cgtd WHERE compromiso_id = 2 ORDER BY created_at DESC LIMIT 1;

-- Verificar miembros
SELECT * FROM comite_miembros 
WHERE com_entidad_id = (SELECT comcgtd_ent_id FROM com2_cgtd WHERE compromiso_id = 2 ORDER BY created_at DESC LIMIT 1)
AND activo = true;
```

### Paso 2: Subir Documento
1. Subir PDF de prueba
2. Marcar todos los criterios de evaluación
3. Clic en "Siguiente"
4. **Resultado esperado**:
   - PDF se sube a Supabase Storage
   - URL se guarda en url_doc_pcm
   - Criterios se guardan en criterios_evaluados (JSONB)

### Paso 3: Confirmación
1. Marcar "Acepto política de privacidad"
2. Marcar "Acepto declaración jurada"
3. Clic en "Confirmar"
4. **Resultado esperado**:
   - Estado cambia a "Completado"
   - Navega a lista de cumplimientos
   - Registro aparece con estado "Completado"

## Caso de Prueba 2: Editar Compromiso 2 Existente

### Pasos
1. En lista de cumplimientos, buscar Compromiso 2 existente
2. Clic en icono de edición (lápiz)
3. **Resultado esperado**: 
   - Formulario se carga con datos existentes
   - Miembros aparecen en la tabla
   - PDF y criterios cargados

### Editar Miembros
**Acción 1**: Eliminar miembro existente
1. Clic en icono de basura de un miembro
2. Clic en "Siguiente" para guardar
3. **Resultado esperado**:
   - Request PUT a /api/Com2CGTD/{id}
   - Backend inactiva el miembro (activo = false)

**Verificación BD**:
```sql
SELECT * FROM comite_miembros WHERE miembro_id = [ID_ELIMINADO];
-- Debe tener activo = false
```

**Acción 2**: Agregar nuevo miembro
1. Clic en "Agregar Miembro"
2. Completar formulario
3. Guardar
4. **Resultado esperado**:
   - Nuevo miembro se crea en BD
   - aparece en la tabla junto a los existentes

**Acción 3**: Modificar Paso 2
1. Cambiar PDF
2. Modificar criterios
3. Guardar
4. **Resultado esperado**: Cambios se guardan correctamente

## Caso de Prueba 3: Ver Compromiso 2 (Solo Lectura)

### Pasos
1. En lista de cumplimientos, buscar Compromiso 2
2. Clic en icono de ojo (Ver)
3. **Resultado esperado**:
   - Formulario en modo lectura
   - Tabla de miembros visible
   - Botón "Agregar Miembro" oculto
   - Iconos de eliminación ocultos
   - Navegación entre pasos permitida
   - Botón "Guardar" no visible

## Caso de Prueba 4: Validaciones de Negocio

### Validación 1: Email formato
1. Crear nuevo Compromiso 2
2. Agregar miembro con email inválido: "correo@invalido"
3. **Resultado esperado**: (si se implementa) Error de validación

### Validación 2: DNI único
1. Agregar miembro con DNI: 12345678
2. Intentar agregar otro miembro con mismo DNI
3. **Resultado esperado**: (si se implementa) Error "DNI ya existe en el comité"

### Validación 3: Rol Presidente único
1. Agregar miembro con rol Presidente
2. Intentar agregar otro Presidente
3. **Resultado esperado**: (si se implementa) Error "Solo puede haber un Presidente"

## Caso de Prueba 5: Navegación y Persistencia

### Escenario: Abandonar y volver
1. Crear Compromiso 2, agregar 2 miembros
2. Guardar (avanzar a Paso 2)
3. Salir del formulario (volver a lista)
4. Entrar de nuevo en modo edición
5. **Resultado esperado**: 2 miembros se cargan correctamente

### Escenario: Editar múltiples veces
1. Editar Compromiso 2
2. Agregar 1 miembro
3. Guardar y salir
4. Volver a editar
5. Agregar otro miembro
6. Guardar y salir
7. Volver a editar
8. **Resultado esperado**: Todos los miembros visibles y activos

## Caso de Prueba 6: Logs y Debugging

### Verificar Console Logs
Al crear/editar, buscar en consola:
- 🔍 Verificando Compromiso 2...
- 📞 Llamando a com2CGTDService.getByEntidad...
- 📦 Respuesta de getByEntidad...
- 👥 Miembros cargados...
- 🔵 Paso 1 Compromiso 2 data...
- 📤 Enviando request COM2...
- 📝 Response guardado COM2...

### Verificar Network Tab
**Request POST /api/Com2CGTD**:
```json
{
  "CompromisoId": 2,
  "EntidadId": "uuid-entidad",
  "EtapaFormulario": 1,
  "Miembros": [
    {
      "MiembroId": null,
      "Dni": "12345678",
      "Nombre": "Juan Carlos",
      // ...
    }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "comcgtdEntId": 123,
    "miembros": [...]
  }
}
```

## Casos Edge

### Edge 1: 0 miembros en BD pero record existe
- **Acción**: Eliminar todos los miembros de un Compromiso 2 existente
- **Esperado**: Validación impide guardar

### Edge 2: Muchos miembros (>10)
- **Acción**: Agregar 15 miembros
- **Esperado**: Tabla scroll horizontal, todos se guardan

### Edge 3: Caracteres especiales en nombres
- **Acción**: Agregar miembro con nombres como "José María Ñuñez O'Brien"
- **Esperado**: Se guarda correctamente

### Edge 4: Actualizar sin cambios
- **Acción**: Editar y guardar sin modificar nada
- **Esperado**: Backend ejecuta UPDATE, todos los miembros permanecen activos

## Checklist Final
- [ ] ✅ Crear nuevo Compromiso 2 con 3+ miembros
- [ ] ✅ Validación de al menos 1 miembro funciona
- [ ] ✅ Modal se abre/cierra correctamente
- [ ] ✅ Todos los campos del miembro se guardan
- [ ] ✅ Eliminar miembro antes de guardar funciona
- [ ] ✅ Eliminar miembro existente lo inactiva en BD
- [ ] ✅ Editar Compromiso 2 carga miembros correctamente
- [ ] ✅ Agregar miembro a registro existente funciona
- [ ] ✅ PDF y criterios se guardan correctamente
- [ ] ✅ Paso 3 completa el registro
- [ ] ✅ Ver modo lectura oculta botones de acción
- [ ] ✅ Navegación entre pasos funciona
- [ ] ✅ Logs en consola son informativos
- [ ] ✅ Requests/Responses son correctas
- [ ] ✅ Base de datos refleja cambios correctamente
- [ ] ✅ Supabase Storage guarda PDF correctamente

## Bugs Conocidos / Pendientes
1. **Validación DNI formato**: No valida que sean exactamente 8 dígitos numéricos
2. **Email validación**: Solo valida formato básico, no verifica dominio @gob.pe
3. **Editar miembro**: No hay botón de editar en la tabla, solo eliminar y recrear
4. **Confirmación eliminación**: No pide confirmación antes de eliminar miembro
5. **DNI duplicado**: No valida que el DNI sea único dentro del comité

## Próximas Mejoras
1. Agregar botón de editar miembro (no solo eliminar)
2. Confirmación modal antes de eliminar
3. Validación DNI único en el comité
4. Validación de al menos 1 Presidente/Secretario Técnico
5. Búsqueda/filtro en tabla de miembros (para comités grandes)
6. Export de miembros a Excel/PDF
7. Historial de cambios de miembros (quién agregó/eliminó cuándo)
