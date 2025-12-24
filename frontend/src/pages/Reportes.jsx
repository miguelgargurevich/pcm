import { useState, useEffect } from 'react';
import { 
  Database, 
  Building2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Download,
  RefreshCw,
  ExternalLink,
  FileText,
  Users,
  Link as LinkIcon
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import com10DatosAbiertosService from '../services/com10DatosAbiertosService';
import toast from 'react-hot-toast';

const COLORS = {
  alto: '#22c55e',
  medio: '#eab308',
  bajo: '#ef4444'
};

const PIE_COLORS = ['#22c55e', '#eab308', '#ef4444'];

const Reportes = () => {
  const [loading, setLoading] = useState(true);
  const [datosEntidades, setDatosEntidades] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    conResponsable: 0,
    conUrl: 0,
    conNorma: 0,
    totalDatasets: 0,
    avanceAlto: 0,
    avanceMedio: 0,
    avanceBajo: 0
  });

  useEffect(() => {
    cargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const response = await com10DatosAbiertosService.getAll();
      
      if (response.isSuccess) {
        const datos = response.data || [];
        setDatosEntidades(datos);
        calcularEstadisticas(datos);
      } else {
        toast.error('Error al cargar datos de Datos Abiertos');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const calcularEstadisticas = (datos) => {
    const stats = {
      total: datos.length,
      conResponsable: datos.filter(d => d.tieneResponsable).length,
      conUrl: datos.filter(d => d.tieneUrlPnda).length,
      conNorma: datos.filter(d => d.tieneNormaAprobacion).length,
      totalDatasets: datos.reduce((sum, d) => sum + (d.totalDatasets || 0), 0),
      avanceAlto: 0,
      avanceMedio: 0,
      avanceBajo: 0
    };

    // Calcular nivel de avance
    datos.forEach(d => {
      const nivel = calcularNivelAvance(d);
      if (nivel === 'alto') stats.avanceAlto++;
      else if (nivel === 'medio') stats.avanceMedio++;
      else stats.avanceBajo++;
    });

    setEstadisticas(stats);
  };

  const calcularNivelAvance = (entidad) => {
    const criterios = {
      responsable: entidad.tieneResponsable,
      url: entidad.tieneUrlPnda,
      norma: entidad.tieneNormaAprobacion,
      datasets: entidad.totalDatasets >= 12,
      estado: entidad.estadoPCM?.toLowerCase() === 'aceptado'
    };

    const cumplidos = Object.values(criterios).filter(Boolean).length;

    if (cumplidos >= 4) return 'alto';
    if (cumplidos >= 2) return 'medio';
    return 'bajo';
  };

  const calcularPorcentajeAvance = (entidad) => {
    const criterios = {
      responsable: entidad.tieneResponsable,
      url: entidad.tieneUrlPnda,
      norma: entidad.tieneNormaAprobacion,
      datasets: entidad.totalDatasets >= 12,
      evidencia: entidad.tienePdfEvidencia
    };

    const cumplidos = Object.values(criterios).filter(Boolean).length;
    return Math.round((cumplidos / 5) * 100);
  };

  const exportarCSV = () => {
    const headers = ['Entidad', 'RUC', 'Responsable PNDA', 'URL PNDA', 'Datasets', 'Norma Aprobación', 'Nivel Avance', 'Estado PCM'];
    const rows = datosEntidades.map(d => [
      d.entidadNombre,
      d.entidadRuc,
      d.tieneResponsable ? 'Sí' : 'No',
      d.tieneUrlPnda ? 'Sí' : 'No',
      d.totalDatasets || 0,
      d.tieneNormaAprobacion ? 'Sí' : 'No',
      calcularNivelAvance(d).toUpperCase(),
      d.estadoPCM || 'N/A'
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-datos-abiertos-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const datosGraficoDistribucion = [
    { name: 'Avance Alto', value: estadisticas.avanceAlto, color: COLORS.alto },
    { name: 'Avance Medio', value: estadisticas.avanceMedio, color: COLORS.medio },
    { name: 'Avance Bajo', value: estadisticas.avanceBajo, color: COLORS.bajo }
  ];

  const datosGraficoCriterios = [
    { criterio: 'Con Responsable', cantidad: estadisticas.conResponsable },
    { criterio: 'Con URL PNDA', cantidad: estadisticas.conUrl },
    { criterio: 'Con Norma', cantidad: estadisticas.conNorma }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Database className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Indicadores del Eje de Datos Abiertos
            </h1>
            <p className="text-gray-600">
              Seguimiento del cumplimiento del Compromiso 10 - PNDA
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={cargarDatos}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
          <button
            onClick={exportarCSV}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Entidades</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.total}</p>
            </div>
            <Building2 className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Con Responsable</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.conResponsable}</p>
              <p className="text-xs text-gray-500">
                {estadisticas.total > 0 ? ((estadisticas.conResponsable / estadisticas.total) * 100).toFixed(0) : 0}%
              </p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Con URL PNDA</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.conUrl}</p>
              <p className="text-xs text-gray-500">
                {estadisticas.total > 0 ? ((estadisticas.conUrl / estadisticas.total) * 100).toFixed(0) : 0}%
              </p>
            </div>
            <LinkIcon className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Con Norma</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.conNorma}</p>
              <p className="text-xs text-gray-500">
                {estadisticas.total > 0 ? ((estadisticas.conNorma / estadisticas.total) * 100).toFixed(0) : 0}%
              </p>
            </div>
            <FileText className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Datasets</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.totalDatasets}</p>
              <p className="text-xs text-gray-500">Acumulados</p>
            </div>
            <Database className="w-8 h-8 text-indigo-500" />
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución de Avance */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Panorama General de Avance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={datosGraficoDistribucion}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name.split(' ')[1]}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {datosGraficoDistribucion.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600">Alto ({estadisticas.avanceAlto})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm text-gray-600">Medio ({estadisticas.avanceMedio})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-600">Bajo ({estadisticas.avanceBajo})</span>
            </div>
          </div>
        </div>

        {/* Cumplimiento por Criterio */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Cumplimiento por Criterio
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosGraficoCriterios}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="criterio" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla de Entidades */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            Detalle por Entidad
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Criterios: Responsable PNDA | URL PNDA | Norma Aprobación | 12+ Datasets | Estado Aceptado
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entidad
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Responsable
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  URL PNDA
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Norma
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Datasets
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado PCM
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nivel de Avance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {datosEntidades.map((entidad) => {
                const nivel = calcularNivelAvance(entidad);
                const porcentaje = calcularPorcentajeAvance(entidad);
                
                return (
                  <tr key={entidad.entidadId} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {entidad.entidadNombre}
                        </p>
                        <p className="text-xs text-gray-500">RUC: {entidad.entidadRuc}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {entidad.tieneResponsable ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {entidad.tieneUrlPnda ? (
                        entidad.urlDatosAbiertos ? (
                          <a 
                            href={entidad.urlDatosAbiertos} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                        )
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {entidad.tieneNormaAprobacion ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        entidad.totalDatasets >= 12 
                          ? 'bg-green-100 text-green-800' 
                          : entidad.totalDatasets >= 6
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {entidad.totalDatasets || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        entidad.estadoPCM?.toLowerCase() === 'aceptado' 
                          ? 'bg-green-100 text-green-800' 
                          : entidad.estadoPCM?.toLowerCase() === 'enviado'
                          ? 'bg-blue-100 text-blue-800'
                          : entidad.estadoPCM?.toLowerCase() === 'observado'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {entidad.estadoPCM || 'Sin estado'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              nivel === 'alto' ? 'bg-green-500' :
                              nivel === 'medio' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${porcentaje}%` }}
                          ></div>
                        </div>
                        <span className={`text-xs font-medium uppercase ${
                          nivel === 'alto' ? 'text-green-600' :
                          nivel === 'medio' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {nivel}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leyenda de Criterios */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Criterios de Evaluación
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
          <div>
            <span className="font-semibold">Avance Alto (4-5 criterios):</span>
            <ul className="list-disc list-inside mt-1 text-xs">
              <li>Estado Aceptado por PCM</li>
              <li>Responsable PNDA designado</li>
              <li>URL PNDA registrada</li>
              <li>Norma de aprobación vigente</li>
              <li>12 o más datasets publicados</li>
            </ul>
          </div>
          <div>
            <span className="font-semibold">Avance Medio (2-3 criterios):</span>
            <ul className="list-disc list-inside mt-1 text-xs">
              <li>Proceso en curso</li>
              <li>Entre 6-11 datasets</li>
              <li>Algunos criterios pendientes</li>
            </ul>
          </div>
          <div>
            <span className="font-semibold">Avance Bajo (0-1 criterios):</span>
            <ul className="list-disc list-inside mt-1 text-xs">
              <li>Sin responsable o sin URL</li>
              <li>Menos de 6 datasets</li>
              <li>Mayoría de criterios sin cumplir</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reportes;
