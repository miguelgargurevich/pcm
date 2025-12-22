import { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  X,
  Calendar,
  Building2,
  FileText,
  User,
  Clock,
  ArrowRight,
  RefreshCw,
  Download
} from 'lucide-react';
import apiService from '../services/api';
import toast from 'react-hot-toast';

// Badge para estados
const EstadoBadge = ({ estado, esNuevo }) => {
  const getColor = (estado) => {
    const colors = {
      'PENDIENTE': 'bg-gray-100 text-gray-700',
      'SIN REPORTAR': 'bg-yellow-100 text-yellow-700',
      'NO EXIGIBLE': 'bg-purple-100 text-purple-700',
      'EN PROCESO': 'bg-blue-100 text-blue-700',
      'ENVIADO': 'bg-cyan-100 text-cyan-700',
      'EN REVISIÓN': 'bg-orange-100 text-orange-700',
      'OBSERVADO': 'bg-red-100 text-red-700',
      'ACEPTADO': 'bg-green-100 text-green-700',
    };
    return colors[estado] || 'bg-gray-100 text-gray-700';
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getColor(estado)} ${esNuevo ? 'ring-2 ring-offset-1 ring-green-400' : ''}`}>
      {estado || 'N/A'}
    </span>
  );
};

// Modal para ver snapshot
const SnapshotModal = ({ isOpen, onClose, historial }) => {
  if (!isOpen || !historial) return null;

  const snapshot = historial.datosSnapshot;
  
  // Backend envía PascalCase (DatosFormulario), convertir a camelCase para el frontend
  const datosFormulario = snapshot?.DatosFormulario || snapshot?.datosFormulario || {};
  const datosRelacionados = snapshot?.DatosRelacionados || snapshot?.datosRelacionados || {};
  const compromiso = snapshot?.Compromiso || snapshot?.compromiso || {};
  const entidad = snapshot?.Entidad || snapshot?.entidad || {};
  const cumplimiento = snapshot?.Cumplimiento || snapshot?.cumplimiento || {};
  const metadata = snapshot?.Metadata || snapshot?.metadata || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary-600 to-primary-700 rounded-t-xl text-white">
          <div className="flex items-center gap-3">
            <Eye className="w-6 h-6" />
            <div>
              <h2 className="text-lg font-semibold">Snapshot de Datos</h2>
              <p className="text-sm text-white/80">
                {new Date(historial.fechaCambio).toLocaleString('es-PE')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Información del cambio */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500 block mb-1">Compromiso</span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded">
                    C{historial.compromisoId || '?'}
                  </span>
                  <span className="font-medium text-xs">{historial.compromisoNombre || 'Sin nombre'}</span>
                </div>
              </div>
              <div>
                <span className="text-gray-500 block">Entidad</span>
                <span className="font-medium">{historial.entidadNombre || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Cambio de Estado</span>
                <div className="flex items-center gap-2 mt-1">
                  <EstadoBadge estado={historial.estadoAnteriorNombre} />
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <EstadoBadge estado={historial.estadoNuevoNombre} esNuevo />
                </div>
              </div>
              <div>
                <span className="text-gray-500 block">Usuario</span>
                <span className="font-medium">{historial.usuarioResponsableNombre || 'Sistema'}</span>
              </div>
            </div>
          </div>

          {/* Observación */}
          {historial.observacionSnapshot && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Observación
              </h3>
              <p className="text-yellow-700">{historial.observacionSnapshot}</p>
            </div>
          )}

          {/* Snapshot de datos */}
          {snapshot ? (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <History className="w-5 h-5 text-primary-600" />
                Datos del Compromiso al momento del cambio
              </h3>

              {/* Metadatos del snapshot */}
              {metadata && Object.keys(metadata).length > 0 && (
                <div className="p-3 bg-blue-50 rounded-lg text-sm">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <span className="text-blue-600">Acción:</span>
                      <span className="ml-2 font-medium">{metadata.TipoAccion || metadata.tipoAccion}</span>
                    </div>
                    <div>
                      <span className="text-blue-600">Timestamp:</span>
                      <span className="ml-2 font-medium">
                        {new Date(metadata.FechaCaptura || metadata.timestampCaptura).toLocaleString('es-PE')}
                      </span>
                    </div>
                    {(metadata.IpOrigen || metadata.ipOrigen) && (
                      <div>
                        <span className="text-blue-600">IP:</span>
                        <span className="ml-2 font-medium">{metadata.IpOrigen || metadata.ipOrigen}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Datos del compromiso */}
              {datosFormulario && Object.keys(datosFormulario).length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left p-3 font-semibold text-gray-700 w-1/3">Campo</th>
                        <th className="text-left p-3 font-semibold text-gray-700">Valor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {Object.entries(datosFormulario).map(([key, value]) => (
                        <tr key={key} className="hover:bg-gray-50">
                          <td className="p-3 font-medium text-gray-600">{formatFieldName(key)}</td>
                          <td className="p-3">
                            {formatFieldValue(value)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                  <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No hay datos de compromiso en el snapshot</p>
                </div>
              )}

              {/* Información de cumplimiento */}
              {cumplimiento && Object.keys(cumplimiento).length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Información de Cumplimiento</h4>
                  <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4 text-sm">
                    {Object.entries(cumplimiento).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-gray-500">{formatFieldName(key)}:</span>
                        <span className="ml-2 font-medium">{formatFieldValue(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Datos relacionados */}
              {datosRelacionados && Object.keys(datosRelacionados).length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Datos Relacionados</h4>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <pre className="text-xs overflow-x-auto">{JSON.stringify(datosRelacionados, null, 2)}</pre>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <History className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No hay snapshot disponible para este registro</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 rounded-b-xl flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

// Formatear nombres de campos
const formatFieldName = (name) => {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

// Formatear valores de campos
const formatFieldValue = (value) => {
  if (value === null || value === undefined) return <span className="text-gray-400 italic">Sin valor</span>;
  if (typeof value === 'boolean') return value ? '✓ Sí' : '✗ No';
  if (typeof value === 'object') return <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">{JSON.stringify(value, null, 2)}</pre>;
  if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
    return new Date(value).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  return String(value);
};

// Componente principal
const HistorialCumplimiento = () => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    compromisoId: '',
    entidadId: '',
    estadoId: '',
    fechaDesde: '',
    fechaHasta: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 0
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedHistorial, setSelectedHistorial] = useState(null);
  const [compromisos, setCompromisos] = useState([]);
  const [entidades, setEntidades] = useState([]);

  const estados = [
    { id: 1, nombre: 'PENDIENTE' },
    { id: 2, nombre: 'SIN REPORTAR' },
    { id: 3, nombre: 'NO EXIGIBLE' },
    { id: 4, nombre: 'EN PROCESO' },
    { id: 5, nombre: 'ENVIADO' },
    { id: 6, nombre: 'EN REVISIÓN' },
    { id: 7, nombre: 'OBSERVADO' },
    { id: 8, nombre: 'ACEPTADO' },
  ];

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  // Cargar historial cuando cambian filtros o paginación
  useEffect(() => {
    cargarHistorial();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.pageSize]);

  const cargarDatosIniciales = async () => {
    try {
      // Cargar compromisos y entidades para los filtros
      const [compRes, entRes] = await Promise.all([
        apiService.get('/CompromisoGobiernoDigital'),
        apiService.get('/entidades')
      ]);

      if (compRes.data?.isSuccess || compRes.data?.success) {
        setCompromisos(compRes.data.data || []);
      }
      if (entRes.data?.isSuccess || entRes.data?.success) {
        setEntidades(entRes.data.data || []);
      }

      await cargarHistorial();
    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
      toast.error('Error al cargar datos iniciales');
    }
  };

  const cargarHistorial = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', pagination.page);
      params.append('pageSize', pagination.pageSize);
      
      if (filtros.compromisoId) params.append('compromisoId', filtros.compromisoId);
      if (filtros.entidadId) params.append('entidadId', filtros.entidadId);
      if (filtros.estadoId) params.append('estadoId', filtros.estadoId);
      if (filtros.fechaDesde) params.append('fechaDesde', filtros.fechaDesde);
      if (filtros.fechaHasta) params.append('fechaHasta', filtros.fechaHasta);

      console.log('📞 Llamando a /CumplimientoHistorial con params:', params.toString());
      const response = await apiService.get(`/CumplimientoHistorial?${params.toString()}`);
      console.log('📦 Respuesta completa del historial:', response);
      console.log('📦 response.data:', response.data);
      
      if (response.data?.success || response.data?.isSuccess) {
        const items = response.data.data?.items || response.data.data || [];
        console.log('✅ Items de historial:', items);
        setHistorial(items);
        setPagination(prev => ({
          ...prev,
          totalItems: response.data.data?.totalItems || items.length || 0,
          totalPages: response.data.data?.totalPages || 1
        }));
      } else {
        console.warn('⚠️ Respuesta sin éxito:', response.data);
        setHistorial([]);
      }
    } catch (error) {
      console.error('❌ Error cargando historial:', error);
      console.error('Error details:', error.response?.data);
      toast.error('Error al cargar historial de cumplimiento');
      setHistorial([]);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    cargarHistorial();
  };

  const limpiarFiltros = () => {
    setFiltros({
      compromisoId: '',
      entidadId: '',
      estadoId: '',
      fechaDesde: '',
      fechaHasta: '',
    });
    setPagination(prev => ({ ...prev, page: 1 }));
    setTimeout(cargarHistorial, 100);
  };

  const exportarCSV = () => {
    if (historial.length === 0) {
      toast.error('No hay datos para exportar');
      return;
    }

    const headers = ['Fecha', 'Compromiso', 'Compromiso Nombre', 'Entidad', 'Estado Anterior', 'Estado Nuevo', 'Usuario', 'Observación'];
    const rows = historial.map(h => [
      new Date(h.fechaCambio).toLocaleString('es-PE'),
      `C${h.compromisoId || '?'}`,
      h.compromisoNombre || 'Sin nombre',
      h.entidadNombre || h.entidadId,
      h.estadoAnteriorNombre || 'N/A',
      h.estadoNuevoNombre,
      h.usuarioResponsableNombre || 'Sistema',
      h.observacionSnapshot || ''
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `historial_cumplimiento_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('Archivo exportado correctamente');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-100 rounded-xl">
              <History className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Historial de Cumplimiento</h1>
              <p className="text-gray-600 mt-1">Visualiza todos los cambios de estado y snapshots de datos</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={cargarHistorial}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
            <button
              onClick={exportarCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Exportar CSV
            </button>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-700">Filtros</span>
            {Object.values(filtros).some(v => v) && (
              <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full">
                Activos
              </span>
            )}
          </div>
          {showFilters ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </button>

        {showFilters && (
          <div className="p-4 border-t bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Compromiso</label>
                <select
                  value={filtros.compromisoId}
                  onChange={(e) => setFiltros({ ...filtros, compromisoId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Todos</option>
                  {compromisos.map(c => (
                    <option key={c.compromisoId} value={c.compromisoId}>
                      {c.nombreCompromiso}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Entidad</label>
                <select
                  value={filtros.entidadId}
                  onChange={(e) => setFiltros({ ...filtros, entidadId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Todas</option>
                  {entidades.map(e => (
                    <option key={e.entidadId} value={e.entidadId}>
                      {e.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  value={filtros.estadoId}
                  onChange={(e) => setFiltros({ ...filtros, estadoId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Todos</option>
                  {estados.map(e => (
                    <option key={e.id} value={e.id}>{e.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Desde</label>
                <input
                  type="date"
                  value={filtros.fechaDesde}
                  onChange={(e) => setFiltros({ ...filtros, fechaDesde: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Hasta</label>
                <input
                  type="date"
                  value={filtros.fechaHasta}
                  onChange={(e) => setFiltros({ ...filtros, fechaHasta: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={limpiarFiltros}
                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Limpiar
              </button>
              <button
                onClick={aplicarFiltros}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Buscar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tabla de historial */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        ) : historial.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <History className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">No se encontraron registros de historial</p>
            <p className="text-sm mt-1">Ajusta los filtros o espera a que se generen cambios de estado</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Fecha
                      </div>
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Compromiso
                      </div>
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Entidad
                      </div>
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">Cambio de Estado</th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Usuario
                      </div>
                    </th>
                    <th className="text-center p-4 font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {historial.map((item) => (
                    <tr key={item.historialId} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-800">
                            {new Date(item.fechaCambio).toLocaleDateString('es-PE')}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {new Date(item.fechaCambio).toLocaleTimeString('es-PE')}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded">
                            C{item.compromisoId || '?'}
                          </span>
                          <div className="text-sm font-medium text-gray-800 max-w-xs truncate">
                            {item.compromisoNombre || 'Sin nombre'}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-700 max-w-xs truncate">
                          {item.entidadNombre || 'N/A'}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <EstadoBadge estado={item.estadoAnteriorNombre} />
                          <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <EstadoBadge estado={item.estadoNuevoNombre} esNuevo />
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-700">
                          {item.usuarioResponsableNombre || 'Sistema'}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center">
                          <button
                            onClick={() => setSelectedHistorial(item)}
                            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="Ver snapshot"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className="flex items-center justify-between p-4 border-t bg-gray-50">
              <div className="text-sm text-gray-600">
                Mostrando {((pagination.page - 1) * pagination.pageSize) + 1} - {Math.min(pagination.page * pagination.pageSize, pagination.totalItems)} de {pagination.totalItems} registros
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page <= 1}
                  className="px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                >
                  Anterior
                </button>
                <span className="px-3 py-1 bg-primary-600 text-white rounded-lg">
                  {pagination.page}
                </span>
                <span className="text-gray-500">de {pagination.totalPages}</span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal de snapshot */}
      <SnapshotModal
        isOpen={!!selectedHistorial}
        onClose={() => setSelectedHistorial(null)}
        historial={selectedHistorial}
      />
    </div>
  );
};

export default HistorialCumplimiento;
