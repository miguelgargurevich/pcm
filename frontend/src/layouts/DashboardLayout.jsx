import { useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Users,
  Building2,
  FileText,
  CheckSquare,
  ClipboardCheck,
  TrendingUp,
  BarChart3,
  Search,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { icon: Users, label: 'Gestionar Usuario', path: '/dashboard/usuarios' },
    { icon: Building2, label: 'Gestionar Entidades', path: '/dashboard/entidades' },
    { icon: FileText, label: 'Marco Normativo', path: '/dashboard/marco-normativo' },
    { icon: CheckSquare, label: 'Compromisos Gob. Digital', path: '/dashboard/compromisos' },
    { icon: ClipboardCheck, label: 'Cumplimiento Normativo', path: '/dashboard/cumplimiento' },
    { icon: TrendingUp, label: 'Seguimiento PGD-PP', path: '/dashboard/seguimiento' },
    { icon: BarChart3, label: 'Evaluación y Cumplimiento', path: '/dashboard/evaluacion' },
    { icon: Search, label: 'Consultas y Reportes', path: '/dashboard/reportes' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-primary-800 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-primary-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-primary-500 font-bold text-xl">PCM</span>
                </div>
                <span className="font-semibold text-sm">Cumplimiento Digital</span>
              </div>
              <button
                onClick={onClose}
                className="lg:hidden text-white hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Menú */}
          <nav className="flex-1 overflow-y-auto py-4">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={index}
                  to={item.path}
                  className="flex items-center space-x-3 px-4 py-3 hover:bg-primary-600 hover:border-l-4 hover:border-white transition-all duration-200 text-gray-100 hover:text-white"
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-primary-700">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-red-600 rounded-lg transition-colors duration-200 text-gray-100 hover:text-white"
            >
              <LogOut size={20} />
              <span className="text-sm">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Contenido principal */}
      <div className="lg:ml-64 min-h-screen bg-gray-50">
        {/* Barra superior */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-gray-600 hover:text-primary-500 transition-colors"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-bold text-primary-500">
                Plataforma de Cumplimiento Digital
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-800">
                  {user?.nombreCompleto || 'Usuario'}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.perfil?.nombre || 'Administrador'}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-semibold text-sm">
                  {user?.nombreCompleto?.charAt(0) || 'A'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Área de contenido */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
