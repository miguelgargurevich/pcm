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
  Shield,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { icon: Users, label: 'Gestionar Usuario', path: '/dashboard/usuarios' },
    { icon: Building2, label: 'Gestionar Entidades', path: '/dashboard/entidades' },
    { icon: FileText, label: 'Gestionar Marco Normativo', path: '/dashboard/marco-normativo' },
    { icon: CheckSquare, label: 'Compromisos Gobierno Digital', path: '/dashboard/compromisos' },
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
              <div className="flex items-center space-x-3 ml-6">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
                  <Shield className="text-primary-700" size={24} />
                </div>
                <span className="font-semibold text-xs">Platanforma de Cumplimiento</span>
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
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <div className="space-y-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={index}
                    to={item.path}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-primary-700/50 hover:bg-primary-600 transition-all duration-200 text-gray-100 hover:text-white shadow-sm hover:shadow-md group"
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose();
                    }}
                  >
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md bg-white/10 group-hover:bg-white/20 transition-colors">
                      <Icon size={18} className="text-cyan-100 group-hover:text-white" />
                    </div>
                    <span className="text-sm font-medium flex-1">{item.label}</span>
                  </Link>
                );
              })}
            </div>
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
        <header className="bg-primary-800 border-b border-primary-700 sticky top-0 z-30 shadow-lg">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-white hover:text-gray-200 transition-colors"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-bold text-white">
                Plataforma de Cumplimiento Digital
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white">
                  {user?.nombreCompleto || 'Usuario'}
                </p>
                <p className="text-xs text-gray-300">
                  {user?.perfil?.nombre || 'Administrador'}
                </p>
              </div>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                <span className="text-primary-800 font-bold text-sm">
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
