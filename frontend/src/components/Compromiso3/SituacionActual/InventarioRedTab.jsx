import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';

/**
 * Componente para gestionar el Inventario de Equipos de Red
 */
const InventarioRedTab = ({ inventario = [], onInventarioChange, viewMode = false }) => {
  const [localInventario, setLocalInventario] = useState(inventario);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [formItem, setFormItem] = useState({
    tipoEquipo: '',
    marca: '',
    modelo: '',
    serie: '',
    ubicacion: '',
    estado: '',
    anoAdquisicion: '',
    garantiaVigente: false,
    observaciones: ''
  });

  useEffect(() => {
    setLocalInventario(inventario);
  }, [inventario]);

  const handleAddItem = () => {
    setEditingItem(null);
    setFormItem({
      tipoEquipo: '',
      marca: '',
      modelo: '',
      serie: '',
      ubicacion: '',
      estado: '',
      anoAdquisicion: '',
      garantiaVigente: false,
      observaciones: ''
    });
    setShowModal(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setFormItem({
      tipoEquipo: item.tipoEquipo || '',
      marca: item.marca || '',
      modelo: item.modelo || '',
      serie: item.serie || '',
      ubicacion: item.ubicacion || '',
      estado: item.estado || '',
      anoAdquisicion: item.anoAdquisicion || '',
      garantiaVigente: item.garantiaVigente || false,
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

    let updated;
    if (editingItem) {
      updated = localInventario.map(i => {
        if ((i.invRedId || i.tempId) === (editingItem.invRedId || editingItem.tempId)) {
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

  const estados = [
    { value: 'Operativo', label: 'Operativo' },
    { value: 'En mantenimiento', label: 'En mantenimiento' },
    { value: 'Dañado', label: 'Dañado' },
    { value: 'Dado de baja', label: 'Dado de baja' },
    { value: 'En reserva', label: 'En reserva' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-gray-800">Inventario de Equipos de Red</h4>
        {!viewMode && (
          <button
            onClick={handleAddItem}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
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
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N°</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serie</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Año</th>
              {!viewMode && (
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {localInventario.length === 0 ? (
              <tr>
                <td colSpan={viewMode ? 8 : 9} className="px-3 py-4 text-center text-gray-500">
                  No hay equipos de red registrados
                </td>
              </tr>
            ) : (
              localInventario.map((item, index) => {
                const itemId = item.invRedId || item.tempId;
                return (
                  <tr key={itemId} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm text-gray-500">{index + 1}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{item.tipoEquipo}</td>
                    <td className="px-3 py-2 text-sm text-gray-500">{item.marca}</td>
                    <td className="px-3 py-2 text-sm text-gray-500">{item.modelo}</td>
                    <td className="px-3 py-2 text-sm text-gray-500">{item.serie}</td>
                    <td className="px-3 py-2 text-sm text-gray-500">{item.ubicacion}</td>
                    <td className="px-3 py-2 text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.estado === 'Operativo' ? 'bg-green-100 text-green-800' :
                        item.estado === 'En mantenimiento' ? 'bg-yellow-100 text-yellow-800' :
                        item.estado === 'Dañado' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.estado}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-500">{item.anoAdquisicion}</td>
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
              {editingItem ? 'Editar Equipo de Red' : 'Agregar Equipo de Red'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Equipo *
                </label>
                <select
                  value={formItem.tipoEquipo}
                  onChange={(e) => setFormItem(prev => ({ ...prev, tipoEquipo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccione...</option>
                  {tiposEquipo.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                  <input
                    type="text"
                    value={formItem.marca}
                    onChange={(e) => setFormItem(prev => ({ ...prev, marca: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: Cisco, HP, Dell"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                  <input
                    type="text"
                    value={formItem.modelo}
                    onChange={(e) => setFormItem(prev => ({ ...prev, modelo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">N° Serie</label>
                  <input
                    type="text"
                    value={formItem.serie}
                    onChange={(e) => setFormItem(prev => ({ ...prev, serie: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                  <input
                    type="text"
                    value={formItem.ubicacion}
                    onChange={(e) => setFormItem(prev => ({ ...prev, ubicacion: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: Data Center, Piso 3"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    value={formItem.estado}
                    onChange={(e) => setFormItem(prev => ({ ...prev, estado: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccione...</option>
                    {estados.map(e => (
                      <option key={e.value} value={e.value}>{e.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Año Adquisición</label>
                  <input
                    type="number"
                    value={formItem.anoAdquisicion}
                    onChange={(e) => setFormItem(prev => ({ ...prev, anoAdquisicion: e.target.value }))}
                    min="2000"
                    max="2030"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="garantiaVigente"
                  checked={formItem.garantiaVigente}
                  onChange={(e) => setFormItem(prev => ({ ...prev, garantiaVigente: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="garantiaVigente" className="text-sm text-gray-700">
                  Garantía vigente
                </label>
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

export default InventarioRedTab;
