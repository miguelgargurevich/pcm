import { useState, useEffect, useMemo } from 'react';
import { 
  Database, 
  Building2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Search,
  Shield
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
  Cell,
  Legend
} from 'recharts';
import { dashboardService } from '../services/dashboardService';
import toast from 'react-hot-toast';

// Configuración de estados
const ESTADOS = [
  { id: 1, key: 'pendientes', label: 'Pendiente', color: '#94a3b8' },
  { id: 2, key: 'sinReportar', label: 'Sin Reportar', color: '#64748b' },
  { id: 3, key: 'noExigible', label: 'No Exigible', color: '#cbd5e1' },
  { id: 4, key: 'enProceso', label: 'En Proceso', color: '#3b82f6' },
  { id: 5, key: 'enviados', label: 'Enviado', color: '#f59e0b' },
  { id: 6, key: 'enRevision', label: 'En Revisión', color: '#8b5cf6' },
  { id: 7, key: 'observados', label: 'Observado', color: '#ef4444' },
  { id: 8, key: 'aceptados', label: 'Aceptado', color: '#10b981' }
];

const COMPROMISOS_LIST = Array.from({ length: 21 }, (_, i) => ({
  id: i + 1,
  nombre: `Compromiso ${i + 1}`
}));

const ReportesSupervision = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expandedEntidad, setExpandedEntidad] = useState(null);
  const [entidadesData, setEntidadesData] = useState([]);
  const [filters, setFilters] = useState({
    entidad: '',
    ruc: '',
    sector: 'Todos',
    clasificacion: 'Todos',
    compromiso: 'Todos'
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getEntidadesStats();
      
      if (response.isSuccess || response.IsSuccess) {
        const datos = response.data?.entidades || response.Data?.entidades || [];
        setEntidadesData(datos);
      } else {
        toast.error('Error al cargar estadísticas de entidades');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  // Obtener lista única de sectores de los datos reales
  const sectores = useMemo(() => {
    const uniqueSectores = [...new Set(entidadesData.map(e => e.sectorNombre).filter(Boolean))];
    return uniqueSectores.sort();
  }, [entidadesData]);

  // Obtener lista única de clasificaciones
  const clasificaciones = useMemo(() => {
    const uniqueClasificaciones = [...new Set(entidadesData.map(e => e.clasificacionNombre).filter(Boolean))];
    return uniqueClasificaciones.sort();
  }, [entidadesData]);

  // Filtrado de datos
  const filteredData = useMemo(() => {
    return entidadesData.filter(item => {
      const matchSector = filters.sector === 'Todos' || item.sectorNombre === filters.sector;
      const matchClasificacion = filters.clasificacion === 'Todos' || item.clasificacionNombre === filters.clasificacion;
      const matchRuc = filters.ruc === '' || item.ruc.includes(filters.ruc);
      const matchEntidad = filters.entidad === '' || item.nombre.toLowerCase().includes(filters.entidad.toLowerCase());
      return matchSector && matchClasificacion && matchRuc && matchEntidad;
    });
  }, [entidadesData, filters]);

  // Estadísticas globales
  const statsGlobal = useMemo(() => {
    const counts = {};
    ESTADOS.forEach(e => counts[e.key] = 0);
    
    filteredData.forEach(ent => {
      counts.pendientes += ent.pendientes || 0;
      counts.sinReportar += ent.sinReportar || 0;
      counts.noExigible += ent.noExigible || 0;
      counts.enProceso += ent.enProceso || 0;
      counts.enviados += ent.enviados || 0;
      counts.enRevision += ent.enRevision || 0;
      counts.observados += ent.observados || 0;
      counts.aceptados += ent.aceptados || 0;
    });

    return ESTADOS.map(e => ({ 
      name: e.label, 
      value: counts[e.key], 
      color: e.color 
    }));
  }, [filteredData]);

  // Datos para gráfico por sectores
  const datosPorSector = useMemo(() => {
    const sectorMap = {};
    
    filteredData.forEach(ent => {
      const sector = ent.sectorNombre || 'Sin Sector';
      if (!sectorMap[sector]) {
        sectorMap[sector] = { aceptados: 0, total: 0 };
      }
      sectorMap[sector].aceptados += ent.aceptados || 0;
      sectorMap[sector].total += ent.totalCompromisos || 0;
    });

    return Object.entries(sectorMap).map(([name, data]) => ({
      name,
      value: data.total > 0 ? Math.round((data.aceptados / data.total) * 100) : 0
    })).sort((a, b) => b.value - a.value).slice(0, 8);
  }, [filteredData]);

  const exportarCSV = () => {
    const headers = ['Entidad', 'RUC', 'Sector', 'Clasificación', 'Total', 'Aceptados', 'Observados', 'En Revisión', '% Cumplimiento'];
    const rows = filteredData.map(d => [
      d.nombre,
      d.ruc,
      d.sectorNombre || '',
      d.clasificacionNombre || '',
      d.totalCompromisos || 0,
      d.aceptados || 0,
      d.observados || 0,
      d.enRevision || 0,
      d.porcentajeCumplimiento || 0
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-supervision-nacional-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  const totalAceptados = filteredData.reduce((sum, e) => sum + (e.aceptados || 0), 0);
  const totalCompromisos = filteredData.reduce((sum, e) => sum + (e.totalCompromisos || 0), 0);
  const tasaAceptacion = totalCompromisos > 0 ? Math.round((totalAceptados / totalCompromisos) * 100) : 0;
  const totalObservados = filteredData.reduce((sum, e) => sum + (e.observados || 0), 0);
  const totalEnRevision = filteredData.reduce((sum, e) => sum + (e.enRevision || 0), 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header Principal */}
      <header className="bg-slate-900 text-white p-4 shadow-xl no-print sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-lg text-white shadow-lg">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none">PCM | CUMPLIMIENTO DIGITAL</h1>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">SGTD - Supervisión Nacional</p>
            </div>
          </div>
          <div className="flex bg-slate-800 p-1 rounded-xl gap-1">
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                activeTab === 'dashboard' ? 'bg-blue-600 shadow-md text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('reporte')} 
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                activeTab === 'reporte' ? 'bg-blue-600 shadow-md text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Listado Detallado
            </button>
          </div>
          <button 
            onClick={exportarCSV} 
            className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> EXPORTAR CSV
          </button>
        </div>
      </header>

      {/* Filtros Globales */}
      <section className="bg-white border-b p-6 no-print shadow-sm">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sector</label>
            <select 
              className="p-2 border rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.sector}
              onChange={e => setFilters({...filters, sector: e.target.value})}
            >
              <option>Todos</option>
              {sectores.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Clasificación</label>
            <select 
              className="p-2 border rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.clasificacion}
              onChange={e => setFilters({...filters, clasificacion: e.target.value})}
            >
              <option>Todos</option>
              {clasificaciones.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">RUC</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input 
                type="text"
                className="pl-9 p-2 border rounded-lg text-xs w-full outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Buscar RUC..."
                value={filters.ruc}
                onChange={e => setFilters({...filters, ruc: e.target.value})}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nombre de Entidad</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input 
                type="text"
                className="pl-9 p-2 border rounded-lg text-xs w-full outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Buscar entidad..."
                value={filters.entidad}
                onChange={e => setFilters({...filters, entidad: e.target.value})}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Área de Trabajo */}
      <main className="flex-grow p-6 max-w-[1400px] mx-auto w-full">
        {activeTab === 'dashboard' ? (
          <div className="animate-fade-in space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-blue-500">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Entidades en Filtro</p>
                <h3 className="text-3xl font-black mt-2 text-slate-800">{filteredData.length}</h3>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-emerald-500">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Tasa de Aceptación</p>
                <h3 className="text-3xl font-black mt-2 text-emerald-600">{tasaAceptacion}%</h3>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-red-500">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Ítemes Observados</p>
                <h3 className="text-3xl font-black mt-2 text-red-600">{totalObservados}</h3>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-purple-500">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">En Revisión PCM</p>
                <h3 className="text-3xl font-black mt-2 text-purple-600">{totalEnRevision}</h3>
              </div>
            </div>

            {/* Gráficos Interactivos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border shadow-sm">
                <h4 className="font-black text-slate-700 mb-6 uppercase text-xs tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Distribución de Estados Nacionales
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={statsGlobal.filter(s => s.value > 0)} 
                        innerRadius={60} 
                        outerRadius={85} 
                        paddingAngle={4} 
                        dataKey="value"
                      >
                        {statsGlobal.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend wrapperStyle={{fontSize: '10px', fontWeight: 'bold'}} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border shadow-sm">
                <h4 className="font-black text-slate-700 mb-6 uppercase text-xs tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Tasa de Aceptación por Sector
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={datosPorSector}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" fontSize={9} tick={{fontWeight: 'bold'}} angle={-45} textAnchor="end" height={80} />
                      <YAxis fontSize={9} />
                      <Tooltip />
                      <Bar dataKey="value" name="% Aceptación" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in bg-white rounded-2xl border shadow-sm overflow-hidden min-h-[500px]">
            <div className="p-5 bg-slate-50 border-b flex justify-between items-center">
              <h3 className="font-black text-slate-700 text-xs tracking-widest">TABLA MAESTRA DE SUPERVISIÓN</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div> Aceptado
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase text-red-600 bg-red-50 px-2 py-1 rounded">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div> Observado
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-white text-slate-400 font-bold uppercase tracking-widest border-b">
                  <tr>
                    <th className="p-5">Entidad Pública / RUC</th>
                    <th className="p-5">Clasificación / Sector</th>
                    <th className="p-5 text-center">Total</th>
                    <th className="p-5 text-center">Aceptados</th>
                    <th className="p-5 text-center">Observados</th>
                    <th className="p-5 text-center w-40">Progreso Total</th>
                    <th className="p-5 text-center">Ver</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredData.length > 0 ? filteredData.map(ent => {
                    const isExp = expandedEntidad === ent.entidadId;
                    const porcentaje = ent.porcentajeCumplimiento || 0;

                    return (
                      <tr 
                        key={ent.entidadId} 
                        className={`transition-all cursor-pointer hover:bg-slate-50 ${isExp ? 'bg-blue-50/50' : ''}`}
                        onClick={() => setExpandedEntidad(isExp ? null : ent.entidadId)}
                      >
                        <td className="p-5">
                          <div className="font-bold text-slate-800 text-sm leading-tight mb-0.5">{ent.nombre}</div>
                          <div className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase font-bold">
                            RUC: {ent.ruc}
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-slate-700">{ent.clasificacionNombre || 'N/A'}</span>
                            <span className="bg-slate-100 w-fit px-2 py-0.5 rounded text-[9px] font-bold text-slate-500 uppercase">
                              {ent.sectorNombre || 'Sin Sector'}
                            </span>
                          </div>
                        </td>
                        <td className="p-5 text-center">
                          <span className="text-slate-700 font-black text-lg">{ent.totalCompromisos || 0}</span>
                        </td>
                        <td className="p-5 text-center">
                          <span className="text-emerald-600 font-black text-lg">{ent.aceptados || 0}</span>
                        </td>
                        <td className="p-5 text-center">
                          <span className="text-red-600 font-black text-lg">{ent.observados || 0}</span>
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="flex-grow bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                              <div 
                                className="bg-blue-500 h-full transition-all duration-700 ease-out shadow-sm" 
                                style={{width: `${porcentaje}%`}}
                              ></div>
                            </div>
                            <span className="font-black text-slate-500 min-w-[30px]">{porcentaje}%</span>
                          </div>
                        </td>
                        <td className="p-5 text-center text-slate-300">
                          {isExp ? <ChevronUp className="w-4 h-4 mx-auto" /> : <ChevronDown className="w-4 h-4 mx-auto" />}
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan="7" className="p-20 text-center">
                        <div className="flex flex-col items-center gap-3 text-slate-400">
                          <Building2 className="w-12 h-12" />
                          <p className="italic font-medium">No se encontraron entidades con los filtros actuales.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReportesSupervision;
