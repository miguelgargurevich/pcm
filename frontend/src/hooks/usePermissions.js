import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { permisosService } from '../services/permisosService';
import { tieneAcceso, tienePermisoTotal, soloConsulta, puedeRealizarAccion } from '../config/permissions';

export const usePermissions = () => {
  const { user } = useAuth();
  const [permisos, setPermisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPermisos = async () => {
      if (!user || !user.perfilId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await permisosService.getPermisosByPerfil(user.perfilId);
        
        if (response.isSuccess || response.IsSuccess) {
          const data = response.data || response.Data;
          setPermisos(data.permisos || []);
        } else {
          setError(response.message || 'Error al cargar permisos');
        }
      } catch (err) {
        setError(err.message || 'Error al cargar permisos');
        console.error('Error loading permissions:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPermisos();
  }, [user]);

  return {
    permisos,
    loading,
    error,
    tieneAcceso: (codigoModulo) => tieneAcceso(permisos, codigoModulo),
    tienePermisoTotal: (codigoModulo) => tienePermisoTotal(permisos, codigoModulo),
    soloConsulta: (codigoModulo) => soloConsulta(permisos, codigoModulo),
    puedeCrear: (codigoModulo) => puedeRealizarAccion(permisos, codigoModulo, 'crear'),
    puedeEditar: (codigoModulo) => puedeRealizarAccion(permisos, codigoModulo, 'editar'),
    puedeEliminar: (codigoModulo) => puedeRealizarAccion(permisos, codigoModulo, 'eliminar'),
    puedeConsultar: (codigoModulo) => puedeRealizarAccion(permisos, codigoModulo, 'consultar'),
  };
};
