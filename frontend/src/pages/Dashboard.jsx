import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Users, Building2, FileText, CheckSquare } from 'lucide-react';
import { dashboardService } from '../services/dashboardService';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
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
          },
          {
            title: 'Entidades',
            value: data.totalEntidades.toString(),
            icon: Building2,
            color: 'bg-green-500',
            subtitle: `${data.entidadesActivas} activas`,
          },
          {
            title: 'Marco Normativo',
            value: data.totalMarcoNormativo.toString(),
            icon: FileText,
            color: 'bg-purple-500',
            subtitle: 'Normas registradas',
          },
          {
            title: 'Compromisos',
            value: data.totalCompromisos.toString(),
            icon: CheckSquare,
            color: 'bg-orange-500',
            subtitle: `${data.compromisosPendientes} pendientes`,
          },
        ];
        
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
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
          Panel de control de la Plataforma de Cumplimiento Digital
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-2">{stat.subtitle}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
