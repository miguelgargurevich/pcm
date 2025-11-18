import { useState, useEffect } from 'react';
import { compromisosService } from '../services/compromisosService';
import { marcoNormativoService } from '../services/marcoNormativoService';
import { catalogosService } from '../services/catalogosService';
import { showConfirmToast, showSuccessToast, showErrorToast } from '../utils/toast.jsx';
import { Plus, Edit2, Trash2, X, Save, FilterX, Search, FileCheck, Calendar } from 'lucide-react';

const CompromisoGobiernoDigital = () => {
  const [compromisos, setCompromisos] = useState([]);
  const [compromisosFiltrados, setCompromisosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCompromiso, setEditingCompromiso] = useState(null);
  const [showBuscarNormaModal, setShowBuscarNormaModal] = useState(false);
  const [normasDisponibles, setNormasDisponibles] = useState([]);
  const [normaSearchTerm, setNormaSearchTerm] = useState('');
  const [paginaNormas, setPaginaNormas] = useState(1);
  const normasPorPagina = 5;

  // Catálogos dinámicos
  const [estados, setEstados] = useState([]);
  const [tiposNorma, setTiposNorma] = useState([]);
  const [alcances, setAlcances] = useState([]);
  
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
    estado: 'pendiente',
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
    estado: 'pendiente'
  });

  const [editingCriterioIndex, setEditingCriterioIndex] = useState(null);

  useEffect(() => {
    loadCompromisos();
    loadCatalogos();
  }, []);

  const loadCatalogos = async () => {
    try {
      const [estadosResponse, tiposResponse, alcancesResponse] = await Promise.all([
        catalogosService.getEstados(),
        catalogosService.getTiposNorma(),
        catalogosService.getAlcances()
      ]);

      if (estadosResponse.isSuccess) {
        setEstados(estadosResponse.data || []);
      }
      if (tiposResponse.isSuccess) {
        setTiposNorma(tiposResponse.data || []);
      }
      if (alcancesResponse.isSuccess) {
        setAlcances(alcancesResponse.data || []);
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
      filtered = filtered.filter((c) => c.estado === filtros.estado);
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
      estado: 'pendiente',
      normativas: [],
      criteriosEvaluacion: []
    });
    setShowModal(true);
  };

  const handleEdit = (compromiso) => {
    console.log('🔍 Compromiso recibido para editar:', compromiso);
    console.log('📝 Descripción del compromiso:', compromiso.descripcion);
    setEditingCompromiso(compromiso);
    
    // Convertir el estado ID al nombre del estado
    const estadoNombre = estados.find(e => e.estadoId === compromiso.estado)?.nombre || 'pendiente';
    
    const newFormData = {
      nombreCompromiso: compromiso.nombreCompromiso || '',
      descripcion: compromiso.descripcion || '',
      alcances: compromiso.alcances || [],
      fechaInicio: compromiso.fechaInicio ? compromiso.fechaInicio.split('T')[0] : '',
      fechaFin: compromiso.fechaFin ? compromiso.fechaFin.split('T')[0] : '',
      estado: estadoNombre,
      normativas: compromiso.normativas || [],
      criteriosEvaluacion: compromiso.criteriosEvaluacion || []
    };
    
    console.log('📋 FormData preparado:', newFormData);
    console.log('📋 Descripción en formData:', newFormData.descripcion);
    
    setFormData(newFormData);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
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
      // Encontrar el estadoId del string de estado
      const estadoEncontrado = estados.find(e => e.nombre === formData.estado);
      const estadoId = estadoEncontrado ? estadoEncontrado.estadoId : 1; // Default pendiente

      const dataToSend = {
        nombreCompromiso: formData.nombreCompromiso,
        descripcion: formData.descripcion || null,
        alcances: formData.alcances,
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
        estado: estadoId, // Enviar el ID, no el nombre
        normativas: formData.normativas.map(n => ({ normaId: n.normaId || n.id })), // Solo enviar normaId
        criteriosEvaluacion: formData.criteriosEvaluacion.map(c => {
          const criterioEstado = estados.find(e => e.nombre === c.estado);
          return {
            criterioEvaluacionId: c.criterioEvaluacionId,
            descripcion: c.descripcion,
            estado: criterioEstado ? criterioEstado.estadoId : 1 // Convertir estado a ID
          };
        })
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
        id: criteriosActualizados[editingCriterioIndex].id
      };
      setFormData(prev => ({
        ...prev,
        criteriosEvaluacion: criteriosActualizados
      }));
      setEditingCriterioIndex(null);
    } else {
      // Agregar nuevo criterio
      const criterio = {
        ...nuevoCriterio,
        id: Date.now()
      };
      setFormData(prev => ({
        ...prev,
        criteriosEvaluacion: [...prev.criteriosEvaluacion, criterio]
      }));
    }

    setNuevoCriterio({
      descripcion: '',
      estado: 'pendiente'
    });
  };

  const handleEditarCriterio = (index) => {
    setNuevoCriterio(formData.criteriosEvaluacion[index]);
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

  const getEstadoBadgeClass = (estado) => {
    const classes = {
      pendiente: 'bg-yellow-100 text-yellow-800',
      en_proceso: 'bg-blue-100 text-blue-800',
      completado: 'bg-green-100 text-green-800',
      vencido: 'bg-red-100 text-red-800'
    };
    return classes[estado] || 'bg-gray-100 text-gray-800';
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Compromisos Gobierno Digital</h1>
          <p className="text-gray-600 mt-1">Administración de compromisos y metas digitales</p>
        </div>
        <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Nuevo Compromiso
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
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
              {alcances.map((alcance) => (
                <option key={alcance.id} value={alcance.id}>{alcance.nombre}</option>
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
              {estados.map((estado) => (
                <option key={estado.estadoId} value={estado.nombre}>{estado.nombre}</option>
              ))}
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
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <FileCheck className="text-primary mr-2 mt-1" size={18} />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{compromiso.nombreCompromiso}</div>
                        {compromiso.alcances && compromiso.alcances.length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            Alcance: {compromiso.alcances.join(', ')}
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
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoBadgeClass(estados.find(e => e.estadoId === compromiso.estado)?.nombre || 'pendiente')}`}>
                      {estados.find(e => e.estadoId === compromiso.estado)?.nombre || compromiso.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
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
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                disabled={paginaActual === 1}
                className="btn-secondary"
              >
                Anterior
              </button>
              <button
                onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPages))}
                disabled={paginaActual === totalPages}
                className="btn-secondary"
              >
                Siguiente
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{indexOfFirstItem + 1}</span> a{' '}
                  <span className="font-medium">{Math.min(indexOfLastItem, compromisosFiltrados.length)}</span> de{' '}
                  <span className="font-medium">{compromisosFiltrados.length}</span> resultados
                </p>
              </div>
              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setPaginaActual(index + 1)}
                    className={`px-3 py-1 rounded ${
                      paginaActual === index + 1
                        ? 'bg-primary text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Crear/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingCompromiso ? 'Editar Compromiso' : 'Nuevo Compromiso'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Compromiso <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nombreCompromiso"
                    value={formData.nombreCompromiso}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="Nombre del compromiso"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alcance <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-3 border border-gray-300 rounded-lg">
                    {alcances.map((alcance) => (
                      <label key={alcance.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.alcances.includes(alcance.id)}
                          onChange={() => handleAlcanceToggle(alcance.id)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-gray-700">{alcance.nombre}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows="3"
                    className="input-field"
                    placeholder="Descripción del compromiso"
                  />
                </div>

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
                    className="input-field"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  >
                    {estados.map((estado) => (
                      <option key={estado.estadoId} value={estado.nombre}>{estado.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* NORMATIVA */}
              <div className="border-t pt-6">
                <h4 className="text-md font-semibold text-gray-800 mb-4">NORMATIVA</h4>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Norma
                      </label>
                      <select
                        value={nuevaNormativa.tipoNormaId}
                        onChange={(e) => setNuevaNormativa(prev => ({ ...prev, tipoNormaId: e.target.value }))}
                        className="input-field"
                      >
                        <option value="">Seleccione...</option>
                        {tiposNorma.map((tipo) => (
                          <option key={tipo.tipoNormaId} value={tipo.tipoNormaId}>{tipo.nombre}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número de Norma
                      </label>
                      <input
                        type="text"
                        value={nuevaNormativa.numero}
                        onChange={(e) => setNuevaNormativa(prev => ({ ...prev, numero: e.target.value }))}
                        className="input-field"
                        placeholder="Ej: 123-2024"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre de la Norma
                      </label>
                      <input
                        type="text"
                        value={nuevaNormativa.nombreNorma}
                        onChange={(e) => setNuevaNormativa(prev => ({ ...prev, nombreNorma: e.target.value }))}
                        className="input-field"
                        placeholder="Seleccione mediante búsqueda"
                        readOnly
                      />
                    </div>

                    <div className="flex items-end gap-2">
                      <button
                        type="button"
                        onClick={handleBuscarNorma}
                        className="btn-secondary flex items-center gap-2 flex-1"
                      >
                        <Search size={18} />
                        Buscar
                      </button>
                      <button
                        type="button"
                        onClick={handleAgregarNormativa}
                        className="btn-primary flex items-center gap-2 flex-1"
                      >
                        <Plus size={18} />
                        Agregar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tabla de normativas */}
                {formData.normativas.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tipo de Norma</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nombre de Norma</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nivel de Norma</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sector</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {formData.normativas.map((normativa, index) => (
                          <tr key={normativa.id}>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {tiposNorma.find(t => t.tipoNormaId === parseInt(normativa.tipoNormaId))?.nombre}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900">{normativa.nombreNorma}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{normativa.nivelGobierno || '-'}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{normativa.sector || '-'}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {normativa.fechaPublicacion ? new Date(normativa.fechaPublicacion).toLocaleDateString('es-PE') : '-'}
                            </td>
                            <td className="px-4 py-2">
                              <button
                                type="button"
                                onClick={() => handleEliminarNormativa(index)}
                                className="text-red-600 hover:text-red-800"
                                title="Eliminar"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* CRITERIO DE EVALUACIÓN */}
              <div className="border-t pt-6">
                <h4 className="text-md font-semibold text-gray-800 mb-4">CRITERIO DE EVALUACIÓN</h4>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción
                      </label>
                      <input
                        type="text"
                        value={nuevoCriterio.descripcion}
                        onChange={(e) => setNuevoCriterio(prev => ({ ...prev, descripcion: e.target.value }))}
                        className="input-field"
                        placeholder="Descripción del criterio"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estado
                      </label>
                      <div className="flex items-end gap-2">
                        <select
                          value={nuevoCriterio.estado}
                          onChange={(e) => setNuevoCriterio(prev => ({ ...prev, estado: e.target.value }))}
                          className="input-field flex-1"
                        >
                          {estados.map((estado) => (
                            <option key={estado.estadoId} value={estado.nombre}>{estado.nombre}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={handleAgregarCriterio}
                          className="btn-primary flex items-center gap-2"
                        >
                          <Plus size={18} />
                          {editingCriterioIndex !== null ? 'Actualizar' : 'Agregar'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabla de criterios */}
                {formData.criteriosEvaluacion.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {formData.criteriosEvaluacion.map((criterio, index) => {
                          // Criterio.estado puede ser un ID (número) o nombre (string)
                          const estadoNombre = typeof criterio.estado === 'number' 
                            ? estados.find(e => e.estadoId === criterio.estado)?.nombre 
                            : criterio.estado;
                          
                          return (
                            <tr key={criterio.id}>
                              <td className="px-4 py-2 text-sm text-gray-900">{criterio.descripcion}</td>
                              <td className="px-4 py-2">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoBadgeClass(estadoNombre || 'pendiente')}`}>
                                  {estadoNombre || criterio.estado}
                                </span>
                              </td>
                              <td className="px-4 py-2 space-x-2">
                                <button
                                  type="button"
                                  onClick={() => handleEditarCriterio(index)}
                                  className="text-primary hover:text-primary-dark"
                                  title="Editar"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleEliminarCriterio(index)}
                                  className="text-red-600 hover:text-red-800"
                                  title="Eliminar"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  className="btn-primary flex items-center gap-2"
                >
                  <Save size={18} />
                  {editingCompromiso ? 'Actualizar Compromiso' : 'Registrar Compromiso'}
                </button>
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
          <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-[60] flex items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[85vh] flex flex-col">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Seleccionar Norma</h3>
                <button
                  onClick={() => {
                    setShowBuscarNormaModal(false);
                    setNormaSearchTerm('');
                    setPaginaNormas(1);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 flex-1 overflow-auto">
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
