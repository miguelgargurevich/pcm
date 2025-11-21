import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import cumplimientoService from '../services/cumplimientoService';
import { compromisosService } from '../services/compromisosService';
import { showSuccessToast, showErrorToast, showConfirmToast } from '../utils/toast';
import PDFViewer from '../components/PDFViewer';
import { FileText, Upload, X, Check, AlertCircle, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const CumplimientoNormativoDetalle = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = !!id;
  const compromisoIdFromUrl = searchParams.get('compromiso');

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [pasoActual, setPasoActual] = useState(1);
  
  const [compromisos, setCompromisos] = useState([]);
  const [compromisoSeleccionado, setCompromisoSeleccionado] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showPdfViewer, setShowPdfViewer] = useState(false);

  // Formulario con los 3 pasos
  const [formData, setFormData] = useState({
    // Paso 1: Datos Generales
    compromisoId: '',
    nroDni: '',
    nombres: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correo: '',
    telefono: '',
    rol: '',
    cargo: '',
    fechaInicio: '',
    
    // Paso 2: Normativa
    documentoFile: null,
    validacion1: false,
    validacion2: false,
    validacion3: false,
    validacion4: false,
    
    // Paso 3: Confirmación
    aceptaPolitica: false,
    aceptaDeclaracion: false,
    
    // Estado
    estado: 1 // Por defecto bandeja
  });

  const [errores, setErrores] = useState({});

  useEffect(() => {
    loadCompromisos();
    if (isEdit) {
      loadCumplimiento();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
      }
    } catch (error) {
      console.error('Error al cargar compromisos:', error);
      showErrorToast('Error al cargar compromisos');
    }
  };

  const loadCumplimiento = async () => {
    try {
      setLoading(true);
      const response = await cumplimientoService.getById(id);
      
      if (response.isSuccess || response.IsSuccess) {
        const data = response.data || response.Data;
        setFormData({
          compromisoId: data.compromisoId || '',
          nroDni: data.nroDni || '',
          nombres: data.nombres || '',
          apellidoPaterno: data.apellidoPaterno || '',
          apellidoMaterno: data.apellidoMaterno || '',
          correo: data.correo || '',
          telefono: data.telefono || '',
          rol: data.rol || '',
          cargo: data.cargo || '',
          fechaInicio: data.fechaInicio ? data.fechaInicio.split('T')[0] : '',
          documentoFile: null,
          validacion1: data.validacion1 || false,
          validacion2: data.validacion2 || false,
          validacion3: data.validacion3 || false,
          validacion4: data.validacion4 || false,
          aceptaPolitica: data.aceptaPolitica || false,
          aceptaDeclaracion: data.aceptaDeclaracion || false,
          estado: data.estado || 1
        });

        // Si hay documento, establecer la URL
        if (data.documentoUrl) {
          setPdfUrl(data.documentoUrl);
        }

        // Establecer el compromiso seleccionado
        const compromiso = compromisos.find(c => c.compromisoId === data.compromisoId);
        if (compromiso) {
          setCompromisoSeleccionado(compromiso);
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

      setFormData(prev => ({ ...prev, documentoFile: file }));
      
      // Vista previa del PDF
      const fileUrl = URL.createObjectURL(file);
      setPdfUrl(fileUrl);
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
      if (!formData.nroDni) nuevosErrores.nroDni = 'Ingrese el DNI';
      if (formData.nroDni && formData.nroDni.length !== 8) nuevosErrores.nroDni = 'El DNI debe tener 8 dígitos';
      if (!formData.nombres) nuevosErrores.nombres = 'Ingrese los nombres';
      if (!formData.apellidoPaterno) nuevosErrores.apellidoPaterno = 'Ingrese el apellido paterno';
      if (!formData.apellidoMaterno) nuevosErrores.apellidoMaterno = 'Ingrese el apellido materno';
      if (!formData.correo) nuevosErrores.correo = 'Ingrese el correo';
      if (formData.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
        nuevosErrores.correo = 'Ingrese un correo válido';
      }
      if (!formData.telefono) nuevosErrores.telefono = 'Ingrese el teléfono';
      if (!formData.rol) nuevosErrores.rol = 'Ingrese el rol';
      if (!formData.cargo) nuevosErrores.cargo = 'Ingrese el cargo';
      if (!formData.fechaInicio) nuevosErrores.fechaInicio = 'Seleccione la fecha de inicio';
    }

    if (paso === 2) {
      if (!isEdit && !formData.documentoFile && !pdfUrl) {
        nuevosErrores.documentoFile = 'Debe adjuntar el documento normativo (PDF)';
      }
      if (!formData.validacion1) nuevosErrores.validacion1 = 'Debe aceptar esta validación';
      if (!formData.validacion2) nuevosErrores.validacion2 = 'Debe aceptar esta validación';
      if (!formData.validacion3) nuevosErrores.validacion3 = 'Debe aceptar esta validación';
      if (!formData.validacion4) nuevosErrores.validacion4 = 'Debe aceptar esta validación';
    }

    if (paso === 3) {
      if (!formData.aceptaPolitica) nuevosErrores.aceptaPolitica = 'Debe aceptar la política de privacidad';
      if (!formData.aceptaDeclaracion) nuevosErrores.aceptaDeclaracion = 'Debe aceptar la declaración jurada';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSiguiente = async () => {
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

      // Primero subir el documento si hay uno nuevo en el paso 2
      let documentoUrl = pdfUrl;
      if (pasoActual === 2 && formData.documentoFile && !pdfUrl) {
        const uploadResponse = await cumplimientoService.uploadDocument(formData.documentoFile);
        documentoUrl = uploadResponse.url || uploadResponse.Url;
        setPdfUrl(documentoUrl);
      }

      // Preparar datos para enviar (incluyendo campos completados hasta ahora)
      const dataToSend = {
        compromisoId: parseInt(formData.compromisoId),
        entidadId: user?.entidadId || '', // Obtener del usuario autenticado
        nroDni: formData.nroDni || '',
        nombres: formData.nombres || '',
        apellidoPaterno: formData.apellidoPaterno || '',
        apellidoMaterno: formData.apellidoMaterno || '',
        correo: formData.correo || '',
        telefono: formData.telefono || '',
        rol: formData.rol || '',
        cargo: formData.cargo || '',
        fechaInicio: formData.fechaInicio || '',
        documentoUrl: documentoUrl || '',
        validacion1: formData.validacion1 || false,
        validacion2: formData.validacion2 || false,
        validacion3: formData.validacion3 || false,
        validacion4: formData.validacion4 || false,
        aceptaPolitica: formData.aceptaPolitica || false,
        aceptaDeclaracion: formData.aceptaDeclaracion || false,
        estado: formData.estado || 1
      };

      let response;
      if (isEdit || id) {
        // Si ya existe, actualizar
        response = await cumplimientoService.update(id, dataToSend);
      } else {
        // Si es nuevo, crear y guardar el ID
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

    const confirmed = await showConfirmToast(
      '¿Desea finalizar y guardar el cumplimiento normativo?'
    );

    if (!confirmed) return;

    // Guardar con estado final
    const guardado = await guardarProgreso();
    
    if (guardado) {
      showSuccessToast('Cumplimiento guardado exitosamente');
      navigate('/dashboard/cumplimiento');
    }
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
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isEdit ? 'Editar Cumplimiento Normativo' : 'Registrar Cumplimiento Normativo'}
        </h1>
        {compromisoSeleccionado && (
          <div className="mt-3 p-4 bg-primary/5 border-l-4 border-primary rounded-r-lg">
            <p className="text-sm text-gray-600 mb-1">Compromiso seleccionado:</p>
            <p className="text-lg font-semibold text-primary">
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
                  {paso === 1 && 'Datos Generales'}
                  {paso === 2 && 'Normativa'}
                  {paso === 3 && 'Confirmación'}
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
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Paso 1: Datos Generales */}
        {pasoActual === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Paso 1: Datos Generales del Líder</h2>

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
                  name="correo"
                  value={formData.correo}
                  onChange={handleInputChange}
                  className={`input-field ${errores.correo ? 'border-red-500' : ''}`}
                  placeholder="ejemplo@gob.pe"
                />
                {errores.correo && (
                  <p className="text-red-500 text-xs mt-1">{errores.correo}</p>
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
                />
                {errores.fechaInicio && (
                  <p className="text-red-500 text-xs mt-1">{errores.fechaInicio}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Paso 2: Normativa */}
        {pasoActual === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Paso 2: Documento Normativo y Validaciones</h2>

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
                  />
                  <label htmlFor="file-upload" className="btn-primary cursor-pointer inline-block">
                    Seleccionar archivo
                  </label>
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
                    <button
                      onClick={removeFile}
                      className="text-red-500 hover:text-red-700"
                      title="Eliminar documento"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <button
                    onClick={() => setShowPdfViewer(true)}
                    className="btn-secondary text-sm"
                  >
                    Vista previa del PDF
                  </button>
                </div>
              )}
              {errores.documentoFile && (
                <p className="text-red-500 text-xs mt-1">{errores.documentoFile}</p>
              )}
            </div>

            {/* Validaciones */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <AlertCircle className="text-blue-600" size={20} />
                Validaciones Requeridas
              </h3>
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="validacion1"
                    checked={formData.validacion1}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    La Resolución ha sido emitida por la autoridad competente de la entidad
                  </span>
                </label>
                {errores.validacion1 && (
                  <p className="text-red-500 text-xs ml-6">{errores.validacion1}</p>
                )}

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="validacion2"
                    checked={formData.validacion2}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    El Líder de Gobierno Digital es un funcionario de la entidad
                  </span>
                </label>
                {errores.validacion2 && (
                  <p className="text-red-500 text-xs ml-6">{errores.validacion2}</p>
                )}

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="validacion3"
                    checked={formData.validacion3}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    La Resolución indica el artículo específico de designación del Líder
                  </span>
                </label>
                {errores.validacion3 && (
                  <p className="text-red-500 text-xs ml-6">{errores.validacion3}</p>
                )}

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="validacion4"
                    checked={formData.validacion4}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    Las funciones del Líder están claramente definidas en la Resolución
                  </span>
                </label>
                {errores.validacion4 && (
                  <p className="text-red-500 text-xs ml-6">{errores.validacion4}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Paso 3: Confirmación */}
        {pasoActual === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Paso 3: Confirmación y Aceptación</h2>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Check className="text-green-600" size={20} />
                Declaraciones Requeridas
              </h3>
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="aceptaPolitica"
                    checked={formData.aceptaPolitica}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    <strong>Acepto la Política de Privacidad:</strong> Declaro haber leído y aceptado la política de
                    privacidad y protección de datos personales. Autorizo el tratamiento de mis datos conforme a la
                    Ley N° 29733 - Ley de Protección de Datos Personales.
                  </span>
                </label>
                {errores.aceptaPolitica && (
                  <p className="text-red-500 text-xs ml-6">{errores.aceptaPolitica}</p>
                )}

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="aceptaDeclaracion"
                    checked={formData.aceptaDeclaracion}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    <strong>Declaración Jurada:</strong> Declaro bajo juramento que la información proporcionada es
                    verídica y que el documento adjunto corresponde a la designación oficial del Líder de Gobierno
                    Digital. Asumo responsabilidad por la veracidad de la información registrada.
                  </span>
                </label>
                {errores.aceptaDeclaracion && (
                  <p className="text-red-500 text-xs ml-6">{errores.aceptaDeclaracion}</p>
                )}
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
                <div className="font-medium">{formData.correo}</div>
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
            )}
          </div>
        </div>
      </div>

      {/* Visor de PDF */}
      {showPdfViewer && pdfUrl && (
        <PDFViewer
          pdfUrl={pdfUrl}
          onClose={() => setShowPdfViewer(false)}
          title="Vista Previa del Documento Normativo"
        />
      )}
    </div>
  );
};

export default CumplimientoNormativoDetalle;
