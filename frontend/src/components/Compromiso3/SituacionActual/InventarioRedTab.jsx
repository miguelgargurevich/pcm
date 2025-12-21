import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X } from 'lucide-react';

/**
 * Componente para gestionar el Inventario de Equipos de Red
 */
const InventarioRedTab = ({ inventario = [], onInventarioChange, viewMode = false }) => {
  const [localInventario, setLocalInventario] = useState(inventario);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [formItem, setFormItem] = useState({
    tipoEquipo: '',
    cantidad: '',
    puertosOperativos: '',
    puertosInoperativos: '',
    totalPuertos: '',
    costoMantenimientoAnual: '',
    observaciones: ''
  });

  useEffect(() => {
    setLocalInventario(inventario);
  }, [inventario]);

  const handleAddItem = () => {
    setEditingItem(null);
    setFormItem({
      tipoEquipo: '',
      cantidad: '',
      puertosOperativos: '',
      puertosInoperativos: '',
      totalPuertos: '',
      costoMantenimientoAnual: '',
      observaciones: ''
    });
    setShowModal(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setFormItem({
      tipoEquipo: item.tipoEquipo || '',
      cantidad: item.cantidad || '',
      puertosOperativos: item.puertosOperativos || '',
      puertosInoperativos: item.puertosInoperativos || '',
      totalPuertos: item.totalPuertos || '',
      costoMantenimientoAnual: item.costoMantenimientoAnual || '',
      observaciones: item.observaciones || ''
    });
    setShowModal(true);
  };

  const handleDeleteItem = (itemId) => {
    const updated = localInventario.filter(i => (i.invRedId || i.tempId) !== itemId);
    setLocalInventario(updated);
    onInventarioChange(updated);
  };

  const handleSaveItem = () => {
    if (!formItem.tipoEquipo.trim()) return;

    // Auto-calcular totalPuertos
    const operativos = parseInt(formItem.puertosOperativos) || 0;
    const inoperativos = parseInt(formItem.puertosInoperativos) || 0;
    const itemToSave = {
      ...formItem,
      totalPuertos: operativos + inoperativos
    };

    let updated;
    if (editingItem) {
      updated = localInventario.map(i => {
        if ((i.invRedId || i.tempId) === (editingItem.invRedId || editingItem.tempId)) {
          return { ...i, ...itemToSave };
        }
        return i;
      });
    } else {
      const newItem = {
        tempId: Date.now(),
        ...itemToSave,
        activo: true
      };
      updated = [...localInventario, newItem];
    }

    setLocalInventario(updated);
    onInventarioChange(updated);
    setShowModal(false);
  };

  const tiposEquipo = [
    { value: 'Router', label: 'Router' },
    { value: 'Switch', label: 'Switch' },
    { value: 'Access Point', label: 'Access Point' },
    { value: 'Firewall', label: 'Firewall' },
    { value: 'Modem', label: 'Módem' },
    { value: 'Hub', label: 'Hub' },
    { value: 'Patch Panel', label: 'Patch Panel' },
    { value: 'UPS', label: 'UPS' },
    { value: 'Controlador WiFi', label: 'Controlador WiFi' },
    { value: 'Otro', label: 'Otro' }
  ];

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-gray-800">Inventario de Equipos de Red</h4>
        {!viewMode && (
          <button
            onClick={handleAddItem}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar Equipo
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N°</th>
              <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo Equipo</th>
              <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
              <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puertos Op.</th>
              <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puertos Inop.</th>
              <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Puertos</th>
              <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costo Mant. Anual</th>
              {!viewMode && (
                <th className="px-2 py-1.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {localInventario.length === 0 ? (
              <tr>
                <td colSpan={viewMode ? 7 : 8} className="px-3 py-4 text-center text-gray-500">
                  No hay equipos de red registrados
                </td>
              </tr>
            ) : (
              localInventario.map((item, index) => {
                const itemId = item.invRedId || item.tempId;
                return (
                  <tr key={itemId} className="hover:bg-gray-50">
                    <td className="px-2 py-1.5 text-xs text-gray-500">{index + 1}</td>
                    <td className="px-2 py-1.5 text-xs text-gray-900">{item.tipoEquipo}</td>
                    <td className="px-2 py-1.5 text-xs text-gray-500 text-center font-medium">{item.cantidad}</td>
                    <td className="px-2 py-1.5 text-xs text-gray-500 text-center">
                      <span className="text-green-600 font-medium">{item.puertosOperativos || 0}</span>
                    </td>
                    <td className="px-2 py-1.5 text-xs text-gray-500 text-center">
                      <span className="text-red-600 font-medium">{item.puertosInoperativos || 0}</span>
                    </td>
                    <td className="px-2 py-1.5 text-xs text-gray-900 text-center font-semibold">{item.totalPuertos || 0}</td>
                    <td className="px-2 py-1.5 text-xs text-gray-500">S/ {parseFloat(item.costoMantenimientoAnual || 0).toFixed(2)}</td>
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
            <h3 className="text-base font-semibold mb-4">
              {editingItem ? 'Editar Equipos de Red' : 'Agregar Equipos de Red'}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Tipo de Equipo *
                </label>
                <select
                  value={formItem.tipoEquipo}
                  onChange={(e) => setFormItem(prev => ({ ...prev, tipoEquipo: e.target.value }))}
                  required
                  className="input-field-sm"
                >
                  <option key="tipo-empty" value="">Seleccione...</option>
                  {tiposEquipo.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Cantidad de Equipos *
                </label>
                <input
                  type="number"
                  value={formItem.cantidad}
                  onChange={(e) => setFormItem(prev => ({ ...prev, cantidad: e.target.value }))}
                  required
                  min="1"
                  className="input-field-sm"
                  placeholder="Cantidad total de equipos de este tipo"
                />
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg space-y-3">
                <h4 className="text-sm font-medium text-blue-900">🔌 Puertos</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Puertos Operativos *
                    </label>
                    <input
                      type="number"
                      value={formItem.puertosOperativos}
                      onChange={(e) => {
                        const operativos = e.target.value;
                        const inoperativos = formItem.puertosInoperativos || 0;
                        setFormItem(prev => ({ 
                          ...prev, 
                          puertosOperativos: operativos,
                          totalPuertos: (parseInt(operativos) || 0) + (parseInt(inoperativos) || 0)
                        }));
                      }}
                      required
                      min="0"
                      className="input-field-sm"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Puertos Inoperativos *
                    </label>
                    <input
                      type="number"
                      value={formItem.puertosInoperativos}
                      onChange={(e) => {
                        const inoperativos = e.target.value;
                        const operativos = formItem.puertosOperativos || 0;
                        setFormItem(prev => ({ 
                          ...prev, 
                          puertosInoperativos: inoperativos,
                          totalPuertos: (parseInt(operativos) || 0) + (parseInt(inoperativos) || 0)
                        }));
                      }}
                      required
                      min="0"
                      className="input-field-sm"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Total de Puertos (Calculado)
                  </label>
                  <input
                    type="number"
                    value={formItem.totalPuertos}
                    disabled
                    className="input-field-readonly font-semibold"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Se calcula automáticamente: Operativos + Inoperativos
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Costo Mantenimiento Anual (S/.) *
                </label>
                <input
                  type="number"
                  value={formItem.costoMantenimientoAnual}
                  onChange={(e) => setFormItem(prev => ({ ...prev, costoMantenimientoAnual: e.target.value }))}
                  required
                  step="0.01"
                  min="0"
                  className="input-field-sm"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Observaciones</label>
                <textarea
                  value={formItem.observaciones}
                  onChange={(e) => setFormItem(prev => ({ ...prev, observaciones: e.target.value }))}
                  rows={2}
                  maxLength={255}
                  className="input-field-sm"
                  placeholder="Información adicional..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-3 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveItem}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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

export default InventarioRedTab;
