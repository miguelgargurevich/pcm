import { usePermissions } from '../hooks/usePermissions';
import { Eye } from 'lucide-react';

/**
 * Badge que muestra si el usuario está en modo "Solo Consulta"
 */
const ConsultaBadge = ({ codigoModulo }) => {
  const { soloConsulta, loading } = usePermissions();

  if (loading || !soloConsulta(codigoModulo)) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
      <Eye size={16} />
      <span>Modo Solo Consulta</span>
    </div>
  );
};

export default ConsultaBadge;
