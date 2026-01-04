import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CheckCircle, XCircle, AlertCircle, MinusCircle } from 'lucide-react';
import com10IndicadoresCEDAService from '../../services/com10IndicadoresCEDAService';
import { showErrorToast } from '../../utils/toast.jsx';

/**
 * Componente para mostrar la lista de indicadores CEDA del Compromiso 10
 */
const IndicadoresCEDAList = ({ compndaEntId, onSelectIndicador }) => {
  const [indicadores, setIndicadores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (compndaEntId) {
      cargarIndicadores();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compndaEntId]);

  const cargarIndicadores = async () => {
    try {
      setLoading(true);
      const response = await com10IndicadoresCEDAService.getList(compndaEntId);
      
      if (response.isSuccess && response.data) {
        setIndicadores(response.data);
      } else {
        showErrorToast('No se pudieron cargar los indicadores CEDA');
      }
    } catch (error) {
      console.error('Error al cargar indicadores CEDA:', error);
      showErrorToast('Error al cargar los indicadores CEDA');
    } finally {
      setLoading(false);
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'Cumple':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'Parcial':
        return <AlertCircle className="text-yellow-600" size={20} />;
      case 'No cumple':
        return <XCircle className="text-red-600" size={20} />;
      case 'No aplica':
        return <MinusCircle className="text-gray-400" size={20} />;
      default:
        return <MinusCircle className="text-gray-300" size={20} />;
    }
  };

  const getEstadoBadgeClass = (estado) => {
    switch (estado) {
      case 'Cumple':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Parcial':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'No cumple':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'No aplica':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!compndaEntId) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No se ha encontrado el registro del compromiso 10</p>
        <p className="text-sm mt-2">Debe completar primero los datos generales</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                Nro
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre de Indicador
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {indicadores.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                  No hay indicadores disponibles
                </td>
              </tr>
            ) : (
              indicadores.map((indicador) => (
                <tr
                  key={indicador.indicadorId}
                  onClick={() => onSelectIndicador(indicador)}
                  className="hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {indicador.numeroOrden}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {indicador.nombreIndicador}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      {getEstadoIcon(indicador.estadoIndicador)}
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getEstadoBadgeClass(
                          indicador.estadoIndicador
                        )}`}
                      >
                        {indicador.estadoIndicador || 'Sin evaluar'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

IndicadoresCEDAList.propTypes = {
  compndaEntId: PropTypes.number,
  onSelectIndicador: PropTypes.func.isRequired
};

export default IndicadoresCEDAList;
