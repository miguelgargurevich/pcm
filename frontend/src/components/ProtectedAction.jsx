import PropTypes from 'prop-types';
import { usePermissions } from '../hooks/usePermissions';
import { AlertCircle } from 'lucide-react';

/**
 * Componente que solo renderiza sus hijos si el usuario tiene el permiso requerido
 */
const ProtectedAction = ({ children, codigoModulo, accion, fallback = null, showMessage = false }) => {
  const { puedeCrear, puedeEditar, puedeEliminar, puedeConsultar, loading } = usePermissions();

  if (loading) {
    return null;
  }

  let tienePermiso = false;

  switch (accion) {
    case 'crear':
      tienePermiso = puedeCrear(codigoModulo);
      break;
    case 'editar':
      tienePermiso = puedeEditar(codigoModulo);
      break;
    case 'eliminar':
      tienePermiso = puedeEliminar(codigoModulo);
      break;
    case 'consultar':
      tienePermiso = puedeConsultar(codigoModulo);
      break;
    default:
      tienePermiso = false;
  }

  if (!tienePermiso) {
    if (showMessage) {
      return (
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded">
          <AlertCircle size={16} />
          <span>No tiene permisos para {accion} en este módulo</span>
        </div>
      );
    }
    return fallback;
  }

  return <>{children}</>;
};

ProtectedAction.propTypes = {
  children: PropTypes.node.isRequired,
  codigoModulo: PropTypes.string.isRequired,
  accion: PropTypes.oneOf(['crear', 'editar', 'eliminar', 'consultar']).isRequired,
  fallback: PropTypes.node,
  showMessage: PropTypes.bool
};

export default ProtectedAction;
