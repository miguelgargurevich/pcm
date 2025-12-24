import { useState } from 'react';
import PropTypes from 'prop-types';
import { Database, CheckSquare } from 'lucide-react';
import IndicadoresCEDAList from './IndicadoresCEDAList';
import IndicadoresCEDADetalle from './IndicadoresCEDADetalle';

/**
 * Componente principal del Compromiso 10 con pestañas
 * - Datos Generales (el formulario actual)
 * - Indicadores CEDA (nueva funcionalidad)
 */
const Compromiso10Tabs = ({ compndaEntId, children }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [indicadorSeleccionado, setIndicadorSeleccionado] = useState(null);

  const tabs = [
    { id: 'general', label: 'Datos Generales', icon: Database },
    { id: 'indicadores-ceda', label: 'Indicadores CEDA', icon: CheckSquare }
  ];

  const handleSelectIndicador = (indicador) => {
    setIndicadorSeleccionado(indicador);
  };

  const handleBackToList = () => {
    setIndicadorSeleccionado(null);
  };

  return (
    <div className="space-y-4">
      {/* Navegación de pestañas */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-1" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIndicadorSeleccionado(null); // Reset al cambiar de pestaña
                }}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Contenido de pestañas */}
      <div>
        {activeTab === 'general' && (
          <div>{children}</div>
        )}

        {activeTab === 'indicadores-ceda' && (
          <div>
            {!indicadorSeleccionado ? (
              <div>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Indicadores CEDA</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Evalúe el cumplimiento de los indicadores del Convenio de Evaluación de Datos Abiertos (CEDA)
                  </p>
                </div>
                <IndicadoresCEDAList
                  compndaEntId={compndaEntId}
                  onSelectIndicador={handleSelectIndicador}
                />
              </div>
            ) : (
              <IndicadoresCEDADetalle
                compndaEntId={compndaEntId}
                indicador={indicadorSeleccionado}
                onBack={handleBackToList}
                onSaved={handleBackToList}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

Compromiso10Tabs.propTypes = {
  compndaEntId: PropTypes.number,
  children: PropTypes.node.isRequired
};

export default Compromiso10Tabs;
