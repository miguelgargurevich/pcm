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
        
        // PRIMERO: Procesar estadísticas de compromisos por estado desde datos reales
        console.log('🔍 Dashboard - Response completo:', compromisosResponse);
        
        // La API puede devolver data.items o directamente data
        const compromisosData = compromisosResponse?.data?.items || compromisosResponse?.data || [];
        
        console.log('🔍 Dashboard - Datos de compromisos:', {
          total: compromisosData.length,
          primerosRegistros: compromisosData.slice(0, 3),
          estructura: compromisosData[0]
        });
        
        // Contar por estados usando los IDs correctos
        let pendientes = 0;
        let sinReportar = 0;
        let enProceso = 0;
        let enviados = 0;
        let enRevision = 0;
        let observados = 0;
        let aceptados = 0;
        
        compromisosData.forEach(comp => {
          const estadoId = comp.estadoId;
          
          console.log(`Compromiso ${comp.compromisoId} - Estado: ${estadoId}`);
          
          switch(estadoId) {
            case 1: // PENDIENTE
              pendientes++;
              break;
            case 2: // SIN REPORTAR
              sinReportar++;
              break;
            case 3: // NO EXIGIBLE
              // No contar, no es relevante para progreso
              break;
            case 4: // EN PROCESO
              enProceso++;
              break;
            case 5: // ENVIADO
              enviados++;
              break;
            case 6: // EN REVISIÓN
              enRevision++;
              break;
            case 7: // OBSERVADO
              observados++;
              break;
            case 8: // ACEPTADO
              aceptados++;
              break;
            default:
              console.warn(`⚠️ Estado desconocido: ${estadoId} para compromiso ${comp.compromisoId}`);
          }
        });
        
        // Total de compromisos activos (excluyendo NO EXIGIBLE)
        const totalActivos = pendientes + sinReportar + enProceso + enviados + enRevision + observados + aceptados;
        
        // Compromisos completados = ACEPTADOS
        const completados = aceptados;
        
        // Compromisos en trabajo = EN PROCESO + ENVIADO + EN REVISIÓN + OBSERVADO
        const enTrabajo = enProceso + enviados + enRevision + observados;
        
        // Compromisos sin iniciar = PENDIENTE + SIN REPORTAR
        const sinIniciar = pendientes + sinReportar;
        
        console.log('📊 Estadísticas calculadas:', {
          totalActivos,
          sinIniciar,
          enTrabajo,
          completados,
          desglose: { pendientes, sinReportar, enProceso, enviados, enRevision, observados, aceptados }
        });
        
        // SEGUNDO: Construir estadísticas según el rol usando datos reales
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
            value: (totalActivos > 0 ? totalActivos : data.totalCompromisos).toString(),
            icon: CheckSquare,
            color: 'bg-orange-500',
            subtitle: enTrabajo > 0 ? `${enTrabajo} en trabajo` : `${sinIniciar} sin iniciar`,
            description: `${completados} aceptados`,
          }
        );
        
        setStats(statsData);
        
        // TERCERO: Establecer estadísticas detalladas para el panel
        setEstadisticasCompromisos({
          total: totalActivos > 0 ? totalActivos : data.totalCompromisos,
          pendientes: sinIniciar,
          enProceso: enTrabajo,
          completados: completados,
          porcentajeCumplimiento: totalActivos > 0 
            ? Math.round((completados / totalActivos) * 100) 
            : 0,
          // Desglose detallado para mostrar
          desglose: {
            pendientes,
            sinReportar,
            enProceso,
            enviados,
            enRevision,
            observados,
            aceptados
          }
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
          }
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
            
            {/* Resumen principal */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg border-2 border-gray-200">
                <p className="text-2xl font-bold text-gray-800">{estadisticasCompromisos.total}</p>
                <p className="text-xs text-gray-600 mt-1">Total Activos</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg border-2 border-red-200">
                <p className="text-2xl font-bold text-red-600">{estadisticasCompromisos.pendientes}</p>
                <p className="text-xs text-gray-600 mt-1">Sin Iniciar</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                <p className="text-2xl font-bold text-blue-600">{estadisticasCompromisos.enProceso}</p>
                <p className="text-xs text-gray-600 mt-1">En Trabajo</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg border-2 border-green-200">
                <p className="text-2xl font-bold text-green-600">{estadisticasCompromisos.completados}</p>
                <p className="text-xs text-gray-600 mt-1">Aceptados</p>
              </div>
            </div>

            {/* Desglose detallado de estados */}
            {estadisticasCompromisos.desglose && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-semibold text-gray-700 mb-2">Desglose por Estado:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                    <span className="text-gray-600">Pendientes:</span>
                    <span className="font-semibold text-gray-800">{estadisticasCompromisos.desglose.pendientes}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                    <span className="text-gray-600">Sin Reportar:</span>
                    <span className="font-semibold text-gray-800">{estadisticasCompromisos.desglose.sinReportar}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded border border-blue-200">
                    <span className="text-gray-600">En Proceso:</span>
                    <span className="font-semibold text-blue-600">{estadisticasCompromisos.desglose.enProceso}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded border border-blue-200">
                    <span className="text-gray-600">Enviados:</span>
                    <span className="font-semibold text-blue-600">{estadisticasCompromisos.desglose.enviados}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded border border-blue-200">
                    <span className="text-gray-600">En Revisión:</span>
                    <span className="font-semibold text-blue-600">{estadisticasCompromisos.desglose.enRevision}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded border border-orange-200">
                    <span className="text-gray-600">Observados:</span>
                    <span className="font-semibold text-orange-600">{estadisticasCompromisos.desglose.observados}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded border border-green-200">
                    <span className="text-gray-600">Aceptados:</span>
                    <span className="font-semibold text-green-600">{estadisticasCompromisos.desglose.aceptados}</span>
                  </div>
                </div>
              </div>
            )}

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
