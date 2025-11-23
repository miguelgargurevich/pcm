import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import cumplimientoService from '../services/cumplimientoService';
import com1LiderGTDService from '../services/com1LiderGTDService';
import com2CGTDService from '../services/com2CGTDService';
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
import { compromisosService } from '../services/compromisosService';
import { getCatalogoOptions } from '../services/catalogoService';
import { showSuccessToast, showErrorToast, showConfirmToast } from '../utils/toast';
import PDFViewer from '../components/PDFViewer';
import { FileText, Upload, X, Check, AlertCircle, ChevronLeft, ChevronRight, Save, Eye, ExternalLink, Plus, Trash2, Edit2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

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
  const [com1RecordId, setCom1RecordId] = useState(null); // ID del registro en com1_liderg_td
  const [com2RecordId, setCom2RecordId] = useState(null); // ID del registro en com2_cgtd
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
  const [pdfUrl, setPdfUrl] = useState(null);
  // const [pdfUrl2, setPdfUrl2] = useState(null); // Para Com16 segundo PDF
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [documentoActualUrl, setDocumentoActualUrl] = useState(null); // URL del documento que se está viendo
  const [haVistoPolitica, setHaVistoPolitica] = useState(false);
  const [haVistoDeclaracion, setHaVistoDeclaracion] = useState(false);

  // Estados para catálogos dinámicos
  const [rolesFuncionario, setRolesFuncionario] = useState([]);
  const [rolesComite, setRolesComite] = useState([]);
  const [loadingCatalogos, setLoadingCatalogos] = useState(true);

  // URLs de los documentos en Supabase Storage
  const POLITICA_PRIVACIDAD_URL = 'https://amzwfwfhllwhjffkqxhn.supabase.co/storage/v1/object/public/cumplimiento-documentos/politicas/politica-privacidad.pdf';
  const DECLARACION_JURADA_URL = 'https://amzwfwfhllwhjffkqxhn.supabase.co/storage/v1/object/public/cumplimiento-documentos/politicas/declaracion-jurada.pdf';

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
    
    // Paso 2: Normativa
    documentoFile: null,
    criteriosEvaluados: [], // Array de { criterioId, cumple: boolean }
    
    // Paso 3: Confirmación
    aceptaPoliticaPrivacidad: false,
    aceptaDeclaracionJurada: false,
    
    // Estado
    estado: 1 // Por defecto bandeja
  });

  const [errores, setErrores] = useState({});

  // Cargar catálogos al montar el componente
  useEffect(() => {
    const loadCatalogos = async () => {
      try {
        setLoadingCatalogos(true);
        const [funcionario, comite] = await Promise.all([
          getCatalogoOptions('ROL_FUNCIONARIO'),
          getCatalogoOptions('ROL_COMITE')
        ]);
        setRolesFuncionario(funcionario);
        setRolesComite(comite);
      } catch (error) {
        console.error('Error cargando catálogos:', error);
        showErrorToast('Error al cargar catálogos de roles');
      } finally {
        setLoadingCatalogos(false);
      }
    };
    
    loadCatalogos();
  }, []);

  useEffect(() => {
    loadCompromisos();
    // Cargar datos si está editando O si es Compromiso 1-21 (que usan tablas especiales)
    if (isEdit || (['1', '2', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21'].includes(compromisoIdFromUrl) && user?.entidadId)) {
      loadCumplimiento();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  // Establecer compromiso seleccionado cuando ambos datos estén disponibles
  useEffect(() => {
    if (formData.compromisoId && _compromisos.length > 0 && !compromisoSeleccionado) {
      const compromiso = _compromisos.find(c => c.compromisoId === parseInt(formData.compromisoId));
      if (compromiso) {
        setCompromisoSeleccionado(compromiso);
      }
    }
  }, [formData.compromisoId, _compromisos, compromisoSeleccionado]);

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

  const loadCompromisos = async () => {
    try {
      const response = await compromisosService.getAll();
      if (response.isSuccess || response.IsSuccess) {
        const data = response.data || response.Data || [];
        const compromisosArray = Array.isArray(data) ? data : [];
        setCompromisos(compromisosArray);
        
        // Si viene compromisoId por URL, pre-seleccionarlo
        if (compromisoIdFromUrl) {
          const compromiso = compromisosArray.find(c => c.compromisoId === parseInt(compromisoIdFromUrl));
          if (compromiso) {
            setCompromisoSeleccionado(compromiso);
            setFormData(prev => ({ ...prev, compromisoId: compromisoIdFromUrl }));
          }
        }
        
        // Si está editando, establecer el compromiso seleccionado desde formData
        if (isEdit && formData.compromisoId) {
          const compromiso = compromisosArray.find(c => c.compromisoId === parseInt(formData.compromisoId));
          if (compromiso) {
            setCompromisoSeleccionado(compromiso);
          }
        }
      }
    } catch (error) {
      console.error('Error al cargar compromisos:', error);
      showErrorToast('Error al cargar compromisos');
    }
  };

  const loadCumplimiento = async () => {
    try {
      setLoading(true);
      
      // Si es Compromiso 1 o 2 y tenemos entidadId, usar API específica
      const compromisoId = parseInt(compromisoIdFromUrl || formData.compromisoId);
      console.log('🔍 loadCumplimiento - compromisoId:', compromisoId);
      console.log('🔍 loadCumplimiento - user:', user);
      console.log('🔍 loadCumplimiento - compromisoIdFromUrl:', compromisoIdFromUrl);
      
      // COMPROMISO 2: Comité GTD
      if (compromisoId === 2 && user?.entidadId) {
        console.log('📞 Llamando Com2CGTD.getByEntidad con:', 2, user.entidadId);
        const response = await com2CGTDService.getByEntidad(2, user.entidadId);
        console.log('📦 Respuesta de Com2 getByEntidad:', response);
        
        if (response.isSuccess) {
          const data = response.data;
          console.log('📄 Datos Com2 recibidos:', data);
          
          if (data) {
            setCom2RecordId(data.comcgtdEntId);
            
            // Cargar miembros del comité
            if (data.miembros && Array.isArray(data.miembros)) {
              console.log('👥 Miembros cargados:', data.miembros);
              setMiembrosComite(data.miembros);
            }
            
            // Parsear criterios evaluados
            let criteriosParsed = [];
            if (data.criteriosEvaluados) {
              try {
                criteriosParsed = JSON.parse(data.criteriosEvaluados);
                console.log('✅ Criterios cargados:', criteriosParsed);
              } catch (e) {
                console.error('❌ Error al parsear criterios:', e);
              }
            }
            
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
              criteriosEvaluados: criteriosParsed,
              aceptaPoliticaPrivacidad: data.checkPrivacidad || false,
              aceptaDeclaracionJurada: data.checkDdjj || false,
              estado: data.estado === 'bandeja' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            });
            
            setHaVistoPolitica(data.checkPrivacidad);
            setHaVistoDeclaracion(data.checkDdjj);
            
            // Si hay documento guardado
            if (data.urlDocPcm) {
              console.log('📄 Cargando PDF guardado desde:', data.urlDocPcm);
              setPdfUrl(data.urlDocPcm);
            }
          } else {
            // No existe registro, inicializar
            setFormData(prev => ({ ...prev, compromisoId: '2' }));
            setMiembrosComite([]);
          }
          setLoading(false);
          return;
        }
      }
      
      // COMPROMISO 4: Incorporar TD en el PEI
      if (compromisoId === 4 && user?.entidadId) {
        console.log('📞 Llamando getByEntidad con:', 4, user.entidadId);
        const response = await com4PEIService.getByEntidad(4, user.entidadId);
        console.log('📦 Respuesta de getByEntidad:', response);
        
        if (response.isSuccess) {
          const data = response.data;
          console.log('📄 Datos recibidos:', data);
          
          if (data) {
            setCom4RecordId(data.comtdpeiEntId);
            
            // Parsear criterios evaluados desde JSON
            let criteriosParsed = [];
            if (data.criteriosEvaluados) {
              try {
                criteriosParsed = JSON.parse(data.criteriosEvaluados);
                console.log('✅ Criterios cargados:', criteriosParsed);
              } catch (e) {
                console.error('❌ Error al parsear criterios:', e);
              }
            }
            
            setFormData({
              compromisoId: '4',
              anioInicio: data.anioInicioPei || '',
              anioFin: data.anioFinPei || '',
              fechaAprobacion: data.fechaAprobacionPei ? data.fechaAprobacionPei.split('T')[0] : '',
              objetivoEstrategico: data.objetivoPei || '',
              descripcionIncorporacion: data.descripcionPei || '',
              alineadoPgd: data.alineadoPgd || false,
              documentoFile: null,
              criteriosEvaluados: criteriosParsed,
              aceptaPoliticaPrivacidad: data.checkPrivacidad || false,
              aceptaDeclaracionJurada: data.checkDdjj || false,
              estado: data.estado === 'bandeja' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            });
            
            setHaVistoPolitica(data.checkPrivacidad);
            setHaVistoDeclaracion(data.checkDdjj);
            
            // Si hay documento guardado, establecer la URL para vista previa
            if (data.rutaPdfPei) {
              console.log('📄 Cargando PDF guardado desde:', data.rutaPdfPei);
              setPdfUrl(data.rutaPdfPei);
            }
          } else {
            // No existe registro, inicializar
            setFormData(prev => ({ ...prev, compromisoId: '4' }));
          }
          setLoading(false);
          return;
        }
      }
      
      // COMPROMISO 5: Estrategia Digital
      if (compromisoId === 5 && user?.entidadId) {
        console.log('📞 Llamando getByEntidad con:', 5, user.entidadId);
        const response = await com5EstrategiaDigitalService.getByEntidad(5, user.entidadId);
        console.log('📦 Respuesta de getByEntidad:', response);
        
        if (response.isSuccess) {
          const data = response.data;
          console.log('📄 Datos recibidos:', data);
          
          if (data) {
            setCom5RecordId(data.comdedEntId);
            
            // Parsear criterios evaluados desde JSON
            let criteriosParsed = [];
            if (data.criteriosEvaluados) {
              try {
                criteriosParsed = JSON.parse(data.criteriosEvaluados);
                console.log('✅ Criterios cargados:', criteriosParsed);
              } catch (e) {
                console.error('❌ Error al parsear criterios:', e);
              }
            }
            
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
              criteriosEvaluados: criteriosParsed,
              aceptaPoliticaPrivacidad: data.checkPrivacidad || false,
              aceptaDeclaracionJurada: data.checkDdjj || false,
              estado: data.estado === 'bandeja' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            });
            
            setHaVistoPolitica(data.checkPrivacidad);
            setHaVistoDeclaracion(data.checkDdjj);
            
            // Si hay documento guardado, establecer la URL para vista previa
            if (data.rutaPdfEstrategia) {
              console.log('📄 Cargando PDF guardado desde:', data.rutaPdfEstrategia);
              setPdfUrl(data.rutaPdfEstrategia);
            }
          } else {
            // No existe registro, inicializar
            setFormData(prev => ({ ...prev, compromisoId: '5' }));
          }
          setLoading(false);
          return;
        }
      }
      
      // COMPROMISO 6: Migración GOB.PE
      if (compromisoId === 6 && user?.entidadId) {
        console.log('📞 Llamando getByEntidad con:', 6, user.entidadId);
        const response = await com6MigracionGobPeService.getByEntidad(6, user.entidadId);
        console.log('📦 Respuesta de getByEntidad:', response);
        
        if (response.isSuccess) {
          const data = response.data;
          console.log('📄 Datos recibidos:', data);
          
          if (data) {
            setCom6RecordId(data.commpgobpeEntId);
            
            // Parsear criterios evaluados desde JSON
            let criteriosParsed = [];
            if (data.criteriosEvaluados) {
              try {
                criteriosParsed = JSON.parse(data.criteriosEvaluados);
                console.log('✅ Criterios cargados:', criteriosParsed);
              } catch (e) {
                console.error('❌ Error al parsear criterios:', e);
              }
            }
            
            setFormData({
              compromisoId: '6',
              urlPortalGobPe: data.urlGobpe || '',
              fechaMigracion: data.fechaMigracionGobpe ? data.fechaMigracionGobpe.split('T')[0] : '',
              fechaUltimaActualizacion: data.fechaActualizacionGobpe ? data.fechaActualizacionGobpe.split('T')[0] : '',
              nombreResponsable: data.responsableGobpe || '',
              correoResponsable: data.correoResponsableGobpe || '',
              telefonoResponsable: data.telefonoResponsableGobpe || '',
              tipoMigracion: data.tipoMigracionGobpe || '',
              observacionesMigracion: data.observacionGobpe || '',
              documentoFile: null,
              criteriosEvaluados: criteriosParsed,
              aceptaPoliticaPrivacidad: data.checkPrivacidad || false,
              aceptaDeclaracionJurada: data.checkDdjj || false,
              estado: data.estado === 'bandeja' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            });
            
            setHaVistoPolitica(data.checkPrivacidad);
            setHaVistoDeclaracion(data.checkDdjj);
            
            // Si hay documento guardado, establecer la URL para vista previa
            if (data.rutaPdfGobpe) {
              console.log('📄 Cargando PDF guardado desde:', data.rutaPdfGobpe);
              setPdfUrl(data.rutaPdfGobpe);
            }
          } else {
            // No existe registro, inicializar
            setFormData(prev => ({ ...prev, compromisoId: '6' }));
          }
          setLoading(false);
          return;
        }
      }
      
      // COMPROMISO 7: Implementación MPD
      if (compromisoId === 7 && user?.entidadId) {
        console.log('📞 Llamando getByEntidad con:', 7, user.entidadId);
        const response = await com7ImplementacionMPDService.getByEntidad(7, user.entidadId);
        console.log('📦 Respuesta de getByEntidad:', response);
        
        if (response.isSuccess) {
          const data = response.data;
          console.log('📄 Datos recibidos:', data);
          
          if (data) {
            setCom7RecordId(data.comimpdEntId);
            
            // Parsear criterios evaluados desde JSON
            let criteriosParsed = [];
            if (data.criteriosEvaluados) {
              try {
                criteriosParsed = JSON.parse(data.criteriosEvaluados);
                console.log('✅ Criterios cargados:', criteriosParsed);
              } catch (e) {
                console.error('❌ Error al parsear criterios:', e);
              }
            }
            
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
              observacionesMpd: data.observacionMpd || '',
              documentoFile: null,
              criteriosEvaluados: criteriosParsed,
              aceptaPoliticaPrivacidad: data.checkPrivacidad || false,
              aceptaDeclaracionJurada: data.checkDdjj || false,
              estado: data.estado === 'bandeja' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            });
            
            setHaVistoPolitica(data.checkPrivacidad);
            setHaVistoDeclaracion(data.checkDdjj);
            
            // Si hay documento guardado, establecer la URL para vista previa
            if (data.rutaPdfMpd) {
              console.log('📄 Cargando PDF guardado desde:', data.rutaPdfMpd);
              setPdfUrl(data.rutaPdfMpd);
            }
          } else {
            // No existe registro, inicializar
            setFormData(prev => ({ ...prev, compromisoId: '7' }));
          }
          setLoading(false);
          return;
        }
      }
      
      // COMPROMISO 8: Publicación TUPA
      if (compromisoId === 8 && user?.entidadId) {
        console.log('📞 Llamando getByEntidad con:', 8, user.entidadId);
        const response = await com8PublicacionTUPAService.getByEntidad(8, user.entidadId);
        console.log('📦 Respuesta de getByEntidad:', response);
        
        if (response.isSuccess) {
          const data = response.data;
          console.log('📄 Datos recibidos:', data);
          
          if (data) {
            setCom8RecordId(data.comptupaEntId);
            
            // Parsear criterios evaluados desde JSON
            let criteriosParsed = [];
            if (data.criteriosEvaluados) {
              try {
                criteriosParsed = JSON.parse(data.criteriosEvaluados);
                console.log('✅ Criterios cargados:', criteriosParsed);
              } catch (e) {
                console.error('❌ Error al parsear criterios:', e);
              }
            }
            
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
              criteriosEvaluados: criteriosParsed,
              aceptaPoliticaPrivacidad: data.checkPrivacidad || false,
              aceptaDeclaracionJurada: data.checkDdjj || false,
              estado: data.estado === 'bandeja' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            });
            
            setHaVistoPolitica(data.checkPrivacidad);
            setHaVistoDeclaracion(data.checkDdjj);
            
            // Si hay documento guardado, establecer la URL para vista previa
            if (data.rutaPdfTupa) {
              console.log('📄 Cargando PDF guardado desde:', data.rutaPdfTupa);
              setPdfUrl(data.rutaPdfTupa);
            }
          } else {
            // No existe registro, inicializar
            setFormData(prev => ({ ...prev, compromisoId: '8' }));
          }
          setLoading(false);
          return;
        }
      }
      
      // COMPROMISO 9: Modelo de Gestión Documental
      if (compromisoId === 9 && user?.entidadId) {
        console.log('📞 Llamando getByEntidad con:', 9, user.entidadId);
        const response = await com9ModeloGestionDocumentalService.getByEntidad(9, user.entidadId);
        console.log('📦 Respuesta de getByEntidad:', response);
        
        if (response.isSuccess) {
          const data = response.data;
          console.log('📄 Datos recibidos:', data);
          
          if (data) {
            setCom9RecordId(data.commgdEntId);
            
            // Parsear criterios evaluados desde JSON
            let criteriosParsed = [];
            if (data.criteriosEvaluados) {
              try {
                criteriosParsed = JSON.parse(data.criteriosEvaluados);
                console.log('✅ Criterios cargados:', criteriosParsed);
              } catch (e) {
                console.error('❌ Error al parsear criterios:', e);
              }
            }
            
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
              criteriosEvaluados: criteriosParsed,
              aceptaPoliticaPrivacidad: data.checkPrivacidad || false,
              aceptaDeclaracionJurada: data.checkDdjj || false,
              estado: data.estado === 'bandeja' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            });
            
            setHaVistoPolitica(data.checkPrivacidad);
            setHaVistoDeclaracion(data.checkDdjj);
            
            // Si hay documento guardado, establecer la URL para vista previa
            if (data.rutaPdfMgd) {
              console.log('📄 Cargando PDF guardado desde:', data.rutaPdfMgd);
              setPdfUrl(data.rutaPdfMgd);
            }
          } else {
            // No existe registro, inicializar
            setFormData(prev => ({ ...prev, compromisoId: '9' }));
          }
          setLoading(false);
          return;
        }
      }
      
      // COMPROMISO 10: Datos Abiertos
      if (compromisoId === 10 && user?.entidadId) {
        console.log('📞 Llamando getByEntidad con:', 10, user.entidadId);
        const response = await com10DatosAbiertosService.getByEntidad(10, user.entidadId);
        console.log('📦 Respuesta de getByEntidad:', response);
        
        if (response.isSuccess) {
          const data = response.data;
          console.log('📄 Datos recibidos:', data);
          
          if (data) {
            setCom10RecordId(data.comdaEntId);
            
            // Parsear criterios evaluados desde JSON
            let criteriosParsed = [];
            if (data.criteriosEvaluados) {
              try {
                criteriosParsed = JSON.parse(data.criteriosEvaluados);
                console.log('✅ Criterios cargados:', criteriosParsed);
              } catch (e) {
                console.error('❌ Error al parsear criterios:', e);
              }
            }
            
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
              criteriosEvaluados: criteriosParsed,
              aceptaPoliticaPrivacidad: data.checkPrivacidad || false,
              aceptaDeclaracionJurada: data.checkDdjj || false,
              estado: data.estado === 'bandeja' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            });
            
            setHaVistoPolitica(data.checkPrivacidad);
            setHaVistoDeclaracion(data.checkDdjj);
            
            // Si hay documento guardado, establecer la URL para vista previa
            if (data.rutaPdfDa) {
              console.log('📄 Cargando PDF guardado desde:', data.rutaPdfDa);
              setPdfUrl(data.rutaPdfDa);
            }
          } else {
            // No existe registro, inicializar
            setFormData(prev => ({ ...prev, compromisoId: '10' }));
          }
          setLoading(false);
          return;
        }
      }
      
      // COMPROMISO 11: AportacionGeoPeru
      if (compromisoId === 11 && user?.entidadId) {
        console.log('📞 Llamando getByEntidad con:', 11, user.entidadId);
        const response = await com11AportacionGeoPeruService.getByEntidad(11, user.entidadId);
        console.log('📦 Respuesta de getByEntidad:', response);
        
        if (response.isSuccess) {
          const data = response.data;
          console.log('📄 Datos recibidos:', data);
          
          if (data) {
            setCom11RecordId(data.comageopEntId);
            
            setFormData({
              compromisoId: '11',
              fechaInicio: data.fechaInicio ? data.fechaInicio.split('T')[0] : '',
              fechaFin: data.fechaFin ? data.fechaFin.split('T')[0] : '',
              serviciosDigitalizados: data.serviciosDigitalizados || '',
              serviciosTotal: data.serviciosTotal || '',
              porcentajeDigitalizacion: data.porcentajeDigitalizacion || '',
              archivoPlan: data.archivoPlan || '',
              descripcion: data.descripcion || '',
              beneficiariosEstimados: data.beneficiariosEstimados || '',
              aceptaPoliticaPrivacidad: data.checkPrivacidad || false,
              aceptaDeclaracionJurada: data.checkDdjj || false,
              estado: data.estado === 'bandeja' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            });
            
            setHaVistoPolitica(data.checkPrivacidad);
            setHaVistoDeclaracion(data.checkDdjj);
            
            // Si hay archivo de plan guardado, establecer la URL para vista previa
            if (data.archivoPlan) {
              console.log('📄 Cargando archivo plan guardado desde:', data.archivoPlan);
              setPdfUrl(data.archivoPlan);
            }
          } else {
            // No existe registro, inicializar
            setFormData(prev => ({ ...prev, compromisoId: '11' }));
          }
          setLoading(false);
          return;
        }
      }

      // COMPROMISO 12: ResponsableSoftwarePublico
      if (compromisoId === 12 && user?.entidadId) {
        console.log('📞 Llamando getByEntidad con:', 12, user.entidadId);
        const response = await com12ResponsableSoftwarePublicoService.getByEntidad(12, user.entidadId);
        console.log('📦 Respuesta de getByEntidad:', response);
        
        if (response.isSuccess) {
          const data = response.data;
          console.log('📄 Datos recibidos:', data);
          
          if (data) {
            setCom12RecordId(data.comdrspEntId);
            
            setFormData({
              compromisoId: '12',
              fechaElaboracion: data.fechaElaboracion ? data.fechaElaboracion.split('T')[0] : '',
              numeroDocumento: data.numeroDocumento || '',
              archivoDocumento: data.archivoDocumento || '',
              descripcion: data.descripcion || '',
              requisitosSeguridad: data.requisitosSeguridad || '',
              requisitosPrivacidad: data.requisitosPrivacidad || '',
              fechaVigencia: data.fechaVigencia ? data.fechaVigencia.split('T')[0] : '',
              aceptaPoliticaPrivacidad: data.checkPrivacidad || false,
              aceptaDeclaracionJurada: data.checkDdjj || false,
              estado: data.estado === 'bandeja' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            });
            
            setHaVistoPolitica(data.checkPrivacidad);
            setHaVistoDeclaracion(data.checkDdjj);
            
            // Si hay documento guardado, establecer la URL para vista previa
            if (data.archivoDocumento) {
              console.log('📄 Cargando archivo documento guardado desde:', data.archivoDocumento);
              setPdfUrl(data.archivoDocumento);
            }
          } else {
            // No existe registro, inicializar
            setFormData(prev => ({ ...prev, compromisoId: '12' }));
          }
          setLoading(false);
          return;
        }
      }

      // COMPROMISO 13: InteroperabilidadPIDE
      if (compromisoId === 13 && user?.entidadId) {
        console.log('📞 Llamando getByEntidad con:', 13, user.entidadId);
        const response = await com13InteroperabilidadPIDEService.getByEntidad(13, user.entidadId);
        console.log('📦 Respuesta de getByEntidad:', response);
        
        if (response.isSuccess) {
          const data = response.data;
          console.log('📄 Datos recibidos:', data);
          
          if (data) {
            setCom13RecordId(data.compcpideEntId);
            
            setFormData({
              compromisoId: '13',
              fechaAprobacion: data.fechaAprobacion ? data.fechaAprobacion.split('T')[0] : '',
              numeroResolucion: data.numeroResolucion || '',
              archivoPlan: data.archivoPlan || '',
              descripcion: data.descripcion || '',
              riesgosIdentificados: data.riesgosIdentificados || '',
              estrategiasMitigacion: data.estrategiasMitigacion || '',
              fechaRevision: data.fechaRevision ? data.fechaRevision.split('T')[0] : '',
              responsable: data.responsable || '',
              aceptaPoliticaPrivacidad: data.checkPrivacidad || false,
              aceptaDeclaracionJurada: data.checkDdjj || false,
              estado: data.estado === 'bandeja' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            });
            
            setHaVistoPolitica(data.checkPrivacidad);
            setHaVistoDeclaracion(data.checkDdjj);
            
            // Si hay documento guardado, establecer la URL para vista previa
            if (data.archivoPlan) {
              console.log('📄 Cargando archivo plan guardado desde:', data.archivoPlan);
              setPdfUrl(data.archivoPlan);
            }
          } else {
            // No existe registro, inicializar
            setFormData(prev => ({ ...prev, compromisoId: '13' }));
          }
          setLoading(false);
          return;
        }
      }

      // COMPROMISO 14: OficialSeguridadDigital
      if (compromisoId === 14 && user?.entidadId) {
        console.log('📞 Llamando getByEntidad con:', 14, user.entidadId);
        const response = await com14OficialSeguridadDigitalService.getByEntidad(14, user.entidadId);
        console.log('📦 Respuesta de getByEntidad:', response);
        
        if (response.isSuccess) {
          const data = response.data;
          console.log('📄 Datos recibidos:', data);
          
          if (data) {
            setCom14RecordId(data.comdoscdEntId);
            
            setFormData({
              compromisoId: '14',
              fechaElaboracion: data.fechaElaboracion ? data.fechaElaboracion.split('T')[0] : '',
              numeroDocumento: data.numeroDocumento || '',
              archivoDocumento: data.archivoDocumento || '',
              descripcion: data.descripcion || '',
              politicasSeguridad: data.politicasSeguridad || '',
              certificaciones: data.certificaciones || '',
              fechaVigencia: data.fechaVigencia ? data.fechaVigencia.split('T')[0] : '',
              aceptaPoliticaPrivacidad: data.checkPrivacidad || false,
              aceptaDeclaracionJurada: data.checkDdjj || false,
              estado: data.estado === 'bandeja' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            });
            
            setHaVistoPolitica(data.checkPrivacidad);
            setHaVistoDeclaracion(data.checkDdjj);
            
            // Si hay documento guardado, establecer la URL para vista previa
            if (data.archivoDocumento) {
              console.log('📄 Cargando archivo documento guardado desde:', data.archivoDocumento);
              setPdfUrl(data.archivoDocumento);
            }
          } else {
            // No existe registro, inicializar
            setFormData(prev => ({ ...prev, compromisoId: '14' }));
          }
          setLoading(false);
          return;
        }
      }

      // COMPROMISO 15: CSIRTInstitucional
      if (compromisoId === 15 && user?.entidadId) {
        console.log('📞 Llamando getByEntidad con:', 15, user.entidadId);
        const response = await com15CSIRTInstitucionalService.getByEntidad(15, user.entidadId);
        console.log('📦 Respuesta de getByEntidad:', response);
        
        if (response.isSuccess) {
          const data = response.data;
          console.log('📄 Datos recibidos:', data);
          
          if (data) {
            setCom15RecordId(data.comcsirtEntId);
            
            // Parsear criterios evaluados desde JSON
            let criteriosParsed = [];
            if (data.criteriosEvaluados) {
              try {
                criteriosParsed = JSON.parse(data.criteriosEvaluados);
                console.log('✅ Criterios cargados:', criteriosParsed);
              } catch (e) {
                console.error('❌ Error al parsear criterios:', e);
              }
            }
            
            setFormData({
              compromisoId: '15',
              fechaConformacion: data.fechaConformacion ? data.fechaConformacion.split('T')[0] : '',
              numeroResolucion: data.numeroResolucion || '',
              responsable: data.responsable || '',
              emailContacto: data.emailContacto || '',
              telefonoContacto: data.telefonoContacto || '',
              descripcion: data.descripcion || '',
              aceptaPoliticaPrivacidad: data.checkPrivacidad || false,
              aceptaDeclaracionJurada: data.checkDdjj || false,
              estado: data.estado === 'bandeja' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            });
            
            setHaVistoPolitica(data.checkPrivacidad);
            setHaVistoDeclaracion(data.checkDdjj);
          } else {
            // No existe registro, inicializar
            setFormData(prev => ({ ...prev, compromisoId: '15' }));
          }
          setLoading(false);
          return;
        }
      }

      // COMPROMISO 16: SistemaGestionSeguridad
      if (compromisoId === 16 && user?.entidadId) {
        console.log('📞 Llamando getByEntidad con:', 16, user.entidadId);
        const response = await com16SistemaGestionSeguridadService.getByEntidad(16, user.entidadId);
        console.log('📦 Respuesta de getByEntidad:', response);
        
        if (response.isSuccess) {
          const data = response.data;
          console.log('📄 Datos recibidos:', data);
          
          if (data) {
            setCom16RecordId(data.comsgsiEntId);
            
            // Parsear criterios evaluados desde JSON
            let criteriosParsed = [];
            if (data.criteriosEvaluados) {
              try {
                criteriosParsed = JSON.parse(data.criteriosEvaluados);
                console.log('✅ Criterios cargados:', criteriosParsed);
              } catch (e) {
                console.error('❌ Error al parsear criterios:', e);
              }
            }
            
            setFormData({
              compromisoId: '16',
              fechaImplementacion: data.fechaImplementacion ? data.fechaImplementacion.split('T')[0] : '',
              normaAplicable: data.normaAplicable || '',
              certificacion: data.certificacion || '',
              fechaCertificacion: data.fechaCertificacion ? data.fechaCertificacion.split('T')[0] : '',
              descripcion: data.descripcion || '',
              alcance: data.alcance || '',
              aceptaPoliticaPrivacidad: data.checkPrivacidad || false,
              aceptaDeclaracionJurada: data.checkDdjj || false,
              estado: data.estado === 'bandeja' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            });
            
            setHaVistoPolitica(data.checkPrivacidad);
            setHaVistoDeclaracion(data.checkDdjj);
          } else {
            // No existe registro, inicializar
            setFormData(prev => ({ ...prev, compromisoId: '16' }));
          }
          setLoading(false);
          return;
        }
      }

      // COMPROMISO 17: PlanTransicionIPv6
      if (compromisoId === 17 && user?.entidadId) {
        console.log('📞 Llamando getByEntidad con:', 17, user.entidadId);
        const response = await com17PlanTransicionIPv6Service.getByEntidad(17, user.entidadId);
        console.log('📦 Respuesta de getByEntidad:', response);
        
        if (response.isSuccess) {
          const data = response.data;
          console.log('📄 Datos recibidos:', data);
          
          if (data) {
            setCom17RecordId(data.comptipv6EntId);
            
            // Parsear criterios evaluados desde JSON
            let criteriosParsed = [];
            if (data.criteriosEvaluados) {
              try {
                criteriosParsed = JSON.parse(data.criteriosEvaluados);
                console.log('✅ Criterios cargados:', criteriosParsed);
              } catch (e) {
                console.error('❌ Error al parsear criterios:', e);
              }
            }
            
            setFormData({
              compromisoId: '17',
              fechaInicioTransicion: data.fechaInicioTransicion ? data.fechaInicioTransicion.split('T')[0] : '',
              fechaFinTransicion: data.fechaFinTransicion ? data.fechaFinTransicion.split('T')[0] : '',
              porcentajeAvance: data.porcentajeAvance || '',
              sistemasMigrados: data.sistemasMigrados || '',
              sistemasTotal: data.sistemasTotal || '',
              descripcion: data.descripcion || '',
              aceptaPoliticaPrivacidad: data.checkPrivacidad || false,
              aceptaDeclaracionJurada: data.checkDdjj || false,
              estado: data.estado === 'bandeja' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            });
            
            setHaVistoPolitica(data.checkPrivacidad);
            setHaVistoDeclaracion(data.checkDdjj);
            
            // Si hay documento guardado, establecer la URL para vista previa
            if (data.rutaPdfPtipv6) {
              console.log('📄 Cargando PDF guardado desde:', data.rutaPdfPtipv6);
              setPdfUrl(data.rutaPdfPtipv6);
            }
          } else {
            // No existe registro, inicializar
            setFormData(prev => ({ ...prev, compromisoId: '17' }));
          }
          setLoading(false);
          return;
        }
      }

      // COMPROMISO 18: AccesoPortalTransparencia
      if (compromisoId === 18 && user?.entidadId) {
        console.log('📞 Llamando getByEntidad con:', 18, user.entidadId);
        const response = await com18AccesoPortalTransparenciaService.getByEntidad(18, user.entidadId);
        console.log('📦 Respuesta de getByEntidad:', response);
        
        if (response.isSuccess) {
          const data = response.data;
          console.log('📄 Datos recibidos:', data);
          
          if (data) {
            setCom18RecordId(data.comapteEntId);
            
            // Parsear criterios evaluados desde JSON
            let criteriosParsed = [];
            if (data.criteriosEvaluados) {
              try {
                criteriosParsed = JSON.parse(data.criteriosEvaluados);
                console.log('✅ Criterios cargados:', criteriosParsed);
              } catch (e) {
                console.error('❌ Error al parsear criterios:', e);
              }
            }
            
            setFormData({
              compromisoId: '18',
              urlPlataforma: data.urlPlataforma || '',
              fechaImplementacion: data.fechaImplementacion ? data.fechaImplementacion.split('T')[0] : '',
              tramitesDisponibles: data.tramitesDisponibles || '',
              usuariosRegistrados: data.usuariosRegistrados || '',
              tramitesProcesados: data.tramitesProcesados || '',
              descripcion: data.descripcion || '',
              aceptaPoliticaPrivacidad: data.checkPrivacidad || false,
              aceptaDeclaracionJurada: data.checkDdjj || false,
              estado: data.estado === 'bandeja' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            });
            
            setHaVistoPolitica(data.checkPrivacidad);
            setHaVistoDeclaracion(data.checkDdjj);
            
            // Si hay documento guardado, establecer la URL para vista previa
            if (data.rutaPdfApte) {
              console.log('📄 Cargando PDF guardado desde:', data.rutaPdfApte);
              setPdfUrl(data.rutaPdfApte);
            }
          } else {
            // No existe registro, inicializar
            setFormData(prev => ({ ...prev, compromisoId: '18' }));
          }
          setLoading(false);
          return;
        }
      }

      // COMPROMISO 19: EncuestaNacionalGobDigital
      if (compromisoId === 19 && user?.entidadId) {
        console.log('📞 Llamando getByEntidad con:', 19, user.entidadId);
        const response = await com19EncuestaNacionalGobDigitalService.getByEntidad(19, user.entidadId);
        console.log('📦 Respuesta de getByEntidad:', response);
        
        if (response.isSuccess) {
          const data = response.data;
          console.log('📄 Datos recibidos:', data);
          
          if (data) {
            setCom19RecordId(data.comenadEntId);
            
            // Parsear criterios evaluados desde JSON
            let criteriosParsed = [];
            if (data.criteriosEvaluados) {
              try {
                criteriosParsed = JSON.parse(data.criteriosEvaluados);
                console.log('✅ Criterios cargados:', criteriosParsed);
              } catch (e) {
                console.error('❌ Error al parsear criterios:', e);
              }
            }
            
            setFormData({
              compromisoId: '19',
              fechaConexion: data.fechaConexion ? data.fechaConexion.split('T')[0] : '',
              tipoConexion: data.tipoConexion || '',
              anchoBanda: data.anchoBanda || '',
              proveedor: data.proveedor || '',
              descripcion: data.descripcion || '',
              aceptaPoliticaPrivacidad: data.checkPrivacidad || false,
              aceptaDeclaracionJurada: data.checkDdjj || false,
              estado: data.estado === 'bandeja' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            });
            
            setHaVistoPolitica(data.checkPrivacidad);
            setHaVistoDeclaracion(data.checkDdjj);
            
            // Si hay documento guardado, establecer la URL para vista previa
            if (data.rutaPdfEnad) {
              console.log('📄 Cargando PDF guardado desde:', data.rutaPdfEnad);
              setPdfUrl(data.rutaPdfEnad);
            }
          } else {
            // No existe registro, inicializar
            setFormData(prev => ({ ...prev, compromisoId: '19' }));
          }
          setLoading(false);
          return;
        }
      }

      // COMPROMISO 20: DigitalizacionServiciosFacilita
      if (compromisoId === 20 && user?.entidadId) {
        console.log('📞 Llamando getByEntidad con:', 20, user.entidadId);
        const response = await com20DigitalizacionServiciosFacilitaService.getByEntidad(20, user.entidadId);
        console.log('📦 Respuesta de getByEntidad:', response);
        
        if (response.isSuccess) {
          const data = response.data;
          console.log('📄 Datos recibidos:', data);
          
          if (data) {
            setCom20RecordId(data.comdsfpEntId);
            
            // Parsear criterios evaluados desde JSON
            let criteriosParsed = [];
            if (data.criteriosEvaluados) {
              try {
                criteriosParsed = JSON.parse(data.criteriosEvaluados);
                console.log('✅ Criterios cargados:', criteriosParsed);
              } catch (e) {
                console.error('❌ Error al parsear criterios:', e);
              }
            }
            
            setFormData({
              compromisoId: '20',
              sistemasDocumentados: data.sistemasDocumentados || '',
              sistemasTotal: data.sistemasTotal || '',
              porcentajeDocumentacion: data.porcentajeDocumentacion || '',
              descripcion: data.descripcion || '',
              aceptaPoliticaPrivacidad: data.checkPrivacidad || false,
              aceptaDeclaracionJurada: data.checkDdjj || false,
              estado: data.estado === 'bandeja' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            });
            
            setHaVistoPolitica(data.checkPrivacidad);
            setHaVistoDeclaracion(data.checkDdjj);
            
            // Si hay documento guardado, establecer la URL para vista previa
            if (data.rutaPdfDsfp) {
              console.log('📄 Cargando PDF guardado desde:', data.rutaPdfDsfp);
              setPdfUrl(data.rutaPdfDsfp);
            }
          } else {
            // No existe registro, inicializar
            setFormData(prev => ({ ...prev, compromisoId: '20' }));
          }
          setLoading(false);
          return;
        }
      }

      // COMPROMISO 21: OficialGobiernoDatos
      if (compromisoId === 21 && user?.entidadId) {
        console.log('📞 Llamando getByEntidad con:', 21, user.entidadId);
        const response = await com21OficialGobiernoDatosService.getByEntidad(21, user.entidadId);
        console.log('📦 Respuesta de getByEntidad:', response);
        
        if (response.isSuccess) {
          const data = response.data;
          console.log('📄 Datos recibidos:', data);
          
          if (data) {
            setCom21RecordId(data.comogdEntId);
            
            // Parsear criterios evaluados desde JSON
            let criteriosParsed = [];
            if (data.criteriosEvaluados) {
              try {
                criteriosParsed = JSON.parse(data.criteriosEvaluados);
                console.log('✅ Criterios cargados:', criteriosParsed);
              } catch (e) {
                console.error('❌ Error al parsear criterios:', e);
              }
            }
            
            setFormData({
              compromisoId: '21',
              fechaElaboracion: data.fechaElaboracion ? data.fechaElaboracion.split('T')[0] : '',
              numeroDocumento: data.numeroDocumento || '',
              descripcion: data.descripcion || '',
              procedimientos: data.procedimientos || '',
              responsables: data.responsables || '',
              fechaVigencia: data.fechaVigencia ? data.fechaVigencia.split('T')[0] : '',
              aceptaPoliticaPrivacidad: data.checkPrivacidad || false,
              aceptaDeclaracionJurada: data.checkDdjj || false,
              estado: data.estado === 'bandeja' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            });
            
            setHaVistoPolitica(data.checkPrivacidad);
            setHaVistoDeclaracion(data.checkDdjj);
            
            // Si hay documento guardado, establecer la URL para vista previa
            if (data.rutaPdfOgd) {
              console.log('📄 Cargando PDF guardado desde:', data.rutaPdfOgd);
              setPdfUrl(data.rutaPdfOgd);
            }
          } else {
            // No existe registro, inicializar
            setFormData(prev => ({ ...prev, compromisoId: '21' }));
          }
          setLoading(false);
          return;
        }
      }
      
      // COMPROMISO 1: Líder GTD
      if (compromisoId === 1 && user?.entidadId) {
        console.log('📞 Llamando getByEntidad con:', 1, user.entidadId);
        const response = await com1LiderGTDService.getByEntidad(1, user.entidadId);
        console.log('📦 Respuesta de getByEntidad:', response);
        
        if (response.isSuccess) {
          const data = response.data;
          console.log('📄 Datos recibidos:', data);
          
          if (data) {
            // Mapear campos de Com1 a formData
            setCom1RecordId(data.comlgtdEntId);
            
            // Parsear criterios evaluados desde JSON
            let criteriosParsed = [];
            if (data.criteriosEvaluados) {
              try {
                criteriosParsed = JSON.parse(data.criteriosEvaluados);
                console.log('✅ Criterios cargados:', criteriosParsed);
              } catch (e) {
                console.error('❌ Error al parsear criterios:', e);
              }
            }
            
            setFormData({
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
              criteriosEvaluados: criteriosParsed,
              aceptaPoliticaPrivacidad: data.checkPrivacidad || false,
              aceptaDeclaracionJurada: data.checkDdjj || false,
              estado: data.estado === 'bandeja' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            });
            
            setHaVistoPolitica(data.checkPrivacidad);
            setHaVistoDeclaracion(data.checkDdjj);
            
            // Si hay documento guardado, establecer la URL para vista previa
            if (data.urlDocPcm) {
              console.log('📄 Cargando PDF guardado desde:', data.urlDocPcm);
              setPdfUrl(data.urlDocPcm);
            }
          } else {
            // No existe registro, inicializar con valores predeterminados
            setFormData(prev => ({ ...prev, compromisoId: '1' }));
          }
          setLoading(false);
          return;
        }
      }
      
      // Si llegamos aquí sin ID, significa que es un compromiso especial sin registro aún
      if (!id) {
        console.log('⚠️ No hay ID para cargar, es un nuevo registro');
        setLoading(false);
        return;
      }
      
      // Caso genérico para otros compromisos (que usan cumplimiento_normativo)
      const response = await cumplimientoService.getById(id);
      
      if (response.isSuccess || response.IsSuccess) {
        const data = response.data || response.Data;
        const compromisoIdValue = data.compromisoId || '';
        
        setFormData({
          compromisoId: compromisoIdValue,
          nroDni: data.nroDni || '',
          nombres: data.nombres || '',
          apellidoPaterno: data.apellidoPaterno || '',
          apellidoMaterno: data.apellidoMaterno || '',
          correoElectronico: data.correoElectronico || '',
          telefono: data.telefono || '',
          rol: data.rol || '',
          cargo: data.cargo || '',
          fechaInicio: data.fechaInicio ? data.fechaInicio.split('T')[0] : '',
          documentoFile: null,
          criteriosEvaluados: data.criteriosEvaluados || [],
          aceptaPoliticaPrivacidad: data.aceptaPoliticaPrivacidad || false,
          aceptaDeclaracionJurada: data.aceptaDeclaracionJurada || false,
          estado: data.estado || 1
        });

        // Si hay documento, establecer la URL
        if (data.documentoUrl) {
          setPdfUrl(data.documentoUrl);
        }
      } else {
        showErrorToast(response.message || 'Error al cargar el cumplimiento');
        navigate('/dashboard/cumplimiento');
      }
    } catch (error) {
      console.error('Error al cargar cumplimiento:', error);
      showErrorToast('Error al cargar los datos');
      navigate('/dashboard/cumplimiento');
    } finally {
      setLoading(false);
    }
  };

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

      // Revocar URL anterior si existe
      if (pdfUrl && pdfUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pdfUrl);
      }

      setFormData(prev => ({ ...prev, documentoFile: file }));
      
      // Vista previa del PDF
      try {
        const fileUrl = URL.createObjectURL(file);
        console.log('📄 PDF blob URL creado:', fileUrl);
        setPdfUrl(fileUrl);
      } catch (error) {
        console.error('❌ Error al crear blob URL:', error);
        showErrorToast('Error al cargar la vista previa del PDF');
      }
    }
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, documentoFile: null }));
    if (pdfUrl && pdfUrl.startsWith('blob:')) {
      URL.revokeObjectURL(pdfUrl);
    }
    setPdfUrl(null);
  };

  const validarPaso = (paso) => {
    const nuevosErrores = {};

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
        if (formData.correoResponsableMpd && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correoResponsableMpd)) {
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
        if (formData.correoResponsableTupa && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correoResponsableTupa)) {
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
      // Validación específica para Compromiso 11 (AportacionGeoPeru)
      else if (parseInt(formData.compromisoId) === 11) {
        if (!formData.fechaInicio) {
          nuevosErrores.fechaInicio = 'Seleccione la fecha de inicio';
        }
        if (!formData.fechaFin) {
          nuevosErrores.fechaFin = 'Seleccione la fecha de fin';
        }
        if (formData.fechaInicio && formData.fechaFin && formData.fechaInicio > formData.fechaFin) {
          nuevosErrores.fechaFin = 'La fecha fin debe ser posterior a la fecha inicio';
        }
        if (!formData.serviciosDigitalizados || formData.serviciosDigitalizados === '') {
          nuevosErrores.serviciosDigitalizados = 'Ingrese el número de servicios digitalizados';
        } else if (parseInt(formData.serviciosDigitalizados) < 0) {
          nuevosErrores.serviciosDigitalizados = 'El número debe ser positivo';
        }
        if (!formData.serviciosTotal || formData.serviciosTotal === '') {
          nuevosErrores.serviciosTotal = 'Ingrese el total de servicios';
        } else if (parseInt(formData.serviciosTotal) < 0) {
          nuevosErrores.serviciosTotal = 'El número debe ser positivo';
        }
        if (formData.serviciosDigitalizados && formData.serviciosTotal && parseInt(formData.serviciosDigitalizados) > parseInt(formData.serviciosTotal)) {
          nuevosErrores.serviciosDigitalizados = 'No puede ser mayor al total de servicios';
        }
        if (!formData.descripcion || formData.descripcion.trim() === '') {
          nuevosErrores.descripcion = 'Ingrese una descripción';
        }
      }
      // Validación específica para Compromiso 12 (ResponsableSoftwarePublico)
      else if (parseInt(formData.compromisoId) === 12) {
        if (!formData.fechaElaboracion) {
          nuevosErrores.fechaElaboracion = 'Seleccione la fecha de elaboración';
        }
        if (!formData.numeroDocumento || formData.numeroDocumento.trim() === '') {
          nuevosErrores.numeroDocumento = 'Ingrese el número de documento';
        }
        if (!formData.descripcion || formData.descripcion.trim() === '') {
          nuevosErrores.descripcion = 'Ingrese una descripción';
        }
        if (!formData.requisitosSeguridad || formData.requisitosSeguridad.trim() === '') {
          nuevosErrores.requisitosSeguridad = 'Ingrese los requisitos de seguridad';
        }
        if (!formData.requisitosPrivacidad || formData.requisitosPrivacidad.trim() === '') {
          nuevosErrores.requisitosPrivacidad = 'Ingrese los requisitos de privacidad';
        }
      }
      // Validación específica para Compromiso 13 (InteroperabilidadPIDE)
      else if (parseInt(formData.compromisoId) === 13) {
        if (!formData.fechaAprobacion) {
          nuevosErrores.fechaAprobacion = 'Seleccione la fecha de aprobación';
        }
        if (!formData.numeroResolucion || formData.numeroResolucion.trim() === '') {
          nuevosErrores.numeroResolucion = 'Ingrese el número de resolución';
        }
        if (!formData.descripcion || formData.descripcion.trim() === '') {
          nuevosErrores.descripcion = 'Ingrese una descripción';
        }
        if (!formData.responsable || formData.responsable.trim() === '') {
          nuevosErrores.responsable = 'Ingrese el nombre del responsable';
        }
      }
      // Validación específica para Compromiso 14 (OficialSeguridadDigital)
      else if (parseInt(formData.compromisoId) === 14) {
        if (!formData.fechaElaboracion) {
          nuevosErrores.fechaElaboracion = 'Seleccione la fecha de elaboración';
        }
        if (!formData.numeroDocumento || formData.numeroDocumento.trim() === '') {
          nuevosErrores.numeroDocumento = 'Ingrese el número de documento';
        }
        if (!formData.descripcion || formData.descripcion.trim() === '') {
          nuevosErrores.descripcion = 'Ingrese una descripción';
        }
      }
      // Validación específica para Compromiso 15 (CSIRTInstitucional)
      else if (parseInt(formData.compromisoId) === 15) {
        if (!formData.fechaConformacion) {
          nuevosErrores.fechaConformacion = 'Seleccione la fecha de conformación';
        }
        if (!formData.numeroResolucion || formData.numeroResolucion.trim() === '') {
          nuevosErrores.numeroResolucion = 'Ingrese el número de resolución';
        }
        if (!formData.responsable || formData.responsable.trim() === '') {
          nuevosErrores.responsable = 'Ingrese el nombre del responsable';
        }
        if (!formData.emailContacto || formData.emailContacto.trim() === '') {
          nuevosErrores.emailContacto = 'Ingrese el correo del responsable';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailContacto)) {
          nuevosErrores.emailContacto = 'Ingrese un correo válido';
        }
      }
      // Validación específica para Compromiso 16 (SistemaGestionSeguridad)
      else if (parseInt(formData.compromisoId) === 16) {
        if (!formData.fechaImplementacion) {
          nuevosErrores.fechaImplementacion = 'Seleccione la fecha de implementación';
        }
        if (!formData.normaAplicable || formData.normaAplicable.trim() === '') {
          nuevosErrores.normaAplicable = 'Ingrese la norma aplicable';
        }
      }
      // Validación específica para Compromiso 17 (PlanTransicionIPv6)
      else if (parseInt(formData.compromisoId) === 17) {
        if (!formData.fechaInicioTransicion) {
          nuevosErrores.fechaInicioTransicion = 'Seleccione la fecha de inicio';
        }
        if (!formData.fechaFinTransicion) {
          nuevosErrores.fechaFinTransicion = 'Seleccione la fecha de fin';
        }
        if (formData.fechaInicioTransicion && formData.fechaFinTransicion && formData.fechaInicioTransicion > formData.fechaFinTransicion) {
          nuevosErrores.fechaFinTransicion = 'La fecha fin debe ser posterior a la fecha inicio';
        }
      }
      // Validación específica para Compromiso 18 (AccesoPortalTransparencia)
      else if (parseInt(formData.compromisoId) === 18) {
        if (!formData.urlPlataforma || formData.urlPlataforma.trim() === '') {
          nuevosErrores.urlPlataforma = 'Ingrese la URL de la plataforma';
        } else if (!/^https?:\/\/.+/.test(formData.urlPlataforma)) {
          nuevosErrores.urlPlataforma = 'Ingrese una URL válida';
        }
        if (!formData.fechaImplementacion) {
          nuevosErrores.fechaImplementacion = 'Seleccione la fecha de implementación';
        }
      }
      // Validación específica para Compromiso 19 (EncuestaNacionalGobDigital)
      else if (parseInt(formData.compromisoId) === 19) {
        if (!formData.fechaConexion) {
          nuevosErrores.fechaConexion = 'Seleccione la fecha de conexión';
        }
        if (!formData.tipoConexion || formData.tipoConexion.trim() === '') {
          nuevosErrores.tipoConexion = 'Ingrese el tipo de conexión';
        }
        if (!formData.proveedor || formData.proveedor.trim() === '') {
          nuevosErrores.proveedor = 'Ingrese el proveedor';
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
      else {
        // Validación para Compromiso 1 y otros (Líder)
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
      if (!isEdit && !formData.documentoFile && !pdfUrl) {
        nuevosErrores.documentoFile = 'Debe adjuntar el documento normativo (PDF)';
      }
      // Validar que todos los criterios activos del compromiso estén marcados
      if (compromisoSeleccionado?.criteriosEvaluacion) {
        const criteriosActivos = compromisoSeleccionado.criteriosEvaluacion.filter(c => c.activo);
        const criteriosFaltantes = criteriosActivos.filter(criterio => {
          const evaluado = formData.criteriosEvaluados.find(c => c.criterioId === criterio.criterioEvaluacionId);
          return !evaluado || !evaluado.cumple;
        });
        
        if (criteriosFaltantes.length > 0) {
          nuevosErrores.criteriosEvaluacion = `Debe cumplir con todos los criterios de evaluación (${criteriosFaltantes.length} pendientes)`;
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

  const guardarProgreso = async () => {
    try {
      setSaving(true);
      
      console.log('=== GUARDAR PROGRESO ===');
      console.log('Compromiso ID:', formData.compromisoId);
      console.log('User:', user);
      console.log('Paso actual:', pasoActual);
      console.log('com1RecordId:', com1RecordId);
      console.log('formData.documentoFile:', formData.documentoFile);
      console.log('pdfUrl:', pdfUrl);

      // Subir el documento si hay uno nuevo (puede ser en paso 1 o paso 2)
      let documentoUrl = null;
      let blobUrlToRevoke = null;
      
      // Verificar si hay un archivo nuevo (blob URL local) que necesita ser subido
      if (formData.documentoFile && pdfUrl && pdfUrl.startsWith('blob:')) {
        console.log('📤 Subiendo archivo nuevo a Supabase...');
        blobUrlToRevoke = pdfUrl; // Guardar para revocar después
        const uploadResponse = await cumplimientoService.uploadDocument(formData.documentoFile);
        documentoUrl = uploadResponse.data?.url || uploadResponse.url || uploadResponse.Url;
        console.log('✅ URL del documento subido:', documentoUrl);
        // NO revocar aún - esperar a que se actualice el estado
      } else if (pdfUrl && !pdfUrl.startsWith('blob:')) {
        // Si tenemos una URL de Supabase válida (no blob), mantenerla
        console.log('📄 Manteniendo URL de Supabase existente:', pdfUrl);
        documentoUrl = pdfUrl;
      } else {
        // Si no hay archivo nuevo ni URL existente
        console.log('⚠️ No hay archivo para guardar');
        documentoUrl = null;
      }
      
      console.log('📝 URL final a guardar:', documentoUrl);

      // Preparar datos para enviar (incluyendo campos completados hasta ahora)
      const dataToSend = {
        compromisoId: parseInt(formData.compromisoId),
        entidadId: user?.entidadId || '', // Obtener del usuario autenticado
        nroDni: formData.nroDni || '',
        nombres: formData.nombres || '',
        apellidoPaterno: formData.apellidoPaterno || '',
        apellidoMaterno: formData.apellidoMaterno || '',
        correoElectronico: formData.correoElectronico || '',
        telefono: formData.telefono || '',
        rol: formData.rol || '',
        cargo: formData.cargo || '',
        fechaInicio: formData.fechaInicio || '',
        documentoUrl: documentoUrl || '',
        validacionResolucionAutoridad: formData.validacionResolucionAutoridad || false,
        validacionLiderFuncionario: formData.validacionLiderFuncionario || false,
        validacionDesignacionArticulo: formData.validacionDesignacionArticulo || false,
        validacionFuncionesDefinidas: formData.validacionFuncionesDefinidas || false,
        aceptaPoliticaPrivacidad: formData.aceptaPoliticaPrivacidad || false,
        aceptaDeclaracionJurada: formData.aceptaDeclaracionJurada || false,
        estado: formData.estado || 1
      };

      let response;
      
      // Si es Compromiso 1, usar API específica
      if (parseInt(formData.compromisoId) === 1) {
        console.log('Es Compromiso 1 - Usando API específica');
        
        // Convertir fecha al formato ISO si existe
        let fechaIso = null;
        if (formData.fechaInicio) {
          fechaIso = new Date(formData.fechaInicio + 'T00:00:00').toISOString();
        }
        
        const com1Data = {
          compromisoId: 1,
          entidadId: user.entidadId, // UUID de la entidad del usuario
          etapaFormulario: pasoActual === 3 ? 'completado' : `paso${pasoActual}`,
          estado: formData.estado === 1 ? 'bandeja' : formData.estado === 2 ? 'sin_reportar' : 'publicado',
          dniLider: formData.nroDni,
          nombreLider: formData.nombres,
          apePatLider: formData.apellidoPaterno,
          apeMatLider: formData.apellidoMaterno,
          emailLider: formData.correoElectronico,
          telefonoLider: formData.telefono,
          rolLider: formData.rol,
          cargoLider: formData.cargo,
          fecIniLider: fechaIso,
          urlDocUrl: documentoUrl, // URL del PDF subido a Supabase Storage
          criteriosEvaluados: JSON.stringify(formData.criteriosEvaluados), // Serializar a JSON
          checkPrivacidad: formData.aceptaPoliticaPrivacidad,
          checkDdjj: formData.aceptaDeclaracionJurada
        };
        
        console.log('Datos Com1 a enviar:', com1Data);
        
        if (com1RecordId) {
          // Actualizar registro existente
          console.log('Actualizando registro existente:', com1RecordId);
          response = await com1LiderGTDService.update(com1RecordId, com1Data);
        } else {
          // Crear nuevo registro
          console.log('Creando nuevo registro Com1');
          response = await com1LiderGTDService.create(com1Data);
          console.log('Respuesta create:', response);
          if (response.isSuccess && response.data) {
            console.log('ID del nuevo registro:', response.data.comlgtdEntId);
            setCom1RecordId(response.data.comlgtdEntId);
          }
        }
        
        console.log('Respuesta final Com1:', response);
        
        // Actualizar el estado local con los datos guardados (incluyendo URLs de Supabase)
        if (response.isSuccess && response.data) {
          console.log('✅ Actualizando estado local con datos guardados');
          console.log('📄 URL del PDF guardado:', response.data.urlDocPcm);
          console.log('✓ Criterios guardados:', response.data.criteriosEvaluados);
          
          // Si hay URL del documento, actualizar pdfUrl
          if (response.data.urlDocPcm) {
            setPdfUrl(response.data.urlDocPcm);
            // Si subimos un archivo nuevo, revocar el blob URL ahora que ya actualizamos el estado
            if (blobUrlToRevoke) {
              console.log('🧹 Revocando blob URL antiguo después de guardar:', blobUrlToRevoke);
              URL.revokeObjectURL(blobUrlToRevoke);
            }
          }
          
          // Actualizar formData con los criterios guardados
          if (response.data.criteriosEvaluados) {
            try {
              const criteriosParsed = JSON.parse(response.data.criteriosEvaluados);
              console.log('✓ Criterios parseados:', criteriosParsed);
              setFormData(prev => ({
                ...prev,
                criteriosEvaluados: criteriosParsed
              }));
            } catch (e) {
              console.error('❌ Error al parsear criterios guardados:', e);
            }
          }
        }
      } 
      // Si es Compromiso 2, usar API específica
      else if (parseInt(formData.compromisoId) === 2) {
        console.log('Es Compromiso 2 - Usando API específica');
        
        const com2Data = {
          compromisoId: 2,
          entidadId: user.entidadId,
          etapaFormulario: pasoActual === 3 ? 'completado' : `paso${pasoActual}`,
          estado: formData.estado === 1 ? 'bandeja' : formData.estado === 2 ? 'sin_reportar' : 'publicado',
          urlDocUrl: documentoUrl,
          criteriosEvaluados: JSON.stringify(formData.criteriosEvaluados),
          checkPrivacidad: formData.aceptaPoliticaPrivacidad,
          checkDdjj: formData.aceptaDeclaracionJurada,
          miembros: miembrosComite.map(m => ({
            miembroId: m.miembroId || null,
            dni: m.dni,
            nombre: m.nombre,
            apellidoPaterno: m.apellidoPaterno,
            apellidoMaterno: m.apellidoMaterno,
            cargo: m.cargo,
            rol: m.rol,
            email: m.email,
            telefono: m.telefono,
            activo: true
          }))
        };
        
        console.log('Datos Com2 a enviar:', com2Data);
        
        if (com2RecordId) {
          console.log('Actualizando registro existente Com2:', com2RecordId);
          response = await com2CGTDService.update(com2RecordId, com2Data);
        } else {
          console.log('Creando nuevo registro Com2');
          response = await com2CGTDService.create(com2Data);
          console.log('Respuesta create Com2:', response);
          if (response.isSuccess && response.data) {
            console.log('ID del nuevo registro Com2:', response.data.comcgtdEntId);
            setCom2RecordId(response.data.comcgtdEntId);
          }
        }
        
        console.log('Respuesta final Com2:', response);
        
        // Actualizar estado local con datos guardados
        if (response.isSuccess && response.data) {
          console.log('✅ Actualizando estado local Com2');
          
          if (response.data.urlDocPcm) {
            setPdfUrl(response.data.urlDocPcm);
            if (blobUrlToRevoke) {
              console.log('🧹 Revocando blob URL antiguo:', blobUrlToRevoke);
              URL.revokeObjectURL(blobUrlToRevoke);
            }
          }
          
          if (response.data.miembros) {
            setMiembrosComite(response.data.miembros);
          }
          
          if (response.data.criteriosEvaluados) {
            try {
              const criteriosParsed = JSON.parse(response.data.criteriosEvaluados);
              setFormData(prev => ({ ...prev, criteriosEvaluados: criteriosParsed }));
            } catch (e) {
              console.error('❌ Error al parsear criterios:', e);
            }
          }
        }
      }
      // COMPROMISO 4: Incorporar TD en el PEI
      else if (parseInt(formData.compromisoId) === 4) {
        console.log('🚀 Preparando datos para Com4 PEI');
        
        const com4Data = {
          compromisoId: 4,
          entidadId: user.entidadId,
          anioInicioPei: parseInt(formData.anioInicio) || null,
          anioFinPei: parseInt(formData.anioFin) || null,
          fechaAprobacionPei: formData.fechaAprobacion || null,
          objetivoPei: formData.objetivoEstrategico || null,
          descripcionPei: formData.descripcionIncorporacion || null,
          alineadoPgd: formData.alineadoPgd || false,
          rutaPdfPei: documentoUrl || null,
          criteriosEvaluados: formData.criteriosEvaluados ? JSON.stringify(formData.criteriosEvaluados) : null,
          checkPrivacidad: formData.aceptaPoliticaPrivacidad || false,
          checkDdjj: formData.aceptaDeclaracionJurada || false,
          usuarioRegistra: user.usuarioId,
          etapaFormulario: pasoActual === 1 ? 'paso1' : pasoActual === 2 ? 'paso2' : 'paso3'
        };
        
        console.log('Datos Com4 a enviar:', com4Data);
        
        if (com4RecordId) {
          console.log('Actualizando registro existente Com4:', com4RecordId);
          response = await com4PEIService.update(com4RecordId, com4Data);
        } else {
          console.log('Creando nuevo registro Com4');
          response = await com4PEIService.create(com4Data);
          console.log('Respuesta create Com4:', response);
          if (response.isSuccess && response.data) {
            console.log('ID del nuevo registro Com4:', response.data.comtdpeiEntId);
            setCom4RecordId(response.data.comtdpeiEntId);
          }
        }
        
        console.log('Respuesta final Com4:', response);
        
        // Actualizar estado local con datos guardados
        if (response.isSuccess && response.data) {
          console.log('✅ Actualizando estado local Com4');
          
          if (response.data.rutaPdfPei) {
            setPdfUrl(response.data.rutaPdfPei);
            if (blobUrlToRevoke) {
              console.log('🧹 Revocando blob URL antiguo:', blobUrlToRevoke);
              URL.revokeObjectURL(blobUrlToRevoke);
            }
          }
          
          if (response.data.criteriosEvaluados) {
            try {
              const criteriosParsed = JSON.parse(response.data.criteriosEvaluados);
              setFormData(prev => ({ ...prev, criteriosEvaluados: criteriosParsed }));
            } catch (e) {
              console.error('❌ Error al parsear criterios:', e);
            }
          }
        }
      }
      // COMPROMISO 5: Estrategia Digital
      else if (parseInt(formData.compromisoId) === 5) {
        console.log('🚀 Preparando datos para Com5 Estrategia Digital');
        
        const com5Data = {
          compromisoId: 5,
          entidadId: user.entidadId,
          nombreEstrategia: formData.nombreEstrategia || null,
          periodoInicioEstrategia: parseInt(formData.anioInicio) || null,
          periodoFinEstrategia: parseInt(formData.anioFin) || null,
          fechaAprobacionEstrategia: formData.fechaAprobacion || null,
          objetivosEstrategicos: formData.objetivosEstrategicos || null,
          lineasAccion: formData.lineasAccion || null,
          alineadoPgdEstrategia: formData.alineadoPgd || false,
          estadoImplementacionEstrategia: formData.estadoImplementacion || null,
          rutaPdfEstrategia: documentoUrl || null,
          criteriosEvaluados: formData.criteriosEvaluados ? JSON.stringify(formData.criteriosEvaluados) : null,
          checkPrivacidad: formData.aceptaPoliticaPrivacidad || false,
          checkDdjj: formData.aceptaDeclaracionJurada || false,
          usuarioRegistra: user.usuarioId,
          etapaFormulario: pasoActual === 1 ? 'paso1' : pasoActual === 2 ? 'paso2' : 'paso3'
        };
        
        console.log('Datos Com5 a enviar:', com5Data);
        
        if (com5RecordId) {
          console.log('Actualizando registro existente Com5:', com5RecordId);
          response = await com5EstrategiaDigitalService.update(com5RecordId, com5Data);
        } else {
          console.log('Creando nuevo registro Com5');
          response = await com5EstrategiaDigitalService.create(com5Data);
          console.log('Respuesta create Com5:', response);
          if (response.isSuccess && response.data) {
            console.log('ID del nuevo registro Com5:', response.data.comdedEntId);
            setCom5RecordId(response.data.comdedEntId);
          }
        }
        
        console.log('Respuesta final Com5:', response);
        
        // Actualizar estado local con datos guardados
        if (response.isSuccess && response.data) {
          console.log('✅ Actualizando estado local Com5');
          
          if (response.data.rutaPdfEstrategia) {
            setPdfUrl(response.data.rutaPdfEstrategia);
            if (blobUrlToRevoke) {
              console.log('🧹 Revocando blob URL antiguo:', blobUrlToRevoke);
              URL.revokeObjectURL(blobUrlToRevoke);
            }
          }
          
          if (response.data.criteriosEvaluados) {
            try {
              const criteriosParsed = JSON.parse(response.data.criteriosEvaluados);
              setFormData(prev => ({ ...prev, criteriosEvaluados: criteriosParsed }));
            } catch (e) {
              console.error('❌ Error al parsear criterios:', e);
            }
          }
        }
      }
      // COMPROMISO 6: Migración GOB.PE
      else if (parseInt(formData.compromisoId) === 6) {
        console.log('🚀 Preparando datos para Com6 Migración GOB.PE');
        
        const com6Data = {
          compromisoId: 6,
          entidadId: user.entidadId,
          urlGobpe: formData.urlPortalGobPe || null,
          fechaMigracionGobpe: formData.fechaMigracion || null,
          fechaActualizacionGobpe: formData.fechaUltimaActualizacion || null,
          responsableGobpe: formData.nombreResponsable || null,
          correoResponsableGobpe: formData.correoResponsable || null,
          telefonoResponsableGobpe: formData.telefonoResponsable || null,
          tipoMigracionGobpe: formData.tipoMigracion || null,
          observacionGobpe: formData.observacionesMigracion || null,
          rutaPdfGobpe: documentoUrl || null,
          criteriosEvaluados: formData.criteriosEvaluados ? JSON.stringify(formData.criteriosEvaluados) : null,
          checkPrivacidad: formData.aceptaPoliticaPrivacidad || false,
          checkDdjj: formData.aceptaDeclaracionJurada || false,
          usuarioRegistra: user.usuarioId,
          etapaFormulario: pasoActual === 1 ? 'paso1' : pasoActual === 2 ? 'paso2' : 'paso3'
        };
        
        console.log('Datos Com6 a enviar:', com6Data);
        
        if (com6RecordId) {
          console.log('Actualizando registro existente Com6:', com6RecordId);
          response = await com6MigracionGobPeService.update(com6RecordId, com6Data);
        } else {
          console.log('Creando nuevo registro Com6');
          response = await com6MigracionGobPeService.create(com6Data);
          console.log('Respuesta create Com6:', response);
          if (response.isSuccess && response.data) {
            console.log('ID del nuevo registro Com6:', response.data.commpgobpeEntId);
            setCom6RecordId(response.data.commpgobpeEntId);
          }
        }
        
        console.log('Respuesta final Com6:', response);
        
        // Actualizar estado local con datos guardados
        if (response.isSuccess && response.data) {
          console.log('✅ Actualizando estado local Com6');
          
          if (response.data.rutaPdfGobpe) {
            setPdfUrl(response.data.rutaPdfGobpe);
            if (blobUrlToRevoke) {
              console.log('🧹 Revocando blob URL antiguo:', blobUrlToRevoke);
              URL.revokeObjectURL(blobUrlToRevoke);
            }
          }
          
          if (response.data.criteriosEvaluados) {
            try {
              const criteriosParsed = JSON.parse(response.data.criteriosEvaluados);
              setFormData(prev => ({ ...prev, criteriosEvaluados: criteriosParsed }));
            } catch (e) {
              console.error('❌ Error al parsear criterios:', e);
            }
          }
        }
      }
      // COMPROMISO 7: Implementación MPD
      else if (parseInt(formData.compromisoId) === 7) {
        console.log('🚀 Preparando datos para Com7 Implementación MPD');
        
        const com7Data = {
          compromisoId: 7,
          entidadId: user.entidadId,
          urlMpd: formData.urlMpd || null,
          fechaImplementacionMpd: formData.fechaImplementacionMpd || null,
          responsableMpd: formData.responsableMpd || null,
          cargoResponsableMpd: formData.cargoResponsableMpd || null,
          correoResponsableMpd: formData.correoResponsableMpd || null,
          telefonoResponsableMpd: formData.telefonoResponsableMpd || null,
          tipoMpd: formData.tipoMpd || null,
          interoperabilidadMpd: formData.interoperabilidadMpd || false,
          observacionMpd: formData.observacionesMpd || null,
          rutaPdfMpd: documentoUrl || null,
          criteriosEvaluados: formData.criteriosEvaluados ? JSON.stringify(formData.criteriosEvaluados) : null,
          checkPrivacidad: formData.aceptaPoliticaPrivacidad || false,
          checkDdjj: formData.aceptaDeclaracionJurada || false,
          usuarioRegistra: user.usuarioId,
          etapaFormulario: pasoActual === 1 ? 'paso1' : pasoActual === 2 ? 'paso2' : 'paso3'
        };
        
        console.log('Datos Com7 a enviar:', com7Data);
        
        if (com7RecordId) {
          console.log('Actualizando registro existente Com7:', com7RecordId);
          response = await com7ImplementacionMPDService.update(com7RecordId, com7Data);
        } else {
          console.log('Creando nuevo registro Com7');
          response = await com7ImplementacionMPDService.create(com7Data);
          console.log('Respuesta create Com7:', response);
          if (response.isSuccess && response.data) {
            console.log('ID del nuevo registro Com7:', response.data.comimpdEntId);
            setCom7RecordId(response.data.comimpdEntId);
          }
        }
        
        console.log('Respuesta final Com7:', response);
        
        // Actualizar estado local con datos guardados
        if (response.isSuccess && response.data) {
          console.log('✅ Actualizando estado local Com7');
          
          if (response.data.rutaPdfMpd) {
            setPdfUrl(response.data.rutaPdfMpd);
            if (blobUrlToRevoke) {
              console.log('🧹 Revocando blob URL antiguo:', blobUrlToRevoke);
              URL.revokeObjectURL(blobUrlToRevoke);
            }
          }
          
          if (response.data.criteriosEvaluados) {
            try {
              const criteriosParsed = JSON.parse(response.data.criteriosEvaluados);
              setFormData(prev => ({ ...prev, criteriosEvaluados: criteriosParsed }));
            } catch (e) {
              console.error('❌ Error al parsear criterios:', e);
            }
          }
        }
      }
      // COMPROMISO 8: Publicación TUPA
      else if (parseInt(formData.compromisoId) === 8) {
        console.log('🚀 Preparando datos para Com8 Publicación TUPA');
        
        const com8Data = {
          compromisoId: 8,
          entidadId: user.entidadId,
          urlTupa: formData.urlTupa || null,
          numeroResolucionTupa: formData.numeroResolucionTupa || null,
          fechaAprobacionTupa: formData.fechaAprobacionTupa || null,
          responsableTupa: formData.responsableTupa || null,
          cargoResponsableTupa: formData.cargoResponsableTupa || null,
          correoResponsableTupa: formData.correoResponsableTupa || null,
          telefonoResponsableTupa: formData.telefonoResponsableTupa || null,
          actualizadoTupa: formData.actualizadoTupa || false,
          observacionTupa: formData.observacionesTupa || null,
          rutaPdfTupa: documentoUrl || null,
          criteriosEvaluados: formData.criteriosEvaluados ? JSON.stringify(formData.criteriosEvaluados) : null,
          checkPrivacidad: formData.aceptaPoliticaPrivacidad || false,
          checkDdjj: formData.aceptaDeclaracionJurada || false,
          usuarioRegistra: user.usuarioId,
          etapaFormulario: pasoActual === 1 ? 'paso1' : pasoActual === 2 ? 'paso2' : 'paso3'
        };
        
        console.log('Datos Com8 a enviar:', com8Data);
        
        if (com8RecordId) {
          console.log('Actualizando registro existente Com8:', com8RecordId);
          response = await com8PublicacionTUPAService.update(com8RecordId, com8Data);
        } else {
          console.log('Creando nuevo registro Com8');
          response = await com8PublicacionTUPAService.create(com8Data);
          console.log('Respuesta create Com8:', response);
          if (response.isSuccess && response.data) {
            console.log('ID del nuevo registro Com8:', response.data.comptupaEntId);
            setCom8RecordId(response.data.comptupaEntId);
          }
        }
        
        console.log('Respuesta final Com8:', response);
        
        // Actualizar estado local con datos guardados
        if (response.isSuccess && response.data) {
          console.log('✅ Actualizando estado local Com8');
          
          if (response.data.rutaPdfTupa) {
            setPdfUrl(response.data.rutaPdfTupa);
            if (blobUrlToRevoke) {
              console.log('🧹 Revocando blob URL antiguo:', blobUrlToRevoke);
              URL.revokeObjectURL(blobUrlToRevoke);
            }
          }
          
          if (response.data.criteriosEvaluados) {
            try {
              const criteriosParsed = JSON.parse(response.data.criteriosEvaluados);
              setFormData(prev => ({ ...prev, criteriosEvaluados: criteriosParsed }));
            } catch (e) {
              console.error('❌ Error al parsear criterios:', e);
            }
          }
        }
      }
      // COMPROMISO 9: Modelo de Gestión Documental
      else if (parseInt(formData.compromisoId) === 9) {
        console.log('🚀 Preparando datos para Com9 MGD');
        
        const com9Data = {
          compromisoId: 9,
          entidadId: user.entidadId,
          fechaAprobacionMgd: formData.fechaAprobacionMgd || null,
          numeroResolucionMgd: formData.numeroResolucionMgd || null,
          responsableMgd: formData.responsableMgd || null,
          cargoResponsableMgd: formData.cargoResponsableMgd || null,
          correoResponsableMgd: formData.correoResponsableMgd || null,
          telefonoResponsableMgd: formData.telefonoResponsableMgd || null,
          sistemaPlataformaMgd: formData.sistemaPlataformaMgd || null,
          tipoImplantacionMgd: formData.tipoImplantacionMgd || null,
          interoperaSistemasMgd: formData.interoperaSistemasMgd || false,
          observacionMgd: formData.observacionesMgd || null,
          rutaPdfMgd: documentoUrl || null,
          criteriosEvaluados: formData.criteriosEvaluados ? JSON.stringify(formData.criteriosEvaluados) : null,
          checkPrivacidad: formData.aceptaPoliticaPrivacidad || false,
          checkDdjj: formData.aceptaDeclaracionJurada || false,
          usuarioRegistra: user.usuarioId,
          etapaFormulario: pasoActual === 1 ? 'paso1' : pasoActual === 2 ? 'paso2' : 'paso3'
        };
        
        console.log('Datos Com9 a enviar:', com9Data);
        
        if (com9RecordId) {
          console.log('Actualizando registro existente Com9:', com9RecordId);
          response = await com9ModeloGestionDocumentalService.update(com9RecordId, com9Data);
        } else {
          console.log('Creando nuevo registro Com9');
          response = await com9ModeloGestionDocumentalService.create(com9Data);
          console.log('Respuesta create Com9:', response);
          if (response.isSuccess && response.data) {
            console.log('ID del nuevo registro Com9:', response.data.commgdEntId);
            setCom9RecordId(response.data.commgdEntId);
          }
        }
        
        console.log('Respuesta final Com9:', response);
        
        // Actualizar estado local con datos guardados
        if (response.isSuccess && response.data) {
          console.log('✅ Actualizando estado local Com9');
          
          if (response.data.rutaPdfMgd) {
            setPdfUrl(response.data.rutaPdfMgd);
            if (blobUrlToRevoke) {
              console.log('🧹 Revocando blob URL antiguo:', blobUrlToRevoke);
              URL.revokeObjectURL(blobUrlToRevoke);
            }
          }
          
          if (response.data.criteriosEvaluados) {
            try {
              const criteriosParsed = JSON.parse(response.data.criteriosEvaluados);
              setFormData(prev => ({ ...prev, criteriosEvaluados: criteriosParsed }));
            } catch (e) {
              console.error('❌ Error al parsear criterios:', e);
            }
          }
        }
      }
      // COMPROMISO 10: Datos Abiertos
      else if (parseInt(formData.compromisoId) === 10) {
        console.log('🚀 Preparando datos para Com10 Datos Abiertos');
        
        const com10Data = {
          compromisoId: 10,
          entidadId: user.entidadId,
          urlDatosAbiertos: formData.urlDatosAbiertos || null,
          totalDatasets: formData.totalDatasets ? parseInt(formData.totalDatasets) : null,
          fechaUltimaActualizacionDa: formData.fechaUltimaActualizacionDa || null,
          responsableDa: formData.responsableDa || null,
          cargoResponsableDa: formData.cargoDa || null,
          correoResponsableDa: formData.correoDa || null,
          telefonoResponsableDa: formData.telefonoDa || null,
          numeroNormaResolucionDa: formData.numeroNormaResolucionDa || null,
          fechaAprobacionDa: formData.fechaAprobacionDa || null,
          observacionDa: formData.observacionesDa || null,
          rutaPdfDa: documentoUrl || null,
          criteriosEvaluados: formData.criteriosEvaluados ? JSON.stringify(formData.criteriosEvaluados) : null,
          checkPrivacidad: formData.aceptaPoliticaPrivacidad || false,
          checkDdjj: formData.aceptaDeclaracionJurada || false,
          usuarioRegistra: user.usuarioId,
          etapaFormulario: pasoActual === 1 ? 'paso1' : pasoActual === 2 ? 'paso2' : 'paso3'
        };
        
        console.log('Datos Com10 a enviar:', com10Data);
        
        if (com10RecordId) {
          console.log('Actualizando registro existente Com10:', com10RecordId);
          response = await com10DatosAbiertosService.update(com10RecordId, com10Data);
        } else {
          console.log('Creando nuevo registro Com10');
          response = await com10DatosAbiertosService.create(com10Data);
          console.log('Respuesta create Com10:', response);
          if (response.isSuccess && response.data) {
            console.log('ID del nuevo registro Com10:', response.data.comdaEntId);
            setCom10RecordId(response.data.comdaEntId);
          }
        }
        
        console.log('Respuesta final Com10:', response);
        
        // Actualizar estado local con datos guardados
        if (response.isSuccess && response.data) {
          console.log('✅ Actualizando estado local Com10');
          
          if (response.data.rutaPdfDa) {
            setPdfUrl(response.data.rutaPdfDa);
            if (blobUrlToRevoke) {
              console.log('🧹 Revocando blob URL antiguo:', blobUrlToRevoke);
              URL.revokeObjectURL(blobUrlToRevoke);
            }
          }
          
          if (response.data.criteriosEvaluados) {
            try {
              const criteriosParsed = JSON.parse(response.data.criteriosEvaluados);
              setFormData(prev => ({ ...prev, criteriosEvaluados: criteriosParsed }));
            } catch (e) {
              console.error('❌ Error al parsear criterios:', e);
            }
          }
        }
      } 

      // COMPROMISO 11
      else if (parseInt(formData.compromisoId) === 11) {
        console.log('🚀 Preparando datos para Com11');
        
        const com11Data = {
          compromisoId: 11,
          entidadId: user.entidadId,
          fechaInicio: formData.fechaInicio || null,
          fechaFin: formData.fechaFin || null,
          serviciosDigitalizados: formData.serviciosDigitalizados ? parseInt(formData.serviciosDigitalizados) : null,
          serviciosTotal: formData.serviciosTotal ? parseInt(formData.serviciosTotal) : null,
          porcentajeDigitalizacion: formData.porcentajeDigitalizacion ? parseFloat(formData.porcentajeDigitalizacion) : null,
          archivoPlan: documentoUrl || formData.archivoPlan || null,
          descripcion: formData.descripcion || null,
          beneficiariosEstimados: formData.beneficiariosEstimados ? parseInt(formData.beneficiariosEstimados) : null,
          checkPrivacidad: formData.aceptaPoliticaPrivacidad || false,
          checkDdjj: formData.aceptaDeclaracionJurada || false,
          usuarioRegistra: user.usuarioId,
          etapaFormulario: pasoActual === 1 ? 'paso1' : pasoActual === 2 ? 'paso2' : 'paso3',
          estado: 'bandeja'
        };
        
        console.log('Datos Com11 a enviar:', com11Data);
        
        if (com11RecordId) {
          console.log('Actualizando registro existente Com11:', com11RecordId);
          response = await com11AportacionGeoPeruService.update(com11RecordId, com11Data);
        } else {
          console.log('Creando nuevo registro Com11');
          response = await com11AportacionGeoPeruService.create(com11Data);
          console.log('Respuesta create Com11:', response);
          if (response.isSuccess && response.data) {
            console.log('ID del nuevo registro Com11:', response.data.comageopEntId);
            setCom11RecordId(response.data.comageopEntId);
          }
        }
        
        console.log('Respuesta final Com11:', response);
        
        // Actualizar estado local con datos guardados
        if (response.isSuccess && response.data) {
          console.log('✅ Actualizando estado local Com11');
          
          if (response.data.archivoPlan) {
            setPdfUrl(response.data.archivoPlan);
            if (blobUrlToRevoke) {
              console.log('🧹 Revocando blob URL antiguo:', blobUrlToRevoke);
              URL.revokeObjectURL(blobUrlToRevoke);
            }
          }
        }
      }

      // COMPROMISO 12
      else if (parseInt(formData.compromisoId) === 12) {
        console.log('🚀 Preparando datos para Com12');
        
        const com12Data = {
          compromisoId: 12,
          entidadId: user.entidadId,
          fechaElaboracion: formData.fechaElaboracion || null,
          numeroDocumento: formData.numeroDocumento || null,
          archivoDocumento: documentoUrl || formData.archivoDocumento || null,
          descripcion: formData.descripcion || null,
          requisitosSeguridad: formData.requisitosSeguridad || null,
          requisitosPrivacidad: formData.requisitosPrivacidad || null,
          fechaVigencia: formData.fechaVigencia || null,
          checkPrivacidad: formData.aceptaPoliticaPrivacidad || false,
          checkDdjj: formData.aceptaDeclaracionJurada || false,
          usuarioRegistra: user.usuarioId,
          etapaFormulario: pasoActual === 1 ? 'paso1' : pasoActual === 2 ? 'paso2' : 'paso3',
          estado: 'bandeja'
        };
        
        console.log('Datos Com12 a enviar:', com12Data);
        
        if (com12RecordId) {
          console.log('Actualizando registro existente Com12:', com12RecordId);
          response = await com12ResponsableSoftwarePublicoService.update(com12RecordId, com12Data);
        } else {
          console.log('Creando nuevo registro Com12');
          response = await com12ResponsableSoftwarePublicoService.create(com12Data);
          console.log('Respuesta create Com12:', response);
          if (response.isSuccess && response.data) {
            console.log('ID del nuevo registro Com12:', response.data.comdrspEntId);
            setCom12RecordId(response.data.comdrspEntId);
          }
        }
        
        console.log('Respuesta final Com12:', response);
        
        // Actualizar estado local con datos guardados
        if (response.isSuccess && response.data) {
          console.log('✅ Actualizando estado local Com12');
          
          if (response.data.archivoDocumento) {
            setPdfUrl(response.data.archivoDocumento);
            if (blobUrlToRevoke) {
              console.log('🧹 Revocando blob URL antiguo:', blobUrlToRevoke);
              URL.revokeObjectURL(blobUrlToRevoke);
            }
          }
        }
      }

      // COMPROMISO 13
      else if (parseInt(formData.compromisoId) === 13) {
        console.log('🚀 Preparando datos para Com13');
        
        const com13Data = {
          compromisoId: 13,
          entidadId: user.entidadId,
          fechaAprobacion: formData.fechaAprobacion || null,
          numeroResolucion: formData.numeroResolucion || null,
          archivoPlan: documentoUrl || formData.archivoPlan || null,
          descripcion: formData.descripcion || null,
          riesgosIdentificados: formData.riesgosIdentificados || null,
          estrategiasMitigacion: formData.estrategiasMitigacion || null,
          fechaRevision: formData.fechaRevision || null,
          responsable: formData.responsable || null,
          checkPrivacidad: formData.aceptaPoliticaPrivacidad || false,
          checkDdjj: formData.aceptaDeclaracionJurada || false,
          usuarioRegistra: user.usuarioId,
          etapaFormulario: pasoActual === 1 ? 'paso1' : pasoActual === 2 ? 'paso2' : 'paso3',
          estado: 'bandeja'
        };
        
        console.log('Datos Com13 a enviar:', com13Data);
        
        if (com13RecordId) {
          console.log('Actualizando registro existente Com13:', com13RecordId);
          response = await com13InteroperabilidadPIDEService.update(com13RecordId, com13Data);
        } else {
          console.log('Creando nuevo registro Com13');
          response = await com13InteroperabilidadPIDEService.create(com13Data);
          console.log('Respuesta create Com13:', response);
          if (response.isSuccess && response.data) {
            console.log('ID del nuevo registro Com13:', response.data.compcpideEntId);
            setCom13RecordId(response.data.compcpideEntId);
          }
        }
        
        console.log('Respuesta final Com13:', response);
        
        // Actualizar estado local con datos guardados
        if (response.isSuccess && response.data) {
          console.log('✅ Actualizando estado local Com13');
          
          if (response.data.archivoPlan) {
            setPdfUrl(response.data.archivoPlan);
            if (blobUrlToRevoke) {
              console.log('🧹 Revocando blob URL antiguo:', blobUrlToRevoke);
              URL.revokeObjectURL(blobUrlToRevoke);
            }
          }
        }
      }

      // COMPROMISO 14
      else if (parseInt(formData.compromisoId) === 14) {
        console.log('🚀 Preparando datos para Com14');
        
        const com14Data = {
          compromisoId: 14,
          entidadId: user.entidadId,
          fechaElaboracion: formData.fechaElaboracion || null,
          numeroDocumento: formData.numeroDocumento || null,
          archivoDocumento: documentoUrl || formData.archivoDocumento || null,
          descripcion: formData.descripcion || null,
          politicasSeguridad: formData.politicasSeguridad || null,
          certificaciones: formData.certificaciones || null,
          fechaVigencia: formData.fechaVigencia || null,
          checkPrivacidad: formData.aceptaPoliticaPrivacidad || false,
          checkDdjj: formData.aceptaDeclaracionJurada || false,
          usuarioRegistra: user.usuarioId,
          etapaFormulario: pasoActual === 1 ? 'paso1' : pasoActual === 2 ? 'paso2' : 'paso3',
          estado: 'bandeja'
        };
        
        console.log('Datos Com14 a enviar:', com14Data);
        
        if (com14RecordId) {
          console.log('Actualizando registro existente Com14:', com14RecordId);
          response = await com14OficialSeguridadDigitalService.update(com14RecordId, com14Data);
        } else {
          console.log('Creando nuevo registro Com14');
          response = await com14OficialSeguridadDigitalService.create(com14Data);
          console.log('Respuesta create Com14:', response);
          if (response.isSuccess && response.data) {
            console.log('ID del nuevo registro Com14:', response.data.comdoscdEntId);
            setCom14RecordId(response.data.comdoscdEntId);
          }
        }
        
        console.log('Respuesta final Com14:', response);
        
        // Actualizar estado local con datos guardados
        if (response.isSuccess && response.data) {
          console.log('✅ Actualizando estado local Com14');
          
          if (response.data.archivoDocumento) {
            setPdfUrl(response.data.archivoDocumento);
            if (blobUrlToRevoke) {
              console.log('🧹 Revocando blob URL antiguo:', blobUrlToRevoke);
              URL.revokeObjectURL(blobUrlToRevoke);
            }
          }
        }
      }

      // COMPROMISO 15
      else if (parseInt(formData.compromisoId) === 15) {
        console.log('🚀 Preparando datos para Com15');
        
        const com15Data = {
          compromisoId: 15,
          entidadId: user.entidadId,
          fechaConformacion: formData.fechaConformacion || null,
          numeroResolucion: formData.numeroResolucion || null,
          responsable: formData.responsable || null,
          emailContacto: formData.emailContacto || null,
          telefonoContacto: formData.telefonoContacto || null,
          archivoProcedimientos: documentoUrl || null,
          descripcion: formData.descripcion || null,
          checkPrivacidad: formData.aceptaPoliticaPrivacidad || false,
          checkDdjj: formData.aceptaDeclaracionJurada || false,
          usuarioRegistra: user.usuarioId,
          etapaFormulario: pasoActual === 1 ? 'paso1' : pasoActual === 2 ? 'paso2' : 'paso3',
          estado: 'bandeja'
        };
        
        console.log('Datos Com15 a enviar:', com15Data);
        
        if (com15RecordId) {
          console.log('Actualizando registro existente Com15:', com15RecordId);
          response = await com15CSIRTInstitucionalService.update(com15RecordId, com15Data);
        } else {
          console.log('Creando nuevo registro Com15');
          response = await com15CSIRTInstitucionalService.create(com15Data);
          console.log('Respuesta create Com15:', response);
          if (response.isSuccess && response.data) {
            console.log('ID del nuevo registro Com15:', response.data.comcsirtEntId);
            setCom15RecordId(response.data.comcsirtEntId);
          }
        }
        
        console.log('Respuesta final Com15:', response);
      }

      // COMPROMISO 16
      else if (parseInt(formData.compromisoId) === 16) {
        console.log('🚀 Preparando datos para Com16');
        
        const com16Data = {
          compromisoId: 16,
          entidadId: user.entidadId,
          fechaImplementacion: formData.fechaImplementacion || null,
          normaAplicable: formData.normaAplicable || null,
          certificacion: formData.certificacion || null,
          fechaCertificacion: formData.fechaCertificacion || null,
          archivoCertificado: documentoUrl || null,
          descripcion: formData.descripcion || null,
          alcance: formData.alcance || null,
          checkPrivacidad: formData.aceptaPoliticaPrivacidad || false,
          checkDdjj: formData.aceptaDeclaracionJurada || false,
          usuarioRegistra: user.usuarioId,
          etapaFormulario: pasoActual === 1 ? 'paso1' : pasoActual === 2 ? 'paso2' : 'paso3',
          estado: 'bandeja'
        };
        
        console.log('Datos Com16 a enviar:', com16Data);
        
        if (com16RecordId) {
          console.log('Actualizando registro existente Com16:', com16RecordId);
          response = await com16SistemaGestionSeguridadService.update(com16RecordId, com16Data);
        } else {
          console.log('Creando nuevo registro Com16');
          response = await com16SistemaGestionSeguridadService.create(com16Data);
          console.log('Respuesta create Com16:', response);
          if (response.isSuccess && response.data) {
            console.log('ID del nuevo registro Com16:', response.data.id);
            setCom16RecordId(response.data.id);
          }
        }
        
        console.log('Respuesta final Com16:', response);
      }

      // COMPROMISO 17
      else if (parseInt(formData.compromisoId) === 17) {
        console.log('🚀 Preparando datos para Com17');
        
        const com17Data = {
          compromisoId: 17,
          entidadId: user.entidadId,
          fechaInicioTransicion: formData.fechaInicioTransicion || null,
          fechaFinTransicion: formData.fechaFinTransicion || null,
          porcentajeAvance: formData.porcentajeAvance ? parseFloat(formData.porcentajeAvance) : null,
          sistemasMigrados: formData.sistemasMigrados ? parseInt(formData.sistemasMigrados) : null,
          sistemasTotal: formData.sistemasTotal ? parseInt(formData.sistemasTotal) : null,
          archivoPlan: documentoUrl || null,
          descripcion: formData.descripcion || null,
          checkPrivacidad: formData.aceptaPoliticaPrivacidad || false,
          checkDdjj: formData.aceptaDeclaracionJurada || false,
          usuarioRegistra: user.usuarioId,
          etapaFormulario: pasoActual === 1 ? 'paso1' : pasoActual === 2 ? 'paso2' : 'paso3',
          estado: 'bandeja'
        };
        
        console.log('Datos Com17 a enviar:', com17Data);
        
        if (com17RecordId) {
          console.log('Actualizando registro existente Com17:', com17RecordId);
          response = await com17PlanTransicionIPv6Service.update(com17RecordId, com17Data);
        } else {
          console.log('Creando nuevo registro Com17');
          response = await com17PlanTransicionIPv6Service.create(com17Data);
          console.log('Respuesta create Com17:', response);
          if (response.isSuccess && response.data) {
            console.log('ID del nuevo registro Com17:', response.data.id);
            setCom17RecordId(response.data.id);
          }
        }
        
        console.log('Respuesta final Com17:', response);
      }

      // COMPROMISO 18
      else if (parseInt(formData.compromisoId) === 18) {
        console.log('🚀 Preparando datos para Com18');
        
        const com18Data = {
          compromisoId: 18,
          entidadId: user.entidadId,
          urlPlataforma: formData.urlPlataforma || null,
          fechaImplementacion: formData.fechaImplementacion || null,
          tramitesDisponibles: formData.tramitesDisponibles ? parseInt(formData.tramitesDisponibles) : null,
          usuariosRegistrados: formData.usuariosRegistrados ? parseInt(formData.usuariosRegistrados) : null,
          tramitesProcesados: formData.tramitesProcesados ? parseInt(formData.tramitesProcesados) : null,
          archivoEvidencia: documentoUrl || null,
          descripcion: formData.descripcion || null,
          checkPrivacidad: formData.aceptaPoliticaPrivacidad || false,
          checkDdjj: formData.aceptaDeclaracionJurada || false,
          usuarioRegistra: user.usuarioId,
          etapaFormulario: pasoActual === 1 ? 'paso1' : pasoActual === 2 ? 'paso2' : 'paso3',
          estado: 'bandeja'
        };
        
        console.log('Datos Com18 a enviar:', com18Data);
        
        if (com18RecordId) {
          console.log('Actualizando registro existente Com18:', com18RecordId);
          response = await com18AccesoPortalTransparenciaService.update(com18RecordId, com18Data);
        } else {
          console.log('Creando nuevo registro Com18');
          response = await com18AccesoPortalTransparenciaService.create(com18Data);
          console.log('Respuesta create Com18:', response);
          if (response.isSuccess && response.data) {
            console.log('ID del nuevo registro Com18:', response.data.id);
            setCom18RecordId(response.data.id);
          }
        }
        
        console.log('Respuesta final Com18:', response);
      }

      // COMPROMISO 19
      else if (parseInt(formData.compromisoId) === 19) {
        console.log('🚀 Preparando datos para Com19');
        
        const com19Data = {
          compromisoId: 19,
          entidadId: user.entidadId,
          fechaConexion: formData.fechaConexion || null,
          tipoConexion: formData.tipoConexion || null,
          anchoBanda: formData.anchoBanda || null,
          proveedor: formData.proveedor || null,
          archivoContrato: documentoUrl || null,
          descripcion: formData.descripcion || null,
          checkPrivacidad: formData.aceptaPoliticaPrivacidad || false,
          checkDdjj: formData.aceptaDeclaracionJurada || false,
          usuarioRegistra: user.usuarioId,
          etapaFormulario: pasoActual === 1 ? 'paso1' : pasoActual === 2 ? 'paso2' : 'paso3',
          estado: 'bandeja'
        };
        
        console.log('Datos Com19 a enviar:', com19Data);
        
        if (com19RecordId) {
          console.log('Actualizando registro existente Com19:', com19RecordId);
          response = await com19EncuestaNacionalGobDigitalService.update(com19RecordId, com19Data);
        } else {
          console.log('Creando nuevo registro Com19');
          response = await com19EncuestaNacionalGobDigitalService.create(com19Data);
          console.log('Respuesta create Com19:', response);
          if (response.isSuccess && response.data) {
            console.log('ID del nuevo registro Com19:', response.data.id);
            setCom19RecordId(response.data.id);
          }
        }
        
        console.log('Respuesta final Com19:', response);
      }

      // COMPROMISO 20
      else if (parseInt(formData.compromisoId) === 20) {
        console.log('🚀 Preparando datos para Com20');
        
        const com20Data = {
          compromisoId: 20,
          entidadId: user.entidadId,
          sistemasDocumentados: formData.sistemasDocumentados ? parseInt(formData.sistemasDocumentados) : null,
          sistemasTotal: formData.sistemasTotal ? parseInt(formData.sistemasTotal) : null,
          porcentajeDocumentacion: formData.porcentajeDocumentacion ? parseFloat(formData.porcentajeDocumentacion) : null,
          archivoRepositorio: documentoUrl || null,
          descripcion: formData.descripcion || null,
          checkPrivacidad: formData.aceptaPoliticaPrivacidad || false,
          checkDdjj: formData.aceptaDeclaracionJurada || false,
          usuarioRegistra: user.usuarioId,
          etapaFormulario: pasoActual === 1 ? 'paso1' : pasoActual === 2 ? 'paso2' : 'paso3',
          estado: 'bandeja'
        };
        
        console.log('Datos Com20 a enviar:', com20Data);
        
        if (com20RecordId) {
          console.log('Actualizando registro existente Com20:', com20RecordId);
          response = await com20DigitalizacionServiciosFacilitaService.update(com20RecordId, com20Data);
        } else {
          console.log('Creando nuevo registro Com20');
          response = await com20DigitalizacionServiciosFacilitaService.create(com20Data);
          console.log('Respuesta create Com20:', response);
          if (response.isSuccess && response.data) {
            console.log('ID del nuevo registro Com20:', response.data.id);
            setCom20RecordId(response.data.id);
          }
        }
        
        console.log('Respuesta final Com20:', response);
      }

      // COMPROMISO 21
      else if (parseInt(formData.compromisoId) === 21) {
        console.log('🚀 Preparando datos para Com21');
        
        const com21Data = {
          compromisoId: 21,
          entidadId: user.entidadId,
          fechaElaboracion: formData.fechaElaboracion || null,
          numeroDocumento: formData.numeroDocumento || null,
          archivoDocumento: documentoUrl || null,
          descripcion: formData.descripcion || null,
          procedimientos: formData.procedimientos || null,
          responsables: formData.responsables || null,
          fechaVigencia: formData.fechaVigencia || null,
          checkPrivacidad: formData.aceptaPoliticaPrivacidad || false,
          checkDdjj: formData.aceptaDeclaracionJurada || false,
          usuarioRegistra: user.usuarioId,
          etapaFormulario: pasoActual === 1 ? 'paso1' : pasoActual === 2 ? 'paso2' : 'paso3',
          estado: 'bandeja'
        };
        
        console.log('Datos Com21 a enviar:', com21Data);
        
        if (com21RecordId) {
          console.log('Actualizando registro existente Com21:', com21RecordId);
          response = await com21OficialGobiernoDatosService.update(com21RecordId, com21Data);
        } else {
          console.log('Creando nuevo registro Com21');
          response = await com21OficialGobiernoDatosService.create(com21Data);
          console.log('Respuesta create Com21:', response);
          if (response.isSuccess && response.data) {
            console.log('ID del nuevo registro Com21:', response.data.id);
            setCom21RecordId(response.data.id);
          }
        }
        
        console.log('Respuesta final Com21:', response);
      }
      else if (isEdit || id) {
        // Si ya existe, actualizar (genérico)
        response = await cumplimientoService.update(id, dataToSend);
      } else {
        // Si es nuevo, crear y guardar el ID (genérico)
        response = await cumplimientoService.create(dataToSend);
        if (response.isSuccess || response.IsSuccess) {
          const newId = response.data?.cumplimientoId || response.Data?.cumplimientoId;
          if (newId) {
            // Actualizar la URL con el ID del cumplimiento creado
            navigate(`/dashboard/cumplimiento/${newId}?compromiso=${formData.compromisoId}`, { replace: true });
          }
        }
      }

      if (response.isSuccess || response.IsSuccess) {
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
        const guardado = await guardarProgreso();
        
        if (guardado) {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-800">
          {viewMode ? 'Ver Cumplimiento Normativo' : (isEdit ? 'Editar Cumplimiento Normativo' : 'Nuevo Cumplimiento Normativo')}
        </h1>
        {compromisoSeleccionado && (
          <div className="mt-3 p-4 bg-primary/5 border-l-4 border-primary rounded-r-lg">
            <p className="text-sm text-gray-600 mb-1">Compromiso seleccionado:</p>
            <p className="text-base font-semibold text-primary">
              Compromiso {compromisoSeleccionado.compromisoId}: {compromisoSeleccionado.nombreCompromiso}
            </p>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Documento PEI (PDF) <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex-1 flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                        <Upload className="w-5 h-5 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formData.documentoFile ? formData.documentoFile.name : 'Seleccionar archivo'}
                        </span>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          disabled={viewMode}
                        />
                      </label>
                      {pdfUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setDocumentoActualUrl(pdfUrl);
                            setShowPdfViewer(true);
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Ver PDF
                        </button>
                      )}
                    </div>
                    {errores.documentoFile && (
                      <p className="text-red-500 text-xs mt-1">{errores.documentoFile}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Suba el documento del PEI en formato PDF (máximo 10 MB)
                    </p>
                  </div>
                </div>
              </>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Documento PDF <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex-1 flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                        <Upload className="w-5 h-5 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formData.documentoFile ? formData.documentoFile.name : 'Seleccionar archivo PDF'}
                        </span>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          disabled={viewMode}
                        />
                      </label>
                      {pdfUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setDocumentoActualUrl(pdfUrl);
                            setShowPdfViewer(true);
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Ver PDF
                        </button>
                      )}
                    </div>
                    {errores.documentoFile && (
                      <p className="text-red-500 text-xs mt-1">{errores.documentoFile}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Suba el documento de la Estrategia Digital en formato PDF (máximo 10 MB)
                    </p>
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
                            <tr key={miembro.miembroId || index} className="hover:bg-gray-50">
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
                      placeholder="correo@entidad.gob.pe"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Documento de evidencia (PDF)
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex-1 flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                        <Upload className="w-5 h-5 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formData.documentoFile ? formData.documentoFile.name : 'Seleccionar archivo'}
                        </span>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          disabled={viewMode}
                        />
                      </label>
                      {pdfUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setDocumentoActualUrl(pdfUrl);
                            setShowPdfViewer(true);
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Ver PDF
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Suba el documento de evidencia de la migración en formato PDF (máximo 10 MB)
                    </p>
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
                      placeholder="https://mesadepartes.entidad.gob.pe"
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
                      Responsable de la MPD <span className="text-red-500">*</span>
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
                      Cargo del responsable
                    </label>
                    <input
                      type="text"
                      name="cargoResponsableMpd"
                      value={formData.cargoResponsableMpd}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Cargo"
                      disabled={viewMode}
                    />
                  </div>

                  {/* Correo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo del responsable
                    </label>
                    <input
                      type="email"
                      name="correoResponsableMpd"
                      value={formData.correoResponsableMpd}
                      onChange={handleInputChange}
                      className={`input-field ${errores.correoResponsableMpd ? 'border-red-500' : ''}`}
                      placeholder="correo@entidad.gob.pe"
                      disabled={viewMode}
                    />
                    {errores.correoResponsableMpd && (
                      <p className="text-red-500 text-xs mt-1">{errores.correoResponsableMpd}</p>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono del responsable
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
                      name="observacionesMpd"
                      value={formData.observacionesMpd}
                      onChange={handleInputChange}
                      maxLength="1000"
                      rows="3"
                      className="input-field"
                      placeholder="Observaciones adicionales sobre la implementación..."
                      disabled={viewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.observacionesMpd?.length || 0} / 1000 caracteres
                    </p>
                  </div>

                  {/* Documento de evidencia (PDF) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Documento de evidencia (PDF)
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex-1 flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                        <Upload className="w-5 h-5 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formData.documentoFile ? formData.documentoFile.name : 'Seleccionar archivo'}
                        </span>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          disabled={viewMode}
                        />
                      </label>
                      {pdfUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setDocumentoActualUrl(pdfUrl);
                            setShowPdfViewer(true);
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Ver PDF
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Suba el documento de evidencia de la implementación en formato PDF (máximo 10 MB)
                    </p>
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
                      placeholder="https://www.entidad.gob.pe/tupa"
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
                      Cargo del responsable
                    </label>
                    <input
                      type="text"
                      name="cargoResponsableTupa"
                      value={formData.cargoResponsableTupa}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Cargo"
                      disabled={viewMode}
                    />
                  </div>

                  {/* Correo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo del responsable
                    </label>
                    <input
                      type="email"
                      name="correoResponsableTupa"
                      value={formData.correoResponsableTupa}
                      onChange={handleInputChange}
                      className={`input-field ${errores.correoResponsableTupa ? 'border-red-500' : ''}`}
                      placeholder="correo@entidad.gob.pe"
                      disabled={viewMode}
                    />
                    {errores.correoResponsableTupa && (
                      <p className="text-red-500 text-xs mt-1">{errores.correoResponsableTupa}</p>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono del responsable
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Documento de evidencia (PDF)
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex-1 flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                        <Upload className="w-5 h-5 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formData.documentoFile ? formData.documentoFile.name : 'Seleccionar archivo'}
                        </span>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          disabled={viewMode}
                        />
                      </label>
                      {pdfUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setDocumentoActualUrl(pdfUrl);
                            setShowPdfViewer(true);
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Ver PDF
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Suba el documento del TUPA en formato PDF (máximo 10 MB)
                    </p>
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
                      placeholder="correo@entidad.gob.pe"
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
                    <div className="flex items-center gap-3">
                      <label className="flex-1 flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                        <Upload className="w-5 h-5 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formData.documentoFile ? formData.documentoFile.name : 'Seleccionar archivo'}
                        </span>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          disabled={viewMode}
                        />
                      </label>
                      {pdfUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setDocumentoActualUrl(pdfUrl);
                            setShowPdfViewer(true);
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Ver PDF
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Suba el documento del MGD en formato PDF (máximo 10 MB)
                    </p>
                  </div>
                </div>
              </>
            ) : parseInt(formData.compromisoId) === 10 ? (
              // COMPROMISO 10: Datos Abiertos
              <>
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
                      placeholder="correo@entidad.gob.pe"
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
                    <div className="flex items-center gap-3">
                      <label className="flex-1 flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                        <Upload className="w-5 h-5 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formData.documentoFile ? formData.documentoFile.name : 'Seleccionar archivo'}
                        </span>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          disabled={viewMode}
                        />
                      </label>
                      {pdfUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setDocumentoActualUrl(pdfUrl);
                            setShowPdfViewer(true);
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Ver PDF
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Suba el documento de evidencia en formato PDF (máximo 10 MB)
                    </p>
                  </div>
                </div>
              </>
            ) : parseInt(formData.compromisoId) === 11 ? (
              // COMPROMISO 11: Aportación de Información Geoespacial al Proyecto GeoPerú
              <>
                <h2 className="text-base font-semibold text-gray-800 mb-3">Paso 1: Aportación de Información Geoespacial al Proyecto GeoPerú</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Fecha de Inicio */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de inicio <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fechaInicio"
                      value={formData.fechaInicio || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.fechaInicio ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    />
                    {errores.fechaInicio && (
                      <p className="text-red-500 text-xs mt-1">{errores.fechaInicio}</p>
                    )}
                  </div>

                  {/* Fecha de Fin */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de fin <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fechaFin"
                      value={formData.fechaFin || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.fechaFin ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    />
                    {errores.fechaFin && (
                      <p className="text-red-500 text-xs mt-1">{errores.fechaFin}</p>
                    )}
                  </div>

                  {/* Servicios Digitalizados */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Servicios digitalizados <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="serviciosDigitalizados"
                      value={formData.serviciosDigitalizados || ''}
                      onChange={handleInputChange}
                      min="0"
                      className={`input-field ${errores.serviciosDigitalizados ? 'border-red-500' : ''}`}
                      placeholder="0"
                      disabled={viewMode}
                    />
                    {errores.serviciosDigitalizados && (
                      <p className="text-red-500 text-xs mt-1">{errores.serviciosDigitalizados}</p>
                    )}
                  </div>

                  {/* Total de Servicios */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total de servicios <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="serviciosTotal"
                      value={formData.serviciosTotal || ''}
                      onChange={handleInputChange}
                      min="0"
                      className={`input-field ${errores.serviciosTotal ? 'border-red-500' : ''}`}
                      placeholder="0"
                      disabled={viewMode}
                    />
                    {errores.serviciosTotal && (
                      <p className="text-red-500 text-xs mt-1">{errores.serviciosTotal}</p>
                    )}
                  </div>

                  {/* Porcentaje de Digitalización */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Porcentaje de digitalización (%)
                    </label>
                    <input
                      type="number"
                      name="porcentajeDigitalizacion"
                      value={formData.porcentajeDigitalizacion || ''}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      step="0.01"
                      className={`input-field ${errores.porcentajeDigitalizacion ? 'border-red-500' : ''}`}
                      placeholder="0.00"
                      disabled={viewMode}
                    />
                    {errores.porcentajeDigitalizacion && (
                      <p className="text-red-500 text-xs mt-1">{errores.porcentajeDigitalizacion}</p>
                    )}
                  </div>

                  {/* Beneficiarios Estimados */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Beneficiarios estimados
                    </label>
                    <input
                      type="number"
                      name="beneficiariosEstimados"
                      value={formData.beneficiariosEstimados || ''}
                      onChange={handleInputChange}
                      min="0"
                      className={`input-field ${errores.beneficiariosEstimados ? 'border-red-500' : ''}`}
                      placeholder="0"
                      disabled={viewMode}
                    />
                    {errores.beneficiariosEstimados && (
                      <p className="text-red-500 text-xs mt-1">{errores.beneficiariosEstimados}</p>
                    )}
                  </div>

                  {/* Descripción */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion || ''}
                      onChange={handleInputChange}
                      maxLength="1000"
                      rows="3"
                      className={`input-field ${errores.descripcion ? 'border-red-500' : ''}`}
                      placeholder="Describa los detalles de la aportación..."
                      disabled={viewMode}
                    />
                    {errores.descripcion && (
                      <p className="text-red-500 text-xs mt-1">{errores.descripcion}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.descripcion?.length || 0} / 1000 caracteres
                    </p>
                  </div>

                  {/* Archivo del Plan (PDF) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Archivo del plan (PDF)
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex-1 flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                        <Upload className="w-5 h-5 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formData.documentoFile ? formData.documentoFile.name : 'Seleccionar archivo'}
                        </span>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          disabled={viewMode}
                        />
                      </label>
                      {pdfUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setDocumentoActualUrl(pdfUrl);
                            setShowPdfViewer(true);
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Ver PDF
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Suba el archivo del plan en formato PDF (máximo 10 MB)
                    </p>
                  </div>
                </div>
              </>
            ) : parseInt(formData.compromisoId) === 12 ? (
              // COMPROMISO 12: Responsable de Software Público
              <>
                <h2 className="text-base font-semibold text-gray-800 mb-3">Paso 1: Responsable de Software Público</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Fecha de Elaboración */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de elaboración <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fechaElaboracion"
                      value={formData.fechaElaboracion || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.fechaElaboracion ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    />
                    {errores.fechaElaboracion && (
                      <p className="text-red-500 text-xs mt-1">{errores.fechaElaboracion}</p>
                    )}
                  </div>

                  {/* Número de Documento */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de documento <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="numeroDocumento"
                      value={formData.numeroDocumento || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.numeroDocumento ? 'border-red-500' : ''}`}
                      placeholder="Ej: RES-001-2025"
                      disabled={viewMode}
                    />
                    {errores.numeroDocumento && (
                      <p className="text-red-500 text-xs mt-1">{errores.numeroDocumento}</p>
                    )}
                  </div>

                  {/* Fecha de Vigencia */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de vigencia
                    </label>
                    <input
                      type="date"
                      name="fechaVigencia"
                      value={formData.fechaVigencia || ''}
                      onChange={handleInputChange}
                      className={`input-field ${errores.fechaVigencia ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    />
                    {errores.fechaVigencia && (
                      <p className="text-red-500 text-xs mt-1">{errores.fechaVigencia}</p>
                    )}
                  </div>

                  {/* Espacio vacío para alineación */}
                  <div className=""></div>

                  {/* Descripción */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion || ''}
                      onChange={handleInputChange}
                      maxLength="1000"
                      rows="3"
                      className={`input-field ${errores.descripcion ? 'border-red-500' : ''}`}
                      placeholder="Describa las responsabilidades y funciones..."
                      disabled={viewMode}
                    />
                    {errores.descripcion && (
                      <p className="text-red-500 text-xs mt-1">{errores.descripcion}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.descripcion?.length || 0} / 1000 caracteres
                    </p>
                  </div>

                  {/* Requisitos de Seguridad */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Requisitos de seguridad <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="requisitosSeguridad"
                      value={formData.requisitosSeguridad || ''}
                      onChange={handleInputChange}
                      maxLength="1000"
                      rows="3"
                      className={`input-field ${errores.requisitosSeguridad ? 'border-red-500' : ''}`}
                      placeholder="Especifique los requisitos de seguridad..."
                      disabled={viewMode}
                    />
                    {errores.requisitosSeguridad && (
                      <p className="text-red-500 text-xs mt-1">{errores.requisitosSeguridad}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.requisitosSeguridad?.length || 0} / 1000 caracteres
                    </p>
                  </div>

                  {/* Requisitos de Privacidad */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Requisitos de privacidad <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="requisitosPrivacidad"
                      value={formData.requisitosPrivacidad || ''}
                      onChange={handleInputChange}
                      maxLength="1000"
                      rows="3"
                      className={`input-field ${errores.requisitosPrivacidad ? 'border-red-500' : ''}`}
                      placeholder="Especifique los requisitos de privacidad..."
                      disabled={viewMode}
                    />
                    {errores.requisitosPrivacidad && (
                      <p className="text-red-500 text-xs mt-1">{errores.requisitosPrivacidad}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.requisitosPrivacidad?.length || 0} / 1000 caracteres
                    </p>
                  </div>

                  {/* Archivo del Documento (PDF) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Archivo del documento (PDF)
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex-1 flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                        <Upload className="w-5 h-5 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formData.documentoFile ? formData.documentoFile.name : 'Seleccionar archivo'}
                        </span>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          disabled={viewMode}
                        />
                      </label>
                      {pdfUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setDocumentoActualUrl(pdfUrl);
                            setShowPdfViewer(true);
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Ver PDF
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Suba el archivo del documento en formato PDF (máximo 10 MB)
                    </p>
                  </div>
                </div>
              </>
            ) : parseInt(formData.compromisoId) === 13 ? (
              // COMPROMISO 13: Plan de Continuidad de PIDE
              <>
                <h2 className="text-base font-semibold text-gray-800 mb-3">Paso 1: Plan de Continuidad de PIDE</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Fecha de aprobación */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de aprobación <span className="text-red-500">*</span>
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

                  {/* Número de resolución */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de resolución <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="numeroResolucion"
                      value={formData.numeroResolucion}
                      onChange={handleInputChange}
                      className={`input-field ${errores.numeroResolucion ? 'border-red-500' : ''}`}
                      placeholder="Número de resolución"
                      disabled={viewMode}
                    />
                    {errores.numeroResolucion && (
                      <p className="text-red-500 text-xs mt-1">{errores.numeroResolucion}</p>
                    )}
                  </div>

                  {/* Fecha de revisión */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de revisión
                    </label>
                    <input
                      type="date"
                      name="fechaRevision"
                      value={formData.fechaRevision}
                      onChange={handleInputChange}
                      className="input-field"
                      disabled={viewMode}
                    />
                  </div>

                  {/* Responsable */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Responsable <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="responsable"
                      value={formData.responsable}
                      onChange={handleInputChange}
                      className={`input-field ${errores.responsable ? 'border-red-500' : ''}`}
                      placeholder="Nombre del responsable"
                      disabled={viewMode}
                    />
                    {errores.responsable && (
                      <p className="text-red-500 text-xs mt-1">{errores.responsable}</p>
                    )}
                  </div>

                  {/* Descripción */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      maxLength="1000"
                      rows="3"
                      className={`input-field ${errores.descripcion ? 'border-red-500' : ''}`}
                      placeholder="Descripción del plan..."
                      disabled={viewMode}
                    />
                    {errores.descripcion && (
                      <p className="text-red-500 text-xs mt-1">{errores.descripcion}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.descripcion?.length || 0} / 1000 caracteres
                    </p>
                  </div>

                  {/* Riesgos identificados */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Riesgos identificados
                    </label>
                    <textarea
                      name="riesgosIdentificados"
                      value={formData.riesgosIdentificados}
                      onChange={handleInputChange}
                      maxLength="1000"
                      rows="3"
                      className="input-field"
                      placeholder="Descripción de riesgos..."
                      disabled={viewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.riesgosIdentificados?.length || 0} / 1000 caracteres
                    </p>
                  </div>

                  {/* Estrategias de mitigación */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estrategias de mitigación
                    </label>
                    <textarea
                      name="estrategiasMitigacion"
                      value={formData.estrategiasMitigacion}
                      onChange={handleInputChange}
                      maxLength="1000"
                      rows="3"
                      className="input-field"
                      placeholder="Estrategias..."
                      disabled={viewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.estrategiasMitigacion?.length || 0} / 1000 caracteres
                    </p>
                  </div>

                  {/* Archivo del plan (PDF) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Archivo del plan (PDF)
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex-1 flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                        <Upload className="w-5 h-5 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formData.documentoFile ? formData.documentoFile.name : 'Seleccionar archivo'}
                        </span>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          disabled={viewMode}
                        />
                      </label>
                      {pdfUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setDocumentoActualUrl(pdfUrl);
                            setShowPdfViewer(true);
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Ver PDF
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Suba el plan de continuidad en formato PDF (máximo 10 MB)
                    </p>
                  </div>
                </div>
              </>
            ) : parseInt(formData.compromisoId) === 14 ? (
              // COMPROMISO 14: Oficial de Seguridad Digital
              <>
                <h2 className="text-base font-semibold text-gray-800 mb-3">Paso 1: Oficial de Seguridad Digital</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Fecha de elaboración */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de elaboración <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fechaElaboracion"
                      value={formData.fechaElaboracion}
                      onChange={handleInputChange}
                      className={`input-field ${errores.fechaElaboracion ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    />
                    {errores.fechaElaboracion && (
                      <p className="text-red-500 text-xs mt-1">{errores.fechaElaboracion}</p>
                    )}
                  </div>

                  {/* Número de documento */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de documento <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="numeroDocumento"
                      value={formData.numeroDocumento}
                      onChange={handleInputChange}
                      className={`input-field ${errores.numeroDocumento ? 'border-red-500' : ''}`}
                      placeholder="Número de documento"
                      disabled={viewMode}
                    />
                    {errores.numeroDocumento && (
                      <p className="text-red-500 text-xs mt-1">{errores.numeroDocumento}</p>
                    )}
                  </div>

                  {/* Fecha de vigencia */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de vigencia
                    </label>
                    <input
                      type="date"
                      name="fechaVigencia"
                      value={formData.fechaVigencia}
                      onChange={handleInputChange}
                      className="input-field"
                      disabled={viewMode}
                    />
                  </div>

                  {/* Descripción */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      maxLength="1000"
                      rows="3"
                      className={`input-field ${errores.descripcion ? 'border-red-500' : ''}`}
                      placeholder="Descripción..."
                      disabled={viewMode}
                    />
                    {errores.descripcion && (
                      <p className="text-red-500 text-xs mt-1">{errores.descripcion}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.descripcion?.length || 0} / 1000 caracteres
                    </p>
                  </div>

                  {/* Políticas de seguridad */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Políticas de seguridad
                    </label>
                    <textarea
                      name="politicasSeguridad"
                      value={formData.politicasSeguridad}
                      onChange={handleInputChange}
                      maxLength="1000"
                      rows="3"
                      className="input-field"
                      placeholder="Políticas de seguridad..."
                      disabled={viewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.politicasSeguridad?.length || 0} / 1000 caracteres
                    </p>
                  </div>

                  {/* Certificaciones */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Certificaciones
                    </label>
                    <textarea
                      name="certificaciones"
                      value={formData.certificaciones}
                      onChange={handleInputChange}
                      maxLength="1000"
                      rows="3"
                      className="input-field"
                      placeholder="Certificaciones..."
                      disabled={viewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.certificaciones?.length || 0} / 1000 caracteres
                    </p>
                  </div>

                  {/* Archivo de documento (PDF) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Archivo de documento (PDF)
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex-1 flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                        <Upload className="w-5 h-5 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formData.documentoFile ? formData.documentoFile.name : 'Seleccionar archivo'}
                        </span>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          disabled={viewMode}
                        />
                      </label>
                      {pdfUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setDocumentoActualUrl(pdfUrl);
                            setShowPdfViewer(true);
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Ver PDF
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Suba el documento en formato PDF (máximo 10 MB)
                    </p>
                  </div>
                </div>
              </>
            ) : parseInt(formData.compromisoId) === 15 ? (
              // COMPROMISO 15: CSIRT Institucional
              <>
                <h2 className="text-base font-semibold text-gray-800 mb-3">Paso 1: CSIRT Institucional</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Fecha de conformación */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de conformación <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fechaConformacion"
                      value={formData.fechaConformacion}
                      onChange={handleInputChange}
                      className={`input-field ${errores.fechaConformacion ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    />
                    {errores.fechaConformacion && (
                      <p className="text-red-500 text-xs mt-1">{errores.fechaConformacion}</p>
                    )}
                  </div>

                  {/* Número de resolución */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de resolución <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="numeroResolucion"
                      value={formData.numeroResolucion}
                      onChange={handleInputChange}
                      className={`input-field ${errores.numeroResolucion ? 'border-red-500' : ''}`}
                      placeholder="Número de resolución"
                      disabled={viewMode}
                    />
                    {errores.numeroResolucion && (
                      <p className="text-red-500 text-xs mt-1">{errores.numeroResolucion}</p>
                    )}
                  </div>

                  {/* Responsable */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Responsable <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="responsable"
                      value={formData.responsable}
                      onChange={handleInputChange}
                      className={`input-field ${errores.responsable ? 'border-red-500' : ''}`}
                      placeholder="Nombre del responsable"
                      disabled={viewMode}
                    />
                    {errores.responsable && (
                      <p className="text-red-500 text-xs mt-1">{errores.responsable}</p>
                    )}
                  </div>

                  {/* Correo electrónico */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo electrónico <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="emailContacto"
                      value={formData.emailContacto}
                      onChange={handleInputChange}
                      className={`input-field ${errores.emailContacto ? 'border-red-500' : ''}`}
                      placeholder="Correo electrónico"
                      disabled={viewMode}
                    />
                    {errores.emailContacto && (
                      <p className="text-red-500 text-xs mt-1">{errores.emailContacto}</p>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="text"
                      name="telefonoContacto"
                      value={formData.telefonoContacto}
                      onChange={handleInputChange}
                      className={`input-field ${errores.telefonoContacto ? 'border-red-500' : ''}`}
                      placeholder="Teléfono"
                      disabled={viewMode}
                    />
                    {errores.telefonoContacto && (
                      <p className="text-red-500 text-xs mt-1">{errores.telefonoContacto}</p>
                    )}
                  </div>

                  {/* Descripción */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      className={`input-field ${errores.descripcion ? 'border-red-500' : ''}`}
                      placeholder="Descripción"
                      rows="3"
                      disabled={viewMode}
                    />
                    {errores.descripcion && (
                      <p className="text-red-500 text-xs mt-1">{errores.descripcion}</p>
                    )}
                  </div>

                  {/* Observaciones */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observaciones 
                    </label>
                    <textarea
                      name="observaciones"
                      value={formData.observaciones}
                      onChange={handleInputChange}
                      maxLength="1000"
                      rows="3"
                      className="input-field"
                      placeholder="Observaciones..."
                      disabled={viewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.observaciones?.length || 0} / 1000 caracteres
                    </p>
                  </div>

                  {/* Documento de evidencia (PDF) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Documento de evidencia (PDF)
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex-1 flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                        <Upload className="w-5 h-5 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formData.documentoFile ? formData.documentoFile.name : 'Seleccionar archivo'}
                        </span>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          disabled={viewMode}
                        />
                      </label>
                      {pdfUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setDocumentoActualUrl(pdfUrl);
                            setShowPdfViewer(true);
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Ver PDF
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Suba el documento de evidencia en formato PDF (máximo 10 MB)
                    </p>
                  </div>
                </div>
              </>
            ) : parseInt(formData.compromisoId) === 16 ? (
              // COMPROMISO 16: Sistema de Gestión de Seguridad de la Información (SGSI)
              <>
                <h2 className="text-base font-semibold text-gray-800 mb-3">Paso 1: Sistema de Gestión de Seguridad de la Información (SGSI)</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nombre del responsable */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del responsable <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="responsableSgsi"
                      value={formData.responsableSgsi}
                      onChange={handleInputChange}
                      
                      className={`input-field ${errores.responsableSgsi ? 'border-red-500' : ''}`}
                      placeholder="Nombre del responsable"
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
                      name="cargoResponsable"
                      value={formData.cargoResponsable}
                      onChange={handleInputChange}
                      
                      className={`input-field ${errores.cargoResponsable ? 'border-red-500' : ''}`}
                      placeholder="Cargo"
                      disabled={viewMode}
                    />
                    {errores.cargoResponsable && (
                      <p className="text-red-500 text-xs mt-1">{errores.cargoResponsable}</p>
                    )}
                  </div>

                  {/* Correo electrónico */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo electrónico <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="correoResponsable"
                      value={formData.correoResponsable}
                      onChange={handleInputChange}
                      className={`input-field ${errores.correoResponsable ? 'border-red-500' : ''}`}
                      placeholder="Correo electrónico"
                      disabled={viewMode}
                    />
                    {errores.correoResponsable && (
                      <p className="text-red-500 text-xs mt-1">{errores.correoResponsable}</p>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono 
                    </label>
                    <input
                      type="text"
                      name="telefonoResponsable"
                      value={formData.telefonoResponsable}
                      onChange={handleInputChange}
                      
                      className={`input-field ${errores.telefonoResponsable ? 'border-red-500' : ''}`}
                      placeholder="Teléfono"
                      disabled={viewMode}
                    />
                    {errores.telefonoResponsable && (
                      <p className="text-red-500 text-xs mt-1">{errores.telefonoResponsable}</p>
                    )}
                  </div>

                  {/* Estado de implementación */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado de implementación <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="estadoImplementacion"
                      value={formData.estadoImplementacion}
                      onChange={handleInputChange}
                      className={`input-field ${errores.estadoImplementacion ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    >
                      <option value="">Seleccione...</option>
                        <option value="En planificación">En planificación</option>
                        <option value="En implementación">En implementación</option>
                        <option value="Implementado">Implementado</option>
                        <option value="Certificado">Certificado</option>
                    </select>
                    {errores.estadoImplementacion && (
                      <p className="text-red-500 text-xs mt-1">{errores.estadoImplementacion}</p>
                    )}
                  </div>

                  {/* Versión de la norma ISO */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Versión de la norma ISO <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="versionNorma"
                      value={formData.versionNorma}
                      onChange={handleInputChange}
                      
                      className={`input-field ${errores.versionNorma ? 'border-red-500' : ''}`}
                      placeholder="Versión de la norma ISO"
                      disabled={viewMode}
                    />
                    {errores.versionNorma && (
                      <p className="text-red-500 text-xs mt-1">{errores.versionNorma}</p>
                    )}
                  </div>

                  {/* Alcance del SGSI */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alcance del SGSI 
                    </label>
                    <textarea
                      name="alcanceSgsi"
                      value={formData.alcanceSgsi}
                      onChange={handleInputChange}
                      maxLength="1000"
                      rows="3"
                      className="input-field"
                      placeholder="Alcance del SGSI..."
                      disabled={viewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.alcanceSgsi?.length || 0} / 1000 caracteres
                    </p>
                  </div>

                  {/* Fecha de inicio */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de inicio <span className="text-red-500">*</span>
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


                  {/* Separador */}
                  <div className="md:col-span-2 border-t border-gray-200 my-2">
                    <h3 className="text-sm font-medium text-gray-700 mt-4 mb-3">Certificación</h3>
                  </div>

                  {/* ¿Certificación obtenida? */}
                  <div className="">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <input
                        type="checkbox"
                        name="certificacionObtenida"
                        checked={formData.certificacionObtenida || false}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        disabled={viewMode}
                      />
                      ¿Certificación obtenida?
                    </label>
                  </div>

                  {/* Entidad certificadora */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Entidad certificadora 
                    </label>
                    <input
                      type="text"
                      name="entidadCertificadora"
                      value={formData.entidadCertificadora}
                      onChange={handleInputChange}
                      
                      className={`input-field ${errores.entidadCertificadora ? 'border-red-500' : ''}`}
                      placeholder="Entidad certificadora"
                      disabled={viewMode}
                    />
                    {errores.entidadCertificadora && (
                      <p className="text-red-500 text-xs mt-1">{errores.entidadCertificadora}</p>
                    )}
                  </div>

                  {/* Observaciones */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observaciones 
                    </label>
                    <textarea
                      name="observaciones"
                      value={formData.observaciones}
                      onChange={handleInputChange}
                      maxLength="1000"
                      rows="3"
                      className="input-field"
                      placeholder="Observaciones..."
                      disabled={viewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.observaciones?.length || 0} / 1000 caracteres
                    </p>
                  </div>

                  {/* Documento de evidencia (PDF) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Documento de evidencia (PDF)
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex-1 flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                        <Upload className="w-5 h-5 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formData.documentoFile ? formData.documentoFile.name : 'Seleccionar archivo'}
                        </span>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          disabled={viewMode}
                        />
                      </label>
                      {pdfUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setDocumentoActualUrl(pdfUrl);
                            setShowPdfViewer(true);
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Ver PDF
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Suba el documento de evidencia en formato PDF (máximo 10 MB)
                    </p>
                  </div>
                </div>
              </>
            ) : parseInt(formData.compromisoId) === 17 ? (
              // COMPROMISO 17: Plan de Continuidad Operativa
              <>
                <h2 className="text-base font-semibold text-gray-800 mb-3">Paso 1: Plan de Continuidad Operativa</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nombre del responsable */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del responsable <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="responsablePlan"
                      value={formData.responsablePlan}
                      onChange={handleInputChange}
                      
                      className={`input-field ${errores.responsablePlan ? 'border-red-500' : ''}`}
                      placeholder="Nombre del responsable"
                      disabled={viewMode}
                    />
                    {errores.responsablePlan && (
                      <p className="text-red-500 text-xs mt-1">{errores.responsablePlan}</p>
                    )}
                  </div>

                  {/* Cargo */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cargo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cargoResponsable"
                      value={formData.cargoResponsable}
                      onChange={handleInputChange}
                      
                      className={`input-field ${errores.cargoResponsable ? 'border-red-500' : ''}`}
                      placeholder="Cargo"
                      disabled={viewMode}
                    />
                    {errores.cargoResponsable && (
                      <p className="text-red-500 text-xs mt-1">{errores.cargoResponsable}</p>
                    )}
                  </div>

                  {/* Correo electrónico */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo electrónico <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="correoResponsable"
                      value={formData.correoResponsable}
                      onChange={handleInputChange}
                      className={`input-field ${errores.correoResponsable ? 'border-red-500' : ''}`}
                      placeholder="Correo electrónico"
                      disabled={viewMode}
                    />
                    {errores.correoResponsable && (
                      <p className="text-red-500 text-xs mt-1">{errores.correoResponsable}</p>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono 
                    </label>
                    <input
                      type="text"
                      name="telefonoResponsable"
                      value={formData.telefonoResponsable}
                      onChange={handleInputChange}
                      
                      className={`input-field ${errores.telefonoResponsable ? 'border-red-500' : ''}`}
                      placeholder="Teléfono"
                      disabled={viewMode}
                    />
                    {errores.telefonoResponsable && (
                      <p className="text-red-500 text-xs mt-1">{errores.telefonoResponsable}</p>
                    )}
                  </div>

                  {/* Estado del plan */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado del plan <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="estadoPlan"
                      value={formData.estadoPlan}
                      onChange={handleInputChange}
                      className={`input-field ${errores.estadoPlan ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    >
                      <option value="">Seleccione...</option>
                        <option value="En formulación">En formulación</option>
                        <option value="Formulado">Formulado</option>
                        <option value="Aprobado">Aprobado</option>
                        <option value="En implementación">En implementación</option>
                        <option value="Implementado">Implementado</option>
                    </select>
                    {errores.estadoPlan && (
                      <p className="text-red-500 text-xs mt-1">{errores.estadoPlan}</p>
                    )}
                  </div>

                  {/* Fecha de formulación */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de formulación <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fechaFormulacion"
                      value={formData.fechaFormulacion}
                      onChange={handleInputChange}
                      className={`input-field ${errores.fechaFormulacion ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    />
                    {errores.fechaFormulacion && (
                      <p className="text-red-500 text-xs mt-1">{errores.fechaFormulacion}</p>
                    )}
                  </div>

                  {/* Fecha de aprobación */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de aprobación 
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

                  {/* Fecha de inicio de implementación */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de inicio de implementación 
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

                  {/* Fecha de fin prevista */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de fin prevista 
                    </label>
                    <input
                      type="date"
                      name="fechaFin"
                      value={formData.fechaFin}
                      onChange={handleInputChange}
                      className={`input-field ${errores.fechaFin ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    />
                    {errores.fechaFin && (
                      <p className="text-red-500 text-xs mt-1">{errores.fechaFin}</p>
                    )}
                  </div>

                  {/* Descripción del plan */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción del plan 
                    </label>
                    <textarea
                      name="descripcionPlan"
                      value={formData.descripcionPlan}
                      onChange={handleInputChange}
                      maxLength="1000"
                      rows="3"
                      className="input-field"
                      placeholder="Descripción del plan..."
                      disabled={viewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.descripcionPlan?.length || 0} / 1000 caracteres
                    </p>
                  </div>

                  {/* Observaciones */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observaciones 
                    </label>
                    <textarea
                      name="observaciones"
                      value={formData.observaciones}
                      onChange={handleInputChange}
                      maxLength="1000"
                      rows="3"
                      className="input-field"
                      placeholder="Observaciones..."
                      disabled={viewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.observaciones?.length || 0} / 1000 caracteres
                    </p>
                  </div>

                  {/* Documento de evidencia (PDF) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Documento de evidencia (PDF)
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex-1 flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                        <Upload className="w-5 h-5 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formData.documentoFile ? formData.documentoFile.name : 'Seleccionar archivo'}
                        </span>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          disabled={viewMode}
                        />
                      </label>
                      {pdfUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setDocumentoActualUrl(pdfUrl);
                            setShowPdfViewer(true);
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Ver PDF
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Suba el documento de evidencia en formato PDF (máximo 10 MB)
                    </p>
                  </div>
                </div>
              </>
            ) : parseInt(formData.compromisoId) === 18 ? (
              // COMPROMISO 18: Acceso al Portal de Transparencia Estándar (PTE)
              <>
                <h2 className="text-base font-semibold text-gray-800 mb-3">Paso 1: Acceso al Portal de Transparencia Estándar (PTE)</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nombre del responsable */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del responsable <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="responsableAcceso"
                      value={formData.responsableAcceso}
                      onChange={handleInputChange}
                      
                      className={`input-field ${errores.responsableAcceso ? 'border-red-500' : ''}`}
                      placeholder="Nombre del responsable"
                      disabled={viewMode}
                    />
                    {errores.responsableAcceso && (
                      <p className="text-red-500 text-xs mt-1">{errores.responsableAcceso}</p>
                    )}
                  </div>

                  {/* Cargo */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cargo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cargoResponsable"
                      value={formData.cargoResponsable}
                      onChange={handleInputChange}
                      
                      className={`input-field ${errores.cargoResponsable ? 'border-red-500' : ''}`}
                      placeholder="Cargo"
                      disabled={viewMode}
                    />
                    {errores.cargoResponsable && (
                      <p className="text-red-500 text-xs mt-1">{errores.cargoResponsable}</p>
                    )}
                  </div>

                  {/* Correo electrónico */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo electrónico <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="correoResponsable"
                      value={formData.correoResponsable}
                      onChange={handleInputChange}
                      className={`input-field ${errores.correoResponsable ? 'border-red-500' : ''}`}
                      placeholder="Correo electrónico"
                      disabled={viewMode}
                    />
                    {errores.correoResponsable && (
                      <p className="text-red-500 text-xs mt-1">{errores.correoResponsable}</p>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono 
                    </label>
                    <input
                      type="text"
                      name="telefonoResponsable"
                      value={formData.telefonoResponsable}
                      onChange={handleInputChange}
                      
                      className={`input-field ${errores.telefonoResponsable ? 'border-red-500' : ''}`}
                      placeholder="Teléfono"
                      disabled={viewMode}
                    />
                    {errores.telefonoResponsable && (
                      <p className="text-red-500 text-xs mt-1">{errores.telefonoResponsable}</p>
                    )}
                  </div>

                  {/* Número de oficio */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de oficio <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="numeroOficio"
                      value={formData.numeroOficio}
                      onChange={handleInputChange}
                      
                      className={`input-field ${errores.numeroOficio ? 'border-red-500' : ''}`}
                      placeholder="Número de oficio"
                      disabled={viewMode}
                    />
                    {errores.numeroOficio && (
                      <p className="text-red-500 text-xs mt-1">{errores.numeroOficio}</p>
                    )}
                  </div>

                  {/* Fecha de solicitud */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de solicitud <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fechaSolicitud"
                      value={formData.fechaSolicitud}
                      onChange={handleInputChange}
                      className={`input-field ${errores.fechaSolicitud ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    />
                    {errores.fechaSolicitud && (
                      <p className="text-red-500 text-xs mt-1">{errores.fechaSolicitud}</p>
                    )}
                  </div>

                  {/* Fecha de concesión */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de concesión 
                    </label>
                    <input
                      type="date"
                      name="fechaConcesion"
                      value={formData.fechaConcesion}
                      onChange={handleInputChange}
                      className={`input-field ${errores.fechaConcesion ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    />
                    {errores.fechaConcesion && (
                      <p className="text-red-500 text-xs mt-1">{errores.fechaConcesion}</p>
                    )}
                  </div>

                  {/* Estado del acceso */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado del acceso <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="estadoAcceso"
                      value={formData.estadoAcceso}
                      onChange={handleInputChange}
                      className={`input-field ${errores.estadoAcceso ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    >
                      <option value="">Seleccione...</option>
                        <option value="Solicitado">Solicitado</option>
                        <option value="En proceso">En proceso</option>
                        <option value="Concedido">Concedido</option>
                        <option value="Denegado">Denegado</option>
                    </select>
                    {errores.estadoAcceso && (
                      <p className="text-red-500 text-xs mt-1">{errores.estadoAcceso}</p>
                    )}
                  </div>

                  {/* Enlace al portal */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Enlace al portal 
                    </label>
                    <input
                      type="url"
                      name="enlacePortal"
                      value={formData.enlacePortal}
                      onChange={handleInputChange}
                      className={`input-field ${errores.enlacePortal ? 'border-red-500' : ''}`}
                      placeholder="https://..."
                      disabled={viewMode}
                    />
                    {errores.enlacePortal && (
                      <p className="text-red-500 text-xs mt-1">{errores.enlacePortal}</p>
                    )}
                  </div>

                  {/* Descripción */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción 
                    </label>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      maxLength="1000"
                      rows="3"
                      className="input-field"
                      placeholder="Descripción..."
                      disabled={viewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.descripcion?.length || 0} / 1000 caracteres
                    </p>
                  </div>

                  {/* Observaciones */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observaciones 
                    </label>
                    <textarea
                      name="observaciones"
                      value={formData.observaciones}
                      onChange={handleInputChange}
                      maxLength="1000"
                      rows="3"
                      className="input-field"
                      placeholder="Observaciones..."
                      disabled={viewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.observaciones?.length || 0} / 1000 caracteres
                    </p>
                  </div>

                  {/* Documento de evidencia (PDF) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Documento de evidencia (PDF)
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex-1 flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                        <Upload className="w-5 h-5 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formData.documentoFile ? formData.documentoFile.name : 'Seleccionar archivo'}
                        </span>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          disabled={viewMode}
                        />
                      </label>
                      {pdfUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setDocumentoActualUrl(pdfUrl);
                            setShowPdfViewer(true);
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Ver PDF
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Suba el documento de evidencia en formato PDF (máximo 10 MB)
                    </p>
                  </div>
                </div>
              </>
            ) : parseInt(formData.compromisoId) === 19 ? (
              // COMPROMISO 19: Encuesta Nacional de Gobierno Digital
              <>
                <h2 className="text-base font-semibold text-gray-800 mb-3">Paso 1: Encuesta Nacional de Gobierno Digital</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Año de la encuesta */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Año de la encuesta <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="anioEncuesta"
                      value={formData.anioEncuesta}
                      onChange={handleInputChange}
                      min="0"
                      className={`input-field ${errores.anioEncuesta ? 'border-red-500' : ''}`}
                      placeholder="0"
                      disabled={viewMode}
                    />
                    {errores.anioEncuesta && (
                      <p className="text-red-500 text-xs mt-1">{errores.anioEncuesta}</p>
                    )}
                  </div>

                  {/* Nombre del responsable */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del responsable <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="responsableEncuesta"
                      value={formData.responsableEncuesta}
                      onChange={handleInputChange}
                      
                      className={`input-field ${errores.responsableEncuesta ? 'border-red-500' : ''}`}
                      placeholder="Nombre del responsable"
                      disabled={viewMode}
                    />
                    {errores.responsableEncuesta && (
                      <p className="text-red-500 text-xs mt-1">{errores.responsableEncuesta}</p>
                    )}
                  </div>

                  {/* Cargo */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cargo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cargoResponsable"
                      value={formData.cargoResponsable}
                      onChange={handleInputChange}
                      
                      className={`input-field ${errores.cargoResponsable ? 'border-red-500' : ''}`}
                      placeholder="Cargo"
                      disabled={viewMode}
                    />
                    {errores.cargoResponsable && (
                      <p className="text-red-500 text-xs mt-1">{errores.cargoResponsable}</p>
                    )}
                  </div>

                  {/* Correo electrónico */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo electrónico <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="correoResponsable"
                      value={formData.correoResponsable}
                      onChange={handleInputChange}
                      className={`input-field ${errores.correoResponsable ? 'border-red-500' : ''}`}
                      placeholder="Correo electrónico"
                      disabled={viewMode}
                    />
                    {errores.correoResponsable && (
                      <p className="text-red-500 text-xs mt-1">{errores.correoResponsable}</p>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono 
                    </label>
                    <input
                      type="text"
                      name="telefonoResponsable"
                      value={formData.telefonoResponsable}
                      onChange={handleInputChange}
                      
                      className={`input-field ${errores.telefonoResponsable ? 'border-red-500' : ''}`}
                      placeholder="Teléfono"
                      disabled={viewMode}
                    />
                    {errores.telefonoResponsable && (
                      <p className="text-red-500 text-xs mt-1">{errores.telefonoResponsable}</p>
                    )}
                  </div>

                  {/* Fecha de envío */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de envío <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fechaEnvio"
                      value={formData.fechaEnvio}
                      onChange={handleInputChange}
                      className={`input-field ${errores.fechaEnvio ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    />
                    {errores.fechaEnvio && (
                      <p className="text-red-500 text-xs mt-1">{errores.fechaEnvio}</p>
                    )}
                  </div>

                  {/* Estado de la encuesta */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado de la encuesta <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="estadoEncuesta"
                      value={formData.estadoEncuesta}
                      onChange={handleInputChange}
                      className={`input-field ${errores.estadoEncuesta ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    >
                      <option value="">Seleccione...</option>
                        <option value="No iniciada">No iniciada</option>
                        <option value="En proceso">En proceso</option>
                        <option value="Completada">Completada</option>
                        <option value="Enviada">Enviada</option>
                    </select>
                    {errores.estadoEncuesta && (
                      <p className="text-red-500 text-xs mt-1">{errores.estadoEncuesta}</p>
                    )}
                  </div>

                  {/* Enlace a la encuesta */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Enlace a la encuesta 
                    </label>
                    <input
                      type="url"
                      name="enlaceEncuesta"
                      value={formData.enlaceEncuesta}
                      onChange={handleInputChange}
                      className={`input-field ${errores.enlaceEncuesta ? 'border-red-500' : ''}`}
                      placeholder="https://..."
                      disabled={viewMode}
                    />
                    {errores.enlaceEncuesta && (
                      <p className="text-red-500 text-xs mt-1">{errores.enlaceEncuesta}</p>
                    )}
                  </div>

                  {/* Observaciones */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observaciones 
                    </label>
                    <textarea
                      name="observaciones"
                      value={formData.observaciones}
                      onChange={handleInputChange}
                      maxLength="1000"
                      rows="3"
                      className="input-field"
                      placeholder="Observaciones..."
                      disabled={viewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.observaciones?.length || 0} / 1000 caracteres
                    </p>
                  </div>

                  {/* Documento de evidencia (PDF) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Documento de evidencia (PDF)
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex-1 flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                        <Upload className="w-5 h-5 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formData.documentoFile ? formData.documentoFile.name : 'Seleccionar archivo'}
                        </span>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          disabled={viewMode}
                        />
                      </label>
                      {pdfUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setDocumentoActualUrl(pdfUrl);
                            setShowPdfViewer(true);
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Ver PDF
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Suba el documento de evidencia en formato PDF (máximo 10 MB)
                    </p>
                  </div>
                </div>
              </>
            ) : parseInt(formData.compromisoId) === 20 ? (
              // COMPROMISO 20: Digitalización de Servicios y Trámites
              <>
                <h2 className="text-base font-semibold text-gray-800 mb-3">Paso 1: Digitalización de Servicios y Trámites</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nombre del responsable */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del responsable <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="responsableDigitalizacion"
                      value={formData.responsableDigitalizacion}
                      onChange={handleInputChange}
                      
                      className={`input-field ${errores.responsableDigitalizacion ? 'border-red-500' : ''}`}
                      placeholder="Nombre del responsable"
                      disabled={viewMode}
                    />
                    {errores.responsableDigitalizacion && (
                      <p className="text-red-500 text-xs mt-1">{errores.responsableDigitalizacion}</p>
                    )}
                  </div>

                  {/* Cargo */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cargo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cargoResponsable"
                      value={formData.cargoResponsable}
                      onChange={handleInputChange}
                      
                      className={`input-field ${errores.cargoResponsable ? 'border-red-500' : ''}`}
                      placeholder="Cargo"
                      disabled={viewMode}
                    />
                    {errores.cargoResponsable && (
                      <p className="text-red-500 text-xs mt-1">{errores.cargoResponsable}</p>
                    )}
                  </div>

                  {/* Correo electrónico */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo electrónico <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="correoResponsable"
                      value={formData.correoResponsable}
                      onChange={handleInputChange}
                      className={`input-field ${errores.correoResponsable ? 'border-red-500' : ''}`}
                      placeholder="Correo electrónico"
                      disabled={viewMode}
                    />
                    {errores.correoResponsable && (
                      <p className="text-red-500 text-xs mt-1">{errores.correoResponsable}</p>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono 
                    </label>
                    <input
                      type="text"
                      name="telefonoResponsable"
                      value={formData.telefonoResponsable}
                      onChange={handleInputChange}
                      
                      className={`input-field ${errores.telefonoResponsable ? 'border-red-500' : ''}`}
                      placeholder="Teléfono"
                      disabled={viewMode}
                    />
                    {errores.telefonoResponsable && (
                      <p className="text-red-500 text-xs mt-1">{errores.telefonoResponsable}</p>
                    )}
                  </div>

                  {/* Estado de implementación */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado de implementación <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="estadoImplementacion"
                      value={formData.estadoImplementacion}
                      onChange={handleInputChange}
                      className={`input-field ${errores.estadoImplementacion ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    >
                      <option value="">Seleccione...</option>
                        <option value="No iniciado">No iniciado</option>
                        <option value="En planificación">En planificación</option>
                        <option value="En implementación">En implementación</option>
                        <option value="Implementado">Implementado</option>
                    </select>
                    {errores.estadoImplementacion && (
                      <p className="text-red-500 text-xs mt-1">{errores.estadoImplementacion}</p>
                    )}
                  </div>

                  {/* Fecha de inicio */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de inicio <span className="text-red-500">*</span>
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

                  {/* Último avance reportado */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Último avance reportado 
                    </label>
                    <input
                      type="date"
                      name="ultimoAvance"
                      value={formData.ultimoAvance}
                      onChange={handleInputChange}
                      className={`input-field ${errores.ultimoAvance ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    />
                    {errores.ultimoAvance && (
                      <p className="text-red-500 text-xs mt-1">{errores.ultimoAvance}</p>
                    )}
                  </div>

                  {/* Total de servicios digitalizados */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total de servicios digitalizados 
                    </label>
                    <input
                      type="number"
                      name="totalServicios"
                      value={formData.totalServicios}
                      onChange={handleInputChange}
                      min="0"
                      className={`input-field ${errores.totalServicios ? 'border-red-500' : ''}`}
                      placeholder="0"
                      disabled={viewMode}
                    />
                    {errores.totalServicios && (
                      <p className="text-red-500 text-xs mt-1">{errores.totalServicios}</p>
                    )}
                  </div>

                  {/* Observaciones */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observaciones 
                    </label>
                    <textarea
                      name="observaciones"
                      value={formData.observaciones}
                      onChange={handleInputChange}
                      maxLength="1000"
                      rows="3"
                      className="input-field"
                      placeholder="Observaciones..."
                      disabled={viewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.observaciones?.length || 0} / 1000 caracteres
                    </p>
                  </div>

                  {/* Documento de evidencia (PDF) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Documento de evidencia (PDF)
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex-1 flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                        <Upload className="w-5 h-5 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formData.documentoFile ? formData.documentoFile.name : 'Seleccionar archivo'}
                        </span>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          disabled={viewMode}
                        />
                      </label>
                      {pdfUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setDocumentoActualUrl(pdfUrl);
                            setShowPdfViewer(true);
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Ver PDF
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Suba el documento de evidencia en formato PDF (máximo 10 MB)
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
                      name="dniOficial"
                      value={formData.dniOficial}
                      onChange={handleInputChange}
                      maxLength="8"
                      className={`input-field ${errores.dniOficial ? 'border-red-500' : ''}`}
                      placeholder="DNI"
                      disabled={viewMode}
                    />
                    {errores.dniOficial && (
                      <p className="text-red-500 text-xs mt-1">{errores.dniOficial}</p>
                    )}
                  </div>

                  {/* Nombres */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombres <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nombresOficial"
                      value={formData.nombresOficial}
                      onChange={handleInputChange}
                      
                      className={`input-field ${errores.nombresOficial ? 'border-red-500' : ''}`}
                      placeholder="Nombres"
                      disabled={viewMode}
                    />
                    {errores.nombresOficial && (
                      <p className="text-red-500 text-xs mt-1">{errores.nombresOficial}</p>
                    )}
                  </div>

                  {/* Apellido paterno */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido paterno <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="apellidoPaternoOficial"
                      value={formData.apellidoPaternoOficial}
                      onChange={handleInputChange}
                      
                      className={`input-field ${errores.apellidoPaternoOficial ? 'border-red-500' : ''}`}
                      placeholder="Apellido paterno"
                      disabled={viewMode}
                    />
                    {errores.apellidoPaternoOficial && (
                      <p className="text-red-500 text-xs mt-1">{errores.apellidoPaternoOficial}</p>
                    )}
                  </div>

                  {/* Apellido materno */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido materno <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="apellidoMaternoOficial"
                      value={formData.apellidoMaternoOficial}
                      onChange={handleInputChange}
                      
                      className={`input-field ${errores.apellidoMaternoOficial ? 'border-red-500' : ''}`}
                      placeholder="Apellido materno"
                      disabled={viewMode}
                    />
                    {errores.apellidoMaternoOficial && (
                      <p className="text-red-500 text-xs mt-1">{errores.apellidoMaternoOficial}</p>
                    )}
                  </div>

                  {/* Cargo */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cargo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cargoOficial"
                      value={formData.cargoOficial}
                      onChange={handleInputChange}
                      
                      className={`input-field ${errores.cargoOficial ? 'border-red-500' : ''}`}
                      placeholder="Cargo"
                      disabled={viewMode}
                    />
                    {errores.cargoOficial && (
                      <p className="text-red-500 text-xs mt-1">{errores.cargoOficial}</p>
                    )}
                  </div>

                  {/* Correo electrónico */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo electrónico <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="correoOficial"
                      value={formData.correoOficial}
                      onChange={handleInputChange}
                      className={`input-field ${errores.correoOficial ? 'border-red-500' : ''}`}
                      placeholder="Correo electrónico"
                      disabled={viewMode}
                    />
                    {errores.correoOficial && (
                      <p className="text-red-500 text-xs mt-1">{errores.correoOficial}</p>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono 
                    </label>
                    <input
                      type="text"
                      name="telefonoOficial"
                      value={formData.telefonoOficial}
                      onChange={handleInputChange}
                      
                      className={`input-field ${errores.telefonoOficial ? 'border-red-500' : ''}`}
                      placeholder="Teléfono"
                      disabled={viewMode}
                    />
                    {errores.telefonoOficial && (
                      <p className="text-red-500 text-xs mt-1">{errores.telefonoOficial}</p>
                    )}
                  </div>

                  {/* Fecha de designación */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de designación <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fechaDesignacion"
                      value={formData.fechaDesignacion}
                      onChange={handleInputChange}
                      className={`input-field ${errores.fechaDesignacion ? 'border-red-500' : ''}`}
                      disabled={viewMode}
                    />
                    {errores.fechaDesignacion && (
                      <p className="text-red-500 text-xs mt-1">{errores.fechaDesignacion}</p>
                    )}
                  </div>

                  {/* Resolución de designación */}
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Resolución de designación <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="resolucionDesignacion"
                      value={formData.resolucionDesignacion}
                      onChange={handleInputChange}
                      
                      className={`input-field ${errores.resolucionDesignacion ? 'border-red-500' : ''}`}
                      placeholder="Resolución de designación"
                      disabled={viewMode}
                    />
                    {errores.resolucionDesignacion && (
                      <p className="text-red-500 text-xs mt-1">{errores.resolucionDesignacion}</p>
                    )}
                  </div>

                  {/* ¿Comunicada a la SGTD? */}
                  <div className="">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <input
                        type="checkbox"
                        name="comunicadaSgtd"
                        checked={formData.comunicadaSgtd || false}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        disabled={viewMode}
                      />
                      ¿Comunicada a la SGTD?
                    </label>
                  </div>

                  {/* Observaciones */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observaciones 
                    </label>
                    <textarea
                      name="observaciones"
                      value={formData.observaciones}
                      onChange={handleInputChange}
                      maxLength="1000"
                      rows="3"
                      className="input-field"
                      placeholder="Observaciones..."
                      disabled={viewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.observaciones?.length || 0} / 1000 caracteres
                    </p>
                  </div>

                  {/* Documento de evidencia (PDF) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Documento de evidencia (PDF)
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex-1 flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                        <Upload className="w-5 h-5 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formData.documentoFile ? formData.documentoFile.name : 'Seleccionar archivo'}
                        </span>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          disabled={viewMode}
                        />
                      </label>
                      {pdfUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setDocumentoActualUrl(pdfUrl);
                            setShowPdfViewer(true);
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Ver PDF
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Suba el documento de evidencia en formato PDF (máximo 10 MB)
                    </p>
                  </div>
                </div>
              </>
            ) : (
              // COMPROMISO 1 y OTROS: Datos del Líder
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
                  placeholder="ejemplo@gob.pe"
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
            )}
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
                        {formData.documentoFile ? formData.documentoFile.name : 'Documento cargado'}
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
                    onClick={() => setShowPdfViewer(true)}
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
                <div className="space-y-3">
                  {compromisoSeleccionado.criteriosEvaluacion
                    .filter(criterio => criterio.activo)
                    .map((criterio, index) => {
                      const criterioEvaluado = formData.criteriosEvaluados.find(c => c.criterioId === criterio.criterioEvaluacionId);
                      return (
                        <div key={criterio.criterioEvaluacionId}>
                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={criterioEvaluado?.cumple || false}
                              onChange={(e) => {
                                const criteriosActualizados = formData.criteriosEvaluados.filter(c => c.criterioId !== criterio.criterioEvaluacionId);
                                if (e.target.checked) {
                                  criteriosActualizados.push({ criterioId: criterio.criterioEvaluacionId, cumple: true });
                                }
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

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Check className="text-green-600" size={20} />
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

            {/* Resumen */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Resumen de la Información</h3>
              
              {/* Para Compromiso 2: mostrar detalle de miembros */}
              {formData.compromisoId === '2' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-600">Compromiso:</div>
                    <div className="font-medium">
                      {compromisoSeleccionado?.nombreCompromiso || '-'}
                    </div>
                    <div className="text-gray-600">Documento:</div>
                    <div className="font-medium">{pdfUrl ? 'Adjuntado ✓' : 'No adjuntado'}</div>
                  </div>
                  
                  <div>
                    <div className="text-gray-600 font-medium mb-2">Miembros del Comité ({miembrosComite.length}):</div>
                    {miembrosComite.length > 0 ? (
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {miembrosComite.map((miembro, index) => (
                          <div key={miembro.miembroId || index} className="bg-white p-3 rounded border border-gray-200 text-sm">
                            <div className="font-medium text-gray-800">
                              {`${miembro.nombre} ${miembro.apellidoPaterno} ${miembro.apellidoMaterno}`}
                            </div>
                            <div className="text-gray-600 mt-1">
                              <span className="inline-block mr-4">DNI: {miembro.dni}</span>
                              <span className="inline-block">Rol: {miembro.rol}</span>
                            </div>
                            {miembro.cargo && (
                              <div className="text-gray-600 text-xs mt-1">Cargo: {miembro.cargo}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm italic">No hay miembros registrados</div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-600">Compromiso:</div>
                  <div className="font-medium">
                    {compromisoSeleccionado?.nombreCompromiso || '-'}
                  </div>
                  <div className="text-gray-600">Líder:</div>
                  <div className="font-medium">
                    {`${formData.nombres} ${formData.apellidoPaterno} ${formData.apellidoMaterno}`.trim() || '-'}
                  </div>
                  <div className="text-gray-600">DNI:</div>
                  <div className="font-medium">{formData.nroDni || '-'}</div>
                  <div className="text-gray-600">Correo:</div>
                  <div className="font-medium">{formData.correoElectronico || '-'}</div>
                  <div className="text-gray-600">Documento:</div>
                  <div className="font-medium">{pdfUrl ? 'Adjuntado ✓' : 'No adjuntado'}</div>
                </div>
              )}
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
                      {isEdit ? 'Actualizar' : 'Guardar'}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {miembroActual.miembroId ? 'Editar' : 'Nuevo'} Miembro del Comité
            </h3>
            
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="ejemplo@gob.pe"
                />
                {miembroActual.email && !miembroActual.email.endsWith('@gob.pe') && (
                  <p className="text-xs text-red-500 mt-1">El correo debe ser del dominio @gob.pe</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={miembroActual.telefono}
                  onChange={(e) => setMiembroActual({ ...miembroActual, telefono: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="987654321"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
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

                  // Validar email dominio @gob.pe
                  if (!miembroActual.email.endsWith('@gob.pe')) {
                    showErrorToast('El correo debe ser del dominio @gob.pe');
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
                    // Agregar nuevo
                    setMiembrosComite([...miembrosComite, miembroActual]);
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
