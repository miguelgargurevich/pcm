import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';

/**
 * Componente para gestionar el Inventario de Servidores
 */
const InventarioServidoresTab = ({ inventario = [], onInventarioChange, viewMode = false }) => {
  const [localInventario, setLocalInventario] = useState(inventario);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [formItem, setFormItem] = useState({
    nombreEquipo: '',
    tipoEquipo: '',
    estado: '',
    capa: '',
    propiedad: '',
    montaje: '',
    marcaCpu: '',
    modeloCpu: '',
    velocidadGhz: '',
    nucleos: '',
    memoriaGb: '',
    marcaMemoria: '',
    modeloMemoria: '',
    cantidadMemoria: '',
    costoMantenimientoAnual: '',
    observaciones: ''
  });

  useEffect(() => {
    setLocalInventario(inventario);
  }, [inventario]);

  const handleAddItem = () => {
    setEditingItem(null);
    setFormItem({
      nombreEquipo: '',
      tipoEquipo: '',
      estado: '',
      capa: '',
      propiedad: '',
      montaje: '',
      marcaCpu: '',
      modeloCpu: '',
      velocidadGhz: '',
      nucleos: '',
      memoriaGb: '',
      marcaMemoria: '',
      modeloMemoria: '',
      cantidadMemoria: '',
      costoMantenimientoAnual: '',
      observaciones: ''
    });
    setShowModal(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setFormItem({
      nombreEquipo: item.nombreEquipo || '',
      tipoEquipo: item.tipoEquipo || '',
      estado: item.estado || '',
      capa: item.capa || '',
      propiedad: item.propiedad || '',
      montaje: item.montaje || '',
      marcaCpu: item.marcaCpu || '',
      modeloCpu: item.modeloCpu || '',
      velocidadGhz: item.velocidadGhz || '',
      nucleos: item.nucleos || '',
      memoriaGb: item.memoriaGb || '',
      marcaMemoria: item.marcaMemoria || '',
      modeloMemoria: item.modeloMemoria || '',
      cantidadMemoria: item.cantidadMemoria || '',
      costoMantenimientoAnual: item.costoMantenimientoAnual || '',
      observaciones: item.observaciones || ''
    });
    setShowModal(true);
  };

  const handleDeleteItem = (itemId) => {
    const updated = localInventario.filter(i => (i.invServId || i.tempId) !== itemId);
    setLocalInventario(updated);
    onInventarioChange(updated);
  };

  const handleSaveItem = () => {
    if (!formItem.nombreEquipo.trim()) return;

    let updated;
    if (editingItem) {
      updated = localInventario.map(i => {
        if ((i.invServId || i.tempId) === (editingItem.invServId || editingItem.tempId)) {
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
    { value: 'Físico', label: 'Servidor Físico' },
    { value: 'Virtual', label: 'Servidor Virtual' },
    { value: 'Cloud', label: 'Servidor en Nube' }
  ];

  const capas = [
    { value: 'Aplicación', label: 'Aplicación' },
    { value: 'Base de Datos', label: 'Base de Datos' },
    { value: 'Web', label: 'Web' },
    { value: 'Correo', label: 'Correo' },
    { value: 'Archivos', label: 'Archivos' },
    { value: 'Backup', label: 'Backup' }
  ];

  const propiedades = [
    { value: 'Propio', label: 'Propio' },
    { value: 'Arrendado', label: 'Arrendado' },
    { value: 'Comodato', label: 'Comodato' }
  ];

  const montajes = [
    { value: 'Rack', label: 'Rack' },
    { value: 'Torre', label: 'Torre' },
    { value: 'Blade', label: 'Blade' }
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
        <h4 className="font-medium text-gray-800">Inventario de Servidores</h4>
        {!viewMode && (
          <button
            onClick={handleAddItem}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar Servidor
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N°</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capa</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPU</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RAM (GB)</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costo Mant.</th>
              {!viewMode && (
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {localInventario.length === 0 ? (
              <tr>
                <td colSpan={viewMode ? 8 : 9} className="px-3 py-4 text-center text-gray-500">
                  No hay servidores registrados
                </td>
              </tr>
            ) : (
              localInventario.map((item, index) => {
                const itemId = item.invServId || item.tempId;
                return (
                  <tr key={itemId} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm text-gray-500">{index + 1}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{item.nombreEquipo}</td>
                    <td className="px-3 py-2 text-sm text-gray-500">{item.tipoEquipo}</td>
                    <td className="px-3 py-2 text-sm text-gray-500">{item.capa}</td>
                    <td className="px-3 py-2 text-sm text-gray-500">{item.marcaCpu} {item.modeloCpu} @ {item.velocidadGhz}GHz ({item.nucleos} núcleos)</td>
                    <td className="px-3 py-2 text-sm text-gray-500">{item.memoriaGb}</td>
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
                    <td className="px-3 py-2 text-sm text-gray-500">S/ {parseFloat(item.costoMantenimientoAnual || 0).toFixed(2)}</td>
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
              {editingItem ? 'Editar Servidor' : 'Agregar Servidor'}
            </h3>
            <div className="space-y-6">
              {/* Sección: Datos Generales */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3 pb-2 border-b">📋 Datos Generales</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Equipo *</label>
                    <input
                      type="text"
                      value={formItem.nombreEquipo}
                      onChange={(e) => setFormItem(prev => ({ ...prev, nombreEquipo: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      maxLength="100"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Equipo *</label>
                      <select
                        value={formItem.tipoEquipo}
                        onChange={(e) => setFormItem(prev => ({ ...prev, tipoEquipo: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Seleccione...</option>
                        {tiposEquipo.map(t => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                      <select
                        value={formItem.estado}
                        onChange={(e) => setFormItem(prev => ({ ...prev, estado: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Seleccione...</option>
                        {estados.map(e => (
                          <option key={e.value} value={e.value}>{e.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Capa *</label>
                      <select
                        value={formItem.capa}
                        onChange={(e) => setFormItem(prev => ({ ...prev, capa: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Seleccione...</option>
                        {capas.map(c => (
                          <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Propiedad *</label>
                      <select
                        value={formItem.propiedad}
                        onChange={(e) => setFormItem(prev => ({ ...prev, propiedad: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Seleccione...</option>
                        {propiedades.map(p => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Montaje *</label>
                      <select
                        value={formItem.montaje}
                        onChange={(e) => setFormItem(prev => ({ ...prev, montaje: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Seleccione...</option>
                        {montajes.map(m => (
                          <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección: Hardware - CPU */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3 pb-2 border-b">💻 Hardware - Procesador (CPU)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marca CPU *</label>
                    <input
                      type="text"
                      value={formItem.marcaCpu}
                      onChange={(e) => setFormItem(prev => ({ ...prev, marcaCpu: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: Intel, AMD"
                      maxLength="50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Modelo CPU *</label>
                    <input
                      type="text"
                      value={formItem.modeloCpu}
                      onChange={(e) => setFormItem(prev => ({ ...prev, modeloCpu: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: Xeon E5-2680 v4"
                      maxLength="50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Velocidad (GHz) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formItem.velocidadGhz}
                      onChange={(e) => setFormItem(prev => ({ ...prev, velocidadGhz: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: 2.40"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Núcleos *</label>
                    <input
                      type="number"
                      min="1"
                      value={formItem.nucleos}
                      onChange={(e) => setFormItem(prev => ({ ...prev, nucleos: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: 14"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Sección: Hardware - Memoria */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3 pb-2 border-b">🧠 Hardware - Memoria (RAM)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Memoria Total (GB) *</label>
                    <input
                      type="number"
                      min="0"
                      value={formItem.memoriaGb}
                      onChange={(e) => setFormItem(prev => ({ ...prev, memoriaGb: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: 64"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad de Módulos *</label>
                    <input
                      type="number"
                      min="1"
                      value={formItem.cantidadMemoria}
                      onChange={(e) => setFormItem(prev => ({ ...prev, cantidadMemoria: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: 4"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marca Memoria *</label>
                    <input
                      type="text"
                      value={formItem.marcaMemoria}
                      onChange={(e) => setFormItem(prev => ({ ...prev, marcaMemoria: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: Kingston, Samsung"
                      maxLength="50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Modelo Memoria *</label>
                    <input
                      type="text"
                      value={formItem.modeloMemoria}
                      onChange={(e) => setFormItem(prev => ({ ...prev, modeloMemoria: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: DDR4-2666 ECC"
                      maxLength="50"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Sección: Costos */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3 pb-2 border-b">💰 Costos</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Costo Mantenimiento Anual (S/) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formItem.costoMantenimientoAnual}
                    onChange={(e) => setFormItem(prev => ({ ...prev, costoMantenimientoAnual: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              {/* Observaciones */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                <textarea
                  value={formItem.observaciones}
                  onChange={(e) => setFormItem(prev => ({ ...prev, observaciones: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  maxLength="255"
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

export default InventarioServidoresTab;
