import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  Users, 
  Building2, 
  FileText, 
  CheckSquare, 
  TrendingUp, 
  AlertCircle,
  Calendar,
  Activity,
  ArrowUp,
  ArrowDown,
  Clock
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [estadisticasCompromisos, setEstadisticasCompromisos] = useState(null);
  const [ultimasActividades, setUltimasActividades] = useState([]);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getStats();
      
      if (response.isSuccess || response.IsSuccess) {
        const data = response.data || response.Data;
        
        const statsData = [
          {
            title: 'Usuarios',
            value: data.totalUsuarios.toString(),
            icon: Users,
            color: 'bg-blue-500',
            subtitle: `${data.usuariosActivos} activos`,
            trend: data.usuariosActivos > 0 ? '+' + Math.round((data.usuariosActivos / data.totalUsuarios) * 100) + '%' : '0%',
            trendUp: true,
          },
          {
            title: 'Entidades',
            value: data.totalEntidades.toString(),
            icon: Building2,
            color: 'bg-green-500',
            subtitle: `${data.entidadesActivas} activas`,
            trend: data.entidadesActivas > 0 ? '+' + Math.round((data.entidadesActivas / data.totalEntidades) * 100) + '%' : '0%',
            trendUp: true,
          },
          {
            title: 'Marco Normativo',
            value: data.totalMarcoNormativo.toString(),
            icon: FileText,
            color: 'bg-purple-500',
            subtitle: 'Normas registradas',
            trend: 'Actualizado',
            trendUp: true,
          },
          {
            title: 'Compromisos',
            value: data.totalCompromisos.toString(),
            icon: CheckSquare,
            color: 'bg-orange-500',
            subtitle: `${data.compromisosPendientes} pendientes`,
            trend: data.compromisosPendientes > 0 ? Math.round((data.compromisosPendientes / data.totalCompromisos) * 100) + '% pendiente' : 'Al día',
            trendUp: data.compromisosPendientes === 0,
          },
        ];
        
        setStats(statsData);

        // Calcular estadísticas de compromisos por estado
        const totalReportados = data.totalCompromisos - data.compromisosPendientes;
        setEstadisticasCompromisos({
          total: data.totalCompromisos,
          pendientes: data.compromisosPendientes,
          reportados: totalReportados,
          porcentajeCumplimiento: totalReportados > 0 ? Math.round((totalReportados / data.totalCompromisos) * 100) : 0,
        });

        // Simular últimas actividades (en producción, vendrían del backend)
        setUltimasActividades([
          {
            tipo: 'ACTUALIZACION',
            descripcion: 'Actualización de compromiso C1 - Líder GTD',
            entidad: 'Entidad de ejemplo',
            fecha: new Date().toISOString(),
            usuario: user?.nombreCompleto || 'Usuario',
          },
          {
            tipo: 'NUEVA_ENTIDAD',
            descripcion: `${data.entidadesActivas} entidades activas en el sistema`,
            fecha: new Date(Date.now() - 3600000).toISOString(),
          },
        ]);
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Bienvenido, {user?.nombreCompleto}
        </h2>
        <p className="text-gray-600 mt-1">
          Panel de control de la Plataforma de Cumplimiento Digital
        </p>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg shadow-md`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <p className="text-gray-500">{stat.subtitle}</p>
                {stat.trend && (
                  <div className={`flex items-center gap-1 ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trendUp ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                    <span className="font-medium">{stat.trend}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sección de información adicional */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Resumen de Compromisos */}
        {estadisticasCompromisos && (
          <div className="card lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary-100 rounded-lg">
                <TrendingUp className="text-primary-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Estado de Compromisos</h3>
                <p className="text-sm text-gray-500">Vista general del cumplimiento</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-gray-800">{estadisticasCompromisos.total}</p>
                <p className="text-sm text-gray-600 mt-1">Total</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-3xl font-bold text-orange-600">{estadisticasCompromisos.pendientes}</p>
                <p className="text-sm text-gray-600 mt-1">Pendientes</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">{estadisticasCompromisos.reportados}</p>
                <p className="text-sm text-gray-600 mt-1">Reportados</p>
              </div>
            </div>

            {/* Barra de progreso */}
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Progreso de cumplimiento</span>
                <span className="font-semibold text-primary-600">{estadisticasCompromisos.porcentajeCumplimiento}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${estadisticasCompromisos.porcentajeCumplimiento}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Alertas/Notificaciones */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="text-yellow-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Alertas</h3>
              <p className="text-sm text-gray-500">Notificaciones importantes</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {estadisticasCompromisos && estadisticasCompromisos.pendientes > 0 && (
              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                <Clock className="text-orange-600 mt-0.5" size={18} />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {estadisticasCompromisos.pendientes} {estadisticasCompromisos.pendientes === 1 ? 'compromiso pendiente' : 'compromisos pendientes'}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Requiere atención</p>
                </div>
              </div>
            )}
            
            {estadisticasCompromisos && estadisticasCompromisos.pendientes === 0 && (
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <CheckSquare className="text-green-600 mt-0.5" size={18} />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    ¡Todos los compromisos al día!
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Excelente trabajo</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <Calendar className="text-blue-600 mt-0.5" size={18} />
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Sistema actualizado
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Última sincronización: {new Date().toLocaleDateString('es-PE')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actividad reciente */}
      {ultimasActividades.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="text-purple-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Actividad Reciente</h3>
              <p className="text-sm text-gray-500">Últimas actualizaciones del sistema</p>
            </div>
          </div>

          <div className="space-y-3">
            {ultimasActividades.map((actividad, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className={`p-2 rounded-lg ${
                  actividad.tipo === 'ACTUALIZACION' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  {actividad.tipo === 'ACTUALIZACION' ? (
                    <FileText className={actividad.tipo === 'ACTUALIZACION' ? 'text-blue-600' : 'text-green-600'} size={18} />
                  ) : (
                    <Building2 className="text-green-600" size={18} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{actividad.descripcion}</p>
                  {actividad.entidad && (
                    <p className="text-xs text-gray-500 mt-1">{actividad.entidad}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(actividad.fecha).toLocaleString('es-PE')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
