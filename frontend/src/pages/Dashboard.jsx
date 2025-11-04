import { useAuth } from '../hooks/useAuth';
import { Users, Building2, FileText, CheckSquare } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Usuarios',
      value: '45',
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      title: 'Entidades',
      value: '128',
      icon: Building2,
      color: 'bg-green-500',
      change: '+8%',
    },
    {
      title: 'Marco Normativo',
      value: '67',
      icon: FileText,
      color: 'bg-purple-500',
      change: '+5%',
    },
    {
      title: 'Compromisos',
      value: '234',
      icon: CheckSquare,
      color: 'bg-orange-500',
      change: '+15%',
    },
  ];

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
                  <p className="text-sm text-green-600 mt-2">{stat.change} este mes</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actividad reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Actividad Reciente
          </h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex items-center space-x-3 pb-3 border-b border-gray-200 last:border-0"
              >
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">
                    Nuevo usuario registrado
                  </p>
                  <p className="text-xs text-gray-500">Hace {item} hora(s)</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Notificaciones
          </h3>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-start space-x-3 pb-3 border-b border-gray-200 last:border-0"
              >
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">
                    Compromiso pendiente de revisión
                  </p>
                  <p className="text-xs text-gray-500">Hace {item} día(s)</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
