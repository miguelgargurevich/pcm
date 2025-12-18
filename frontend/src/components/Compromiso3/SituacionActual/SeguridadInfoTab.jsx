import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Shield, X } from 'lucide-react';

/**
 * Componente para gestionar la Seguridad de la Información
 * Incluye checkboxes de evaluación y grilla de capacitaciones
 */
const SeguridadInfoTab = ({ 
  seguridadInfo = {}, 
  capacitacionesSeginfo = [], 
  onSeguridadChange, 
  viewMode = false 
}) => {
  const [localSeguridad, setLocalSeguridad] = useState(seguridadInfo);
  const [localCapacitaciones, setLocalCapacitaciones] = useState(capacitacionesSeginfo);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [formItem, setFormItem] = useState({
    curso: '',
    cantidadPersonas: ''
  });

  useEffect(() => {
    setLocalSeguridad(seguridadInfo);
  }, [seguridadInfo]);

  useEffect(() => {
    setLocalCapacitaciones(capacitacionesSeginfo);
  }, [capacitacionesSeginfo]);

  // Checkboxes de evaluación de seguridad - Nombres deben coincidir con el backend
  const checkboxOptions = [
    { key: 'planSgsi', label: '¿Cuenta con Sistema de Gestión de Seguridad de la Información (SGSI)?' },
    { key: 'comiteSeguridad', label: '¿Cuenta con Comité de Seguridad de la Información?' },
    { key: 'oficialSeguridadEnOrganigrama', label: '¿Cuenta con Oficial de Seguridad de la Información en el organigrama?' },
    { key: 'politicaSeguridad', label: '¿Cuenta con Política de Seguridad de la Información?' },
    { key: 'inventarioActivos', label: '¿Cuenta con inventario de activos de información?' },
    { key: 'analisisRiesgos', label: '¿Realiza análisis de riesgos de seguridad de la información?' },
    { key: 'metodologiaRiesgos', label: '¿Cuenta con metodología de evaluación de riesgos?' },
    { key: 'planContinuidad', label: '¿Cuenta con Plan de Continuidad/Contingencia de TI?' },
    { key: 'programaAuditorias', label: '¿Cuenta con programa de auditorías de seguridad?' },
    { key: 'informesDireccion', label: '¿Emite informes periódicos de seguridad a la dirección?' },
    { key: 'certificacionIso27001', label: '¿Cuenta con certificación ISO 27001?' }
  ];

  const handleCheckboxChange = (key, value) => {
    const updated = { ...localSeguridad, [key]: value };
    setLocalSeguridad(updated);
    onSeguridadChange({
      seguridadInfo: updated,
      capacitacionesSeginfo: localCapacitaciones
    });
  };

  const handleAddCapacitacion = () => {
    setEditingItem(null);
    setFormItem({
      curso: '',
      cantidadPersonas: ''
    });
    setShowModal(true);
  };

  const handleEditCapacitacion = (item) => {
    setEditingItem(item);
    setFormItem({
      curso: item.curso || '',
      cantidadPersonas: item.cantidadPersonas || ''
    });
    setShowModal(true);
  };

  const handleDeleteCapacitacion = (itemId) => {
    const updated = localCapacitaciones.filter(c => (c.capSegId || c.tempId) !== itemId);
    setLocalCapacitaciones(updated);
    onSeguridadChange({
      seguridadInfo: localSeguridad,
      capacitacionesSeginfo: updated
    });
  };

  const handleSaveCapacitacion = () => {
    if (!formItem.curso.trim()) return;

    let updated;
    if (editingItem) {
      updated = localCapacitaciones.map(c => {
        if ((c.capSegId || c.tempId) === (editingItem.capSegId || editingItem.tempId)) {
          return { ...c, ...formItem };
        }
        return c;
      });
    } else {
      const newItem = {
        tempId: Date.now(),
        ...formItem,
        activo: true
      };
      updated = [...localCapacitaciones, newItem];
    }

    setLocalCapacitaciones(updated);
    onSeguridadChange({
      seguridadInfo: localSeguridad,
      capacitacionesSeginfo: updated
    });
    setShowModal(false);
  };

  

  return (
    <div className="space-y-6">
      {/* Sección de Evaluación de Seguridad */}
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-blue-600" />
          <h4 className="font-medium text-gray-800">Evaluación de Seguridad de la Información</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {checkboxOptions.map((option) => (
            <div key={option.key} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={option.key}
                checked={localSeguridad[option.key] || false}
                onChange={(e) => handleCheckboxChange(option.key, e.target.checked)}
                disabled={viewMode}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
              />
              <label 
                htmlFor={option.key} 
                className={`text-sm ${viewMode ? 'text-gray-500' : 'text-gray-700'}`}
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>

        {/* Campo adicional para observaciones de seguridad */}
        <div className="mt-4">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Observaciones de Seguridad
          </label>
          <textarea
            value={localSeguridad.observaciones || ''}
            onChange={(e) => handleCheckboxChange('observaciones', e.target.value)}
            disabled={viewMode}
            rows={3}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            placeholder="Observaciones adicionales sobre la seguridad de la información..."
          />
        </div>
      </div>

      {/* Sección de Capacitaciones */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium text-gray-800">Capacitaciones en Seguridad de la Información</h4>
          {!viewMode && (
            <button
              onClick={handleAddCapacitacion}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Agregar Capacitación
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N°</th>
                <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Curso de Capacitación</th>
                <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad de Personas</th>
                {!viewMode && (
                  <th className="px-2 py-1.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {localCapacitaciones.length === 0 ? (
                <tr>
                  <td colSpan={viewMode ? 3 : 4} className="px-3 py-4 text-center text-gray-500">
                    No hay capacitaciones registradas
                  </td>
                </tr>
              ) : (
                localCapacitaciones.map((item, index) => {
                  const itemId = item.capSegId || item.tempId;
                  return (
                    <tr key={itemId} className="hover:bg-gray-50">
                      <td className="px-2 py-1.5 text-xs text-gray-500">{index + 1}</td>
                      <td className="px-2 py-1.5 text-xs text-gray-900">{item.curso}</td>
                      <td className="px-2 py-1.5 text-xs text-gray-500 text-center font-medium">{item.cantidadPersonas}</td>
                      {!viewMode && (
                        <td className="px-3 py-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleEditCapacitacion(item)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              title="Editar"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCapacitacion(itemId)}
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
      </div>

      {/* Modal para Capacitación */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-semibold mb-4">
              {editingItem ? 'Editar Capacitación' : 'Agregar Capacitación'}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Curso de Capacitación *
                </label>
                <input
                  type="text"
                  value={formItem.curso}
                  onChange={(e) => setFormItem(prev => ({ ...prev, curso: e.target.value }))}
                  required
                  maxLength={100}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Curso de Ciberseguridad Básica"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Cantidad de Personas *
                </label>
                <input
                  type="number"
                  value={formItem.cantidadPersonas}
                  onChange={(e) => setFormItem(prev => ({ ...prev, cantidadPersonas: e.target.value }))}
                  required
                  min="1"
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Número de personas capacitadas"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveCapacitacion}
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

export default SeguridadInfoTab;
