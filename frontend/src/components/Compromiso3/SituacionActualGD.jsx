import { useState } from 'react';
import EstructuraOrganizacional from './SituacionActual/EstructuraOrganizacional';
import InventarioSoftwareTab from './SituacionActual/InventarioSoftwareTab';
import InventarioSistemasTab from './SituacionActual/InventarioSistemasTab';
import InventarioRedTab from './SituacionActual/InventarioRedTab';
import InventarioServidoresTab from './SituacionActual/InventarioServidoresTab';
import SeguridadInfoTab from './SituacionActual/SeguridadInfoTab';

/**
 * Componente contenedor para la Situación Actual de GD
 * Contiene 6 sub-tabs para diferentes inventarios y datos
 */
const SituacionActualGD = ({ data, onDataChange, viewMode = false }) => {
  const [activeSubTab, setActiveSubTab] = useState('estructura');

  const subTabs = [
    { id: 'estructura', label: 'Estructura Org.' },
    { id: 'software', label: 'Inv. Software' },
    { id: 'sistemas', label: 'Inv. Sistemas' },
    { id: 'red', label: 'Inv. Equipos Red' },
    { id: 'servidores', label: 'Inv. Servidores' },
    { id: 'seguridad', label: 'Seguridad Info.' }
  ];

  const handleHeaderChange = (headerData) => {
    onDataChange({
      ...data,
      header: {
        ...data?.header,
        ...headerData
      }
    });
  };

  const handlePersonalChange = (personalTI) => {
    onDataChange({ ...data, personalTI });
  };

  const handleSoftwareChange = (inventarioSoftware) => {
    onDataChange({ ...data, inventarioSoftware });
  };

  const handleSistemasChange = (inventarioSistemas) => {
    onDataChange({ ...data, inventarioSistemas });
  };

  const handleRedChange = (inventarioRed) => {
    onDataChange({ ...data, inventarioRed });
  };

  const handleServidoresChange = (inventarioServidores) => {
    onDataChange({ ...data, inventarioServidores });
  };

  const handleSeguridadChange = (seguridadData) => {
    onDataChange({
      ...data,
      seguridadInfo: seguridadData.seguridadInfo,
      capacitacionesSeginfo: seguridadData.capacitacionesSeginfo
    });
  };

  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case 'estructura':
        return (
          <EstructuraOrganizacional
            headerData={data?.header || {}}
            personalTI={data?.personalTI || []}
            onHeaderChange={handleHeaderChange}
            onPersonalChange={handlePersonalChange}
            viewMode={viewMode}
          />
        );
      case 'software':
        return (
          <InventarioSoftwareTab
            inventario={data?.inventarioSoftware || []}
            onInventarioChange={handleSoftwareChange}
            viewMode={viewMode}
          />
        );
      case 'sistemas':
        return (
          <InventarioSistemasTab
            inventario={data?.inventarioSistemas || []}
            onInventarioChange={handleSistemasChange}
            viewMode={viewMode}
          />
        );
      case 'red':
        return (
          <InventarioRedTab
            inventario={data?.inventarioRed || []}
            onInventarioChange={handleRedChange}
            viewMode={viewMode}
          />
        );
      case 'servidores':
        return (
          <InventarioServidoresTab
            inventario={data?.inventarioServidores || []}
            onInventarioChange={handleServidoresChange}
            viewMode={viewMode}
          />
        );
      case 'seguridad':
        return (
          <SeguridadInfoTab
            seguridadInfo={data?.seguridadInfo || {}}
            capacitacionesSeginfo={data?.capacitacionesSeginfo || []}
            onSeguridadChange={handleSeguridadChange}
            viewMode={viewMode}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-800">Situación Actual de Gobierno Digital</h3>
      
      {/* Sub-tabs navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex flex-wrap gap-1 -mb-px" aria-label="Sub tabs">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeSubTab === tab.id
                  ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Sub-tab content */}
      <div className="pt-4">
        {renderSubTabContent()}
      </div>
    </div>
  );
};

export default SituacionActualGD;
