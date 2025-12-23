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
  
  // Determinar si es admin
  const isAdmin = user?.perfilNombre?.toUpperCase() === 'ADMINISTRADOR' || 
                  user?.perfilNombre?.toUpperCase() === 'ADMIN';

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      
      // Cargar todas las estadísticas en paralelo
      const [statsResponse, activityResponse, compromisosResponse] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentActivity().catch(() => ({ data: { items: [] } })),
        dashboardService.getCompromisosStats().catch(() => ({ data: { items: [] } }))
      ]);
      
      if (statsResponse.isSuccess || statsResponse.IsSuccess) {
        const data = statsResponse.data || statsResponse.Data;
        
        // Construir estadísticas según el rol
        const statsData = [];
        
        // ADMIN: Muestra todas las estadísticas
        if (isAdmin) {
          statsData.push(
            {
              title: 'Usuarios',
              value: data.totalUsuarios.toString(),
              icon: Users,
              color: 'bg-blue-500',
              subtitle: `${data.usuariosActivos} activos`,
              description: `${data.totalUsuarios - data.usuariosActivos} inactivos`,
            },
            {
              title: 'Entidades',
              value: data.totalEntidades.toString(),
              icon: Building2,
              color: 'bg-green-500',
              subtitle: `${data.entidadesActivas} activas`,
              description: `${data.totalEntidades - data.entidadesActivas} inactivas`,
            }
          );
        }
        
        // TODOS: Marco normativo y compromisos
        statsData.push(
          {
            title: 'Marco Normativo',
            value: data.totalMarcoNormativo.toString(),
            icon: FileText,
            color: 'bg-purple-500',
            subtitle: 'Normas vigentes',
            description: 'Actualizado',
          },
          {
            title: isAdmin ? 'Compromisos Totales' : 'Mis Compromisos',
            value: data.totalCompromisos.toString(),
            icon: CheckSquare,
            color: 'bg-orange-500',
            subtitle: `${data.compromisosPendientes} pendientes`,
            description: `${data.compromisosCompletados || 0} completados`,
          }
        );
        
        setStats(statsData);

        // Procesar estadísticas de compromisos por estado desde datos reales
        const compromisosData = compromisosResponse?.data?.items || [];
        const estadosPorNombre = {};
        
        compromisosData.forEach(comp => {
          const estadoNombre = comp.estadoNombre || 'SIN ESTADO';
          estadosPorNombre[estadoNombre] = (estadosPorNombre[estadoNombre] || 0) + 1;
        });
        
        // Calcular estadísticas generales
        const completados = data.compromisosCompletados || 0;
        const enProceso = estadosPorNombre['EN PROCESO'] || 0;
        setEstadisticasCompromisos({
          total: data.totalCompromisos,
          pendientes: data.compromisosPendientes,
          enProceso: enProceso,
          completados: completados,
          porcentajeCumplimiento: data.totalCompromisos > 0 
            ? Math.round((completados / data.totalCompromisos) * 100) 
            : 0,
        });

        // Procesar actividad reciente real
        const historialItems = activityResponse?.data?.items || [];
        const actividades = historialItems.slice(0, 5).map(item => ({
          tipo: item.accion || 'ACTUALIZACION',
          descripcion: `${item.accion || 'Cambio'} en ${item.compromisoNombre || 'compromiso'}`,
          entidad: item.entidadNombre || 'Entidad',
          fecha: item.fechaCambio || new Date().toISOString(),
          estadoAnterior: item.estadoAnterior,
          estadoNuevo: item.estadoNuevo,
        }));
        
        setUltimasActividades(actividades.length > 0 ? actividades : [
          {
            tipo: 'SISTEMA',
            descripcion: 'Sistema iniciado correctamente',
            fecha: new Date().toISOString(),
          }
        ]);
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

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
          {isAdmin 
            ? 'Panel de control de la Plataforma de Cumplimiento Digital' 
            : `Panel de control - ${user?.entidadNombre || 'Tu Entidad'}`
          }{`grid grid-cols-1 md:grid-cols-2 ${isAdmin ? 'lg:grid-cols-4' : 'lg:grid-cols-2'} gap-6 mb-8`}
        </p>
        {!isAdmin && (
          <p className="text-sm text-gray-500 mt-1">
            Vista de compromisos asignados a tu entidad
          </p>
        )}
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
              <div className="flex flex-col gap-1 text-sm">
                <p className="text-gray-600 font-medium">{stat.subtitle}</p>
                {stat.description && (
                  <p className="text-gray-500 text-xs">{stat.description}</p>
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
                <h3 className="text-lg font-semibold text-gray-800">
                  {isAdmin ? 'Estado de Compromisos' : 'Estado de Mis Compromisos'}
                </h3>
                <p className="text-sm text-gray-500">
                  {isAdmin ? 'Vista general del cumplimiento' : 'Progreso de tu entidad'}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-800">{estadisticasCompromisos.total}</p>
                <p className="text-xs text-gray-600 mt-1">Total</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">{estadisticasCompromisos.pendientes}</p>
                <p className="text-xs text-gray-600 mt-1">Pendientes</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{estadisticasCompromisos.enProceso}</p>
                <p className="text-xs text-gray-600 mt-1">En Proceso</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{estadisticasCompromisos.completados}</p>
                <p className="text-xs text-gray-600 mt-1">Completados</p>
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
                    {isAdmin ? 'Requiere atención en el sistema' : 'Requiere atención de tu entidad'}
                  
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
              <p className="text-sm text-gray-500">
                {isAdmin ? 'Últimas actualizaciones del sistema' : 'Últimos cambios en tus compromisos'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {ultimasActividades.map((actividad, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className={`p-2 rounded-lg ${
                  actividad.tipo === 'ACTUALIZACION' || actividad.tipo === 'CAMBIO_ESTADO' 
                    ? 'bg-blue-100' 
                    : actividad.tipo === 'SISTEMA'
                    ? 'bg-purple-100'
                    : 'bg-green-100'
                }`}>
                  {actividad.tipo === 'ACTUALIZACION' || actividad.tipo === 'CAMBIO_ESTADO' ? (
                    <Activity className="text-blue-600" size={18} />
                  ) : actividad.tipo === 'SISTEMA' ? (
                    <CheckSquare className="text-purple-600" size={18} />
                  ) : (
                    <Building2 className="text-green-600" size={18} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{actividad.descripcion}</p>
                  {actividad.entidad && (
                    <p className="text-xs text-gray-600 mt-1">
                      <Building2 className="inline w-3 h-3 mr-1" />
                      {actividad.entidad}
                    </p>
                  )}
                  {actividad.estadoAnterior && actividad.estadoNuevo && (
                    <p className="text-xs text-gray-500 mt-1">
                      {actividad.estadoAnterior} → {actividad.estadoNuevo}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
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
