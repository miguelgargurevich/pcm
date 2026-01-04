import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import cumplimientoService from '../services/cumplimientoService'; // Solo para uploadDocument
import com1LiderGTDService from '../services/com1LiderGTDService';
import com2CGTDService from '../services/com2CGTDService';
import com3EPGDService from '../services/com3EPGDService';
import com4PEIService from '../services/com4PEIService';
import com5EstrategiaDigitalService from '../services/com5EstrategiaDigitalService';
import com6MigracionGobPeService from '../services/com6MigracionGobPeService';
import com7ImplementacionMPDService from '../services/com7ImplementacionMPDService';
import com8PublicacionTUPAService from '../services/com8PublicacionTUPAService';
import com9ModeloGestionDocumentalService from '../services/com9ModeloGestionDocumentalService';
import com10DatosAbiertosService from '../services/com10DatosAbiertosService';
import com11AportacionGeoPeruService from '../services/com11AportacionGeoPeruService';
import com12ResponsableSoftwarePublicoService from '../services/com12ResponsableSoftwarePublicoService';
import com13InteroperabilidadPIDEService from '../services/com13InteroperabilidadPIDEService';
import com14OficialSeguridadDigitalService from '../services/com14OficialSeguridadDigitalService';
import com15CSIRTInstitucionalService from '../services/com15CSIRTInstitucionalService';
import com16SistemaGestionSeguridadService from '../services/com16SistemaGestionSeguridadService';
import com17PlanTransicionIPv6Service from '../services/com17PlanTransicionIPv6Service';
import com18AccesoPortalTransparenciaService from '../services/com18AccesoPortalTransparenciaService';
import com19EncuestaNacionalGobDigitalService from '../services/com19EncuestaNacionalGobDigitalService';
import com20DigitalizacionServiciosFacilitaService from '../services/com20DigitalizacionServiciosFacilitaService';
import com21OficialGobiernoDatosService from '../services/com21OficialGobiernoDatosService';
import evaluacionCriteriosService from '../services/evaluacionCriteriosService';
import { compromisosService } from '../services/compromisosService';
import { getCatalogoOptions, getConfigValue } from '../services/catalogoService';
import { showSuccessToast, showErrorToast, showConfirmToast } from '../utils/toast.jsx';
import PDFViewer from '../components/PDFViewer';
import Compromiso3Paso1 from '../components/Compromiso3/Compromiso3Paso1';
import { Compromiso10Tabs } from '../components/Compromiso10';
import { FormSkeleton } from '../components/Skeleton';
import { FileText, Upload, X, Check, AlertCircle, ChevronLeft, ChevronRight, Save, Eye, ExternalLink, Plus, Trash2, Edit2, HelpCircle, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import emailService from '../services/emailService';
import emailTemplates from '../services/emailTemplates';

const CumplimientoNormativoDetalle = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = !!id;
  const compromisoIdFromUrl = searchParams.get('compromiso');
  const viewMode = searchParams.get('mode') === 'view'; // Modo solo lectura

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [pasoActual, setPasoActual] = useState(1);
  const [com2RecordId, setCom2RecordId] = useState(null); // ID del registro en com2_cgtd
  const [com3RecordId, setCom3RecordId] = useState(null); // ID del registro en com3_epgd
  const [_com3Data, setCom3Data] = useState(null); // Datos del formulario de Compromiso 3
  const [com4RecordId, setCom4RecordId] = useState(null); // ID del registro en com4_pei
  const [com5RecordId, setCom5RecordId] = useState(null); // ID del registro en com5_estrategia_digital
  const [com6RecordId, setCom6RecordId] = useState(null); // ID del registro en com6_mpgobpe
  const [com7RecordId, setCom7RecordId] = useState(null); // ID del registro en com7_impd
  const [com8RecordId, setCom8RecordId] = useState(null); // ID del registro en com8_ptupa
  const [com9RecordId, setCom9RecordId] = useState(null); // ID del registro en com9_mgd
  const [com10RecordId, setCom10RecordId] = useState(null); // ID del registro en com10_da
  const [com11RecordId, setCom11RecordId] = useState(null); // ID del registro en com11_agp
  const [com12RecordId, setCom12RecordId] = useState(null); // ID del registro en com12_rsp
  const [com13RecordId, setCom13RecordId] = useState(null); // ID del registro en com13_ipide
  const [com14RecordId, setCom14RecordId] = useState(null); // ID del registro en com14_oscd
  const [com15RecordId, setCom15RecordId] = useState(null); // ID del registro en com15_csirt
  const [com16RecordId, setCom16RecordId] = useState(null); // ID del registro en com16_sgsi
  const [com17RecordId, setCom17RecordId] = useState(null); // ID del registro en com17_ptipv6
  const [com18RecordId, setCom18RecordId] = useState(null); // ID del registro en com18_apte
  const [com19RecordId, setCom19RecordId] = useState(null); // ID del registro en com19_enad
  const [com20RecordId, setCom20RecordId] = useState(null); // ID del registro en com20_dsfp
  const [com21RecordId, setCom21RecordId] = useState(null); // ID del registro en com21_ogd
  
  // Estado para Compromiso 2: Miembros del comité
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
  
  const [_compromisos, setCompromisos] = useState([]);
  const [compromisoSeleccionado, setCompromisoSeleccionado] = useState(null);
  const [_datosDBCargados, setDatosDBCargados] = useState(false); // Flag para evitar sobrescribir datos cargados de BD
  const datosDBCargadosRef = useRef(false); // Ref para acceder al valor actual en closures
  const formDataRef = useRef(); // Ref para acceder al valor actual de formData

  // Función para obtener la clase CSS del badge según el estado
  const getEstadoBadgeClass = (estadoId) => {
    const classes = {
      1: 'bg-orange-500 text-white',    // PENDIENTE
      2: 'bg-red-700 text-white',       // SIN REPORTAR
      3: 'bg-gray-400 text-white',      // NO EXIGIBLE
      4: 'bg-yellow-500 text-white',    // EN PROCESO
      5: 'bg-blue-500 text-white',      // ENVIADO
      6: 'bg-purple-500 text-white',    // EN REVISIÓN
      7: 'bg-red-500 text-white',       // OBSERVADO
      8: 'bg-green-500 text-white',     // ACEPTADO
    };
    return classes[estadoId] || 'bg-gray-300 text-gray-700';
  };

  // Función para obtener el nombre del estado
  const getEstadoNombre = (estadoId) => {
    const nombres = {
      1: 'PENDIENTE',
      2: 'SIN REPORTAR',
      3: 'NO EXIGIBLE',
      4: 'EN PROCESO',
      5: 'ENVIADO',
      6: 'EN REVISIÓN',
      7: 'OBSERVADO',
      8: 'ACEPTADO',
    };
    return nombres[estadoId] || 'Desconocido';
  };
  const [pdfUrl, setPdfUrl] = useState(null); // PDF principal (Paso 1)
  const [pdfUrlPaso2, setPdfUrlPaso2] = useState(null); // PDF para Paso 2 (cumplimiento normativo)
  const [pdfAyudaUrl, setPdfAyudaUrl] = useState(null); // PDF de ayuda para llenar el compromiso
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [documentoActualUrl, setDocumentoActualUrl] = useState(null); // URL del documento que se está viendo
  const [haVistoPolitica, setHaVistoPolitica] = useState(false);
  const [haVistoDeclaracion, setHaVistoDeclaracion] = useState(false);

  // Estados para catálogos dinámicos
  const [rolesFuncionario, setRolesFuncionario] = useState([]);
  const [rolesComite, setRolesComite] = useState([]);
  const [loadingCatalogos, setLoadingCatalogos] = useState(true);

  // URLs de los documentos en Supabase Storage (cargadas dinámicamente desde BD)
  const [POLITICA_PRIVACIDAD_URL, setPoliticaPrivacidadUrl] = useState('');
  const [DECLARACION_JURADA_URL, setDeclaracionJuradaUrl] = useState('');

  // Formulario con los 3 pasos
  const [formData, setFormData] = useState({
    // Paso 1: Datos Generales (Com1 - Líder GTD)
    compromisoId: '',
    nroDni: '',
    nombres: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correoElectronico: '',
    telefono: '',
    rol: '',
    cargo: '',
    fechaInicio: '',
    
    // Campos específicos Com4 - PEI
    anioInicio: '',
    anioFin: '',
    fechaAprobacion: '',
    objetivoEstrategico: '',
    descripcionIncorporacion: '',
    alineadoPgd: false,
    
    // Campos específicos Com5 - Estrategia Digital
    nombreEstrategia: '',
    periodoInicio: '',
    periodoFin: '',
    fechaAprobacionEstrategia: '',
    objetivosEstrategicos: '',
    lineasAccion: '',
    estadoImplementacion: '',
    alineadoPgdEstrategia: false,
    
    // Campos específicos Com6 - Migración GOB.PE
    urlPortalGobPe: '',
    fechaMigracion: '',
    fechaUltimaActualizacion: '',
    nombreResponsable: '',
    correoResponsable: '',
    telefonoResponsable: '',
    tipoMigracion: '',
    observacionesMigracion: '',
    
    // Campos específicos Com7 - Implementación MPD
    urlMpd: '',
    fechaImplementacionMpd: '',
    responsableMpd: '',
    cargoResponsableMpd: '',
    correoResponsableMpd: '',
    telefonoResponsableMpd: '',
    tipoMpd: '',
    interoperabilidadMpd: false,
    observacionesMpd: '',
    
    // Campos específicos Com8 - Publicación TUPA
    urlTupa: '',
    numeroResolucionTupa: '',
    fechaAprobacionTupa: '',
    responsableTupa: '',
    cargoResponsableTupa: '',
    correoResponsableTupa: '',
    telefonoResponsableTupa: '',
    actualizadoTupa: false,
    observacionesTupa: '',
    
    // Campos específicos Com9 - Modelo de Gestión Documental
    fechaAprobacionMgd: '',
    numeroResolucionMgd: '',
    responsableMgd: '',
    cargoResponsableMgd: '',
    correoResponsableMgd: '',
    telefonoResponsableMgd: '',
    sistemaPlataformaMgd: '',
    tipoImplantacionMgd: '',
    interoperaSistemasMgd: false,
    observacionesMgd: '',
    
    // Campos específicos Com10 - Datos Abiertos
    urlDatosAbiertos: '',
    totalDatasets: '',
    fechaUltimaActualizacionDa: '',
    responsableDa: '',
    cargoDa: '',
    correoDa: '',
    telefonoDa: '',
    numeroNormaResolucionDa: '',
    fechaAprobacionDa: '',
    observacionesDa: '',
    
    // Campos específicos Com11 - Aportación GeoPeru
    // fechaInicio: '', // Ya definido arriba para Com1
    fechaFin: '',
    serviciosDigitalizados: '',
    serviciosTotal: '',
    porcentajeDigitalizacion: '',
    archivoPlan: '',
    beneficiariosEstimados: '',
    
    // Campos específicos Com12 - Responsable Software Público
    fechaElaboracion: '',
    numeroDocumento: '',
    archivoDocumento: '',
    requisitosSeguridad: '',
    requisitosPrivacidad: '',
    fechaVigencia: '',
    
    // Campos específicos Com13 - Interoperabilidad PIDE
    // fechaAprobacion: '', // Ya definido arriba para Com4
    numeroResolucion: '',
    riesgosIdentificados: '',
    estrategiasMitigacion: '',
    fechaRevision: '',
    responsable: '',
    
    // Campos específicos Com14 - Oficial Seguridad Digital
    politicasSeguridad: '',
    certificaciones: '',
    
    // Campos específicos Com15 - CSIRT Institucional
    fechaConformacion: '',
    emailContacto: '',
    telefonoContacto: '',
    
    // Campos específicos Com16 - Sistema Gestión Seguridad
    fechaImplementacion: '',
    normaAplicable: '',
    certificacion: '',
    fechaCertificacion: '',
    alcance: '',
    
    // Campos específicos Com17 - Plan Transición IPv6
    fechaInicioTransicion: '',
    fechaFinTransicion: '',
    porcentajeAvance: '',
    sistemasMigrados: '',
    sistemasTotal: '',
    
    // Campos específicos Com18 - Acceso Portal Transparencia
    urlPlataforma: '',
    tramitesDisponibles: '',
    usuariosRegistrados: '',
    tramitesProcesados: '',
    
    // Campos específicos Com19 - Encuesta Nacional Gob Digital
    fechaConexion: '',
    tipoConexion: '',
    anchoBanda: '',
    proveedor: '',
    
    // Campos específicos Com20 - Digitalización Servicios Facilita
    sistemasDocumentados: '',
    porcentajeDocumentacion: '',
    
    // Campos específicos Com21 - Oficial Gobierno Datos
    procedimientos: '',
    responsables: '',
    
    // Campo común descripcion para varios compromisos
    descripcion: '',
    
    // Paso 2: Normativa
    documentoFile: null,
    criteriosEvaluados: [], // Array de { criterioId, cumple: boolean }
    
    // Paso 3: Confirmación
    aceptaPoliticaPrivacidad: false,
    aceptaDeclaracionJurada: false,
    
    // Estado
    estado: 1 // Por defecto pendiente
  });

  const [errores, setErrores] = useState({});

  // Definir funciones useCallback antes de los useEffect que las usan
  const loadCompromisos = useCallback(async () => {
    try {
      const response = await compromisosService.getAll();
      if (response.isSuccess || response.IsSuccess) {
        const data = response.data || response.Data || [];
        const compromisosArray = Array.isArray(data) ? data : [];
        setCompromisos(compromisosArray);
        
        // Si viene compromisoId por URL, pre-seleccionarlo
        if (compromisoIdFromUrl) {
          console.log('🔧 Estableciendo compromisoId desde URL:', compromisoIdFromUrl);
          const compromiso = compromisosArray.find(c => c.compromisoId === parseInt(compromisoIdFromUrl));
          console.log('🔍 Compromiso encontrado:', compromiso);
          if (compromiso) {
            setCompromisoSeleccionado(compromiso);
            // NO sobrescribir formData si ya se cargaron datos desde la BD (usar ref para valor actual)
            setFormData(prev => {
              if (datosDBCargadosRef.current) {
                console.log('⏭️ datosDBCargadosRef.current=true, no sobrescribir formData');
                return prev;
              }
              // Si no hay datos de BD pero ya tiene compromisoId correcto, no sobrescribir
              if (prev.compromisoId === compromisoIdFromUrl) {
                console.log('⏭️ formData ya tiene compromisoId correcto');
                return prev;
              }
              console.log('🔧 Estado anterior de formData:', prev);
              const newData = { ...prev, compromisoId: compromisoIdFromUrl };
              console.log('🔧 Nuevo estado de formData:', newData);
              return newData;
            });
          }
        }
        
        // Si está editando, establecer el compromiso seleccionado desde formData
        if (isEdit && formDataRef.current?.compromisoId) {
          const compromiso = compromisosArray.find(c => c.compromisoId === parseInt(formDataRef.current.compromisoId));
          if (compromiso) {
            setCompromisoSeleccionado(compromiso);
          }
        }
      }
    } catch (error) {
      console.error('Error al cargar compromisos:', error);
      showErrorToast('Error al cargar compromisos');
    }
  }, [compromisoIdFromUrl, isEdit]);

  // Función loadCumplimiento declarada más adelante debido a su extensión
  const loadCumplimientoRef = useRef();

  // Helper function para obtener el ID de entidad del usuario de forma consistente
  const getUserEntityId = useCallback(() => {
    const entityId = user?.entidadId || user?.EntidadId || user?.entity_id || user?.id_entidad;
    console.log('🔍 getUserEntityId - user:', user, 'entityId:', entityId);
    return entityId;
  }, [user]);

  const getUserId = useCallback(() => {
    const userId = user?.userId || user?.UserId || user?.user_id || user?.id;
    console.log('🔍 getUserId - user:', user, 'userId:', userId);
    return userId;
  }, [user]);

  const getUserEntityIdForData = useCallback(() => {
    const entityId = user?.EntidadId || user?.entidadId || user?.entity_id || user?.id_entidad;
    console.log('🔍 getUserEntityIdForData - user:', user, 'entityId:', entityId);
    return entityId;
  }, [user]);

  // Cargar catálogos y configuración al montar el componente
  useEffect(() => {
    const loadCatalogos = async () => {
      try {
        // Verificar que las funciones de estado estén disponibles
        if (!setLoadingCatalogos || !setRolesFuncionario || !setRolesComite || !setPoliticaPrivacidadUrl || !setDeclaracionJuradaUrl) {
          console.warn('⚠️ Estado no completamente inicializado, reintentando...');
          setTimeout(loadCatalogos, 100);
          return;
        }
        
        setLoadingCatalogos(true);
        const [funcionario, comite, urlPolitica, urlDeclaracion] = await Promise.all([
          getCatalogoOptions('ROL_FUNCIONARIO'),
          getCatalogoOptions('ROL_COMITE'),
          getConfigValue('CONFIG_DOCUMENTOS', 'URL_POL_PRIVACIDAD'),
          getConfigValue('CONFIG_DOCUMENTOS', 'URL_DECL_JURADA')
        ]);
        
        // Verificar que las respuestas sean válidas antes de actualizar el estado
        if (setRolesFuncionario && Array.isArray(funcionario)) {
          setRolesFuncionario(funcionario);
        }
        if (setRolesComite && Array.isArray(comite)) {
          setRolesComite(comite);
        }
        if (setPoliticaPrivacidadUrl) {
          setPoliticaPrivacidadUrl(urlPolitica || '');
        }
        if (setDeclaracionJuradaUrl) {
          setDeclaracionJuradaUrl(urlDeclaracion || '');
        }
      } catch (error) {
        console.error('Error cargando catálogos:', error);
        // Verificar si es un error de reCAPTCHA y no mostrar toast para ese caso
        if (error.message && !error.message.includes('sitekey') && !error.message.includes('grecaptcha')) {
          showErrorToast('Error al cargar catálogos de roles');
        }
      } finally {
        // Asegurar que se establece como false incluso si hay errores
        if (setLoadingCatalogos) {
          setLoadingCatalogos(false);
        }
      }
    };
    
    // Ejecutar loadCatalogos con manejo de errores
    try {
      loadCatalogos();
    } catch (initError) {
      console.error('Error inicializando carga de catálogos:', initError);
    }
  }, []);

  // Sincronizar ref con formData
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  // Establecer compromisoId inmediatamente cuando viene por URL
  useEffect(() => {
    if (compromisoIdFromUrl && (!formData.compromisoId || formData.compromisoId !== compromisoIdFromUrl)) {
      console.log('🚀 Estableciendo compromisoId inicial desde URL:', compromisoIdFromUrl);
      setFormData(prev => ({ ...prev, compromisoId: compromisoIdFromUrl }));
    }
  }, [compromisoIdFromUrl, formData.compromisoId]);

  useEffect(() => {
    console.log('🔄 useEffect principal ejecutándose - user?.entidadId:', user?.entidadId, 'compromisoIdFromUrl:', compromisoIdFromUrl);
    if (loadCompromisos) loadCompromisos();
    // Cargar datos si está editando O si es Compromiso 1-21 (que usan tablas especiales)
    const userEntityId = getUserEntityId();
    if (isEdit || (['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21'].includes(compromisoIdFromUrl) && userEntityId)) {
      console.log('✅ Condición cumplida, llamando loadCumplimiento()');
      if (loadCumplimientoRef.current) loadCumplimientoRef.current();
    } else {
      console.log('❌ Condición NO cumplida para loadCumplimiento - isEdit:', isEdit, 'compromisoIdFromUrl:', compromisoIdFromUrl, 'userEntityId:', userEntityId);
    }
  }, [id, user?.entidadId, compromisoIdFromUrl, isEdit, loadCompromisos, getUserEntityId]);

  // Establecer compromiso seleccionado cuando ambos datos estén disponibles
  useEffect(() => {
    if (formData.compromisoId && _compromisos.length > 0 && !compromisoSeleccionado) {
      const compromiso = _compromisos.find(c => c.compromisoId === parseInt(formData.compromisoId));
      if (compromiso) {
        setCompromisoSeleccionado(compromiso);
      }
    }
  }, [formData.compromisoId, _compromisos, compromisoSeleccionado]);

  // Cargar PDF de ayuda cuando se selecciona un compromiso
  useEffect(() => {
    const loadPdfAyuda = async () => {
      if (formData.compromisoId) {
        try {
          const columnaId = `PDF_AYUDA_C${formData.compromisoId}`;
          const pdfUrl = await getConfigValue('CONFIG_PDF_AYUDA', columnaId);
          if (pdfUrl) {
            setPdfAyudaUrl(pdfUrl);
            console.log(`📄 PDF de ayuda cargado para Compromiso ${formData.compromisoId}:`, pdfUrl);
          } else {
            setPdfAyudaUrl(null);
            console.log(`ℹ️ No hay PDF de ayuda configurado para Compromiso ${formData.compromisoId}`);
          }
        } catch (error) {
          console.error('Error cargando PDF de ayuda:', error);
          setPdfAyudaUrl(null);
        }
      }
    };
    
    loadPdfAyuda();
  }, [formData.compromisoId]);

  // Cleanup del blob URL al desmontar el componente
  useEffect(() => {
    return () => {
      // Solo limpiar si es un blob URL local
      if (pdfUrl && pdfUrl.startsWith('blob:')) {
        console.log('🧹 Limpiando blob URL al desmontar:', pdfUrl);
        URL.revokeObjectURL(pdfUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Array vacío para que solo se ejecute al desmontar

  // useEffect para actualizar haVistoPolitica y haVistoDeclaracion cuando ya están aceptados
  useEffect(() => {
    if (formData.aceptaPoliticaPrivacidad && !haVistoPolitica) {
      console.log('✅ Auto-marcando política como vista (ya aceptada en formData)');
      setHaVistoPolitica(true);
    }
    if (formData.aceptaDeclaracionJurada && !haVistoDeclaracion) {
      console.log('✅ Auto-marcando declaración como vista (ya aceptada en formData)');
      setHaVistoDeclaracion(true);
    }
  }, [formData.aceptaPoliticaPrivacidad, formData.aceptaDeclaracionJurada, haVistoPolitica, haVistoDeclaracion]);

  // =========================================================================
  // useEffect para cargar criterios desde evaluacion_respuestas_entidad
  // Se ejecuta cuando se carga un compromiso y el usuario tiene entidadId
  // =========================================================================
  useEffect(() => {
    const cargarCriteriosDesdeDB = async () => {
      // Solo cargar si tenemos compromisoId, entidadId y ya no estamos cargando
      const userEntityId = getUserEntityId();
      if (!formData.compromisoId || !userEntityId || loading) {
        console.log('🚫 No se pueden cargar criterios - compromisoId:', formData.compromisoId, 'entidadId:', userEntityId, 'loading:', loading);
        return;
      }
      
      const compromisoIdNum = parseInt(formData.compromisoId);
      if (isNaN(compromisoIdNum) || compromisoIdNum < 1 || compromisoIdNum > 21) {
        return;
      }
      
      console.log('📥 useEffect: Cargando criterios desde DB para compromiso', compromisoIdNum);
      
      try {
        const userEntityId = getUserEntityId();
        const criteriosDB = await loadCriteriosFromDB(userEntityId, compromisoIdNum);
        
        if (criteriosDB && criteriosDB.length > 0) {
          console.log('✅ Criterios cargados desde DB:', criteriosDB);
          setFormData(prev => ({
            ...prev,
            criteriosEvaluados: criteriosDB
          }));
        } else {
          console.log('ℹ️ No hay criterios guardados en DB para este compromiso');
        }
      } catch (error) {
        console.error('❌ Error al cargar criterios desde DB:', error);
      }
    };
    
    cargarCriteriosDesdeDB();
  }, [formData.compromisoId, user, loading, getUserEntityId]);
  // =========================================================================

  // Función auxiliar para cargar datos de Paso 2 y 3 desde las tablas comX
  // Los datos ahora vienen de RutaPdfNormativa, CheckPrivacidad, CheckDdjj en cada tabla comX
  // Los criterios se cargan desde evaluacion_respuestas_entidad
  const loadPaso2y3FromComData = (comData) => {
    if (!comData) return null;
    
    const rutaPdfNormativa = comData.RutaPdfNormativa || comData.rutaPdfNormativa || null;
    const checkPrivacidad = comData.CheckPrivacidad || comData.checkPrivacidad || false;
    const checkDdjj = comData.CheckDdjj || comData.checkDdjj || false;
    
    // Actualizar estados de UI
    setHaVistoPolitica(checkPrivacidad);
    setHaVistoDeclaracion(checkDdjj);
    
    if (rutaPdfNormativa) {
      setPdfUrlPaso2(rutaPdfNormativa);
    }
    
    return {
      aceptaPoliticaPrivacidad: checkPrivacidad,
      aceptaDeclaracionJurada: checkDdjj,
      rutaPdfNormativa,
      criteriosEvaluados: [] // Los criterios se cargan aparte desde loadCriteriosFromDB
    };
  };

  // Función para cargar criterios desde la tabla evaluacion_respuestas_entidad
  const loadCriteriosFromDB = async (entidadId, compromisoId) => {
    try {
      console.log(`📥 Cargando criterios desde DB para entidad ${entidadId}, compromiso ${compromisoId}`);
      
      // Validar que entidadId no sea undefined
      if (!entidadId || entidadId === 'undefined' || entidadId === '00000000-0000-0000-0000-000000000000') {
        console.error('❌ entidadId es undefined o null GUID, no se puede cargar criterios');
        throw new Error('ID de entidad no válido');
      }
      
      const response = await evaluacionCriteriosService.getCriterios(entidadId, compromisoId);
      
      if (response.success && response.data?.criterios) {
        // Convertir al formato del formData: solo los criterios que cumplen
        const criteriosEvaluados = response.data.criterios
          .filter(c => c.cumple)
          .map(c => ({
            criterioId: c.criterioEvaluacionId,
            cumple: c.cumple
          }));
        
        console.log('✅ Criterios cargados desde DB:', criteriosEvaluados);
        return criteriosEvaluados;
      }
      
      return [];
    } catch (error) {
      console.error('Error al cargar criterios desde DB:', error);
      return [];
    }
  };

  // Función para guardar criterios en la tabla evaluacion_respuestas_entidad
  const saveCriteriosToDB = async (entidadId, compromisoId, criteriosEvaluados) => {
    try {
      console.log(`📤 Guardando criterios en DB para entidad ${entidadId}, compromiso ${compromisoId}`);
      console.log('📋 Criterios a guardar:', criteriosEvaluados);
      
      // Validar que entidadId no sea undefined o null GUID
      if (!entidadId || entidadId === 'undefined' || entidadId === '00000000-0000-0000-0000-000000000000') {
        console.error('❌ entidadId es undefined o null GUID, no se puede guardar criterios');
        throw new Error('ID de entidad no válido');
      }
      
      const response = await evaluacionCriteriosService.saveCriterios(entidadId, compromisoId, criteriosEvaluados);
      
      if (response.success) {
        console.log('✅ Criterios guardados exitosamente en DB');
        return true;
      } else {
        console.error('❌ Error al guardar criterios:', response.message);
        return false;
      }
    } catch (error) {
      console.error('Error al guardar criterios en DB:', error);
      return false;
    }
  };

  const loadCumplimiento = useCallback(async () => {
    try {
      setLoading(true);
      
      // Si es Compromiso 1 o 2 y tenemos entidadId, usar API específica
      const compromisoId = parseInt(compromisoIdFromUrl || formDataRef.current?.compromisoId);
      console.log('🔍 loadCumplimiento - compromisoId:', compromisoId);
      console.log('🔍 loadCumplimiento - user:', user);
      console.log('🔍 loadCumplimiento - compromisoIdFromUrl:', compromisoIdFromUrl);
      
      // COMPROMISO 1: Líder GTD (Usar tabla com1_liderg_td)
      const userEntityId = getUserEntityId();
      if (compromisoId === 1 && userEntityId) {
        console.log('📞 Llamando Com1LiderGTD.getByEntidad con:', 1, userEntityId);
        const response = await com1LiderGTDService.getByEntidad(1, userEntityId);
        console.log('📦 Respuesta de Com1 getByEntidad:', response);
        
        if (response.isSuccess || response.success) {
          const data = response.data;
          console.log('📄 Datos Com1 recibidos:', data);
          
          if (data) {
            setCom4RecordId(data.comlgtdEntId); // Usar com4RecordId para almacenar el ID
            
            // Cargar datos de cumplimiento_normativo (sección 2 y 3, incluye criterios)
            const cumplimientoData = loadPaso2y3FromComData(data);
            console.log('✅ Datos cumplimiento retornados:', cumplimientoData);
            
            const newFormData = {
              compromisoId: '1',
              nroDni: data.dniLider || '',
              nombres: data.nombreLider || '',
              apellidoPaterno: data.apePatLider || '',
              apellidoMaterno: data.apeMatLider || '',
              correoElectronico: data.emailLider || '',
              telefono: data.telefonoLider || '',
              rol: data.rolLider || '',
              cargo: data.cargoLider || '',
              fechaInicio: data.fecIniLider ? data.fecIniLider.split('T')[0] : '',
              documentoFile: null,
              criteriosEvaluados: cumplimientoData?.criteriosEvaluados || [],
              // Integrar validaciones y aceptaciones desde cumplimiento_normativo
              validacionResolucionAutoridad: cumplimientoData?.validacionResolucionAutoridad || false,
              validacionLiderFuncionario: cumplimientoData?.validacionLiderFuncionario || false,
              validacionDesignacionArticulo: cumplimientoData?.validacionDesignacionArticulo || false,
              validacionFuncionesDefinidas: cumplimientoData?.validacionFuncionesDefinidas || false,
              aceptaPoliticaPrivacidad: cumplimientoData?.AceptaPoliticaPrivacidad || cumplimientoData?.aceptaPoliticaPrivacidad || false,
              aceptaDeclaracionJurada: cumplimientoData?.AceptaDeclaracionJurada || cumplimientoData?.aceptaDeclaracionJurada || false,
              estado: data.estado === 'pendiente' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            };
            console.log('🎯 FormData que se va a establecer para Com1:', newFormData);
            console.log('🎯 Específicamente criteriosEvaluados:', newFormData.criteriosEvaluados);
            console.log('🎯 Checks - aceptaPoliticaPrivacidad:', newFormData.aceptaPoliticaPrivacidad);
            console.log('🎯 Checks - aceptaDeclaracionJurada:', newFormData.aceptaDeclaracionJurada);
            setFormData(newFormData);
            
            // Si los checks ya están aceptados, marcar como vistos
            if (newFormData.aceptaPoliticaPrivacidad) {
              console.log('✅ Marcando política como vista (ya aceptada)');
              setHaVistoPolitica(true);
            }
            if (newFormData.aceptaDeclaracionJurada) {
              console.log('✅ Marcando declaración como vista (ya aceptada)');
              setHaVistoDeclaracion(true);
            }
            
            // Si hay documento guardado, establecer la URL para Paso 1
            if (data.urlDocPcm) {
              console.log('📄 Cargando PDF del Líder GTD desde:', data.urlDocPcm);
              setPdfUrl(data.urlDocPcm);
            }
            
            // Si hay documento de Paso 2 (Normativa), establecer la URL
            if (data.rutaPdfNormativa) {
              console.log('📄 Cargando PDF de Normativa (Paso 2) desde:', data.rutaPdfNormativa);
              setPdfUrlPaso2(data.rutaPdfNormativa);
            }
            
            // Marcar que los datos de BD fueron cargados
            datosDBCargadosRef.current = true;
            setDatosDBCargados(true);
          } else {
            // No existe registro, inicializar con el compromisoId correcto
            setFormData(prev => ({ ...prev, compromisoId: compromisoId.toString() }));
          }
          setLoading(false);
          return;
        }
      }
      
      // COMPROMISO 2: Comité GTD (Usar tabla com2_cgtd para Paso 1)
      if (compromisoId === 2 && userEntityId) {
        console.log('📞 Llamando Com2CGTD.getByEntidad con:', 2, userEntityId);
        const response = await com2CGTDService.getByEntidad(2, userEntityId);
        console.log('📦 Respuesta de Com2 getByEntidad:', response);
        
        if (response.isSuccess || response.success) {
          const data = response.data;
          console.log('📄 Datos Com2 recibidos:', data);
          
          if (data) {
            setCom2RecordId(data.comcgtdEntId || data.ComcgtdEntId);
            
            // Cargar miembros del comité (Paso 1)
            // El backend devuelve Miembros (PascalCase), transformar a camelCase para el frontend
            const miembrosData = data.miembros || data.Miembros || [];
            if (miembrosData && Array.isArray(miembrosData)) {
              console.log('👥 Miembros cargados (raw):', miembrosData);
              // Transformar de PascalCase a camelCase
              const miembrosTransformados = miembrosData.map(m => ({
                miembroId: m.miembroId || m.MiembroId,
                dni: m.dni || m.Dni,
                nombre: m.nombre || m.Nombre,
                apellidoPaterno: m.apellidoPaterno || m.ApellidoPaterno,
                apellidoMaterno: m.apellidoMaterno || m.ApellidoMaterno,
                cargo: m.cargo || m.Cargo,
                email: m.email || m.Email,
                telefono: m.telefono || m.Telefono,
                rol: m.rol || m.Rol,
                activo: m.activo !== undefined ? m.activo : m.Activo
              }));
              console.log('👥 Miembros transformados:', miembrosTransformados);
              setMiembrosComite(miembrosTransformados);
            }
            
            // Cargar datos de cumplimiento_normativo (sección 2 y 3)
            const cumplimientoData = loadPaso2y3FromComData(data);
            console.log('✅ Datos cumplimiento retornados:', cumplimientoData);
            
            // Establecer formData completo (IDÉNTICO a Com1)
            setFormData({
              compromisoId: '2',
              nroDni: '',
              nombres: '',
              apellidoPaterno: '',
              apellidoMaterno: '',
              correoElectronico: '',
              telefono: '',
              rol: '',
              cargo: '',
              fechaInicio: '',
              documentoFile: null,
              criteriosEvaluados: cumplimientoData?.criteriosEvaluados || [],
              // Integrar validaciones y aceptaciones desde cumplimiento_normativo
              validacionResolucionAutoridad: cumplimientoData?.validacionResolucionAutoridad || false,
              validacionLiderFuncionario: cumplimientoData?.validacionLiderFuncionario || false,
              validacionDesignacionArticulo: cumplimientoData?.validacionDesignacionArticulo || false,
              validacionFuncionesDefinidas: cumplimientoData?.validacionFuncionesDefinidas || false,
              aceptaPoliticaPrivacidad: cumplimientoData?.AceptaPoliticaPrivacidad || cumplimientoData?.aceptaPoliticaPrivacidad || false,
              aceptaDeclaracionJurada: cumplimientoData?.AceptaDeclaracionJurada || cumplimientoData?.aceptaDeclaracionJurada || false,
              estado: data.estado === 'pendiente' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            });
            
            // Si hay documento guardado en com2_cgtd, establecer la URL para Paso 1
            if (data.urlDocPcm) {
              console.log('📄 Cargando PDF del Comité GTD desde:', data.urlDocPcm);
              setPdfUrl(data.urlDocPcm);
            }
            
            // Si hay documento de Paso 2 (Normativa), establecer la URL
            if (data.rutaPdfNormativa) {
              console.log('📄 Cargando PDF de Normativa (Paso 2) desde:', data.rutaPdfNormativa);
              setPdfUrlPaso2(data.rutaPdfNormativa);
            }
            
            // Marcar que los datos de BD fueron cargados
            datosDBCargadosRef.current = true;
            setDatosDBCargados(true);
          } else {
            // No existe registro, inicializar con el compromisoId correcto
            setFormData(prev => ({ ...prev, compromisoId: compromisoId.toString() }));
            setMiembrosComite([]);
          }
          setLoading(false);
          return;
        }
      }

      // COMPROMISO 3: Plan de Gobierno Digital (Usar tabla com3_epgd)
      if (compromisoId === 3 && user?.entidadId) {
        console.log('📞 Llamando Com3EPGD.getByEntidad con:', getUserEntityId());
        try {
          const response = await com3EPGDService.getByEntidad(getUserEntityId());
          console.log('📦 Respuesta de Com3 getByEntidad:', response);
          
          if (response.isSuccess || response.success) {
            const data = response.data;
            console.log('📄 Datos Com3 EPGD recibidos:', data);
            
            if (data) {
              // Guardar el ID del registro (el backend devuelve comepgdEntId)
              const recordId = data.comepgdEntId || data.com3EPGDId;
              console.log('🔑 Com3 Record ID encontrado:', recordId);
              setCom3RecordId(recordId);
              
              // Guardar los datos completos para el componente
              setCom3Data({
                objetivosEstrategicos: data.objetivosEstrategicos || [],
                objetivosGobiernoDigital: data.objetivosGobiernoDigital || [],
                situacionActual: data.situacionActual || {},
                portafolioProyectos: data.portafolioProyectos || []
              });
              
              // Cargar datos de cumplimiento_normativo (sección 2 y 3, incluye criterios)
              const cumplimientoData = loadPaso2y3FromComData(data);
              console.log('✅ Datos cumplimiento retornados para Com3:', cumplimientoData);
              
              setFormData({
                compromisoId: '3',
                documentoFile: null,
                criteriosEvaluados: cumplimientoData?.criteriosEvaluados || [],
                aceptaPoliticaPrivacidad: cumplimientoData?.AceptaPoliticaPrivacidad || cumplimientoData?.aceptaPoliticaPrivacidad || false,
                aceptaDeclaracionJurada: cumplimientoData?.AceptaDeclaracionJurada || cumplimientoData?.aceptaDeclaracionJurada || false,
                estado: data.estado || 1
              });
              
              // Marcar que los datos de BD fueron cargados
              datosDBCargadosRef.current = true;
              setDatosDBCargados(true);
            } else {
              // No existe registro, inicializar con el compromisoId correcto
              setFormData(prev => ({ ...prev, compromisoId: compromisoId.toString() }));
              setCom3Data({
                objetivosEstrategicos: [],
                objetivosGobiernoDigital: [],
                situacionActual: {},
                portafolioProyectos: []
              });
            }
          } else {
            // Error o no encontrado, inicializar con el compromisoId correcto
            setFormData(prev => ({ ...prev, compromisoId: compromisoId.toString() }));
            setCom3Data({
              objetivosEstrategicos: [],
              objetivosGobiernoDigital: [],
              situacionActual: {},
              portafolioProyectos: []
            });
          }
        } catch (error) {
          console.error('❌ Error cargando datos Com3:', error);
          setFormData(prev => ({ ...prev, compromisoId: compromisoId.toString() }));
          setCom3Data({
            objetivosEstrategicos: [],
            objetivosGobiernoDigital: [],
            situacionActual: {},
            portafolioProyectos: []
          });
        }
        setLoading(false);
        return;
      }
      
      // COMPROMISO 4: Incorporar TD en el PEI
      if (compromisoId === 4 && user?.entidadId) {
        console.log('📞 Llamando getByEntidad con:', 4, getUserEntityId());
        const response = await com4PEIService.getByEntidad(4, getUserEntityId());
        console.log('📦 Respuesta de getByEntidad:', response);
        
        if (response.isSuccess || response.success) {
          const data = response.data;
          console.log('📄 Datos recibidos:', data);
          
          if (data) {
            setCom4RecordId(data.comtdpeiEntId);
            
            // Cargar datos de cumplimiento_normativo (sección 2 y 3, incluye criterios)
            const cumplimientoData = loadPaso2y3FromComData(data);
            console.log('✅ Datos cumplimiento retornados para Com4:', cumplimientoData);
            
            const newFormData = {
              compromisoId: '4',
              anioInicio: data.anioInicioPei || '',
              anioFin: data.anioFinPei || '',
              fechaAprobacion: data.fechaAprobacionPei ? data.fechaAprobacionPei.split('T')[0] : '',
              objetivoEstrategico: data.objetivoPei || '',
              descripcionIncorporacion: data.descripcionPei || '',
              alineadoPgd: data.alineadoPgd || false,
              documentoFile: null,
              criteriosEvaluados: cumplimientoData?.criteriosEvaluados || [],
              aceptaPoliticaPrivacidad: data.checkPrivacidad || cumplimientoData?.AceptaPoliticaPrivacidad || cumplimientoData?.aceptaPoliticaPrivacidad || cumplimientoData?.acepta_politica_privacidad || false,
              aceptaDeclaracionJurada: data.checkDdjj || cumplimientoData?.AceptaDeclaracionJurada || cumplimientoData?.aceptaDeclaracionJurada || cumplimientoData?.acepta_declaracion_jurada || false,
              estado: data.estado === 'pendiente' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            };
            console.log('🎯 FormData que se va a establecer para Com4:', newFormData);
            setFormData(newFormData);
            
            setHaVistoPolitica(data.checkPrivacidad || cumplimientoData?.AceptaPoliticaPrivacidad || cumplimientoData?.aceptaPoliticaPrivacidad || cumplimientoData?.acepta_politica_privacidad || false);
            setHaVistoDeclaracion(data.checkDdjj || cumplimientoData?.AceptaDeclaracionJurada || cumplimientoData?.aceptaDeclaracionJurada || cumplimientoData?.acepta_declaracion_jurada || false);
            
            // Marcar que los datos de BD fueron cargados
            datosDBCargadosRef.current = true;
            setDatosDBCargados(true);
            
            // Si hay documento guardado, establecer la URL para vista previa (Paso 1)
            console.log('🔍 DEBUG - Datos completos de Com4:', data);
            const pdfUrlPei = data.rutaPdfPei || data.RutaPdfPei || null;
            console.log('🔍 DEBUG - pdfUrlPei encontrado:', pdfUrlPei);
            
            if (pdfUrlPei) {
              console.log('📄 Cargando PDF del PEI (Paso 1) desde:', pdfUrlPei);
              setPdfUrl(pdfUrlPei);
              console.log('✅ pdfUrl actualizado a:', pdfUrlPei);
            } else {
              console.log('⚠️ No hay rutaPdfPei/RutaPdfPei en los datos');
              console.log('⚠️ Claves disponibles en data:', Object.keys(data));
            }
          } else {
            // No existe registro, inicializar con el compromisoId correcto
            setFormData(prev => ({ ...prev, compromisoId: compromisoId.toString() }));
          }
          setLoading(false);
          return;
        }
      }
      
      // COMPROMISO 5: Estrategia Digital
      if (compromisoId === 5 && user?.entidadId) {
        console.log('📞 Llamando getByEntidad con:', 5, getUserEntityId());
        const response = await com5EstrategiaDigitalService.getByEntidad(5, getUserEntityId());
        console.log('📦 Respuesta de getByEntidad:', response);
        
        if (response.isSuccess || response.success) {
          const data = response.data;
          console.log('📄 Datos recibidos:', data);
          
          if (data) {
            setCom5RecordId(data.comdedEntId);
            
            // Cargar criterios evaluados desde cumplimiento_normativo
            const cumplimientoData = loadPaso2y3FromComData(data);
            
            setFormData({
              compromisoId: '5',
              nombreEstrategia: data.nombreEstrategia || '',
              anioInicio: data.periodoInicioEstrategia || '',
              anioFin: data.periodoFinEstrategia || '',
              fechaAprobacion: data.fechaAprobacionEstrategia ? data.fechaAprobacionEstrategia.split('T')[0] : '',
              objetivosEstrategicos: data.objetivosEstrategicos || '',
              lineasAccion: data.lineasAccion || '',
              alineadoPgd: data.alineadoPgdEstrategia || false,
              estadoImplementacion: data.estadoImplementacionEstrategia || '',
              documentoFile: null,
              criteriosEvaluados: cumplimientoData?.criteriosEvaluados || [],
              aceptaPoliticaPrivacidad: data.checkPrivacidad || cumplimientoData?.aceptaPoliticaPrivacidad || cumplimientoData?.acepta_politica_privacidad || false,
              aceptaDeclaracionJurada: data.checkDdjj || cumplimientoData?.aceptaDeclaracionJurada || cumplimientoData?.acepta_declaracion_jurada || false,
              estado: data.estado === 'pendiente' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            });
            
            setHaVistoPolitica(data.checkPrivacidad || cumplimientoData?.aceptaPoliticaPrivacidad || cumplimientoData?.acepta_politica_privacidad || false);
            setHaVistoDeclaracion(data.checkDdjj || cumplimientoData?.aceptaDeclaracionJurada || cumplimientoData?.acepta_declaracion_jurada || false);
            
            // Si hay documento guardado, establecer la URL para vista previa (Paso 1)
            if (data.rutaPdfEstrategia) {
              console.log('📄 Cargando PDF de Estrategia (Paso 1) desde:', data.rutaPdfEstrategia);
              setPdfUrl(data.rutaPdfEstrategia);
            }
            
            // Si hay documento de Paso 2 (Normativa), establecer la URL
            if (data.rutaPdfNormativa) {
              console.log('📄 Cargando PDF de Normativa (Paso 2) desde:', data.rutaPdfNormativa);
              setPdfUrlPaso2(data.rutaPdfNormativa);
            }
            
            // Marcar que los datos de BD fueron cargados
            datosDBCargadosRef.current = true;
            setDatosDBCargados(true);
          } else {
            // No existe registro, inicializar con el compromisoId correcto
            setFormData(prev => ({ ...prev, compromisoId: compromisoId.toString() }));
          }
          setLoading(false);
          return;
        }
      }
      
      // COMPROMISO 6: Migración GOB.PE
      if (compromisoId === 6 && user?.entidadId) {
        console.log('📞 Llamando getByEntidad con:', 6, getUserEntityId());
        const response = await com6MigracionGobPeService.getByEntidad(6, getUserEntityId());
        console.log('📦 Respuesta de getByEntidad:', response);
        console.log('🔍 CHECKPOINT 1 - Antes del if (response.isSuccess || response.success)');
        console.log('🔍 response.isSuccess:', response.isSuccess);
        console.log('🔍 response.success:', response.success);
        
        if (response.isSuccess || response.success) {
          console.log('🔍 CHECKPOINT 2 - Dentro del if (response.isSuccess || response.success)');
          const data = response.data;
          console.log('📄 Datos recibidos:', data);
          console.log('🔍 Verificando if (data):', !!data);
          console.log('🔍 Tipo de data:', typeof data);
          console.log('🔍 Claves de data:', data ? Object.keys(data) : 'N/A');
          
          if (data) {
            console.log('✅ Entrando al bloque if (data) para Com6');
            setCom6RecordId(data.commpgobpeEntId);
            
            // Cargar criterios evaluados desde cumplimiento_normativo
            const cumplimientoData = loadPaso2y3FromComData(data);
            
            console.log('🔧 Datos a establecer en formData para Com6:', {
              urlPortalGobPe: data.urlGobPe,
              fechaMigracion: data.fechaMigracionGobPe,
              fechaUltimaActualizacion: data.fechaActualizacionGobPe,
              nombreResponsable: data.responsableGobPe,
              correoResponsable: data.correoResponsableGobPe,
              telefonoResponsable: data.telefonoResponsableGobPe,
              tipoMigracion: data.tipoMigracionGobPe,
              observacionesMigracion: data.observacionGobPe
            });
            
            setFormData({
              compromisoId: '6',
              urlPortalGobPe: data.urlGobPe || '',
              fechaMigracion: data.fechaMigracionGobPe ? data.fechaMigracionGobPe.split('T')[0] : '',
              fechaUltimaActualizacion: data.fechaActualizacionGobPe ? data.fechaActualizacionGobPe.split('T')[0] : '',
              nombreResponsable: data.responsableGobPe || '',
              correoResponsable: data.correoResponsableGobPe || '',
              telefonoResponsable: data.telefonoResponsableGobPe || '',
              tipoMigracion: data.tipoMigracionGobPe || '',
              observacionesMigracion: data.observacionGobPe || '',
              documentoFile: null,
              criteriosEvaluados: cumplimientoData?.criteriosEvaluados || [],
              aceptaPoliticaPrivacidad: data.checkPrivacidad || false,
              aceptaDeclaracionJurada: data.checkDdjj || false,
              estado: data.estado === 'pendiente' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            });
            
            console.log('✅ formData establecido para Com6');
            
            setHaVistoPolitica(data.checkPrivacidad);
            setHaVistoDeclaracion(data.checkDdjj);
            
            // Si hay documento guardado, establecer la URL para vista previa (Paso 1)
            if (data.rutaPdfGobPe) {
              console.log('📄 Cargando PDF de GOB.PE (Paso 1) desde:', data.rutaPdfGobPe);
              setPdfUrl(data.rutaPdfGobPe);
            }
            
            // Si hay documento de Paso 2 (Normativa), establecer la URL
            if (data.rutaPdfNormativa) {
              console.log('📄 Cargando PDF de Normativa (Paso 2) desde:', data.rutaPdfNormativa);
              setPdfUrlPaso2(data.rutaPdfNormativa);
            }
            
            // Marcar que los datos de BD fueron cargados
            datosDBCargadosRef.current = true;
            setDatosDBCargados(true);
          } else {
            // No existe registro, inicializar con el compromisoId correcto
            setFormData(prev => ({ ...prev, compromisoId: compromisoId.toString() }));
          }
          setLoading(false);
          return;
        }
      }
      
      // COMPROMISO 7: Implementación MPD
      if (compromisoId === 7 && user?.entidadId) {
        console.log('📞 Llamando getByEntidad con:', 7, getUserEntityId());
        const response = await com7ImplementacionMPDService.getByEntidad(7, getUserEntityId());
        console.log('📦 Respuesta de getByEntidad:', response);
        
        if (response.isSuccess || response.success) {
          const data = response.data;
          console.log('📄 Datos recibidos:', data);
          
          if (data) {
            setCom7RecordId(data.comimpdEntId);
            
            // Cargar criterios evaluados desde cumplimiento_normativo
            const cumplimientoData = loadPaso2y3FromComData(data);
            
            setFormData({
              compromisoId: '7',
              urlMpd: data.urlMpd || '',
              fechaImplementacionMpd: data.fechaImplementacionMpd ? data.fechaImplementacionMpd.split('T')[0] : '',
              responsableMpd: data.responsableMpd || '',
              cargoResponsableMpd: data.cargoResponsableMpd || '',
              correoResponsableMpd: data.correoResponsableMpd || '',
              telefonoResponsableMpd: data.telefonoResponsableMpd || '',
              tipoMpd: data.tipoMpd || '',
              interoperabilidadMpd: data.interoperabilidadMpd || false,
              observacionMpd: data.observacionMpd || '',
              documentoFile: null,
              criteriosEvaluados: cumplimientoData?.criteriosEvaluados || [],
              aceptaPoliticaPrivacidad: data.checkPrivacidad || cumplimientoData?.aceptaPoliticaPrivacidad || cumplimientoData?.acepta_politica_privacidad || false,
              aceptaDeclaracionJurada: data.checkDdjj || cumplimientoData?.aceptaDeclaracionJurada || cumplimientoData?.acepta_declaracion_jurada || false,
              estado: data.estado === 'pendiente' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            });
            
            setHaVistoPolitica(data.checkPrivacidad || cumplimientoData?.aceptaPoliticaPrivacidad || cumplimientoData?.acepta_politica_privacidad || false);
            setHaVistoDeclaracion(data.checkDdjj || cumplimientoData?.aceptaDeclaracionJurada || cumplimientoData?.acepta_declaracion_jurada || false);
            
            // Si hay documento guardado, establecer la URL para vista previa (Paso 1)
            if (data.rutaPdfMpd) {
              console.log('📄 Cargando PDF de MPD (Paso 1) desde:', data.rutaPdfMpd);
              setPdfUrl(data.rutaPdfMpd);
            }
            
            // Si hay documento de Paso 2 (Normativa), establecer la URL
            if (data.rutaPdfNormativa) {
              console.log('📄 Cargando PDF de Normativa (Paso 2) desde:', data.rutaPdfNormativa);
              setPdfUrlPaso2(data.rutaPdfNormativa);
            }
            
            // Marcar que los datos de BD fueron cargados
            datosDBCargadosRef.current = true;
            setDatosDBCargados(true);
          } else {
            // No existe registro, inicializar con el compromisoId correcto
            setFormData(prev => ({ ...prev, compromisoId: compromisoId.toString() }));
          }
          setLoading(false);
          return;
        }
      }
      
      // COMPROMISO 8: Publicación TUPA
      if (compromisoId === 8 && user?.entidadId) {
        console.log('📞 Llamando getByEntidad con:', 8, getUserEntityId());
        const response = await com8PublicacionTUPAService.getByEntidad(8, getUserEntityId());
        console.log('📦 Respuesta de getByEntidad:', response);
        
        if (response.isSuccess || response.success) {
          const data = response.data;
          console.log('📄 Datos recibidos:', data);
          
          if (data) {
            setCom8RecordId(data.comptupaEntId);
            
            // Cargar criterios evaluados desde cumplimiento_normativo
            const cumplimientoData = loadPaso2y3FromComData(data);
            
            setFormData({
              compromisoId: '8',
              urlTupa: data.urlTupa || '',
              numeroResolucionTupa: data.numeroResolucionTupa || '',
              fechaAprobacionTupa: data.fechaAprobacionTupa ? data.fechaAprobacionTupa.split('T')[0] : '',
              responsableTupa: data.responsableTupa || '',
              cargoResponsableTupa: data.cargoResponsableTupa || '',
              correoResponsableTupa: data.correoResponsableTupa || '',
              telefonoResponsableTupa: data.telefonoResponsableTupa || '',
              actualizadoTupa: data.actualizadoTupa || false,
              observacionesTupa: data.observacionTupa || '',
              documentoFile: null,
              criteriosEvaluados: cumplimientoData?.criteriosEvaluados || [],
              aceptaPoliticaPrivacidad: data.checkPrivacidad || cumplimientoData?.aceptaPoliticaPrivacidad || cumplimientoData?.acepta_politica_privacidad || false,
              aceptaDeclaracionJurada: data.checkDdjj || cumplimientoData?.aceptaDeclaracionJurada || cumplimientoData?.acepta_declaracion_jurada || false,
              estado: data.estado === 'pendiente' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            });
            
            setHaVistoPolitica(data.checkPrivacidad || cumplimientoData?.aceptaPoliticaPrivacidad || cumplimientoData?.acepta_politica_privacidad || false);
            setHaVistoDeclaracion(data.checkDdjj || cumplimientoData?.aceptaDeclaracionJurada || cumplimientoData?.acepta_declaracion_jurada || false);
            
            // Si hay documento guardado, establecer la URL para vista previa (Paso 1)
            if (data.rutaPdfTupa) {
              console.log('📄 Cargando PDF de TUPA (Paso 1) desde:', data.rutaPdfTupa);
              setPdfUrl(data.rutaPdfTupa);
            }
            
            // Si hay documento de Paso 2 (Normativa), establecer la URL
            if (data.rutaPdfNormativa) {
              console.log('📄 Cargando PDF de Normativa (Paso 2) desde:', data.rutaPdfNormativa);
              setPdfUrlPaso2(data.rutaPdfNormativa);
            }
            
            // Marcar que los datos de BD fueron cargados
            datosDBCargadosRef.current = true;
            setDatosDBCargados(true);
          } else {
            // No existe registro, inicializar con el compromisoId correcto
            setFormData(prev => ({ ...prev, compromisoId: compromisoId.toString() }));
          }
          setLoading(false);
          return;
        }
      }
      
      // COMPROMISO 9: Modelo de Gestión Documental
      if (compromisoId === 9 && user?.entidadId) {
        console.log('📞 Llamando getByEntidad con:', 9, getUserEntityId());
        const response = await com9ModeloGestionDocumentalService.getByEntidad(9, getUserEntityId());
        console.log('📦 Respuesta de getByEntidad:', response);
        
        if (response.isSuccess || response.success) {
          const data = response.data;
          console.log('📄 Datos recibidos:', data);
          
          if (data) {
            setCom9RecordId(data.commgdEntId);
            
            // Cargar criterios evaluados desde cumplimiento_normativo
            const cumplimientoData = loadPaso2y3FromComData(data);
            
            setFormData({
              compromisoId: '9',
              fechaAprobacionMgd: data.fechaAprobacionMgd ? data.fechaAprobacionMgd.split('T')[0] : '',
              numeroResolucionMgd: data.numeroResolucionMgd || '',
              responsableMgd: data.responsableMgd || '',
              cargoResponsableMgd: data.cargoResponsableMgd || '',
              correoResponsableMgd: data.correoResponsableMgd || '',
              telefonoResponsableMgd: data.telefonoResponsableMgd || '',
              sistemaPlataformaMgd: data.sistemaPlataformaMgd || '',
              tipoImplantacionMgd: data.tipoImplantacionMgd || '',
              interoperaSistemasMgd: data.interoperaSistemasMgd || false,
              observacionesMgd: data.observacionMgd || '',
              documentoFile: null,
              criteriosEvaluados: cumplimientoData?.criteriosEvaluados || [],
              aceptaPoliticaPrivacidad: data.checkPrivacidad || cumplimientoData?.aceptaPoliticaPrivacidad || cumplimientoData?.acepta_politica_privacidad || false,
              aceptaDeclaracionJurada: data.checkDdjj || cumplimientoData?.aceptaDeclaracionJurada || cumplimientoData?.acepta_declaracion_jurada || false,
              estado: data.estado === 'pendiente' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            });
            
            setHaVistoPolitica(data.checkPrivacidad || cumplimientoData?.aceptaPoliticaPrivacidad || cumplimientoData?.acepta_politica_privacidad || false);
            setHaVistoDeclaracion(data.checkDdjj || cumplimientoData?.aceptaDeclaracionJurada || cumplimientoData?.acepta_declaracion_jurada || false);
            
            // Si hay documento guardado, establecer la URL para vista previa (Paso 1)
            if (data.rutaPdfMgd) {
              console.log('📄 Cargando PDF de MGD (Paso 1) desde:', data.rutaPdfMgd);
              setPdfUrl(data.rutaPdfMgd);
            }
            
            // Si hay documento de Paso 2 (Normativa), establecer la URL
            if (data.rutaPdfNormativa) {
              console.log('📄 Cargando PDF de Normativa (Paso 2) desde:', data.rutaPdfNormativa);
              setPdfUrlPaso2(data.rutaPdfNormativa);
            }
            
            // Marcar que los datos de BD fueron cargados
            datosDBCargadosRef.current = true;
            setDatosDBCargados(true);
          } else {
            // No existe registro, inicializar con el compromisoId correcto
            setFormData(prev => ({ ...prev, compromisoId: compromisoId.toString() }));
          }
          setLoading(false);
          return;
        }
      }
      
      // COMPROMISO 10: Datos Abiertos
      if (compromisoId === 10 && user?.entidadId) {
        console.log('📞 Llamando getByEntidad con:', 10, getUserEntityId());
        const response = await com10DatosAbiertosService.getByEntidad(10, getUserEntityId());
        console.log('📦 Respuesta de getByEntidad:', response);
        
        if (response.isSuccess || response.success) {
          const data = response.data;
          console.log('📄 Datos recibidos:', data);
          
          if (data) {
            setCom10RecordId(data.comdaEntId);
            
            // Cargar criterios evaluados desde cumplimiento_normativo
            const cumplimientoData = loadPaso2y3FromComData(data);
            
            setFormData({
              compromisoId: '10',
              urlDatosAbiertos: data.urlDatosAbiertos || '',
              totalDatasets: data.totalDatasets || '',
              fechaUltimaActualizacionDa: data.fechaUltimaActualizacionDa ? data.fechaUltimaActualizacionDa.split('T')[0] : '',
              responsableDa: data.responsableDa || '',
              cargoDa: data.cargoResponsableDa || '',
              correoDa: data.correoResponsableDa || '',
              telefonoDa: data.telefonoResponsableDa || '',
              numeroNormaResolucionDa: data.numeroNormaResolucionDa || '',
              fechaAprobacionDa: data.fechaAprobacionDa ? data.fechaAprobacionDa.split('T')[0] : '',
              observacionesDa: data.observacionDa || '',
              documentoFile: null,
              criteriosEvaluados: cumplimientoData?.criteriosEvaluados || [],
              aceptaPoliticaPrivacidad: data.checkPrivacidad || cumplimientoData?.aceptaPoliticaPrivacidad || cumplimientoData?.acepta_politica_privacidad || false,
              aceptaDeclaracionJurada: data.checkDdjj || cumplimientoData?.aceptaDeclaracionJurada || cumplimientoData?.acepta_declaracion_jurada || false,
              estado: data.estado === 'pendiente' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            });
            
            setHaVistoPolitica(data.checkPrivacidad || cumplimientoData?.aceptaPoliticaPrivacidad || cumplimientoData?.acepta_politica_privacidad || false);
            setHaVistoDeclaracion(data.checkDdjj || cumplimientoData?.aceptaDeclaracionJurada || cumplimientoData?.acepta_declaracion_jurada || false);
            
            // Si hay documento guardado, establecer la URL para vista previa (Paso 1)
            if (data.rutaPdfDa) {
              console.log('📄 Cargando PDF de Datos Abiertos (Paso 1) desde:', data.rutaPdfDa);
              setPdfUrl(data.rutaPdfDa);
            }
            
            // Si hay documento de Paso 2 (Normativa), establecer la URL
            if (data.rutaPdfNormativa) {
              console.log('📄 Cargando PDF de Normativa (Paso 2) desde:', data.rutaPdfNormativa);
              setPdfUrlPaso2(data.rutaPdfNormativa);
            }
            
            // Marcar que los datos de BD fueron cargados
            datosDBCargadosRef.current = true;
            setDatosDBCargados(true);
          } else {
            // No existe registro, inicializar con el compromisoId correcto
            setFormData(prev => ({ ...prev, compromisoId: compromisoId.toString() }));
          }
          setLoading(false);
          return;
        }
      }
      
      // COMPROMISO 11: AportacionGeoPeru
      if (compromisoId === 11 && user?.entidadId) {
        console.log('📞 Llamando getByEntidad con:', 11, getUserEntityId());
        const response = await com11AportacionGeoPeruService.getByEntidad(11, getUserEntityId());
        console.log('📦 Respuesta de getByEntidad:', response);
        
        if (response.isSuccess || response.success) {
          const data = response.data;
          console.log('📄 Datos recibidos:', data);
          
          if (data) {
            setCom11RecordId(data.comageopEntId);
            
            // Cargar criterios evaluados desde cumplimiento_normativo
            const cumplimientoData = loadPaso2y3FromComData(data);
            
            setFormData({
              compromisoId: '11',
              // Campos específicos de GeoPeru
              urlGeo: data.urlGeo || '',
              tipoInformacionGeo: data.tipoInformacionGeo || '',
              totalCapasPublicadas: data.totalCapasPublicadas || '',
              fechaUltimaActualizacionGeo: data.fechaUltimaActualizacionGeo ? data.fechaUltimaActualizacionGeo.split('T')[0] : '',
              responsableGeo: data.responsableGeo || '',
              cargoResponsableGeo: data.cargoResponsableGeo || '',
              correoResponsableGeo: data.correoResponsableGeo || '',
              telefonoResponsableGeo: data.telefonoResponsableGeo || '',
              normaAprobacionGeo: data.normaAprobacionGeo || '',
              fechaAprobacionGeo: data.fechaAprobacionGeo ? data.fechaAprobacionGeo.split('T')[0] : '',
              interoperabilidadGeo: data.interoperabilidadGeo || false,
              observacionGeo: data.observacionGeo || '',
              rutaPdfGeo: data.rutaPdfGeo || '',
              criteriosEvaluados: cumplimientoData?.criteriosEvaluados || [],
              aceptaPoliticaPrivacidad: data.checkPrivacidad || cumplimientoData?.aceptaPoliticaPrivacidad || cumplimientoData?.acepta_politica_privacidad || false,
              aceptaDeclaracionJurada: data.checkDdjj || cumplimientoData?.aceptaDeclaracionJurada || cumplimientoData?.acepta_declaracion_jurada || false,
              estado: data.estado === 'pendiente' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            });
            
            setHaVistoPolitica(data.checkPrivacidad || cumplimientoData?.aceptaPoliticaPrivacidad || cumplimientoData?.acepta_politica_privacidad || false);
            setHaVistoDeclaracion(data.checkDdjj || cumplimientoData?.aceptaDeclaracionJurada || cumplimientoData?.acepta_declaracion_jurada || false);
            
            // Si hay archivo de plan guardado, establecer la URL para vista previa (Paso 1)
            if (data.rutaPdfGeo) {
              console.log('📄 Cargando archivo plan (Paso 1) desde:', data.rutaPdfGeo);
              setPdfUrl(data.rutaPdfGeo);
            }
            
            // Si hay documento de Paso 2 (Normativa), establecer la URL
            if (data.rutaPdfNormativa) {
              console.log('📄 Cargando PDF de Normativa (Paso 2) desde:', data.rutaPdfNormativa);
              setPdfUrlPaso2(data.rutaPdfNormativa);
            }
            
            // Marcar que los datos de BD fueron cargados
            datosDBCargadosRef.current = true;
            setDatosDBCargados(true);
          } else {
            // No existe registro, inicializar con el compromisoId correcto
            setFormData(prev => ({ ...prev, compromisoId: compromisoId.toString() }));
          }
          setLoading(false);
          return;
        }
      }

      // COMPROMISO 12: ResponsableSoftwarePublico
      if (compromisoId === 12 && user?.entidadId) {
        console.log('📞 Llamando getByEntidad con:', 12, getUserEntityId());
        const response = await com12ResponsableSoftwarePublicoService.getByEntidad(12, getUserEntityId());
        console.log('📦 Respuesta de getByEntidad:', response);
        
        if (response.isSuccess || response.success) {
          const data = response.data;
          console.log('📄 Datos recibidos:', data);
          
          if (data) {
            setCom12RecordId(data.comdrspEntId);
            
            // Cargar criterios evaluados desde cumplimiento_normativo
            const cumplimientoData = loadPaso2y3FromComData(data);
            
            setFormData({
              compromisoId: '12',
              dniRsp: data.dniRsp || '',
              nombreRsp: data.nombreRsp || '',
              apePatRsp: data.apePatRsp || '',
              apeMatRsp: data.apeMatRsp || '',
              cargoRsp: data.cargoRsp || '',
              correoRsp: data.correoRsp || '',
              telefonoRsp: data.telefonoRsp || '',
              fechaDesignacionRsp: data.fechaDesignacionRsp ? data.fechaDesignacionRsp.split('T')[0] : '',
              numeroResolucionRsp: data.numeroResolucionRsp || '',
              observacionRsp: data.observacionRsp || '',
              rutaPdfRsp: data.rutaPdfRsp || '',
              aceptaPoliticaPrivacidad: data.checkPrivacidad || cumplimientoData?.aceptaPoliticaPrivacidad || cumplimientoData?.acepta_politica_privacidad || false,
              aceptaDeclaracionJurada: data.checkDdjj || cumplimientoData?.aceptaDeclaracionJurada || cumplimientoData?.acepta_declaracion_jurada || false,
              estado: data.estado === 'pendiente' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            });
            
            setHaVistoPolitica(data.checkPrivacidad || cumplimientoData?.aceptaPoliticaPrivacidad || cumplimientoData?.acepta_politica_privacidad || false);
            setHaVistoDeclaracion(data.checkDdjj || cumplimientoData?.aceptaDeclaracionJurada || cumplimientoData?.acepta_declaracion_jurada || false);
            
            // Si hay documento guardado, establecer la URL para vista previa (Paso 1)
            if (data.rutaPdfRsp) {
              console.log('📄 Cargando archivo documento (Paso 1) desde:', data.rutaPdfRsp);
              setPdfUrl(data.rutaPdfRsp);
            }
            
            // Si hay documento de Paso 2 (Normativa), establecer la URL
            if (data.rutaPdfNormativa) {
              console.log('📄 Cargando PDF de Normativa (Paso 2) desde:', data.rutaPdfNormativa);
              setPdfUrlPaso2(data.rutaPdfNormativa);
            }
            
            // Marcar que los datos de BD fueron cargados
            datosDBCargadosRef.current = true;
            setDatosDBCargados(true);
          } else {
            // No existe registro, inicializar con el compromisoId correcto
            setFormData(prev => ({ ...prev, compromisoId: compromisoId.toString() }));
          }
          setLoading(false);
          return;
        }
      }

      // COMPROMISO 13: InteroperabilidadPIDE
      if (compromisoId === 13 && user?.entidadId) {
        console.log('📞 Llamando getByEntidad con:', 13, getUserEntityId());
        const response = await com13InteroperabilidadPIDEService.getByEntidad(13, getUserEntityId());
        console.log('📦 Respuesta de getByEntidad:', response);
        
        if (response.isSuccess || response.success) {
          const data = response.data;
          console.log('📄 Datos recibidos:', data);
          
          if (data) {
            setCom13RecordId(data.compcpideEntId);
            
            // Cargar criterios evaluados desde cumplimiento_normativo
            const cumplimientoData = loadPaso2y3FromComData(data);
            
            setFormData({
              compromisoId: '13',
              tipoIntegracionPide: data.tipoIntegracionPide || '',
              nombreServicioPide: data.nombreServicioPide || '',
              descripcionServicioPide: data.descripcionServicioPide || '',
              fechaInicioOperacionPide: data.fechaInicioOperacionPide ? data.fechaInicioOperacionPide.split('T')[0] : '',
              urlServicioPide: data.urlServicioPide || '',
              responsablePide: data.responsablePide || '',
              cargoResponsablePide: data.cargoResponsablePide || '',
              correoResponsablePide: data.correoResponsablePide || '',
              telefonoResponsablePide: data.telefonoResponsablePide || '',
              numeroConvenioPide: data.numeroConvenioPide || '',
              fechaConvenioPide: data.fechaConvenioPide ? data.fechaConvenioPide.split('T')[0] : '',
              interoperabilidadPide: data.interoperabilidadPide || false,
              observacionPide: data.observacionPide || '',
              rutaPdfPide: data.rutaPdfPide || '',
              aceptaPoliticaPrivacidad: data.checkPrivacidad || cumplimientoData?.aceptaPoliticaPrivacidad || cumplimientoData?.acepta_politica_privacidad || false,
              aceptaDeclaracionJurada: data.checkDdjj || cumplimientoData?.aceptaDeclaracionJurada || cumplimientoData?.acepta_declaracion_jurada || false,
              estado: data.estado === 'pendiente' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            });
            
            setHaVistoPolitica(data.checkPrivacidad || cumplimientoData?.aceptaPoliticaPrivacidad || cumplimientoData?.acepta_politica_privacidad || false);
            setHaVistoDeclaracion(data.checkDdjj || cumplimientoData?.aceptaDeclaracionJurada || cumplimientoData?.acepta_declaracion_jurada || false);
            
            // Si hay documento guardado, establecer la URL para vista previa (Paso 1)
            if (data.rutaPdfPide) {
              console.log('📄 Cargando archivo PDF PIDE (Paso 1) desde:', data.rutaPdfPide);
              setPdfUrl(data.rutaPdfPide);
            }
            
            // Si hay documento de Paso 2 (Normativa), establecer la URL
            if (data.rutaPdfNormativa) {
              console.log('📄 Cargando PDF de Normativa (Paso 2) desde:', data.rutaPdfNormativa);
              setPdfUrlPaso2(data.rutaPdfNormativa);
            }
            
            // Marcar que los datos de BD fueron cargados
            datosDBCargadosRef.current = true;
            setDatosDBCargados(true);
          } else {
            // No existe registro, inicializar con el compromisoId correcto
            setFormData(prev => ({ ...prev, compromisoId: compromisoId.toString() }));
          }
          setLoading(false);
          return;
        }
      }

      // COMPROMISO 14: OficialSeguridadDigital
      if (compromisoId === 14 && user?.entidadId) {
        console.log('📞 Llamando getByEntidad con:', 14, getUserEntityId());
        const response = await com14OficialSeguridadDigitalService.getByEntidad(14, getUserEntityId());
        console.log('📦 Respuesta de getByEntidad:', response);
        
        if (response.isSuccess || response.success) {
          const data = response.data;
          console.log('📄 Datos recibidos:', data);
          
          if (data) {
            setCom14RecordId(data.comdoscdEntId);
            
            // Cargar criterios evaluados desde cumplimiento_normativo
            const cumplimientoData = loadPaso2y3FromComData(data);
            
            setFormData({
              compromisoId: '14',
              dniOscd: data.dniOscd || '',
              nombreOscd: data.nombreOscd || '',
              apePatOscd: data.apePatOscd || '',
              apeMatOscd: data.apeMatOscd || '',
              cargoOscd: data.cargoOscd || '',
              correoOscd: data.correoOscd || '',
              telefonoOscd: data.telefonoOscd || '',
              fechaDesignacionOscd: data.fechaDesignacionOscd ? data.fechaDesignacionOscd.split('T')[0] : '',
              numeroResolucionOscd: data.numeroResolucionOscd || '',
              comunicadoPcmOscd: data.comunicadoPcmOscd || false,
              observacionOscd: data.observacionOscd || '',
              rutaPdfOscd: data.rutaPdfOscd || '',
              aceptaPoliticaPrivacidad: data.checkPrivacidad || cumplimientoData?.aceptaPoliticaPrivacidad || cumplimientoData?.acepta_politica_privacidad || false,
              aceptaDeclaracionJurada: data.checkDdjj || cumplimientoData?.aceptaDeclaracionJurada || cumplimientoData?.acepta_declaracion_jurada || false,
              estado: data.estado === 'pendiente' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            });
            
            setHaVistoPolitica(data.checkPrivacidad || cumplimientoData?.aceptaPoliticaPrivacidad || cumplimientoData?.acepta_politica_privacidad || false);
            setHaVistoDeclaracion(data.checkDdjj || cumplimientoData?.aceptaDeclaracionJurada || cumplimientoData?.acepta_declaracion_jurada || false);
            
            // Si hay documento guardado, establecer la URL para vista previa (Paso 1)
            if (data.rutaPdfOscd) {
              console.log('📄 Cargando archivo PDF OSCD (Paso 1) desde:', data.rutaPdfOscd);
              setPdfUrl(data.rutaPdfOscd);
            }
            
            // Si hay documento de Paso 2 (Normativa), establecer la URL
            if (data.rutaPdfNormativa) {
              console.log('📄 Cargando PDF de Normativa (Paso 2) desde:', data.rutaPdfNormativa);
              setPdfUrlPaso2(data.rutaPdfNormativa);
            }
            
            // Marcar que los datos de BD fueron cargados
            datosDBCargadosRef.current = true;
            setDatosDBCargados(true);
          } else {
            // No existe registro, inicializar con el compromisoId correcto
            setFormData(prev => ({ ...prev, compromisoId: compromisoId.toString() }));
          }
          setLoading(false);
          return;
        }
      }

      // COMPROMISO 15: CSIRTInstitucional
      if (compromisoId === 15 && user?.entidadId) {
        console.log('📞 Llamando getByEntidad con:', 15, getUserEntityId());
        const response = await com15CSIRTInstitucionalService.getByEntidad(15, getUserEntityId());
        console.log('📦 Respuesta de getByEntidad:', response);
        
        if (response.isSuccess || response.success) {
          const data = response.data;
          console.log('📄 Datos recibidos:', data);
          
          if (data) {
            setCom15RecordId(data.comcsirtEntId);
            
            // Cargar criterios evaluados desde cumplimiento_normativo
            const cumplimientoData = loadPaso2y3FromComData(data);
            
            setFormData({
              compromisoId: '15',
              nombreCsirt: data.nombreCsirt || '',
              fechaConformacionCsirt: data.fechaConformacionCsirt ? data.fechaConformacionCsirt.split('T')[0] : '',
              numeroResolucionCsirt: data.numeroResolucionCsirt || '',
              responsableCsirt: data.responsableCsirt || '',
              cargoResponsableCsirt: data.cargoResponsableCsirt || '',
              correoCsirt: data.correoCsirt || '',
              telefonoCsirt: data.telefonoCsirt || '',
              protocoloIncidentesCsirt: data.protocoloIncidentesCsirt || false,
              comunicadoPcmCsirt: data.comunicadoPcmCsirt || false,
              observacionCsirt: data.observacionCsirt || '',
              rutaPdfCsirt: data.rutaPdfCsirt || '',
              criteriosEvaluados: cumplimientoData?.criteriosEvaluados || [],
              aceptaPoliticaPrivacidad: data.checkPrivacidad || cumplimientoData?.aceptaPoliticaPrivacidad || cumplimientoData?.acepta_politica_privacidad || false,
              aceptaDeclaracionJurada: data.checkDdjj || cumplimientoData?.aceptaDeclaracionJurada || cumplimientoData?.acepta_declaracion_jurada || false,
              estado: data.estado === 'pendiente' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            });
            
            setHaVistoPolitica(data.checkPrivacidad || cumplimientoData?.aceptaPoliticaPrivacidad || cumplimientoData?.acepta_politica_privacidad || false);
            setHaVistoDeclaracion(data.checkDdjj || cumplimientoData?.aceptaDeclaracionJurada || cumplimientoData?.acepta_declaracion_jurada || false);
            
            // Si hay documento guardado, establecer la URL para vista previa (Paso 1)
            if (data.rutaPdfCsirt) {
              console.log('📄 Cargando archivo PDF CSIRT desde:', data.rutaPdfCsirt);
              setPdfUrl(data.rutaPdfCsirt);
            }
            
            // Si hay documento de Paso 2 (Normativa), establecer la URL
            if (data.rutaPdfNormativa) {
              console.log('📄 Cargando PDF de Normativa (Paso 2) desde:', data.rutaPdfNormativa);
              setPdfUrlPaso2(data.rutaPdfNormativa);
            }
            
            // Marcar que los datos de BD fueron cargados
            datosDBCargadosRef.current = true;
            setDatosDBCargados(true);
          } else {
            // No existe registro, inicializar con el compromisoId correcto
            setFormData(prev => ({ ...prev, compromisoId: compromisoId.toString() }));
          }
          setLoading(false);
          return;
        }
      }

      // COMPROMISO 16: SistemaGestionSeguridad
      if (compromisoId === 16 && user?.entidadId) {
        console.log('📞 Llamando getByEntidad con:', 16, getUserEntityId());
        const response = await com16SistemaGestionSeguridadService.getByEntidad(16, getUserEntityId());
        console.log('📦 Respuesta de getByEntidad:', response);
        
        if (response.isSuccess || response.success) {
          const data = response.data;
          console.log('📄 Datos recibidos:', data);
          
          if (data) {
            setCom16RecordId(data.comsgsiEntId);
            
            // Cargar criterios evaluados desde cumplimiento_normativo
            const cumplimientoData = loadPaso2y3FromComData(data);
            
            setFormData({
              compromisoId: '16',
              responsableSgsi: data.responsableSgsi || '',
              cargoResponsableSgsi: data.cargoResponsableSgsi || '',
              correoSgsi: data.correoSgsi || '',
              telefonoSgsi: data.telefonoSgsi || '',
              estadoImplementacionSgsi: data.estadoImplementacionSgsi || '',
              versionNormaSgsi: data.versionNormaSgsi || '',
              alcanceSgsi: data.alcanceSgsi || '',
              fechaInicioSgsi: data.fechaInicioSgsi ? data.fechaInicioSgsi.split('T')[0] : '',
              fechaCertificacionSgsi: data.fechaCertificacionSgsi ? data.fechaCertificacionSgsi.split('T')[0] : '',
              entidadCertificadoraSgsi: data.entidadCertificadoraSgsi || '',
              rutaPdfPoliticasSgsi: data.rutaPdfPoliticasSgsi || '',
              rutaPdfCertificadoSgsi: data.rutaPdfCertificadoSgsi || '',
              observacionSgsi: data.observacionSgsi || '',
              criteriosEvaluados: cumplimientoData?.criteriosEvaluados || [],
              aceptaPoliticaPrivacidad: data.checkPrivacidad || cumplimientoData?.aceptaPoliticaPrivacidad || cumplimientoData?.acepta_politica_privacidad || false,
              aceptaDeclaracionJurada: data.checkDdjj || cumplimientoData?.aceptaDeclaracionJurada || cumplimientoData?.acepta_declaracion_jurada || false,
              estado: data.estado === 'pendiente' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            });
            
            setHaVistoPolitica(data.checkPrivacidad || cumplimientoData?.aceptaPoliticaPrivacidad || cumplimientoData?.acepta_politica_privacidad || false);
            setHaVistoDeclaracion(data.checkDdjj || cumplimientoData?.aceptaDeclaracionJurada || cumplimientoData?.acepta_declaracion_jurada || false);
            
            // Si hay documento de políticas guardado
            if (data.rutaPdfPoliticasSgsi) {
              console.log('📄 Cargando PDF políticas SGSI desde:', data.rutaPdfPoliticasSgsi);
              setPdfUrl(data.rutaPdfPoliticasSgsi);
            }
            // Si hay documento de certificación guardado
            if (data.rutaPdfCertificadoSgsi) {
              console.log('📄 Cargando PDF certificado SGSI desde:', data.rutaPdfCertificadoSgsi);
              setPdfUrlPaso2(data.rutaPdfCertificadoSgsi);
            }
            
            // Marcar que los datos de BD fueron cargados
            datosDBCargadosRef.current = true;
            setDatosDBCargados(true);
          } else {
            // No existe registro, inicializar con el compromisoId correcto
            setFormData(prev => ({ ...prev, compromisoId: compromisoId.toString() }));
          }
          setLoading(false);
          return;
        }
      }

      // COMPROMISO 17: PlanTransicionIPv6
      if (compromisoId === 17 && user?.entidadId) {
        console.log('📞 Llamando getByEntidad con:', 17, getUserEntityId());
        const response = await com17PlanTransicionIPv6Service.getByEntidad(17, getUserEntityId());
        console.log('📦 Respuesta de getByEntidad:', response);
        
        if (response.isSuccess || response.success) {
          const data = response.data;
          console.log('📄 Datos recibidos:', data);
          
          if (data) {
            setCom17RecordId(data.comptipv6EntId);
            
            // Cargar criterios evaluados desde cumplimiento_normativo
            const cumplimientoData = loadPaso2y3FromComData(data);
            
            setFormData({
              compromisoId: '17',
              responsableIpv6: data.responsableIpv6 || '',
              cargoResponsableIpv6: data.cargoResponsableIpv6 || '',
              correoIpv6: data.correoIpv6 || '',
              telefonoIpv6: data.telefonoIpv6 || '',
              estadoPlanIpv6: data.estadoPlanIpv6 || '',
              fechaFormulacionIpv6: data.fechaFormulacionIpv6 ? data.fechaFormulacionIpv6.split('T')[0] : '',
              fechaAprobacionIpv6: data.fechaAprobacionIpv6 ? data.fechaAprobacionIpv6.split('T')[0] : '',
              fechaInicioIpv6: data.fechaInicioIpv6 ? data.fechaInicioIpv6.split('T')[0] : '',
              fechaFinIpv6: data.fechaFinIpv6 ? data.fechaFinIpv6.split('T')[0] : '',
              descripcionPlanIpv6: data.descripcionPlanIpv6 || '',
              rutaPdfPlanIpv6: data.rutaPdfPlanIpv6 || '',
              observacionIpv6: data.observacionIpv6 || '',
              criteriosEvaluados: cumplimientoData?.criteriosEvaluados || [],
              aceptaPoliticaPrivacidad: data.checkPrivacidad || cumplimientoData?.aceptaPoliticaPrivacidad || cumplimientoData?.acepta_politica_privacidad || false,
              aceptaDeclaracionJurada: data.checkDdjj || cumplimientoData?.aceptaDeclaracionJurada || cumplimientoData?.acepta_declaracion_jurada || false,
              estado: data.estado === 'pendiente' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            });
            
            setHaVistoPolitica(data.checkPrivacidad || cumplimientoData?.aceptaPoliticaPrivacidad || cumplimientoData?.acepta_politica_privacidad || false);
            setHaVistoDeclaracion(data.checkDdjj || cumplimientoData?.aceptaDeclaracionJurada || cumplimientoData?.acepta_declaracion_jurada || false);
            
            // Si hay documento guardado, establecer la URL para vista previa (Paso 1)
            if (data.rutaPdfPlanIpv6) {
              console.log('📄 Cargando PDF IPv6 (Paso 1) desde:', data.rutaPdfPlanIpv6);
              setPdfUrl(data.rutaPdfPlanIpv6);
            }
            
            // Si hay documento de Paso 2 (Normativa), establecer la URL
            if (data.rutaPdfNormativa) {
              console.log('📄 Cargando PDF de Normativa (Paso 2) desde:', data.rutaPdfNormativa);
              setPdfUrlPaso2(data.rutaPdfNormativa);
            }
            
            // Marcar que los datos de BD fueron cargados
            datosDBCargadosRef.current = true;
            setDatosDBCargados(true);
          } else {
            // No existe registro, inicializar con el compromisoId correcto
            setFormData(prev => ({ ...prev, compromisoId: compromisoId.toString() }));
          }
          setLoading(false);
          return;
        }
      }

      // COMPROMISO 18: AccesoPortalTransparencia
      if (compromisoId === 18 && user?.entidadId) {
        console.log('📞 Llamando getByEntidad con:', 18, getUserEntityId());
        const response = await com18AccesoPortalTransparenciaService.getByEntidad(18, getUserEntityId());
        console.log('📦 Respuesta de getByEntidad:', response);
        
        if (response.isSuccess || response.success) {
          const data = response.data;
          console.log('📄 Datos recibidos:', data);
          
          if (data) {
            setCom18RecordId(data.comsapteEntId);
            
            // Cargar criterios evaluados desde cumplimiento_normativo
            const cumplimientoData = loadPaso2y3FromComData(data);
            
            setFormData({
              compromisoId: '18',
              responsablePte: data.responsablePte || '',
              cargoResponsablePte: data.cargoResponsablePte || '',
              correoPte: data.correoPte || '',
              telefonoPte: data.telefonoPte || '',
              numeroOficioPte: data.numeroOficioPte || '',
              fechaSolicitudPte: data.fechaSolicitudPte ? data.fechaSolicitudPte.split('T')[0] : '',
              fechaAccesoPte: data.fechaAccesoPte ? data.fechaAccesoPte.split('T')[0] : '',
              estadoAccesoPte: data.estadoAccesoPte || '',
              enlacePortalPte: data.enlacePortalPte || '',
              descripcionPte: data.descripcionPte || '',
              rutaPdfPte: data.rutaPdfPte || '',
              observacionPte: data.observacionPte || '',
              criteriosEvaluados: cumplimientoData?.criteriosEvaluados || [],
              aceptaPoliticaPrivacidad: data.checkPrivacidad || cumplimientoData?.aceptaPoliticaPrivacidad || cumplimientoData?.acepta_politica_privacidad || false,
              aceptaDeclaracionJurada: data.checkDdjj || cumplimientoData?.aceptaDeclaracionJurada || cumplimientoData?.acepta_declaracion_jurada || false,
              estado: data.estado === 'pendiente' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            });
            
            setHaVistoPolitica(data.checkPrivacidad || cumplimientoData?.aceptaPoliticaPrivacidad || cumplimientoData?.acepta_politica_privacidad || false);
            setHaVistoDeclaracion(data.checkDdjj || cumplimientoData?.aceptaDeclaracionJurada || cumplimientoData?.acepta_declaracion_jurada || false);
            
            // Si hay documento guardado, establecer la URL para vista previa (Paso 1)
            if (data.rutaPdfPte) {
              console.log('📄 Cargando PDF Portal Transparencia (Paso 1) desde:', data.rutaPdfPte);
              setPdfUrl(data.rutaPdfPte);
            }
            
            // Si hay documento de Paso 2 (Normativa), establecer la URL
            if (data.rutaPdfNormativa) {
              console.log('📄 Cargando PDF de Normativa (Paso 2) desde:', data.rutaPdfNormativa);
              setPdfUrlPaso2(data.rutaPdfNormativa);
            }
            
            // Marcar que los datos de BD fueron cargados
            datosDBCargadosRef.current = true;
            setDatosDBCargados(true);
          } else {
            // No existe registro, inicializar con el compromisoId correcto
            setFormData(prev => ({ ...prev, compromisoId: compromisoId.toString() }));
          }
          setLoading(false);
          return;
        }
      }

      // COMPROMISO 19: EncuestaNacionalGobDigital
      if (compromisoId === 19 && user?.entidadId) {
        console.log('📞 Llamando getByEntidad con:', 19, getUserEntityId());
        const response = await com19EncuestaNacionalGobDigitalService.getByEntidad(19, getUserEntityId());
        console.log('📦 Respuesta de getByEntidad:', response);
        
        if (response.isSuccess || response.success) {
          const data = response.data;
          console.log('📄 Datos recibidos:', data);
          
          if (data) {
            setCom19RecordId(data.comrenadEntId);
            
            // Cargar criterios evaluados desde cumplimiento_normativo
            const cumplimientoData = loadPaso2y3FromComData(data);
            
            setFormData({
              compromisoId: '19',
              anioEnad: data.anioEnad || '',
              responsableEnad: data.responsableEnad || '',
              cargoResponsableEnad: data.cargoResponsableEnad || '',
              correoEnad: data.correoEnad || '',
              telefonoEnad: data.telefonoEnad || '',
              fechaEnvioEnad: data.fechaEnvioEnad ? data.fechaEnvioEnad.split('T')[0] : '',
              estadoRespuestaEnad: data.estadoRespuestaEnad || '',
              enlaceFormularioEnad: data.enlaceFormularioEnad || '',
              observacionEnad: data.observacionEnad || '',
              rutaPdfEnad: data.rutaPdfEnad || '',
              criteriosEvaluados: cumplimientoData?.criteriosEvaluados || [],
              aceptaPoliticaPrivacidad: data.checkPrivacidad || cumplimientoData?.aceptaPoliticaPrivacidad || cumplimientoData?.acepta_politica_privacidad || false,
              aceptaDeclaracionJurada: data.checkDdjj || cumplimientoData?.aceptaDeclaracionJurada || cumplimientoData?.acepta_declaracion_jurada || false,
              estado: data.estado === 'pendiente' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            });
            
            setHaVistoPolitica(data.checkPrivacidad || cumplimientoData?.aceptaPoliticaPrivacidad || cumplimientoData?.acepta_politica_privacidad || false);
            setHaVistoDeclaracion(data.checkDdjj || cumplimientoData?.aceptaDeclaracionJurada || cumplimientoData?.acepta_declaracion_jurada || false);
            
            // Si hay documento guardado, establecer la URL para vista previa (Paso 1)
            if (data.rutaPdfEnad) {
              console.log('📄 Cargando PDF Encuesta (Paso 1) desde:', data.rutaPdfEnad);
              setPdfUrl(data.rutaPdfEnad);
            }
            
            // Si hay documento de Paso 2 (Normativa), establecer la URL
            if (data.rutaPdfNormativa) {
              console.log('📄 Cargando PDF de Normativa (Paso 2) desde:', data.rutaPdfNormativa);
              setPdfUrlPaso2(data.rutaPdfNormativa);
            }
            
            // Marcar que los datos de BD fueron cargados
            datosDBCargadosRef.current = true;
            setDatosDBCargados(true);
          } else {
            // No existe registro, inicializar con el compromisoId correcto
            setFormData(prev => ({ ...prev, compromisoId: compromisoId.toString() }));
          }
          setLoading(false);
          return;
        }
      }

      // COMPROMISO 20: DigitalizacionServiciosFacilita
      if (compromisoId === 20 && user?.entidadId) {
        console.log('📞 Llamando getByEntidad con:', 20, getUserEntityId());
        const response = await com20DigitalizacionServiciosFacilitaService.getByEntidad(20, getUserEntityId());
        console.log('📦 Respuesta de getByEntidad:', response);
        
        if (response.isSuccess || response.success) {
          const data = response.data;
          console.log('📄 Datos recibidos:', data);
          
          if (data) {
            setCom20RecordId(data.comdsfpeEntId);
            
            // Cargar criterios evaluados desde cumplimiento_normativo
            const cumplimientoData = loadPaso2y3FromComData(data);
            
            setFormData({
              compromisoId: '20',
              responsableFacilita: data.responsableFacilita || '',
              cargoResponsableFacilita: data.cargoResponsableFacilita || '',
              correoFacilita: data.correoFacilita || '',
              telefonoFacilita: data.telefonoFacilita || '',
              estadoImplementacionFacilita: data.estadoImplementacionFacilita || '',
              fechaInicioFacilita: data.fechaInicioFacilita ? data.fechaInicioFacilita.split('T')[0] : '',
              fechaUltimoAvanceFacilita: data.fechaUltimoAvanceFacilita ? data.fechaUltimoAvanceFacilita.split('T')[0] : '',
              totalServiciosDigitalizados: data.totalServiciosDigitalizados || '',
              rutaPdfFacilita: data.rutaPdfFacilita || '',
              observacionFacilita: data.observacionFacilita || '',
              criteriosEvaluados: cumplimientoData?.criteriosEvaluados || [],
              aceptaPoliticaPrivacidad: data.checkPrivacidad || cumplimientoData?.aceptaPoliticaPrivacidad || cumplimientoData?.acepta_politica_privacidad || false,
              aceptaDeclaracionJurada: data.checkDdjj || cumplimientoData?.aceptaDeclaracionJurada || cumplimientoData?.acepta_declaracion_jurada || false,
              estado: data.estado === 'pendiente' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            });
            
            setHaVistoPolitica(data.checkPrivacidad || cumplimientoData?.aceptaPoliticaPrivacidad || cumplimientoData?.acepta_politica_privacidad || false);
            setHaVistoDeclaracion(data.checkDdjj || cumplimientoData?.aceptaDeclaracionJurada || cumplimientoData?.acepta_declaracion_jurada || false);
            
            // Si hay documento guardado, establecer la URL para vista previa (Paso 1)
            if (data.rutaPdfFacilita) {
              console.log('📄 Cargando PDF Digitalización (Paso 1) desde:', data.rutaPdfFacilita);
              setPdfUrl(data.rutaPdfFacilita);
            }
            
            // Si hay documento de Paso 2 (Normativa), establecer la URL
            if (data.rutaPdfNormativa) {
              console.log('📄 Cargando PDF de Normativa (Paso 2) desde:', data.rutaPdfNormativa);
              setPdfUrlPaso2(data.rutaPdfNormativa);
            }
            
            // Marcar que los datos de BD fueron cargados
            datosDBCargadosRef.current = true;
            setDatosDBCargados(true);
          } else {
            // No existe registro, inicializar con el compromisoId correcto
            setFormData(prev => ({ ...prev, compromisoId: compromisoId.toString() }));
          }
          setLoading(false);
          return;
        }
      }

      // COMPROMISO 21: OficialGobiernoDatos (OGD)
      if (compromisoId === 21 && user?.entidadId) {
        console.log('📞 Llamando getByEntidad con:', 21, getUserEntityId());
        const response = await com21OficialGobiernoDatosService.getByEntidad(21, getUserEntityId());
        console.log('📦 Respuesta de getByEntidad:', response);
        
        if (response.isSuccess || response.success) {
          const data = response.data;
          console.log('📄 Datos recibidos:', data);
          
          if (data) {
            setCom21RecordId(data.comdogdEntId);
            
            // Cargar criterios evaluados desde cumplimiento_normativo
            const cumplimientoData = loadPaso2y3FromComData(data);
            
            setFormData({
              compromisoId: '21',
              dniOgd: data.dniOgd || '',
              nombreOgd: data.nombreOgd || '',
              apePatOgd: data.apePatOgd || '',
              apeMatOgd: data.apeMatOgd || '',
              cargoOgd: data.cargoOgd || '',
              correoOgd: data.correoOgd || '',
              telefonoOgd: data.telefonoOgd || '',
              fechaDesignacionOgd: data.fechaDesignacionOgd ? data.fechaDesignacionOgd.split('T')[0] : '',
              numeroResolucionOgd: data.numeroResolucionOgd || '',
              comunicadoPcmOgd: data.comunicadoPcmOgd || false,
              observacionOgd: data.observacionOgd || '',
              criteriosEvaluados: cumplimientoData?.criteriosEvaluados || [],
              aceptaPoliticaPrivacidad: data.checkPrivacidad || cumplimientoData?.aceptaPoliticaPrivacidad || cumplimientoData?.acepta_politica_privacidad || false,
              aceptaDeclaracionJurada: data.checkDdjj || cumplimientoData?.aceptaDeclaracionJurada || cumplimientoData?.acepta_declaracion_jurada || false,
              estado: data.estado === 'pendiente' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            });
            
            setHaVistoPolitica(data.checkPrivacidad || cumplimientoData?.aceptaPoliticaPrivacidad || cumplimientoData?.acepta_politica_privacidad || false);
            setHaVistoDeclaracion(data.checkDdjj || cumplimientoData?.aceptaDeclaracionJurada || cumplimientoData?.acepta_declaracion_jurada || false);
            
            // Si hay documento guardado, establecer la URL para vista previa (Paso 1)
            if (data.rutaPdfOgd) {
              console.log('📄 Cargando PDF Oficial Gobierno Datos (Paso 1) desde:', data.rutaPdfOgd);
              setPdfUrl(data.rutaPdfOgd);
            }
            
            // Si hay documento de Paso 2 (Normativa), establecer la URL
            if (data.rutaPdfNormativa) {
              console.log('📄 Cargando PDF de Normativa (Paso 2) desde:', data.rutaPdfNormativa);
              setPdfUrlPaso2(data.rutaPdfNormativa);
            }
            
            // Marcar que los datos de BD fueron cargados
            datosDBCargadosRef.current = true;
            setDatosDBCargados(true);
          } else {
            // No existe registro, inicializar con el compromisoId correcto
            setFormData(prev => ({ ...prev, compromisoId: compromisoId.toString() }));
          }
          setLoading(false);
          return;
        }
      }
      
      // Si llegamos aquí sin compromisoId válido, es un error
      console.log('⚠️ No se pudo determinar el compromiso a cargar');
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar cumplimiento:', error);
      showErrorToast('Error al cargar los datos');
      navigate('/dashboard/cumplimiento');
    } finally {
      setLoading(false);
    }
  }, [user, compromisoIdFromUrl, navigate, getUserEntityId]);

  // Asignar loadCumplimiento al ref para que esté disponible en useEffect
  loadCumplimientoRef.current = loadCumplimiento;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Limpiar error del campo
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        showErrorToast('Solo se permiten archivos PDF');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB max
        showErrorToast('El archivo no puede superar los 10MB');
        return;
      }

      // Revocar URL anterior si existe según el paso actual
      if (pasoActual === 2) {
        if (pdfUrlPaso2 && pdfUrlPaso2.startsWith('blob:')) {
          URL.revokeObjectURL(pdfUrlPaso2);
        }
      } else {
        if (pdfUrl && pdfUrl.startsWith('blob:')) {
          URL.revokeObjectURL(pdfUrl);
        }
      }

      setFormData(prev => ({ ...prev, documentoFile: file }));
      
      // Vista previa del PDF según el paso actual
      try {
        const fileUrl = URL.createObjectURL(file);
        console.log(`📄 PDF blob URL creado para paso ${pasoActual}:`, fileUrl);
        if (pasoActual === 2) {
          setPdfUrlPaso2(fileUrl);
        } else {
          setPdfUrl(fileUrl);
        }
      } catch (error) {
        console.error('❌ Error al crear blob URL:', error);
        showErrorToast('Error al cargar la vista previa del PDF');
      }
    }
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, documentoFile: null }));
    if (pasoActual === 2) {
      if (pdfUrlPaso2 && pdfUrlPaso2.startsWith('blob:')) {
        URL.revokeObjectURL(pdfUrlPaso2);
      }
      setPdfUrlPaso2(null);
    } else {
      if (pdfUrl && pdfUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pdfUrl);
      }
      setPdfUrl(null);
    }
  };

  const validarPaso = (paso) => {
    const nuevosErrores = {};

    console.log('🔍 VALIDAR PASO:', paso, 'compromisoId:', formData.compromisoId, 'tipo:', typeof formData.compromisoId);

    if (paso === 1) {
      if (!formData.compromisoId) {
        showErrorToast('Debe seleccionar un compromiso desde la página principal');
        navigate('/dashboard/cumplimiento');
        return false;
      }

      // Validación específica para Compromiso 2 (Comité GTD)
      if (parseInt(formData.compromisoId) === 2) {
        if (miembrosComite.length === 0) {
          nuevosErrores.miembrosComite = 'Debe agregar al menos un miembro del comité';
          showErrorToast('Debe agregar al menos un miembro del comité');
        }
      }
      // Validación específica para Compromiso 3 (Elaboración PEGD)
      else if (parseInt(formData.compromisoId) === 3) {
        // Para Compromiso 3, NO se valida en este punto
        // El componente Compromiso3Paso1 maneja su propia validación interna
        // y guarda directamente al backend cuando el usuario interactúa
        // Simplemente permitir avanzar al paso 2
        console.log('✅ Compromiso 3 - Validación paso 1: permitir avanzar (sin validación frontend)');
      }
      // Validación específica para Compromiso 4 (Incorporar TD en el PEI)
      else if (parseInt(formData.compromisoId) === 4) {
        if (!formData.anioInicio) {
          nuevosErrores.anioInicio = 'Ingrese el año de inicio del PEI';
        }
        if (!formData.anioFin) {
          nuevosErrores.anioFin = 'Ingrese el año de fin del PEI';
        }
        if (formData.anioInicio && formData.anioFin && parseInt(formData.anioFin) <= parseInt(formData.anioInicio)) {
          nuevosErrores.anioFin = 'El año de fin debe ser mayor al año de inicio';
        }
        if (!formData.fechaAprobacion) {
          nuevosErrores.fechaAprobacion = 'Seleccione la fecha de aprobación del PEI';
        }
        if (!formData.objetivoEstrategico || formData.objetivoEstrategico.trim() === '') {
          nuevosErrores.objetivoEstrategico = 'Ingrese el objetivo estratégico vinculado a la TD';
        }
        if (!formData.descripcionIncorporacion || formData.descripcionIncorporacion.trim() === '') {
          nuevosErrores.descripcionIncorporacion = 'Describa cómo se incorporó la TD en el PEI';
        }
      }
      // Validación específica para Compromiso 5 (Estrategia Digital)
      else if (parseInt(formData.compromisoId) === 5) {
        if (!formData.nombreEstrategia || formData.nombreEstrategia.trim() === '') {
          nuevosErrores.nombreEstrategia = 'Ingrese el nombre de la estrategia digital';
        }
        if (!formData.anioInicio) {
          nuevosErrores.anioInicio = 'Ingrese el año de inicio de la estrategia';
        }
        if (!formData.anioFin) {
          nuevosErrores.anioFin = 'Ingrese el año de fin de la estrategia';
        }
        if (formData.anioInicio && formData.anioFin && parseInt(formData.anioFin) <= parseInt(formData.anioInicio)) {
          nuevosErrores.anioFin = 'El año de fin debe ser mayor al año de inicio';
        }
        if (!formData.fechaAprobacion) {
          nuevosErrores.fechaAprobacion = 'Seleccione la fecha de aprobación';
        }
        if (!formData.objetivosEstrategicos || formData.objetivosEstrategicos.trim() === '') {
          nuevosErrores.objetivosEstrategicos = 'Ingrese los objetivos estratégicos';
        }
        if (!formData.lineasAccion || formData.lineasAccion.trim() === '') {
          nuevosErrores.lineasAccion = 'Ingrese las líneas de acción';
        }
        if (!formData.estadoImplementacion || formData.estadoImplementacion.trim() === '') {
          nuevosErrores.estadoImplementacion = 'Seleccione el estado de implementación';
        }
      }
      // Validación específica para Compromiso 6 (Migración a GOB.PE)
      else if (parseInt(formData.compromisoId) === 6) {
        if (!formData.urlPortalGobPe || formData.urlPortalGobPe.trim() === '') {
          nuevosErrores.urlPortalGobPe = 'Ingrese la URL del portal en GOB.PE';
        } else if (!/^https?:\/\/.+/.test(formData.urlPortalGobPe)) {
          nuevosErrores.urlPortalGobPe = 'Ingrese una URL válida';
        }
        if (!formData.fechaMigracion) {
          nuevosErrores.fechaMigracion = 'Seleccione la fecha de migración';
        }
        if (!formData.fechaUltimaActualizacion) {
          nuevosErrores.fechaUltimaActualizacion = 'Seleccione la fecha de última actualización';
        }
        if (!formData.nombreResponsable || formData.nombreResponsable.trim() === '') {
          nuevosErrores.nombreResponsable = 'Ingrese el nombre del responsable';
        }
        if (!formData.correoResponsable || formData.correoResponsable.trim() === '') {
          nuevosErrores.correoResponsable = 'Ingrese el correo del responsable';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correoResponsable)) {
          nuevosErrores.correoResponsable = 'Ingrese un correo válido';
        }
        if (!formData.tipoMigracion || formData.tipoMigracion.trim() === '') {
          nuevosErrores.tipoMigracion = 'Seleccione el tipo de migración';
        }
      }
      // Validación específica para Compromiso 7 (Implementación MPD)
      else if (parseInt(formData.compromisoId) === 7) {
        if (!formData.urlMpd || formData.urlMpd.trim() === '') {
          nuevosErrores.urlMpd = 'Ingrese la URL de la Mesa de Partes Digital';
        } else if (!/^https?:\/\/.+/.test(formData.urlMpd)) {
          nuevosErrores.urlMpd = 'Ingrese una URL válida';
        }
        if (!formData.fechaImplementacionMpd) {
          nuevosErrores.fechaImplementacionMpd = 'Seleccione la fecha de implementación';
        }
        if (!formData.tipoMpd || formData.tipoMpd.trim() === '') {
          nuevosErrores.tipoMpd = 'Seleccione el tipo de MPD';
        }
        if (!formData.responsableMpd || formData.responsableMpd.trim() === '') {
          nuevosErrores.responsableMpd = 'Ingrese el nombre del responsable';
        }
        if (!formData.cargoResponsableMpd || formData.cargoResponsableMpd.trim() === '') {
          nuevosErrores.cargoResponsableMpd = 'Ingrese el cargo del responsable';
        }
        if (!formData.correoResponsableMpd || formData.correoResponsableMpd.trim() === '') {
          nuevosErrores.correoResponsableMpd = 'Ingrese el correo del responsable';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correoResponsableMpd)) {
          nuevosErrores.correoResponsableMpd = 'Ingrese un correo válido';
        }
      }
      // Validación específica para Compromiso 8 (Publicación TUPA)
      else if (parseInt(formData.compromisoId) === 8) {
        if (!formData.urlTupa || formData.urlTupa.trim() === '') {
          nuevosErrores.urlTupa = 'Ingrese la URL del TUPA publicado';
        } else if (!/^https?:\/\/.+/.test(formData.urlTupa)) {
          nuevosErrores.urlTupa = 'Ingrese una URL válida';
        }
        if (!formData.numeroResolucionTupa || formData.numeroResolucionTupa.trim() === '') {
          nuevosErrores.numeroResolucionTupa = 'Ingrese el número de resolución';
        }
        if (!formData.fechaAprobacionTupa) {
          nuevosErrores.fechaAprobacionTupa = 'Seleccione la fecha de aprobación';
        }
        if (!formData.responsableTupa || formData.responsableTupa.trim() === '') {
          nuevosErrores.responsableTupa = 'Ingrese el nombre del responsable';
        }
        if (!formData.cargoResponsableTupa || formData.cargoResponsableTupa.trim() === '') {
          nuevosErrores.cargoResponsableTupa = 'Ingrese el cargo del responsable';
        }
        if (!formData.correoResponsableTupa || formData.correoResponsableTupa.trim() === '') {
          nuevosErrores.correoResponsableTupa = 'Ingrese el correo del responsable';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correoResponsableTupa)) {
          nuevosErrores.correoResponsableTupa = 'Ingrese un correo válido';
        }
      }
      // Validación específica para Compromiso 9 (Modelo de Gestión Documental)
      else if (parseInt(formData.compromisoId) === 9) {
        if (!formData.fechaAprobacionMgd) {
          nuevosErrores.fechaAprobacionMgd = 'Seleccione la fecha de aprobación del MGD';
        }
        if (!formData.numeroResolucionMgd || formData.numeroResolucionMgd.trim() === '') {
          nuevosErrores.numeroResolucionMgd = 'Ingrese el número de resolución';
        }
        if (!formData.responsableMgd || formData.responsableMgd.trim() === '') {
          nuevosErrores.responsableMgd = 'Ingrese el nombre del responsable';
        }
        if (!formData.cargoResponsableMgd || formData.cargoResponsableMgd.trim() === '') {
          nuevosErrores.cargoResponsableMgd = 'Ingrese el cargo del responsable';
        }
        if (!formData.correoResponsableMgd || formData.correoResponsableMgd.trim() === '') {
          nuevosErrores.correoResponsableMgd = 'Ingrese el correo del responsable';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correoResponsableMgd)) {
          nuevosErrores.correoResponsableMgd = 'Ingrese un correo válido';
        }
        if (!formData.sistemaPlataformaMgd || formData.sistemaPlataformaMgd.trim() === '') {
          nuevosErrores.sistemaPlataformaMgd = 'Ingrese el sistema o plataforma usada';
        }
        if (!formData.tipoImplantacionMgd || formData.tipoImplantacionMgd.trim() === '') {
          nuevosErrores.tipoImplantacionMgd = 'Seleccione el tipo de implantación';
        }
      }
      // Validación específica para Compromiso 10 (Datos Abiertos)
      else if (parseInt(formData.compromisoId) === 10) {
        if (!formData.urlDatosAbiertos || formData.urlDatosAbiertos.trim() === '') {
          nuevosErrores.urlDatosAbiertos = 'Ingrese la URL de los datos abiertos';
        } else if (!/^https?:\/\/.+/.test(formData.urlDatosAbiertos)) {
          nuevosErrores.urlDatosAbiertos = 'Ingrese una URL válida';
        }
        if (!formData.totalDatasets || formData.totalDatasets === '') {
          nuevosErrores.totalDatasets = 'Ingrese el total de datasets publicados';
        } else if (parseInt(formData.totalDatasets) < 0) {
          nuevosErrores.totalDatasets = 'El total de datasets debe ser un número positivo';
        }
        if (!formData.fechaUltimaActualizacionDa) {
          nuevosErrores.fechaUltimaActualizacionDa = 'Seleccione la fecha de última actualización';
        }
        if (!formData.responsableDa || formData.responsableDa.trim() === '') {
          nuevosErrores.responsableDa = 'Ingrese el nombre completo del responsable';
        }
        if (!formData.cargoDa || formData.cargoDa.trim() === '') {
          nuevosErrores.cargoDa = 'Ingrese el cargo del responsable';
        }
        if (!formData.correoDa || formData.correoDa.trim() === '') {
          nuevosErrores.correoDa = 'Ingrese el correo del responsable';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correoDa)) {
          nuevosErrores.correoDa = 'Ingrese un correo válido';
        }
        if (!formData.numeroNormaResolucionDa || formData.numeroNormaResolucionDa.trim() === '') {
          nuevosErrores.numeroNormaResolucionDa = 'Ingrese el número de norma o resolución';
        }
        if (!formData.fechaAprobacionDa) {
          nuevosErrores.fechaAprobacionDa = 'Seleccione la fecha de aprobación';
        }
      }
      // Validación específica para Compromiso 11 (Aportación GeoPeru)
      else if (parseInt(formData.compromisoId) === 11) {
        if (!formData.urlGeo || formData.urlGeo.trim() === '') {
          nuevosErrores.urlGeo = 'Ingrese la URL de la información geoespacial';
        }
        if (!formData.tipoInformacionGeo || formData.tipoInformacionGeo === '') {
          nuevosErrores.tipoInformacionGeo = 'Seleccione el tipo de información publicada';
        }
        if (!formData.totalCapasPublicadas || formData.totalCapasPublicadas === '') {
          nuevosErrores.totalCapasPublicadas = 'Ingrese el total de capas publicadas';
        } else if (parseInt(formData.totalCapasPublicadas) < 0) {
          nuevosErrores.totalCapasPublicadas = 'El número debe ser positivo';
        }
        if (!formData.fechaUltimaActualizacionGeo) {
          nuevosErrores.fechaUltimaActualizacionGeo = 'Seleccione la fecha de última actualización';
        }
        if (!formData.responsableGeo || formData.responsableGeo.trim() === '') {
          nuevosErrores.responsableGeo = 'Ingrese el nombre completo del responsable';
        }
        if (!formData.cargoResponsableGeo || formData.cargoResponsableGeo.trim() === '') {
          nuevosErrores.cargoResponsableGeo = 'Ingrese el cargo del responsable';
        }
        if (!formData.correoResponsableGeo || formData.correoResponsableGeo.trim() === '') {
          nuevosErrores.correoResponsableGeo = 'Ingrese el correo del responsable';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correoResponsableGeo)) {
          nuevosErrores.correoResponsableGeo = 'Ingrese un correo válido';
        }
        if (!formData.normaAprobacionGeo || formData.normaAprobacionGeo.trim() === '') {
          nuevosErrores.normaAprobacionGeo = 'Ingrese el número de norma de aprobación';
        }
        if (!formData.fechaAprobacionGeo) {
          nuevosErrores.fechaAprobacionGeo = 'Seleccione la fecha de aprobación';
        }
      }
      // Validación específica para Compromiso 12 (ResponsableSoftwarePublico)
      else if (parseInt(formData.compromisoId) === 12) {
        if (!formData.dniRsp || formData.dniRsp.trim() === '') {
          nuevosErrores.dniRsp = 'Ingrese el DNI';
        } else if (formData.dniRsp.length !== 8) {
          nuevosErrores.dniRsp = 'El DNI debe tener 8 dígitos';
        }
        if (!formData.nombreRsp || formData.nombreRsp.trim() === '') {
          nuevosErrores.nombreRsp = 'Ingrese los nombres';
        }
        if (!formData.apePatRsp || formData.apePatRsp.trim() === '') {
          nuevosErrores.apePatRsp = 'Ingrese el apellido paterno';
        }
        if (!formData.apeMatRsp || formData.apeMatRsp.trim() === '') {
          nuevosErrores.apeMatRsp = 'Ingrese el apellido materno';
        }
        if (!formData.cargoRsp || formData.cargoRsp.trim() === '') {
          nuevosErrores.cargoRsp = 'Ingrese el cargo';
        }
        if (!formData.correoRsp || formData.correoRsp.trim() === '') {
          nuevosErrores.correoRsp = 'Ingrese el correo institucional';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correoRsp)) {
          nuevosErrores.correoRsp = 'Ingrese un correo válido';
        }
        if (!formData.fechaDesignacionRsp) {
          nuevosErrores.fechaDesignacionRsp = 'Seleccione la fecha de designación';
        }
        if (!formData.numeroResolucionRsp || formData.numeroResolucionRsp.trim() === '') {
          nuevosErrores.numeroResolucionRsp = 'Ingrese el número de resolución o documento';
        }
      }
      // Validación específica para Compromiso 13 (InteroperabilidadPIDE)
      else if (parseInt(formData.compromisoId) === 13) {
        if (!formData.tipoIntegracionPide || formData.tipoIntegracionPide.trim() === '') {
          nuevosErrores.tipoIntegracionPide = 'Seleccione el tipo de integración';
        }
        if (!formData.nombreServicioPide || formData.nombreServicioPide.trim() === '') {
          nuevosErrores.nombreServicioPide = 'Ingrese el nombre del servicio interoperable';
        }
        if (!formData.fechaInicioOperacionPide) {
          nuevosErrores.fechaInicioOperacionPide = 'Seleccione la fecha de inicio de operación';
        }
        if (!formData.responsablePide || formData.responsablePide.trim() === '') {
          nuevosErrores.responsablePide = 'Ingrese el nombre del responsable técnico';
        }
        if (!formData.cargoResponsablePide || formData.cargoResponsablePide.trim() === '') {
          nuevosErrores.cargoResponsablePide = 'Ingrese el cargo del responsable';
        }
        if (!formData.correoResponsablePide || formData.correoResponsablePide.trim() === '') {
          nuevosErrores.correoResponsablePide = 'Ingrese el correo del responsable';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correoResponsablePide)) {
          nuevosErrores.correoResponsablePide = 'Ingrese un correo válido';
        }
        if (!formData.numeroConvenioPide || formData.numeroConvenioPide.trim() === '') {
          nuevosErrores.numeroConvenioPide = 'Ingrese el número de convenio / resolución de acceso';
        }
      }
      // Validación específica para Compromiso 14 (OficialSeguridadDigital - OSCD)
      else if (parseInt(formData.compromisoId) === 14) {
        if (!formData.dniOscd || formData.dniOscd.trim() === '') {
          nuevosErrores.dniOscd = 'Ingrese el DNI del OSCD';
        } else if (formData.dniOscd.length !== 8) {
          nuevosErrores.dniOscd = 'El DNI debe tener 8 dígitos';
        }
        if (!formData.nombreOscd || formData.nombreOscd.trim() === '') {
          nuevosErrores.nombreOscd = 'Ingrese el nombre del OSCD';
        }
        if (!formData.apePatOscd || formData.apePatOscd.trim() === '') {
          nuevosErrores.apePatOscd = 'Ingrese el apellido paterno del OSCD';
        }
        if (!formData.apeMatOscd || formData.apeMatOscd.trim() === '') {
          nuevosErrores.apeMatOscd = 'Ingrese el apellido materno del OSCD';
        }
        if (!formData.cargoOscd || formData.cargoOscd.trim() === '') {
          nuevosErrores.cargoOscd = 'Ingrese el cargo del OSCD';
        }
        if (!formData.correoOscd || formData.correoOscd.trim() === '') {
          nuevosErrores.correoOscd = 'Ingrese el correo del OSCD';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correoOscd)) {
          nuevosErrores.correoOscd = 'Ingrese un correo válido';
        }
        if (!formData.fechaDesignacionOscd) {
          nuevosErrores.fechaDesignacionOscd = 'Seleccione la fecha de designación';
        }
        if (!formData.numeroResolucionOscd || formData.numeroResolucionOscd.trim() === '') {
          nuevosErrores.numeroResolucionOscd = 'Ingrese el número de resolución';
        }
      }
      // Validación específica para Compromiso 15 (CSIRTInstitucional)
      else if (parseInt(formData.compromisoId) === 15) {
        if (!formData.nombreCsirt || formData.nombreCsirt.trim() === '') {
          nuevosErrores.nombreCsirt = 'Ingrese el nombre del CSIRT';
        }
        if (!formData.fechaConformacionCsirt) {
          nuevosErrores.fechaConformacionCsirt = 'Seleccione la fecha de conformación';
        }
        if (!formData.numeroResolucionCsirt || formData.numeroResolucionCsirt.trim() === '') {
          nuevosErrores.numeroResolucionCsirt = 'Ingrese el número de resolución';
        }
        if (!formData.responsableCsirt || formData.responsableCsirt.trim() === '') {
          nuevosErrores.responsableCsirt = 'Ingrese el nombre del responsable';
        }
        if (!formData.cargoResponsableCsirt || formData.cargoResponsableCsirt.trim() === '') {
          nuevosErrores.cargoResponsableCsirt = 'Ingrese el cargo del responsable';
        }
        if (!formData.correoCsirt || formData.correoCsirt.trim() === '') {
          nuevosErrores.correoCsirt = 'Ingrese el correo del CSIRT';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correoCsirt)) {
          nuevosErrores.correoCsirt = 'Ingrese un correo válido';
        }
      }
      // Validación específica para Compromiso 16 (SistemaGestionSeguridad - SGSI)
      else if (parseInt(formData.compromisoId) === 16) {
        if (!formData.responsableSgsi || formData.responsableSgsi.trim() === '') {
          nuevosErrores.responsableSgsi = 'Ingrese el nombre del responsable del SGSI';
        }
        if (!formData.cargoResponsableSgsi || formData.cargoResponsableSgsi.trim() === '') {
          nuevosErrores.cargoResponsableSgsi = 'Ingrese el cargo del responsable';
        }
        if (!formData.correoSgsi || formData.correoSgsi.trim() === '') {
          nuevosErrores.correoSgsi = 'Ingrese el correo institucional';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correoSgsi)) {
          nuevosErrores.correoSgsi = 'Ingrese un correo válido';
        }
        if (!formData.estadoImplementacionSgsi || formData.estadoImplementacionSgsi.trim() === '') {
          nuevosErrores.estadoImplementacionSgsi = 'Seleccione el estado de implementación';
        }
        if (!formData.versionNormaSgsi || formData.versionNormaSgsi.trim() === '') {
          nuevosErrores.versionNormaSgsi = 'Seleccione la versión de la norma';
        }
        if (!formData.fechaInicioSgsi) {
          nuevosErrores.fechaInicioSgsi = 'Seleccione la fecha de inicio de implementación';
        }
      }
      // Validación específica para Compromiso 17 (PlanTransicionIPv6)
      else if (parseInt(formData.compromisoId) === 17) {
        if (!formData.responsableIpv6 || formData.responsableIpv6.trim() === '') {
          nuevosErrores.responsableIpv6 = 'Ingrese el nombre del responsable del plan';
        }
        if (!formData.cargoResponsableIpv6 || formData.cargoResponsableIpv6.trim() === '') {
          nuevosErrores.cargoResponsableIpv6 = 'Ingrese el cargo del responsable';
        }
        if (!formData.correoIpv6 || formData.correoIpv6.trim() === '') {
          nuevosErrores.correoIpv6 = 'Ingrese el correo institucional';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correoIpv6)) {
          nuevosErrores.correoIpv6 = 'Ingrese un correo válido';
        }
        if (!formData.estadoPlanIpv6 || formData.estadoPlanIpv6.trim() === '') {
          nuevosErrores.estadoPlanIpv6 = 'Seleccione el estado del plan';
        }
        if (!formData.fechaFormulacionIpv6) {
          nuevosErrores.fechaFormulacionIpv6 = 'Seleccione la fecha de formulación';
        }
      }
      // Validación específica para Compromiso 18 (AccesoPortalTransparencia - PTE)
      else if (parseInt(formData.compromisoId) === 18) {
        if (!formData.responsablePte || formData.responsablePte.trim() === '') {
          nuevosErrores.responsablePte = 'Ingrese el nombre del responsable';
        }
        if (!formData.cargoResponsablePte || formData.cargoResponsablePte.trim() === '') {
          nuevosErrores.cargoResponsablePte = 'Ingrese el cargo del responsable';
        }
        if (!formData.correoPte || formData.correoPte.trim() === '') {
          nuevosErrores.correoPte = 'Ingrese el correo institucional';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correoPte)) {
          nuevosErrores.correoPte = 'Ingrese un correo válido';
        }
        if (!formData.numeroOficioPte || formData.numeroOficioPte.trim() === '') {
          nuevosErrores.numeroOficioPte = 'Ingrese el número de oficio de solicitud';
        }
        if (!formData.fechaSolicitudPte) {
          nuevosErrores.fechaSolicitudPte = 'Seleccione la fecha de solicitud';
        }
        if (!formData.estadoAccesoPte || formData.estadoAccesoPte.trim() === '') {
          nuevosErrores.estadoAccesoPte = 'Seleccione el estado del acceso';
        }
      }
      // Validación específica para Compromiso 19 (EncuestaNacionalGobDigital - ENAD)
      else if (parseInt(formData.compromisoId) === 19) {
        if (!formData.anioEnad) {
          nuevosErrores.anioEnad = 'Seleccione el año de la ENAD';
        }
        if (!formData.responsableEnad || formData.responsableEnad.trim() === '') {
          nuevosErrores.responsableEnad = 'Ingrese el nombre del responsable del llenado';
        }
        if (!formData.cargoResponsableEnad || formData.cargoResponsableEnad.trim() === '') {
          nuevosErrores.cargoResponsableEnad = 'Ingrese el cargo del responsable';
        }
        if (!formData.correoEnad || formData.correoEnad.trim() === '') {
          nuevosErrores.correoEnad = 'Ingrese el correo institucional';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correoEnad)) {
          nuevosErrores.correoEnad = 'Ingrese un correo válido';
        }
        if (!formData.fechaEnvioEnad) {
          nuevosErrores.fechaEnvioEnad = 'Seleccione la fecha de envío del formulario';
        }
        if (!formData.estadoRespuestaEnad) {
          nuevosErrores.estadoRespuestaEnad = 'Seleccione el estado';
        }
      }
      // Validación específica para Compromiso 20 (DigitalizacionServiciosFacilita)
      else if (parseInt(formData.compromisoId) === 20) {
        if (formData.sistemasDocumentados && formData.sistemasTotal && parseInt(formData.sistemasDocumentados) > parseInt(formData.sistemasTotal)) {
          nuevosErrores.sistemasDocumentados = 'No puede ser mayor al total de sistemas';
        }
      }
      // Validación específica para Compromiso 21 (OficialGobiernoDatos)
      else if (parseInt(formData.compromisoId) === 21) {
        if (!formData.fechaElaboracion) {
          nuevosErrores.fechaElaboracion = 'Seleccione la fecha de elaboración';
        }
        if (!formData.numeroDocumento || formData.numeroDocumento.trim() === '') {
          nuevosErrores.numeroDocumento = 'Ingrese el número de documento';
        }
      }
      else if (parseInt(formData.compromisoId) !== 3) {
        // Validación para Compromiso 1 y otros (Líder) - EXCEPTO Compromiso 3
        if (!formData.nroDni) nuevosErrores.nroDni = 'Ingrese el DNI';
        if (formData.nroDni && formData.nroDni.length !== 8) nuevosErrores.nroDni = 'El DNI debe tener 8 dígitos';
        if (!formData.nombres) nuevosErrores.nombres = 'Ingrese los nombres';
        if (!formData.apellidoPaterno) nuevosErrores.apellidoPaterno = 'Ingrese el apellido paterno';
        if (!formData.apellidoMaterno) nuevosErrores.apellidoMaterno = 'Ingrese el apellido materno';
        if (!formData.correoElectronico) nuevosErrores.correoElectronico = 'Ingrese el correo';
        if (formData.correoElectronico && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correoElectronico)) {
          nuevosErrores.correoElectronico = 'Ingrese un correo válido';
        }
        if (!formData.telefono) nuevosErrores.telefono = 'Ingrese el teléfono';
        if (!formData.rol) nuevosErrores.rol = 'Seleccione el rol';
        if (!formData.cargo) nuevosErrores.cargo = 'Ingrese el cargo';
        if (!formData.fechaInicio) nuevosErrores.fechaInicio = 'Seleccione la fecha de inicio';
      }
    }

    if (paso === 2) {
      // Validación específica para Compromiso 3 (PEGD)
      if (parseInt(formData.compromisoId) === 3) {
        // Para Compromiso 3, el documento PDF es opcional
        // Los datos importantes están en el paso 1 (objetivos, situación actual, proyectos)
        // Solo validar criterios si existen
        if (compromisoSeleccionado?.criteriosEvaluacion) {
          const criteriosActivos = compromisoSeleccionado.criteriosEvaluacion.filter(c => c.activo);
          if (criteriosActivos.length > 0) {
            const criteriosFaltantes = criteriosActivos.filter(criterio => {
              const evaluado = formData.criteriosEvaluados.find(c => {
                return Number(c.criterioId) === Number(criterio.criterioEvaluacionId);
              });
              return !evaluado || !evaluado.cumple;
            });
            
            if (criteriosFaltantes.length > 0) {
              nuevosErrores.criteriosEvaluacion = `Debe cumplir con todos los criterios de evaluación (${criteriosFaltantes.length} pendientes)`;
            }
          }
        }
      } else {
        // Validación para otros compromisos (1, 2, 4-21)
        if (!formData.documentoFile && !pdfUrlPaso2) {
          nuevosErrores.documentoFile = 'Debe adjuntar el documento normativo (PDF)';
        }
        // Validar que todos los criterios activos del compromiso estén marcados
        if (compromisoSeleccionado?.criteriosEvaluacion) {
          const criteriosActivos = compromisoSeleccionado.criteriosEvaluacion.filter(c => c.activo);
          console.log('🔍 VALIDACIÓN - criteriosActivos:', criteriosActivos);
          console.log('🔍 VALIDACIÓN - formData.criteriosEvaluados:', formData.criteriosEvaluados);
          
          const criteriosFaltantes = criteriosActivos.filter(criterio => {
            const evaluado = formData.criteriosEvaluados.find(c => {
              const match = Number(c.criterioId) === Number(criterio.criterioEvaluacionId);
              console.log(`🔍 Comparando: c.criterioId=${c.criterioId} (${typeof c.criterioId}) vs criterio.criterioEvaluacionId=${criterio.criterioEvaluacionId} (${typeof criterio.criterioEvaluacionId}) => match=${match}`);
              return match;
            });
            console.log(`🔍 Criterio ${criterio.criterioEvaluacionId}: evaluado=`, evaluado, 'cumple=', evaluado?.cumple);
            return !evaluado || !evaluado.cumple;
          });
          
          console.log('🔍 VALIDACIÓN - criteriosFaltantes:', criteriosFaltantes);
          
          if (criteriosFaltantes.length > 0) {
            nuevosErrores.criteriosEvaluacion = `Debe cumplir con todos los criterios de evaluación (${criteriosFaltantes.length} pendientes)`;
          }
        }
      }
    }

    if (paso === 3) {
      if (!formData.aceptaPoliticaPrivacidad) nuevosErrores.aceptaPoliticaPrivacidad = 'Debe aceptar la política de privacidad';
      if (!formData.aceptaDeclaracionJurada) nuevosErrores.aceptaDeclaracionJurada = 'Debe aceptar la declaración jurada';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSiguiente = async () => {
    // En modo lectura, solo avanzar sin validar ni guardar
    if (viewMode) {
      if (pasoActual < 3) {
        setPasoActual(pasoActual + 1);
      }
      return;
    }

    // Modo edición: validar y guardar
    if (validarPaso(pasoActual)) {
      // Guardar progreso antes de avanzar
      const guardado = await guardarProgreso();
      
      if (guardado && pasoActual < 3) {
        setPasoActual(pasoActual + 1);
      }
    } else {
      showErrorToast('Por favor complete todos los campos requeridos');
    }
  };

  const guardarProgreso = async (esFinal = false) => {
    try {
      setSaving(true);
      
      // Si es guardado final, usar paso 3 para asegurar estado "enviado"
      const pasoParaGuardar = esFinal ? 3 : pasoActual;
      
      console.log('=== GUARDAR PROGRESO ===');
      console.log('Compromiso ID:', formData.compromisoId);
      console.log('User:', user);
      console.log('Paso actual:', pasoActual);
      console.log('Paso para guardar:', pasoParaGuardar, 'esFinal:', esFinal);
      console.log('formData.documentoFile:', formData.documentoFile);
      console.log('pdfUrl:', pdfUrl);

      // Subir el documento si hay uno nuevo (puede ser en paso 1 o paso 2)
      let documentoUrl = null;
      let blobUrlToRevoke = null;
      
      // Determinar qué URL de PDF usar según el paso actual
      // Paso 1: usar pdfUrl (documento específico del compromiso)
      // Paso 2: usar pdfUrlPaso2 (documento de cumplimiento normativo)
      const currentPdfUrl = pasoParaGuardar === 2 ? pdfUrlPaso2 : pdfUrl;
      console.log(`📄 Usando PDF del paso ${pasoParaGuardar}:`, currentPdfUrl);
      
      // Verificar si hay un archivo nuevo (blob URL local) que necesita ser subido
      console.log('🔍 Verificando archivo - documentoFile:', !!formData.documentoFile, 'currentPdfUrl:', currentPdfUrl);
      if (formData.documentoFile && currentPdfUrl && currentPdfUrl.startsWith('blob:')) {
        console.log('📤 Subiendo archivo nuevo a Supabase...');
        blobUrlToRevoke = currentPdfUrl; // Guardar para revocar después
        try {
          const uploadResponse = await cumplimientoService.uploadDocument(formData.documentoFile);
          console.log('📦 Respuesta completa de upload:', uploadResponse);
          documentoUrl = uploadResponse.data?.url || uploadResponse.url || uploadResponse.Url;
          console.log('✅ URL del documento subido:', documentoUrl);
          if (!documentoUrl) {
            console.error('❌ No se obtuvo URL del documento subido. Respuesta:', uploadResponse);
            showErrorToast('Error al subir el documento');
          }
        } catch (uploadError) {
          console.error('❌ Error al subir documento:', uploadError);
          showErrorToast('Error al subir el documento: ' + uploadError.message);
          throw uploadError;
        }
        // NO revocar aún - esperar a que se actualice el estado
      } else if (currentPdfUrl && !currentPdfUrl.startsWith('blob:')) {
        // Si tenemos una URL de Supabase válida (no blob), mantenerla
        console.log('📄 Manteniendo URL de Supabase existente:', currentPdfUrl);
        documentoUrl = currentPdfUrl;
      } else {
        // Si no hay archivo nuevo ni URL existente
        console.log('⚠️ No hay archivo para guardar - documentoFile:', !!formData.documentoFile, ', currentPdfUrl:', currentPdfUrl);
        documentoUrl = null;
      }
      
      console.log('📝 URL final a guardar:', documentoUrl);

      let response;
      
      // COMPROMISO 1: Guardar datos del líder en com1_liderg_td (Paso 1)
      if (parseInt(formData.compromisoId) === 1 && pasoActual === 1) {
        console.log('🔄 Compromiso 1 - Guardando datos del líder en com1_liderg_td');
        
        // Validar que tenemos el UserId del usuario autenticado
        const userId = getUserId();
        const entityId = getUserEntityIdForData();
        if (!userId || !entityId) {
          showErrorToast('Error: No se pudo obtener la información del usuario. Por favor, refresque la página.');
          return;
        }
        
        const com1Data = {
          CompromisoId: 1,
          EntidadId: entityId,
          dniLider: formData.nroDni,
          nombreLider: formData.nombres,
          apePatLider: formData.apellidoPaterno,
          apeMatLider: formData.apellidoMaterno,
          emailLider: formData.correoElectronico,
          telefonoLider: formData.telefono,
          rolLider: formData.rol,
          cargoLider: formData.cargo,
          fecIniLider: formData.fechaInicio,
          checkPrivacidad: false,
          checkDdjj: false,
          UsuarioRegistra: userId,
          etapaFormulario: 'paso1',
          estado: 'en_proceso'
        };
        
        console.log('Datos Com1 (líder) a enviar:', com1Data);
        
        if (com4RecordId) { // Usamos com4RecordId para almacenar el ID de Com1
          console.log('Actualizando registro Com1 existente:', com4RecordId);
          response = await com1LiderGTDService.update(com4RecordId, com1Data);
        } else {
          console.log('Creando nuevo registro Com1');
          response = await com1LiderGTDService.create(com1Data);
          console.log('Respuesta create Com1:', response);
          if (response.isSuccess && response.data) {
            console.log('ID del nuevo registro Com1:', response.data.id);
            setCom4RecordId(response.data.id); // Guardar el ID
          }
        }
        
        console.log('Respuesta final Com1:', response);
      }
      
      // COMPROMISO 2: Guardar miembros del comité en com2_cgtd (Paso 1)
      if (parseInt(formData.compromisoId) === 2 && pasoActual === 1) {
        console.log('🔄 Compromiso 2 - Guardando miembros del comité en com2_cgtd');
        
        // Transform miembros array to PascalCase for backend
        const miembrosTransformados = miembrosComite.map(m => ({
          MiembroId: (m.miembroId && !m.miembroId.toString().startsWith('temp_')) ? m.miembroId : null, // Set null for temp IDs
          Dni: m.dni?.toString() || '',
          Nombre: m.nombre?.toString() || '',
          ApellidoPaterno: m.apellidoPaterno?.toString() || '',
          ApellidoMaterno: m.apellidoMaterno?.toString() || '',
          Cargo: m.cargo?.toString() || '',
          Email: m.email?.toString() || '',
          Telefono: m.telefono?.toString() || '',
          Rol: m.rol?.toString() || '',
          Activo: true
        }));
        
        // Validar que tenemos el UserId del usuario autenticado
        const userId = getUserId();
        const entityId = getUserEntityIdForData();
        console.log('🔍 Debug - userId:', userId, 'entityId:', entityId);
        console.log('🔍 Debug - user object:', user);
        if (!userId || !entityId) {
          showErrorToast('Error: No se pudo obtener la información del usuario. Por favor, refresque la página.');
          return;
        }
        
        const com2Data = {
          CompromisoId: 2,
          EntidadId: entityId,
          Miembros: miembrosTransformados,
          CheckPrivacidad: false,
          CheckDdjj: false,
          UsuarioRegistra: userId,
          EtapaFormulario: 'paso1',
          Estado: 'en_proceso'
        };
        
        console.log('🔍 Debug - miembrosComite:', miembrosComite);
        console.log('🔍 Debug - miembrosTransformados:', miembrosTransformados);
        console.log('Datos Com2 (miembros) a enviar:', com2Data);
        
        if (com2RecordId) {
          console.log('Actualizando registro Com2 existente:', com2RecordId);
          response = await com2CGTDService.update(com2RecordId, com2Data);
        } else {
          console.log('Creando nuevo registro Com2');
          response = await com2CGTDService.create(com2Data);
          console.log('Respuesta create Com2:', response);
          if (response.isSuccess && response.data) {
            // El backend devuelve comcgtdEntId o ComcgtdEntId
            const newId = response.data.comcgtdEntId || response.data.ComcgtdEntId || response.data.id;
            console.log('ID del nuevo registro Com2:', newId);
            setCom2RecordId(newId);
          }
        }
        
        console.log('Respuesta final Com2:', response);
      }
      
      // COMPROMISOS 1 y 2: Pasos 2 y 3 (Paso 1 ya guardado en tablas específicas arriba)
      if (parseInt(formData.compromisoId) >= 1 && parseInt(formData.compromisoId) <= 2) {
        console.log(`🚀 Preparando datos para Com${formData.compromisoId} (Paso ${pasoActual})`);
        
        // Paso 1: Ya guardado en com1_liderg_td o com2_cgtd arriba
        if (pasoActual === 1) {
          console.log(`⏭️ Compromiso ${formData.compromisoId} Paso 1 - Ya guardado en tabla específica`);
        }
        // Pasos 2 y 3: Guardar directamente en la tabla específica (com1 o com2)
        else if (pasoActual === 2 || pasoActual === 3) {
          console.log(`🔍 DEBUG Paso ${pasoActual} - formData.aceptaPoliticaPrivacidad:`, formData.aceptaPoliticaPrivacidad);
          console.log(`🔍 DEBUG Paso ${pasoActual} - formData.aceptaDeclaracionJurada:`, formData.aceptaDeclaracionJurada);
          
          // Guardar directamente en la tabla específica del compromiso
          if (parseInt(formData.compromisoId) === 1) {
            // Compromiso 1: Actualizar com1_liderg_td
            const com1UpdateData = {
              ...(pasoActual === 2 && documentoUrl && { RutaPdfNormativa: documentoUrl }),
              ...(pasoActual === 3 && {
                CheckPrivacidad: formData.aceptaPoliticaPrivacidad || false,
                CheckDdjj: formData.aceptaDeclaracionJurada || false,
              }),
              EtapaFormulario: pasoActual === 3 ? 'completado' : 'paso2',
              Estado: pasoActual === 3 ? 'enviado' : 'en_proceso'
            };
            
            console.log(`📤 Datos Com1 Paso ${pasoActual} a enviar:`, com1UpdateData);
            
            if (com4RecordId) {
              response = await com1LiderGTDService.update(com4RecordId, com1UpdateData);
              if (pasoActual === 2 && documentoUrl) {
                setPdfUrlPaso2(documentoUrl);
                if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
              }
            } else {
              console.error('❌ No hay com4RecordId para actualizar Com1');
              response = { isSuccess: false, message: 'No se encontró el registro del compromiso 1' };
            }
          } else if (parseInt(formData.compromisoId) === 2) {
            // Compromiso 2: Actualizar com2_cgtd
            const com2UpdateData = {
              ...(pasoActual === 2 && documentoUrl && { RutaPdfNormativa: documentoUrl }),
              ...(pasoActual === 3 && {
                CheckPrivacidad: formData.aceptaPoliticaPrivacidad || false,
                CheckDdjj: formData.aceptaDeclaracionJurada || false,
              }),
              EtapaFormulario: pasoActual === 3 ? 'completado' : 'paso2',
              Estado: pasoActual === 3 ? 'enviado' : 'en_proceso'
            };
            
            console.log(`📤 Datos Com2 Paso ${pasoActual} a enviar:`, com2UpdateData);
            
            if (com2RecordId) {
              response = await com2CGTDService.update(com2RecordId, com2UpdateData);
              if (pasoActual === 2 && documentoUrl) {
                setPdfUrlPaso2(documentoUrl);
                if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
              }
            } else {
              console.error('❌ No hay com2RecordId para actualizar Com2');
              response = { isSuccess: false, message: 'No se encontró el registro del compromiso 2' };
            }
          }
        }
        
        console.log(`Respuesta final Com${formData.compromisoId}:`, response);
      }
      // COMPROMISO 3: Elaborar Plan de Gobierno Digital (Usar tabla com3_epgd)
      else if (parseInt(formData.compromisoId) === 3) {
        console.log(`🚀 Preparando datos para Com3 EPGD (Paso ${pasoActual})`);
        
        // Paso 1: Actualizar estado cuando avanza a siguiente paso
        if (pasoActual === 1) {
          console.log('⏭️ Paso 1 Com3 - Actualizando estado a en_proceso al avanzar');
          
          // Determinar estado según si es final o no
          let nuevoEstado;
          if (esFinal) {
            nuevoEstado = 'enviado';
          } else {
            nuevoEstado = 'en_proceso';
          }
          
          if (com3RecordId) {
            const com3UpdateData = {
              EtapaFormulario: esFinal ? 'completado' : 'paso2',
              Estado: nuevoEstado
            };
            
            console.log(`📤 Actualizando Com3 Paso 1 (esFinal: ${esFinal}, Estado: ${nuevoEstado}):`, com3UpdateData);
            response = await com3EPGDService.update(com3RecordId, com3UpdateData);
          } else {
            console.log('⚠️ No hay com3RecordId, simulando respuesta exitosa');
            response = { isSuccess: true, success: true, data: {} };
          }
        }
        // Paso 2 y 3: Guardar directamente en com3_epgd
        // NOTA: Los criterios ahora se guardan en evaluacion_respuestas_entidad, no aquí
        else if (pasoActual >= 2) {
          // Determinar estado según si es final o no
          let nuevoEstado;
          if (esFinal) {
            nuevoEstado = 'enviado';
          } else {
            nuevoEstado = 'en_proceso';
          }
          
          const com3UpdateData = {
            ...(pasoActual === 2 && documentoUrl && { RutaPdfNormativa: documentoUrl }),
            ...(pasoActual === 3 && {
              CheckPrivacidad: formData.aceptaPoliticaPrivacidad || false,
              CheckDdjj: formData.aceptaDeclaracionJurada || false,
            }),
            EtapaFormulario: esFinal ? 'completado' : (pasoActual === 3 ? 'completado' : 'paso2'),
            Estado: nuevoEstado
          };
          
          console.log(`📤 Datos Com3 Paso ${pasoActual} a enviar (esFinal: ${esFinal}, Estado: ${nuevoEstado}):`, com3UpdateData);
          
          if (com3RecordId) {
            response = await com3EPGDService.update(com3RecordId, com3UpdateData);
            if (pasoActual === 2 && documentoUrl) {
              setPdfUrlPaso2(documentoUrl);
              if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
            }
          } else {
            console.error('❌ No hay com3RecordId para actualizar Com3');
            response = { isSuccess: false, message: 'No se encontró el registro del compromiso 3' };
          }
        }
        
        console.log('Respuesta final Com3:', response);
      }
      // COMPROMISO 4: Incorporar TD en el PEI (Pasos 1, 2 y 3)
      else if (parseInt(formData.compromisoId) === 4) {
        console.log(`🚀 Preparando datos para Com4 PEI (Paso ${pasoActual})`);
        
        // Paso 1: Guardar en com4_tdpei
        if (pasoActual === 1) {
          console.log('📋 Paso 1 Com4 - documentoUrl final:', documentoUrl);
          const com4Data = {
            CompromisoId: 4,
            EntidadId: getUserEntityIdForData(),
            AnioInicioPei: parseInt(formData.anioInicio) || null,
            AnioFinPei: parseInt(formData.anioFin) || null,
            FechaAprobacionPei: formData.fechaAprobacion || null,
            ObjetivoPei: formData.objetivoEstrategico || null,
            DescripcionPei: formData.descripcionIncorporacion || null,
            AlineadoPgd: formData.alineadoPgd || false,
            RutaPdfPei: documentoUrl || null,
            UsuarioRegistra: getUserId(),
            EtapaFormulario: 'paso1'
          };
          
          console.log('📤 Datos Com4 Paso 1 a enviar:', com4Data);
          console.log('🔑 rutaPdfPei que se guardará:', com4Data.rutaPdfPei);
          
          if (com4RecordId) {
            console.log('Actualizando registro existente Com4:', com4RecordId);
            response = await com4PEIService.update(com4RecordId, com4Data);
          } else {
            console.log('Creando nuevo registro Com4');
            response = await com4PEIService.create(com4Data);
            if ((response.isSuccess || response.success) && response.data) {
              const recordId = response.data.comtdpeiEntId;
              console.log('ID del nuevo registro Com4:', recordId);
              setCom4RecordId(recordId);
            }
          }
          
          console.log('✅ Respuesta Com4:', response);
          if ((response.isSuccess || response.success) && response.data?.rutaPdfPei) {
            console.log('📄 Actualizando pdfUrl con:', response.data.rutaPdfPei);
            setPdfUrl(response.data.rutaPdfPei);
            if (blobUrlToRevoke) {
              console.log('🗑️ Revocando blob URL:', blobUrlToRevoke);
              URL.revokeObjectURL(blobUrlToRevoke);
            }
          } else {
            console.log('⚠️ No se recibió rutaPdfPei en la respuesta:', response.data);
          }
        }
        // Paso 2 y 3: Guardar directamente en com4_tdpei
        else if (pasoActual === 2 || pasoActual === 3) {
          const com4UpdateData = {
            ...(pasoActual === 2 && documentoUrl && { RutaPdfNormativa: documentoUrl }),
            ...(pasoActual === 3 && {
              CheckPrivacidad: formData.aceptaPoliticaPrivacidad || false,
              CheckDdjj: formData.aceptaDeclaracionJurada || false,
            }),
            EtapaFormulario: pasoActual === 3 ? 'completado' : 'paso2',
            Estado: pasoActual === 3 ? 'enviado' : 'en_proceso'
          };
          
          console.log(`📤 Datos Com4 Paso ${pasoActual} a enviar:`, com4UpdateData);
          
          if (com4RecordId) {
            response = await com4PEIService.update(com4RecordId, com4UpdateData);
            if (pasoActual === 2 && documentoUrl) {
              setPdfUrlPaso2(documentoUrl);
              if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
            }
          } else {
            console.error('❌ No hay com4RecordId para actualizar Com4');
            response = { isSuccess: false, message: 'No se encontró el registro del compromiso 4' };
          }
        }
        
        console.log('Respuesta final Com4:', response);
      }
      // COMPROMISO 5: Estrategia Digital (Pasos 1, 2 y 3)
      else if (parseInt(formData.compromisoId) === 5) {
        console.log(`🚀 Preparando datos para Com5 Estrategia Digital (Paso ${pasoActual})`);
        
        // Paso 1: Guardar en com5_estrategia_digital
        if (pasoActual === 1) {
          const com5Data = {
            CompromisoId: 5,
            EntidadId: getUserEntityIdForData(),
            NombreEstrategia: formData.nombreEstrategia || null,
            PeriodoInicioEstrategia: parseInt(formData.anioInicio) || null,
            PeriodoFinEstrategia: parseInt(formData.anioFin) || null,
            FechaAprobacionEstrategia: formData.fechaAprobacion || null,
            ObjetivosEstrategicos: formData.objetivosEstrategicos || null,
            LineasAccion: formData.lineasAccion || null,
            AlineadoPgdEstrategia: formData.alineadoPgd || false,
            EstadoImplementacionEstrategia: formData.estadoImplementacion || null,
            RutaPdfEstrategia: documentoUrl || null,
            UsuarioRegistra: getUserId(),
            EtapaFormulario: 'paso1'
          };
          
          console.log('Datos Com5 Paso 1 a enviar:', com5Data);
          
          if (com5RecordId) {
            response = await com5EstrategiaDigitalService.update(com5RecordId, com5Data);
          } else {
            response = await com5EstrategiaDigitalService.create(com5Data);
            if ((response.isSuccess || response.success) && response.data) {
              setCom5RecordId(response.data.comdedEntId);
            }
          }
          
          if ((response.isSuccess || response.success) && response.data?.rutaPdfEstrategia) {
            setPdfUrl(response.data.rutaPdfEstrategia);
            if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
          }
        }
        // Paso 2 y 3: Guardar directamente en com5_estrategia_digital
        else if (pasoActual === 2 || pasoActual === 3) {
          const com5UpdateData = {
            ...(pasoActual === 2 && documentoUrl && { RutaPdfNormativa: documentoUrl }),
            ...(pasoActual === 3 && {
              CheckPrivacidad: formData.aceptaPoliticaPrivacidad || false,
              CheckDdjj: formData.aceptaDeclaracionJurada || false,
            }),
            EtapaFormulario: pasoActual === 3 ? 'completado' : 'paso2',
            Estado: pasoActual === 3 ? 'enviado' : 'en_proceso'
          };
          
          console.log(`📤 Datos Com5 Paso ${pasoActual} a enviar:`, com5UpdateData);
          
          if (com5RecordId) {
            response = await com5EstrategiaDigitalService.update(com5RecordId, com5UpdateData);
            if (pasoActual === 2 && documentoUrl) {
              setPdfUrlPaso2(documentoUrl);
              if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
            }
          } else {
            console.error('❌ No hay com5RecordId para actualizar Com5');
            response = { isSuccess: false, message: 'No se encontró el registro del compromiso 5' };
          }
        }
        
        console.log('Respuesta final Com5:', response);
      }
      // COMPROMISO 6: Migración GOB.PE (Pasos 1, 2 y 3)
      else if (parseInt(formData.compromisoId) === 6) {
        console.log(`🚀 Preparando datos para Com6 Migración GOB.PE (Paso ${pasoActual})`);
        
        if (pasoActual === 1) {
          const com6Data = {
            CompromisoId: 6,
            EntidadId: getUserEntityIdForData(),
            UrlGobpe: formData.urlPortalGobPe || null,
            FechaMigracionGobpe: formData.fechaMigracion || null,
            FechaActualizacionGobpe: formData.fechaUltimaActualizacion || null,
            ResponsableGobpe: formData.nombreResponsable || null,
            CorreoResponsableGobpe: formData.correoResponsable || null,
            TelefonoResponsableGobpe: formData.telefonoResponsable || null,
            TipoMigracionGobpe: formData.tipoMigracion || null,
            ObservacionGobpe: formData.observacionesMigracion || null,
            RutaPdfGobpe: documentoUrl || null,
            UsuarioRegistra: getUserId(),
            EtapaFormulario: 'paso1'
          };
          
          if (com6RecordId) {
            response = await com6MigracionGobPeService.update(com6RecordId, com6Data);
          } else {
            response = await com6MigracionGobPeService.create(com6Data);
            if (response.isSuccess && response.data) {
              setCom6RecordId(response.data.commpgobpeEntId);
            }
          }
          
          if (response.isSuccess && response.data?.rutaPdfGobpe) {
            setPdfUrl(response.data.rutaPdfGobpe);
            if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
          }
        } else if (pasoActual === 2 || pasoActual === 3) {
          const com6UpdateData = {
            ...(pasoActual === 2 && documentoUrl && { RutaPdfNormativa: documentoUrl }),
            ...(pasoActual === 3 && {
              CheckPrivacidad: formData.aceptaPoliticaPrivacidad || false,
              CheckDdjj: formData.aceptaDeclaracionJurada || false,
            }),
            EtapaFormulario: pasoActual === 3 ? 'completado' : 'paso2',
            Estado: pasoActual === 3 ? 'enviado' : 'en_proceso'
          };
          
          console.log(`📤 Datos Com6 Paso ${pasoActual} a enviar:`, com6UpdateData);
          
          if (com6RecordId) {
            response = await com6MigracionGobPeService.update(com6RecordId, com6UpdateData);
            if (pasoActual === 2 && documentoUrl) {
              setPdfUrlPaso2(documentoUrl);
              if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
            }
          } else {
            console.error('❌ No hay com6RecordId para actualizar Com6');
            response = { isSuccess: false, message: 'No se encontró el registro del compromiso 6' };
          }
        }
        
        console.log('Respuesta final Com6:', response);
      }
      // COMPROMISO 7: Implementación MPD (Pasos 1, 2 y 3)
      else if (parseInt(formData.compromisoId) === 7) {
        console.log(`🚀 Preparando datos para Com7 Implementación MPD (Paso ${pasoActual})`);
        
        if (pasoActual === 1) {
          const com7Data = {
            CompromisoId: 7,
            EntidadId: getUserEntityIdForData(),
            UrlMpd: formData.urlMpd || null,
            FechaImplementacionMpd: formData.fechaImplementacionMpd || null,
            ResponsableMpd: formData.responsableMpd || null,
            CargoResponsableMpd: formData.cargoResponsableMpd || null,
            CorreoResponsableMpd: formData.correoResponsableMpd || null,
            TelefonoResponsableMpd: formData.telefonoResponsableMpd || null,
            TipoMpd: formData.tipoMpd || null,
            InteroperabilidadMpd: formData.interoperabilidadMpd || false,
            ObservacionMpd: formData.observacionMpd || null,
            RutaPdfMpd: documentoUrl || null,
            UsuarioRegistra: getUserId(),
            EtapaFormulario: 'paso1'
          };
          
          if (com7RecordId) {
            response = await com7ImplementacionMPDService.update(com7RecordId, com7Data);
          } else {
            response = await com7ImplementacionMPDService.create(com7Data);
            if (response.isSuccess && response.data) {
              setCom7RecordId(response.data.comimpdEntId);
            }
          }
          
          if (response.isSuccess && response.data?.rutaPdfMpd) {
            setPdfUrl(response.data.rutaPdfMpd);
            if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
          }
        } else if (pasoActual === 2 || pasoActual === 3) {
          const com7UpdateData = {
            ...(pasoActual === 2 && documentoUrl && { RutaPdfNormativa: documentoUrl }),
            ...(pasoActual === 3 && {
              CheckPrivacidad: formData.aceptaPoliticaPrivacidad || false,
              CheckDdjj: formData.aceptaDeclaracionJurada || false,
            }),
            EtapaFormulario: pasoActual === 3 ? 'completado' : 'paso2',
            Estado: pasoActual === 3 ? 'enviado' : 'en_proceso'
          };
          
          console.log(`📤 Datos Com7 Paso ${pasoActual} a enviar:`, com7UpdateData);
          
          if (com7RecordId) {
            response = await com7ImplementacionMPDService.update(com7RecordId, com7UpdateData);
            if (pasoActual === 2 && documentoUrl) {
              setPdfUrlPaso2(documentoUrl);
              if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
            }
          } else {
            console.error('❌ No hay com7RecordId para actualizar Com7');
            response = { isSuccess: false, message: 'No se encontró el registro del compromiso 7' };
          }
        }
        
        console.log('Respuesta final Com7:', response);
      }
      // COMPROMISO 8: Publicación TUPA (Pasos 1, 2 y 3)
      else if (parseInt(formData.compromisoId) === 8) {
        console.log(`🚀 Preparando datos para Com8 Publicación TUPA (Paso ${pasoActual})`);
        
        if (pasoActual === 1) {
          const com8Data = {
            CompromisoId: 8,
            EntidadId: getUserEntityIdForData(),
            Estado: 'en_proceso',
            UrlTupa: formData.urlTupa || null,
            NumeroResolucionTupa: formData.numeroResolucionTupa || null,
            FechaAprobacionTupa: formData.fechaAprobacionTupa || null,
            ResponsableTupa: formData.responsableTupa || null,
            CargoResponsableTupa: formData.cargoResponsableTupa || null,
            CorreoResponsableTupa: formData.correoResponsableTupa || null,
            TelefonoResponsableTupa: formData.telefonoResponsableTupa || null,
            ActualizadoTupa: formData.actualizadoTupa || false,
            ObservacionTupa: formData.observacionesTupa || null,
            RutaPdfTupa: documentoUrl || null,
            UsuarioRegistra: getUserId(),
            EtapaFormulario: 'paso1',
            EstadoPCM: 'En Proceso'
          };
          
          if (com8RecordId) {
            response = await com8PublicacionTUPAService.update(com8RecordId, com8Data);
          } else {
            response = await com8PublicacionTUPAService.create(com8Data);
            if (response.isSuccess && response.data) {
              setCom8RecordId(response.data.comptupaEntId);
            }
          }
          
          if (response.isSuccess && response.data?.rutaPdfTupa) {
            setPdfUrl(response.data.rutaPdfTupa);
            if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
          }
        } else if (pasoActual === 2 || pasoActual === 3) {
          const com8UpdateData = {
            ...(pasoActual === 2 && documentoUrl && { RutaPdfNormativa: documentoUrl }),
            ...(pasoActual === 3 && {
              CheckPrivacidad: formData.aceptaPoliticaPrivacidad || false,
              CheckDdjj: formData.aceptaDeclaracionJurada || false,
            }),
            EtapaFormulario: pasoActual === 3 ? 'completado' : 'paso2',
            Estado: pasoActual === 3 ? 'enviado' : 'en_proceso'
          };
          
          console.log(`📤 Datos Com8 Paso ${pasoActual} a enviar:`, com8UpdateData);
          
          if (com8RecordId) {
            response = await com8PublicacionTUPAService.update(com8RecordId, com8UpdateData);
            if (pasoActual === 2 && documentoUrl) {
              setPdfUrlPaso2(documentoUrl);
              if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
            }
          } else {
            console.error('❌ No hay com8RecordId para actualizar Com8');
            response = { isSuccess: false, message: 'No se encontró el registro del compromiso 8' };
          }
        }
        
        console.log('Respuesta final Com8:', response);
      }
      // COMPROMISO 9: Modelo de Gestión Documental
      else if (parseInt(formData.compromisoId) === 9) {
        console.log(`🚀 Preparando datos para Com9 MGD (Paso ${pasoActual})`);
        
        if (pasoActual === 1) {
          const com9Data = {
            CompromisoId: 9,
            EntidadId: getUserEntityIdForData(),
            FechaAprobacionMgd: formData.fechaAprobacionMgd || null,
            NumeroResolucionMgd: formData.numeroResolucionMgd || null,
            ResponsableMgd: formData.responsableMgd || null,
            CargoResponsableMgd: formData.cargoResponsableMgd || null,
            CorreoResponsableMgd: formData.correoResponsableMgd || null,
            TelefonoResponsableMgd: formData.telefonoResponsableMgd || null,
            SistemaPlataformaMgd: formData.sistemaPlataformaMgd || null,
            TipoImplantacionMgd: formData.tipoImplantacionMgd || null,
            InteroperaSistemasMgd: formData.interoperaSistemasMgd || false,
            ObservacionMgd: formData.observacionesMgd || null,
            RutaPdfMgd: documentoUrl || null,
            UsuarioRegistra: getUserId(),
            EtapaFormulario: 'paso1'
          };
          
          if (com9RecordId) {
            response = await com9ModeloGestionDocumentalService.update(com9RecordId, com9Data);
          } else {
            response = await com9ModeloGestionDocumentalService.create(com9Data);
            if (response.isSuccess && response.data) {
              setCom9RecordId(response.data.commgdEntId);
            }
          }
          
          if (response.isSuccess && response.data?.rutaPdfMgd) {
            setPdfUrl(response.data.rutaPdfMgd);
            if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
          }
        } else if (pasoActual === 2 || pasoActual === 3) {
          const com9UpdateData = {
            ...(pasoActual === 2 && documentoUrl && { RutaPdfNormativa: documentoUrl }),
            ...(pasoActual === 3 && {
              CheckPrivacidad: formData.aceptaPoliticaPrivacidad || false,
              CheckDdjj: formData.aceptaDeclaracionJurada || false,
            }),
            EtapaFormulario: pasoActual === 3 ? 'completado' : 'paso2',
            Estado: pasoActual === 3 ? 'enviado' : 'en_proceso'
          };
          
          console.log(`📤 Datos Com9 Paso ${pasoActual} a enviar:`, com9UpdateData);
          
          if (com9RecordId) {
            response = await com9ModeloGestionDocumentalService.update(com9RecordId, com9UpdateData);
            if (pasoActual === 2 && documentoUrl) {
              setPdfUrlPaso2(documentoUrl);
              if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
            }
          } else {
            console.error('❌ No hay com9RecordId para actualizar Com9');
            response = { isSuccess: false, message: 'No se encontró el registro del compromiso 9' };
          }
        }
        
        console.log('Respuesta final Com9:', response);
      }
      // COMPROMISO 10: Datos Abiertos
      else if (parseInt(formData.compromisoId) === 10) {
        console.log(`🚀 Preparando datos para Com10 Datos Abiertos (Paso ${pasoActual})`);
        
        if (pasoActual === 1) {
          const com10Data = {
            CompromisoId: 10,
            EntidadId: getUserEntityIdForData(),
            Estado: 'en_proceso',
            EstadoPCM: 'En Proceso',
            UrlDatosAbiertos: formData.urlDatosAbiertos || null,
            TotalDatasets: formData.totalDatasets ? parseInt(formData.totalDatasets) : null,
            FechaUltimaActualizacionDa: formData.fechaUltimaActualizacionDa || null,
            ResponsableDa: formData.responsableDa || null,
            CargoResponsableDa: formData.cargoDa || null,
            CorreoResponsableDa: formData.correoDa || null,
            TelefonoResponsableDa: formData.telefonoDa || null,
            NumeroNormaResolucionDa: formData.numeroNormaResolucionDa || null,
            FechaAprobacionDa: formData.fechaAprobacionDa || null,
            ObservacionDa: formData.observacionesDa || null,
            RutaPdfDa: documentoUrl || null,
            UsuarioRegistra: getUserId(),
            EtapaFormulario: 'paso1'
          };
          
          if (com10RecordId) {
            response = await com10DatosAbiertosService.update(com10RecordId, com10Data);
          } else {
            response = await com10DatosAbiertosService.create(com10Data);
            if (response.isSuccess && response.data) {
              setCom10RecordId(response.data.comdaEntId);
            }
          }
          
          if (response.isSuccess && response.data?.rutaPdfDa) {
            setPdfUrl(response.data.rutaPdfDa);
            if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
          }
        } else if (pasoActual === 2 || pasoActual === 3) {
          const com10UpdateData = {
            ...(pasoActual === 2 && documentoUrl && { RutaPdfNormativa: documentoUrl }),
            ...(pasoActual === 3 && {
              CheckPrivacidad: formData.aceptaPoliticaPrivacidad || false,
              CheckDdjj: formData.aceptaDeclaracionJurada || false,
            }),
            EtapaFormulario: pasoActual === 3 ? 'completado' : 'paso2',
            Estado: pasoActual === 3 ? 'enviado' : 'en_proceso'
          };
          
          console.log(`📤 Datos Com10 Paso ${pasoActual} a enviar:`, com10UpdateData);
          
          if (com10RecordId) {
            response = await com10DatosAbiertosService.update(com10RecordId, com10UpdateData);
            if (pasoActual === 2 && documentoUrl) {
              setPdfUrlPaso2(documentoUrl);
              if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
            }
          } else {
            console.error('❌ No hay com10RecordId para actualizar Com10');
            response = { isSuccess: false, message: 'No se encontró el registro del compromiso 10' };
          }
        }
        
        console.log('Respuesta final Com10:', response);
      } 

      // COMPROMISO 11
      else if (parseInt(formData.compromisoId) === 11) {
        console.log(`🚀 Preparando datos para Com11 (Paso ${pasoParaGuardar})`);
        
        if (pasoParaGuardar === 1) {
          const com11Data = {
            CompromisoId: 11,
            EntidadId: getUserEntityIdForData(),
            // Campos específicos de GeoPeru
            UrlGeo: formData.urlGeo || null,
            TipoInformacionGeo: formData.tipoInformacionGeo || null,
            TotalCapasPublicadas: formData.totalCapasPublicadas ? parseInt(formData.totalCapasPublicadas) : 0,
            FechaUltimaActualizacionGeo: formData.fechaUltimaActualizacionGeo || null,
            ResponsableGeo: formData.responsableGeo || null,
            CargoResponsableGeo: formData.cargoResponsableGeo || null,
            CorreoResponsableGeo: formData.correoResponsableGeo || null,
            TelefonoResponsableGeo: formData.telefonoResponsableGeo || null,
            NormaAprobacionGeo: formData.normaAprobacionGeo || null,
            FechaAprobacionGeo: formData.fechaAprobacionGeo || null,
            InteroperabilidadGeo: formData.interoperabilidadGeo || false,
            ObservacionGeo: formData.observacionGeo || null,
            RutaPdfGeo: documentoUrl || formData.rutaPdfGeo || null,
            UsuarioRegistra: getUserId(),
            EtapaFormulario: 'paso1',
            Estado: 'pendiente'
          };
          
          if (com11RecordId) {
            response = await com11AportacionGeoPeruService.update(com11RecordId, com11Data);
          } else {
            response = await com11AportacionGeoPeruService.create(com11Data);
            if (response.isSuccess && response.data) {
              setCom11RecordId(response.data.comageopEntId);
            }
          }
          
          if (response.isSuccess && response.data?.rutaPdfGeo) {
            setPdfUrl(response.data.rutaPdfGeo);
            if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
          }
        } else if (pasoParaGuardar === 2 || pasoParaGuardar === 3) {
          const com11UpdateData = {
            ...(pasoParaGuardar === 2 && documentoUrl && { RutaPdfNormativa: documentoUrl }),
            ...(pasoParaGuardar === 3 && {
              CheckPrivacidad: formData.aceptaPoliticaPrivacidad || false,
              CheckDdjj: formData.aceptaDeclaracionJurada || false,
            }),
            EtapaFormulario: pasoParaGuardar === 3 ? 'completado' : 'paso2',
            Estado: pasoParaGuardar === 3 ? 'enviado' : 'en_proceso'
          };
          
          console.log(`📤 Datos Com11 Paso ${pasoParaGuardar} a enviar:`, com11UpdateData);
          
          if (com11RecordId) {
            response = await com11AportacionGeoPeruService.update(com11RecordId, com11UpdateData);
            if (pasoParaGuardar === 2 && documentoUrl) {
              setPdfUrlPaso2(documentoUrl);
              if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
            }
          } else {
            console.error('❌ No hay com11RecordId para actualizar Com11');
            response = { isSuccess: false, message: 'No se encontró el registro del compromiso 11' };
          }
        }
        
        console.log('Respuesta final Com11:', response);
      }

      // COMPROMISO 12
      else if (parseInt(formData.compromisoId) === 12) {
        console.log(`🚀 Preparando datos para Com12 (Paso ${pasoActual})`);
        
        if (pasoActual === 1) {
          const com12Data = {
            CompromisoId: 12,
            EntidadId: getUserEntityIdForData(),
            DniRsp: formData.dniRsp || null,
            NombreRsp: formData.nombreRsp || null,
            ApePatRsp: formData.apePatRsp || null,
            ApeMatRsp: formData.apeMatRsp || null,
            CargoRsp: formData.cargoRsp || null,
            CorreoRsp: formData.correoRsp || null,
            TelefonoRsp: formData.telefonoRsp || null,
            FechaDesignacionRsp: formData.fechaDesignacionRsp || null,
            NumeroResolucionRsp: formData.numeroResolucionRsp || null,
            ObservacionRsp: formData.observacionRsp || null,
            RutaPdfRsp: documentoUrl || formData.rutaPdfRsp || null,
            UsuarioRegistra: getUserId(),
            EtapaFormulario: 'paso1',
            Estado: 'pendiente'
          };
          
          if (com12RecordId) {
            response = await com12ResponsableSoftwarePublicoService.update(com12RecordId, com12Data);
          } else {
            response = await com12ResponsableSoftwarePublicoService.create(com12Data);
            if (response.isSuccess && response.data) {
              setCom12RecordId(response.data.comdrspEntId);
            }
          }
          
          if (response.isSuccess && response.data?.rutaPdfRsp) {
            setPdfUrl(response.data.rutaPdfRsp);
            if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
          }
        } else if (pasoActual === 2 || pasoActual === 3) {
          const com12UpdateData = {
            ...(pasoActual === 2 && documentoUrl && { RutaPdfNormativa: documentoUrl }),
            ...(pasoActual === 3 && {
              CheckPrivacidad: formData.aceptaPoliticaPrivacidad || false,
              CheckDdjj: formData.aceptaDeclaracionJurada || false,
            }),
            EtapaFormulario: pasoActual === 3 ? 'completado' : 'paso2',
            Estado: pasoActual === 3 ? 'enviado' : 'en_proceso'
          };
          
          console.log(`📤 Datos Com12 Paso ${pasoActual} a enviar:`, com12UpdateData);
          
          if (com12RecordId) {
            response = await com12ResponsableSoftwarePublicoService.update(com12RecordId, com12UpdateData);
            if (pasoActual === 2 && documentoUrl) {
              setPdfUrlPaso2(documentoUrl);
              if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
            }
          } else {
            console.error('❌ No hay com12RecordId para actualizar Com12');
            response = { isSuccess: false, message: 'No se encontró el registro del compromiso 12' };
          }
        }
        
        console.log('Respuesta final Com12:', response);
      }

      // COMPROMISO 13
      else if (parseInt(formData.compromisoId) === 13) {
        console.log(`🚀 Preparando datos para Com13 (Paso ${pasoActual})`);
        
        if (pasoActual === 1) {
          const com13Data = {
            CompromisoId: 13,
            EntidadId: getUserEntityIdForData(),
            TipoIntegracionPide: formData.tipoIntegracionPide || null,
            NombreServicioPide: formData.nombreServicioPide || null,
            DescripcionServicioPide: formData.descripcionServicioPide || null,
            FechaInicioOperacionPide: formData.fechaInicioOperacionPide || null,
            UrlServicioPide: formData.urlServicioPide || null,
            ResponsablePide: formData.responsablePide || null,
            CargoResponsablePide: formData.cargoResponsablePide || null,
            CorreoResponsablePide: formData.correoResponsablePide || null,
            TelefonoResponsablePide: formData.telefonoResponsablePide || null,
            NumeroConvenioPide: formData.numeroConvenioPide || null,
            FechaConvenioPide: formData.fechaConvenioPide || null,
            InteroperabilidadPide: formData.interoperabilidadPide || false,
            ObservacionPide: formData.observacionPide || null,
            RutaPdfPide: documentoUrl || formData.rutaPdfPide || null,
            UsuarioRegistra: getUserId(),
            EtapaFormulario: 'paso1',
            Estado: 'pendiente'
          };
          
          console.log('📤 Datos Com13 Paso 1 a enviar:', com13Data);
          console.log('🔑 RutaPdfPide que se guardará:', com13Data.RutaPdfPide);
          
          if (com13RecordId) {
            response = await com13InteroperabilidadPIDEService.update(com13RecordId, com13Data);
          } else {
            response = await com13InteroperabilidadPIDEService.create(com13Data);
            if (response.isSuccess && response.data) {
              setCom13RecordId(response.data.compcpideEntId);
            }
          }
          
          if (response.isSuccess && response.data?.rutaPdfPide) {
            setPdfUrl(response.data.rutaPdfPide);
            if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
          }
        } else if (pasoActual === 2 || pasoActual === 3) {
          const com13UpdateData = {
            ...(pasoActual === 2 && documentoUrl && { RutaPdfNormativa: documentoUrl }),
            ...(pasoActual === 3 && {
              CheckPrivacidad: formData.aceptaPoliticaPrivacidad || false,
              CheckDdjj: formData.aceptaDeclaracionJurada || false,
            }),
            EtapaFormulario: pasoParaGuardar === 3 ? 'completado' : 'paso2',
            Estado: pasoParaGuardar === 3 ? 'enviado' : 'en_proceso'
          };
          
          console.log(`📤 Datos Com13 Paso ${pasoActual} (pasoParaGuardar: ${pasoParaGuardar}) a enviar:`, com13UpdateData);
          
          if (com13RecordId) {
            response = await com13InteroperabilidadPIDEService.update(com13RecordId, com13UpdateData);
            if (pasoActual === 2 && documentoUrl) {
              setPdfUrlPaso2(documentoUrl);
              if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
            }
          } else {
            console.error('❌ No hay com13RecordId para actualizar Com13');
            response = { isSuccess: false, message: 'No se encontró el registro del compromiso 13' };
          }
        }
        
        console.log('Respuesta final Com13:', response);
      }

      // COMPROMISO 14
      else if (parseInt(formData.compromisoId) === 14) {
        console.log(`🚀 Preparando datos para Com14 (Paso ${pasoActual})`);
        
        if (pasoActual === 1) {
          const com14Data = {
            CompromisoId: 14,
            EntidadId: getUserEntityIdForData(),
            DniOscd: formData.dniOscd || null,
            NombreOscd: formData.nombreOscd || null,
            ApePatOscd: formData.apePatOscd || null,
            ApeMatOscd: formData.apeMatOscd || null,
            CargoOscd: formData.cargoOscd || null,
            CorreoOscd: formData.correoOscd || null,
            TelefonoOscd: formData.telefonoOscd || null,
            FechaDesignacionOscd: formData.fechaDesignacionOscd || null,
            NumeroResolucionOscd: formData.numeroResolucionOscd || null,
            ComunicadoPcmOscd: formData.comunicadoPcmOscd || false,
            ObservacionOscd: formData.observacionOscd || null,
            RutaPdfOscd: documentoUrl || formData.rutaPdfOscd || null,
            UsuarioRegistra: getUserId(),
            EtapaFormulario: 'paso1',
            Estado: 'pendiente'
          };
          
          if (com14RecordId) {
            response = await com14OficialSeguridadDigitalService.update(com14RecordId, com14Data);
          } else {
            response = await com14OficialSeguridadDigitalService.create(com14Data);
            if (response.isSuccess && response.data) {
              setCom14RecordId(response.data.comdoscdEntId);
            }
          }
          
          if (response.isSuccess && response.data?.rutaPdfOscd) {
            setPdfUrl(response.data.rutaPdfOscd);
            if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
          }
        } else if (pasoActual === 2 || pasoActual === 3) {
          const com14UpdateData = {
            ...(pasoActual === 2 && documentoUrl && { RutaPdfNormativa: documentoUrl }),
            ...(pasoActual === 3 && {
              CheckPrivacidad: formData.aceptaPoliticaPrivacidad || false,
              CheckDdjj: formData.aceptaDeclaracionJurada || false,
            }),
            EtapaFormulario: pasoActual === 3 ? 'completado' : 'paso2',
            Estado: pasoActual === 3 ? 'enviado' : 'en_proceso'
          };
          
          console.log(`📤 Datos Com14 Paso ${pasoActual} a enviar:`, com14UpdateData);
          
          if (com14RecordId) {
            response = await com14OficialSeguridadDigitalService.update(com14RecordId, com14UpdateData);
            if (pasoActual === 2 && documentoUrl) {
              setPdfUrlPaso2(documentoUrl);
              if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
            }
          } else {
            console.error('❌ No hay com14RecordId para actualizar Com14');
            response = { isSuccess: false, message: 'No se encontró el registro del compromiso 14' };
          }
        }
        
        console.log('Respuesta final Com14:', response);
      }

      // COMPROMISO 15
      else if (parseInt(formData.compromisoId) === 15) {
        console.log(`🚀 Preparando datos para Com15 (Paso ${pasoActual})`);
        
        if (pasoActual === 1) {
          const com15Data = {
            CompromisoId: 15,
            EntidadId: getUserEntityIdForData(),
            NombreCsirt: formData.nombreCsirt || null,
            FechaConformacionCsirt: formData.fechaConformacionCsirt || null,
            NumeroResolucionCsirt: formData.numeroResolucionCsirt || null,
            ResponsableCsirt: formData.responsableCsirt || null,
            CargoResponsableCsirt: formData.cargoResponsableCsirt || null,
            CorreoCsirt: formData.correoCsirt || null,
            TelefonoCsirt: formData.telefonoCsirt || null,
            ProtocoloIncidentesCsirt: formData.protocoloIncidentesCsirt || false,
            ComunicadoPcmCsirt: formData.comunicadoPcmCsirt || false,
            ObservacionCsirt: formData.observacionCsirt || null,
            RutaPdfCsirt: documentoUrl || formData.rutaPdfCsirt || null,
            UsuarioRegistra: getUserId(),
            EtapaFormulario: 'paso1',
            Estado: 'pendiente'
          };
          
          if (com15RecordId) {
            response = await com15CSIRTInstitucionalService.update(com15RecordId, com15Data);
          } else {
            response = await com15CSIRTInstitucionalService.create(com15Data);
            if (response.isSuccess && response.data) {
              setCom15RecordId(response.data.comcsirtEntId);
            }
          }
          
          if (response.isSuccess && response.data?.rutaPdfCsirt) {
            setPdfUrl(response.data.rutaPdfCsirt);
            if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
          }
        } else if (pasoActual === 2 || pasoActual === 3) {
          const com15UpdateData = {
            ...(pasoActual === 2 && documentoUrl && { RutaPdfNormativa: documentoUrl }),
            ...(pasoActual === 3 && {
              CheckPrivacidad: formData.aceptaPoliticaPrivacidad || false,
              CheckDdjj: formData.aceptaDeclaracionJurada || false,
            }),
            EtapaFormulario: pasoActual === 3 ? 'completado' : 'paso2',
            Estado: pasoActual === 3 ? 'enviado' : 'en_proceso'
          };
          
          console.log(`📤 Datos Com15 Paso ${pasoActual} a enviar:`, com15UpdateData);
          
          if (com15RecordId) {
            response = await com15CSIRTInstitucionalService.update(com15RecordId, com15UpdateData);
            if (pasoActual === 2 && documentoUrl) {
              setPdfUrlPaso2(documentoUrl);
              if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
            }
          } else {
            console.error('❌ No hay com15RecordId para actualizar Com15');
            response = { isSuccess: false, message: 'No se encontró el registro del compromiso 15' };
          }
        }
        
        console.log('Respuesta final Com15:', response);
      }

      // COMPROMISO 16
      else if (parseInt(formData.compromisoId) === 16) {
        console.log(`🚀 Preparando datos para Com16 (Paso ${pasoActual})`);
        
        if (pasoActual === 1) {
          const com16Data = {
            CompromisoId: 16,
            EntidadId: getUserEntityIdForData(),
            ResponsableSgsi: formData.responsableSgsi || null,
            CargoResponsableSgsi: formData.cargoResponsableSgsi || null,
            CorreoSgsi: formData.correoSgsi || null,
            TelefonoSgsi: formData.telefonoSgsi || null,
            EstadoImplementacionSgsi: formData.estadoImplementacionSgsi || null,
            VersionNormaSgsi: formData.versionNormaSgsi || null,
            AlcanceSgsi: formData.alcanceSgsi || null,
            FechaInicioSgsi: formData.fechaInicioSgsi || null,
            FechaCertificacionSgsi: formData.fechaCertificacionSgsi || null,
            EntidadCertificadoraSgsi: formData.entidadCertificadoraSgsi || null,
            RutaPdfPoliticasSgsi: documentoUrl || formData.rutaPdfPoliticasSgsi || null,
            RutaPdfCertificadoSgsi: formData.rutaPdfCertificadoSgsi || null,
            ObservacionSgsi: formData.observacionSgsi || null,
            UsuarioRegistra: getUserId(),
            EtapaFormulario: 'paso1',
            Estado: 'pendiente'
          };
          
          if (com16RecordId) {
            response = await com16SistemaGestionSeguridadService.update(com16RecordId, com16Data);
          } else {
            response = await com16SistemaGestionSeguridadService.create(com16Data);
            if (response.isSuccess && response.data) {
              setCom16RecordId(response.data.comsgsiEntId);
            }
          }
          
          if (response.isSuccess && response.data?.rutaPdfPoliticasSgsi) {
            setPdfUrl(response.data.rutaPdfPoliticasSgsi);
            if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
          }
        } else if (pasoActual === 2 || pasoActual === 3) {
          const com16UpdateData = {
            ...(pasoActual === 2 && documentoUrl && { RutaPdfNormativa: documentoUrl }),
            ...(pasoActual === 3 && {
              CheckPrivacidad: formData.aceptaPoliticaPrivacidad || false,
              CheckDdjj: formData.aceptaDeclaracionJurada || false,
            }),
            EtapaFormulario: pasoActual === 3 ? 'completado' : 'paso2',
            Estado: pasoActual === 3 ? 'enviado' : 'en_proceso'
          };
          
          console.log(`📤 Datos Com16 Paso ${pasoActual} a enviar:`, com16UpdateData);
          
          if (com16RecordId) {
            response = await com16SistemaGestionSeguridadService.update(com16RecordId, com16UpdateData);
            if (pasoActual === 2 && documentoUrl) {
              setPdfUrlPaso2(documentoUrl);
              if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
            }
          } else {
            console.error('❌ No hay com16RecordId para actualizar Com16');
            response = { isSuccess: false, message: 'No se encontró el registro del compromiso 16' };
          }
        }
        
        console.log('Respuesta final Com16:', response);
      }

      // COMPROMISO 17: Plan de Transición a IPv6
      else if (parseInt(formData.compromisoId) === 17) {
        console.log(`🚀 Preparando datos para Com17 (Paso ${pasoActual})`);
        
        if (pasoActual === 1) {
          const com17Data = {
            CompromisoId: 17,
            EntidadId: getUserEntityIdForData(),
            ResponsableIpv6: formData.responsableIpv6 || null,
            CargoResponsableIpv6: formData.cargoResponsableIpv6 || null,
            CorreoIpv6: formData.correoIpv6 || null,
            TelefonoIpv6: formData.telefonoIpv6 || null,
            EstadoPlanIpv6: formData.estadoPlanIpv6 || null,
            FechaFormulacionIpv6: formData.fechaFormulacionIpv6 || null,
            FechaAprobacionIpv6: formData.fechaAprobacionIpv6 || null,
            FechaInicioIpv6: formData.fechaInicioIpv6 || null,
            FechaFinIpv6: formData.fechaFinIpv6 || null,
            DescripcionPlanIpv6: formData.descripcionPlanIpv6 || null,
            RutaPdfPlanIpv6: documentoUrl || formData.rutaPdfPlanIpv6 || null,
            ObservacionIpv6: formData.observacionIpv6 || null,
            UsuarioRegistra: getUserId(),
            EtapaFormulario: 'paso1',
            Estado: 'pendiente'
          };
          
          if (com17RecordId) {
            response = await com17PlanTransicionIPv6Service.update(com17RecordId, com17Data);
          } else {
            response = await com17PlanTransicionIPv6Service.create(com17Data);
            if (response.isSuccess && response.data) {
              setCom17RecordId(response.data.id);
            }
          }
          
          if (response.isSuccess && response.data?.archivoPlan) {
            setPdfUrl(response.data.archivoPlan);
            if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
          }
        } else if (pasoActual === 2 || pasoActual === 3) {
          const com17UpdateData = {
            ...(pasoActual === 2 && documentoUrl && { RutaPdfNormativa: documentoUrl }),
            ...(pasoActual === 3 && {
              CheckPrivacidad: formData.aceptaPoliticaPrivacidad || false,
              CheckDdjj: formData.aceptaDeclaracionJurada || false,
            }),
            EtapaFormulario: pasoActual === 3 ? 'completado' : 'paso2',
            Estado: pasoActual === 3 ? 'enviado' : 'en_proceso'
          };
          
          console.log(`📤 Datos Com17 Paso ${pasoActual} a enviar:`, com17UpdateData);
          
          if (com17RecordId) {
            response = await com17PlanTransicionIPv6Service.update(com17RecordId, com17UpdateData);
            if (pasoActual === 2 && documentoUrl) {
              setPdfUrlPaso2(documentoUrl);
              if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
            }
          } else {
            console.error('❌ No hay com17RecordId para actualizar Com17');
            response = { isSuccess: false, message: 'No se encontró el registro del compromiso 17' };
          }
        }
        
        console.log('Respuesta final Com17:', response);
      }

      // COMPROMISO 18: Portal de Transparencia Estándar (PTE)
      else if (parseInt(formData.compromisoId) === 18) {
        console.log(`🚀 Preparando datos para Com18 (Paso ${pasoActual})`);
        
        if (pasoActual === 1) {
          const com18Data = {
            CompromisoId: 18,
            EntidadId: getUserEntityIdForData(),
            ResponsablePte: formData.responsablePte || null,
            CargoResponsablePte: formData.cargoResponsablePte || null,
            CorreoPte: formData.correoPte || null,
            TelefonoPte: formData.telefonoPte || null,
            NumeroOficioPte: formData.numeroOficioPte || null,
            FechaSolicitudPte: formData.fechaSolicitudPte || null,
            FechaAccesoPte: formData.fechaAccesoPte || null,
            EstadoAccesoPte: formData.estadoAccesoPte || null,
            EnlacePortalPte: formData.enlacePortalPte || null,
            DescripcionPte: formData.descripcionPte || null,
            RutaPdfPte: documentoUrl || formData.rutaPdfPte || null,
            ObservacionPte: formData.observacionPte || null,
            UsuarioRegistra: getUserId(),
            EtapaFormulario: 'paso1',
            Estado: 'pendiente'
          };
          
          if (com18RecordId) {
            response = await com18AccesoPortalTransparenciaService.update(com18RecordId, com18Data);
          } else {
            response = await com18AccesoPortalTransparenciaService.create(com18Data);
            if (response.isSuccess && response.data) {
              setCom18RecordId(response.data.id);
            }
          }
          
          if (response.isSuccess && response.data?.archivoEvidencia) {
            setPdfUrl(response.data.archivoEvidencia);
            if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
          }
        } else if (pasoActual === 2 || pasoActual === 3) {
          const com18UpdateData = {
            ...(pasoActual === 2 && documentoUrl && { RutaPdfNormativa: documentoUrl }),
            ...(pasoActual === 3 && {
              CheckPrivacidad: formData.aceptaPoliticaPrivacidad || false,
              CheckDdjj: formData.aceptaDeclaracionJurada || false,
            }),
            EtapaFormulario: pasoActual === 3 ? 'completado' : 'paso2',
            Estado: pasoActual === 3 ? 'enviado' : 'en_proceso'
          };
          
          console.log(`📤 Datos Com18 Paso ${pasoActual} a enviar:`, com18UpdateData);
          
          if (com18RecordId) {
            response = await com18AccesoPortalTransparenciaService.update(com18RecordId, com18UpdateData);
            if (pasoActual === 2 && documentoUrl) {
              setPdfUrlPaso2(documentoUrl);
              if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
            }
          } else {
            console.error('❌ No hay com18RecordId para actualizar Com18');
            response = { isSuccess: false, message: 'No se encontró el registro del compromiso 18' };
          }
        }
        
        console.log('Respuesta final Com18:', response);
      }

      // COMPROMISO 19: Encuesta Nacional de Gobierno Digital (ENAD)
      else if (parseInt(formData.compromisoId) === 19) {
        console.log(`🚀 Preparando datos para Com19 (Paso ${pasoActual})`);
        
        if (pasoActual === 1) {
          const com19Data = {
            CompromisoId: 19,
            EntidadId: getUserEntityIdForData(),
            AnioEnad: formData.anioEnad ? parseInt(formData.anioEnad) : null,
            ResponsableEnad: formData.responsableEnad || null,
            CargoResponsableEnad: formData.cargoResponsableEnad || null,
            CorreoEnad: formData.correoEnad || null,
            TelefonoEnad: formData.telefonoEnad || null,
            FechaEnvioEnad: formData.fechaEnvioEnad || null,
            EstadoRespuestaEnad: formData.estadoRespuestaEnad || null,
            EnlaceFormularioEnad: formData.enlaceFormularioEnad || null,
            ObservacionEnad: formData.observacionEnad || null,
            RutaPdfEnad: documentoUrl || formData.rutaPdfEnad || null,
            UsuarioRegistra: getUserId(),
            EtapaFormulario: 'paso1',
            Estado: 'pendiente'
          };
          
          if (com19RecordId) {
            response = await com19EncuestaNacionalGobDigitalService.update(com19RecordId, com19Data);
          } else {
            response = await com19EncuestaNacionalGobDigitalService.create(com19Data);
            if (response.isSuccess && response.data) {
              setCom19RecordId(response.data.id);
            }
          }
          
          if (response.isSuccess && response.data?.archivoContrato) {
            setPdfUrl(response.data.archivoContrato);
            if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
          }
        } else if (pasoActual === 2 || pasoActual === 3) {
          const com19UpdateData = {
            ...(pasoActual === 2 && documentoUrl && { RutaPdfNormativa: documentoUrl }),
            ...(pasoActual === 3 && {
              CheckPrivacidad: formData.aceptaPoliticaPrivacidad || false,
              CheckDdjj: formData.aceptaDeclaracionJurada || false,
            }),
            EtapaFormulario: pasoActual === 3 ? 'completado' : 'paso2',
            Estado: pasoActual === 3 ? 'enviado' : 'en_proceso'
          };
          
          console.log(`📤 Datos Com19 Paso ${pasoActual} a enviar:`, com19UpdateData);
          
          if (com19RecordId) {
            response = await com19EncuestaNacionalGobDigitalService.update(com19RecordId, com19UpdateData);
            if (pasoActual === 2 && documentoUrl) {
              setPdfUrlPaso2(documentoUrl);
              if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
            }
          } else {
            console.error('❌ No hay com19RecordId para actualizar Com19');
            response = { isSuccess: false, message: 'No se encontró el registro del compromiso 19' };
          }
        }
        
        console.log('Respuesta final Com19:', response);
      }

      // COMPROMISO 20: Digitalización de Servicios (Facilita Perú)
      else if (parseInt(formData.compromisoId) === 20) {
        console.log(`🚀 Preparando datos para Com20 (Paso ${pasoActual})`);
        
        if (pasoActual === 1) {
          const com20Data = {
            CompromisoId: 20,
            EntidadId: getUserEntityIdForData(),
            ResponsableFacilita: formData.responsableFacilita || null,
            CargoResponsableFacilita: formData.cargoResponsableFacilita || null,
            CorreoFacilita: formData.correoFacilita || null,
            TelefonoFacilita: formData.telefonoFacilita || null,
            EstadoImplementacionFacilita: formData.estadoImplementacionFacilita || null,
            FechaInicioFacilita: formData.fechaInicioFacilita || null,
            FechaUltimoAvanceFacilita: formData.fechaUltimoAvanceFacilita || null,
            TotalServiciosDigitalizados: formData.totalServiciosDigitalizados ? parseInt(formData.totalServiciosDigitalizados) : null,
            RutaPdfFacilita: documentoUrl || formData.rutaPdfFacilita || null,
            ObservacionFacilita: formData.observacionFacilita || null,
            UsuarioRegistra: getUserId(),
            EtapaFormulario: 'paso1',
            Estado: 'pendiente'
          };
          
          if (com20RecordId) {
            response = await com20DigitalizacionServiciosFacilitaService.update(com20RecordId, com20Data);
          } else {
            response = await com20DigitalizacionServiciosFacilitaService.create(com20Data);
            if (response.isSuccess && response.data) {
              setCom20RecordId(response.data.id);
            }
          }
          
          if (response.isSuccess && response.data?.archivoRepositorio) {
            setPdfUrl(response.data.archivoRepositorio);
            if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
          }
        } else if (pasoActual === 2 || pasoActual === 3) {
          const com20UpdateData = {
            ...(pasoActual === 2 && documentoUrl && { RutaPdfNormativa: documentoUrl }),
            ...(pasoActual === 3 && {
              CheckPrivacidad: formData.aceptaPoliticaPrivacidad || false,
              CheckDdjj: formData.aceptaDeclaracionJurada || false,
            }),
            EtapaFormulario: pasoActual === 3 ? 'completado' : 'paso2',
            Estado: pasoActual === 3 ? 'enviado' : 'en_proceso'
          };
          
          console.log(`📤 Datos Com20 Paso ${pasoActual} a enviar:`, com20UpdateData);
          
          if (com20RecordId) {
            response = await com20DigitalizacionServiciosFacilitaService.update(com20RecordId, com20UpdateData);
            if (pasoActual === 2 && documentoUrl) {
              setPdfUrlPaso2(documentoUrl);
              if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
            }
          } else {
            console.error('❌ No hay com20RecordId para actualizar Com20');
            response = { isSuccess: false, message: 'No se encontró el registro del compromiso 20' };
          }
        }
        
        console.log('Respuesta final Com20:', response);
      }

      // COMPROMISO 21: Oficial de Gobierno de Datos (OGD)
      else if (parseInt(formData.compromisoId) === 21) {
        console.log(`🚀 Preparando datos para Com21 (Paso ${pasoActual})`);
        
        if (pasoActual === 1) {
          const com21Data = {
            CompromisoId: 21,
            EntidadId: getUserEntityIdForData(),
            DniOgd: formData.dniOgd || null,
            NombreOgd: formData.nombreOgd || null,
            ApePatOgd: formData.apePatOgd || null,
            ApeMatOgd: formData.apeMatOgd || null,
            CargoOgd: formData.cargoOgd || null,
            CorreoOgd: formData.correoOgd || null,
            TelefonoOgd: formData.telefonoOgd || null,
            FechaDesignacionOgd: formData.fechaDesignacionOgd || null,
            NumeroResolucionOgd: formData.numeroResolucionOgd || null,
            ComunicadoPcmOgd: formData.comunicadoPcmOgd || false,
            RutaPdfOgd: documentoUrl || null,
            ObservacionOgd: formData.observacionOgd || null,
            UsuarioRegistra: getUserId(),
            EtapaFormulario: 'paso1',
            Estado: 'pendiente'
          };
          
          if (com21RecordId) {
            response = await com21OficialGobiernoDatosService.update(com21RecordId, com21Data);
          } else {
            response = await com21OficialGobiernoDatosService.create(com21Data);
            if (response.isSuccess && response.data) {
              setCom21RecordId(response.data.id);
            }
          }
          
          if (response.isSuccess && response.data?.archivoDocumento) {
            setPdfUrl(response.data.archivoDocumento);
            if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
          }
        } else if (pasoActual === 2 || pasoActual === 3) {
          const com21UpdateData = {
            ...(pasoActual === 2 && documentoUrl && { RutaPdfNormativa: documentoUrl }),
            ...(pasoActual === 3 && {
              CheckPrivacidad: formData.aceptaPoliticaPrivacidad || false,
              CheckDdjj: formData.aceptaDeclaracionJurada || false,
            }),
            EtapaFormulario: pasoActual === 3 ? 'completado' : 'paso2',
            Estado: pasoActual === 3 ? 'enviado' : 'en_proceso'
          };
          
          console.log(`📤 Datos Com21 Paso ${pasoActual} a enviar:`, com21UpdateData);
          
          if (com21RecordId) {
            response = await com21OficialGobiernoDatosService.update(com21RecordId, com21UpdateData);
            if (pasoActual === 2 && documentoUrl) {
              setPdfUrlPaso2(documentoUrl);
              if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
            }
          } else {
            console.error('❌ No hay com21RecordId para actualizar Com21');
            response = { isSuccess: false, message: 'No se encontró el registro del compromiso 21' };
          }
        }
        
        console.log('Respuesta final Com21:', response);
      }

      if (response && (response.isSuccess || response.IsSuccess || response.success)) {
        // =========================================================================
        // GUARDAR CRITERIOS EVALUADOS EN LA NUEVA TABLA (PASO 2)
        // =========================================================================
        if (pasoParaGuardar === 2 && formData.criteriosEvaluados?.length > 0) {
          console.log('📝 Guardando criterios evaluados en la tabla evaluacion_respuestas_entidad...');
          console.log('📝 Criterios a guardar:', formData.criteriosEvaluados);
          
          try {
            const entityId = getUserEntityIdForData();
            console.log('🔍 Debug - entityId para criterios:', entityId);
            
            if (!entityId) {
              console.error('❌ No se pudo obtener el ID de entidad para guardar criterios');
              showErrorToast('Error: No se pudo obtener la información de la entidad. Por favor, refresque la página.');
              return;
            }
            
            const criteriosGuardados = await saveCriteriosToDB(
              entityId, 
              parseInt(formData.compromisoId), 
              formData.criteriosEvaluados
            );
            
            if (criteriosGuardados) {
              console.log('✅ Criterios guardados exitosamente en la DB');
            } else {
              console.warn('⚠️ No se pudieron guardar los criterios en la DB');
            }
          } catch (criterioError) {
            console.error('❌ Error al guardar criterios:', criterioError);
            // No falla el guardado principal, solo logueamos el error
          }
        }
        // =========================================================================
        
        showSuccessToast('Progreso guardado exitosamente');
        return true;
      } else {
        showErrorToast(response.message || 'Error al guardar el progreso');
        return false;
      }
    } catch (error) {
      console.error('Error al guardar progreso:', error);
      showErrorToast('Error al guardar el progreso');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleAnterior = () => {
    if (pasoActual > 1) {
      setPasoActual(pasoActual - 1);
    }
  };

  /**
   * Obtiene el correo del líder GTD (Compromiso 1) para enviar notificaciones
   */
  const _getCorreoLiderGTD = async () => {
    try {
      console.log('🔍 Obteniendo correo del líder GTD para entidad:', getUserEntityIdForData());
      const response = await com1LiderGTDService.getByEntidad(1, getUserEntityIdForData());
      console.log('🔍 Respuesta completa _getCorreoLiderGTD:', response);
      
      if (response.isSuccess && response.data) {
        console.log('🔍 Datos del líder:', response.data);
        // El backend puede devolver emailLider o email_lider
        const email = response.data.emailLider || response.data.email_lider || response.data.correoElectronico || null;
        console.log('📧 Email del Líder GTD encontrado:', email);
        
        if (!email) {
          showErrorToast('No se encontró el email del Líder de Gobierno y Transformación Digital. Por favor, complete primero el Compromiso 1.');
        }
        
        return email;
      }
      
      console.warn('⚠️ No se encontró registro del Líder GTD para esta entidad');
      showErrorToast('No se encontró el registro del Líder de Gobierno y Transformación Digital. Por favor, complete primero el Compromiso 1.');
      return null;
    } catch (error) {
      console.error('❌ Error al obtener correo del líder GTD:', error);
      showErrorToast('Error al obtener el correo del Líder GTD. Intente nuevamente.');
      return null;
    }
  };

  /**
   * Envía correo de confirmación con los datos del cumplimiento
   */
  const enviarCorreoConfirmacion = async () => {
    try {
      console.log('📧 ===== INICIANDO ENVÍO DE CORREO DE CONFIRMACIÓN =====');
      
      // Obtener correo de la entidad (campo email de la tabla entidades)
      const correoEntidad = user?.entidadEmail;
      if (!correoEntidad) {
        console.warn('⚠️ No se encontró correo de la entidad. El correo no se enviará.');
        showErrorToast('No se encontró el correo electrónico de la entidad. Por favor, actualice los datos de la entidad.');
        return false;
      }

      console.log('✅ Correo destinatario (entidad):', correoEntidad);
      console.log('📝 Compromiso:', parseInt(formData.compromisoId), '-', compromisoSeleccionado?.nombreCompromiso);

      // Preparar datos para los templates
      const paso1Data = { ...formData, miembros: miembrosComite };
      const paso2Data = {
        documentoUrl: pdfUrlPaso2 || pdfUrl,
        criteriosEvaluados: formData.criteriosEvaluados || []
      };
      const paso3Data = {
        aceptaPoliticaPrivacidad: formData.aceptaPoliticaPrivacidad,
        aceptaDeclaracionJurada: formData.aceptaDeclaracionJurada
      };

      // Generar HTML de los pasos
      console.log('🔧 Generando templates HTML...');
      const paso1Html = emailTemplates.getPaso1Html(
        parseInt(formData.compromisoId),
        compromisoSeleccionado?.nombreCompromiso || `Compromiso ${formData.compromisoId}`,
        paso1Data
      );
      const paso2Html = emailTemplates.paso2Html(paso2Data);
      const paso3Html = emailTemplates.paso3Html(paso3Data);

      console.log('📧 Enviando correo a:', correoEntidad);

      // Enviar correo
      const enviado = await emailService.sendCumplimientoConfirmation({
        toEmail: correoEntidad,
        entidadNombre: user.entidadNombre || user.nombreCompleto || 'Entidad',
        compromisoId: parseInt(formData.compromisoId),
        compromisoNombre: compromisoSeleccionado?.nombreCompromiso || `Compromiso ${formData.compromisoId}`,
        paso1Html,
        paso2Html,
        paso3Html,
        estadoFinal: formData.estado || 'enviado'
      });

      if (enviado) {
        console.log('✅ Correo de confirmación enviado exitosamente a', correoEntidad);
        showSuccessToast('Se ha enviado una notificación por correo a la entidad.');
      } else {
        console.warn('⚠️ No se pudo enviar el correo de confirmación');
        showErrorToast('No se pudo enviar la notificación por correo. Los datos fueron guardados correctamente.');
      }

      console.log('📧 ===== FIN DEL PROCESO DE ENVÍO DE CORREO =====');
      return enviado;
    } catch (error) {
      console.error('❌ Error al enviar correo de confirmación:', error);
      showErrorToast('Error al enviar notificación por correo. Los datos fueron guardados correctamente.');
      return false;
    }
  };

  const handleGuardar = async () => {
    // Validar todos los pasos
    const paso1Valid = validarPaso(1);
    const paso2Valid = validarPaso(2);
    const paso3Valid = validarPaso(3);

    if (!paso1Valid || !paso2Valid || !paso3Valid) {
      const pasosInvalidos = [];
      if (!paso1Valid) pasosInvalidos.push('Paso 1 (Datos Generales)');
      if (!paso2Valid) pasosInvalidos.push('Paso 2 (Normativa)');
      if (!paso3Valid) pasosInvalidos.push('Paso 3 (Confirmación)');
      
      showErrorToast(`Por favor complete los campos requeridos en: ${pasosInvalidos.join(', ')}`);
      
      // Ir al primer paso con errores
      if (!paso1Valid) setPasoActual(1);
      else if (!paso2Valid) setPasoActual(2);
      else if (!paso3Valid) setPasoActual(3);
      
      return;
    }

    showConfirmToast({
      title: '¿Desea finalizar y guardar el cumplimiento normativo?',
      confirmText: 'Guardar',
      cancelText: 'Cancelar',
      loadingText: 'Guardando...',
      confirmButtonClass: 'px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary-dark transition-colors',
      onConfirm: async () => {
        // Guardar con estado final
        const guardado = await guardarProgreso(true); // esFinal = true
        
        if (guardado) {
          // Enviar correo de confirmación
          await enviarCorreoConfirmacion();
          
          showSuccessToast(
            '¡Información Recepcionada Exitosamente!',
            'Estimada Entidad, su información ha sido recepcionada de forma exitosa. Se procederá a su validación y recibirá una notificación una vez completado el proceso.'
          );
          navigate('/dashboard/cumplimiento');
        }
      }
    });
  };

  const handleCancelar = () => {
    navigate('/dashboard/cumplimiento');
  };

  if (loading || loadingCatalogos) {
    return <FormSkeleton showSteps={true} showHeader={true} />;
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-800">
          {viewMode ? 'Ver Cumplimiento Normativo' : (isEdit ? 'Editar Cumplimiento Normativo' : 'Nuevo Cumplimiento Normativo')}
        </h1>
        {compromisoSeleccionado && (
          <div className="mt-3 p-4 bg-primary/5 border-l-4 border-primary rounded-r-lg flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Compromiso seleccionado:</p>
              <div className="flex items-center gap-3">
                <p className="text-base font-semibold text-primary">
                  Compromiso {compromisoSeleccionado.compromisoId}: {compromisoSeleccionado.nombreCompromiso}
                </p>
                {compromisoSeleccionado.estadoCumplimiento && (
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getEstadoBadgeClass(compromisoSeleccionado.estadoCumplimiento)}`}>
                    {getEstadoNombre(compromisoSeleccionado.estadoCumplimiento)}
                  </span>
                )}
              </div>
            </div>
            {pdfAyudaUrl && (
              <button
                onClick={() => {
                  setDocumentoActualUrl(pdfAyudaUrl);
                  setShowPdfViewer(true);
                }}
                className="ml-4 p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                title="Ver guía de ayuda para llenar este compromiso"
              >
                <HelpCircle className="w-6 h-6" />
              </button>
            )}
          </div>
        )}
        <p className="text-gray-600 mt-3">Complete la información en los 3 pasos siguientes</p>
      </div>

      {/* Indicador de pasos */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((paso) => (
            <div key={paso} className="flex-1 flex items-center">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    pasoActual === paso
                      ? 'bg-primary text-white'
                      : pasoActual > paso
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {pasoActual > paso ? <Check size={20} /> : paso}
                </div>
                <span className={`text-xs mt-2 ${pasoActual === paso ? 'text-primary font-semibold' : 'text-gray-600'}`}>
                  {paso === 1 && 'Registrar Compromiso'}
                  {paso === 2 && 'Registrar Normativa'}
                  {paso === 3 && 'Confirmar Veracidad de Información'}
                </span>
              </div>
              {paso < 3 && (
                <div
                  className={`h-1 flex-1 mx-2 ${
                    pasoActual > paso ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-white rounded-lg shadow-sm p-5">
        {/* Paso 1: Registrar Compromiso */}
        {pasoActual === 1 && (
          <div className="space-y-3">
            {parseInt(formData.compromisoId) === 4 ? (
              // COMPROMISO 4: Incorporar TD en el PEI
              <>
                <h2 className="text-base font-semibold text-gray-800 mb-3">Paso 1: Incorporar Transformación Digital en el PEI</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Año de Inicio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Año de Inicio del PEI <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="anioInicio"
                      value={formData.anioInicio}
                      onChange={handleInputChange}
                      min="2020"
                      max="2050"
                      className={`input-field ${errores.anioInicio ? 'border-red-500' : ''}`}
                      placeholder="2024"
                      disabled={viewMode}
                    />
                    {errores.anioInicio && (
                      <p className="text-red-500 text-xs mt-1">{errores.anioInicio}</p>
                    )}
                  </div>

                  {/* Año de Fin */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Año de Fin del PEI <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="anioFin"
                      value={formData.anioFin}
                      onChange={handleInputChange}
                      min={formData.anioInicio || "2020"}
                      max="2050"
                      className={`input-field ${errores.anioFin ? 'border-red-500' : ''}`}
                      placeholder="2026"
                      disabled={viewMode}
                    />
                    {errores.anioFin && (
                      <p className="text-red-500 text-xs mt-1">{errores.anioFin}</p>
                    )}
                  </div>

                  {/* Fecha de Aprobación */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Aprobación del PEI <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fechaAprobacion"
                      value={formData.fechaAprobacion}
                      onChange={handleInputChange}
                      className={`input-field ${errores.fechaAprobacion ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    />
                    {errores.fechaAprobacion && (
                      <p className="text-red-500 text-xs mt-1">{errores.fechaAprobacion}</p>
                    )}
                  </div>

                  {/* Alineado con PGD */}
                  <div className="flex items-center h-full pt-6">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="alineadoPgd"
                        checked={formData.alineadoPgd || false}
                        onChange={handleInputChange}
                        className="mr-2 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        disabled={viewMode}
                      />
                      <span className="text-sm text-gray-700">¿El PEI está alineado con el Plan de Gobierno Digital?</span>
                    </label>
                  </div>

                  {/* Objetivo Estratégico - Ocupa toda la fila */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Objetivo Estratégico vinculado a la Transformación Digital <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="objetivoEstrategico"
                      value={formData.objetivoEstrategico}
                      onChange={handleInputChange}
                      maxLength="1000"
                      rows="3"
                      className={`input-field ${errores.objetivoEstrategico ? 'border-red-500' : ''}`}
                      placeholder="Describa el objetivo estratégico del PEI que incorpora la Transformación Digital..."
                      disabled={viewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.objetivoEstrategico?.length || 0} / 1000 caracteres
                    </p>
                    {errores.objetivoEstrategico && (
                      <p className="text-red-500 text-xs mt-1">{errores.objetivoEstrategico}</p>
                    )}
                  </div>

                  {/* Descripción de Incorporación - Ocupa toda la fila */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción del modo de incorporación de la TD en el PEI <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="descripcionIncorporacion"
                      value={formData.descripcionIncorporacion}
                      onChange={handleInputChange}
                      maxLength="2000"
                      rows="4"
                      className={`input-field ${errores.descripcionIncorporacion ? 'border-red-500' : ''}`}
                      placeholder="Describa cómo se ha incorporado la Transformación Digital en el Plan Estratégico Institucional..."
                      disabled={viewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.descripcionIncorporacion?.length || 0} / 2000 caracteres
                    </p>
                    {errores.descripcionIncorporacion && (
                      <p className="text-red-500 text-xs mt-1">{errores.descripcionIncorporacion}</p>
                    )}
                  </div>

                  {/* Documento PEI (PDF) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Documento PEI (PDF)
                    </label>
                    
                    {!pdfUrl ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="mx-auto text-gray-400 mb-2" size={40} />
                        <p className="text-sm text-gray-600 mb-2">
                          Arrastra y suelta el archivo PDF aquí, o haz clic para seleccionar
                        </p>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload-com4"
                          disabled={viewMode}
                        />
                        {!viewMode && (
                          <label htmlFor="file-upload-com4" className="btn-primary cursor-pointer inline-block">
                            Seleccionar archivo
                          </label>
                        )}
                        <p className="text-xs text-gray-500 mt-2">Tamaño máximo: 10 MB</p>
                      </div>
                    ) : (
                      <div className="border border-gray-300 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="text-primary" size={24} />
                            <span className="text-sm font-medium text-gray-700">
                              {formData.documentoFile ? formData.documentoFile.name : 'Documento PEI cargado'}
                            </span>
                          </div>
                          {!viewMode && (
                            <button
                              onClick={removeFile}
                              className="text-red-500 hover:text-red-700"
                              title="Eliminar documento"
                            >
                              <X size={20} />
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setDocumentoActualUrl(pdfUrl);
                            setShowPdfViewer(true);
                          }}
                          className="btn-secondary text-sm flex items-center gap-2"
                        >
                          <Eye size={16} />
                          Vista previa del PDF
                        </button>
                      </div>
                    )}
                    {errores.documentoFile && (
                      <p className="text-red-500 text-xs mt-1">{errores.documentoFile}</p>
                    )}
                  </div>
                </div>
              </>
            ) : parseInt(formData.compromisoId) === 3 ? (
              // COMPROMISO 3: Elaborar Plan de Gobierno Digital
              <Compromiso3Paso1
                entidadId={user?.entidadId}
                onDataChange={(data) => {
                  setCom3Data(data);
                  if (data?.com3EPGDId) {
                    setCom3RecordId(data.com3EPGDId);
                  }
                }}
                viewMode={viewMode}
              />
            ) : parseInt(formData.compromisoId) === 5 ? (
              // COMPROMISO 5: Estrategia Digital
              <>
                <h2 className="text-base font-semibold text-gray-800 mb-3">Paso 1: Formulación de la Estrategia Digital</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nombre de la Estrategia */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre de la Estrategia Digital <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nombreEstrategia"
                      value={formData.nombreEstrategia}
                      onChange={handleInputChange}
                      maxLength="500"
                      className={`input-field ${errores.nombreEstrategia ? 'border-red-500' : ''}`}
                      placeholder="Ej: Estrategia de Transformación Digital 2024-2026"
                      disabled={viewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.nombreEstrategia?.length || 0} / 500 caracteres
                    </p>
                    {errores.nombreEstrategia && (
                      <p className="text-red-500 text-xs mt-1">{errores.nombreEstrategia}</p>
                    )}
                  </div>

                  {/* Año de Inicio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Año de Inicio <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="anioInicio"
                      value={formData.anioInicio}
                      onChange={handleInputChange}
                      min="2020"
                      max="2050"
                      className={`input-field ${errores.anioInicio ? 'border-red-500' : ''}`}
                      placeholder="2024"
                      disabled={viewMode}
                    />
                    {errores.anioInicio && (
                      <p className="text-red-500 text-xs mt-1">{errores.anioInicio}</p>
                    )}
                  </div>

                  {/* Año de Fin */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Año de Fin <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="anioFin"
                      value={formData.anioFin}
                      onChange={handleInputChange}
                      min={formData.anioInicio || "2020"}
                      max="2050"
                      className={`input-field ${errores.anioFin ? 'border-red-500' : ''}`}
                      placeholder="2026"
                      disabled={viewMode}
                    />
                    {errores.anioFin && (
                      <p className="text-red-500 text-xs mt-1">{errores.anioFin}</p>
                    )}
                  </div>

                  {/* Fecha de Aprobación */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Aprobación <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fechaAprobacion"
                      value={formData.fechaAprobacion}
                      onChange={handleInputChange}
                      className={`input-field ${errores.fechaAprobacion ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    />
                    {errores.fechaAprobacion && (
                      <p className="text-red-500 text-xs mt-1">{errores.fechaAprobacion}</p>
                    )}
                  </div>

                  {/* Estado de Implementación */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado de Implementación <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="estadoImplementacion"
                      value={formData.estadoImplementacion}
                      onChange={handleInputChange}
                      className={`input-field ${errores.estadoImplementacion ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    >
                      <option value="">Seleccione el estado de implementación</option>
                      <option value="en_ejecucion">En ejecución</option>
                      <option value="parcialmente_implementado">Parcialmente implementado</option>
                      <option value="completamente_implementado">Completamente implementado</option>
                      <option value="suspendido">Suspendido</option>
                    </select>
                    {errores.estadoImplementacion && (
                      <p className="text-red-500 text-xs mt-1">{errores.estadoImplementacion}</p>
                    )}
                  </div>

                  {/* Alineado con PGD */}
                  <div className="md:col-span-2">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="alineadoPgd"
                        checked={formData.alineadoPgd || false}
                        onChange={handleInputChange}
                        className="mr-2 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        disabled={viewMode}
                      />
                      <span className="text-sm text-gray-700">¿La estrategia está alineada con el Plan de Gobierno Digital?</span>
                    </label>
                  </div>

                  {/* Documento PDF */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Documento de la Estrategia Digital (PDF)
                    </label>
                    
                    {!pdfUrl ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="mx-auto text-gray-400 mb-2" size={40} />
                        <p className="text-sm text-gray-600 mb-2">
                          Arrastra y suelta el archivo PDF aquí, o haz clic para seleccionar
                        </p>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload-com5"
                          disabled={viewMode}
                        />
                        {!viewMode && (
                          <label htmlFor="file-upload-com5" className="btn-primary cursor-pointer inline-block">
                            Seleccionar archivo
                          </label>
                        )}
                        <p className="text-xs text-gray-500 mt-2">Tamaño máximo: 10 MB</p>
                      </div>
                    ) : (
                      <div className="border border-gray-300 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="text-primary" size={24} />
                            <span className="text-sm font-medium text-gray-700">
                              {formData.documentoFile ? formData.documentoFile.name : 'Documento de Estrategia Digital cargado'}
                            </span>
                          </div>
                          {!viewMode && (
                            <button
                              onClick={removeFile}
                              className="text-red-500 hover:text-red-700"
                              title="Eliminar documento"
                            >
                              <X size={20} />
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setDocumentoActualUrl(pdfUrl);
                            setShowPdfViewer(true);
                          }}
                          className="btn-secondary text-sm flex items-center gap-2"
                        >
                          <Eye size={16} />
                          Vista previa del PDF
                        </button>
                      </div>
                    )}
                    {errores.documentoFile && (
                      <p className="text-red-500 text-xs mt-1">{errores.documentoFile}</p>
                    )}
                  </div>

                  {/* Objetivos Estratégicos */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Objetivos Estratégicos <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="objetivosEstrategicos"
                      value={formData.objetivosEstrategicos}
                      onChange={handleInputChange}
                      maxLength="2000"
                      rows="3"
                      className={`input-field ${errores.objetivosEstrategicos ? 'border-red-500' : ''}`}
                      placeholder="Describa los objetivos estratégicos de la estrategia digital..."
                      disabled={viewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.objetivosEstrategicos?.length || 0} / 2000 caracteres
                    </p>
                    {errores.objetivosEstrategicos && (
                      <p className="text-red-500 text-xs mt-1">{errores.objetivosEstrategicos}</p>
                    )}
                  </div>

                  {/* Líneas de Acción */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Líneas de Acción <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="lineasAccion"
                      value={formData.lineasAccion}
                      onChange={handleInputChange}
                      maxLength="2000"
                      rows="4"
                      className={`input-field ${errores.lineasAccion ? 'border-red-500' : ''}`}
                      placeholder="Describa las líneas de acción de la estrategia digital..."
                      disabled={viewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.lineasAccion?.length || 0} / 2000 caracteres
                    </p>
                    {errores.lineasAccion && (
                      <p className="text-red-500 text-xs mt-1">{errores.lineasAccion}</p>
                    )}
                  </div>
                </div>
              </>
            ) : parseInt(formData.compromisoId) === 2 ? (
              // COMPROMISO 2: Comité GTD
              <>
                <h2 className="text-base font-semibold text-gray-800 mb-3">Paso 1: Constituir el Comité de Gobierno y TD (CGTD)</h2>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-medium text-gray-700">Miembros del Comité</h3>
                    {!viewMode && (
                      <button
                        type="button"
                        onClick={() => {
                          setMiembroActual({
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
                          setShowModalMiembro(true);
                        }}
                        className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-md hover:bg-primary-dark text-sm"
                      >
                        <Plus size={16} />
                        Agregar Miembro
                      </button>
                    )}
                  </div>

                  {/* Tabla de miembros */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">DNI</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nombres</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Apellidos</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cargo</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Correo</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
                          {!viewMode && (
                            <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {miembrosComite.length === 0 ? (
                          <tr>
                            <td colSpan={viewMode ? 7 : 8} className="px-3 py-4 text-center text-sm text-gray-500">
                              No hay miembros registrados. Haga clic en &quot;Agregar Miembro&quot; para comenzar.
                            </td>
                          </tr>
                        ) : (
                          miembrosComite.map((miembro, index) => (
                            <tr key={`miembro-${miembro.miembroId || miembro.dni || index}`} className="hover:bg-gray-50">
                              <td className="px-3 py-2 text-sm text-gray-900">{miembro.dni}</td>
                              <td className="px-3 py-2 text-sm text-gray-900">{miembro.nombre}</td>
                              <td className="px-3 py-2 text-sm text-gray-900">
                                {miembro.apellidoPaterno} {miembro.apellidoMaterno}
                              </td>
                              <td className="px-3 py-2 text-sm text-gray-900">{miembro.cargo}</td>
                              <td className="px-3 py-2 text-sm text-gray-900">{miembro.rol}</td>
                              <td className="px-3 py-2 text-sm text-gray-900">{miembro.email}</td>
                              <td className="px-3 py-2 text-sm text-gray-900">{miembro.telefono}</td>
                              {!viewMode && (
                                <td className="px-3 py-2 text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setMiembroActual(miembro);
                                        setShowModalMiembro(true);
                                      }}
                                      className="text-blue-600 hover:text-blue-800"
                                      title="Editar"
                                    >
                                      <Edit2 size={16} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        showConfirmToast(
                                          '¿Está seguro de eliminar este miembro del comité?',
                                          () => {
                                            setMiembrosComite(miembrosComite.filter((_, i) => i !== index));
                                            showSuccessToast('Miembro eliminado');
                                          }
                                        );
                                      }}
                                      className="text-red-600 hover:text-red-800"
                                      title="Eliminar"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </td>
                              )}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : parseInt(formData.compromisoId) === 6 ? (
              // COMPROMISO 6: Migración a GOB.PE
              <>
                <h2 className="text-base font-semibold text-gray-800 mb-3">Paso 1: Datos de Migración a GOB.PE</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* URL del portal en GOB.PE */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL del portal en GOB.PE <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      name="urlPortalGobPe"
                      value={formData.urlPortalGobPe}
                      onChange={handleInputChange}
                      className={`input-field ${errores.urlPortalGobPe ? 'border-red-500' : ''}`}
                      placeholder="https://www.gob.pe/institucion/nombre-entidad"
                      disabled={viewMode}
                    />
                    {errores.urlPortalGobPe && (
                      <p className="text-red-500 text-xs mt-1">{errores.urlPortalGobPe}</p>
                    )}
                  </div>

                  {/* Fecha de migración */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de migración <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fechaMigracion"
                      value={formData.fechaMigracion}
                      onChange={handleInputChange}
                      className={`input-field ${errores.fechaMigracion ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    />
                    {errores.fechaMigracion && (
                      <p className="text-red-500 text-xs mt-1">{errores.fechaMigracion}</p>
                    )}
                  </div>

                  {/* Fecha de última actualización */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de última actualización <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fechaUltimaActualizacion"
                      value={formData.fechaUltimaActualizacion}
                      onChange={handleInputChange}
                      className={`input-field ${errores.fechaUltimaActualizacion ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    />
                    {errores.fechaUltimaActualizacion && (
                      <p className="text-red-500 text-xs mt-1">{errores.fechaUltimaActualizacion}</p>
                    )}
                  </div>

                  {/* Separador */}
                  <div className="md:col-span-2 border-t border-gray-200 my-2">
                    <h3 className="text-sm font-medium text-gray-700 mt-4 mb-3">Datos del Responsable</h3>
                  </div>

                  {/* Responsable de la gestión del portal */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Responsable de la gestión del portal <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nombreResponsable"
                      value={formData.nombreResponsable}
                      onChange={handleInputChange}
                      className={`input-field ${errores.nombreResponsable ? 'border-red-500' : ''}`}
                      placeholder="Nombre completo del responsable"
                      disabled={viewMode}
                    />
                    {errores.nombreResponsable && (
                      <p className="text-red-500 text-xs mt-1">{errores.nombreResponsable}</p>
                    )}
                  </div>

                  {/* Correo del responsable */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo del responsable <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="correoResponsable"
                      value={formData.correoResponsable}
                      onChange={handleInputChange}
                      className={`input-field ${errores.correoResponsable ? 'border-red-500' : ''}`}
                      placeholder="correo@entidad.com"
                      disabled={viewMode}
                    />
                    {errores.correoResponsable && (
                      <p className="text-red-500 text-xs mt-1">{errores.correoResponsable}</p>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="telefonoResponsable"
                      value={formData.telefonoResponsable}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="999 999 999"
                      disabled={viewMode}
                    />
                  </div>

                  {/* Tipo de migración */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de migración <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="tipoMigracion"
                      value={formData.tipoMigracion}
                      onChange={handleInputChange}
                      className={`input-field ${errores.tipoMigracion ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    >
                      <option value="">Seleccione el tipo de migración</option>
                      <option value="completa">Migración completa</option>
                      <option value="parcial">Migración parcial</option>
                      <option value="en_proceso">En proceso</option>
                    </select>
                    {errores.tipoMigracion && (
                      <p className="text-red-500 text-xs mt-1">{errores.tipoMigracion}</p>
                    )}
                  </div>

                  {/* Observaciones */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observaciones
                    </label>
                    <textarea
                      name="observacionesMigracion"
                      value={formData.observacionesMigracion}
                      onChange={handleInputChange}
                      maxLength="1000"
                      rows="3"
                      className="input-field"
                      placeholder="Observaciones adicionales sobre la migración..."
                      disabled={viewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.observacionesMigracion?.length || 0} / 1000 caracteres
                    </p>
                  </div>

                  {/* Documento de evidencia (PDF) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Documento de evidencia (PDF)
                    </label>
                    
                    {!pdfUrl ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="mx-auto text-gray-400 mb-2" size={40} />
                        <p className="text-sm text-gray-600 mb-2">
                          Arrastra y suelta el archivo PDF aquí, o haz clic para seleccionar
                        </p>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload-com6"
                          disabled={viewMode}
                        />
                        {!viewMode && (
                          <label htmlFor="file-upload-com6" className="btn-primary cursor-pointer inline-block">
                            Seleccionar archivo
                          </label>
                        )}
                        <p className="text-xs text-gray-500 mt-2">Tamaño máximo: 10 MB</p>
                      </div>
                    ) : (
                      <div className="border border-gray-300 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="text-primary" size={24} />
                            <span className="text-sm font-medium text-gray-700">
                              {formData.documentoFile ? formData.documentoFile.name : 'Documento de evidencia cargado'}
                            </span>
                          </div>
                          {!viewMode && (
                            <button
                              onClick={removeFile}
                              className="text-red-500 hover:text-red-700"
                              title="Eliminar documento"
                            >
                              <X size={20} />
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setDocumentoActualUrl(pdfUrl);
                            setShowPdfViewer(true);
                          }}
                          className="btn-secondary text-sm flex items-center gap-2"
                        >
                          <Eye size={16} />
                          Vista previa del PDF
                        </button>
                      </div>
                    )}
                    {errores.documentoFile && (
                      <p className="text-red-500 text-xs mt-1">{errores.documentoFile}</p>
                    )}
                  </div>
                </div>
              </>
            ) : parseInt(formData.compromisoId) === 7 ? (
              // COMPROMISO 7: Implementación MPD
              <>
                <h2 className="text-base font-semibold text-gray-800 mb-3">Paso 1: Datos de Implementación de Mesa de Partes Digital</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* URL de la MPD */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL de la Mesa de Partes Digital <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      name="urlMpd"
                      value={formData.urlMpd}
                      onChange={handleInputChange}
                      className={`input-field ${errores.urlMpd ? 'border-red-500' : ''}`}
                      placeholder="https://mesadepartes.entidad.com"
                      disabled={viewMode}
                    />
                    {errores.urlMpd && (
                      <p className="text-red-500 text-xs mt-1">{errores.urlMpd}</p>
                    )}
                  </div>

                  {/* Fecha de implementación */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de implementación <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fechaImplementacionMpd"
                      value={formData.fechaImplementacionMpd}
                      onChange={handleInputChange}
                      className={`input-field ${errores.fechaImplementacionMpd ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    />
                    {errores.fechaImplementacionMpd && (
                      <p className="text-red-500 text-xs mt-1">{errores.fechaImplementacionMpd}</p>
                    )}
                  </div>

                  {/* Tipo de MPD */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de MPD <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="tipoMpd"
                      value={formData.tipoMpd}
                      onChange={handleInputChange}
                      className={`input-field ${errores.tipoMpd ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    >
                      <option value="">Seleccione el tipo</option>
                      <option value="propia">Propia</option>
                      <option value="terceros">De terceros</option>
                      <option value="integrada">Integrada</option>
                    </select>
                    {errores.tipoMpd && (
                      <p className="text-red-500 text-xs mt-1">{errores.tipoMpd}</p>
                    )}
                  </div>

                  {/* Interoperabilidad */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="interoperabilidadMpd"
                        checked={formData.interoperabilidadMpd || false}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        disabled={viewMode}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        ¿La MPD interopera con PIDE u otros sistemas?
                      </span>
                    </label>
                  </div>

                  {/* Separador */}
                  <div className="md:col-span-2 border-t border-gray-200 my-2">
                    <h3 className="text-sm font-medium text-gray-700 mt-4 mb-3">Datos del Responsable</h3>
                  </div>

                  {/* Responsable */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Responsable <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="responsableMpd"
                      value={formData.responsableMpd}
                      onChange={handleInputChange}
                      className={`input-field ${errores.responsableMpd ? 'border-red-500' : ''}`}
                      placeholder="Nombre completo del responsable"
                      disabled={viewMode}
                    />
                    {errores.responsableMpd && (
                      <p className="text-red-500 text-xs mt-1">{errores.responsableMpd}</p>
                    )}
                  </div>

                  {/* Cargo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cargo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cargoResponsableMpd"
                      value={formData.cargoResponsableMpd}
                      onChange={handleInputChange}
                      className={`input-field ${errores.cargoResponsableMpd ? 'border-red-500' : ''}`}
                      placeholder="Cargo"
                      disabled={viewMode}
                    />
                    {errores.cargoResponsableMpd && (
                      <p className="text-red-500 text-xs mt-1">{errores.cargoResponsableMpd}</p>
                    )}
                  </div>

                  {/* Correo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="correoResponsableMpd"
                      value={formData.correoResponsableMpd}
                      onChange={handleInputChange}
                      className={`input-field ${errores.correoResponsableMpd ? 'border-red-500' : ''}`}
                      placeholder="correo@entidad.com"
                      disabled={viewMode}
                    />
                    {errores.correoResponsableMpd && (
                      <p className="text-red-500 text-xs mt-1">{errores.correoResponsableMpd}</p>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="telefonoResponsableMpd"
                      value={formData.telefonoResponsableMpd}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="999 999 999"
                      disabled={viewMode}
                    />
                  </div>

                  {/* Observaciones */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observaciones
                    </label>
                    <textarea
                      name="observacionMpd"
                      value={formData.observacionMpd}
                      onChange={handleInputChange}
                      maxLength="1000"
                      rows="3"
                      className="input-field"
                      placeholder="Observaciones adicionales sobre la implementación..."
                      disabled={viewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.observacionMpd?.length || 0} / 1000 caracteres
                    </p>
                  </div>

                  {/* Documento de evidencia (PDF) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Documento de evidencia (PDF)
                    </label>
                    
                    {!pdfUrl ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="mx-auto text-gray-400 mb-2" size={40} />
                        <p className="text-sm text-gray-600 mb-2">
                          Arrastra y suelta el archivo PDF aquí, o haz clic para seleccionar
                        </p>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload-com7"
                          disabled={viewMode}
                        />
                        {!viewMode && (
                          <label htmlFor="file-upload-com7" className="btn-primary cursor-pointer inline-block">
                            Seleccionar archivo
                          </label>
                        )}
                        <p className="text-xs text-gray-500 mt-2">Tamaño máximo: 10 MB</p>
                      </div>
                    ) : (
                      <div className="border border-gray-300 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="text-primary" size={24} />
                            <span className="text-sm font-medium text-gray-700">
                              {formData.documentoFile ? formData.documentoFile.name : 'Documento de evidencia cargado'}
                            </span>
                          </div>
                          {!viewMode && (
                            <button
                              onClick={removeFile}
                              className="text-red-500 hover:text-red-700"
                              title="Eliminar documento"
                            >
                              <X size={20} />
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setDocumentoActualUrl(pdfUrl);
                            setShowPdfViewer(true);
                          }}
                          className="btn-secondary text-sm flex items-center gap-2"
                        >
                          <Eye size={16} />
                          Vista previa del PDF
                        </button>
                      </div>
                    )}
                    {errores.documentoFile && (
                      <p className="text-red-500 text-xs mt-1">{errores.documentoFile}</p>
                    )}
                  </div>
                </div>
              </>
            ) : parseInt(formData.compromisoId) === 8 ? (
              // COMPROMISO 8: Publicación TUPA
              <>
                <h2 className="text-base font-semibold text-gray-800 mb-3">Paso 1: Datos de Publicación del TUPA</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* URL del TUPA */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL del TUPA publicado <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      name="urlTupa"
                      value={formData.urlTupa}
                      onChange={handleInputChange}
                      className={`input-field ${errores.urlTupa ? 'border-red-500' : ''}`}
                      placeholder="https://www.entidad.com/tupa"
                      disabled={viewMode}
                    />
                    {errores.urlTupa && (
                      <p className="text-red-500 text-xs mt-1">{errores.urlTupa}</p>
                    )}
                  </div>

                  {/* Número de resolución */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de Resolución <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="numeroResolucionTupa"
                      value={formData.numeroResolucionTupa}
                      onChange={handleInputChange}
                      className={`input-field ${errores.numeroResolucionTupa ? 'border-red-500' : ''}`}
                      placeholder="R.M. N° 123-2024"
                      disabled={viewMode}
                    />
                    {errores.numeroResolucionTupa && (
                      <p className="text-red-500 text-xs mt-1">{errores.numeroResolucionTupa}</p>
                    )}
                  </div>

                  {/* Fecha de aprobación */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de aprobación <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fechaAprobacionTupa"
                      value={formData.fechaAprobacionTupa}
                      onChange={handleInputChange}
                      className={`input-field ${errores.fechaAprobacionTupa ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    />
                    {errores.fechaAprobacionTupa && (
                      <p className="text-red-500 text-xs mt-1">{errores.fechaAprobacionTupa}</p>
                    )}
                  </div>

                  {/* Separador */}
                  <div className="md:col-span-2 border-t border-gray-200 my-2">
                    <h3 className="text-sm font-medium text-gray-700 mt-4 mb-3">Datos del Responsable</h3>
                  </div>

                  {/* Responsable */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Responsable del TUPA <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="responsableTupa"
                      value={formData.responsableTupa}
                      onChange={handleInputChange}
                      className={`input-field ${errores.responsableTupa ? 'border-red-500' : ''}`}
                      placeholder="Nombre completo del responsable"
                      disabled={viewMode}
                    />
                    {errores.responsableTupa && (
                      <p className="text-red-500 text-xs mt-1">{errores.responsableTupa}</p>
                    )}
                  </div>

                  {/* Cargo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cargo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cargoResponsableTupa"
                      value={formData.cargoResponsableTupa}
                      onChange={handleInputChange}
                      className={`input-field ${errores.cargoResponsableTupa ? 'border-red-500' : ''}`}
                      placeholder="Cargo"
                      disabled={viewMode}
                    />
                    {errores.cargoResponsableTupa && (
                      <p className="text-red-500 text-xs mt-1">{errores.cargoResponsableTupa}</p>
                    )}
                  </div>

                  {/* Correo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="correoResponsableTupa"
                      value={formData.correoResponsableTupa}
                      onChange={handleInputChange}
                      className={`input-field ${errores.correoResponsableTupa ? 'border-red-500' : ''}`}
                      placeholder="correo@entidad.com"
                      disabled={viewMode}
                    />
                    {errores.correoResponsableTupa && (
                      <p className="text-red-500 text-xs mt-1">{errores.correoResponsableTupa}</p>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="telefonoResponsableTupa"
                      value={formData.telefonoResponsableTupa}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="999 999 999"
                      disabled={viewMode}
                    />
                  </div>

                  {/* TUPA actualizado */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="actualizadoTupa"
                        checked={formData.actualizadoTupa || false}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        disabled={viewMode}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        ¿El TUPA está actualizado?
                      </span>
                    </label>
                  </div>

                  {/* Observaciones */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observaciones
                    </label>
                    <textarea
                      name="observacionesTupa"
                      value={formData.observacionesTupa}
                      onChange={handleInputChange}
                      maxLength="1000"
                      rows="3"
                      className="input-field"
                      placeholder="Observaciones adicionales sobre el TUPA..."
                      disabled={viewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.observacionesTupa?.length || 0} / 1000 caracteres
                    </p>
                  </div>

                  {/* Documento de evidencia (PDF) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Documento de evidencia (PDF)
                    </label>
                    
                    {!pdfUrl ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="mx-auto text-gray-400 mb-2" size={40} />
                        <p className="text-sm text-gray-600 mb-2">
                          Arrastra y suelta el archivo PDF aquí, o haz clic para seleccionar
                        </p>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload-com8"
                          disabled={viewMode}
                        />
                        {!viewMode && (
                          <label htmlFor="file-upload-com8" className="btn-primary cursor-pointer inline-block">
                            Seleccionar archivo
                          </label>
                        )}
                        <p className="text-xs text-gray-500 mt-2">Tamaño máximo: 10 MB</p>
                      </div>
                    ) : (
                      <div className="border border-gray-300 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="text-primary" size={24} />
                            <span className="text-sm font-medium text-gray-700">
                              {formData.documentoFile ? formData.documentoFile.name : 'Documento de evidencia cargado'}
                            </span>
                          </div>
                          {!viewMode && (
                            <button
                              onClick={removeFile}
                              className="text-red-500 hover:text-red-700"
                              title="Eliminar documento"
                            >
                              <X size={20} />
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setDocumentoActualUrl(pdfUrl);
                            setShowPdfViewer(true);
                          }}
                          className="btn-secondary text-sm flex items-center gap-2"
                        >
                          <Eye size={16} />
                          Vista previa del PDF
                        </button>
                      </div>
                    )}
                    {errores.documentoFile && (
                      <p className="text-red-500 text-xs mt-1">{errores.documentoFile}</p>
                    )}
                  </div>
                </div>
              </>
            ) : parseInt(formData.compromisoId) === 9 ? (
              // COMPROMISO 9: Modelo de Gestión Documental
              <>
                <h2 className="text-base font-semibold text-gray-800 mb-3">Paso 1: Datos de Implementación del Modelo de Gestión Documental</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Fecha de aprobación */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de aprobación del MGD <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fechaAprobacionMgd"
                      value={formData.fechaAprobacionMgd}
                      onChange={handleInputChange}
                      className={`input-field ${errores.fechaAprobacionMgd ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    />
                    {errores.fechaAprobacionMgd && (
                      <p className="text-red-500 text-xs mt-1">{errores.fechaAprobacionMgd}</p>
                    )}
                  </div>

                  {/* Número de resolución */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de resolución <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="numeroResolucionMgd"
                      value={formData.numeroResolucionMgd}
                      onChange={handleInputChange}
                      className={`input-field ${errores.numeroResolucionMgd ? 'border-red-500' : ''}`}
                      placeholder="R.M. N° 123-2024"
                      disabled={viewMode}
                    />
                    {errores.numeroResolucionMgd && (
                      <p className="text-red-500 text-xs mt-1">{errores.numeroResolucionMgd}</p>
                    )}
                  </div>

                  {/* Separador */}
                  <div className="md:col-span-2 border-t border-gray-200 my-2">
                    <h3 className="text-sm font-medium text-gray-700 mt-4 mb-3">Datos del Responsable</h3>
                  </div>

                  {/* Responsable */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Responsable del MGD <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="responsableMgd"
                      value={formData.responsableMgd}
                      onChange={handleInputChange}
                      className={`input-field ${errores.responsableMgd ? 'border-red-500' : ''}`}
                      placeholder="Nombre completo del responsable"
                      disabled={viewMode}
                    />
                    {errores.responsableMgd && (
                      <p className="text-red-500 text-xs mt-1">{errores.responsableMgd}</p>
                    )}
                  </div>

                  {/* Cargo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cargo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cargoResponsableMgd"
                      value={formData.cargoResponsableMgd}
                      onChange={handleInputChange}
                      className={`input-field ${errores.cargoResponsableMgd ? 'border-red-500' : ''}`}
                      placeholder="Cargo"
                      disabled={viewMode}
                    />
                    {errores.cargoResponsableMgd && (
                      <p className="text-red-500 text-xs mt-1">{errores.cargoResponsableMgd}</p>
                    )}
                  </div>

                  {/* Correo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="correoResponsableMgd"
                      value={formData.correoResponsableMgd}
                      onChange={handleInputChange}
                      className={`input-field ${errores.correoResponsableMgd ? 'border-red-500' : ''}`}
                      placeholder="correo@entidad.com"
                      disabled={viewMode}
                    />
                    {errores.correoResponsableMgd && (
                      <p className="text-red-500 text-xs mt-1">{errores.correoResponsableMgd}</p>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="telefonoResponsableMgd"
                      value={formData.telefonoResponsableMgd}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="999 999 999"
                      disabled={viewMode}
                    />
                  </div>

                  {/* Sistema o plataforma */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sistema o plataforma usada <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="sistemaPlataformaMgd"
                      value={formData.sistemaPlataformaMgd}
                      onChange={handleInputChange}
                      className={`input-field ${errores.sistemaPlataformaMgd ? 'border-red-500' : ''}`}
                      placeholder="Nombre del sistema o plataforma"
                      disabled={viewMode}
                    />
                    {errores.sistemaPlataformaMgd && (
                      <p className="text-red-500 text-xs mt-1">{errores.sistemaPlataformaMgd}</p>
                    )}
                  </div>

                  {/* Tipo de implantación */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de implantación <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="tipoImplantacionMgd"
                      value={formData.tipoImplantacionMgd}
                      onChange={handleInputChange}
                      className={`input-field ${errores.tipoImplantacionMgd ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    >
                      <option value="">Seleccione el tipo de implantación</option>
                      <option value="propia">Propia</option>
                      <option value="terceros">De terceros</option>
                      <option value="hibrida">Híbrida</option>
                    </select>
                    {errores.tipoImplantacionMgd && (
                      <p className="text-red-500 text-xs mt-1">{errores.tipoImplantacionMgd}</p>
                    )}
                  </div>

                  {/* Interoperabilidad */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="interoperaSistemasMgd"
                        checked={formData.interoperaSistemasMgd || false}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        disabled={viewMode}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        ¿Interopera con otros sistemas (PIDE, MPD)?
                      </span>
                    </label>
                  </div>

                  {/* Observaciones */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observaciones
                    </label>
                    <textarea
                      name="observacionesMgd"
                      value={formData.observacionesMgd}
                      onChange={handleInputChange}
                      maxLength="1000"
                      rows="3"
                      className="input-field"
                      placeholder="Observaciones adicionales..."
                      disabled={viewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.observacionesMgd?.length || 0} / 1000 caracteres
                    </p>
                  </div>

                  {/* Documento de evidencia (PDF) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Documento de evidencia (PDF)
                    </label>
                    
                    {!pdfUrl ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="mx-auto text-gray-400 mb-2" size={40} />
                        <p className="text-sm text-gray-600 mb-2">
                          Arrastra y suelta el archivo PDF aquí, o haz clic para seleccionar
                        </p>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload-com9"
                          disabled={viewMode}
                        />
                        {!viewMode && (
                          <label htmlFor="file-upload-com9" className="btn-primary cursor-pointer inline-block">
                            Seleccionar archivo
                          </label>
                        )}
                        <p className="text-xs text-gray-500 mt-2">Tamaño máximo: 10 MB</p>
                      </div>
                    ) : (
                      <div className="border border-gray-300 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="text-primary" size={24} />
                            <span className="text-sm font-medium text-gray-700">
                              {formData.documentoFile ? formData.documentoFile.name : 'Documento de evidencia cargado'}
                            </span>
                          </div>
                          {!viewMode && (
                            <button
                              onClick={removeFile}
                              className="text-red-500 hover:text-red-700"
                              title="Eliminar documento"
                            >
                              <X size={20} />
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setDocumentoActualUrl(pdfUrl);
                            setShowPdfViewer(true);
                          }}
                          className="btn-secondary text-sm flex items-center gap-2"
                        >
                          <Eye size={16} />
                          Vista previa del PDF
                        </button>
                      </div>
                    )}
                    {errores.documentoFile && (
                      <p className="text-red-500 text-xs mt-1">{errores.documentoFile}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Suba el documento del MGD en formato PDF (máximo 10 MB)
                    </p>
                  </div>
                </div>
              </>
            ) : parseInt(formData.compromisoId) === 10 ? (
              // COMPROMISO 10: Datos Abiertos con pestañas
              <Compromiso10Tabs compndaEntId={com10RecordId}>
                <h2 className="text-base font-semibold text-gray-800 mb-3">Paso 1: Datos Abiertos Publicados en el Portal Nacional (PNDA)</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* URL de los datos abiertos */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL de los datos abiertos <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      name="urlDatosAbiertos"
                      value={formData.urlDatosAbiertos}
                      onChange={handleInputChange}
                      className={`input-field ${errores.urlDatosAbiertos ? 'border-red-500' : ''}`}
                      placeholder="https://www.datosabiertos.gob.pe/entidad"
                      disabled={viewMode}
                    />
                    {errores.urlDatosAbiertos && (
                      <p className="text-red-500 text-xs mt-1">{errores.urlDatosAbiertos}</p>
                    )}
                  </div>

                  {/* Total de datasets */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total de datasets publicados <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="totalDatasets"
                      value={formData.totalDatasets}
                      onChange={handleInputChange}
                      min="0"
                      className={`input-field ${errores.totalDatasets ? 'border-red-500' : ''}`}
                      placeholder="0"
                      disabled={viewMode}
                    />
                    {errores.totalDatasets && (
                      <p className="text-red-500 text-xs mt-1">{errores.totalDatasets}</p>
                    )}
                  </div>

                  {/* Fecha de última actualización */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de última actualización <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fechaUltimaActualizacionDa"
                      value={formData.fechaUltimaActualizacionDa}
                      onChange={handleInputChange}
                      className={`input-field ${errores.fechaUltimaActualizacionDa ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    />
                    {errores.fechaUltimaActualizacionDa && (
                      <p className="text-red-500 text-xs mt-1">{errores.fechaUltimaActualizacionDa}</p>
                    )}
                  </div>

                  {/* Separador */}
                  <div className="md:col-span-2 border-t border-gray-200 my-2">
                    <h3 className="text-sm font-medium text-gray-700 mt-4 mb-3">Responsable de Datos Abiertos</h3>
                  </div>

                  {/* Nombre completo */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="responsableDa"
                      value={formData.responsableDa}
                      onChange={handleInputChange}
                      className={`input-field ${errores.responsableDa ? 'border-red-500' : ''}`}
                      placeholder="Nombre completo del responsable"
                      disabled={viewMode}
                    />
                    {errores.responsableDa && (
                      <p className="text-red-500 text-xs mt-1">{errores.responsableDa}</p>
                    )}
                  </div>

                  {/* Cargo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cargo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cargoDa"
                      value={formData.cargoDa}
                      onChange={handleInputChange}
                      className={`input-field ${errores.cargoDa ? 'border-red-500' : ''}`}
                      placeholder="Cargo"
                      disabled={viewMode}
                    />
                    {errores.cargoDa && (
                      <p className="text-red-500 text-xs mt-1">{errores.cargoDa}</p>
                    )}
                  </div>

                  {/* Correo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="correoDa"
                      value={formData.correoDa}
                      onChange={handleInputChange}
                      className={`input-field ${errores.correoDa ? 'border-red-500' : ''}`}
                      placeholder="correo@entidad.com"
                      disabled={viewMode}
                    />
                    {errores.correoDa && (
                      <p className="text-red-500 text-xs mt-1">{errores.correoDa}</p>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="telefonoDa"
                      value={formData.telefonoDa}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="999 999 999"
                      disabled={viewMode}
                    />
                  </div>

                  {/* Número de norma */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      N° de norma o resolución de aprobación <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="numeroNormaResolucionDa"
                      value={formData.numeroNormaResolucionDa}
                      onChange={handleInputChange}
                      className={`input-field ${errores.numeroNormaResolucionDa ? 'border-red-500' : ''}`}
                      placeholder="R.M. N° 123-2024"
                      disabled={viewMode}
                    />
                    {errores.numeroNormaResolucionDa && (
                      <p className="text-red-500 text-xs mt-1">{errores.numeroNormaResolucionDa}</p>
                    )}
                  </div>

                  {/* Fecha de aprobación */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de aprobación <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fechaAprobacionDa"
                      value={formData.fechaAprobacionDa}
                      onChange={handleInputChange}
                      className={`input-field ${errores.fechaAprobacionDa ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    />
                    {errores.fechaAprobacionDa && (
                      <p className="text-red-500 text-xs mt-1">{errores.fechaAprobacionDa}</p>
                    )}
                  </div>

                  {/* Observaciones */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observaciones
                    </label>
                    <textarea
                      name="observacionesDa"
                      value={formData.observacionesDa}
                      onChange={handleInputChange}
                      maxLength="1000"
                      rows="3"
                      className="input-field"
                      placeholder="Observaciones adicionales..."
                      disabled={viewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.observacionesDa?.length || 0} / 1000 caracteres
                    </p>
                  </div>

                  {/* Documento de evidencia (PDF) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Documento de evidencia (PDF)
                    </label>
                    
                    {!pdfUrl ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="mx-auto text-gray-400 mb-2" size={40} />
                        <p className="text-sm text-gray-600 mb-2">
                          Arrastra y suelta el archivo PDF aquí, o haz clic para seleccionar
                        </p>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload-com10"
                          disabled={viewMode}
                        />
                        {!viewMode && (
                          <label htmlFor="file-upload-com10" className="btn-primary cursor-pointer inline-block">
                            Seleccionar archivo
                          </label>
                        )}
                        <p className="text-xs text-gray-500 mt-2">Tamaño máximo: 10 MB</p>
                      </div>
                    ) : (
                      <div className="border border-gray-300 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="text-primary" size={24} />
                            <span className="text-sm font-medium text-gray-700">
                              {formData.documentoFile ? formData.documentoFile.name : 'Documento de evidencia cargado'}
                            </span>
                          </div>
                          {!viewMode && (
                            <button
                              onClick={removeFile}
                              className="text-red-500 hover:text-red-700"
                              title="Eliminar documento"
                            >
                              <X size={20} />
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setDocumentoActualUrl(pdfUrl);
                            setShowPdfViewer(true);
                          }}
                          className="btn-secondary text-sm flex items-center gap-2"
                        >
                          <Eye size={16} />
                          Vista previa del PDF
                        </button>
                      </div>
                    )}
                    {errores.documentoFile && (
                      <p className="text-red-500 text-xs mt-1">{errores.documentoFile}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Suba el documento de evidencia en formato PDF (máximo 10 MB)
                    </p>
                  </div>
                </div>
              </Compromiso10Tabs>
            ) : parseInt(formData.compromisoId) === 11 ? (
              // COMPROMISO 11: Aportación de Información Geoespacial al Proyecto GeoPerú
              <>
                <h2 className="text-base font-semibold text-gray-800 mb-3">Paso 1: Aportación de Información Geoespacial al Proyecto GeoPerú</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* URL de la información geoespacial */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL de la información geoespacial <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      name="urlGeo"
                      value={formData.urlGeo || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.urlGeo ? 'border-red-500' : ''}`}
                      placeholder="https://www.geoperu.gob.pe/..."
                      disabled={viewMode}
                    />
                    {errores.urlGeo && (
                      <p className="text-red-500 text-xs mt-1">{errores.urlGeo}</p>
                    )}
                  </div>

                  {/* Tipo de información publicada */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de información publicada <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="tipoInformacionGeo"
                      value={formData.tipoInformacionGeo || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.tipoInformacionGeo ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    >
                      <option value="">Seleccione tipo</option>
                      <option value="Cartografía base">Cartografía base</option>
                      <option value="Infraestructura">Infraestructura</option>
                      <option value="Límites territoriales">Límites territoriales</option>
                      <option value="Recursos naturales">Recursos naturales</option>
                      <option value="Servicios públicos">Servicios públicos</option>
                      <option value="Catastro">Catastro</option>
                      <option value="Otro">Otro</option>
                    </select>
                    {errores.tipoInformacionGeo && (
                      <p className="text-red-500 text-xs mt-1">{errores.tipoInformacionGeo}</p>
                    )}
                  </div>

                  {/* Total de Capas Publicadas */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total de capas publicadas <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="totalCapasPublicadas"
                      value={formData.totalCapasPublicadas || ''}
                      onChange={handleInputChange}
                      min="0"
                      className={`input-field ${errores.totalCapasPublicadas ? 'border-red-500' : ''}`}
                      placeholder="0"
                      disabled={viewMode}
                    />
                    {errores.totalCapasPublicadas && (
                      <p className="text-red-500 text-xs mt-1">{errores.totalCapasPublicadas}</p>
                    )}
                  </div>

                  {/* Fecha de última actualización */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de última actualización <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fechaUltimaActualizacionGeo"
                      value={formData.fechaUltimaActualizacionGeo || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.fechaUltimaActualizacionGeo ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    />
                    {errores.fechaUltimaActualizacionGeo && (
                      <p className="text-red-500 text-xs mt-1">{errores.fechaUltimaActualizacionGeo}</p>
                    )}
                  </div>

                  {/* Sección: Responsable de la información */}
                  <div className="md:col-span-2 mt-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-3 border-b pb-2">Responsable de la información</h3>
                  </div>

                  {/* Nombre completo */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="responsableGeo"
                      value={formData.responsableGeo || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.responsableGeo ? 'border-red-500' : ''}`}
                      placeholder="Nombre completo del responsable"
                      disabled={viewMode}
                    />
                    {errores.responsableGeo && (
                      <p className="text-red-500 text-xs mt-1">{errores.responsableGeo}</p>
                    )}
                  </div>

                  {/* Cargo */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cargo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cargoResponsableGeo"
                      value={formData.cargoResponsableGeo || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.cargoResponsableGeo ? 'border-red-500' : ''}`}
                      placeholder="Cargo del responsable"
                      disabled={viewMode}
                    />
                    {errores.cargoResponsableGeo && (
                      <p className="text-red-500 text-xs mt-1">{errores.cargoResponsableGeo}</p>
                    )}
                  </div>

                  {/* Correo */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="correoResponsableGeo"
                      value={formData.correoResponsableGeo || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.correoResponsableGeo ? 'border-red-500' : ''}`}
                      placeholder="correo@entidad.com"
                      disabled={viewMode}
                    />
                    {errores.correoResponsableGeo && (
                      <p className="text-red-500 text-xs mt-1">{errores.correoResponsableGeo}</p>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="text"
                      name="telefonoResponsableGeo"
                      value={formData.telefonoResponsableGeo || ''}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="999-999-999"
                      disabled={viewMode}
                    />
                  </div>

                  {/* N° de norma de aprobación */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      N° de norma de aprobación <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="normaAprobacionGeo"
                      value={formData.normaAprobacionGeo || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.normaAprobacionGeo ? 'border-red-500' : ''}`}
                      placeholder="Ej: Resolución Directoral N° 001-2025"
                      disabled={viewMode}
                    />
                    {errores.normaAprobacionGeo && (
                      <p className="text-red-500 text-xs mt-1">{errores.normaAprobacionGeo}</p>
                    )}
                  </div>

                  {/* Fecha de aprobación */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de aprobación <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fechaAprobacionGeo"
                      value={formData.fechaAprobacionGeo || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.fechaAprobacionGeo ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    />
                    {errores.fechaAprobacionGeo && (
                      <p className="text-red-500 text-xs mt-1">{errores.fechaAprobacionGeo}</p>
                    )}
                  </div>

                  {/* ¿La información es interoperable? */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ¿La información es interoperable?
                    </label>
                    <select
                      name="interoperabilidadGeo"
                      value={formData.interoperabilidadGeo ? 'true' : 'false'}
                      onChange={(e) => handleInputChange({ target: { name: 'interoperabilidadGeo', value: e.target.value === 'true' } })}
                      className="input-field"
                      disabled={viewMode}
                    >
                      <option value="false">No</option>
                      <option value="true">Sí</option>
                    </select>
                  </div>

                  {/* Observaciones */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observaciones
                    </label>
                    <textarea
                      name="observacionGeo"
                      value={formData.observacionGeo || ''}
                      onChange={handleInputChange}
                      maxLength="255"
                      rows="3"
                      className="input-field"
                      placeholder="Observaciones adicionales..."
                      disabled={viewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.observacionGeo?.length || 0} / 255 caracteres
                    </p>
                  </div>

                  {/* Documento de evidencia (PDF) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Documento de evidencia (PDF)
                    </label>
                    
                    {!pdfUrl ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="mx-auto text-gray-400 mb-2" size={40} />
                        <p className="text-sm text-gray-600 mb-2">
                          Arrastra y suelta el archivo PDF aquí, o haz clic para seleccionar
                        </p>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload-com11"
                          disabled={viewMode}
                        />
                        {!viewMode && (
                          <label htmlFor="file-upload-com11" className="btn-primary cursor-pointer inline-block">
                            Seleccionar archivo
                          </label>
                        )}
                        <p className="text-xs text-gray-500 mt-2">Tamaño máximo: 10 MB</p>
                      </div>
                    ) : (
                      <div className="border border-gray-300 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="text-primary" size={24} />
                            <span className="text-sm font-medium text-gray-700">
                              {formData.documentoFile ? formData.documentoFile.name : 'Documento de evidencia cargado'}
                            </span>
                          </div>
                          {!viewMode && (
                            <button
                              onClick={removeFile}
                              className="text-red-500 hover:text-red-700"
                              title="Eliminar documento"
                            >
                              <X size={20} />
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setDocumentoActualUrl(pdfUrl);
                            setShowPdfViewer(true);
                          }}
                          className="btn-secondary text-sm flex items-center gap-2"
                        >
                          <Eye size={16} />
                          Vista previa del PDF
                        </button>
                      </div>
                    )}
                    {errores.documentoFile && (
                      <p className="text-red-500 text-xs mt-1">{errores.documentoFile}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Suba el archivo del plan en formato PDF (máximo 10 MB)
                    </p>
                  </div>
                </div>
              </>
            ) : parseInt(formData.compromisoId) === 12 ? (
              // COMPROMISO 12: Designación de Responsable de Software Público
              <>
                <h2 className="text-base font-semibold text-gray-800 mb-3">Paso 1: Designación de Responsable de Software Público</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* DNI */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      DNI <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="dniRsp"
                      value={formData.dniRsp || ''}
                      onChange={handleInputChange}
                      maxLength="8"
                      className={`input-field ${errores.dniRsp ? 'border-red-500' : ''}`}
                      placeholder="Ej: 12345678"
                      disabled={viewMode}
                    />
                    {errores.dniRsp && (
                      <p className="text-red-500 text-xs mt-1">{errores.dniRsp}</p>
                    )}
                  </div>

                  {/* Nombres */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombres <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nombreRsp"
                      value={formData.nombreRsp || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.nombreRsp ? 'border-red-500' : ''}`}
                      placeholder="Ingrese nombres"
                      disabled={viewMode}
                    />
                    {errores.nombreRsp && (
                      <p className="text-red-500 text-xs mt-1">{errores.nombreRsp}</p>
                    )}
                  </div>

                  {/* Apellido Paterno */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido Paterno <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="apePatRsp"
                      value={formData.apePatRsp || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.apePatRsp ? 'border-red-500' : ''}`}
                      placeholder="Ingrese apellido paterno"
                      disabled={viewMode}
                    />
                    {errores.apePatRsp && (
                      <p className="text-red-500 text-xs mt-1">{errores.apePatRsp}</p>
                    )}
                  </div>

                  {/* Apellido Materno */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido Materno <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="apeMatRsp"
                      value={formData.apeMatRsp || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.apeMatRsp ? 'border-red-500' : ''}`}
                      placeholder="Ingrese apellido materno"
                      disabled={viewMode}
                    />
                    {errores.apeMatRsp && (
                      <p className="text-red-500 text-xs mt-1">{errores.apeMatRsp}</p>
                    )}
                  </div>

                  {/* Cargo */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cargo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cargoRsp"
                      value={formData.cargoRsp || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.cargoRsp ? 'border-red-500' : ''}`}
                      placeholder="Ej: Jefe de TI"
                      disabled={viewMode}
                    />
                    {errores.cargoRsp && (
                      <p className="text-red-500 text-xs mt-1">{errores.cargoRsp}</p>
                    )}
                  </div>

                  {/* Correo institucional */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo institucional <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="correoRsp"
                      value={formData.correoRsp || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.correoRsp ? 'border-red-500' : ''}`}
                      placeholder="correo@entidad.com"
                      disabled={viewMode}
                    />
                    {errores.correoRsp && (
                      <p className="text-red-500 text-xs mt-1">{errores.correoRsp}</p>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="telefonoRsp"
                      value={formData.telefonoRsp || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.telefonoRsp ? 'border-red-500' : ''}`}
                      placeholder="Ej: 01-1234567"
                      disabled={viewMode}
                    />
                    {errores.telefonoRsp && (
                      <p className="text-red-500 text-xs mt-1">{errores.telefonoRsp}</p>
                    )}
                  </div>

                  {/* Fecha de designación */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de designación <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fechaDesignacionRsp"
                      value={formData.fechaDesignacionRsp || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.fechaDesignacionRsp ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    />
                    {errores.fechaDesignacionRsp && (
                      <p className="text-red-500 text-xs mt-1">{errores.fechaDesignacionRsp}</p>
                    )}
                  </div>

                  {/* Nº de resolución o documento */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nº de resolución o documento <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="numeroResolucionRsp"
                      value={formData.numeroResolucionRsp || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.numeroResolucionRsp ? 'border-red-500' : ''}`}
                      placeholder="Ej: RES-001-2025"
                      disabled={viewMode}
                    />
                    {errores.numeroResolucionRsp && (
                      <p className="text-red-500 text-xs mt-1">{errores.numeroResolucionRsp}</p>
                    )}
                  </div>

                  {/* Espacio vacío para alineación */}
                  <div className=""></div>

                  {/* Observaciones */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observaciones
                    </label>
                    <textarea
                      name="observacionRsp"
                      value={formData.observacionRsp || ''}
                      onChange={handleInputChange}
                      maxLength="1000"
                      rows="3"
                      className={`input-field ${errores.observacionRsp ? 'border-red-500' : ''}`}
                      placeholder="Ingrese observaciones adicionales..."
                      disabled={viewMode}
                    />
                    {errores.observacionRsp && (
                      <p className="text-red-500 text-xs mt-1">{errores.observacionRsp}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.observacionRsp?.length || 0} / 1000 caracteres
                    </p>
                  </div>

                  {/* Documento de evidencia (PDF) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Documento de evidencia (PDF)
                    </label>
                    
                    {!pdfUrl ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="mx-auto text-gray-400 mb-2" size={40} />
                        <p className="text-sm text-gray-600 mb-2">
                          Arrastra y suelta el archivo PDF aquí, o haz clic para seleccionar
                        </p>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload-com12"
                          disabled={viewMode}
                        />
                        {!viewMode && (
                          <label htmlFor="file-upload-com12" className="btn-primary cursor-pointer inline-block">
                            Seleccionar archivo
                          </label>
                        )}
                        <p className="text-xs text-gray-500 mt-2">Tamaño máximo: 10 MB</p>
                      </div>
                    ) : (
                      <div className="border border-gray-300 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="text-primary" size={24} />
                            <span className="text-sm font-medium text-gray-700">
                              {formData.documentoFile ? formData.documentoFile.name : 'Documento de evidencia cargado'}
                            </span>
                          </div>
                          {!viewMode && (
                            <button
                              onClick={removeFile}
                              className="text-red-500 hover:text-red-700"
                              title="Eliminar documento"
                            >
                              <X size={20} />
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setDocumentoActualUrl(pdfUrl);
                            setShowPdfViewer(true);
                          }}
                          className="btn-secondary text-sm flex items-center gap-2"
                        >
                          <Eye size={16} />
                          Vista previa del PDF
                        </button>
                      </div>
                    )}
                    {errores.documentoFile && (
                      <p className="text-red-500 text-xs mt-1">{errores.documentoFile}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Suba el archivo del documento de designación en formato PDF (máximo 10 MB)
                    </p>
                  </div>
                </div>
              </>
            ) : parseInt(formData.compromisoId) === 13 ? (
              // COMPROMISO 13: Datos de Interoperabilidad - Servicios PIDE
              <>
                <h2 className="text-base font-semibold text-gray-800 mb-3">Paso 1: Datos de Interoperabilidad - Servicios PIDE</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tipo de integración */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de integración <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="tipoIntegracionPide"
                      value={formData.tipoIntegracionPide || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.tipoIntegracionPide ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    >
                      <option value="">Seleccione tipo</option>
                      <option value="publicador">Publicador de servicios</option>
                      <option value="consumidor">Consumidor de servicios</option>
                      <option value="ambos">Publicador y Consumidor</option>
                    </select>
                    {errores.tipoIntegracionPide && (
                      <p className="text-red-500 text-xs mt-1">{errores.tipoIntegracionPide}</p>
                    )}
                  </div>

                  {/* Nombre del servicio interoperable */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del servicio interoperable <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nombreServicioPide"
                      value={formData.nombreServicioPide || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.nombreServicioPide ? 'border-red-500' : ''}`}
                      placeholder="Nombre del servicio"
                      disabled={viewMode}
                    />
                    {errores.nombreServicioPide && (
                      <p className="text-red-500 text-xs mt-1">{errores.nombreServicioPide}</p>
                    )}
                  </div>

                  {/* Descripción del servicio */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción del servicio
                    </label>
                    <textarea
                      name="descripcionServicioPide"
                      value={formData.descripcionServicioPide || ''}
                      onChange={handleInputChange}
                      maxLength="255"
                      rows="2"
                      className="input-field"
                      placeholder="Describa el servicio interoperable..."
                      disabled={viewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.descripcionServicioPide?.length || 0} / 255 caracteres
                    </p>
                  </div>

                  {/* Fecha de inicio de operación */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de inicio de operación <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fechaInicioOperacionPide"
                      value={formData.fechaInicioOperacionPide || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.fechaInicioOperacionPide ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    />
                    {errores.fechaInicioOperacionPide && (
                      <p className="text-red-500 text-xs mt-1">{errores.fechaInicioOperacionPide}</p>
                    )}
                  </div>

                  {/* URL del servicio */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL del servicio (si aplica)
                    </label>
                    <input
                      type="url"
                      name="urlServicioPide"
                      value={formData.urlServicioPide || ''}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="https://..."
                      disabled={viewMode}
                    />
                  </div>

                  {/* Responsable técnico */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Responsable técnico <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="responsablePide"
                      value={formData.responsablePide || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.responsablePide ? 'border-red-500' : ''}`}
                      placeholder="Nombre completo"
                      disabled={viewMode}
                    />
                    {errores.responsablePide && (
                      <p className="text-red-500 text-xs mt-1">{errores.responsablePide}</p>
                    )}
                  </div>

                  {/* Cargo */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cargo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cargoResponsablePide"
                      value={formData.cargoResponsablePide || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.cargoResponsablePide ? 'border-red-500' : ''}`}
                      placeholder="Ej: Jefe de TI"
                      disabled={viewMode}
                    />
                    {errores.cargoResponsablePide && (
                      <p className="text-red-500 text-xs mt-1">{errores.cargoResponsablePide}</p>
                    )}
                  </div>

                  {/* Correo */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="correoResponsablePide"
                      value={formData.correoResponsablePide || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.correoResponsablePide ? 'border-red-500' : ''}`}
                      placeholder="correo@entidad.com"
                      disabled={viewMode}
                    />
                    {errores.correoResponsablePide && (
                      <p className="text-red-500 text-xs mt-1">{errores.correoResponsablePide}</p>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="telefonoResponsablePide"
                      value={formData.telefonoResponsablePide || ''}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Ej: 01-1234567"
                      disabled={viewMode}
                    />
                  </div>

                  {/* Nº de convenio / resolución de acceso */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nº de convenio / resolución de acceso <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="numeroConvenioPide"
                      value={formData.numeroConvenioPide || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.numeroConvenioPide ? 'border-red-500' : ''}`}
                      placeholder="Ej: CONV-001-2025"
                      disabled={viewMode}
                    />
                    {errores.numeroConvenioPide && (
                      <p className="text-red-500 text-xs mt-1">{errores.numeroConvenioPide}</p>
                    )}
                  </div>

                  {/* Fecha del convenio */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha del convenio
                    </label>
                    <input
                      type="date"
                      name="fechaConvenioPide"
                      value={formData.fechaConvenioPide || ''}
                      onChange={handleInputChange}
                      className="input-field"
                      disabled={viewMode}
                    />
                  </div>

                  {/* ¿Servicio interoperable activo? */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="interoperabilidadPide"
                        checked={formData.interoperabilidadPide || false}
                        onChange={(e) => setFormData(prev => ({ ...prev, interoperabilidadPide: e.target.checked }))}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        disabled={viewMode}
                      />
                      <span className="text-sm font-medium text-gray-700">¿Servicio interoperable activo?</span>
                    </label>
                  </div>

                  {/* Observaciones */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observaciones
                    </label>
                    <textarea
                      name="observacionPide"
                      value={formData.observacionPide || ''}
                      onChange={handleInputChange}
                      maxLength="255"
                      rows="2"
                      className="input-field"
                      placeholder="Observaciones adicionales..."
                      disabled={viewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.observacionPide?.length || 0} / 255 caracteres
                    </p>
                  </div>

                  {/* Documento de evidencia (PDF) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Documento de evidencia (PDF)
                    </label>
                    
                    {!pdfUrl ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="mx-auto text-gray-400 mb-2" size={40} />
                        <p className="text-sm text-gray-600 mb-2">
                          Arrastra y suelta el archivo PDF aquí, o haz clic para seleccionar
                        </p>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload-com13"
                          disabled={viewMode}
                        />
                        {!viewMode && (
                          <label htmlFor="file-upload-com13" className="btn-primary cursor-pointer inline-block">
                            Seleccionar archivo
                          </label>
                        )}
                        <p className="text-xs text-gray-500 mt-2">Tamaño máximo: 10 MB</p>
                      </div>
                    ) : (
                      <div className="border border-gray-300 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="text-primary" size={24} />
                            <span className="text-sm font-medium text-gray-700">
                              {formData.documentoFile ? formData.documentoFile.name : 'Documento de evidencia cargado'}
                            </span>
                          </div>
                          {!viewMode && (
                            <button
                              onClick={removeFile}
                              className="text-red-500 hover:text-red-700"
                              title="Eliminar documento"
                            >
                              <X size={20} />
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setDocumentoActualUrl(pdfUrl);
                            setShowPdfViewer(true);
                          }}
                          className="btn-secondary text-sm flex items-center gap-2"
                        >
                          <Eye size={16} />
                          Vista previa del PDF
                        </button>
                      </div>
                    )}
                    {errores.documentoFile && (
                      <p className="text-red-500 text-xs mt-1">{errores.documentoFile}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Suba el documento de evidencia en formato PDF (máximo 10 MB)
                    </p>
                  </div>
                </div>
              </>
            ) : parseInt(formData.compromisoId) === 14 ? (
              // COMPROMISO 14: Oficial de Seguridad y Confianza Digital (OSCD)
              <>
                <h2 className="text-base font-semibold text-gray-800 mb-3">Paso 1: Datos del Oficial de Seguridad y Confianza Digital (OSCD)</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* DNI */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      DNI <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="dniOscd"
                      value={formData.dniOscd || ''}
                      onChange={handleInputChange}
                      maxLength="8"
                      className={`input-field ${errores.dniOscd ? 'border-red-500' : ''}`}
                      placeholder="Ej: 12345678"
                      disabled={viewMode}
                    />
                    {errores.dniOscd && (
                      <p className="text-red-500 text-xs mt-1">{errores.dniOscd}</p>
                    )}
                  </div>

                  {/* Nombres */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombres <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nombreOscd"
                      value={formData.nombreOscd || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.nombreOscd ? 'border-red-500' : ''}`}
                      placeholder="Ingrese nombres"
                      disabled={viewMode}
                    />
                    {errores.nombreOscd && (
                      <p className="text-red-500 text-xs mt-1">{errores.nombreOscd}</p>
                    )}
                  </div>

                  {/* Apellido Paterno */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido Paterno <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="apePatOscd"
                      value={formData.apePatOscd || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.apePatOscd ? 'border-red-500' : ''}`}
                      placeholder="Ingrese apellido paterno"
                      disabled={viewMode}
                    />
                    {errores.apePatOscd && (
                      <p className="text-red-500 text-xs mt-1">{errores.apePatOscd}</p>
                    )}
                  </div>

                  {/* Apellido Materno */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido Materno <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="apeMatOscd"
                      value={formData.apeMatOscd || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.apeMatOscd ? 'border-red-500' : ''}`}
                      placeholder="Ingrese apellido materno"
                      disabled={viewMode}
                    />
                    {errores.apeMatOscd && (
                      <p className="text-red-500 text-xs mt-1">{errores.apeMatOscd}</p>
                    )}
                  </div>

                  {/* Cargo */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cargo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cargoOscd"
                      value={formData.cargoOscd || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.cargoOscd ? 'border-red-500' : ''}`}
                      placeholder="Ej: Oficial de Seguridad"
                      disabled={viewMode}
                    />
                    {errores.cargoOscd && (
                      <p className="text-red-500 text-xs mt-1">{errores.cargoOscd}</p>
                    )}
                  </div>

                  {/* Correo institucional */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo institucional <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="correoOscd"
                      value={formData.correoOscd || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.correoOscd ? 'border-red-500' : ''}`}
                      placeholder="correo@entidad.com"
                      disabled={viewMode}
                    />
                    {errores.correoOscd && (
                      <p className="text-red-500 text-xs mt-1">{errores.correoOscd}</p>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="telefonoOscd"
                      value={formData.telefonoOscd || ''}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Ej: 01-1234567"
                      disabled={viewMode}
                    />
                  </div>

                  {/* Fecha de designación */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de designación <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fechaDesignacionOscd"
                      value={formData.fechaDesignacionOscd || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.fechaDesignacionOscd ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    />
                    {errores.fechaDesignacionOscd && (
                      <p className="text-red-500 text-xs mt-1">{errores.fechaDesignacionOscd}</p>
                    )}
                  </div>

                  {/* Nº de resolución o documento */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nº de resolución o documento <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="numeroResolucionOscd"
                      value={formData.numeroResolucionOscd || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.numeroResolucionOscd ? 'border-red-500' : ''}`}
                      placeholder="Ej: RES-001-2025"
                      disabled={viewMode}
                    />
                    {errores.numeroResolucionOscd && (
                      <p className="text-red-500 text-xs mt-1">{errores.numeroResolucionOscd}</p>
                    )}
                  </div>

                  {/* Espacio vacío para alineación */}
                  <div className=""></div>

                  {/* ¿La designación fue comunicada a PCM? */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="comunicadoPcmOscd"
                        checked={formData.comunicadoPcmOscd || false}
                        onChange={(e) => setFormData(prev => ({ ...prev, comunicadoPcmOscd: e.target.checked }))}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        disabled={viewMode}
                      />
                      <span className="text-sm font-medium text-gray-700">¿La designación fue comunicada a PCM?</span>
                    </label>
                  </div>

                  {/* Observaciones */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observaciones
                    </label>
                    <textarea
                      name="observacionOscd"
                      value={formData.observacionOscd || ''}
                      onChange={handleInputChange}
                      maxLength="255"
                      rows="2"
                      className="input-field"
                      placeholder="Observaciones adicionales..."
                      disabled={viewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.observacionOscd?.length || 0} / 255 caracteres
                    </p>
                  </div>

                  {/* Documento de evidencia (PDF) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Documento de evidencia (PDF)
                    </label>
                    
                    {!pdfUrl ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="mx-auto text-gray-400 mb-2" size={40} />
                        <p className="text-sm text-gray-600 mb-2">
                          Arrastra y suelta el archivo PDF aquí, o haz clic para seleccionar
                        </p>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload-com14"
                          disabled={viewMode}
                        />
                        {!viewMode && (
                          <label htmlFor="file-upload-com14" className="btn-primary cursor-pointer inline-block">
                            Seleccionar archivo
                          </label>
                        )}
                        <p className="text-xs text-gray-500 mt-2">Tamaño máximo: 10 MB</p>
                      </div>
                    ) : (
                      <div className="border border-gray-300 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="text-primary" size={24} />
                            <span className="text-sm font-medium text-gray-700">
                              {formData.documentoFile ? formData.documentoFile.name : 'Documento de evidencia cargado'}
                            </span>
                          </div>
                          {!viewMode && (
                            <button
                              onClick={removeFile}
                              className="text-red-500 hover:text-red-700"
                              title="Eliminar documento"
                            >
                              <X size={20} />
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setDocumentoActualUrl(pdfUrl);
                            setShowPdfViewer(true);
                          }}
                          className="btn-secondary text-sm flex items-center gap-2"
                        >
                          <Eye size={16} />
                          Vista previa del PDF
                        </button>
                      </div>
                    )}
                    {errores.documentoFile && (
                      <p className="text-red-500 text-xs mt-1">{errores.documentoFile}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Suba el documento de designación en formato PDF (máximo 10 MB)
                    </p>
                  </div>
                </div>
              </>
            ) : parseInt(formData.compromisoId) === 15 ? (
              // COMPROMISO 15: Datos del CSIRT Institucional
              <>
                <h2 className="text-base font-semibold text-gray-800 mb-3">Paso 1: Datos del CSIRT Institucional</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nombre del CSIRT */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del CSIRT <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nombreCsirt"
                      value={formData.nombreCsirt || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.nombreCsirt ? 'border-red-500' : ''}`}
                      placeholder="Ej: CSIRT-MINEDU"
                      disabled={viewMode}
                    />
                    {errores.nombreCsirt && (
                      <p className="text-red-500 text-xs mt-1">{errores.nombreCsirt}</p>
                    )}
                  </div>

                  {/* Fecha de conformación */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de conformación <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fechaConformacionCsirt"
                      value={formData.fechaConformacionCsirt || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.fechaConformacionCsirt ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    />
                    {errores.fechaConformacionCsirt && (
                      <p className="text-red-500 text-xs mt-1">{errores.fechaConformacionCsirt}</p>
                    )}
                  </div>

                  {/* Nº de resolución / documento de creación */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nº de resolución / documento de creación <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="numeroResolucionCsirt"
                      value={formData.numeroResolucionCsirt || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.numeroResolucionCsirt ? 'border-red-500' : ''}`}
                      placeholder="Ej: RES-001-2025"
                      disabled={viewMode}
                    />
                    {errores.numeroResolucionCsirt && (
                      <p className="text-red-500 text-xs mt-1">{errores.numeroResolucionCsirt}</p>
                    )}
                  </div>

                  {/* Responsable / Coordinador */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Responsable / Coordinador <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="responsableCsirt"
                      value={formData.responsableCsirt || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.responsableCsirt ? 'border-red-500' : ''}`}
                      placeholder="Nombre completo"
                      disabled={viewMode}
                    />
                    {errores.responsableCsirt && (
                      <p className="text-red-500 text-xs mt-1">{errores.responsableCsirt}</p>
                    )}
                  </div>

                  {/* Cargo */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cargo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cargoResponsableCsirt"
                      value={formData.cargoResponsableCsirt || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.cargoResponsableCsirt ? 'border-red-500' : ''}`}
                      placeholder="Ej: Coordinador CSIRT"
                      disabled={viewMode}
                    />
                    {errores.cargoResponsableCsirt && (
                      <p className="text-red-500 text-xs mt-1">{errores.cargoResponsableCsirt}</p>
                    )}
                  </div>

                  {/* Correo institucional */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo institucional <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="correoCsirt"
                      value={formData.correoCsirt || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.correoCsirt ? 'border-red-500' : ''}`}
                      placeholder="csirt@entidad.com"
                      disabled={viewMode}
                    />
                    {errores.correoCsirt && (
                      <p className="text-red-500 text-xs mt-1">{errores.correoCsirt}</p>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="telefonoCsirt"
                      value={formData.telefonoCsirt || ''}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Ej: 01-1234567"
                      disabled={viewMode}
                    />
                  </div>

                  {/* Espacio vacío para alineación */}
                  <div className=""></div>

                  {/* ¿Cuenta con protocolo o plan de atención de incidentes? */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="protocoloIncidentesCsirt"
                        checked={formData.protocoloIncidentesCsirt || false}
                        onChange={(e) => setFormData(prev => ({ ...prev, protocoloIncidentesCsirt: e.target.checked }))}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        disabled={viewMode}
                      />
                      <span className="text-sm font-medium text-gray-700">¿Cuenta con protocolo o plan de atención de incidentes?</span>
                    </label>
                  </div>

                  {/* ¿Se comunicó la conformación a la PCM (CSIRT Nacional)? */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="comunicadoPcmCsirt"
                        checked={formData.comunicadoPcmCsirt || false}
                        onChange={(e) => setFormData(prev => ({ ...prev, comunicadoPcmCsirt: e.target.checked }))}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        disabled={viewMode}
                      />
                      <span className="text-sm font-medium text-gray-700">¿Se comunicó la conformación a la PCM (CSIRT Nacional)?</span>
                    </label>
                  </div>

                  {/* Observaciones */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observaciones
                    </label>
                    <textarea
                      name="observacionCsirt"
                      value={formData.observacionCsirt || ''}
                      onChange={handleInputChange}
                      maxLength="255"
                      rows="2"
                      className="input-field"
                      placeholder="Observaciones adicionales..."
                      disabled={viewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.observacionCsirt?.length || 0} / 255 caracteres
                    </p>
                  </div>

                  {/* Documento de evidencia (PDF) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Documento de evidencia (PDF)
                    </label>
                    
                    {!pdfUrl ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="mx-auto text-gray-400 mb-2" size={40} />
                        <p className="text-sm text-gray-600 mb-2">
                          Arrastra y suelta el archivo PDF aquí, o haz clic para seleccionar
                        </p>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload-com15"
                          disabled={viewMode}
                        />
                        {!viewMode && (
                          <label htmlFor="file-upload-com15" className="btn-primary cursor-pointer inline-block">
                            Seleccionar archivo
                          </label>
                        )}
                        <p className="text-xs text-gray-500 mt-2">Tamaño máximo: 10 MB</p>
                      </div>
                    ) : (
                      <div className="border border-gray-300 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="text-primary" size={24} />
                            <span className="text-sm font-medium text-gray-700">
                              {formData.documentoFile ? formData.documentoFile.name : 'Documento de evidencia cargado'}
                            </span>
                          </div>
                          {!viewMode && (
                            <button
                              onClick={removeFile}
                              className="text-red-500 hover:text-red-700"
                              title="Eliminar documento"
                            >
                              <X size={20} />
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setDocumentoActualUrl(pdfUrl);
                            setShowPdfViewer(true);
                          }}
                          className="btn-secondary text-sm flex items-center gap-2"
                        >
                          <Eye size={16} />
                          Vista previa del PDF
                        </button>
                      </div>
                    )}
                    {errores.documentoFile && (
                      <p className="text-red-500 text-xs mt-1">{errores.documentoFile}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Suba el documento de conformación en formato PDF (máximo 10 MB)
                    </p>
                  </div>
                </div>
              </>
            ) : parseInt(formData.compromisoId) === 16 ? (
              // COMPROMISO 16: Sistema de Gestión de Seguridad de la Información (SGSI)
              <>
                <h2 className="text-base font-semibold text-gray-800 mb-3">Paso 1: Datos del Sistema de Gestión de Seguridad de la Información</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Responsable del SGSI */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Responsable del SGSI <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="responsableSgsi"
                      value={formData.responsableSgsi || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.responsableSgsi ? 'border-red-500' : ''}`}
                      placeholder="Nombre completo"
                      disabled={viewMode}
                    />
                    {errores.responsableSgsi && (
                      <p className="text-red-500 text-xs mt-1">{errores.responsableSgsi}</p>
                    )}
                  </div>

                  {/* Cargo */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cargo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cargoResponsableSgsi"
                      value={formData.cargoResponsableSgsi || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.cargoResponsableSgsi ? 'border-red-500' : ''}`}
                      placeholder="Ej: Oficial de Seguridad"
                      disabled={viewMode}
                    />
                    {errores.cargoResponsableSgsi && (
                      <p className="text-red-500 text-xs mt-1">{errores.cargoResponsableSgsi}</p>
                    )}
                  </div>

                  {/* Correo institucional */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo institucional <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="correoSgsi"
                      value={formData.correoSgsi || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.correoSgsi ? 'border-red-500' : ''}`}
                      placeholder="correo@entidad.com"
                      disabled={viewMode}
                    />
                    {errores.correoSgsi && (
                      <p className="text-red-500 text-xs mt-1">{errores.correoSgsi}</p>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="telefonoSgsi"
                      value={formData.telefonoSgsi || ''}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Ej: 01-1234567"
                      disabled={viewMode}
                    />
                  </div>

                  {/* Estado de implementación */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado de implementación <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="estadoImplementacionSgsi"
                      value={formData.estadoImplementacionSgsi || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.estadoImplementacionSgsi ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    >
                      <option value="">Seleccione estado</option>
                      <option value="En planificación">En planificación</option>
                      <option value="En implementación">En implementación</option>
                      <option value="Implementado">Implementado</option>
                      <option value="Certificado">Certificado</option>
                    </select>
                    {errores.estadoImplementacionSgsi && (
                      <p className="text-red-500 text-xs mt-1">{errores.estadoImplementacionSgsi}</p>
                    )}
                  </div>

                  {/* Versión de la norma */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Versión de la norma <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="versionNormaSgsi"
                      value={formData.versionNormaSgsi || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.versionNormaSgsi ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    >
                      <option value="">Seleccione versión</option>
                      <option value="ISO 27001:2013">ISO 27001:2013</option>
                      <option value="ISO 27001:2022">ISO 27001:2022</option>
                      <option value="NTP-ISO/IEC 27001:2014">NTP-ISO/IEC 27001:2014</option>
                      <option value="NTP-ISO/IEC 27001:2022">NTP-ISO/IEC 27001:2022</option>
                    </select>
                    {errores.versionNormaSgsi && (
                      <p className="text-red-500 text-xs mt-1">{errores.versionNormaSgsi}</p>
                    )}
                  </div>

                  {/* Alcance del SGSI */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alcance del SGSI
                    </label>
                    <textarea
                      name="alcanceSgsi"
                      value={formData.alcanceSgsi || ''}
                      onChange={handleInputChange}
                      maxLength="255"
                      rows="2"
                      className="input-field"
                      placeholder="Describa el alcance del SGSI..."
                      disabled={viewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.alcanceSgsi?.length || 0} / 255 caracteres
                    </p>
                  </div>

                  {/* Fecha de inicio de implementación */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de inicio de implementación <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fechaInicioSgsi"
                      value={formData.fechaInicioSgsi || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.fechaInicioSgsi ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    />
                    {errores.fechaInicioSgsi && (
                      <p className="text-red-500 text-xs mt-1">{errores.fechaInicioSgsi}</p>
                    )}
                  </div>

                  {/* Fecha de certificación (si aplica) */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de certificación (si aplica)
                    </label>
                    <input
                      type="date"
                      name="fechaCertificacionSgsi"
                      value={formData.fechaCertificacionSgsi || ''}
                      onChange={handleInputChange}
                      className="input-field"
                      disabled={viewMode}
                    />
                  </div>

                  {/* Entidad certificadora */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Entidad certificadora
                    </label>
                    <input
                      type="text"
                      name="entidadCertificadoraSgsi"
                      value={formData.entidadCertificadoraSgsi || ''}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Nombre de la entidad certificadora"
                      disabled={viewMode}
                    />
                  </div>

                  {/* Documento de políticas del SGSI (PDF) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Documento de políticas del SGSI (PDF)
                    </label>
                    
                    {!pdfUrl ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="mx-auto text-gray-400 mb-2" size={40} />
                        <p className="text-sm text-gray-600 mb-2">
                          Arrastra y suelta el archivo PDF aquí, o haz clic para seleccionar
                        </p>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload-com16-politicas"
                          disabled={viewMode}
                        />
                        {!viewMode && (
                          <label htmlFor="file-upload-com16-politicas" className="btn-primary cursor-pointer inline-block">
                            Seleccionar archivo
                          </label>
                        )}
                        <p className="text-xs text-gray-500 mt-2">Tamaño máximo: 10 MB</p>
                      </div>
                    ) : (
                      <div className="border border-gray-300 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="text-primary" size={24} />
                            <span className="text-sm font-medium text-gray-700">
                              {formData.documentoFile ? formData.documentoFile.name : 'Documento de políticas cargado'}
                            </span>
                          </div>
                          {!viewMode && (
                            <button
                              onClick={removeFile}
                              className="text-red-500 hover:text-red-700"
                              title="Eliminar documento"
                            >
                              <X size={20} />
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setDocumentoActualUrl(pdfUrl);
                            setShowPdfViewer(true);
                          }}
                          className="btn-secondary text-sm flex items-center gap-2"
                        >
                          <Eye size={16} />
                          Vista previa del PDF
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Suba el documento de políticas del SGSI en formato PDF (máximo 10 MB)
                    </p>
                  </div>

                  {/* Certificación / Auditoría (PDF) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Certificación / Auditoría (PDF)
                    </label>
                    
                    {!pdfUrlPaso2 ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                        <p className="text-sm text-gray-600 mb-2">
                          Suba el certificado o informe de auditoría
                        </p>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = URL.createObjectURL(file);
                              setPdfUrlPaso2(url);
                              setFormData(prev => ({ ...prev, certificadoFile: file }));
                            }
                          }}
                          className="hidden"
                          id="file-upload-com16-certificado"
                          disabled={viewMode}
                        />
                        {!viewMode && (
                          <label htmlFor="file-upload-com16-certificado" className="btn-secondary cursor-pointer inline-block text-sm">
                            Seleccionar archivo
                          </label>
                        )}
                      </div>
                    ) : (
                      <div className="border border-gray-300 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="text-green-600" size={24} />
                            <span className="text-sm font-medium text-gray-700">
                              {formData.certificadoFile ? formData.certificadoFile.name : 'Certificado cargado'}
                            </span>
                          </div>
                          {!viewMode && (
                            <button
                              onClick={() => {
                                setPdfUrlPaso2(null);
                                setFormData(prev => ({ ...prev, certificadoFile: null, rutaPdfCertificadoSgsi: '' }));
                              }}
                              className="text-red-500 hover:text-red-700"
                              title="Eliminar certificado"
                            >
                              <X size={20} />
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setDocumentoActualUrl(pdfUrlPaso2);
                            setShowPdfViewer(true);
                          }}
                          className="btn-secondary text-sm flex items-center gap-2"
                        >
                          <Eye size={16} />
                          Vista previa del PDF
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Suba el certificado o informe de auditoría en formato PDF (máximo 10 MB)
                    </p>
                  </div>

                  {/* Observaciones */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observaciones
                    </label>
                    <textarea
                      name="observacionSgsi"
                      value={formData.observacionSgsi || ''}
                      onChange={handleInputChange}
                      maxLength="255"
                      rows="2"
                      className="input-field"
                      placeholder="Observaciones adicionales..."
                      disabled={viewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.observacionSgsi?.length || 0} / 255 caracteres
                    </p>
                  </div>
                </div>
              </>
            ) : parseInt(formData.compromisoId) === 17 ? (
              // COMPROMISO 17: Plan de Transición a IPv6
              <>
                <h2 className="text-base font-semibold text-gray-800 mb-3">Paso 1: Datos del Plan de Transición a IPv6</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Responsable del plan */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Responsable del plan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="responsableIpv6"
                      value={formData.responsableIpv6 || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.responsableIpv6 ? 'border-red-500' : ''}`}
                      placeholder="Nombre completo"
                      disabled={viewMode}
                    />
                    {errores.responsableIpv6 && (
                      <p className="text-red-500 text-xs mt-1">{errores.responsableIpv6}</p>
                    )}
                  </div>

                  {/* Cargo */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cargo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cargoResponsableIpv6"
                      value={formData.cargoResponsableIpv6 || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.cargoResponsableIpv6 ? 'border-red-500' : ''}`}
                      placeholder="Ej: Coordinador de TI"
                      disabled={viewMode}
                    />
                    {errores.cargoResponsableIpv6 && (
                      <p className="text-red-500 text-xs mt-1">{errores.cargoResponsableIpv6}</p>
                    )}
                  </div>

                  {/* Correo institucional */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo institucional <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="correoIpv6"
                      value={formData.correoIpv6 || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.correoIpv6 ? 'border-red-500' : ''}`}
                      placeholder="correo@entidad.com"
                      disabled={viewMode}
                    />
                    {errores.correoIpv6 && (
                      <p className="text-red-500 text-xs mt-1">{errores.correoIpv6}</p>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="telefonoIpv6"
                      value={formData.telefonoIpv6 || ''}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Ej: 01-1234567"
                      disabled={viewMode}
                    />
                  </div>

                  {/* Estado del plan */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado del plan <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="estadoPlanIpv6"
                      value={formData.estadoPlanIpv6 || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.estadoPlanIpv6 ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    >
                      <option value="">Seleccione estado</option>
                      <option value="En formulación">En formulación</option>
                      <option value="Formulado">Formulado</option>
                      <option value="Aprobado">Aprobado</option>
                      <option value="En ejecución">En ejecución</option>
                      <option value="Completado">Completado</option>
                    </select>
                    {errores.estadoPlanIpv6 && (
                      <p className="text-red-500 text-xs mt-1">{errores.estadoPlanIpv6}</p>
                    )}
                  </div>

                  {/* Fecha de formulación */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de formulación <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fechaFormulacionIpv6"
                      value={formData.fechaFormulacionIpv6 || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.fechaFormulacionIpv6 ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    />
                    {errores.fechaFormulacionIpv6 && (
                      <p className="text-red-500 text-xs mt-1">{errores.fechaFormulacionIpv6}</p>
                    )}
                  </div>

                  {/* Fecha de aprobación */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de aprobación
                    </label>
                    <input
                      type="date"
                      name="fechaAprobacionIpv6"
                      value={formData.fechaAprobacionIpv6 || ''}
                      onChange={handleInputChange}
                      className="input-field"
                      disabled={viewMode}
                    />
                  </div>

                  {/* Fecha de inicio de ejecución */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de inicio de ejecución
                    </label>
                    <input
                      type="date"
                      name="fechaInicioIpv6"
                      value={formData.fechaInicioIpv6 || ''}
                      onChange={handleInputChange}
                      className="input-field"
                      disabled={viewMode}
                    />
                  </div>

                  {/* Fecha estimada de fin */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha estimada de fin
                    </label>
                    <input
                      type="date"
                      name="fechaFinIpv6"
                      value={formData.fechaFinIpv6 || ''}
                      onChange={handleInputChange}
                      className="input-field"
                      disabled={viewMode}
                    />
                  </div>

                  {/* Descripción general del plan */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción general del plan
                    </label>
                    <textarea
                      name="descripcionPlanIpv6"
                      value={formData.descripcionPlanIpv6 || ''}
                      onChange={handleInputChange}
                      maxLength="255"
                      rows="2"
                      className="input-field"
                      placeholder="Describa el plan de transición a IPv6..."
                      disabled={viewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.descripcionPlanIpv6?.length || 0} / 255 caracteres
                    </p>
                  </div>

                  {/* Documento de evidencia (PDF) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Documento de evidencia (PDF)
                    </label>
                    
                    {!pdfUrl ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="mx-auto text-gray-400 mb-2" size={40} />
                        <p className="text-sm text-gray-600 mb-2">
                          Arrastra y suelta el archivo PDF aquí, o haz clic para seleccionar
                        </p>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload-com17"
                          disabled={viewMode}
                        />
                        {!viewMode && (
                          <label htmlFor="file-upload-com17" className="btn-primary cursor-pointer inline-block">
                            Seleccionar archivo
                          </label>
                        )}
                        <p className="text-xs text-gray-500 mt-2">Tamaño máximo: 10 MB</p>
                      </div>
                    ) : (
                      <div className="border border-gray-300 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="text-primary" size={24} />
                            <span className="text-sm font-medium text-gray-700">
                              {formData.documentoFile ? formData.documentoFile.name : 'Documento de evidencia cargado'}
                            </span>
                          </div>
                          {!viewMode && (
                            <button
                              onClick={removeFile}
                              className="text-red-500 hover:text-red-700"
                              title="Eliminar documento"
                            >
                              <X size={20} />
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setDocumentoActualUrl(pdfUrl);
                            setShowPdfViewer(true);
                          }}
                          className="btn-secondary text-sm flex items-center gap-2"
                        >
                          <Eye size={16} />
                          Vista previa del PDF
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Suba el documento del plan en formato PDF (máximo 10 MB)
                    </p>
                  </div>

                  {/* Observaciones */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observaciones
                    </label>
                    <textarea
                      name="observacionIpv6"
                      value={formData.observacionIpv6 || ''}
                      onChange={handleInputChange}
                      maxLength="255"
                      rows="2"
                      className="input-field"
                      placeholder="Observaciones adicionales..."
                      disabled={viewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.observacionIpv6?.length || 0} / 255 caracteres
                    </p>
                  </div>
                </div>
              </>
            ) : parseInt(formData.compromisoId) === 18 ? (
              // COMPROMISO 18: Acceso al Portal de Transparencia Estándar (PTE)
              <>
                <h2 className="text-base font-semibold text-gray-800 mb-3">Paso 1: Datos del Coordinador de Accesibilidad</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Coordinador de Accesibilidad */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Coordinador de Accesibilidad <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="responsablePte"
                      value={formData.responsablePte || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.responsablePte ? 'border-red-500' : ''}`}
                      placeholder="Nombre completo"
                      disabled={viewMode}
                    />
                    {errores.responsablePte && (
                      <p className="text-red-500 text-xs mt-1">{errores.responsablePte}</p>
                    )}
                  </div>

                  {/* Cargo */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cargo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cargoResponsablePte"
                      value={formData.cargoResponsablePte || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.cargoResponsablePte ? 'border-red-500' : ''}`}
                      placeholder="Ej: Responsable de Transparencia"
                      disabled={viewMode}
                    />
                    {errores.cargoResponsablePte && (
                      <p className="text-red-500 text-xs mt-1">{errores.cargoResponsablePte}</p>
                    )}
                  </div>

                  {/* Correo institucional */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo institucional <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="correoPte"
                      value={formData.correoPte || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.correoPte ? 'border-red-500' : ''}`}
                      placeholder="correo@entidad.com"
                      disabled={viewMode}
                    />
                    {errores.correoPte && (
                      <p className="text-red-500 text-xs mt-1">{errores.correoPte}</p>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="telefonoPte"
                      value={formData.telefonoPte || ''}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Ej: 01-1234567"
                      disabled={viewMode}
                    />
                  </div>

                  {/* Nro Documento de Designación */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nro Documento de Designación <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="numeroOficioPte"
                      value={formData.numeroOficioPte || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.numeroOficioPte ? 'border-red-500' : ''}`}
                      placeholder="Ej: OFICIO-2024-001"
                      disabled={viewMode}
                    />
                    {errores.numeroOficioPte && (
                      <p className="text-red-500 text-xs mt-1">{errores.numeroOficioPte}</p>
                    )}
                  </div>

                  {/* Fecha de Comunicación */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Comunicación <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fechaSolicitudPte"
                      value={formData.fechaSolicitudPte || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.fechaSolicitudPte ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    />
                    {errores.fechaSolicitudPte && (
                      <p className="text-red-500 text-xs mt-1">{errores.fechaSolicitudPte}</p>
                    )}
                  </div>

                  {/* Enlace del Servicio y/o Plataforma Accesible */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Enlace del Servicio y/o Plataforma Accesible
                    </label>
                    <input
                      type="url"
                      name="enlacePortalPte"
                      value={formData.enlacePortalPte || ''}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="https://..."
                      disabled={viewMode}
                    />
                  </div>

                  {/* Descripción / observaciones */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción / observaciones
                    </label>
                    <textarea
                      name="observacionPte"
                      value={formData.observacionPte || ''}
                      onChange={handleInputChange}
                      maxLength="255"
                      rows="2"
                      className="input-field"
                      placeholder="Observaciones adicionales..."
                      disabled={viewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.observacionPte?.length || 0} / 255 caracteres
                    </p>
                  </div>

                  {/* Documento de evidencia (PDF) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Documento de evidencia (PDF)
                    </label>
                    
                    {!pdfUrl ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="mx-auto text-gray-400 mb-2" size={40} />
                        <p className="text-sm text-gray-600 mb-2">
                          Arrastra y suelta el archivo PDF aquí, o haz clic para seleccionar
                        </p>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload-com18"
                          disabled={viewMode}
                        />
                        {!viewMode && (
                          <label htmlFor="file-upload-com18" className="btn-primary cursor-pointer inline-block">
                            Seleccionar archivo
                          </label>
                        )}
                        <p className="text-xs text-gray-500 mt-2">Tamaño máximo: 10 MB</p>
                      </div>
                    ) : (
                      <div className="border border-gray-300 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="text-primary" size={24} />
                            <span className="text-sm font-medium text-gray-700">
                              {formData.documentoFile ? formData.documentoFile.name : 'Documento de evidencia cargado'}
                            </span>
                          </div>
                          {!viewMode && (
                            <button
                              onClick={removeFile}
                              className="text-red-500 hover:text-red-700"
                              title="Eliminar documento"
                            >
                              <X size={20} />
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setDocumentoActualUrl(pdfUrl);
                            setShowPdfViewer(true);
                          }}
                          className="btn-secondary text-sm flex items-center gap-2"
                        >
                          <Eye size={16} />
                          Vista previa del PDF
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Suba el documento de evidencia en formato PDF (máximo 10 MB)
                    </p>
                  </div>
                </div>
              </>
            ) : parseInt(formData.compromisoId) === 19 ? (
              // COMPROMISO 19: Encuesta Nacional de Gobierno Digital (ENAD)
              <>
                <h2 className="text-base font-semibold text-gray-800 mb-3">Paso 1: Datos de la Encuesta Nacional de Gobierno Digital (ENAD)</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Año de la ENAD */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Año de la ENAD <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="anioEnad"
                      value={formData.anioEnad || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.anioEnad ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    >
                      <option value="">Seleccione año</option>
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                    </select>
                    {errores.anioEnad && (
                      <p className="text-red-500 text-xs mt-1">{errores.anioEnad}</p>
                    )}
                  </div>

                  {/* Responsable del llenado */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Responsable del llenado <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="responsableEnad"
                      value={formData.responsableEnad || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.responsableEnad ? 'border-red-500' : ''}`}
                      placeholder="Nombre completo"
                      disabled={viewMode}
                    />
                    {errores.responsableEnad && (
                      <p className="text-red-500 text-xs mt-1">{errores.responsableEnad}</p>
                    )}
                  </div>

                  {/* Cargo */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cargo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cargoResponsableEnad"
                      value={formData.cargoResponsableEnad || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.cargoResponsableEnad ? 'border-red-500' : ''}`}
                      placeholder="Ej: Coordinador de Gobierno Digital"
                      disabled={viewMode}
                    />
                    {errores.cargoResponsableEnad && (
                      <p className="text-red-500 text-xs mt-1">{errores.cargoResponsableEnad}</p>
                    )}
                  </div>

                  {/* Correo institucional */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo institucional <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="correoEnad"
                      value={formData.correoEnad || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.correoEnad ? 'border-red-500' : ''}`}
                      placeholder="correo@entidad.com"
                      disabled={viewMode}
                    />
                    {errores.correoEnad && (
                      <p className="text-red-500 text-xs mt-1">{errores.correoEnad}</p>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="telefonoEnad"
                      value={formData.telefonoEnad || ''}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Ej: 01-1234567"
                      disabled={viewMode}
                    />
                  </div>

                  {/* Fecha de envío del formulario */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de envío del formulario <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fechaEnvioEnad"
                      value={formData.fechaEnvioEnad || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.fechaEnvioEnad ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    />
                    {errores.fechaEnvioEnad && (
                      <p className="text-red-500 text-xs mt-1">{errores.fechaEnvioEnad}</p>
                    )}
                  </div>

                  {/* Estado */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="estadoRespuestaEnad"
                      value={formData.estadoRespuestaEnad || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.estadoRespuestaEnad ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    >
                      <option value="">Seleccione estado</option>
                      <option value="No iniciada">No iniciada</option>
                      <option value="En proceso">En proceso</option>
                      <option value="Completada">Completada</option>
                      <option value="Enviada">Enviada</option>
                    </select>
                    {errores.estadoRespuestaEnad && (
                      <p className="text-red-500 text-xs mt-1">{errores.estadoRespuestaEnad}</p>
                    )}
                  </div>

                  {/* Enlace del formulario o portal ENAD */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Enlace del formulario o portal ENAD
                    </label>
                    <input
                      type="url"
                      name="enlaceFormularioEnad"
                      value={formData.enlaceFormularioEnad || ''}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="https://..."
                      disabled={viewMode}
                    />
                  </div>

                  {/* Observaciones */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observaciones
                    </label>
                    <textarea
                      name="observacionEnad"
                      value={formData.observacionEnad || ''}
                      onChange={handleInputChange}
                      maxLength="255"
                      rows="2"
                      className="input-field"
                      placeholder="Observaciones adicionales..."
                      disabled={viewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.observacionEnad?.length || 0} / 255 caracteres
                    </p>
                  </div>

                  {/* Documento de evidencia (PDF) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Documento de evidencia (PDF)
                    </label>
                    
                    {!pdfUrl ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="mx-auto text-gray-400 mb-2" size={40} />
                        <p className="text-sm text-gray-600 mb-2">
                          Arrastra y suelta el archivo PDF aquí, o haz clic para seleccionar
                        </p>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload-com19"
                          disabled={viewMode}
                        />
                        {!viewMode && (
                          <label htmlFor="file-upload-com19" className="btn-primary cursor-pointer inline-block">
                            Seleccionar archivo
                          </label>
                        )}
                        <p className="text-xs text-gray-500 mt-2">Tamaño máximo: 10 MB</p>
                      </div>
                    ) : (
                      <div className="border border-gray-300 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="text-primary" size={24} />
                            <span className="text-sm font-medium text-gray-700">
                              {formData.documentoFile ? formData.documentoFile.name : 'Documento de evidencia cargado'}
                            </span>
                          </div>
                          {!viewMode && (
                            <button
                              onClick={removeFile}
                              className="text-red-500 hover:text-red-700"
                              title="Eliminar documento"
                            >
                              <X size={20} />
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setDocumentoActualUrl(pdfUrl);
                            setShowPdfViewer(true);
                          }}
                          className="btn-secondary text-sm flex items-center gap-2"
                        >
                          <Eye size={16} />
                          Vista previa del PDF
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Suba el documento de evidencia en formato PDF (máximo 10 MB)
                    </p>
                  </div>
                </div>
              </>
            ) : parseInt(formData.compromisoId) === 20 ? (
              // COMPROMISO 20: Digitalización de Servicios (Facilita Perú)
              <>
                <h2 className="text-base font-semibold text-gray-800 mb-3">Paso 1: Datos Generales – Digitalización de Servicios (Facilita Perú)</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Responsable */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Responsable <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="responsableFacilita"
                      value={formData.responsableFacilita || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.responsableFacilita ? 'border-red-500' : ''}`}
                      placeholder="Nombre completo"
                      disabled={viewMode}
                    />
                    {errores.responsableFacilita && (
                      <p className="text-red-500 text-xs mt-1">{errores.responsableFacilita}</p>
                    )}
                  </div>

                  {/* Cargo */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cargo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cargoResponsableFacilita"
                      value={formData.cargoResponsableFacilita || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.cargoResponsableFacilita ? 'border-red-500' : ''}`}
                      placeholder="Ej: Coordinador de Digitalización"
                      disabled={viewMode}
                    />
                    {errores.cargoResponsableFacilita && (
                      <p className="text-red-500 text-xs mt-1">{errores.cargoResponsableFacilita}</p>
                    )}
                  </div>

                  {/* Correo institucional */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo institucional <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="correoFacilita"
                      value={formData.correoFacilita || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.correoFacilita ? 'border-red-500' : ''}`}
                      placeholder="correo@entidad.com"
                      disabled={viewMode}
                    />
                    {errores.correoFacilita && (
                      <p className="text-red-500 text-xs mt-1">{errores.correoFacilita}</p>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="telefonoFacilita"
                      value={formData.telefonoFacilita || ''}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Ej: 01-1234567"
                      disabled={viewMode}
                    />
                  </div>

                  {/* Estado de implementación */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado de implementación <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="estadoImplementacionFacilita"
                      value={formData.estadoImplementacionFacilita || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.estadoImplementacionFacilita ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    >
                      <option value="">Seleccione estado</option>
                      <option value="No iniciado">No iniciado</option>
                      <option value="En planificación">En planificación</option>
                      <option value="En implementación">En implementación</option>
                      <option value="Implementado">Implementado</option>
                    </select>
                    {errores.estadoImplementacionFacilita && (
                      <p className="text-red-500 text-xs mt-1">{errores.estadoImplementacionFacilita}</p>
                    )}
                  </div>

                  {/* Fecha de inicio del proceso */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de inicio del proceso <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fechaInicioFacilita"
                      value={formData.fechaInicioFacilita || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.fechaInicioFacilita ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    />
                    {errores.fechaInicioFacilita && (
                      <p className="text-red-500 text-xs mt-1">{errores.fechaInicioFacilita}</p>
                    )}
                  </div>

                  {/* Fecha del último avance */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha del último avance
                    </label>
                    <input
                      type="date"
                      name="fechaUltimoAvanceFacilita"
                      value={formData.fechaUltimoAvanceFacilita || ''}
                      onChange={handleInputChange}
                      className="input-field"
                      disabled={viewMode}
                    />
                  </div>

                  {/* Total de servicios digitalizados */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total de servicios digitalizados
                    </label>
                    <input
                      type="number"
                      name="totalServiciosDigitalizados"
                      value={formData.totalServiciosDigitalizados || ''}
                      onChange={handleInputChange}
                      min="0"
                      className="input-field"
                      placeholder="0"
                      disabled={viewMode}
                    />
                  </div>

                  {/* Documento de evidencia (PDF) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Documento de evidencia (PDF)
                    </label>
                    
                    {!pdfUrl ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="mx-auto text-gray-400 mb-2" size={40} />
                        <p className="text-sm text-gray-600 mb-2">
                          Arrastra y suelta el archivo PDF aquí, o haz clic para seleccionar
                        </p>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload-com20"
                          disabled={viewMode}
                        />
                        {!viewMode && (
                          <label htmlFor="file-upload-com20" className="btn-primary cursor-pointer inline-block">
                            Seleccionar archivo
                          </label>
                        )}
                        <p className="text-xs text-gray-500 mt-2">Tamaño máximo: 10 MB</p>
                      </div>
                    ) : (
                      <div className="border border-gray-300 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="text-primary" size={24} />
                            <span className="text-sm font-medium text-gray-700">
                              {formData.documentoFile ? formData.documentoFile.name : 'Documento de evidencia cargado'}
                            </span>
                          </div>
                          {!viewMode && (
                            <button
                              onClick={removeFile}
                              className="text-red-500 hover:text-red-700"
                              title="Eliminar documento"
                            >
                              <X size={20} />
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setDocumentoActualUrl(pdfUrl);
                            setShowPdfViewer(true);
                          }}
                          className="btn-secondary text-sm flex items-center gap-2"
                        >
                          <Eye size={16} />
                          Vista previa del PDF
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Suba el documento de evidencia en formato PDF (máximo 10 MB)
                    </p>
                  </div>

                  {/* Observaciones */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observaciones
                    </label>
                    <textarea
                      name="observacionFacilita"
                      value={formData.observacionFacilita || ''}
                      onChange={handleInputChange}
                      maxLength="255"
                      rows="2"
                      className="input-field"
                      placeholder="Observaciones adicionales..."
                      disabled={viewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.observacionFacilita?.length || 0} / 255 caracteres
                    </p>
                  </div>
                </div>
              </>
            ) : parseInt(formData.compromisoId) === 21 ? (
              // COMPROMISO 21: Oficial de Gobierno de Datos (OGD)
              <>
                <h2 className="text-base font-semibold text-gray-800 mb-3">Paso 1: Oficial de Gobierno de Datos (OGD)</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* DNI */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      DNI <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="dniOgd"
                      value={formData.dniOgd || ''}
                      onChange={handleInputChange}
                      maxLength="8"
                      className={`input-field ${errores.dniOgd ? 'border-red-500' : ''}`}
                      placeholder="DNI"
                      disabled={viewMode}
                    />
                    {errores.dniOgd && (
                      <p className="text-red-500 text-xs mt-1">{errores.dniOgd}</p>
                    )}
                  </div>

                  {/* Nombres */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombres <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nombreOgd"
                      value={formData.nombreOgd || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.nombreOgd ? 'border-red-500' : ''}`}
                      placeholder="Nombres"
                      disabled={viewMode}
                    />
                    {errores.nombreOgd && (
                      <p className="text-red-500 text-xs mt-1">{errores.nombreOgd}</p>
                    )}
                  </div>

                  {/* Apellido paterno */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido paterno <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="apePatOgd"
                      value={formData.apePatOgd || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.apePatOgd ? 'border-red-500' : ''}`}
                      placeholder="Apellido paterno"
                      disabled={viewMode}
                    />
                    {errores.apePatOgd && (
                      <p className="text-red-500 text-xs mt-1">{errores.apePatOgd}</p>
                    )}
                  </div>

                  {/* Apellido materno */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido materno <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="apeMatOgd"
                      value={formData.apeMatOgd || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.apeMatOgd ? 'border-red-500' : ''}`}
                      placeholder="Apellido materno"
                      disabled={viewMode}
                    />
                    {errores.apeMatOgd && (
                      <p className="text-red-500 text-xs mt-1">{errores.apeMatOgd}</p>
                    )}
                  </div>

                  {/* Cargo */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cargo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cargoOgd"
                      value={formData.cargoOgd || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.cargoOgd ? 'border-red-500' : ''}`}
                      placeholder="Cargo"
                      disabled={viewMode}
                    />
                    {errores.cargoOgd && (
                      <p className="text-red-500 text-xs mt-1">{errores.cargoOgd}</p>
                    )}
                  </div>

                  {/* Correo institucional */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo institucional <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="correoOgd"
                      value={formData.correoOgd || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.correoOgd ? 'border-red-500' : ''}`}
                      placeholder="Correo institucional"
                      disabled={viewMode}
                    />
                    {errores.correoOgd && (
                      <p className="text-red-500 text-xs mt-1">{errores.correoOgd}</p>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="text"
                      name="telefonoOgd"
                      value={formData.telefonoOgd || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.telefonoOgd ? 'border-red-500' : ''}`}
                      placeholder="Teléfono"
                      disabled={viewMode}
                    />
                    {errores.telefonoOgd && (
                      <p className="text-red-500 text-xs mt-1">{errores.telefonoOgd}</p>
                    )}
                  </div>

                  {/* Fecha de designación */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de designación <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fechaDesignacionOgd"
                      value={formData.fechaDesignacionOgd || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.fechaDesignacionOgd ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    />
                    {errores.fechaDesignacionOgd && (
                      <p className="text-red-500 text-xs mt-1">{errores.fechaDesignacionOgd}</p>
                    )}
                  </div>

                  {/* Nº de resolución / documento */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nº de resolución / documento <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="numeroResolucionOgd"
                      value={formData.numeroResolucionOgd || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.numeroResolucionOgd ? 'border-red-500' : ''}`}
                      placeholder="Nº de resolución / documento"
                      disabled={viewMode}
                    />
                    {errores.numeroResolucionOgd && (
                      <p className="text-red-500 text-xs mt-1">{errores.numeroResolucionOgd}</p>
                    )}
                  </div>

                  {/* ¿Designación comunicada a PCM (SGTD)? */}
                  <div className="">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <input
                        type="checkbox"
                        name="comunicadoPcmOgd"
                        checked={formData.comunicadoPcmOgd || false}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        disabled={viewMode}
                      />
                      ¿Designación comunicada a PCM (SGTD)?
                    </label>
                  </div>

                  {/* Observaciones */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observaciones
                    </label>
                    <textarea
                      name="observacionOgd"
                      value={formData.observacionOgd || ''}
                      onChange={handleInputChange}
                      maxLength="1000"
                      rows="3"
                      className="input-field"
                      placeholder="Observaciones..."
                      disabled={viewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.observacionOgd?.length || 0} / 1000 caracteres
                    </p>
                  </div>

                  {/* Documento de evidencia (PDF) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Documento de evidencia (PDF)
                    </label>
                    
                    {!pdfUrl ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="mx-auto text-gray-400 mb-2" size={40} />
                        <p className="text-sm text-gray-600 mb-2">
                          Arrastra y suelta el archivo PDF aquí, o haz clic para seleccionar
                        </p>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload-com21"
                          disabled={viewMode}
                        />
                        {!viewMode && (
                          <label htmlFor="file-upload-com21" className="btn-primary cursor-pointer inline-block">
                            Seleccionar archivo
                          </label>
                        )}
                        <p className="text-xs text-gray-500 mt-2">Tamaño máximo: 10 MB</p>
                      </div>
                    ) : (
                      <div className="border border-gray-300 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="text-primary" size={24} />
                            <span className="text-sm font-medium text-gray-700">
                              {formData.documentoFile ? formData.documentoFile.name : 'Documento de evidencia cargado'}
                            </span>
                          </div>
                          {!viewMode && (
                            <button
                              onClick={removeFile}
                              className="text-red-500 hover:text-red-700"
                              title="Eliminar documento"
                            >
                              <X size={20} />
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setDocumentoActualUrl(pdfUrl);
                            setShowPdfViewer(true);
                          }}
                          className="btn-secondary text-sm flex items-center gap-2"
                        >
                          <Eye size={16} />
                          Vista previa del PDF
                        </button>
                      </div>
                    )}
                    {errores.documentoFile && (
                      <p className="text-red-500 text-xs mt-1">{errores.documentoFile}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Suba el documento de evidencia en formato PDF (máximo 10 MB)
                    </p>
                  </div>
                </div>
              </>
            ) : parseInt(formData.compromisoId) !== 3 ? (
              // COMPROMISO 1 y OTROS: Datos del Líder (EXCEPTO Compromiso 3)
              <>
                <h2 className="text-base font-semibold text-gray-800 mb-3">Paso 1: Registrar Compromiso - Datos Generales del Líder</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nro. de DNI <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nroDni"
                  value={formData.nroDni}
                  onChange={handleInputChange}
                  maxLength="8"
                  className={`input-field ${errores.nroDni ? 'border-red-500' : ''}`}
                  placeholder="12345678"
                  disabled={viewMode}
                />
                {errores.nroDni && (
                  <p className="text-red-500 text-xs mt-1">{errores.nroDni}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombres <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleInputChange}
                  className={`input-field ${errores.nombres ? 'border-red-500' : ''}`}
                  placeholder="Juan Carlos"
                  disabled={viewMode}
                />
                {errores.nombres && (
                  <p className="text-red-500 text-xs mt-1">{errores.nombres}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido Paterno <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="apellidoPaterno"
                  value={formData.apellidoPaterno}
                  onChange={handleInputChange}
                  className={`input-field ${errores.apellidoPaterno ? 'border-red-500' : ''}`}
                  placeholder="García"
                  disabled={viewMode}
                />
                {errores.apellidoPaterno && (
                  <p className="text-red-500 text-xs mt-1">{errores.apellidoPaterno}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido Materno <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="apellidoMaterno"
                  value={formData.apellidoMaterno}
                  onChange={handleInputChange}
                  className={`input-field ${errores.apellidoMaterno ? 'border-red-500' : ''}`}
                  placeholder="López"
                  disabled={viewMode}
                />
                {errores.apellidoMaterno && (
                  <p className="text-red-500 text-xs mt-1">{errores.apellidoMaterno}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="correoElectronico"
                  value={formData.correoElectronico}
                  onChange={handleInputChange}
                  className={`input-field ${errores.correoElectronico ? 'border-red-500' : ''}`}
                  placeholder="ejemplo@correo.com"
                  disabled={viewMode}
                />
                {errores.correoElectronico && (
                  <p className="text-red-500 text-xs mt-1">{errores.correoElectronico}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className={`input-field ${errores.telefono ? 'border-red-500' : ''}`}
                  placeholder="999 999 999"
                  disabled={viewMode}
                />
                {errores.telefono && (
                  <p className="text-red-500 text-xs mt-1">{errores.telefono}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol <span className="text-red-500">*</span>
                </label>
                <select
                  name="rol"
                  value={formData.rol}
                  onChange={handleInputChange}
                  className={`input-field ${errores.rol ? 'border-red-500' : ''}`}
                  disabled={viewMode || loadingCatalogos}
                >
                  <option value="">
                    {loadingCatalogos ? 'Cargando roles...' : 'Seleccione un rol'}
                  </option>
                  {rolesFuncionario.map((rol, index) => (
                    <option key={index} value={rol.value} title={rol.descripcion}>
                      {rol.label}
                    </option>
                  ))}
                </select>
                {errores.rol && (
                  <p className="text-red-500 text-xs mt-1">{errores.rol}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cargo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleInputChange}
                  className={`input-field ${errores.cargo ? 'border-red-500' : ''}`}
                  placeholder="Jefe de Sistemas"
                  disabled={viewMode}
                />
                {errores.cargo && (
                  <p className="text-red-500 text-xs mt-1">{errores.cargo}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Inicio <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="fechaInicio"
                  value={formData.fechaInicio}
                  onChange={handleInputChange}
                  className={`input-field ${errores.fechaInicio ? 'border-red-500' : ''}`}
                  disabled={viewMode}
                />
                {errores.fechaInicio && (
                  <p className="text-red-500 text-xs mt-1">{errores.fechaInicio}</p>
                )}
              </div>
            </div>
            </>
            ) : null}
          </div>
        )}

        {/* Paso 2: Registrar Normativa */}
        {pasoActual === 2 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-800 mb-3">Paso 2: Registrar Normativa - Documento y Validaciones</h2>

            {/* Upload de documento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Documento Normativo (PDF) <span className="text-red-500">*</span>
              </label>
              
              {!pdfUrlPaso2 ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto text-gray-400 mb-2" size={40} />
                  <p className="text-sm text-gray-600 mb-2">
                    Arrastra y suelta el archivo PDF aquí, o haz clic para seleccionar
                  </p>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    disabled={viewMode}
                  />
                  {!viewMode && (
                    <label htmlFor="file-upload" className="btn-primary cursor-pointer inline-block">
                      Seleccionar archivo
                    </label>
                  )}
                  <p className="text-xs text-gray-500 mt-2">Tamaño máximo: 10 MB</p>
                </div>
              ) : (
                <div className="border border-gray-300 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="text-primary" size={24} />
                      <span className="text-sm font-medium text-gray-700">
                        {formData.documentoFile ? formData.documentoFile.name : 'Documento normativo cargado'}
                      </span>
                    </div>
                    {!viewMode && (
                      <button
                        onClick={removeFile}
                        className="text-red-500 hover:text-red-700"
                        title="Eliminar documento"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setDocumentoActualUrl(pdfUrlPaso2);
                      setShowPdfViewer(true);
                    }}
                    className="btn-secondary text-sm flex items-center gap-2"
                  >
                    <Eye size={16} />
                    Vista previa del PDF
                  </button>
                </div>
              )}
              {errores.documentoFile && (
                <p className="text-red-500 text-xs mt-1">{errores.documentoFile}</p>
              )}
            </div>

            {/* Criterios de Evaluación del Compromiso */}
            {compromisoSeleccionado?.criteriosEvaluacion && compromisoSeleccionado.criteriosEvaluacion.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <AlertCircle className="text-blue-600" size={20} />
                  Criterios de Evaluación
                </h3>
                {console.log('🎯 formData.criteriosEvaluados en renderizado:', formData.criteriosEvaluados)}
                <div className="space-y-3">
                  {compromisoSeleccionado.criteriosEvaluacion
                    .filter(criterio => criterio.activo)
                    .map((criterio, index) => {
                      const criterioEvaluado = (formData.criteriosEvaluados || []).find(c => Number(c.criterioId) === Number(criterio.criterioEvaluacionId));
                      console.log(`🔍 Criterio ${criterio.criterioEvaluacionId}:`, { criterioEvaluado, criterioEvaluacionId: criterio.criterioEvaluacionId, formDataCriterios: formData.criteriosEvaluados });
                      return (
                        <div key={criterio.criterioEvaluacionId}>
                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={criterioEvaluado?.cumple || false}
                              onChange={(e) => {
                                console.log(`📝 Checkbox onChange - criterioId: ${criterio.criterioEvaluacionId}, checked: ${e.target.checked}`);
                                console.log('📝 Estado actual antes:', formData.criteriosEvaluados);
                                const criteriosActualizados = (formData.criteriosEvaluados || []).filter(c => Number(c.criterioId) !== Number(criterio.criterioEvaluacionId));
                                if (e.target.checked) {
                                  criteriosActualizados.push({ criterioId: Number(criterio.criterioEvaluacionId), cumple: true });
                                }
                                console.log('📝 Nuevo estado después:', criteriosActualizados);
                                setFormData(prev => ({ ...prev, criteriosEvaluados: criteriosActualizados }));
                              }}
                              className="mt-1"
                              disabled={viewMode}
                            />
                            <span className="text-sm text-gray-700">
                              <span className="font-medium">#{index + 1}:</span> {criterio.descripcion}
                            </span>
                          </label>
                        </div>
                      );
                    })}
                </div>
                {errores.criteriosEvaluacion && (
                  <p className="text-red-500 text-sm mt-2">{errores.criteriosEvaluacion}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Paso 3: Confirmar Veracidad de Información */}
        {pasoActual === 3 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-800 mb-3">Paso 3: Confirmar Veracidad de Información</h2>

            {/* Resumen de pasos completados */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <Check className="text-green-600 flex-shrink-0" size={20} />
                <div>
                  <div className="font-semibold text-gray-800">Registrar Compromiso</div>
                  <div className="text-sm text-gray-600">La información de datos generales se encuentra registrada correctamente</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <Check className="text-green-600 flex-shrink-0" size={20} />
                <div>
                  <div className="font-semibold text-gray-800">Registrar Normativa</div>
                  <div className="text-sm text-gray-600">La información de normativa se encuentra registrada correctamente</div>
                </div>
              </div>
            </div>

            {/* Aceptaciones Requeridas */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <AlertCircle className="text-blue-600" size={20} />
                Aceptaciones Requeridas
              </h3>
              <div className="space-y-4">
                {/* Política de Privacidad */}
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="aceptaPoliticaPrivacidad"
                      checked={formData.aceptaPoliticaPrivacidad}
                      onChange={handleInputChange}
                      className="mt-1"
                      disabled={viewMode || !haVistoPolitica}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-sm text-gray-700">
                          <strong>Acepto la política y privacidad</strong> <span className="text-red-500">*</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setDocumentoActualUrl(POLITICA_PRIVACIDAD_URL);
                            setShowPdfViewer(true);
                            setHaVistoPolitica(true);
                          }}
                          className="btn-secondary text-xs py-1 px-2 flex items-center gap-1"
                        >
                          <ExternalLink size={14} />
                          Ver documento
                        </button>
                      </div>
                      {!haVistoPolitica && !formData.aceptaPoliticaPrivacidad && (
                        <p className="text-xs text-orange-600 mt-1">Debe revisar el documento antes de aceptar</p>
                      )}
                    </div>
                  </div>
                  {errores.aceptaPoliticaPrivacidad && (
                    <p className="text-red-500 text-xs ml-6">{errores.aceptaPoliticaPrivacidad}</p>
                  )}
                </div>

                {/* Declaración Jurada */}
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="aceptaDeclaracionJurada"
                      checked={formData.aceptaDeclaracionJurada}
                      onChange={handleInputChange}
                      className="mt-1"
                      disabled={viewMode || !haVistoDeclaracion}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-sm text-gray-700">
                          <strong>Acepto la declaración jurada de la veracidad de información</strong> <span className="text-red-500">*</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setDocumentoActualUrl(DECLARACION_JURADA_URL);
                            setShowPdfViewer(true);
                            setHaVistoDeclaracion(true);
                          }}
                          className="btn-secondary text-xs py-1 px-2 flex items-center gap-1"
                        >
                          <ExternalLink size={14} />
                          Ver documento
                        </button>
                      </div>
                      {!haVistoDeclaracion && !formData.aceptaDeclaracionJurada && (
                        <p className="text-xs text-orange-600 mt-1">Debe revisar el documento antes de aceptar</p>
                      )}
                    </div>
                  </div>
                  {errores.aceptaDeclaracionJurada && (
                    <p className="text-red-500 text-xs ml-6">{errores.aceptaDeclaracionJurada}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botones de navegación */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <button
            onClick={handleCancelar}
            className="btn-secondary"
            disabled={saving}
          >
            Cancelar
          </button>

          <div className="flex gap-2">
            {pasoActual > 1 && (
              <button
                onClick={handleAnterior}
                className="btn-secondary flex items-center gap-2"
                disabled={saving}
              >
                <ChevronLeft size={20} />
                Anterior
              </button>
            )}

            {pasoActual < 3 ? (
              <button
                onClick={handleSiguiente}
                className="btn-primary flex items-center gap-2"
                disabled={saving}
              >
                Siguiente
                <ChevronRight size={20} />
              </button>
            ) : (
              !viewMode && (
                <button
                  onClick={handleGuardar}
                  className="btn-primary flex items-center gap-2"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Guardar y Enviar
                    </>
                  )}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Visor de PDF */}
      {showPdfViewer && (documentoActualUrl || pdfUrl) && (
        <PDFViewer
          pdfUrl={documentoActualUrl || pdfUrl}
          onClose={() => {
            setShowPdfViewer(false);
            setDocumentoActualUrl(null);
          }}
          title={documentoActualUrl ? "Documento Legal" : "Vista Previa del Documento Normativo"}
        />
      )}

      {/* Modal para agregar/editar miembro del comité */}
      {showModalMiembro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary-600 to-primary-700 rounded-t-xl text-white">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6" />
                <div>
                  <h2 className="text-lg font-semibold">{miembroActual.miembroId ? 'Editar' : 'Nuevo'} Miembro del Comité</h2>
                  <p className="text-sm text-white/80">Gestión de miembros del comité</p>
                </div>
              </div>
              <button
                onClick={() => setShowModalMiembro(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    DNI <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={miembroActual.dni}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ''); // Solo dígitos
                    setMiembroActual({ ...miembroActual, dni: value });
                  }}
                  maxLength="8"
                  className="input-field"
                  placeholder="12345678"
                />
                {miembroActual.dni && miembroActual.dni.length !== 8 && (
                  <p className="text-xs text-red-500 mt-1">El DNI debe tener 8 dígitos</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombres <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={miembroActual.nombre}
                  onChange={(e) => setMiembroActual({ ...miembroActual, nombre: e.target.value })}
                  className="input-field"
                  placeholder="Juan Carlos"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido Paterno <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={miembroActual.apellidoPaterno}
                  onChange={(e) => setMiembroActual({ ...miembroActual, apellidoPaterno: e.target.value })}
                  className="input-field"
                  placeholder="García"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido Materno <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={miembroActual.apellidoMaterno}
                  onChange={(e) => setMiembroActual({ ...miembroActual, apellidoMaterno: e.target.value })}
                  className="input-field"
                  placeholder="López"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cargo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={miembroActual.cargo}
                  onChange={(e) => setMiembroActual({ ...miembroActual, cargo: e.target.value })}
                  className="input-field"
                  placeholder="Director de TI"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol <span className="text-red-500">*</span>
                </label>
                <select
                  value={miembroActual.rol}
                  onChange={(e) => setMiembroActual({ ...miembroActual, rol: e.target.value })}
                  className="input-field"
                  disabled={loadingCatalogos}
                >
                  <option value="">
                    {loadingCatalogos ? 'Cargando roles...' : 'Seleccionar...'}
                  </option>
                  {rolesComite.map((rol, index) => (
                    <option key={index} value={rol.value} title={rol.descripcion}>
                      {rol.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={miembroActual.email}
                  onChange={(e) => setMiembroActual({ ...miembroActual, email: e.target.value })}
                  className="input-field"
                  placeholder="ejemplo@correo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={miembroActual.telefono}
                  onChange={(e) => setMiembroActual({ ...miembroActual, telefono: e.target.value })}
                  className="input-field"
                  placeholder="987654321"
                />
              </div>
            </div>
            </div>

            {/* Footer con botones */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowModalMiembro(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  // Validar campos requeridos
                  if (!miembroActual.dni || !miembroActual.nombre || !miembroActual.apellidoPaterno || 
                      !miembroActual.apellidoMaterno || !miembroActual.cargo || !miembroActual.rol || 
                      !miembroActual.email || !miembroActual.telefono) {
                    showErrorToast('Todos los campos son obligatorios');
                    return;
                  }

                  // Validar DNI: exactamente 8 dígitos numéricos
                  if (!/^\d{8}$/.test(miembroActual.dni)) {
                    showErrorToast('El DNI debe contener exactamente 8 dígitos numéricos');
                    return;
                  }

                  // Validar DNI único en el comité (excepto si es el mismo miembro siendo editado)
                  const dniDuplicado = miembrosComite.find(
                    m => m.dni === miembroActual.dni && m.miembroId !== miembroActual.miembroId
                  );
                  if (dniDuplicado) {
                    showErrorToast('Ya existe un miembro con este DNI en el comité');
                    return;
                  }

                  // Agregar o actualizar miembro
                  const index = miembrosComite.findIndex(m => m.miembroId === miembroActual.miembroId);
                  if (index >= 0) {
                    // Actualizar existente
                    const nuevos = [...miembrosComite];
                    nuevos[index] = miembroActual;
                    setMiembrosComite(nuevos);
                    showSuccessToast('Miembro actualizado exitosamente');
                  } else {
                    // Agregar nuevo - asignar ID temporal único para evitar keys duplicadas
                    const nuevoMiembro = {
                      ...miembroActual,
                      miembroId: miembroActual.miembroId || `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                    };
                    setMiembrosComite([...miembrosComite, nuevoMiembro]);
                    showSuccessToast('Miembro agregado exitosamente');
                  }
                  
                  setShowModalMiembro(false);
                }}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
              >
                {miembroActual.miembroId ? 'Guardar Cambios' : 'Agregar Miembro'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CumplimientoNormativoDetalle;
