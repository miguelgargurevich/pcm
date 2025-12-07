import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';

/**
 * Componente para gestionar el Inventario de Software
 */
const InventarioSoftwareTab = ({ inventario = [], onInventarioChange, viewMode = false }) => {
  const [localInventario, setLocalInventario] = useState(inventario);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [formItem, setFormItem] = useState({
    nombreSoftware: '',
    version: '',
    tipoSoftware: '',
    licencia: '',
    cantidadLicencias: '',
    vigenciaLicencia: '',
    proveedor: '',
    observaciones: ''
  });

  useEffect(() => {
    setLocalInventario(inventario);
  }, [inventario]);

  const handleAddItem = () => {
    setEditingItem(null);
    setFormItem({
      nombreSoftware: '',
      version: '',
      tipoSoftware: '',
      licencia: '',
      cantidadLicencias: '',
      vigenciaLicencia: '',
      proveedor: '',
      observaciones: ''
    });
    setShowModal(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setFormItem({
      nombreSoftware: item.nombreSoftware || '',
      version: item.version || '',
      tipoSoftware: item.tipoSoftware || '',
      licencia: item.licencia || '',
      cantidadLicencias: item.cantidadLicencias || '',
      vigenciaLicencia: item.vigenciaLicencia || '',
      proveedor: item.proveedor || '',
      observaciones: item.observaciones || ''
    });
    setShowModal(true);
  };

  const handleDeleteItem = (itemId) => {
    const updated = localInventario.filter(i => (i.invSoftId || i.tempId) !== itemId);
    setLocalInventario(updated);
    onInventarioChange(updated);
  };

  const handleSaveItem = () => {
    if (!formItem.nombreSoftware.trim()) return;

    let updated;
    if (editingItem) {
      updated = localInventario.map(i => {
        if ((i.invSoftId || i.tempId) === (editingItem.invSoftId || editingItem.tempId)) {
          return { ...i, ...formItem };
        }
        return i;
      });
    } else {
      const newItem = {
        tempId: Date.now(),
        ...formItem,
        activo: true
      };
      updated = [...localInventario, newItem];
    }

    setLocalInventario(updated);
    onInventarioChange(updated);
    setShowModal(false);
  };

  const tiposSoftware = [
    { value: 'Sistema Operativo', label: 'Sistema Operativo' },
    { value: 'Ofimática', label: 'Ofimática' },
    { value: 'Antivirus', label: 'Antivirus' },
    { value: 'Base de Datos', label: 'Base de Datos' },
    { value: 'Virtualización', label: 'Virtualización' },
    { value: 'Backup', label: 'Backup' },
    { value: 'Gestión', label: 'Gestión' },
    { value: 'Desarrollo', label: 'Desarrollo' },
    { value: 'Otro', label: 'Otro' }
  ];

  const tiposLicencia = [
    { value: 'Propietaria', label: 'Propietaria' },
    { value: 'Open Source', label: 'Open Source' },
    { value: 'Freeware', label: 'Freeware' },
    { value: 'Shareware', label: 'Shareware' },
    { value: 'Suscripción', label: 'Suscripción' },
    { value: 'Perpetua', label: 'Perpetua' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-gray-800">Inventario de Software</h4>
        {!viewMode && (
          <button
            onClick={handleAddItem}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar Software
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N°</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Versión</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Licencia</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cant. Lic.</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vigencia</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
              {!viewMode && (
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {localInventario.length === 0 ? (
              <tr>
                <td colSpan={viewMode ? 8 : 9} className="px-3 py-4 text-center text-gray-500">
                  No hay software registrado
                </td>
              </tr>
            ) : (
              localInventario.map((item, index) => {
                const itemId = item.invSoftId || item.tempId;
                return (
                  <tr key={itemId} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm text-gray-500">{index + 1}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{item.nombreSoftware}</td>
                    <td className="px-3 py-2 text-sm text-gray-500">{item.version}</td>
                    <td className="px-3 py-2 text-sm text-gray-500">{item.tipoSoftware}</td>
                    <td className="px-3 py-2 text-sm text-gray-500">{item.licencia}</td>
                    <td className="px-3 py-2 text-sm text-gray-500">{item.cantidadLicencias}</td>
                    <td className="px-3 py-2 text-sm text-gray-500">{item.vigenciaLicencia}</td>
                    <td className="px-3 py-2 text-sm text-gray-500">{item.proveedor}</td>
                    {!viewMode && (
                      <td className="px-3 py-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleEditItem(item)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(itemId)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingItem ? 'Editar Software' : 'Agregar Software'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Software *
                </label>
                <input
                  type="text"
                  value={formItem.nombreSoftware}
                  onChange={(e) => setFormItem(prev => ({ ...prev, nombreSoftware: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Versión</label>
                  <input
                    type="text"
                    value={formItem.version}
                    onChange={(e) => setFormItem(prev => ({ ...prev, version: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Software</label>
                  <select
                    value={formItem.tipoSoftware}
                    onChange={(e) => setFormItem(prev => ({ ...prev, tipoSoftware: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccione...</option>
                    {tiposSoftware.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Licencia</label>
                  <select
                    value={formItem.licencia}
                    onChange={(e) => setFormItem(prev => ({ ...prev, licencia: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccione...</option>
                    {tiposLicencia.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad de Licencias</label>
                  <input
                    type="number"
                    value={formItem.cantidadLicencias}
                    onChange={(e) => setFormItem(prev => ({ ...prev, cantidadLicencias: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vigencia de Licencia</label>
                  <input
                    type="date"
                    value={formItem.vigenciaLicencia}
                    onChange={(e) => setFormItem(prev => ({ ...prev, vigenciaLicencia: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                  <input
                    type="text"
                    value={formItem.proveedor}
                    onChange={(e) => setFormItem(prev => ({ ...prev, proveedor: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                <textarea
                  value={formItem.observaciones}
                  onChange={(e) => setFormItem(prev => ({ ...prev, observaciones: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingItem ? 'Guardar' : 'Agregar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventarioSoftwareTab;
