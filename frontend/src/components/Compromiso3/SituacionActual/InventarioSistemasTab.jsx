import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';

/**
 * Componente para gestionar el Inventario de Sistemas de Información
 */
const InventarioSistemasTab = ({ inventario = [], onInventarioChange, viewMode = false }) => {
  const [localInventario, setLocalInventario] = useState(inventario);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [formItem, setFormItem] = useState({
    nombreSistema: '',
    siglas: '',
    descripcion: '',
    tipoSistema: '',
    lenguajeProgramacion: '',
    baseDatos: '',
    plataforma: '',
    estadoSistema: '',
    anoImplementacion: '',
    responsable: '',
    url: '',
    observaciones: ''
  });

  useEffect(() => {
    setLocalInventario(inventario);
  }, [inventario]);

  const handleAddItem = () => {
    setEditingItem(null);
    setFormItem({
      nombreSistema: '',
      siglas: '',
      descripcion: '',
      tipoSistema: '',
      lenguajeProgramacion: '',
      baseDatos: '',
      plataforma: '',
      estadoSistema: '',
      anoImplementacion: '',
      responsable: '',
      url: '',
      observaciones: ''
    });
    setShowModal(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setFormItem({
      nombreSistema: item.nombreSistema || '',
      siglas: item.siglas || '',
      descripcion: item.descripcion || '',
      tipoSistema: item.tipoSistema || '',
      lenguajeProgramacion: item.lenguajeProgramacion || '',
      baseDatos: item.baseDatos || '',
      plataforma: item.plataforma || '',
      estadoSistema: item.estadoSistema || '',
      anoImplementacion: item.anoImplementacion || '',
      responsable: item.responsable || '',
      url: item.url || '',
      observaciones: item.observaciones || ''
    });
    setShowModal(true);
  };

  const handleDeleteItem = (itemId) => {
    const updated = localInventario.filter(i => (i.invSisId || i.tempId) !== itemId);
    setLocalInventario(updated);
    onInventarioChange(updated);
  };

  const handleSaveItem = () => {
    if (!formItem.nombreSistema.trim()) return;

    let updated;
    if (editingItem) {
      updated = localInventario.map(i => {
        if ((i.invSisId || i.tempId) === (editingItem.invSisId || editingItem.tempId)) {
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

  const tiposSistema = [
    { value: 'Administrativo', label: 'Administrativo' },
    { value: 'Misional', label: 'Misional' },
    { value: 'Soporte', label: 'Soporte' },
    { value: 'Interoperabilidad', label: 'Interoperabilidad' },
    { value: 'Web', label: 'Web' },
    { value: 'Móvil', label: 'Móvil' }
  ];

  const estadosSistema = [
    { value: 'En Producción', label: 'En Producción' },
    { value: 'En Desarrollo', label: 'En Desarrollo' },
    { value: 'En Mantenimiento', label: 'En Mantenimiento' },
    { value: 'Descontinuado', label: 'Descontinuado' },
    { value: 'Planificado', label: 'Planificado' }
  ];

  const plataformas = [
    { value: 'Web', label: 'Web' },
    { value: 'Desktop', label: 'Desktop' },
    { value: 'Móvil', label: 'Móvil' },
    { value: 'Híbrido', label: 'Híbrido' },
    { value: 'Cloud', label: 'Cloud' },
    { value: 'On-Premise', label: 'On-Premise' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-gray-800">Inventario de Sistemas de Información</h4>
        {!viewMode && (
          <button
            onClick={handleAddItem}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar Sistema
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N°</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Siglas</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plataforma</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Año</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsable</th>
              {!viewMode && (
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {localInventario.length === 0 ? (
              <tr>
                <td colSpan={viewMode ? 8 : 9} className="px-3 py-4 text-center text-gray-500">
                  No hay sistemas registrados
                </td>
              </tr>
            ) : (
              localInventario.map((item, index) => {
                const itemId = item.invSisId || item.tempId;
                return (
                  <tr key={itemId} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm text-gray-500">{index + 1}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{item.nombreSistema}</td>
                    <td className="px-3 py-2 text-sm text-gray-500">{item.siglas}</td>
                    <td className="px-3 py-2 text-sm text-gray-500">{item.tipoSistema}</td>
                    <td className="px-3 py-2 text-sm text-gray-500">{item.plataforma}</td>
                    <td className="px-3 py-2 text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.estadoSistema === 'En Producción' ? 'bg-green-100 text-green-800' :
                        item.estadoSistema === 'En Desarrollo' ? 'bg-yellow-100 text-yellow-800' :
                        item.estadoSistema === 'Descontinuado' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.estadoSistema}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-500">{item.anoImplementacion}</td>
                    <td className="px-3 py-2 text-sm text-gray-500">{item.responsable}</td>
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
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingItem ? 'Editar Sistema' : 'Agregar Sistema'}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Sistema *
                  </label>
                  <input
                    type="text"
                    value={formItem.nombreSistema}
                    onChange={(e) => setFormItem(prev => ({ ...prev, nombreSistema: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Siglas</label>
                  <input
                    type="text"
                    value={formItem.siglas}
                    onChange={(e) => setFormItem(prev => ({ ...prev, siglas: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={formItem.descripcion}
                  onChange={(e) => setFormItem(prev => ({ ...prev, descripcion: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Sistema</label>
                  <select
                    value={formItem.tipoSistema}
                    onChange={(e) => setFormItem(prev => ({ ...prev, tipoSistema: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccione...</option>
                    {tiposSistema.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plataforma</label>
                  <select
                    value={formItem.plataforma}
                    onChange={(e) => setFormItem(prev => ({ ...prev, plataforma: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccione...</option>
                    {plataformas.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    value={formItem.estadoSistema}
                    onChange={(e) => setFormItem(prev => ({ ...prev, estadoSistema: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccione...</option>
                    {estadosSistema.map(e => (
                      <option key={e.value} value={e.value}>{e.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lenguaje de Programación</label>
                  <input
                    type="text"
                    value={formItem.lenguajeProgramacion}
                    onChange={(e) => setFormItem(prev => ({ ...prev, lenguajeProgramacion: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: Java, Python, .NET"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Base de Datos</label>
                  <input
                    type="text"
                    value={formItem.baseDatos}
                    onChange={(e) => setFormItem(prev => ({ ...prev, baseDatos: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: PostgreSQL, MySQL, Oracle"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Año Implementación</label>
                  <input
                    type="number"
                    value={formItem.anoImplementacion}
                    onChange={(e) => setFormItem(prev => ({ ...prev, anoImplementacion: e.target.value }))}
                    min="1990"
                    max="2030"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                  <input
                    type="text"
                    value={formItem.responsable}
                    onChange={(e) => setFormItem(prev => ({ ...prev, responsable: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  type="url"
                  value={formItem.url}
                  onChange={(e) => setFormItem(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://..."
                />
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

export default InventarioSistemasTab;
