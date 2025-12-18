-- ============================================================================
-- FIX: Portafolio de Proyectos - Mapeo Frontend/Backend/BD
-- Fecha: 2025-12-18
-- Descripción: Corrección de nombres de campos en frontend para coincidir
--              con la estructura real de la base de datos
-- ============================================================================

-- TABLA: proyectos_entidades
-- Ubicación: Compromiso 3 - Portafolio de Proyectos

-- ============================================================================
-- CAMPOS QUE EXISTEN EN LA BD (21 campos)
-- ============================================================================
/*
proy_ent_id           bigint          PK
com_entidad_id        bigint          FK -> com3_epgd
numeracion_proy       varchar(5)      Código del proyecto
nombre                varchar(100)    Nombre del proyecto
alcance               varchar(240)    Alcance del proyecto
justificacion         varchar(240)    Justificación del proyecto
tipo_proy             varchar(100)    Tipo de proyecto
area_proy             varchar(50)     Área responsable
area_ejecuta          varchar(50)     Área que ejecuta
tipo_beneficiario     varchar(100)    Tipo de beneficiario
etapa_proyecto        varchar(100)    Etapa del proyecto
ambito_proyecto       varchar(100)    Ámbito del proyecto
fec_ini_prog          date            Fecha inicio programada
fec_fin_prog          date            Fecha fin programada
fec_ini_real          date            Fecha inicio real
fec_fin_real          date            Fecha fin real
alienado_pgd          varchar(100)    Alineado con PGD (typo en BD)
obj_tran_dig          varchar(100)    Objetivo transformación digital
obj_est               varchar(100)    Objetivo estratégico
acc_est               varchar(100)    Acción estratégica
estado_proyecto       boolean         Estado activo/inactivo
*/

-- ============================================================================
-- CAMPOS QUE NO EXISTEN EN BD PERO SE USABAN EN FRONTEND (eliminados)
-- ============================================================================
/*
❌ porcentaje_avance   - NO EXISTE EN BD
❌ informo_avance      - NO EXISTE EN BD
❌ observaciones        - NO EXISTE EN BD
❌ monto_inversion     - NO EXISTE EN BD
*/

-- ============================================================================
-- MAPEO CORREGIDO: Frontend → Backend DTO → BD
-- ============================================================================
/*
Frontend State        Backend DTO         BD Column           Tipo
--------------------------------------------------------------------------------
numeracionProy   →    NumeracionProy  →   numeracion_proy     varchar(5)
nombre           →    Nombre          →   nombre              varchar(100)
alcance          →    Alcance         →   alcance             varchar(240)
justificacion    →    Justificacion   →   justificacion       varchar(240)
tipoProy         →    TipoProy        →   tipo_proy           varchar(100)
areaProy         →    AreaProy        →   area_proy           varchar(50)
areaEjecuta      →    AreaEjecuta     →   area_ejecuta        varchar(50)
tipoBeneficiario →    TipoBeneficiario→   tipo_beneficiario   varchar(100)
etapaProyecto    →    EtapaProyecto   →   etapa_proyecto      varchar(100)
ambitoProyecto   →    AmbitoProyecto  →   ambito_proyecto     varchar(100)
fecIniProg       →    FecIniProg      →   fec_ini_prog        date
fecFinProg       →    FecFinProg      →   fec_fin_prog        date
fecIniReal       →    FecIniReal      →   fec_ini_real        date
fecFinReal       →    FecFinReal      →   fec_fin_real        date
alineadoPgd      →    AlineadoPgd     →   alienado_pgd        varchar(100)
objTranDig       →    ObjTranDig      →   obj_tran_dig        varchar(100)
objEst           →    ObjEst          →   obj_est             varchar(100)
accEst           →    AccEst          →   acc_est             varchar(100)
estadoProyecto   →    EstadoProyecto  →   estado_proyecto     boolean
*/

-- ============================================================================
-- NOMBRES INCORRECTOS QUE SE CORRIGIERON EN FRONTEND
-- ============================================================================
/*
ANTES (❌ Incorrecto)     AHORA (✅ Correcto)
---------------------------------------------------
codigoProyecto        →   numeracionProy
nombreProyecto        →   nombre
tipoProyecto          →   tipoProy
objetivoEstrategico   →   objEst
objetivoGD            →   objTranDig
fechaInicio           →   fecIniProg
fechaFin              →   fecFinProg
alienadoPgd           →   alineadoPgd
*/

-- ============================================================================
-- ARCHIVOS MODIFICADOS
-- ============================================================================
/*
1. frontend/src/components/Compromiso3/PortafolioProyectos.jsx
   - Actualizado estado inicial del formulario
   - Actualizado handleAddProyecto, handleEditProyecto, handleSaveProyecto
   - Actualizado campos del modal
   - Actualizado columnas de la tabla
   - Eliminados campos inexistentes (porcentajeAvance, informoAvance, observaciones)

2. frontend/src/components/Compromiso3/Compromiso3Paso1.jsx
   - Actualizado mapeo en useEffect al cargar datos
   - Actualizado proyectosMapped al enviar datos al backend
   - Eliminado campo montoInversion
*/

-- ============================================================================
-- NOTAS IMPORTANTES
-- ============================================================================
/*
1. La BD tiene un typo: "alienado_pgd" debería ser "alineado_pgd"
   pero se respeta el nombre actual de la BD

2. Los campos de fecha en BD son tipo DATE, no DATETIME
   
3. El backend usa ProyectoEntidadDto que mapea directamente con la BD
   
4. La columna "activo" NO existe en esta tabla (solo estado_proyecto)
   
5. La columna created_at NO existe en esta tabla
*/

-- ============================================================================
-- VERIFICACIÓN DE ESTRUCTURA ACTUAL
-- ============================================================================
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'proyectos_entidades'
ORDER BY ordinal_position;

-- ============================================================================
-- FIN DEL ARCHIVO
-- ============================================================================
