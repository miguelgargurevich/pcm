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
  Clock,
  X,
  Eye,
  Edit2,
  BarChart3,
  CircleDot,
  PlayCircle,
  Loader,
  Send,
  SearchCheck,
  AlertTriangle,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [estadisticasCompromisos, setEstadisticasCompromisos] = useState(null);
  const [ultimasActividades, setUltimasActividades] = useState([]);
  const [compromisosDetalle, setCompromisosDetalle] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalTitulo, setModalTitulo] = useState('');
  const [compromisosModal, setCompromisosModal] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [entidadesStats, setEntidadesStats] = useState([]);
  const [paginaEntidades, setPaginaEntidades] = useState(1);
  const entidadesPorPagina = 10;
  
  // Determinar el rol del usuario
  const perfilUpper = (user?.perfilNombre || user?.nombrePerfil)?.toUpperCase() || '';
  const isAdmin = perfilUpper === 'ADMINISTRADOR' || perfilUpper === 'ADMIN' || perfilUpper === 'ADMINISTRADOR PCM';
  const isOperador = perfilUpper === 'OPERADOR' || perfilUpper === 'OPERADOR PCM';
  // Si no es admin ni operador, y tiene entidadId, entonces es entidad
  const isEntidad = !isAdmin && !isOperador && !!user?.entidadId;
  
  console.log('👤 Usuario Dashboard:', { 
    userCompleto: user,
    nombreCompleto: user?.nombreCompleto, 
    perfilNombre: user?.perfilNombre,
    nombrePerfil: user?.nombrePerfil,
    perfilUpper,
    entidadNombre: user?.entidadNombre,
    entidadId: user?.entidadId,
    isAdmin,
    isEntidad,
    isOperador,
    'Debería mostrar panel ENTIDAD?': isEntidad,
    'Debería mostrar panel ADMIN?': (isAdmin || isOperador)
  });

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      
      // Cargar todas las estadísticas en paralelo
      const promises = [
        dashboardService.getStats(),
        dashboardService.getRecentActivity().catch(() => ({ data: { items: [] } })),
        dashboardService.getCompromisosStats().catch(() => ({ data: { items: [] } })),
        dashboardService.getAllCompromisos().catch(() => ({ data: { items: [] } }))
      ];
      
      // Si es admin u operador, cargar estadísticas de entidades
      if (isAdmin || isOperador) {
        promises.push(dashboardService.getEntidadesStats().catch(() => ({ data: { entidades: [] } })));
      }
      
      const responses = await Promise.all(promises);
      const [statsResponse, activityResponse, compromisosResponse, allCompromisosResponse, entidadesResponse] = responses;
      
      if (statsResponse.isSuccess || statsResponse.IsSuccess) {
        const data = statsResponse.data || statsResponse.Data;
        
        // Guardar datos del dashboard para usar en el panel
        setDashboardData(data);
        
        // PRIMERO: Procesar estadísticas de compromisos por estado desde datos reales
        console.log('🔍 Dashboard - Response completo:', compromisosResponse);
        
        // Obtener lista completa de compromisos desde el backend
        const catalogoCompromisos = allCompromisosResponse?.data?.items || allCompromisosResponse?.data || [];
        console.log('🔍 Dashboard - Catálogo de compromisos:', catalogoCompromisos);
        
        // Crear un mapa de compromisoId a nombre para referencia
        const compromisosNombresMap = {};
        catalogoCompromisos.forEach(comp => {
          // El backend puede retornar nombreCompromiso o NombreCompromiso
          const nombre = comp.nombreCompromiso || comp.NombreCompromiso || 'Compromiso sin nombre';
          const id = comp.compromisoId || comp.CompromisoId;
          compromisosNombresMap[id] = nombre;
        });
        
        // La API puede devolver data.items o directamente data
        let compromisosData = compromisosResponse?.data?.items || compromisosResponse?.data || [];
        
        // Normalizar los datos para asegurar camelCase
        compromisosData = compromisosData.map(comp => ({
          compromisoId: comp.compromisoId || comp.CompromisoId,
          nombreCompromiso: comp.nombreCompromiso || comp.NombreCompromiso,
          estadoId: comp.estadoId || comp.EstadoId,
          estadoNombre: comp.estadoNombre || comp.EstadoNombre,
          updatedAt: comp.updatedAt || comp.UpdatedAt,
          entidadId: comp.entidadId || comp.EntidadId
        }));
        
        console.log('🔍 Dashboard - Datos de compromisos:', {
          total: compromisosData.length,
          primerosRegistros: compromisosData.slice(0, 5),
          estructura: compromisosData[0],
          compromisosIds: compromisosData.map(c => `C${c.compromisoId}`).sort(),
          c8: compromisosData.find(c => c.compromisoId === 8),
          c9: compromisosData.find(c => c.compromisoId === 9),
          todosLosIds: compromisosData.map(c => c.compromisoId).sort((a,b) => a-b)
        });
        
        // Contar por estados usando los IDs correctos
        let pendientes = 0;
        let sinReportar = 0;
        let noExigible = 0;
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
              noExigible++;
              console.log(`❌ Compromiso ${comp.compromisoId} es NO EXIGIBLE`);
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
        
        // Compromisos completados = ACEPTADOS
        const completados = aceptados;
        
        // Compromisos en trabajo = EN PROCESO + ENVIADO + EN REVISIÓN + OBSERVADO
        const enTrabajo = enProceso + enviados + enRevision + observados;
        
        // Compromisos sin iniciar = PENDIENTE + SIN REPORTAR
        const sinIniciar = pendientes + sinReportar;
        
        // Total de compromisos activos (excluyendo NO EXIGIBLE)
        const totalActivos = pendientes + sinReportar + enProceso + enviados + enRevision + observados + aceptados;
        const totalConNoExigible = totalActivos + noExigible;
        
        // IMPORTANTE: El backend devuelve los compromisos FILTRADOS por subclasificación de la entidad
        // El catálogo de compromisos (catalogoCompromisos) ya viene filtrado por alcance
        // Usamos el total real de compromisos asignados a la entidad
        const totalCompromisosAsignados = catalogoCompromisos.length || totalConNoExigible;
        const totalReal = Math.max(totalConNoExigible, totalCompromisosAsignados);
        const compromisosSinRegistro = Math.max(0, totalReal - totalConNoExigible);
        
        console.log('📊 Estadísticas calculadas:', {
          totalActivos,
          totalConNoExigible,
          totalReal,
          compromisosSinRegistro,
          noExigible,
          sinIniciar,
          enTrabajo,
          completados,
          desglose: { pendientes, sinReportar, noExigible, enProceso, enviados, enRevision, observados, aceptados }
        });
        
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
            value: totalReal.toString(),
            icon: CheckSquare,
            color: 'bg-orange-500',
            subtitle: enTrabajo > 0 ? `${enTrabajo} en trabajo` : `${sinIniciar} sin iniciar`,
            description: `${completados} aceptados`,
          }
        );
        
        // setStats(statsData); // Comentado porque stats no se usa actualmente
        
        console.log('📊 Estableciendo estadísticas de compromisos para el panel');
        
        // TERCERO: Establecer estadísticas detalladas para el panel
        setEstadisticasCompromisos({
          total: totalReal,
          pendientes: sinIniciar + compromisosSinRegistro, // Los sin registro se consideran "sin iniciar"
          enProceso: enTrabajo,
          completados: completados,
          porcentajeCumplimiento: totalReal > 0 
            ? Math.round((completados / totalReal) * 100) 
            : 0,
          // Desglose detallado para mostrar
          desglose: {
            pendientes,
            sinReportar: sinReportar + compromisosSinRegistro, // Los sin registro van como "Sin Reportar"
            enProceso,
            enviados,
            enRevision,
            observados,
            aceptados
          }
        });
        
        // Mapeo de IDs de estado a nombres
        const ESTADOS_NOMBRES = {
          1: 'PENDIENTE',
          2: 'SIN REPORTAR',
          3: 'NO EXIGIBLE',
          4: 'EN PROCESO',
          5: 'ENVIADO',
          6: 'EN REVISIÓN',
          7: 'OBSERVADO',
          8: 'ACEPTADO'
        };
        
        // Agregar estadoNombre a los compromisos reales
        const compromisosConEstadoNombre = compromisosData.map(comp => ({
          ...comp,
          estadoNombre: ESTADOS_NOMBRES[comp.estadoId] || 'DESCONOCIDO'
        }));
        
        // Crear compromisos "virtuales" para los que no tienen registro
        // Comparar contra catalogoCompromisos para saber cuáles faltan
        const compromisosIdsFaltantes = catalogoCompromisos
          .map(comp => comp.compromisoId || comp.CompromisoId)
          .filter(id => !compromisosData.find(c => c.compromisoId === id));
        
        console.log('📝 Compromisos sin registro:', {
          faltantes: compromisosIdsFaltantes,
          catalogoTotal: catalogoCompromisos.length,
          registrados: compromisosData.length,
          catalogoIds: catalogoCompromisos.map(c => c.compromisoId || c.CompromisoId).sort((a,b) => a-b),
          registradosIds: compromisosData.map(c => c.compromisoId).sort((a,b) => a-b)
        });
        
        // Agregar compromisos virtuales con estado "SIN REPORTAR" (id: 2) usando nombres reales
        const compromisosVirtuales = compromisosIdsFaltantes.map(id => ({
          compromisoId: id,
          nombreCompromiso: compromisosNombresMap[id] || 'Compromiso sin nombre',
          estadoId: 2, // SIN REPORTAR
          estadoNombre: 'SIN REPORTAR',
          updatedAt: null,
          virtual: true // Marcar como virtual para referencia
        }));
        
        // Combinar compromisos reales con virtuales
        const todosLosCompromisos = [...compromisosConEstadoNombre, ...compromisosVirtuales].sort((a, b) => 
          a.compromisoId - b.compromisoId
        );
        
        console.log('📋 Todos los compromisos (reales + virtuales):', todosLosCompromisos);
        
        // Guardar detalle de compromisos para el modal
        setCompromisosDetalle(todosLosCompromisos);
        
        // Procesar estadísticas de entidades para admin/operador
        if ((isAdmin || isOperador) && entidadesResponse) {
          const entidadesData = entidadesResponse?.data?.entidades || entidadesResponse?.Data?.Entidades || [];
          console.log('🏢 Estadísticas de entidades:', entidadesData);
          setEntidadesStats(entidadesData);
        }
        
        // Procesar actividad reciente real
        const historialItems = activityResponse?.data?.items || [];
        const actividades = historialItems.slice(0, 5).map(item => {
          const compromisoId = item.compromisoId || '?';
          const compromisoNombre = item.compromisoNombre || 'Sin nombre';
          const estadoAnt = item.estadoAnteriorNombre || 'N/A';
          const estadoNew = item.estadoNuevoNombre || 'N/A';
          const usuario = item.usuarioResponsableNombre || 'Sistema';
          const perfil = item.usuarioResponsablePerfil || null;
          
          return {
            tipo: 'CAMBIO_ESTADO',
            descripcion: `C${compromisoId}: ${compromisoNombre}`,
            entidad: item.entidadNombre || 'Entidad',
            usuario: usuario,
            perfil: perfil,
            fecha: item.fechaCambio || new Date().toISOString(),
            estadoAnterior: estadoAnt,
            estadoNuevo: estadoNew,
            compromisoId: compromisoId
          };
        });
        
        setUltimasActividades(actividades.length > 0 ? actividades : [
          {
            tipo: 'SISTEMA',
            descripcion: 'Sin actividad reciente',
            fecha: new Date().toISOString(),
          }
        ]);
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, isOperador]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Función para abrir modal con compromisos filtrados por estado
  const abrirModalCompromisos = (estadoId, titulo) => {
    const compromisosFiltrados = compromisosDetalle.filter(c => c.estadoId === estadoId);
    console.log('Filtrado por estado único:', estadoId, 'Resultados:', compromisosFiltrados);
    setCompromisosModal(compromisosFiltrados);
    setModalTitulo(titulo);
    setModalAbierto(true);
  };

  // Función para abrir modal con múltiples estados (sin iniciar, en trabajo)
  const abrirModalCompromisosMultiple = (estadosIds, titulo) => {
    console.log('Todos los compromisos:', compromisosDetalle);
    console.log('Filtrando por estados:', estadosIds);
    const compromisosFiltrados = compromisosDetalle.filter(c => {
      console.log(`Compromiso ${c.compromisoId} tiene estadoId: ${c.estadoId}`);
      return estadosIds.includes(c.estadoId);
    });
    console.log('Resultados filtrados:', compromisosFiltrados);
    setCompromisosModal(compromisosFiltrados);
    setModalTitulo(titulo);
    setModalAbierto(true);
  };

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
          {(isAdmin || isOperador) && 'Panel de control de la Plataforma de Cumplimiento Digital'}
          {isEntidad && (user?.entidadNombre ? `Panel de control - ${user.entidadNombre}` : 'Panel de control')}
        </p>
        {isEntidad && user?.entidadNombre && (
          <p className="text-sm text-gray-500 mt-1">
            Vista de compromisos asignados a tu entidad
          </p>
        )}
      </div>

      {/* Estadísticas principales */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
      </div> */}

      {/* Sección de información adicional */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        
        {/* Panel de Resumen para ADMIN y OPERADOR */}
        {(isAdmin || isOperador) && dashboardData && (
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Building2 className="text-primary-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Resumen del Sistema
                </h3>
                <p className="text-sm text-gray-500">
                  Vista general de la plataforma
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Users className="text-blue-600 mx-auto mb-2" size={32} />
                <p className="text-2xl font-bold text-blue-600">{dashboardData.totalUsuarios}</p>
                <p className="text-xs text-gray-600 mt-1">Usuarios</p>
                <p className="text-xs text-gray-500">{dashboardData.usuariosActivos} activos</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Building2 className="text-green-600 mx-auto mb-2" size={32} />
                <p className="text-2xl font-bold text-green-600">{dashboardData.totalEntidades}</p>
                <p className="text-xs text-gray-600 mt-1">Entidades</p>
                <p className="text-xs text-gray-500">{dashboardData.entidadesActivas} activas</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <FileText className="text-purple-600 mx-auto mb-2" size={32} />
                <p className="text-2xl font-bold text-purple-600">{dashboardData.totalMarcoNormativo}</p>
                <p className="text-xs text-gray-600 mt-1">Normas</p>
                <p className="text-xs text-gray-500">Marco normativo</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <CheckSquare className="text-orange-600 mx-auto mb-2" size={32} />
                <p className="text-2xl font-bold text-orange-600">{dashboardData.totalCompromisos || 21}</p>
                <p className="text-xs text-gray-600 mt-1">Compromisos</p>
                <p className="text-xs text-gray-500">Sistema GTD</p>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg border border-primary-200">
              <p className="text-sm font-medium text-gray-700">
                💡 <strong>Nota:</strong> Como {isAdmin ? 'administrador' : 'operador'}, puedes gestionar {isAdmin ? 'usuarios, entidades y' : ''} supervisar el cumplimiento normativo de todas las entidades desde los menús correspondientes.
              </p>
            </div>
          </div>
        )}
        
        {/* Panel de Compromisos solo para ENTIDAD */}
        {isEntidad && estadisticasCompromisos && (
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary-100 rounded-lg">
                <TrendingUp className="text-primary-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Estado de Mis Compromisos
                </h3>
                <p className="text-sm text-gray-500">
                  Progreso de tu entidad
                </p>
              </div>
            </div>
            
            {/* Resumen principal */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              <button 
                onClick={() => {
                  setCompromisosModal(compromisosDetalle);
                  setModalTitulo('Todos los Compromisos');
                  setModalAbierto(true);
                }}
                className="text-center p-3 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-gray-400 hover:shadow-md transition-all cursor-pointer"
              >

                <p className="text-2xl font-bold text-gray-800">{estadisticasCompromisos.total}</p>
                <p className="text-xs text-gray-600 mt-1">Total Activos</p>
              </button>
              <button 
                onClick={() => abrirModalCompromisosMultiple([1, 2], 'Compromisos Sin Iniciar')}
                className="text-center p-3 bg-red-50 rounded-lg border-2 border-red-200 hover:border-red-400 hover:shadow-md transition-all cursor-pointer"
              >

                <p className="text-2xl font-bold text-red-600">{estadisticasCompromisos.pendientes}</p>
                <p className="text-xs text-gray-600 mt-1">Sin Iniciar</p>
              </button>
              <button 
                onClick={() => abrirModalCompromisosMultiple([4, 5, 6, 7], 'Compromisos En Trabajo')}
                className="text-center p-3 bg-blue-50 rounded-lg border-2 border-blue-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
              >

                <p className="text-2xl font-bold text-blue-600">{estadisticasCompromisos.enProceso}</p>
                <p className="text-xs text-gray-600 mt-1">En Trabajo</p>
              </button>
              <button 
                onClick={() => abrirModalCompromisos(8, 'Compromisos Aceptados')}
                className="text-center p-3 bg-green-50 rounded-lg border-2 border-green-200 hover:border-green-400 hover:shadow-md transition-all cursor-pointer"
              >

                <p className="text-2xl font-bold text-green-600">{estadisticasCompromisos.completados}</p>
                <p className="text-xs text-gray-600 mt-1">Aceptados</p>
              </button>
            </div>

            {/* Desglose detallado de estados */}
            {estadisticasCompromisos.desglose && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-semibold text-gray-700 mb-2">Desglose por Estado:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <button 
                    onClick={() => abrirModalCompromisos(1, 'Compromisos Pendientes')}
                    className="flex items-center justify-between p-2 bg-white rounded border border-gray-200 hover:border-gray-400 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-400" />
                      <span className="text-gray-600">Pendientes:</span>
                    </div>
                    <span className="font-semibold text-gray-800">{estadisticasCompromisos.desglose.pendientes}</span>
                  </button>
                  <button 
                    onClick={() => abrirModalCompromisos(2, 'Compromisos Sin Reportar')}
                    className="flex items-center justify-between p-2 bg-white rounded border border-gray-200 hover:border-gray-400 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <span className="text-gray-600">Sin Reportar:</span>
                    </div>
                    <span className="font-semibold text-gray-800">{estadisticasCompromisos.desglose.sinReportar}</span>
                  </button>
                  <button 
                    onClick={() => abrirModalCompromisos(4, 'Compromisos En Proceso')}
                    className="flex items-center justify-between p-2 bg-white rounded border border-blue-200 hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <PlayCircle className="w-4 h-4 text-yellow-500" />
                      <span className="text-gray-600">En Proceso:</span>
                    </div>
                    <span className="font-semibold text-blue-600">{estadisticasCompromisos.desglose.enProceso}</span>
                  </button>
                  <button 
                    onClick={() => abrirModalCompromisos(5, 'Compromisos Enviados')}
                    className="flex items-center justify-between p-2 bg-white rounded border border-blue-200 hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-600">Enviados:</span>
                    </div>
                    <span className="font-semibold text-blue-600">{estadisticasCompromisos.desglose.enviados}</span>
                  </button>
                  <button 
                    onClick={() => abrirModalCompromisos(6, 'Compromisos En Revisión')}
                    className="flex items-center justify-between p-2 bg-white rounded border border-blue-200 hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <SearchCheck className="w-4 h-4 text-purple-500" />
                      <span className="text-gray-600">En Revisión:</span>
                    </div>
                    <span className="font-semibold text-blue-600">{estadisticasCompromisos.desglose.enRevision}</span>
                  </button>
                  <button 
                    onClick={() => abrirModalCompromisos(7, 'Compromisos Observados')}
                    className="flex items-center justify-between p-2 bg-white rounded border border-orange-200 hover:border-orange-400 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      <span className="text-gray-600">Observados:</span>
                    </div>
                    <span className="font-semibold text-orange-600">{estadisticasCompromisos.desglose.observados}</span>
                  </button>
                  <button 
                    onClick={() => abrirModalCompromisos(8, 'Compromisos Aceptados')}
                    className="flex items-center justify-between p-2 bg-white rounded border border-green-200 hover:border-green-400 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-gray-600">Aceptados:</span>
                    </div>
                    <span className="font-semibold text-green-600">{estadisticasCompromisos.desglose.aceptados}</span>
                  </button>
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

        {/* Panel de Entidades para ADMIN y OPERADOR */}
        {(isAdmin || isOperador) && entidadesStats.length > 0 && (
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary-100 rounded-lg">
                <BarChart3 className="text-primary-600" size={24} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-800">
                  {isAdmin ? 'Estado de Todas las Entidades' : 'Estado de Entidades Asignadas'}
                </h3>
                <p className="text-xs text-gray-500">
                  Progreso de cumplimiento por entidad
                </p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-12">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entidad</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Sin Iniciar</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">En Trabajo</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aceptados</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Cumplimiento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {entidadesStats
                    .slice((paginaEntidades - 1) * entidadesPorPagina, paginaEntidades * entidadesPorPagina)
                    .map((entidad, index) => {
                    const sinIniciar = entidad.pendientes + entidad.sinReportar;
                    const enTrabajo = entidad.enProceso + entidad.enviados + entidad.enRevision + entidad.observados;
                    const numeroFila = (paginaEntidades - 1) * entidadesPorPagina + index + 1;
                    
                    return (
                      <tr key={entidad.entidadId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-3 text-center">
                          <span className="font-medium text-gray-600">{numeroFila}</span>
                        </td>
                        <td className="px-3 py-3">
                          <div>
                            <p className="text-sm font-medium text-gray-800">{entidad.nombre}</p>
                            <p className="text-[10px] text-gray-500">{entidad.ruc}</p>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className="text-sm font-semibold text-gray-800">{entidad.totalCompromisos}</span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                            sinIniciar > 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {sinIniciar}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                            enTrabajo > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {enTrabajo}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                            entidad.aceptados > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {entidad.aceptados}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all ${
                                  entidad.porcentajeCumplimiento >= 80 ? 'bg-green-500' :
                                  entidad.porcentajeCumplimiento >= 50 ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${entidad.porcentajeCumplimiento}%` }}
                              ></div>
                            </div>
                            <span className="font-semibold text-gray-700 text-[10px] w-10 text-right">
                              {entidad.porcentajeCumplimiento}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Paginación */}
            {entidadesStats.length > entidadesPorPagina && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Mostrando {((paginaEntidades - 1) * entidadesPorPagina) + 1} a {Math.min(paginaEntidades * entidadesPorPagina, entidadesStats.length)} de {entidadesStats.length} entidades
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPaginaEntidades(prev => Math.max(1, prev - 1))}
                    disabled={paginaEntidades === 1}
                    className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Anterior
                  </button>
                  <div className="flex gap-1">
                    {Array.from({ length: Math.ceil(entidadesStats.length / entidadesPorPagina) }, (_, i) => i + 1)
                      .filter(page => {
                        const totalPages = Math.ceil(entidadesStats.length / entidadesPorPagina);
                        return page === 1 || 
                               page === totalPages || 
                               (page >= paginaEntidades - 1 && page <= paginaEntidades + 1);
                      })
                      .map((page, index, array) => (
                        <div key={page} className="flex items-center">
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="px-2 text-gray-400">...</span>
                          )}
                          <button
                            onClick={() => setPaginaEntidades(page)}
                            className={`px-3 py-1 text-sm border rounded-lg transition-colors ${
                              paginaEntidades === page
                                ? 'bg-primary-600 text-white border-primary-600'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        </div>
                      ))
                    }
                  </div>
                  <button
                    onClick={() => setPaginaEntidades(prev => Math.min(Math.ceil(entidadesStats.length / entidadesPorPagina), prev + 1))}
                    disabled={paginaEntidades >= Math.ceil(entidadesStats.length / entidadesPorPagina)}
                    className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </div>
        )}


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
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate" title={actividad.descripcion}>
                    {actividad.descripcion}
                  </p>
                  {actividad.entidad && (
                    <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                      <Building2 className="inline w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{actividad.entidad}</span>
                    </p>
                  )}
                  {actividad.estadoAnterior && actividad.estadoNuevo && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-700">
                        {actividad.estadoAnterior}
                      </span>
                      <span className="text-gray-400">→</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                        {actividad.estadoNuevo}
                      </span>
                    </div>
                  )}
                  {actividad.usuario && (
                    <p className="text-xs text-gray-500 mt-1">
                      Por: {actividad.usuario}{actividad.perfil && ` - ${actividad.perfil}`}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(actividad.fecha).toLocaleString('es-PE', { 
                      day: '2-digit', 
                      month: '2-digit', 
                      year: '2-digit',
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de compromisos */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[95vh] flex flex-col">
            {/* Header del modal */}
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary-600 to-primary-700 rounded-t-xl text-white">
              <div className="flex items-center gap-3">
                <CheckSquare className="w-6 h-6" />
                <div>
                  <h2 className="text-lg font-semibold">{modalTitulo}</h2>
                  <p className="text-sm text-white/80">{compromisosModal.length} {compromisosModal.length === 1 ? 'compromiso encontrado' : 'compromisos encontrados'}</p>
                </div>
              </div>
              <button 
                onClick={() => setModalAbierto(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="flex-1 overflow-y-auto p-6">
              {compromisosModal.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <AlertCircle size={64} className="mb-4 text-gray-300" />
                  <p className="text-lg font-medium text-gray-600">No hay compromisos en este estado</p>
                  <p className="text-sm text-gray-500 mt-2">Intenta con otro filtro o estado</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {compromisosModal.map((compromiso) => (
                    <div 
                      key={compromiso.compromisoId}
                      className="group relative flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="flex items-center justify-center w-10 h-10 bg-primary-100 text-primary-700 font-bold rounded-lg text-sm">
                            C{compromiso.compromisoId}
                          </span>
                          <div>
                            <span className="font-medium text-gray-800 block">
                              {compromiso.nombreCompromiso || `Compromiso ${compromiso.compromisoId}`}
                            </span>
                            <div className="flex items-center gap-3 mt-1">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                compromiso.estadoId === 8 ? 'bg-green-100 text-green-700' :
                                compromiso.estadoId === 7 ? 'bg-red-100 text-red-700' :
                                compromiso.estadoId === 5 || compromiso.estadoId === 6 ? 'bg-blue-100 text-blue-700' :
                                compromiso.estadoId === 4 ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {compromiso.estadoNombre || 'Sin estado'}
                              </span>
                              {compromiso.updatedAt && (
                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                  <Clock size={12} />
                                  {new Date(compromiso.updatedAt).toLocaleDateString('es-PE')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/dashboard/cumplimiento/nuevo?compromiso=${compromiso.compromisoId}&mode=view`)}
                          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm font-medium"
                          title="Ver en modo solo lectura"
                        >
                          <Eye size={16} />
                          Ver
                        </button>
                        {/* Mostrar botón Editar solo si NO está ENVIADO (5), EN REVISIÓN (6) ni ACEPTADO (8) */}
                        {compromiso.estadoId !== 5 && compromiso.estadoId !== 6 && compromiso.estadoId !== 8 && (
                          <button
                            onClick={() => navigate(`/dashboard/cumplimiento/nuevo?compromiso=${compromiso.compromisoId}`)}
                            className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm group-hover:shadow"
                            title="Editar compromiso"
                          >
                            <Edit2 size={16} />
                            Editar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer del modal */}
            <div className="flex justify-between items-center gap-2 p-6 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-600">
                Mostrando <span className="font-semibold">{compromisosModal.length}</span> de <span className="font-semibold">{compromisosDetalle.length}</span> compromisos
              </p>
              <button
                onClick={() => setModalAbierto(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
