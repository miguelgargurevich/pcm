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
  Download,
  FilterX
} from 'lucide-react';
import apiService from '../services/api';
import toast from 'react-hot-toast';

// Función para obtener abreviatura de estado
const getEstadoAbreviado = (estado) => {
  const abreviaturas = {
    'ACEPTADO': 'ACE',
    'ENVIADO': 'ENV',
    'EN REVISIÓN': 'REV',
    'EN PROCESO': 'PRO',
    'PENDIENTE': 'PEN',
    'OBSERVADO': 'OBS',
    'SIN REPORTAR': 'S/R',
    'NO EXIGIBLE': 'N/E'
  };
  return abreviaturas[estado] || estado?.substring(0, 3)?.toUpperCase() || 'N/A';
};

// Badge para estados
const EstadoBadge = ({ estado, esNuevo }) => {
  const getColor = (estado) => {
    const colors = {
      'ACEPTADO': 'bg-green-500 text-white',
      'ENVIADO': 'bg-blue-500 text-white',
      'EN REVISIÓN': 'bg-purple-500 text-white',
      'EN PROCESO': 'bg-yellow-500 text-white',
      'PENDIENTE': 'bg-orange-500 text-white',
      'OBSERVADO': 'bg-red-500 text-white',
      'SIN REPORTAR': 'bg-red-700 text-white',
      'NO EXIGIBLE': 'bg-gray-400 text-white',
    };
    return colors[estado] || 'bg-gray-300 text-gray-700';
  };

  return (
    <span 
      className={`px-2 py-1 text-xs font-medium rounded-full ${getColor(estado)} ${esNuevo ? 'ring-2 ring-offset-1 ring-green-400' : ''}`}
      title={estado}
    >
      {getEstadoAbreviado(estado)}
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
  const cumplimiento = snapshot?.Cumplimiento || snapshot?.cumplimiento || {};
  const metadata = snapshot?.Metadata || snapshot?.metadata || {};
  const compromiso = snapshot?.Compromiso || snapshot?.compromiso || {};

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
                      {Object.entries(datosFormulario)
                        .filter(([key]) => !['estadoPcm', 'EstadoPCM', 'estadoPCM'].includes(key))
                        .map(([key, value]) => (
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
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                    {/* Compromiso */}
                    {compromiso.Nombre && (
                      <div className="pb-3 border-b border-gray-200">
                        <span className="text-gray-600 block mb-1">Compromiso:</span>
                        <p className="font-semibold text-gray-900">{compromiso.Nombre}</p>
                        {compromiso.Descripcion && (
                          <p className="text-xs text-gray-600 mt-1">{compromiso.Descripcion}</p>
                        )}
                      </div>
                    )}
                    
                    {/* ID de Cumplimiento */}
                    {cumplimiento.CumplimientoId && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Código de Cumplimiento:</span>
                        <span className="font-mono text-sm font-semibold text-primary-600">#{cumplimiento.CumplimientoId}</span>
                      </div>
                    )}
                    
                    {/* Estado */}
                    {cumplimiento.EstadoNombre && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Estado:</span>
                        <span className="font-medium text-gray-900">{cumplimiento.EstadoNombre}</span>
                      </div>
                    )}
                    
                    {/* Fecha de Asignación */}
                    {cumplimiento.FechaAsignacion && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Fecha de Asignación:</span>
                        <span className="font-medium text-gray-900">
                          {new Date(cumplimiento.FechaAsignacion).toLocaleDateString('es-PE', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                    )}
                    
                    {/* Observaciones PCM */}
                    {cumplimiento.ObservacionPcm && (
                      <div className="pt-2 border-t border-gray-200">
                        <span className="text-gray-600 block mb-1">Observaciones PCM:</span>
                        <p className="font-medium text-gray-900 bg-white p-3 rounded border border-gray-200">
                          {cumplimiento.ObservacionPcm}
                        </p>
                      </div>
                    )}
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
  
  // Detectar rutas de archivos PDF o URLs
  if (typeof value === 'string') {
    // Verificar si es una ruta PDF
    if (value.includes('.pdf') || value.includes('/pdfs/') || value.includes('/uploads/')) {
      const fileName = value.split('/').pop() || 'documento.pdf';
      const fullUrl = value.startsWith('http') ? value : `${import.meta.env.VITE_API_URL || 'http://localhost:5147'}${value}`;
      return (
        <a 
          href={fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 hover:underline"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {fileName}
        </a>
      );
    }
    // Verificar si es una fecha
    if (value.match(/^\d{4}-\d{2}-\d{2}/)) {
      return new Date(value).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' });
    }
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

  // Cargar datos iniciales (solo una vez al montar)
  useEffect(() => {
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
      } catch (error) {
        console.error('Error cargando datos iniciales:', error);
        toast.error('Error al cargar datos iniciales');
      }
    };

    cargarDatosIniciales();
  }, []); // Solo al montar el componente

  // Cargar historial cuando cambian filtros o paginación
  useEffect(() => {
    cargarHistorial();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.pageSize, filtros]);

  const cargarHistorial = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', pagination.page);
      params.append('pageSize', pagination.pageSize);
      
      // Agregar filtros solo si tienen valor
      if (filtros.compromisoId && filtros.compromisoId !== '') {
        params.append('compromisoId', parseInt(filtros.compromisoId));
      }
      if (filtros.entidadId && filtros.entidadId !== '') {
        params.append('entidadId', filtros.entidadId);
      }
      if (filtros.estadoId && filtros.estadoId !== '') {
        params.append('estadoId', parseInt(filtros.estadoId));
      }
      if (filtros.fechaDesde && filtros.fechaDesde !== '') {
        params.append('fechaDesde', filtros.fechaDesde);
      }
      if (filtros.fechaHasta && filtros.fechaHasta !== '') {
        params.append('fechaHasta', filtros.fechaHasta);
      }

      console.log('📞 Llamando a /CumplimientoHistorial con params:', params.toString());
      console.log('🔍 Filtros actuales:', filtros);
      const response = await apiService.get(`/CumplimientoHistorial?${params.toString()}`);
      console.log('📦 Respuesta completa del historial:', response);
      console.log('📦 response.data:', response.data);
      console.log('📦 response.data.data:', response.data.data);
      console.log('📦 Keys de response.data.data:', response.data.data ? Object.keys(response.data.data) : 'undefined');
      
      if (response.data?.success || response.data?.isSuccess) {
        // Backend puede retornar Items (PascalCase) o items (camelCase)
        const items = response.data.data?.Items || response.data.data?.items || [];
        console.log('✅ Items extraídos:', items);
        console.log('✅ Items.length:', items.length);
        console.log('✅ Es un array?:', Array.isArray(items));
        console.log('✅ Tipo de items:', typeof items);
        setHistorial(items);
        setPagination(prev => ({
          ...prev,
          totalItems: response.data.data?.TotalItems || response.data.data?.totalItems || items.length || 0,
          totalPages: response.data.data?.TotalPages || response.data.data?.totalPages || 1
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

  const limpiarFiltros = () => {
    setFiltros({
      compromisoId: '',
      entidadId: '',
      estadoId: '',
      fechaDesde: '',
      fechaHasta: '',
    });
    setPagination(prev => ({ ...prev, page: 1 }));
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
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
            <button
              onClick={exportarCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Exportar CSV
            </button>
          </div>
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
              {Object.values(filtros).some(v => v) && (
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
                      C{c.compromisoId} - {c.nombreCompromiso}
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

      {/* Leyenda de estados */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <p className="text-sm font-medium text-gray-700 mb-3">Leyenda de estados:</p>
        <div className="flex flex-wrap gap-2">
          {['ACEPTADO', 'ENVIADO', 'EN REVISIÓN', 'EN PROCESO', 'PENDIENTE', 'OBSERVADO', 'SIN REPORTAR', 'NO EXIGIBLE'].map((estado) => (
            <span
              key={estado}
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                estado === 'ACEPTADO' ? 'bg-green-500 text-white' :
                estado === 'ENVIADO' ? 'bg-blue-500 text-white' :
                estado === 'EN REVISIÓN' ? 'bg-purple-500 text-white' :
                estado === 'EN PROCESO' ? 'bg-yellow-500 text-white' :
                estado === 'PENDIENTE' ? 'bg-orange-500 text-white' :
                estado === 'OBSERVADO' ? 'bg-red-500 text-white' :
                estado === 'SIN REPORTAR' ? 'bg-red-700 text-white' :
                'bg-gray-400 text-white'
              }`}
            >
              {getEstadoAbreviado(estado)} - {estado}
            </span>
          ))}
        </div>
      </div>

      {/* Tabla de historial */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                      #
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      Fecha
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Compromiso
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entidad
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-56">
                      Cambio de Estado
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Usuario
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {historial.map((item, index) => (
                    <tr key={item.historialId}>
                      <td className="px-2 py-3 text-center text-sm font-medium text-gray-900">
                        {(pagination.page - 1) * pagination.pageSize + index + 1}
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-900">
                        <div className="font-medium text-xs leading-tight">
                          {new Date(item.fechaCambio).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {new Date(item.fechaCambio).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-900">
                        <div className="flex items-start gap-1">
                          <span className="px-1.5 py-0.5 bg-primary-100 text-primary-700 text-xs font-bold rounded flex-shrink-0">
                            C{item.compromisoId || '?'}
                          </span>
                          <div className="font-medium text-xs leading-tight line-clamp-2">
                            {item.compromisoNombre || 'Sin nombre'}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-900">
                        <div className="text-xs leading-tight line-clamp-2">
                          {item.entidadNombre || 'N/A'}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-900">
                        <div className="flex items-center gap-1.5">
                          <EstadoBadge estado={item.estadoAnteriorNombre} />
                          <ArrowRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                          <EstadoBadge estado={item.estadoNuevoNombre} esNuevo />
                        </div>
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-900">
                        <div className="text-xs leading-tight line-clamp-2">
                          {item.usuarioResponsableNombre || 'Sistema'}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center text-sm font-medium">
                        <button
                          onClick={() => setSelectedHistorial(item)}
                          className="text-primary-600 hover:text-blue-900 inline-flex items-center justify-center"
                          title="Ver snapshot"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t bg-gray-50">
                <div className="text-sm text-gray-600">
                  Mostrando {((pagination.page - 1) * pagination.pageSize) + 1} - {Math.min(pagination.page * pagination.pageSize, pagination.totalItems)} de {pagination.totalItems} registros
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page <= 1}
                    className="px-3 py-1 text-sm text-gray-600 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                  >
                    Anterior
                  </button>
                  <span className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg">
                    {pagination.page}
                  </span>
                  <span className="text-sm text-gray-600">de {pagination.totalPages}</span>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page >= pagination.totalPages}
                    className="px-3 py-1 text-sm text-gray-600 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
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
