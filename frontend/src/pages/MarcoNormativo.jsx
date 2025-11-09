import { useState, useEffect } from 'react';
import { marcoNormativoService } from '../services/marcoNormativoService';
import { showConfirmToast, showSuccessToast, showErrorToast } from '../utils/toast.jsx';
import { Plus, Edit2, Trash2, X, Save, FilterX, Search, FileText, ExternalLink } from 'lucide-react';

const TIPOS_NORMA = [
  { id: 1, nombre: 'Ley' },
  { id: 2, nombre: 'Decreto Supremo' },
  { id: 3, nombre: 'Resolución Ministerial' },
  { id: 4, nombre: 'Resolución Directoral' },
  { id: 5, nombre: 'Ordenanza' },
  { id: 6, nombre: 'Acuerdo' },
  { id: 7, nombre: 'Otro' }
];

const MarcoNormativo = () => {
  const [normas, setNormas] = useState([]);
  const [normasFiltradas, setNormasFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingNorma, setEditingNorma] = useState(null);
  
  // Filtros
  const [filtros, setFiltros] = useState({
    busqueda: '',
    tipoNormaId: '',
    estado: ''
  });

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  const [formData, setFormData] = useState({
    titulo: '',
    numeroNorma: '',
    tipoNormaId: '',
    fechaPublicacion: '',
    fechaVigencia: '',
    entidad: '',
    descripcion: '',
    urlDocumento: '',
    activo: true
  });

  useEffect(() => {
    loadNormas();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...normas];

    if (filtros.busqueda.trim()) {
      const busqueda = filtros.busqueda.toLowerCase();
      filtered = filtered.filter(
        (n) =>
          n.titulo?.toLowerCase().includes(busqueda) ||
          n.numeroNorma?.toLowerCase().includes(busqueda) ||
          n.entidad?.toLowerCase().includes(busqueda)
      );
    }

    if (filtros.tipoNormaId) {
      filtered = filtered.filter((n) => n.tipoNormaId === parseInt(filtros.tipoNormaId));
    }

    if (filtros.estado === 'activo') {
      filtered = filtered.filter((n) => n.activo === true);
    } else if (filtros.estado === 'inactivo') {
      filtered = filtered.filter((n) => n.activo === false);
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
      titulo: '',
      numeroNorma: '',
      tipoNormaId: '',
      fechaPublicacion: '',
      fechaVigencia: '',
      entidad: '',
      descripcion: '',
      urlDocumento: '',
      activo: true
    });
    setShowModal(true);
  };

  const handleEdit = (norma) => {
    setEditingNorma(norma);
    setFormData({
      titulo: norma.titulo || '',
      numeroNorma: norma.numeroNorma || '',
      tipoNormaId: norma.tipoNormaId || '',
      fechaPublicacion: norma.fechaPublicacion ? norma.fechaPublicacion.split('T')[0] : '',
      fechaVigencia: norma.fechaVigencia || '',
      entidad: norma.entidad || '',
      descripcion: norma.descripcion || '',
      urlDocumento: norma.urlDocumento || '',
      activo: norma.activo !== undefined ? norma.activo : true
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    showConfirmToast({
      title: '¿Está seguro de eliminar esta norma?',
      message: 'Esta acción no se puede deshacer.',
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
      const dataToSend = {
        titulo: formData.titulo,
        numeroNorma: formData.numeroNorma,
        tipoNormaId: parseInt(formData.tipoNormaId),
        fechaPublicacion: formData.fechaPublicacion,
        fechaVigencia: formData.fechaVigencia || null,
        entidad: formData.entidad,
        descripcion: formData.descripcion || null,
        urlDocumento: formData.urlDocumento || null
      };

      let response;
      if (editingNorma) {
        dataToSend.marcoNormativoId = editingNorma.marcoNormativoId;
        response = await marcoNormativoService.update(editingNorma.marcoNormativoId, dataToSend);
      } else {
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
      showErrorToast('Error al conectar con el servidor');
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
    setFiltros({ busqueda: '', tipoNormaId: '', estado: '' });
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestionar Marco Normativo</h1>
          <p className="text-gray-600 mt-1">Administración de normas y documentos legales</p>
        </div>
        <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Nueva Norma
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                name="busqueda"
                value={filtros.busqueda}
                onChange={handleFiltroChange}
                placeholder="Título, número o entidad..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
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
              {TIPOS_NORMA.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2">
            <div className="flex-1">
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
                <option value="activo">Activos</option>
                <option value="inactivo">Inactivos</option>
              </select>
            </div>
            <button
              onClick={limpiarFiltros}
              className="btn-secondary flex items-center gap-2 px-4 py-2"
              title="Limpiar filtros"
            >
              <FilterX size={20} />
            </button>
          </div>
        </div>

        <div className="mt-3 text-sm text-gray-600">
          Mostrando {currentItems.length} de {normasFiltradas.length} normas
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
                  Norma
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Publicación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entidad
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
              {currentItems.map((norma) => (
                <tr key={norma.marcoNormativoId} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <FileText className="text-primary mr-2 mt-1" size={18} />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{norma.titulo}</div>
                        <div className="text-sm text-gray-500">{norma.numeroNorma}</div>
                        {norma.urlDocumento && (
                          <a
                            href={norma.urlDocumento}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1"
                          >
                            Ver documento <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {norma.tipoNorma}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(norma.fechaPublicacion).toLocaleDateString('es-PE')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {norma.entidad}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      norma.activo
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {norma.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(norma)}
                      className="text-primary hover:text-primary-dark"
                      title="Editar"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(norma.marcoNormativoId)}
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
              <FileText size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No se encontraron normas</p>
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
                  <span className="font-medium">{Math.min(indexOfLastItem, normasFiltradas.length)}</span> de{' '}
                  <span className="font-medium">{normasFiltradas.length}</span> resultados
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingNorma ? 'Editar Norma' : 'Nueva Norma'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    required
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
                    name="numeroNorma"
                    value={formData.numeroNorma}
                    onChange={handleInputChange}
                    required
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
                    className="input-field"
                  >
                    <option value="">Seleccione...</option>
                    {TIPOS_NORMA.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
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
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Vigencia
                  </label>
                  <input
                    type="date"
                    name="fechaVigencia"
                    value={formData.fechaVigencia}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Entidad Emisora <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="entidad"
                    value={formData.entidad}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="Nombre de la entidad que emite la norma"
                  />
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
                    placeholder="Descripción o resumen de la norma"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL del Documento
                  </label>
                  <input
                    type="url"
                    name="urlDocumento"
                    value={formData.urlDocumento}
                    onChange={handleInputChange}
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
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary flex items-center gap-2"
                >
                  <Save size={18} />
                  {editingNorma ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarcoNormativo;
