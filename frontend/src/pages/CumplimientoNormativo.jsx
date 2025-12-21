import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cumplimientoService from '../services/cumplimientoService';
import { compromisosService } from '../services/compromisosService';
import { FilterX, Edit2, Eye, FileText, FileCheck, Calendar, Search } from 'lucide-react';

const CumplimientoNormativo = () => {
  const navigate = useNavigate();
  const [cumplimientos, setCumplimientos] = useState([]);
  const [compromisos, setCompromisos] = useState([]);
  const [compromisosFiltrados, setCompromisosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  // Filtros
  const [filtros, setFiltros] = useState({
    nombreCompromiso: '',
    estado: ''
  });

  const [estados, setEstados] = useState([]);

  useEffect(() => {
    loadData();
    loadEstados();
  }, []);

  const loadEstados = async () => {
    try {
      const estadosData = await cumplimientoService.getEstados();
      setEstados(estadosData);
    } catch (error) {
      console.error('Error al cargar estados:', error);
    }
  };

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...compromisos];

    // Ordenar por compromisoId de forma ascendente (1, 2, 3, ...)
    filtered.sort((a, b) => a.compromisoId - b.compromisoId);

    if (filtros.nombreCompromiso.trim()) {
      const busqueda = filtros.nombreCompromiso.toLowerCase();
      filtered = filtered.filter((c) =>
        c.nombreCompromiso?.toLowerCase().includes(busqueda)
      );
    }

    if (filtros.estado) {
      filtered = filtered.filter((c) => {
        const cumplimiento = cumplimientos.find(cum => cum.compromisoId === c.compromisoId);
        if (filtros.estado === 'sin_registrar') {
          return !cumplimiento;
        }
        return cumplimiento && cumplimiento.estado === parseInt(filtros.estado);
      });
    }

    setCompromisosFiltrados(filtered);
    setPaginaActual(1); // Reset página cuando cambian los filtros
  }, [compromisos, cumplimientos, filtros]);

  // Lógica de paginación
  const indiceUltimo = paginaActual * itemsPorPagina;
  const indicePrimero = indiceUltimo - itemsPorPagina;
  const compromisosPaginados = compromisosFiltrados.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(compromisosFiltrados.length / itemsPorPagina);

  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadData = async () => {
    try {
      setLoading(true);

      // Cargar compromisos
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
        setCumplimientos([]);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
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
    setFiltros({ nombreCompromiso: '', estado: '' });
    setPaginaActual(1); // Reset página al limpiar filtros
  };

  const handleVer = (cumplimientoId, compromisoId) => {
    navigate(`/dashboard/cumplimiento/${cumplimientoId}?compromiso=${compromisoId}&mode=view`);
  };

  const handleEditar = (cumplimientoId, compromisoId) => {
    navigate(`/dashboard/cumplimiento/${cumplimientoId}?compromiso=${compromisoId}`);
  };

  // Semaforización de estados (mismos colores que la matriz de evaluación)
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

  const getEstadoNombre = (estadoId) => {
    const estado = estados.find(e => e.id === estadoId);
    return estado ? estado.nombre : 'Desconocido';
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
        <h1 className="text-xl font-bold text-gray-800">Gestión de Cumplimiento Normativo</h1>
        <p className="text-gray-600 mt-1">Compromisos de Gobierno Digital</p>
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
              name="nombreCompromiso"
              value={filtros.nombreCompromiso}
              onChange={handleFiltroChange}
              placeholder="Buscar por nombre..."
              className="input-field"
            />
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
              <option value="sin_registrar">Sin registrar</option>
              {estados.map((estado) => (
                <option key={estado.id} value={estado.id}>
                  {estado.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              &nbsp;
            </label>
            <div className="h-full flex items-center">
              {/* <span className="text-sm text-gray-500">Filtros disponibles</span> */}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Mostrando {compromisosPaginados.length} de {compromisosFiltrados.length} compromisos
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

      {/* Tabla de Compromisos */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre del Compromiso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {compromisosPaginados.map((compromiso) => {
                  // Buscar si existe un cumplimiento para este compromiso
                  const cumplimiento = cumplimientos.find(c => c.compromisoId === compromiso.compromisoId);
                  
                  return (
                    <tr key={compromiso.compromisoId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">{compromiso.compromisoId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <FileCheck className="text-primary mr-2 mt-1" size={18} />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {compromiso.nombreCompromiso}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {compromiso.alcances && compromiso.alcances.length > 0
                                ? `Alcance: ${compromiso.alcances.join(', ')}`
                                : 'Sin alcance definido'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {compromiso.estadoCumplimiento ? (
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoBadgeClass(compromiso.estadoCumplimiento)}`}>
                            {getEstadoNombre(compromiso.estadoCumplimiento)}
                          </span>
                        ) : (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-500 text-white">
                            Sin registrar
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {compromiso.fechaRegistroCumplimiento ? (
                          new Date(compromiso.fechaRegistroCumplimiento).toLocaleDateString('es-PE', { 
                            day: '2-digit', 
                            month: '2-digit', 
                            year: 'numeric' 
                          })
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => {
                              // Si existe cumplimiento, ver; si no, ver en modo solo lectura
                              if (cumplimiento) {
                                handleVer(cumplimiento.cumplimientoId, compromiso.compromisoId);
                              } else {
                                navigate(`/dashboard/cumplimiento/nuevo?compromiso=${compromiso.compromisoId}&mode=view`);
                              }
                            }}
                            className="text-primary hover:text-primary-dark inline-flex items-center gap-1 p-2 rounded-md hover:bg-gray-100"
                            title="Ver"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => {
                              // Si existe cumplimiento, editar; si no, crear nuevo
                              if (cumplimiento) {
                                handleEditar(cumplimiento.cumplimientoId, compromiso.compromisoId);
                              } else {
                                navigate(`/dashboard/cumplimiento/nuevo?compromiso=${compromiso.compromisoId}`);
                              }
                            }}
                            className="text-primary hover:text-primary-dark"
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {compromisosFiltrados.length === 0 && !loading && (
              <div className="text-center py-12 text-gray-500">
                <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  No se encontraron compromisos
                </p>
                <p className="text-sm text-gray-500">
                  {compromisos.length === 0 
                    ? '⚠️ Verifique que los compromisos base estén insertados en la base de datos'
                    : 'Intente ajustar los filtros de búsqueda'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                onClick={() => cambiarPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{indicePrimero + 1}</span> a{' '}
                  <span className="font-medium">
                    {Math.min(indiceUltimo, compromisosFiltrados.length)}
                  </span>{' '}
                  de <span className="font-medium">{compromisosFiltrados.length}</span> resultados
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => cambiarPagina(paginaActual - 1)}
                    disabled={paginaActual === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Anterior</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {[...Array(totalPaginas)].map((_, index) => {
                    const numeroPagina = index + 1;
                    // Mostrar siempre la primera página, última página, y páginas cerca de la actual
                    if (
                      numeroPagina === 1 ||
                      numeroPagina === totalPaginas ||
                      (numeroPagina >= paginaActual - 1 && numeroPagina <= paginaActual + 1)
                    ) {
                      return (
                        <button
                          key={numeroPagina}
                          onClick={() => cambiarPagina(numeroPagina)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            paginaActual === numeroPagina
                              ? 'z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                              : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                          }`}
                        >
                          {numeroPagina}
                        </button>
                      );
                    } else if (
                      numeroPagina === paginaActual - 2 ||
                      numeroPagina === paginaActual + 2
                    ) {
                      return <span key={numeroPagina} className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">...</span>;
                    }
                    return null;
                  })}
                  <button
                    onClick={() => cambiarPagina(paginaActual + 1)}
                    disabled={paginaActual === totalPaginas}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Siguiente</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CumplimientoNormativo;
