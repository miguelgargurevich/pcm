import { useState, useEffect, useRef } from 'react';
import { Target, Building2, FolderKanban, Monitor } from 'lucide-react';
import ObjetivosEstrategicos from './ObjetivosEstrategicos';
import ObjetivosGobiernoDigital from './ObjetivosGobiernoDigital';
import SituacionActualGD from './SituacionActualGD';
import PortafolioProyectos from './PortafolioProyectos';
import com3EPGDService from '../../services/com3EPGDService';
import { showErrorToast } from '../../utils/toast';

/**
 * Componente principal para el Paso 1 del Compromiso 3
 * Contiene 4 tabs: Objetivos Estratégicos, Objetivos GD, Situación Actual GD, Portafolio de Proyectos
 * Implementa auto-guardado con debounce
 */
const Compromiso3Paso1 = ({ 
  entidadId, 
  onDataChange, 
  viewMode = false,
  initialData = null 
}) => {
  const [activeTab, setActiveTab] = useState('objetivosEstrategicos');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estado de auto-guardado
  const saveTimeoutRef = useRef(null);
  const isSavingRef = useRef(false);
  
  // Estado para todos los datos del Compromiso 3
  const [formData, setFormData] = useState({
    com3EPGDId: null,
    objetivos: [], // Incluye tanto E como G
    situacionActual: {
      header: {},
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

  const tabs = [
    { id: 'objetivosEstrategicos', label: 'Objetivos Estratégicos', icon: Target },
    { id: 'objetivosGD', label: 'Objetivos GD', icon: Monitor },
    { id: 'situacionActual', label: 'Situación Actual GD', icon: Building2 },
    { id: 'portafolio', label: 'Portafolio de Proyectos (PP)', icon: FolderKanban }
  ];

  // Cargar datos cuando se monta el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await com3EPGDService.getByEntidad(entidadId);
        if (response.isSuccess && response.data) {
          const data = response.data;
          
          // Helper para convertir fecha ISO a YYYY-MM-DD
          const formatDateForInput = (isoDate) => {
            if (!isoDate) return '';
            const date = new Date(isoDate);
            return date.toISOString().split('T')[0];
          };
          
          // Mapear respuesta del backend (camelCase) a estructura del frontend
          setFormData({
            com3EPGDId: data.comepgdEntId,
            objetivos: data.objetivos || [],
            situacionActual: {
              header: {
                fechaReporte: formatDateForInput(data.fechaReporte),
                sede: data.sede,
                observaciones: data.observaciones,
                ubicacionAreaTi: data.ubicacionAreaTi,
                dependenciaAreaTi: data.dependenciaAreaTi,
                costoAnualTi: data.costoAnualTi,
                existeComisionGdTi: data.existeComisionGdTi
              },
              // El backend usa plural: inventariosSoftware, inventariosRed, etc.
              personalTI: data.personalTI || [],
              inventarioSoftware: data.inventariosSoftware || [],
              inventarioSistemas: data.inventariosSistemas || [],
              inventarioRed: data.inventariosRed || [],
              inventarioServidores: data.inventariosServidores || [],
              seguridadInfo: data.seguridadInfo || {},
              capacitacionesSeginfo: data.seguridadInfo?.capacitaciones || []
            },
            proyectos: data.proyectos || []
          });
        }
      } catch (err) {
        console.error('Error al cargar datos del Compromiso 3:', err);
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    if (initialData) {
      setFormData(initialData);
    } else if (entidadId) {
      loadData();
    }
  }, [entidadId, initialData]);

  const loadDataFromAPI = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await com3EPGDService.getByEntidad(entidadId);
      if (response.isSuccess && response.data) {
        const data = response.data;
        
        // Helper para convertir fecha ISO a YYYY-MM-DD
        const formatDateForInput = (isoDate) => {
          if (!isoDate) return '';
          const date = new Date(isoDate);
          return date.toISOString().split('T')[0];
        };
        
        // Mapear respuesta del backend (camelCase) a estructura del frontend
        setFormData({
          com3EPGDId: data.comepgdEntId,
          objetivos: data.objetivos || [],
          situacionActual: {
            header: {
              fechaReporte: formatDateForInput(data.fechaReporte),
              sede: data.sede,
              observaciones: data.observaciones,
              ubicacionAreaTi: data.ubicacionAreaTi,
              organigramaTi: data.organigramaTi,
              dependenciaAreaTi: data.dependenciaAreaTi,
              costoAnualTi: data.costoAnualTi,
              existeComisionGdTi: data.existeComisionGdTi,
              rutaPdfNormativa: data.rutaPdfNormativa
            },
            personalTI: data.personalTI || [],
            inventarioSoftware: data.inventariosSoftware || [],
            inventarioSistemas: data.inventariosSistemas || [],
            inventarioRed: data.inventariosRed || [],
            inventarioServidores: data.inventariosServidores || [],
            seguridadInfo: data.seguridadInfo || {},
            capacitacionesSeginfo: data.seguridadInfo?.capacitaciones || []
          },
          proyectos: (data.proyectos || []).map(p => ({
            ...p,
            fecIniProg: formatDateForInput(p.fecIniProg),
            fecFinProg: formatDateForInput(p.fecFinProg),
            fecIniReal: formatDateForInput(p.fecIniReal),
            fecFinReal: formatDateForInput(p.fecFinReal)
          }))
        });
      }
    } catch (err) {
      console.error('Error al cargar datos del Compromiso 3:', err);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en objetivos
  const handleObjetivosChange = (objetivos, tipo) => {
    // Filtrar objetivos del tipo contrario y agregar los nuevos
    const otrosObjetivos = formData.objetivos.filter(o => o.tipoObj !== tipo);
    const updatedObjetivos = [...otrosObjetivos, ...objetivos];
    
    const newData = { ...formData, objetivos: updatedObjetivos };
    setFormData(newData);
    notifyChange(newData);
  };

  // Manejar cambios en situación actual
  const handleSituacionActualChange = (situacionData) => {
    const newData = { 
      ...formData, 
      situacionActual: { ...formData.situacionActual, ...situacionData } 
    };
    setFormData(newData);
    notifyChange(newData);
  };

  // Manejar cambios en proyectos
  const handleProyectosChange = (proyectos) => {
    const newData = { ...formData, proyectos };
    setFormData(newData);
    notifyChange(newData);
  };

  // Notificar cambios al componente padre
  const notifyChange = (data) => {
    if (onDataChange) {
      // Transformar datos al formato esperado por el API
      // Los nombres deben coincidir con CreateCom3EPGDCommand en el backend
      
      // Mapear personal TI al formato del backend
      const personalTIMapped = (data.situacionActual?.personalTI || []).map(p => ({
        personalId: p.personalId || p.pTiId || null,
        nombrePersona: p.nombrePersona || '',
        dni: p.dni || '',
        cargo: p.cargo || '',
        rol: p.rol || '',
        especialidad: p.especialidad || '',
        gradoInstruccion: p.gradoInstruccion || '',
        certificacion: p.certificacion || '',
        acreditadora: p.acreditadora || '',
        codigoCertificacion: p.codigoCertificacion || '',
        colegiatura: p.colegiatura || '',
        emailPersonal: p.emailPersonal || '',
        telefono: p.telefono || '',
        activo: p.activo !== false
      }));

      // Mapear inventario software al formato del backend
      const inventarioSoftwareMapped = (data.situacionActual?.inventarioSoftware || []).map(s => ({
        invSoftId: s.invSoftId || null,
        codProducto: s.codigoSoftware || s.codProducto || '',
        nombreProducto: s.nombreSoftware || s.nombreProducto || '',
        version: s.version || '',
        tipoSoftware: s.tipo || s.tipoSoftware || '',
        cantidadInstalaciones: parseInt(s.cantidadInstalaciones) || 0,
        cantidadLicencias: parseInt(s.cantidadLicencias) || 0,
        excesoDeficiencia: parseInt(s.excesoDeficiencia) || 0,
        costoLicencias: parseFloat(s.costoLicencias) || 0,
        activo: s.activo !== false
      }));

      // Mapear inventario sistemas al formato del backend
      const inventarioSistemasMapped = (data.situacionActual?.inventarioSistemas || []).map(s => ({
        invSiId: s.invSiId || null,
        codigo: s.codigoSistema || s.codigo || '',
        nombreSistema: s.nombreSistema || '',
        descripcion: s.descripcion || '',
        tipoSistema: s.tipoSistema || '',
        lenguajeProgramacion: s.lenguaje || s.lenguajeProgramacion || '',
        baseDatos: s.baseDatos || '',
        plataforma: s.plataforma || '',
        activo: s.activo !== false
      }));

      // Mapear inventario red al formato del backend
      const inventarioRedMapped = (data.situacionActual?.inventarioRed || []).map(r => ({
        invRedId: r.invRedId || null,
        tipoEquipo: r.tipoEquipo || '',
        cantidad: parseInt(r.cantidad) || 0,
        puertosOperativos: parseInt(r.puertosOperativos) || 0,
        puertosInoperativos: parseInt(r.puertosInoperativos) || 0,
        totalPuertos: parseInt(r.totalPuertos) || 0,
        costoMantenimientoAnual: parseFloat(r.costoMantenimiento) || parseFloat(r.costoMantenimientoAnual) || 0,
        observaciones: r.observaciones || '',
        activo: r.activo !== false
      }));

      // Mapear inventario servidores al formato del backend
      const inventarioServidoresMapped = (data.situacionActual?.inventarioServidores || []).map(s => ({
        invSrvId: s.invSrvId || null,
        nombreEquipo: s.nombreEquipo || '',
        tipoEquipo: s.tipoEquipo || '',
        estado: s.estado || '',
        capa: s.capa || '',
        propiedad: s.propiedad || '',
        montaje: s.montaje || '',
        marcaCpu: s.marcaCpu || '',
        modeloCpu: s.modeloCpu || '',
        velocidadGhz: parseFloat(s.velocidadGhz) || null,
        nucleos: parseInt(s.nucleos) || null,
        memoriaGb: parseInt(s.memoriaGb) || null,
        marcaMemoria: s.marcaMemoria || '',
        modeloMemoria: s.modeloMemoria || '',
        cantidadMemoria: parseInt(s.cantidadMemoria) || null,
        costoMantenimientoAnual: parseFloat(s.costoMantenimiento) || parseFloat(s.costoMantenimientoAnual) || 0,
        observaciones: s.observaciones || '',
        activo: s.activo !== false
      }));

      // Mapear seguridad info al formato del backend
      const seguridadInfoMapped = data.situacionActual?.seguridadInfo ? {
        seginfoId: data.situacionActual.seguridadInfo.seginfoId || null,
        planSgsi: data.situacionActual.seguridadInfo.planSgsi || false,
        comiteSeguridad: data.situacionActual.seguridadInfo.comiteSeguridad || false,
        oficialSeguridadEnOrganigrama: data.situacionActual.seguridadInfo.oficialSeguridadEnOrganigrama || false,
        politicaSeguridad: data.situacionActual.seguridadInfo.politicaSeguridad || false,
        inventarioActivos: data.situacionActual.seguridadInfo.inventarioActivos || false,
        analisisRiesgos: data.situacionActual.seguridadInfo.analisisRiesgos || false,
        metodologiaRiesgos: data.situacionActual.seguridadInfo.metodologiaRiesgos || false,
        planContinuidad: data.situacionActual.seguridadInfo.planContinuidad || false,
        programaAuditorias: data.situacionActual.seguridadInfo.programaAuditorias || false,
        informesDireccion: data.situacionActual.seguridadInfo.informesDireccion || false,
        certificacionIso27001: data.situacionActual.seguridadInfo.certificacionIso27001 || false,
        observaciones: data.situacionActual.seguridadInfo.observaciones || '',
        capacitaciones: (data.situacionActual.capacitacionesSeginfo || []).map(c => ({
          capsegId: c.capsegId || null,
          curso: c.curso || '',
          cantidadPersonas: parseInt(c.cantidadPersonas) || 0,
          activo: c.activo !== false
        }))
      } : null;
      
      // Mapear proyectos al formato del backend
      const proyectosMapped = (data.proyectos || []).map(p => ({
        proyEntId: p.proyEntId || null,
        numeracionProy: p.numeracionProy,
        nombre: p.nombre,
        alcance: p.alcance,
        justificacion: p.justificacion || '',
        tipoProy: p.tipoProy,
        areaProy: p.areaProy || '',
        areaEjecuta: p.areaEjecuta,
        tipoBeneficiario: p.tipoBeneficiario || '',
        etapaProyecto: p.etapaProyecto,
        ambitoProyecto: p.ambitoProyecto || '',
        // Campos de fecha - convertir string a ISO
        fecIniProg: p.fecIniProg ? new Date(p.fecIniProg).toISOString() : null,
        fecFinProg: p.fecFinProg ? new Date(p.fecFinProg).toISOString() : null,
        fecIniReal: p.fecIniReal ? new Date(p.fecIniReal).toISOString() : null,
        fecFinReal: p.fecFinReal ? new Date(p.fecFinReal).toISOString() : null,
        alineadoPgd: p.alineadoPgd || '',
        objTranDig: p.objTranDig || '',
        objEst: p.objEst || '',
        accEst: p.accEst || '',
        estadoProyecto: p.estadoProyecto !== false,
        activo: p.activo !== false
      }));

      // Mapear objetivos al formato del backend
      const objetivosMapped = (data.objetivos || []).map(o => ({
        objEntId: o.objEntId || null,
        tipoObj: o.tipoObj || 'E',
        numeracionObj: o.codigo || o.numeracionObj,
        descripcionObjetivo: o.descripcion || o.descripcionObjetivo,
        activo: o.activo !== false,
        acciones: (o.acciones || []).map(a => ({
          accObjEntId: a.accObjEntId || null,
          numeracionAcc: a.codigo || a.numeracionAcc,
          descripcionAccion: a.descripcion || a.descripcionAccion,
          activo: a.activo !== false
        }))
      }));
      
      const apiData = {
        com3EPGDId: data.com3EPGDId,
        entidadId,
        compromisoId: 3,
        etapaFormulario: 'paso1',
        estado: 'bandeja',
        // Header de situación actual - Datos Generales
        fechaReporte: data.situacionActual?.header?.fechaReporte,
        sede: data.situacionActual?.header?.sede,
        observaciones: data.situacionActual?.header?.observaciones,
        // Header de situación actual - Datos del Área TI
        ubicacionAreaTi: data.situacionActual?.header?.ubicacionAreaTi,
        dependenciaAreaTi: data.situacionActual?.header?.dependenciaAreaTi,
        costoAnualTi: parseFloat(data.situacionActual?.header?.costoAnualTi) || null,
        existeComisionGdTi: data.situacionActual?.header?.existeComisionGdTi || false,
        // Listas mapeadas al formato del backend
        personalTI: personalTIMapped,
        inventariosSoftware: inventarioSoftwareMapped,
        inventariosSistemas: inventarioSistemasMapped,
        inventariosRed: inventarioRedMapped,
        inventariosServidores: inventarioServidoresMapped,
        seguridadInfo: seguridadInfoMapped,
        objetivos: objetivosMapped,
        proyectos: proyectosMapped
      };
      onDataChange(apiData);
      
      // Iniciar auto-guardado con debounce
      scheduleAutoSave(apiData);
    }
  };

  // Auto-guardado con debounce
  const scheduleAutoSave = (data) => {
    // Cancelar guardado anterior si existe
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Si ya está guardando, no programar otro
    if (isSavingRef.current) {
      return;
    }

    // No auto-guardar si no hay entidadId (datos incompletos)
    if (!entidadId) {
      return;
    }

    // No auto-guardar si es creación y no hay datos relevantes
    const hasData = 
      (data.objetivos && data.objetivos.length > 0) ||
      (data.proyectos && data.proyectos.length > 0) ||
      (data.situacionActual?.personalTI && data.situacionActual.personalTI.length > 0) ||
      data.situacionActual?.header?.fechaReporte;
    
    if (!data.com3EPGDId && !hasData) {
      // Es una creación nueva sin datos, no guardar aún
      return;
    }

    // Programar guardado en 2 segundos
    saveTimeoutRef.current = setTimeout(() => {
      autoSave(data);
    }, 2000);
  };

  const autoSave = async (data) => {
    // Si está en modo vista, no guardar
    if (viewMode) return;

    // Si ya está guardando, no intentar de nuevo
    if (isSavingRef.current) return;

    // Validar que exista entidadId
    if (!entidadId) {
      console.warn('⚠️ No se puede auto-guardar sin entidadId');
      return;
    }

    try {
      isSavingRef.current = true;

      // Asegurar que el objeto tenga comEntidadId
      const dataToSave = {
        ...data,
        comEntidadId: entidadId
      };

      // Determinar si es crear o actualizar
      const isUpdate = dataToSave.com3EPGDId != null;

      console.log(`🔄 Auto-guardando Com3 (${isUpdate ? 'UPDATE' : 'CREATE'})...`, {
        hasId: !!dataToSave.com3EPGDId,
        objetivos: dataToSave.objetivos?.length || 0,
        proyectos: dataToSave.proyectos?.length || 0
      });

      let response;
      if (isUpdate) {
        response = await com3EPGDService.update(dataToSave.com3EPGDId, dataToSave);
      } else {
        response = await com3EPGDService.create(dataToSave);
      }

      if (response.isSuccess || response.success) {
        // Si era creación, actualizar el ID y notificar al padre
        if (!isUpdate && response.data?.comepgdEntId) {
          const newId = response.data.comepgdEntId;
          setFormData(prev => ({ ...prev, com3EPGDId: newId }));
          
          // IMPORTANTE: Notificar al padre con el nuevo ID
          if (onDataChange) {
            onDataChange({ ...dataToSave, com3EPGDId: newId });
          }
          console.log('✅ Com3 creado con ID:', newId);
        } else {
          console.log('✅ Com3 actualizado exitosamente');
        }
      } else {
        throw new Error(response.message || 'Error al guardar');
      }
    } catch (error) {
      console.error('❌ Error en auto-guardado:', error);
      showErrorToast('Error al guardar automáticamente. Intente nuevamente.');
    } finally {
      isSavingRef.current = false;
    }
  };

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Obtener objetivos por tipo
  const getObjetivosPorTipo = (tipo) => {
    return formData.objetivos.filter(o => o.tipoObj === tipo);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'objetivosEstrategicos':
        return (
          <ObjetivosEstrategicos
            objetivos={getObjetivosPorTipo('E')}
            onObjetivosChange={(objetivos) => handleObjetivosChange(objetivos, 'E')}
            viewMode={viewMode}
          />
        );
      case 'objetivosGD':
        return (
          <ObjetivosGobiernoDigital
            objetivos={getObjetivosPorTipo('G')}
            onObjetivosChange={(objetivos) => handleObjetivosChange(objetivos, 'G')}
            viewMode={viewMode}
          />
        );
      case 'situacionActual':
        return (
          <SituacionActualGD
            data={formData.situacionActual}
            onDataChange={handleSituacionActualChange}
            viewMode={viewMode}
          />
        );
      case 'portafolio':
        return (
          <PortafolioProyectos
            proyectos={formData.proyectos}
            onProyectosChange={handleProyectosChange}
            viewMode={viewMode}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando datos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
        <button 
          onClick={loadDataFromAPI}
          className="ml-4 text-red-800 underline hover:no-underline"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex flex-wrap gap-1 -mb-px" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 border-t border-x border-gray-200 -mb-px'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Compromiso3Paso1;
