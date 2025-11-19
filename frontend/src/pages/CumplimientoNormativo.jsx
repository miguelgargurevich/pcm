import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cumplimientoService from '../services/cumplimientoService';
import { compromisosService } from '../services/compromisosService';
import { FilterX, Edit2, Eye, FileText, Calendar } from 'lucide-react';

const CumplimientoNormativo = () => {
  const navigate = useNavigate();
  const [cumplimientos, setCumplimientos] = useState([]);
  const [cumplimientosFiltrados, setCumplimientosFiltrados] = useState([]);
  const [compromisos, setCompromisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtros
  const [filtros, setFiltros] = useState({
    compromiso: '',
    estado: ''
  });

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  const estados = cumplimientoService.getEstados();

  useEffect(() => {
    loadData();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...cumplimientos];

    if (filtros.compromiso) {
      filtered = filtered.filter((c) => c.compromisoId === parseInt(filtros.compromiso));
    }

    if (filtros.estado) {
      filtered = filtered.filter((c) => c.estado === parseInt(filtros.estado));
    }

    setCumplimientosFiltrados(filtered);
    setPaginaActual(1);
  }, [cumplimientos, filtros]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      // Cargar compromisos para el filtro
      const compromisosResponse = await compromisosService.getAll();
      if (compromisosResponse.isSuccess || compromisosResponse.IsSuccess) {
        const compromisosData = compromisosResponse.data || compromisosResponse.Data || [];
        setCompromisos(Array.isArray(compromisosData) ? compromisosData : []);
      }

      // Cargar cumplimientos
      const cumplimientosResponse = await cumplimientoService.getAll();
      if (cumplimientosResponse.isSuccess || cumplimientosResponse.IsSuccess) {
        const cumplimientosData = cumplimientosResponse.data || cumplimientosResponse.Data || [];
        setCumplimientos(Array.isArray(cumplimientosData) ? cumplimientosData : []);
      } else {
        setError(cumplimientosResponse.message || 'Error al cargar cumplimientos');
        setCumplimientos([]);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('Error al conectar con el servidor');
      setCumplimientos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const limpiarFiltros = () => {
    setFiltros({ compromiso: '', estado: '' });
  };

  const handleVerEditar = (cumplimientoId) => {
    navigate(`/dashboard/cumplimiento/${cumplimientoId}`);
  };

  const getEstadoBadgeClass = (estadoId) => {
    const classes = {
      1: 'bg-gray-100 text-gray-800', // bandeja
      2: 'bg-yellow-100 text-yellow-800', // sin_reportar
      3: 'bg-green-100 text-green-800', // publicado
    };
    return classes[estadoId] || 'bg-gray-100 text-gray-800';
  };

  const getEstadoNombre = (estadoId) => {
    const estado = estados.find(e => e.id === estadoId);
    return estado ? estado.nombre : 'Desconocido';
  };

  // Paginación
  const indexOfLastItem = paginaActual * itemsPorPagina;
  const indexOfFirstItem = indexOfLastItem - itemsPorPagina;
  const currentItems = cumplimientosFiltrados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(cumplimientosFiltrados.length / itemsPorPagina);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Cumplimiento Normativo</h1>
          <p className="text-gray-600 mt-1">Gestión del cumplimiento de compromisos de Gobierno Digital</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/cumplimiento/nuevo')}
          className="btn-primary flex items-center gap-2"
        >
          <FileText size={20} />
          Nuevo Cumplimiento
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Compromiso
            </label>
            <select
              name="compromiso"
              value={filtros.compromiso}
              onChange={handleFiltroChange}
              className="input-field"
            >
              <option value="">Todos los compromisos</option>
              {compromisos.map((compromiso) => (
                <option key={compromiso.compromisoId} value={compromiso.compromisoId}>
                  {compromiso.nombreCompromiso}
                </option>
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
              <option value="">Todos los estados</option>
              {estados.map((estado) => (
                <option key={estado.id} value={estado.id}>{estado.nombre}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={limpiarFiltros}
              className="btn-secondary flex items-center gap-2 w-full"
              title="Limpiar filtros"
            >
              <FilterX size={20} />
              Limpiar filtros
            </button>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Mostrando {currentItems.length} de {cumplimientosFiltrados.length} cumplimientos
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
                  Nombre del Compromiso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de Registro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((cumplimiento) => (
                <tr key={cumplimiento.cumplimientoId} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <FileText className="text-primary mr-2 mt-1" size={18} />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {cumplimiento.nombreCompromiso}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Entidad: {cumplimiento.nombreEntidad}
                        </div>
                        <div className="text-xs text-gray-500">
                          Líder: {cumplimiento.nombreLider}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoBadgeClass(cumplimiento.estado)}`}>
                      {getEstadoNombre(cumplimiento.estado)}
                    </span>
                    {cumplimiento.tieneDocumento && (
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <FileText size={12} />
                        Documento adjunto
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(cumplimiento.createdAt).toLocaleDateString('es-PE', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleVerEditar(cumplimiento.cumplimientoId)}
                      className="text-primary hover:text-primary-dark inline-flex items-center gap-1"
                      title="Ver"
                    >
                      <Eye size={18} />
                      <span>Ver</span>
                    </button>
                    <button
                      onClick={() => handleVerEditar(cumplimiento.cumplimientoId)}
                      className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                      title="Editar"
                    >
                      <Edit2 size={18} />
                      <span>Editar</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {currentItems.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FileText size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No se encontraron cumplimientos normativos</p>
              {(filtros.compromiso || filtros.estado) && (
                <button
                  onClick={limpiarFiltros}
                  className="mt-2 text-primary hover:text-primary-dark text-sm"
                >
                  Limpiar filtros
                </button>
              )}
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
                  <span className="font-medium">{Math.min(indexOfLastItem, cumplimientosFiltrados.length)}</span> de{' '}
                  <span className="font-medium">{cumplimientosFiltrados.length}</span> resultados
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
    </div>
  );
};

export default CumplimientoNormativo;
