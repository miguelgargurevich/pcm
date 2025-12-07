# Compromiso 3 - Plan de Gobierno Digital

## Descripción
Este módulo implementa las pantallas para el **Compromiso 3: Elaborar el Plan de Gobierno Digital** de la Plataforma de Cumplimiento Digital del Perú.

## Estructura de Archivos

```
frontend/src/components/Compromiso3/
├── index.js                    # Exportaciones de todos los componentes
├── Compromiso3Paso1.jsx        # Componente principal contenedor (4 tabs)
├── ObjetivosEstrategicos.jsx   # Tab 1: Objetivos Estratégicos
├── ObjetivosGobiernoDigital.jsx # Tab 2: Objetivos de Gobierno Digital
├── SituacionActualGD.jsx       # Tab 3: Contenedor con 6 sub-tabs
├── PortafolioProyectos.jsx     # Tab 4: Portafolio de Proyectos
└── SituacionActual/
    ├── EstructuraOrganizacional.jsx  # Sub-tab: Estructura Org. + Personal TI
    ├── InventarioSoftwareTab.jsx     # Sub-tab: Inventario de Software
    ├── InventarioSistemasTab.jsx     # Sub-tab: Inventario de Sistemas
    ├── InventarioRedTab.jsx          # Sub-tab: Inventario de Red
    ├── InventarioServidoresTab.jsx   # Sub-tab: Inventario de Servidores
    └── SeguridadInfoTab.jsx          # Sub-tab: Seguridad de la Información
```

## Backend

### Archivos creados:
- `backend/PCM.Domain/Entities/Compromisos/Com3EPGD/` - Entidades del dominio
- `backend/PCM.Application/Features/Com3EPGD/` - Commands y Queries (CQRS)
- `backend/PCM.Infrastructure/Handlers/Com3EPGD/` - Handlers
- `backend/PCM.API/Controllers/Com3EPGDController.cs` - Controller API

### Endpoints API:
- `GET /api/com3epgd/{entidadId}` - Obtener datos por entidad
- `POST /api/com3epgd` - Crear nuevo registro
- `PUT /api/com3epgd/{id}` - Actualizar registro existente

## Service Frontend
```javascript
// frontend/src/services/com3EPGDService.js
import com3EPGDService from '../services/com3EPGDService';

// Obtener datos por entidad
const response = await com3EPGDService.getByEntidad(entidadId);

// Crear nuevo registro
const response = await com3EPGDService.create(data);

// Actualizar registro
const response = await com3EPGDService.update(id, data);
```

## Uso del Componente Principal

```jsx
import { Compromiso3Paso1 } from '../components/Compromiso3';

<Compromiso3Paso1
  entidadId={user.entidadId}
  cumplimientoNormativoId={cumplimientoId}
  onDataChange={(data) => setFormData(prev => ({ ...prev, ...data }))}
  viewMode={false} // true para solo lectura
/>
```

## Paso 1 - Tabs

### Tab 1: Objetivos Estratégicos
- Código automático: `OE-01`, `OE-02`, etc.
- Acciones por objetivo: `OE-01.01`, `OE-01.02`, etc.
- CRUD completo con modal de edición

### Tab 2: Objetivos de Gobierno Digital
- Código automático: `OGD-01`, `OGD-02`, etc.
- Acciones por objetivo: `OGD-01.01`, `OGD-01.02`, etc.
- CRUD completo con modal de edición

### Tab 3: Situación Actual de GD
Contiene 6 sub-tabs:
1. **Estructura Organizacional** - Datos del área TI + grilla de personal
2. **Inv. Software** - Inventario de software con licencias
3. **Inv. Sistemas** - Sistemas de información
4. **Inv. Equipos Red** - Equipos de networking
5. **Inv. Servidores** - Servidores físicos y virtuales
6. **Seguridad Info.** - Checkboxes de evaluación + capacitaciones

### Tab 4: Portafolio de Proyectos (PP)
- Código automático: `PP-2024-001`, etc.
- Campos: tipo, responsable, presupuesto, fechas, estado, avance
- Importar/Exportar Excel (pendiente implementación)

## Pasos 2 y 3
Los pasos 2 (Criterios de Evaluación) y 3 (Declaraciones) son los mismos que los demás compromisos.

## Integración Pendiente

Para completar la integración en `CumplimientoNormativoDetalle.jsx`:

1. Importar el componente:
```jsx
import { Compromiso3Paso1 } from '../components/Compromiso3';
```

2. Agregar estado para datos de Com3:
```jsx
const [com3Data, setCom3Data] = useState(null);
const [com3RecordId, setCom3RecordId] = useState(null);
```

3. Reemplazar el placeholder actual del Compromiso 3 con:
```jsx
) : parseInt(formData.compromisoId) === 3 ? (
  <Compromiso3Paso1
    entidadId={user.entidadId}
    cumplimientoNormativoId={cumplimientoNormativoId}
    onDataChange={setCom3Data}
    viewMode={viewMode}
  />
) : parseInt(formData.compromisoId) === 5 ? (
```

4. Actualizar la función `handleGuardar` para guardar datos del Compromiso 3:
```jsx
if (parseInt(formData.compromisoId) === 3) {
  // Usar com3EPGDService para guardar
  if (com3RecordId) {
    response = await com3EPGDService.update(com3RecordId, com3Data);
  } else {
    response = await com3EPGDService.create({
      ...com3Data,
      entidadId: user.entidadId,
      cumplimientoNormativoId
    });
    if (response.isSuccess) {
      setCom3RecordId(response.data.com3EPGDId);
    }
  }
}
```

## Modelo de Datos

### Tablas de Base de Datos:
- `com3_epgd` - Registro principal
- `personal_ti` - Personal del área TI
- `inventario_software` - Inventario de software
- `inventario_sistemas_info` - Sistemas de información
- `inventario_red` - Equipos de red
- `inventario_servidores` - Servidores
- `seguridad_info` - Evaluación de seguridad
- `capacitaciones_seginfo` - Capacitaciones de seguridad
- `objetivos_entidad` - Objetivos (E y G)
- `acciones_objetivos_entidad` - Acciones por objetivo
- `proyectos_entidad` - Portafolio de proyectos

## Notas de Desarrollo

1. Los componentes usan `tempId` (timestamp) para identificar registros nuevos antes de guardar
2. Al guardar, los `tempId` se reemplazan por los IDs reales del backend
3. El estado `activo: true/false` se usa para soft-delete
4. Los códigos de objetivos y proyectos se generan automáticamente

## Pendientes
- [ ] Implementar importación de Excel en Portafolio de Proyectos
- [ ] Implementar exportación a Excel
- [ ] Agregar validaciones de campos requeridos
- [ ] Integrar completamente en CumplimientoNormativoDetalle.jsx
- [ ] Crear migraciones de base de datos si es necesario
