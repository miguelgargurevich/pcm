import { useState, useEffect, useCallback } from 'react';
import { BarChart3, Search, FilterX, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { showSuccessToast, showErrorToast, showConfirmToast } from '../utils/toast.jsx';
import EvaluacionDetallePanel from '../components/Evaluacion/EvaluacionDetallePanel';
import evaluacionService from '../services/evaluacionService';

// Opciones para los estados
const estadosOptions = [
  'aceptado',
  'enviado',
  'en revisión',
  'en proceso',
  'pendiente',
  'observado',
  'sin reportar',
  'no exigible'
];

const compromisosOptions = Array.from({ length: 21 }, (_, i) => i + 1);

// Colores para los estados (semaforización)
const getEstadoStyles = (estado) => {
  const styles = {
    'aceptado': 'bg-green-500 text-white',
    'enviado': 'bg-blue-500 text-white',
    'en revisión': 'bg-purple-500 text-white',
    'en proceso': 'bg-yellow-500 text-white',
    'pendiente': 'bg-orange-500 text-white',
    'observado': 'bg-red-500 text-white',
    'sin reportar': 'bg-red-700 text-white',
    'no exigible': 'bg-gray-400 text-white'
  };
  return styles[estado] || 'bg-gray-300 text-gray-700';
};

// Abreviaturas para los estados
const getEstadoAbreviado = (estado) => {
  const abreviaturas = {
    'aceptado': 'ACE',
    'enviado': 'ENV',
    'en revisión': 'REV',
    'en proceso': 'PRO',
    'pendiente': 'PEN',
    'observado': 'OBS',
    'sin reportar': 'S/R',
    'no exigible': 'N/E'
  };
  return abreviaturas[estado] || estado.substring(0, 3).toUpperCase();
};

const ITEMS_PER_PAGE = 10;

const EvaluacionCumplimiento = () => {
  const [filtros, setFiltros] = useState({
    entidad: '',
    sectorId: '',
    clasificacionId: '',
    compromisoId: '',
    estado: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  
  // Estado para vista de detalle
  const [vistaDetalle, setVistaDetalle] = useState(false);
  const [entidadSeleccionada, setEntidadSeleccionada] = useState(null);
  const [compromisoSeleccionado, setCompromisoSeleccionado] = useState(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(null);
  
  // Estados de datos
  const [entidades, setEntidades] = useState([]);
  const [sectores, setSectores] = useState([]);
  const [clasificaciones, setClasificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0
  });

  // Cargar datos iniciales (sectores y clasificaciones)
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        const [sectoresRes, clasificacionesRes] = await Promise.all([
          evaluacionService.getSectores(),
          evaluacionService.getClasificaciones()
        ]);
        
        if (sectoresRes.isSuccess) {
          setSectores(sectoresRes.data);
        }
        if (clasificacionesRes.isSuccess) {
          setClasificaciones(clasificacionesRes.data);
        }
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
      }
    };
    
    cargarDatosIniciales();
  }, []);

  // Cargar matriz de evaluación
  const cargarMatriz = useCallback(async () => {
    setLoading(true);
    try {
      const response = await evaluacionService.getMatriz({
        entidad: filtros.entidad || undefined,
        sectorId: filtros.sectorId || undefined,
        clasificacionId: filtros.clasificacionId || undefined,
        compromisoId: filtros.compromisoId || undefined,
        estado: filtros.estado || undefined,
        page: currentPage,
        pageSize: ITEMS_PER_PAGE
      });
      
      if (response.isSuccess) {
        setEntidades(response.data);
        setPagination(response.pagination);
      } else {
        showErrorToast('Error al cargar la matriz de evaluación');
      }
    } catch (error) {
      console.error('Error al cargar matriz:', error);
      showErrorToast('Error al cargar los datos. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  }, [filtros, currentPage]);

  // Cargar matriz cuando cambian filtros o página
  useEffect(() => {
    cargarMatriz();
  }, [cargarMatriz]);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const limpiarFiltros = () => {
    setFiltros({
      entidad: '',
      sectorId: '',
      clasificacionId: '',
      compromisoId: '',
      estado: ''
    });
    setCurrentPage(1);
  };

  const handleBuscar = () => {
    setCurrentPage(1);
    cargarMatriz();
  };

  // Handler para click en chip de compromiso
  const handleChipClick = (entidad, compromisoIndex, estado) => {
    setEntidadSeleccionada(entidad);
    setCompromisoSeleccionado(compromisoIndex + 1);
    setEstadoSeleccionado(estado);
    setVistaDetalle(true);
  };

  // Handler para volver a la matriz
  const handleVolver = () => {
    setVistaDetalle(false);
    setEntidadSeleccionada(null);
    setCompromisoSeleccionado(null);
    setEstadoSeleccionado(null);
    // Recargar la matriz para ver los cambios
    cargarMatriz();
  };

  // Handler interno que ejecuta la evaluación
  const ejecutarEvaluacion = async (nuevoEstado, observaciones) => {
    if (entidadSeleccionada && compromisoSeleccionado) {
      try {
        const response = await evaluacionService.updateEstado(
          compromisoSeleccionado,
          entidadSeleccionada.id,
          nuevoEstado,
          observaciones
        );
        
        if (response.isSuccess) {
          // Actualizar el estado local de las entidades
          const nuevasEntidades = entidades.map(e => {
            if (e.id === entidadSeleccionada.id) {
              const nuevosCompromisos = [...e.compromisos];
              nuevosCompromisos[compromisoSeleccionado - 1] = nuevoEstado;
              return { ...e, compromisos: nuevosCompromisos };
            }
            return e;
          });
          
          setEntidades(nuevasEntidades);
          
          // Actualizar también la entidad seleccionada para que el panel refleje el cambio
          setEntidadSeleccionada(prev => {
            if (prev) {
              const nuevosCompromisos = [...(prev.compromisos || [])];
              nuevosCompromisos[compromisoSeleccionado - 1] = nuevoEstado;
              return { ...prev, compromisos: nuevosCompromisos };
            }
            return prev;
          });
          
          // Actualizar el estado seleccionado para el panel de detalle
          setEstadoSeleccionado(nuevoEstado);
          
          if (nuevoEstado === 'aceptado') {
            showSuccessToast(`Compromiso ${compromisoSeleccionado} aprobado exitosamente`);
          } else if (nuevoEstado === 'observado') {
            showSuccessToast(`Compromiso ${compromisoSeleccionado} observado. Se notificará a la entidad.`);
          } else {
            showSuccessToast(`Estado actualizado a "${nuevoEstado}"`);
          }
          
          // Volver al panel de matriz después de evaluar
          setVistaDetalle(false);
          setEntidadSeleccionada(null);
          setCompromisoSeleccionado(null);
          setEstadoSeleccionado(null);
        } else {
          showErrorToast('Error al actualizar el estado');
        }
      } catch (error) {
        console.error('Error al evaluar:', error);
        showErrorToast('Error al actualizar el estado. Por favor intente nuevamente.');
      }
    }
  };

  // Handler para evaluar un compromiso con confirmación
  const handleEvaluar = async (nuevoEstado, observaciones) => {
    if (!entidadSeleccionada || !compromisoSeleccionado) return;

    const esAprobacion = nuevoEstado === 'aceptado';
    const titulo = esAprobacion 
      ? `¿Confirmar aprobación del Compromiso ${compromisoSeleccionado}?`
      : `¿Confirmar observación del Compromiso ${compromisoSeleccionado}?`;
    const mensaje = esAprobacion
      ? `Se aprobará el cumplimiento para la entidad "${entidadSeleccionada.nombre}".`
      : `Se marcará como observado y se notificará a la entidad "${entidadSeleccionada.nombre}".`;

    showConfirmToast({
      title: titulo,
      message: mensaje,
      confirmText: esAprobacion ? 'Aprobar' : 'Observar',
      cancelText: 'Cancelar',
      loadingText: esAprobacion ? 'Aprobando...' : 'Registrando observación...',
      confirmButtonClass: esAprobacion 
        ? 'px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors'
        : 'px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors',
      onConfirm: async () => {
        await ejecutarEvaluacion(nuevoEstado, observaciones);
      }
    });
  };

  // Si está en vista de detalle, mostrar el panel
  if (vistaDetalle && entidadSeleccionada) {
    return (
      <div className="h-[calc(100vh-64px)]">
        <EvaluacionDetallePanel
          entidad={entidadSeleccionada}
          compromisoId={compromisoSeleccionado}
          estadoActual={estadoSeleccionado}
          onVolver={handleVolver}
          onEvaluar={handleEvaluar}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary-100 rounded-xl">
            <BarChart3 className="w-8 h-8 text-primary-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Evaluación & Cumplimiento</h1>
            <p className="text-gray-600 mt-1">Matriz de evaluación de compromisos por entidad</p>
          </div>
        </div>
      </div>

      {/* Panel de Búsqueda Avanzada */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        {/* <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Search size={20} />
          Búsqueda Avanzada
        </h2> */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Entidad
            </label>
            <input
              type="text"
              name="entidad"
              value={filtros.entidad}
              onChange={handleFiltroChange}
              placeholder="Buscar entidad..."
              className="input-field"
            />
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
              <option value="">Todos los sectores</option>
              {sectores.map((sector) => (
                <option key={sector.sectorId} value={sector.sectorId}>
                  {sector.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Clasificación
            </label>
            <select
              name="clasificacionId"
              value={filtros.clasificacionId}
              onChange={handleFiltroChange}
              className="input-field"
            >
              <option value="">Todas las clasificaciones</option>
              {clasificaciones.map((clasificacion) => (
                <option key={clasificacion.clasificacionId} value={clasificacion.clasificacionId}>
                  {clasificacion.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Compromiso
            </label>
            <select
              name="compromisoId"
              value={filtros.compromisoId}
              onChange={handleFiltroChange}
              className="input-field"
            >
              <option value="">Todos los compromisos</option>
              {compromisosOptions.map((num) => (
                <option key={num} value={num}>Compromiso {num}</option>
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
              {estadosOptions.map((estado) => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={handleBuscar}
              className="btn-primary flex items-center gap-2 px-4 py-2"
              disabled={loading}
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
              Buscar
            </button>
            <button
              onClick={limpiarFiltros}
              className="btn-secondary flex items-center gap-2 px-4 py-2"
              title="Limpiar filtros"
            >
              <FilterX size={18} />
            </button>
          </div>
        </div>

        {/* Leyenda de estados */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-600 mb-2">Leyenda de estados:</p>
          <div className="flex flex-wrap gap-2">
            {estadosOptions.map((estado) => (
              <span
                key={estado}
                className={`px-2 py-1 text-xs font-semibold rounded-full ${getEstadoStyles(estado)}`}
              >
                {getEstadoAbreviado(estado)} - {estado}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Matriz de Evaluación */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Matriz de Evaluación ({pagination.totalItems} entidades - Página {currentPage} de {pagination.totalPages || 1})
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={48} className="animate-spin text-primary" />
            <span className="ml-4 text-gray-600">Cargando matriz de evaluación...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {/* Columna fija de Entidad */}
                  <th className="sticky left-0 z-20 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300 min-w-[300px]">
                    Entidad
                  </th>
                  {/* Columnas de compromisos */}
                  {Array.from({ length: 21 }, (_, i) => (
                    <th
                      key={i + 1}
                      className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[60px]"
                    >
                      {i + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {entidades.map((entidad) => (
                  <tr key={entidad.id} className="hover:bg-gray-50">
                    {/* Columna fija de Entidad */}
                    <td className="sticky left-0 z-10 bg-white px-4 py-3 text-sm font-medium text-gray-900 border-r-2 border-gray-300 min-w-[300px] hover:bg-gray-50">
                      <div className="truncate max-w-[280px]" title={entidad.nombre}>
                        {entidad.nombre}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {entidad.sector} • {entidad.clasificacion}
                      </div>
                    </td>
                    {/* Celdas de compromisos - chips clickeables */}
                    {entidad.compromisos.map((estado, index) => (
                      <td key={index} className="px-1 py-2 text-center">
                        <button
                          onClick={() => handleChipClick(entidad, index, estado)}
                          className={`inline-block px-2 py-1 text-xs font-semibold rounded-full cursor-pointer transition-all hover:scale-110 hover:shadow-md ${getEstadoStyles(estado)}`}
                          title={`Clic para evaluar Compromiso ${index + 1}: ${estado}`}
                        >
                          {getEstadoAbreviado(estado)}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {entidades.length === 0 && !loading && (
              <div className="text-center py-12 text-gray-500">
                <BarChart3 size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No se encontraron entidades con los filtros aplicados</p>
              </div>
            )}
          </div>
        )}

        {/* Paginación */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Mostrando {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, pagination.totalItems)} de {pagination.totalItems} entidades
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <ChevronLeft size={16} />
                Anterior
              </button>
              
              {/* Números de página */}
              <div className="flex gap-1">
                {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 7) {
                    pageNum = i + 1;
                  } else if (currentPage <= 4) {
                    pageNum = i + 1;
                  } else if (currentPage >= pagination.totalPages - 3) {
                    pageNum = pagination.totalPages - 6 + i;
                  } else {
                    pageNum = currentPage - 3 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        pageNum === currentPage
                          ? 'bg-primary text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                disabled={currentPage === pagination.totalPages}
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === pagination.totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Siguiente
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvaluacionCumplimiento;
