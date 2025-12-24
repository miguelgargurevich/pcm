import { useState, useEffect } from 'react';
import { compromisosService } from '../services/compromisosService';
import { marcoNormativoService } from '../services/marcoNormativoService';
import { catalogosService } from '../services/catalogosService';
import { showConfirmToast, showSuccessToast, showErrorToast } from '../utils/toast.jsx';
import { Plus, Edit2, Trash2, X, Save, Filter, FilterX, Search, FileCheck, Calendar, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const CompromisoGobiernoDigital = () => {
  const { user } = useAuth();
  const [compromisos, setCompromisos] = useState([]);
  const [compromisosFiltrados, setCompromisosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCompromiso, setEditingCompromiso] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showBuscarNormaModal, setShowBuscarNormaModal] = useState(false);
  const [normasDisponibles, setNormasDisponibles] = useState([]);
  const [normaSearchTerm, setNormaSearchTerm] = useState('');
  const [paginaNormas, setPaginaNormas] = useState(1);
  const normasPorPagina = 5;
  
  // Solo lectura para entidades
  const isReadOnly = user?.nombrePerfil === 'Entidad';
  
  // Debug: verificar el perfil del usuario
  useEffect(() => {
    console.log('👤 CompromisoGD - Usuario:', user);
    console.log('👤 CompromisoGD - nombrePerfil:', user?.nombrePerfil);
    console.log('🔒 CompromisoGD - isReadOnly:', isReadOnly);
  }, [user, isReadOnly]);

  // Catálogos dinámicos
  const [tiposNorma, setTiposNorma] = useState([]);
  const [clasificaciones, setClasificaciones] = useState([]);
  const [subclasificaciones, setSubclasificaciones] = useState([]);
  
  // Filtros
  const [filtros, setFiltros] = useState({
    nombre: '',
    alcance: '',
    estado: ''
  });

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  const [formData, setFormData] = useState({
    nombreCompromiso: '',
    descripcion: '',
    alcances: [],
    fechaInicio: '',
    fechaFin: '',
    activo: true,
    normativas: [],
    criteriosEvaluacion: []
  });

  // Estados para nueva normativa
  const [nuevaNormativa, setNuevaNormativa] = useState({
    normaId: null,
    tipoNormaId: '',
    numero: '',
    nombreNorma: ''
  });

  // Estados para nuevo criterio
  const [nuevoCriterio, setNuevoCriterio] = useState({
    descripcion: '',
    activo: true
  });

  const [editingCriterioIndex, setEditingCriterioIndex] = useState(null);

  useEffect(() => {
    loadCompromisos();
    loadCatalogos();
  }, []);

  const loadCatalogos = async () => {
    try {
      const [tiposResponse, clasificacionesResponse, subclasificacionesResponse] = await Promise.all([
        catalogosService.getTiposNorma(),
        catalogosService.getClasificaciones(),
        catalogosService.getSubclasificaciones()
      ]);

      if (tiposResponse.isSuccess) {
        setTiposNorma(tiposResponse.data || []);
      }
      if (clasificacionesResponse.isSuccess) {
        setClasificaciones(clasificacionesResponse.data || []);
      }
      if (subclasificacionesResponse.isSuccess) {
        setSubclasificaciones(subclasificacionesResponse.data || []);
      }
    } catch (error) {
      console.error('Error al cargar catálogos:', error);
    }
  };

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...compromisos];

    if (filtros.nombre.trim()) {
      const busqueda = filtros.nombre.toLowerCase();
      filtered = filtered.filter((c) =>
        c.nombreCompromiso?.toLowerCase().includes(busqueda)
      );
    }

    if (filtros.alcance) {
      filtered = filtered.filter((c) =>
        c.alcances?.includes(filtros.alcance)
      );
    }

    if (filtros.estado) {
      if (filtros.estado === 'activo') {
        filtered = filtered.filter((c) => c.activo === true);
      } else if (filtros.estado === 'inactivo') {
        filtered = filtered.filter((c) => c.activo === false);
      }
    }

    setCompromisosFiltrados(filtered);
    setPaginaActual(1);
  }, [compromisos, filtros]);

  const loadCompromisos = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await compromisosService.getAll();
      const isSuccess = response.isSuccess || response.IsSuccess;
      
      if (isSuccess) {
        const compromisosData = response.data || response.Data || [];
        setCompromisos(Array.isArray(compromisosData) ? compromisosData : []);
      } else {
        setError(response.message || 'Error al cargar compromisos');
        setCompromisos([]);
      }
    } catch (error) {
      console.error('Error al cargar compromisos:', error);
      // Si es un 404, el endpoint no existe aún en el backend
      if (error.response?.status === 404) {
        setError('⚠️ El módulo de Compromisos está en desarrollo. El endpoint del backend aún no está disponible.');
      } else {
        setError('Error al conectar con el servidor');
      }
      setCompromisos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCompromiso(null);
    setFormData({
      nombreCompromiso: '',
      descripcion: '',
      alcances: [],
      fechaInicio: '',
      fechaFin: '',
      estado: 1, // ID de estado pendiente
      normativas: [],
      criteriosEvaluacion: []
    });
    setShowModal(true);
  };

  const handleEdit = (compromiso) => {
    console.log('🔍 Compromiso recibido para editar:', compromiso);
    console.log('📝 Descripción del compromiso:', compromiso.descripcion);
    console.log('📝 Alcances recibidos:', compromiso.alcances);
    console.log('📝 Tipo de alcances:', typeof compromiso.alcances, Array.isArray(compromiso.alcances));
    console.log('📝 Subclasificaciones disponibles:', subclasificaciones.length, subclasificaciones);
    setEditingCompromiso(compromiso);
    
    // Convertir alcances (pueden venir como IDs o nombres) a IDs de subclasificación
    let subclasificacionIds = [];
    if (compromiso.alcances && compromiso.alcances.length > 0) {
      console.log('🔄 Procesando alcances...');
      subclasificacionIds = compromiso.alcances
        .map((alcance, index) => {
          console.log(`  Procesando alcance [${index}]:`, alcance, 'tipo:', typeof alcance);
          
          // Si es un número o string numérico, asumir que es un ID
          const alcanceNum = Number(alcance);
          if (!isNaN(alcanceNum) && alcanceNum > 0) {
            // Verificar que el ID existe en subclasificaciones
            const exists = subclasificaciones.find(s => s.subclasificacionId === alcanceNum);
            console.log(`  ✓ ID ${alcanceNum} existe:`, !!exists, exists?.nombre);
            return exists ? alcanceNum : null;
          }
          
          // Si es un string no numérico, buscar por nombre
          const subclasificacion = subclasificaciones.find(s => s.nombre.toLowerCase() === String(alcance).toLowerCase());
          console.log(`  ✓ Búsqueda por nombre "${alcance}":`, !!subclasificacion, subclasificacion?.subclasificacionId);
          return subclasificacion ? subclasificacion.subclasificacionId : null;
        })
        .filter(id => {
          const isValid = id !== null;
          if (!isValid) console.warn('  ⚠️ ID nulo filtrado');
          return isValid;
        });
    }
    console.log('✅ Subclasificación IDs mapeados:', subclasificacionIds);
    
    const newFormData = {
      nombreCompromiso: compromiso.nombreCompromiso || '',
      descripcion: compromiso.descripcion || '',
      alcances: subclasificacionIds,
      fechaInicio: compromiso.fechaInicio ? compromiso.fechaInicio.split('T')[0] : '',
      fechaFin: compromiso.fechaFin ? compromiso.fechaFin.split('T')[0] : '',
      activo: compromiso.activo !== undefined ? compromiso.activo : true,
      normativas: compromiso.normativas || [],
      criteriosEvaluacion: compromiso.criteriosEvaluacion || []
    };
    
    console.log('📋 FormData preparado:', newFormData);
    console.log('📋 Descripción en formData:', newFormData.descripcion);
    console.log('📋 Alcances en formData:', newFormData.alcances);
    
    setFormData(newFormData);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (isReadOnly) {
      console.log('⛔ Acción bloqueada: usuario en modo solo lectura');
      showErrorToast('No tiene permisos para eliminar registros');
      return;
    }
    showConfirmToast({
      title: '¿Está seguro de eliminar este compromiso?',
      message: 'Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      loadingText: 'Eliminando compromiso...',
      onConfirm: async () => {
        const response = await compromisosService.delete(id);
        const isSuccess = response.isSuccess || response.IsSuccess;
        
        if (isSuccess) {
          await loadCompromisos();
          showSuccessToast('Compromiso eliminado exitosamente');
        } else {
          showErrorToast(response.message || 'Error al eliminar compromiso');
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (formData.alcances.length === 0) {
      showErrorToast('Debe seleccionar al menos un alcance');
      return;
    }

    try {
      const dataToSend = {
        nombreCompromiso: formData.nombreCompromiso,
        descripcion: formData.descripcion || null,
        alcances: formData.alcances.map(a => String(a)), // Convertir IDs a strings
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
        activo: formData.activo,
        normativas: formData.normativas.map(n => ({ normaId: n.normaId || n.id })),
        criteriosEvaluacion: formData.criteriosEvaluacion.map(c => ({
          criterioEvaluacionId: c.criterioEvaluacionId,
          descripcion: c.descripcion,
          activo: c.activo !== undefined ? c.activo : true
        }))
      };

      console.log('📤 FormData actual:', formData);
      console.log('📤 Descripción en formData:', formData.descripcion);
      console.log('📤 Datos a enviar al backend:', dataToSend);
      console.log('📤 Descripción en dataToSend:', dataToSend.descripcion);

      let response;
      if (editingCompromiso) {
        dataToSend.compromisoId = editingCompromiso.compromisoId;
        console.log('✏️ Actualizando compromiso ID:', editingCompromiso.compromisoId);
        console.log('✏️ Datos completos a actualizar:', JSON.stringify(dataToSend, null, 2));
        response = await compromisosService.update(editingCompromiso.compromisoId, dataToSend);
      } else {
        console.log('➕ Creando nuevo compromiso');
        console.log('➕ Datos completos a crear:', JSON.stringify(dataToSend, null, 2));
        response = await compromisosService.create(dataToSend);
      }

      const isSuccess = response.isSuccess || response.IsSuccess;
      
      if (isSuccess) {
        await loadCompromisos();
        setShowModal(false);
        showSuccessToast(editingCompromiso ? 'Compromiso actualizado exitosamente' : 'Compromiso creado exitosamente');
      } else {
        showErrorToast(response.message || 'Error al guardar compromiso');
      }
    } catch (error) {
      console.error('Error al guardar compromiso:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      showErrorToast(error.response?.data?.message || error.message || 'Error al conectar con el servidor');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAlcanceToggle = (alcanceId) => {
    setFormData(prev => ({
      ...prev,
      alcances: prev.alcances.includes(alcanceId)
        ? prev.alcances.filter(a => a !== alcanceId)
        : [...prev.alcances, alcanceId]
    }));
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const limpiarFiltros = () => {
    setFiltros({ nombre: '', alcance: '', estado: '' });
  };

  // Búsqueda de normas
  const handleBuscarNorma = async () => {
    try {
      const response = await marcoNormativoService.getAll({
        tipoNormaId: nuevaNormativa.tipoNormaId,
        searchTerm: nuevaNormativa.numero || nuevaNormativa.nombreNorma
      });
      
      const isSuccess = response.isSuccess || response.IsSuccess;
      if (isSuccess) {
        const normas = response.data || response.Data || [];
        setNormasDisponibles(Array.isArray(normas) ? normas : []);
        setShowBuscarNormaModal(true);
      } else {
        showErrorToast('No se encontraron normas');
      }
    } catch {
      showErrorToast('Error al buscar normas');
    }
  };

  const handleAgregarNormativa = () => {
    if (!nuevaNormativa.nombreNorma || !nuevaNormativa.normaId) {
      showErrorToast('Debe buscar y seleccionar una norma');
      return;
    }

    const normativa = {
      ...nuevaNormativa,
      id: Date.now() // ID temporal para manejo en frontend
    };

    setFormData(prev => ({
      ...prev,
      normativas: [...prev.normativas, normativa]
    }));

    setNuevaNormativa({
      normaId: null,
      tipoNormaId: '',
      numero: '',
      nombreNorma: ''
    });
  };

  const handleSeleccionarNorma = (norma) => {
    setNuevaNormativa({
      normaId: norma.normaId, // IMPORTANTE: Guardar el normaId
      tipoNormaId: norma.tipoNormaId,
      numero: norma.numero,
      nombreNorma: norma.nombreNorma,
      nivelGobierno: norma.nivelGobierno,
      sector: norma.sector,
      fechaPublicacion: norma.fechaPublicacion
    });
    setShowBuscarNormaModal(false);
  };

  const handleEliminarNormativa = (index) => {
    setFormData(prev => ({
      ...prev,
      normativas: prev.normativas.filter((_, i) => i !== index)
    }));
  };

  // Gestión de criterios
  const handleAgregarCriterio = () => {
    if (!nuevoCriterio.descripcion.trim()) {
      showErrorToast('La descripción del criterio es requerida');
      return;
    }

    if (editingCriterioIndex !== null) {
      // Editar criterio existente
      const criteriosActualizados = [...formData.criteriosEvaluacion];
      criteriosActualizados[editingCriterioIndex] = {
        ...nuevoCriterio,
        id: criteriosActualizados[editingCriterioIndex].id,
        criterioEvaluacionId: criteriosActualizados[editingCriterioIndex].criterioEvaluacionId
      };
      setFormData(prev => ({
        ...prev,
        criteriosEvaluacion: criteriosActualizados
      }));
      setEditingCriterioIndex(null);
    } else {
      // Agregar nuevo criterio - siempre activo por defecto
      const criterio = {
        descripcion: nuevoCriterio.descripcion,
        activo: true,
        id: Date.now()
      };
      setFormData(prev => ({
        ...prev,
        criteriosEvaluacion: [...prev.criteriosEvaluacion, criterio]
      }));
    }

    setNuevoCriterio({
      descripcion: '',
      activo: true
    });
  };

  const handleEditarCriterio = (index) => {
    const criterio = formData.criteriosEvaluacion[index];
    setNuevoCriterio({
      descripcion: criterio.descripcion,
      activo: typeof criterio.activo === 'boolean' ? criterio.activo : true
    });
    setEditingCriterioIndex(index);
  };

  const handleEliminarCriterio = (index) => {
    setFormData(prev => ({
      ...prev,
      criteriosEvaluacion: prev.criteriosEvaluacion.filter((_, i) => i !== index)
    }));
  };

  // Paginación
  const indexOfLastItem = paginaActual * itemsPorPagina;
  const indexOfFirstItem = indexOfLastItem - itemsPorPagina;
  const currentItems = compromisosFiltrados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(compromisosFiltrados.length / itemsPorPagina);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {isReadOnly && (
        <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg flex items-center gap-2">
          <FileCheck size={20} />
          <span className="font-medium">Modo solo lectura - No tiene permisos para editar</span>
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-100 rounded-xl">
              <FileCheck className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Gestionar Compromisos de Gobierno Digital</h1>
              <p className="text-gray-600 mt-1">Administración de compromisos y metas digitales</p>
            </div>
          </div>
          {!isReadOnly && (
            <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
              <Plus size={20} />
              Nuevo Compromiso
            </button>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        {/* Header del panel de filtros */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                <Filter size={20} />
                Filtros
              </button>
              
              {/* Badge de filtros activos */}
              {(filtros.nombre || filtros.alcance || filtros.estado) && (
                <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                  Activos
                </span>
              )}
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-gray-400 hover:text-gray-600"
            >
              {showFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
        </div>

        {/* Contenido de filtros colapsable */}
        {showFilters && (
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Compromiso
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={filtros.nombre}
                  onChange={handleFiltroChange}
                  placeholder="Buscar por nombre..."
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alcance
                </label>
                <select
                  name="alcance"
                  value={filtros.alcance}
                  onChange={handleFiltroChange}
                  className="input-field"
                >
                  <option value="">Todos</option>
                  {clasificaciones.map((clasificacion) => (
                    <option key={clasificacion.clasificacionId} value={clasificacion.clasificacionId}>{clasificacion.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  name="estado"
                  value={filtros.estado}
                  onChange={handleFiltroChange}
                  className="input-field"
                >
                  <option value="">Todos</option>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Mostrando {currentItems.length} de {compromisosFiltrados.length} compromisos
              </div>
              <button
                onClick={limpiarFiltros}
                className="btn-secondary flex items-center gap-2 px-4 py-2"
                title="Limpiar filtros"
              >
                <FilterX size={20} />
                Limpiar filtros
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre Compromiso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Inicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Fin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((compromiso) => (
                <tr key={compromiso.compromisoId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">C{compromiso.compromisoId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <FileCheck className="text-primary mr-2 mt-1" size={18} />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{compromiso.nombreCompromiso}</div>
                        {compromiso.alcances && compromiso.alcances.length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            Alcance: {compromiso.alcances
                              .map(alcanceId => {
                                const sub = subclasificaciones.find(s => s.subclasificacionId === parseInt(alcanceId));
                                return sub?.nombre || `ID ${alcanceId}`;
                              })
                              .slice(0, 3)
                              .join(', ')}
                            {compromiso.alcances.length > 3 && ` (+${compromiso.alcances.length - 3} más)`}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(compromiso.fechaInicio).toLocaleDateString('es-PE')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(compromiso.fechaFin).toLocaleDateString('es-PE')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${compromiso.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {compromiso.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {isReadOnly ? (
                      <button
                        onClick={() => handleEdit(compromiso)}
                        className="text-primary hover:text-primary-dark"
                        title="Ver"
                      >
                        <Eye size={18} />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(compromiso)}
                          className="text-primary hover:text-primary-dark"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(compromiso.compromisoId)}
                          className="text-red-600 hover:text-red-800"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {currentItems.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FileCheck size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No se encontraron compromisos</p>
            </div>
          )}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t bg-gray-50">
            <div className="text-sm text-gray-600">
              Mostrando {((paginaActual - 1) * itemsPorPagina) + 1} - {Math.min(paginaActual * itemsPorPagina, compromisosFiltrados.length)} de {compromisosFiltrados.length} registros
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                disabled={paginaActual <= 1}
                className="px-3 py-1 text-sm text-gray-600 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                Anterior
              </button>
              <span className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg">
                {paginaActual}
              </span>
              <span className="text-sm text-gray-600">de {totalPages}</span>
              <button
                onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPages))}
                disabled={paginaActual >= totalPages}
                className="px-3 py-1 text-sm text-gray-600 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Crear/Editar */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary-600 to-primary-700 rounded-t-xl text-white">
              <div className="flex items-center gap-3">
                <FileCheck className="w-6 h-6" />
                <div>
                  <h2 className="text-lg font-semibold">{isReadOnly ? 'Ver Compromiso' : editingCompromiso ? 'Editar Compromiso' : 'Nuevo Compromiso'}</h2>
                  <p className="text-sm text-white/80">{isReadOnly ? 'Modo solo lectura' : 'Compromisos de gobierno digital'}</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Sección: Información General */}
              <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-5 border border-primary-200">
                <h3 className="text-lg font-semibold text-primary-800 mb-4 flex items-center gap-2">
                  <FileCheck className="w-5 h-5" />
                  Información General
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Nombre del Compromiso */}
                  <div className="lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre Compromiso <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nombreCompromiso"
                      value={formData.nombreCompromiso}
                      onChange={handleInputChange}
                      required
                      disabled={isReadOnly}
                      className="input-field"
                      placeholder="Ej: Compromiso 1 - Conformación del Comité de Transformación Digital"
                    />
                  </div>

                  {/* Descripción */}
                  <div className="lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      rows="3"
                      disabled={isReadOnly}
                      className="input-field"
                      placeholder="Descripción detallada del compromiso..."
                    />
                  </div>

                  {/* Fechas */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha Inicio <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fechaInicio"
                      value={formData.fechaInicio}
                      onChange={handleInputChange}
                      required
                      disabled={isReadOnly}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha Fin <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fechaFin"
                      value={formData.fechaFin}
                      onChange={handleInputChange}
                      required
                      disabled={isReadOnly}
                      className="input-field"
                    />
                  </div>

                  {/* Estado */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="activo"
                      value={formData.activo ? 'true' : 'false'}
                      onChange={(e) => setFormData({ ...formData, activo: e.target.value === 'true' })}
                      required
                      disabled={isReadOnly}
                      className="input-field"
                    >
                      <option value="true">✓ Activo</option>
                      <option value="false">✗ Inactivo</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Sección: Alcance */}
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-primary-600" />
                  Alcance del Compromiso <span className="text-red-500 text-sm">*</span>
                </h3>
                
                <div className="bg-gray-50 p-3 border border-gray-200 rounded-lg max-h-96 overflow-y-auto space-y-3">
                  {clasificaciones
                    .filter(clasificacion => 
                      subclasificaciones.some(sub => sub.clasificacionId === clasificacion.clasificacionId)
                    )
                    .map((clasificacion) => {
                      const subclasificacionesGrupo = subclasificaciones.filter(
                        sub => sub.clasificacionId === clasificacion.clasificacionId
                      );
                      
                      if (subclasificacionesGrupo.length === 0) return null;
                      
                      return (
                        <div key={clasificacion.clasificacionId} className="bg-white rounded-lg p-2.5 shadow-sm">
                          <h4 className="text-xs font-semibold text-primary-700 mb-2 pb-1.5 border-b border-primary-200 flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                            {clasificacion.nombre}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1.5 pl-3">
                            {subclasificacionesGrupo.map((subclasificacion) => (
                              <label 
                                key={subclasificacion.subclasificacionId} 
                                className="flex items-center space-x-1.5 p-1.5 hover:bg-primary-50 rounded transition-colors cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={formData.alcances.includes(subclasificacion.subclasificacionId)}
                                  onChange={() => handleAlcanceToggle(subclasificacion.subclasificacionId)}
                                  disabled={isReadOnly}
                                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-2"
                                />
                                <span className="text-xs text-gray-700">{subclasificacion.nombre}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                </div>
                
                {/* Contador de seleccionados */}
                <div className="mt-2 text-xs text-gray-600 bg-blue-50 p-2 rounded border border-blue-200">
                  <span className="font-medium">{formData.alcances.length}</span> alcance(s) seleccionado(s)
                </div>
              </div>

              {/* Sección: NORMATIVA */}
              <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-green-600" />
                  Marco Normativo
                </h3>
                
                {!isReadOnly && (
                  <div className="bg-green-50 p-4 rounded-lg mb-4 border border-green-200">
                  <p className="text-sm text-green-800 mb-3 font-medium">Agregar Nueva Normativa</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Tipo de Norma
                      </label>
                      <select
                        value={nuevaNormativa.tipoNormaId}
                        onChange={(e) => setNuevaNormativa(prev => ({ ...prev, tipoNormaId: e.target.value }))}
                        className="input-field text-sm"
                      >
                        <option value="">Seleccione...</option>
                        {tiposNorma.map((tipo) => (
                          <option key={tipo.tipoNormaId} value={tipo.tipoNormaId}>{tipo.nombre}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Número de Norma
                      </label>
                      <input
                        type="text"
                        value={nuevaNormativa.numero}
                        onChange={(e) => setNuevaNormativa(prev => ({ ...prev, numero: e.target.value }))}
                        className="input-field text-sm"
                        placeholder="Ej: 123-2024"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Nombre de la Norma
                      </label>
                      <input
                        type="text"
                        value={nuevaNormativa.nombreNorma}
                        onChange={(e) => setNuevaNormativa(prev => ({ ...prev, nombreNorma: e.target.value }))}
                        className="input-field text-sm bg-gray-50"
                        placeholder="Seleccione mediante búsqueda"
                        readOnly
                      />
                    </div>

                    <div className="flex items-end gap-2">
                      <button
                        type="button"
                        onClick={handleBuscarNorma}
                        className="btn-secondary flex items-center justify-center gap-2 flex-1 text-sm py-2"
                      >
                        <Search size={16} />
                        Buscar
                      </button>
                      <button
                        type="button"
                        onClick={handleAgregarNormativa}
                        className="btn-primary flex items-center justify-center gap-2 flex-1 text-sm py-2"
                      >
                        <Plus size={16} />
                        Agregar
                      </button>
                    </div>
                  </div>
                </div>
                )}

                {/* Tabla de normativas */}
                {formData.normativas.length > 0 ? (
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tipo</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombre</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nivel</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sector</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha</th>
                          {!isReadOnly && (
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {formData.normativas.map((normativa, index) => (
                          <tr key={normativa.normaId || index} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {tiposNorma.find(t => t.tipoNormaId === parseInt(normativa.tipoNormaId))?.nombre || '-'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">{normativa.nombreNorma}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{normativa.nivelGobierno || '-'}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{normativa.sector || '-'}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {normativa.fechaPublicacion ? new Date(normativa.fechaPublicacion).toLocaleDateString('es-PE') : '-'}
                            </td>
                            {!isReadOnly && (
                              <td className="px-4 py-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleEliminarNormativa(index)}
                                  className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors"
                                  title="Eliminar"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <FileCheck className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No hay normativas agregadas</p>
                  </div>
                )}
              </div>

              {/* Sección: CRITERIO DE EVALUACIÓN */}
              <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Criterios de Evaluación
                </h3>
                
                {!isReadOnly && (
                  <div className="bg-purple-50 p-4 rounded-lg mb-4 border border-purple-200">
                  <p className="text-sm text-purple-800 mb-3 font-medium">Agregar Nuevo Criterio</p>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Descripción
                      </label>
                      <input
                        type="text"
                        value={nuevoCriterio.descripcion}
                        onChange={(e) => setNuevoCriterio(prev => ({ ...prev, descripcion: e.target.value }))}
                        className="input-field text-sm"
                        placeholder="Descripción del criterio de evaluación..."
                      />
                    </div>
                    
                    <div className="flex items-end gap-2">
                      {editingCriterioIndex !== null && (
                        <button
                          type="button"
                          onClick={() => {
                            setNuevoCriterio({ descripcion: '', activo: true });
                            setEditingCriterioIndex(null);
                          }}
                          className="btn-secondary flex items-center gap-2 text-sm py-2"
                        >
                          <X size={16} />
                          Cancelar
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleAgregarCriterio}
                        className="btn-primary flex items-center gap-2 text-sm py-2"
                      >
                        <Plus size={16} />
                        {editingCriterioIndex !== null ? 'Actualizar' : 'Agregar'}
                      </button>
                    </div>
                  </div>
                </div>
                )}

                {/* Tabla de criterios */}
                {formData.criteriosEvaluacion.length > 0 ? (
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">#</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Descripción</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">Estado</th>
                          {!isReadOnly && (
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">Acciones</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {formData.criteriosEvaluacion.map((criterio, index) => {
                          return (
                            <tr key={criterio.id || index} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3 text-sm text-gray-700 font-medium">{index + 1}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{criterio.descripcion}</td>
                              <td className="px-4 py-3 text-center">
                                <span className={`${criterio.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} px-3 py-1 rounded-full text-xs font-semibold`}>
                                  {criterio.activo ? '✓ Activo' : '✗ Inactivo'}
                                </span>
                              </td>
                              {!isReadOnly && (
                                <td className="px-4 py-3 text-center space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => handleEditarCriterio(index)}
                                    className="text-primary hover:text-primary-dark p-1 hover:bg-primary-50 rounded transition-colors"
                                    title="Editar"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleEliminarCriterio(index)}
                                    className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors"
                                    title="Eliminar"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No hay criterios de evaluación agregados</p>
                  </div>
                )}
              </div>

              {/* Botones de acción */}
              <div className="sticky bottom-0 bg-white border-t-2 border-gray-200 pt-4 pb-2 flex justify-between items-center shadow-lg -mx-6 px-6 -mb-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex items-center gap-2"
                >
                  <X size={18} />
                  {isReadOnly ? 'Cerrar' : 'Cancelar'}
                </button>
                {!isReadOnly && (
                  <button
                    type="submit"
                    className="btn-primary flex items-center gap-2 px-6"
                  >
                    <Save size={18} />
                    {editingCompromiso ? 'Actualizar Compromiso' : 'Registrar Compromiso'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Buscar Norma */}
      {showBuscarNormaModal && (() => {
        // Filtrar normas por búsqueda
        const normasFiltradas = normasDisponibles.filter(norma => 
          norma.nombreNorma?.toLowerCase().includes(normaSearchTerm.toLowerCase()) ||
          norma.numero?.toLowerCase().includes(normaSearchTerm.toLowerCase())
        );

        // Paginación
        const indexOfLastNorma = paginaNormas * normasPorPagina;
        const indexOfFirstNorma = indexOfLastNorma - normasPorPagina;
        const normasPaginadas = normasFiltradas.slice(indexOfFirstNorma, indexOfLastNorma);
        const totalPaginasNormas = Math.ceil(normasFiltradas.length / normasPorPagina);

        return (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary-600 to-primary-700 rounded-t-xl text-white">
                <div className="flex items-center gap-3">
                  <Search className="w-6 h-6" />
                  <div>
                    <h2 className="text-lg font-semibold">Seleccionar Norma</h2>
                    <p className="text-sm text-white/80">Buscar y asociar normas al compromiso</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowBuscarNormaModal(false);
                    setNormaSearchTerm('');
                    setPaginaNormas(1);
                  }}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Buscador */}
                <div className="mb-4">
                  <input
                    type="text"
                    value={normaSearchTerm}
                    onChange={(e) => {
                      setNormaSearchTerm(e.target.value);
                      setPaginaNormas(1); // Reset a primera página al buscar
                    }}
                    placeholder="Buscar por nombre o número de norma..."
                    className="input-field"
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Número</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {normasPaginadas.map((norma) => (
                        <tr key={norma.normaId} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm text-gray-900">{norma.numero}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{norma.nombreNorma}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{norma.tipoNorma}</td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() => handleSeleccionarNorma(norma)}
                              className="btn-primary text-sm"
                            >
                              Seleccionar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {normasPaginadas.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      {normaSearchTerm ? 'No se encontraron normas que coincidan con tu búsqueda' : 'No se encontraron normas'}
                    </div>
                  )}
                </div>
              </div>

              {/* Paginación */}
              {totalPaginasNormas > 1 && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">{indexOfFirstNorma + 1}</span> a{' '}
                    <span className="font-medium">{Math.min(indexOfLastNorma, normasFiltradas.length)}</span> de{' '}
                    <span className="font-medium">{normasFiltradas.length}</span> normas
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPaginaNormas(prev => Math.max(prev - 1, 1))}
                      disabled={paginaNormas === 1}
                      className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                      Anterior
                    </button>
                    {[...Array(totalPaginasNormas)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setPaginaNormas(index + 1)}
                        className={`px-3 py-1 rounded text-sm ${
                          paginaNormas === index + 1
                            ? 'bg-primary text-white'
                            : 'border border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setPaginaNormas(prev => Math.min(prev + 1, totalPaginasNormas))}
                      disabled={paginaNormas === totalPaginasNormas}
                      className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default CompromisoGobiernoDigital;
