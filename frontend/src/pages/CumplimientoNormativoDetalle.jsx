import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import cumplimientoService from '../services/cumplimientoService';
import com1LiderGTDService from '../services/com1LiderGTDService';
import com2CGTDService from '../services/com2CGTDService';
import { compromisosService } from '../services/compromisosService';
import { showSuccessToast, showErrorToast, showConfirmToast } from '../utils/toast';
import PDFViewer from '../components/PDFViewer';
import { FileText, Upload, X, Check, AlertCircle, ChevronLeft, ChevronRight, Save, Eye, ExternalLink, Plus, Trash2 } from 'lucide-react';
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
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [documentoActualUrl, setDocumentoActualUrl] = useState(null); // URL del documento que se está viendo
  const [haVistoPolitica, setHaVistoPolitica] = useState(false);
  const [haVistoDeclaracion, setHaVistoDeclaracion] = useState(false);

  // URLs de los documentos en Supabase Storage
  const POLITICA_PRIVACIDAD_URL = 'https://amzwfwfhllwhjffkqxhn.supabase.co/storage/v1/object/public/cumplimiento-documentos/politicas/politica-privacidad.pdf';
  const DECLARACION_JURADA_URL = 'https://amzwfwfhllwhjffkqxhn.supabase.co/storage/v1/object/public/cumplimiento-documentos/politicas/declaracion-jurada.pdf';

  // Formulario con los 3 pasos
  const [formData, setFormData] = useState({
    // Paso 1: Datos Generales
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

  useEffect(() => {
    loadCompromisos();
    // Cargar datos si está editando O si es Compromiso 1 o 2 (que usan tablas especiales)
    if (isEdit || (['1', '2'].includes(compromisoIdFromUrl) && user?.entidadId)) {
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
      
      // Caso genérico para otros compromisos
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
      } else {
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
        if (!formData.rol) nuevosErrores.rol = 'Ingrese el rol';
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

      // Primero subir el documento si hay uno nuevo en el paso 2
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
        // Si tenemos blob URL pero no archivo nuevo, no enviar nada
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
              {compromisoSeleccionado.nombreCompromiso}
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
            {parseInt(formData.compromisoId) === 2 ? (
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
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setMiembrosComite(miembrosComite.filter((_, i) => i !== index));
                                    }}
                                    className="text-red-600 hover:text-red-800"
                                    title="Eliminar"
                                  >
                                    <Trash2 size={16} />
                                  </button>
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
                <input
                  type="text"
                  name="rol"
                  value={formData.rol}
                  onChange={handleInputChange}
                  className={`input-field ${errores.rol ? 'border-red-500' : ''}`}
                  placeholder="Responsable de Tecnología"
                  disabled={viewMode}
                />
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
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Compromiso:</div>
                <div className="font-medium">
                  {compromisoSeleccionado?.nombreCompromiso || '-'}
                </div>
                <div className="text-gray-600">Líder:</div>
                <div className="font-medium">
                  {`${formData.nombres} ${formData.apellidoPaterno} ${formData.apellidoMaterno}`}
                </div>
                <div className="text-gray-600">DNI:</div>
                <div className="font-medium">{formData.nroDni}</div>
                <div className="text-gray-600">Correo:</div>
                <div className="font-medium">{formData.correoElectronico}</div>
                <div className="text-gray-600">Documento:</div>
                <div className="font-medium">{pdfUrl ? 'Adjuntado ✓' : 'No adjuntado'}</div>
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
                  onChange={(e) => setMiembroActual({ ...miembroActual, dni: e.target.value })}
                  maxLength="8"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="12345678"
                />
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
                >
                  <option value="">Seleccionar...</option>
                  <option value="Presidente">Presidente</option>
                  <option value="Vicepresidente">Vicepresidente</option>
                  <option value="Secretario Técnico">Secretario Técnico</option>
                  <option value="Miembro">Miembro</option>
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

                  // Agregar o actualizar miembro
                  const index = miembrosComite.findIndex(m => m.miembroId === miembroActual.miembroId);
                  if (index >= 0) {
                    // Actualizar existente
                    const nuevos = [...miembrosComite];
                    nuevos[index] = miembroActual;
                    setMiembrosComite(nuevos);
                  } else {
                    // Agregar nuevo
                    setMiembrosComite([...miembrosComite, miembroActual]);
                  }
                  
                  setShowModalMiembro(false);
                  showSuccessToast('Miembro agregado exitosamente');
                }}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CumplimientoNormativoDetalle;
