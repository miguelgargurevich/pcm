import { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, 
  FileText, 
  AlertTriangle, 
  FolderKanban, 
  Download, 
  Filter, 
  FilterX,
  TrendingUp,
  Building2,
  ChevronDown,
  ChevronRight,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import evaluacionService from '../services/evaluacionService';
import { entidadesService } from '../services/entidadesService';

// Colores para los estados
const ESTADO_COLORS = {
  'aceptado': '#22c55e',
  'enviado': '#3b82f6',
  'en revisión': '#a855f7',
  'en proceso': '#eab308',
  'pendiente': '#f97316',
  'observado': '#ef4444',
  'sin reportar': '#b91c1c',
  'no exigible': '#9ca3af'
};

// Colores para etapas de proyectos
const ETAPA_COLORS = {
  'SIN INICIAR': '#ef4444',
  'PLANIFICACIÓN': '#eab308',
  'EJECUCIÓN': '#3b82f6',
  'CERRADO': '#6b7280'
};

// Colores para gráficos de pie
const PIE_COLORS = ['#22c55e', '#3b82f6', '#a855f7', '#eab308', '#f97316', '#ef4444', '#b91c1c', '#9ca3af'];

// Tipos de reportes
const TIPOS_REPORTE = [
  { id: 'avance-global', nombre: 'Avance Global de Cumplimiento', icon: BarChart3, color: 'bg-blue-500' },
  { id: 'observaciones', nombre: 'Entidades con Observaciones', icon: AlertTriangle, color: 'bg-orange-500' },
  { id: 'portafolio', nombre: 'Portafolio de Proyectos', icon: FolderKanban, color: 'bg-purple-500' }
];

const Reportes = () => {
  const [tipoReporteActivo, setTipoReporteActivo] = useState('avance-global');
  const [loading, setLoading] = useState(false);
  
  // Filtros globales
  const [filtros, setFiltros] = useState({
    sectorId: '',
    clasificacionId: '',
    entidadId: '',
    periodo: ''
  });
  
  // Datos
  const [sectores, setSectores] = useState([]);
  const [clasificaciones, setClasificaciones] = useState([]);
  const [entidades, setEntidades] = useState([]);
  const [datosEvaluacion, setDatosEvaluacion] = useState([]);
  const [proyectosData, setProyectosData] = useState([]);
  
  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        setLoading(true);
        const [sectoresRes, clasificacionesRes, entidadesRes] = await Promise.all([
          evaluacionService.getSectores(),
          evaluacionService.getClasificaciones(),
          entidadesService.getAll()
        ]);
        
        if (sectoresRes.isSuccess) setSectores(sectoresRes.data || []);
        if (clasificacionesRes.isSuccess) setClasificaciones(clasificacionesRes.data || []);
        if (entidadesRes.isSuccess || entidadesRes.IsSuccess) {
          setEntidades(entidadesRes.data || entidadesRes.Data || []);
        }
        
        // Cargar datos de evaluación inicial
        try {
          const response = await evaluacionService.getMatriz({
            page: 1,
            pageSize: 1000
          });
          
          if (response.isSuccess) {
            setDatosEvaluacion(response.data || []);
          }
        } catch (error) {
          console.error('Error al cargar datos de evaluación:', error);
        }
        
        // Cargar proyectos para el reporte de portafolio
        try {
          const proyectosRes = await evaluacionService.getProyectos();
          if (proyectosRes.isSuccess) {
            setProyectosData(proyectosRes.data || []);
          }
        } catch (error) {
          console.error('Error al cargar proyectos:', error);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    cargarDatosIniciales();
  }, []);

  // Recargar datos cuando cambian los filtros
  useEffect(() => {
    const cargarDatosConFiltros = async () => {
      try {
        // Cargar datos de evaluación (para reportes que no son portafolio)
        if (tipoReporteActivo !== 'portafolio') {
          const response = await evaluacionService.getMatriz({
            page: 1,
            pageSize: 1000,
            ...filtros
          });
          
          if (response.isSuccess) {
            setDatosEvaluacion(response.data || []);
          }
        }
        
        // Cargar proyectos para el reporte de portafolio
        if (tipoReporteActivo === 'portafolio') {
          const proyectosRes = await evaluacionService.getProyectos({
            sectorId: filtros.sectorId || undefined,
            clasificacionId: filtros.clasificacionId || undefined
          });
          if (proyectosRes.isSuccess) {
            setProyectosData(proyectosRes.data || []);
          }
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };
    
    cargarDatosConFiltros();
  }, [filtros, tipoReporteActivo]);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const limpiarFiltros = () => {
    setFiltros({ sectorId: '', clasificacionId: '', entidadId: '', periodo: '' });
  };

  // Datos procesados para gráficos
  const datosAvanceGlobal = useMemo(() => {
    if (!datosEvaluacion.length) return [];
    
    // Crear datos por compromiso (1-21)
    const compromisosData = Array.from({ length: 21 }, (_, i) => {
      const compromisoNum = i + 1;
      const estadosCont = {};
      
      datosEvaluacion.forEach(entidad => {
        if (entidad.compromisos && entidad.compromisos[i]) {
          const estado = entidad.compromisos[i];
          estadosCont[estado] = (estadosCont[estado] || 0) + 1;
        }
      });
      
      return {
        compromiso: `C${compromisoNum}`,
        nombre: `Compromiso ${compromisoNum}`,
        ...estadosCont,
        total: datosEvaluacion.length
      };
    });
    
    return compromisosData;
  }, [datosEvaluacion]);

  const datosResumenEstados = useMemo(() => {
    if (!datosEvaluacion.length) return [];
    
    const conteoEstados = {};
    datosEvaluacion.forEach(entidad => {
      if (entidad.compromisos) {
        entidad.compromisos.forEach(estado => {
          conteoEstados[estado] = (conteoEstados[estado] || 0) + 1;
        });
      }
    });
    
    return Object.entries(conteoEstados).map(([estado, cantidad]) => ({
      name: estado,
      value: cantidad,
      color: ESTADO_COLORS[estado] || '#9ca3af'
    }));
  }, [datosEvaluacion]);

  const entidadesConObservaciones = useMemo(() => {
    return datosEvaluacion.filter(entidad => {
      if (!entidad.compromisos) return false;
      return entidad.compromisos.some(estado => 
        estado === 'observado' || estado === 'pendiente' || estado === 'sin reportar'
      );
    }).map(entidad => ({
      ...entidad,
      compromisosObservados: entidad.compromisos?.filter(e => e === 'observado').length || 0,
      compromisosPendientes: entidad.compromisos?.filter(e => e === 'pendiente').length || 0,
      compromisosSinReportar: entidad.compromisos?.filter(e => e === 'sin reportar').length || 0,
      criticidad: (entidad.compromisos?.filter(e => e === 'observado').length || 0) * 3 +
                  (entidad.compromisos?.filter(e => e === 'sin reportar').length || 0) * 2 +
                  (entidad.compromisos?.filter(e => e === 'pendiente').length || 0)
    })).sort((a, b) => b.criticidad - a.criticidad);
  }, [datosEvaluacion]);

  const datosPortafolio = useMemo(() => {
    const porEtapa = {};
    const porTipo = {};
    const proyectosConRetraso = [];
    
    proyectosData.forEach(p => {
      const etapa = p.etapa?.toUpperCase() || 'SIN DEFINIR';
      const tipo = p.tipoProyecto || 'OTROS';
      
      // Por etapa
      porEtapa[etapa] = (porEtapa[etapa] || 0) + 1;
      
      // Por tipo
      porTipo[tipo] = (porTipo[tipo] || { cantidad: 0 });
      porTipo[tipo].cantidad++;
      
      // Proyectos con retraso
      if (p.fechaFinProg && p.fechaFinReal) {
        const fechaProg = new Date(p.fechaFinProg);
        const fechaReal = new Date(p.fechaFinReal);
        if (fechaReal > fechaProg) {
          const diasRetraso = Math.ceil((fechaReal - fechaProg) / (1000 * 60 * 60 * 24));
          proyectosConRetraso.push({ ...p, diasRetraso });
        }
      } else if (p.fechaFinProg && etapa !== 'CERRADO' && etapa !== 'SIN INICIAR') {
        const fechaProg = new Date(p.fechaFinProg);
        const hoy = new Date();
        if (hoy > fechaProg) {
          const diasRetraso = Math.ceil((hoy - fechaProg) / (1000 * 60 * 60 * 24));
          proyectosConRetraso.push({ ...p, diasRetraso });
        }
      }
    });
    
    return {
      porEtapa: Object.entries(porEtapa).map(([etapa, cantidad]) => ({
        name: etapa,
        value: cantidad,
        color: ETAPA_COLORS[etapa] || '#9ca3af'
      })),
      porTipo: Object.entries(porTipo).map(([tipo, data]) => ({
        tipo,
        cantidad: data.cantidad
      })),
      totalProyectos: proyectosData.length,
      proyectosConRetraso: proyectosConRetraso.sort((a, b) => b.diasRetraso - a.diasRetraso)
    };
  }, [proyectosData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <BarChart3 className="text-primary" size={24} />
          Reportes
        </h1>
        <p className="text-gray-600 mt-1">Panel de reportes y análisis de cumplimiento</p>
      </div>

      {/* Selector de Tipo de Reporte */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {TIPOS_REPORTE.map((tipo) => {
          const Icon = tipo.icon;
          const isActive = tipoReporteActivo === tipo.id;
          return (
            <button
              key={tipo.id}
              onClick={() => setTipoReporteActivo(tipo.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                isActive 
                  ? 'border-primary bg-primary/5 shadow-md' 
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`${tipo.color} p-2 rounded-lg`}>
                  <Icon className="text-white" size={20} />
                </div>
                <span className={`font-medium text-sm ${isActive ? 'text-primary' : 'text-gray-700'}`}>
                  {tipo.nombre}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filtros (excepto para portafolio) */}
      {tipoReporteActivo !== 'portafolio' && (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={18} className="text-gray-500" />
            <span className="font-medium text-gray-700">Filtros</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Clasificación</label>
              <select
                name="clasificacionId"
                value={filtros.clasificacionId}
                onChange={handleFiltroChange}
                className="input-field"
              >
                <option value="">Todas las clasificaciones</option>
                {clasificaciones.map((clas) => (
                  <option key={clas.clasificacionId} value={clas.clasificacionId}>
                    {clas.nombre}
                  </option>
                ))}
              </select>
            </div>
            {tipoReporteActivo === 'cumplimiento-entidad' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Entidad</label>
                <select
                  name="entidadId"
                  value={filtros.entidadId}
                  onChange={handleFiltroChange}
                  className="input-field"
                >
                  <option value="">Todas las entidades</option>
                  {entidades.map((ent) => (
                    <option key={ent.entidadId} value={ent.entidadId}>
                      {ent.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex items-end">
              <button
                onClick={limpiarFiltros}
                className="btn-secondary flex items-center gap-2 px-4 py-2"
              >
                <FilterX size={18} />
                Limpiar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenido del Reporte */}
      <div className="space-y-6">
        {/* ==================== REPORTE 1: AVANCE GLOBAL ==================== */}
        {tipoReporteActivo === 'avance-global' && (
          <>
            {/* KPIs Resumen */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Entidades</p>
                    <p className="text-2xl font-bold text-gray-800">{datosEvaluacion.length}</p>
                  </div>
                  <Building2 className="text-blue-500" size={32} />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Compromisos Aceptados</p>
                    <p className="text-2xl font-bold text-green-600">
                      {datosResumenEstados.find(e => e.name === 'aceptado')?.value || 0}
                    </p>
                  </div>
                  <CheckCircle2 className="text-green-500" size={32} />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Compromisos Observados</p>
                    <p className="text-2xl font-bold text-red-600">
                      {datosResumenEstados.find(e => e.name === 'observado')?.value || 0}
                    </p>
                  </div>
                  <XCircle className="text-red-500" size={32} />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Sin Reportar</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {datosResumenEstados.find(e => e.name === 'sin reportar')?.value || 0}
                    </p>
                  </div>
                  <AlertCircle className="text-orange-500" size={32} />
                </div>
              </div>
            </div>

            {/* Gráfico de Barras - Avance por Compromiso */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Estado de Cumplimiento por Compromiso
              </h3>
              {datosAvanceGlobal.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={datosAvanceGlobal} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="compromiso" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="aceptado" stackId="a" fill={ESTADO_COLORS['aceptado']} name="Aceptado" />
                    <Bar dataKey="enviado" stackId="a" fill={ESTADO_COLORS['enviado']} name="Enviado" />
                    <Bar dataKey="en revisión" stackId="a" fill={ESTADO_COLORS['en revisión']} name="En Revisión" />
                    <Bar dataKey="en proceso" stackId="a" fill={ESTADO_COLORS['en proceso']} name="En Proceso" />
                    <Bar dataKey="pendiente" stackId="a" fill={ESTADO_COLORS['pendiente']} name="Pendiente" />
                    <Bar dataKey="observado" stackId="a" fill={ESTADO_COLORS['observado']} name="Observado" />
                    <Bar dataKey="sin reportar" stackId="a" fill={ESTADO_COLORS['sin reportar']} name="Sin Reportar" />
                    <Bar dataKey="no exigible" stackId="a" fill={ESTADO_COLORS['no exigible']} name="No Exigible" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <BarChart3 size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No hay datos disponibles para mostrar</p>
                </div>
              )}
            </div>

            {/* Gráfico de Pie - Distribución de Estados */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Distribución Global de Estados
                </h3>
                {datosResumenEstados.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={datosResumenEstados}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {datosResumenEstados.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p>No hay datos disponibles</p>
                  </div>
                )}
              </div>
              
              {/* Leyenda de Estados */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Leyenda de Estados
                </h3>
                <div className="space-y-3">
                  {datosResumenEstados.map((estado, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: estado.color }}
                        ></span>
                        <span className="text-sm text-gray-700 capitalize">{estado.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{estado.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ==================== REPORTE 2: ENTIDADES CON OBSERVACIONES ==================== */}
        {tipoReporteActivo === 'observaciones' && (
          <>
            {/* KPIs de Alertas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Entidades con Observaciones</p>
                    <p className="text-2xl font-bold text-red-600">
                      {entidadesConObservaciones.filter(e => e.compromisosObservados > 0).length}
                    </p>
                  </div>
                  <XCircle className="text-red-500" size={32} />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Entidades Pendientes</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {entidadesConObservaciones.filter(e => e.compromisosPendientes > 0).length}
                    </p>
                  </div>
                  <Clock className="text-orange-500" size={32} />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Entidades Sin Reportar</p>
                    <p className="text-2xl font-bold text-red-700">
                      {entidadesConObservaciones.filter(e => e.compromisosSinReportar > 0).length}
                    </p>
                  </div>
                  <AlertTriangle className="text-red-700" size={32} />
                </div>
              </div>
            </div>

            {/* Tabla de Entidades con Problemas */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  Entidades con Observaciones o Pendientes ({entidadesConObservaciones.length})
                </h3>
                <p className="text-sm text-gray-500 mt-1">Ordenadas por criticidad (mayor a menor)</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Entidad
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Observados
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pendientes
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sin Reportar
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Criticidad
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {entidadesConObservaciones.slice(0, 20).map((entidad, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {entidad.nombre}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            {entidad.compromisosObservados}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                            {entidad.compromisosPendientes}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-200 text-red-900">
                            {entidad.compromisosSinReportar}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            entidad.criticidad > 10 ? 'bg-red-500 text-white' :
                            entidad.criticidad > 5 ? 'bg-orange-500 text-white' :
                            'bg-yellow-500 text-white'
                          }`}>
                            {entidad.criticidad}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {entidadesConObservaciones.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <CheckCircle2 size={48} className="mx-auto mb-4 text-green-300" />
                    <p>¡Excelente! No hay entidades con observaciones pendientes</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ==================== REPORTE 4: PORTAFOLIO DE PROYECTOS ==================== */}
        {tipoReporteActivo === 'portafolio' && (
          <>
            {/* KPIs de Proyectos */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Proyectos</p>
                    <p className="text-2xl font-bold text-gray-800">{proyectosData.length}</p>
                  </div>
                  <FolderKanban className="text-purple-500" size={32} />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Cerrados</p>
                    <p className="text-2xl font-bold text-green-600">
                      {datosPortafolio.porEtapa.find(e => e.name === 'CERRADO')?.value || 0}
                    </p>
                  </div>
                  <CheckCircle2 className="text-green-500" size={32} />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">En Ejecución</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {datosPortafolio.porEtapa.find(e => e.name === 'EJECUCIÓN')?.value || 0}
                    </p>
                  </div>
                  <TrendingUp className="text-blue-500" size={32} />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Con Retraso</p>
                    <p className="text-2xl font-bold text-red-600">
                      {datosPortafolio.proyectosConRetraso.length}
                    </p>
                  </div>
                  <AlertTriangle className="text-red-500" size={32} />
                </div>
              </div>
            </div>

            {/* Gráficos de Proyectos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Proyectos por Etapa */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Proyectos por Etapa
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={datosPortafolio.porEtapa}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {datosPortafolio.porEtapa.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Proyectos por Tipo */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Proyectos por Tipo
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={datosPortafolio.porTipo} 
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="tipo" type="category" width={150} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="cantidad" fill="#8b5cf6" name="Cantidad" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Proyectos con Retraso */}
            {datosPortafolio.proyectosConRetraso.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
                  <h3 className="text-lg font-semibold text-red-800 flex items-center gap-2">
                    <AlertTriangle size={20} />
                    Proyectos con Retraso ({datosPortafolio.proyectosConRetraso.length})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Código
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nombre
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha Fin Prog.
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha Fin Real
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Días de Retraso
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Etapa
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {datosPortafolio.proyectosConRetraso.map((proyecto) => (
                        <tr key={proyecto.id} className="hover:bg-red-50">
                          <td className="px-4 py-3 text-sm font-medium text-primary">
                            {proyecto.codigo}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {proyecto.nombre}
                          </td>
                          <td className="px-4 py-3 text-sm text-center text-gray-500">
                            {new Date(proyecto.fechaFinProg).toLocaleDateString('es-PE')}
                          </td>
                          <td className="px-4 py-3 text-sm text-center text-gray-500">
                            {proyecto.fechaFinReal 
                              ? new Date(proyecto.fechaFinReal).toLocaleDateString('es-PE')
                              : 'En curso'
                            }
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                              {proyecto.diasRetraso} días
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span 
                              className="px-2 py-1 text-xs font-semibold rounded-full"
                              style={{ 
                                backgroundColor: `${ETAPA_COLORS[proyecto.etapa]}20`,
                                color: ETAPA_COLORS[proyecto.etapa]
                              }}
                            >
                              {proyecto.etapa}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tabla Resumen por Tipo */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  Resumen por Tipo de Proyecto
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo de Proyecto
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cantidad
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % del Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {datosPortafolio.porTipo.map((tipo, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {tipo.tipo}
                        </td>
                        <td className="px-4 py-3 text-sm text-center text-gray-500">
                          {tipo.cantidad}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-500">
                          {proyectosData.length > 0 ? ((tipo.cantidad / proyectosData.length) * 100).toFixed(1) : 0}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-100">
                    <tr>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        TOTAL
                      </td>
                      <td className="px-4 py-3 text-sm text-center font-semibold text-gray-900">
                        {proyectosData.length}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                        100%
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Reportes;
