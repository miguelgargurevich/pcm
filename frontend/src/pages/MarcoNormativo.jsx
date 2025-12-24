import { useState, useEffect } from 'react';
import { marcoNormativoService } from '../services/marcoNormativoService';
import { catalogosService } from '../services/catalogosService';
import { showConfirmToast, showSuccessToast, showErrorToast } from '../utils/toast.jsx';
import { Plus, Edit2, Trash2, X, Save, Filter, FilterX, Search, FileText, ExternalLink, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const MarcoNormativo = () => {
  const { user } = useAuth();
  const [normas, setNormas] = useState([]);
  const [normasFiltradas, setNormasFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingNorma, setEditingNorma] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfTitle, setPdfTitle] = useState('');
  
  // Solo lectura para entidades
  const isReadOnly = user?.nombrePerfil === 'Entidad';
  
  // Debug: verificar el perfil del usuario
  useEffect(() => {
    console.log('👤 MarcoNormativo - Usuario:', user);
    console.log('👤 MarcoNormativo - nombrePerfil:', user?.nombrePerfil);
    console.log('🔒 MarcoNormativo - isReadOnly:', isReadOnly);
  }, [user, isReadOnly]);

  // Catálogos dinámicos
  const [tiposNorma, setTiposNorma] = useState([]);
  const [nivelesGobierno, setNivelesGobierno] = useState([]);
  const [sectores, setSectores] = useState([]);
  
  // Filtros
  const [filtros, setFiltros] = useState({
    nombreNorma: '',
    numero: '',
    tipoNormaId: '',
    nivelGobiernoId: '',
    sectorId: ''
  });

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  const [formData, setFormData] = useState({
    nombreNorma: '',
    numero: '',
    tipoNormaId: '',
    nivelGobiernoId: '1', // Por defecto Nacional
    sectorId: '1', // Por defecto PCM
    fechaPublicacion: '',
    descripcion: '',
    url: '',
    activo: true
  });

  useEffect(() => {
    loadNormas();
    loadCatalogos();
  }, []);

  const loadCatalogos = async () => {
    try {
      const [tiposResponse, nivelesResponse, sectoresResponse] = await Promise.all([
        catalogosService.getTiposNorma(),
        catalogosService.getNivelesGobierno(),
        catalogosService.getSectores()
      ]);

      if (tiposResponse.isSuccess) {
        setTiposNorma(tiposResponse.data || []);
      }
      if (nivelesResponse.isSuccess) {
        setNivelesGobierno(nivelesResponse.data || []);
      }
      if (sectoresResponse.isSuccess) {
        setSectores(sectoresResponse.data || []);
      }
    } catch (error) {
      console.error('Error al cargar catálogos:', error);
    }
  };

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...normas];

    if (filtros.nombreNorma.trim()) {
      const busqueda = filtros.nombreNorma.toLowerCase();
      filtered = filtered.filter((n) =>
        n.nombreNorma?.toLowerCase().includes(busqueda)
      );
    }

    if (filtros.numero.trim()) {
      const busqueda = filtros.numero.toLowerCase();
      filtered = filtered.filter((n) =>
        n.numero?.toLowerCase().includes(busqueda)
      );
    }

    if (filtros.tipoNormaId) {
      filtered = filtered.filter((n) => n.tipoNormaId === parseInt(filtros.tipoNormaId));
    }

    if (filtros.nivelGobiernoId) {
      filtered = filtered.filter((n) => n.nivelGobiernoId === parseInt(filtros.nivelGobiernoId));
    }

    if (filtros.sectorId) {
      filtered = filtered.filter((n) => n.sectorId === parseInt(filtros.sectorId));
    }

    setNormasFiltradas(filtered);
    setPaginaActual(1);
  }, [normas, filtros]);

  const loadNormas = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await marcoNormativoService.getAll();
      const isSuccess = response.isSuccess || response.IsSuccess;
      
      if (isSuccess) {
        const normasData = response.data || response.Data || [];
        setNormas(Array.isArray(normasData) ? normasData : []);
      } else {
        setError(response.message || 'Error al cargar normas');
        setNormas([]);
      }
    } catch (error) {
      console.error('Error al cargar normas:', error);
      setError('Error al conectar con el servidor');
      setNormas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingNorma(null);
    setFormData({
      nombreNorma: '',
      numero: '',
      tipoNormaId: '',
      nivelGobiernoId: '1',
      sectorId: '1',
      fechaPublicacion: '',
      descripcion: '',
      url: '',
      activo: true
    });
    setShowModal(true);
  };

  const handleEdit = (norma) => {
    setEditingNorma(norma);
    setFormData({
      nombreNorma: norma.nombreNorma || '',
      numero: norma.numero || '',
      tipoNormaId: norma.tipoNormaId || '',
      nivelGobiernoId: norma.nivelGobiernoId || '1',
      sectorId: norma.sectorId || '1',
      fechaPublicacion: norma.fechaPublicacion ? norma.fechaPublicacion.split('T')[0] : '',
      descripcion: norma.descripcion || '',
      url: norma.url || '',
      activo: norma.activo !== undefined ? norma.activo : true
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (isReadOnly) {
      console.log('⛔ Acción bloqueada: usuario en modo solo lectura');
      showErrorToast('No tiene permisos para eliminar registros');
      return;
    }
    showConfirmToast({
      title: '¿Está seguro de eliminar esta norma?',
      message: 'Esta acción desactivará la norma.',
      confirmText: 'Eliminar',
      loadingText: 'Eliminando norma...',
      onConfirm: async () => {
        const response = await marcoNormativoService.delete(id);
        const isSuccess = response.isSuccess || response.IsSuccess;
        
        if (isSuccess) {
          await loadNormas();
          showSuccessToast('Norma eliminada exitosamente');
        } else {
          showErrorToast(response.message || 'Error al eliminar norma');
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;
      
      if (editingNorma) {
        // Para actualizar: incluir normaId en el body
        const dataToSend = {
          normaId: editingNorma.normaId,
          nombreNorma: formData.nombreNorma,
          numero: formData.numero,
          tipoNormaId: parseInt(formData.tipoNormaId),
          nivelGobiernoId: parseInt(formData.nivelGobiernoId),
          sectorId: parseInt(formData.sectorId),
          fechaPublicacion: formData.fechaPublicacion,
          descripcion: formData.descripcion || null,
          url: formData.url || null
        };
        response = await marcoNormativoService.update(editingNorma.normaId, dataToSend);
      } else {
        // Para crear: no incluir normaId
        const dataToSend = {
          nombreNorma: formData.nombreNorma,
          numero: formData.numero,
          tipoNormaId: parseInt(formData.tipoNormaId),
          nivelGobiernoId: parseInt(formData.nivelGobiernoId),
          sectorId: parseInt(formData.sectorId),
          fechaPublicacion: formData.fechaPublicacion,
          descripcion: formData.descripcion || null,
          url: formData.url || null
        };
        response = await marcoNormativoService.create(dataToSend);
      }

      const isSuccess = response.isSuccess || response.IsSuccess;
      
      if (isSuccess) {
        await loadNormas();
        setShowModal(false);
        showSuccessToast(editingNorma ? 'Norma actualizada exitosamente' : 'Norma creada exitosamente');
      } else {
        showErrorToast(response.message || 'Error al guardar norma');
      }
    } catch (error) {
      console.error('Error al guardar norma:', error);
      showErrorToast(error.message || 'Error al conectar con el servidor');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const limpiarFiltros = () => {
    setFiltros({ nombreNorma: '', numero: '', tipoNormaId: '', nivelGobiernoId: '', sectorId: '' });
  };

  const handleViewDocument = (norma) => {
    if (!norma.url) {
      showErrorToast('No hay documento disponible para esta norma');
      return;
    }

    // Validar si es un PDF
    const url = norma.url.toLowerCase();
    const isPdf = url.endsWith('.pdf') || url.includes('.pdf?') || url.includes('pdf');
    
    if (!isPdf) {
      showErrorToast('Solo se pueden visualizar documentos PDF. Este enlace se abrirá en una nueva ventana.');
      window.open(norma.url, '_blank', 'noopener,noreferrer');
      return;
    }

    // Abrir modal con visor PDF
    setPdfUrl(norma.url);
    setPdfTitle(`${norma.numero} - ${norma.nombreNorma}`);
    setShowPdfModal(true);
  };

  // Paginación
  const indexOfLastItem = paginaActual * itemsPorPagina;
  const indexOfFirstItem = indexOfLastItem - itemsPorPagina;
  const currentItems = normasFiltradas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(normasFiltradas.length / itemsPorPagina);

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
          <FileText size={20} />
          <span className="font-medium">Modo solo lectura - No tiene permisos para editar</span>
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-100 rounded-xl">
              <FileText className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Módulo de Marco Normativo</h1>
              <p className="text-gray-600 mt-1">Administración de normas y documentos legales</p>
            </div>
          </div>
          {!isReadOnly && (
            <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
              <Plus size={20} />
              Nueva Norma
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
              {(filtros.nombreNorma || filtros.numero || filtros.tipoNormaId || 
                filtros.nivelGobiernoId || filtros.sectorId) && (
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
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Marco Normativo
                </label>
                <input
                  type="text"
                  name="nombreNorma"
                  value={filtros.nombreNorma}
                  onChange={handleFiltroChange}
                  placeholder="Buscar por nombre..."
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número
                </label>
                <input
                  type="text"
                  name="numero"
                  value={filtros.numero}
                  onChange={handleFiltroChange}
                  placeholder="Ej: 123-2024"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Norma
                </label>
                <select
                  name="tipoNormaId"
                  value={filtros.tipoNormaId}
                  onChange={handleFiltroChange}
                  className="input-field"
                >
                  <option value="">Todos</option>
                  {tiposNorma.map((tipo) => (
                    <option key={tipo.tipoNormaId} value={tipo.tipoNormaId}>{tipo.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nivel de Gobierno
                </label>
                <select
                  name="nivelGobiernoId"
                  value={filtros.nivelGobiernoId}
                  onChange={handleFiltroChange}
                  className="input-field"
                >
                  <option value="">Todos</option>
                  {nivelesGobierno.map((nivel) => (
                    <option key={nivel.nivelGobiernoId} value={nivel.nivelGobiernoId}>{nivel.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sector
                </label>
                <select
                  name="sectorId"
                  value={filtros.sectorId}
                  onChange={handleFiltroChange}
                  className="input-field"
                >
                  <option value="">Todos</option>
                  {sectores.map((sector) => (
                    <option key={sector.sectorId} value={sector.sectorId}>{sector.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

                <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Mostrando {currentItems.length} de {normasFiltradas.length} normas
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
                  Número
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre de la Norma
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo de Norma
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nivel de Gobierno
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sector
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((norma, index) => (
                <tr key={norma.normaId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {(paginaActual - 1) * itemsPorPagina + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{norma.numero}</div>
                    {norma.url && (
                      <button
                        onClick={() => handleViewDocument(norma)}
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1 hover:underline"
                        title="Ver documento"
                      >
                        <Eye size={14} />
                        Ver documento
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{norma.nombreNorma}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {norma.tipoNorma}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 max-w-xs">
                      {norma.descripcion || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {norma.nivelGobierno}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {norma.sector}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {isReadOnly ? (
                      <button
                        onClick={() => handleEdit(norma)}
                        className="text-primary hover:text-primary-dark"
                        title="Ver"
                      >
                        <Eye size={18} />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(norma)}
                          className="text-primary hover:text-primary-dark"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(norma.normaId)}
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
              <FileText size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No se encontraron normas</p>
            </div>
          )}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t bg-gray-50">
            <div className="text-sm text-gray-600">
              Mostrando {((paginaActual - 1) * itemsPorPagina) + 1} - {Math.min(paginaActual * itemsPorPagina, normasFiltradas.length)} de {normasFiltradas.length} registros
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary-600 to-primary-700 rounded-t-xl text-white">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6" />
                <div>
                  <h2 className="text-lg font-semibold">{isReadOnly ? 'Ver Norma' : editingNorma ? 'Editar Norma' : 'Nueva Norma'}</h2>
                  <p className="text-sm text-white/80">{isReadOnly ? 'Modo solo lectura' : 'Marco normativo del gobierno digital'}</p>
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
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la Norma <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nombreNorma"
                    value={formData.nombreNorma}
                    onChange={handleInputChange}
                    required
                    disabled={isReadOnly}
                    className="input-field"
                    placeholder="Nombre completo de la norma"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Norma <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="numero"
                    value={formData.numero}
                    onChange={handleInputChange}
                    required
                    disabled={isReadOnly}
                    className="input-field"
                    placeholder="Ej: 123-2024-PCM"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Norma <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="tipoNormaId"
                    value={formData.tipoNormaId}
                    onChange={handleInputChange}
                    required
                    disabled={isReadOnly}
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
                    Fecha de Publicación <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="fechaPublicacion"
                    value={formData.fechaPublicacion}
                    onChange={handleInputChange}
                    required
                    disabled={isReadOnly}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nivel de Gobierno <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="nivelGobiernoId"
                    value={formData.nivelGobiernoId}
                    onChange={handleInputChange}
                    required
                    disabled={isReadOnly}
                    className="input-field"
                  >
                    <option value="">Seleccione...</option>
                    {nivelesGobierno.map((nivel) => (
                      <option key={nivel.nivelGobiernoId} value={nivel.nivelGobiernoId}>{nivel.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sector <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="sectorId"
                    value={formData.sectorId}
                    onChange={handleInputChange}
                    required
                    disabled={isReadOnly}
                    className="input-field"
                  >
                    <option value="">Seleccione...</option>
                    {sectores.map((sector) => (
                      <option key={sector.sectorId} value={sector.sectorId}>{sector.nombre}</option>
                    ))}
                  </select>
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
                    disabled={isReadOnly}
                    className="input-field"
                    placeholder="Descripción o resumen de la norma"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL del Documento
                  </label>
                  <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    disabled={isReadOnly}
                    className="input-field"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  {isReadOnly ? 'Cerrar' : 'Cancelar'}
                </button>
                {!isReadOnly && (
                  <button
                    type="submit"
                    className="btn-primary flex items-center gap-2"
                  >
                    <Save size={18} />
                    {editingNorma ? 'Actualizar' : 'Crear'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Visor de PDF */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary-600 to-primary-700 rounded-t-xl text-white">
              <div className="flex items-center gap-3">
                <Eye className="w-6 h-6" />
                <div>
                  <h2 className="text-lg font-semibold">Visor de Documento</h2>
                  <p className="text-sm text-white/80">{pdfTitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white"
                  title="Abrir en nueva pestaña"
                >
                  <ExternalLink size={18} />
                  Abrir en nueva pestaña
                </a>
                <button
                  onClick={() => {
                    setShowPdfModal(false);
                    setPdfUrl('');
                    setPdfTitle('');
                  }}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="Cerrar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Contenedor del PDF */}
            <div className="flex-1 overflow-hidden">
              <iframe
                src={pdfUrl}
                className="w-full h-full border-0"
                title={pdfTitle}
                style={{ minHeight: '600px' }}
              />
            </div>

            {/* Footer con información */}
            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 text-sm text-gray-600 flex items-center justify-between">
              <span>Si el documento no se visualiza correctamente, ábralo en una nueva pestaña.</span>
              <button
                onClick={() => {
                  setShowPdfModal(false);
                  setPdfUrl('');
                  setPdfTitle('');
                }}
                className="btn-secondary px-4 py-2"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarcoNormativo;
