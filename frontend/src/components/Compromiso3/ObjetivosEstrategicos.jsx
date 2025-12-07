import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Componente para gestionar Objetivos Estratégicos
 * @param {Array} objetivos - Lista de objetivos estratégicos
 * @param {Function} onObjetivosChange - Callback cuando cambian los objetivos
 * @param {boolean} viewMode - Modo solo lectura
 */
const ObjetivosEstrategicos = ({ objetivos = [], onObjetivosChange, viewMode = false }) => {
  const [localObjetivos, setLocalObjetivos] = useState(objetivos);
  const [showModal, setShowModal] = useState(false);
  const [showAccionModal, setShowAccionModal] = useState(false);
  const [editingObjetivo, setEditingObjetivo] = useState(null);
  const [editingAccion, setEditingAccion] = useState(null);
  const [currentObjetivoId, setCurrentObjetivoId] = useState(null);
  const [expandedObjetivos, setExpandedObjetivos] = useState({});
  
  const [formObjetivo, setFormObjetivo] = useState({
    descripcionObjetivo: ''
  });
  
  const [formAccion, setFormAccion] = useState({
    descripcionAccion: ''
  });

  useEffect(() => {
    setLocalObjetivos(objetivos);
  }, [objetivos]);

  // Generar código de objetivo automáticamente
  const generarCodigoObjetivo = () => {
    const count = localObjetivos.filter(o => o.tipoObj === 'E').length + 1;
    return `OE-${count.toString().padStart(2, '0')}`;
  };

  // Generar código de acción automáticamente
  const generarCodigoAccion = (objetivoId) => {
    const objetivo = localObjetivos.find(o => o.objEntId === objetivoId || o.tempId === objetivoId);
    if (!objetivo) return '';
    const acciones = objetivo.acciones || [];
    const count = acciones.length + 1;
    return `${objetivo.numeracionObj}.${count.toString().padStart(2, '0')}`;
  };

  const handleAddObjetivo = () => {
    setEditingObjetivo(null);
    setFormObjetivo({ descripcionObjetivo: '' });
    setShowModal(true);
  };

  const handleEditObjetivo = (objetivo) => {
    setEditingObjetivo(objetivo);
    setFormObjetivo({ descripcionObjetivo: objetivo.descripcionObjetivo || '' });
    setShowModal(true);
  };

  const handleDeleteObjetivo = (objetivoId) => {
    const updated = localObjetivos.filter(o => (o.objEntId || o.tempId) !== objetivoId);
    setLocalObjetivos(updated);
    onObjetivosChange(updated);
  };

  const handleSaveObjetivo = () => {
    if (!formObjetivo.descripcionObjetivo.trim()) return;

    let updated;
    if (editingObjetivo) {
      updated = localObjetivos.map(o => {
        if ((o.objEntId || o.tempId) === (editingObjetivo.objEntId || editingObjetivo.tempId)) {
          return { ...o, descripcionObjetivo: formObjetivo.descripcionObjetivo };
        }
        return o;
      });
    } else {
      const newObjetivo = {
        tempId: Date.now(),
        tipoObj: 'E',
        numeracionObj: generarCodigoObjetivo(),
        descripcionObjetivo: formObjetivo.descripcionObjetivo,
        acciones: [],
        activo: true
      };
      updated = [...localObjetivos, newObjetivo];
    }

    setLocalObjetivos(updated);
    onObjetivosChange(updated);
    setShowModal(false);
    setFormObjetivo({ descripcionObjetivo: '' });
  };

  const handleAddAccion = (objetivoId) => {
    setCurrentObjetivoId(objetivoId);
    setEditingAccion(null);
    setFormAccion({ descripcionAccion: '' });
    setShowAccionModal(true);
  };

  const handleEditAccion = (objetivoId, accion) => {
    setCurrentObjetivoId(objetivoId);
    setEditingAccion(accion);
    setFormAccion({ descripcionAccion: accion.descripcionAccion || '' });
    setShowAccionModal(true);
  };

  const handleDeleteAccion = (objetivoId, accionId) => {
    const updated = localObjetivos.map(o => {
      if ((o.objEntId || o.tempId) === objetivoId) {
        return {
          ...o,
          acciones: (o.acciones || []).filter(a => (a.accObjEntId || a.tempId) !== accionId)
        };
      }
      return o;
    });
    setLocalObjetivos(updated);
    onObjetivosChange(updated);
  };

  const handleSaveAccion = () => {
    if (!formAccion.descripcionAccion.trim()) return;

    const updated = localObjetivos.map(o => {
      if ((o.objEntId || o.tempId) === currentObjetivoId) {
        let newAcciones;
        if (editingAccion) {
          newAcciones = (o.acciones || []).map(a => {
            if ((a.accObjEntId || a.tempId) === (editingAccion.accObjEntId || editingAccion.tempId)) {
              return { ...a, descripcionAccion: formAccion.descripcionAccion };
            }
            return a;
          });
        } else {
          const newAccion = {
            tempId: Date.now(),
            numeracionAcc: generarCodigoAccion(currentObjetivoId),
            descripcionAccion: formAccion.descripcionAccion,
            activo: true
          };
          newAcciones = [...(o.acciones || []), newAccion];
        }
        return { ...o, acciones: newAcciones };
      }
      return o;
    });

    setLocalObjetivos(updated);
    onObjetivosChange(updated);
    setShowAccionModal(false);
    setFormAccion({ descripcionAccion: '' });
  };

  const toggleExpandObjetivo = (objetivoId) => {
    setExpandedObjetivos(prev => ({
      ...prev,
      [objetivoId]: !prev[objetivoId]
    }));
  };

  const objetivosEstrategicos = localObjetivos.filter(o => o.tipoObj === 'E');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Objetivos Estratégicos</h3>
        {!viewMode && (
          <button
            onClick={handleAddObjetivo}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo Objetivo
          </button>
        )}
      </div>

      {/* Listado de Objetivos */}
      <div className="space-y-3">
        {objetivosEstrategicos.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No hay objetivos estratégicos registrados</p>
        ) : (
          objetivosEstrategicos.map((objetivo) => {
            const objetivoId = objetivo.objEntId || objetivo.tempId;
            const isExpanded = expandedObjetivos[objetivoId] !== false;
            
            return (
              <div key={objetivoId} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {/* Header del objetivo */}
                <div className="flex items-center justify-between p-4 bg-gray-50">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => toggleExpandObjetivo(objetivoId)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                    <span className="font-mono text-blue-600 font-semibold">{objetivo.numeracionObj}</span>
                    <span className="text-gray-800">{objetivo.descripcionObjetivo}</span>
                  </div>
                  {!viewMode && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditObjetivo(objetivo)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Editar objetivo"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteObjetivo(objetivoId)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Eliminar objetivo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Acciones del objetivo */}
                {isExpanded && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="space-y-2 ml-8">
                      {(objetivo.acciones || []).map((accion) => {
                        const accionId = accion.accObjEntId || accion.tempId;
                        return (
                          <div key={accionId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-green-600 font-medium">{accion.numeracionAcc}</span>
                              <span className="text-gray-700">{accion.descripcionAccion}</span>
                            </div>
                            {!viewMode && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEditAccion(objetivoId, accion)}
                                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                  title="Editar acción"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteAccion(objetivoId, accionId)}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                                  title="Eliminar acción"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {!viewMode && (
                        <button
                          onClick={() => handleAddAccion(objetivoId)}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm mt-2"
                        >
                          <Plus className="w-4 h-4" />
                          Agregar acción
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal para Objetivo */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingObjetivo ? 'Editar Objetivo' : 'Nuevo Objetivo'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción del Objetivo *
                </label>
                <textarea
                  value={formObjetivo.descripcionObjetivo}
                  onChange={(e) => setFormObjetivo({ descripcionObjetivo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Describa el objetivo estratégico..."
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
                onClick={handleSaveObjetivo}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingObjetivo ? 'Guardar' : 'Agregar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Acción */}
      {showAccionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingAccion ? 'Editar Acción' : 'Nueva Acción'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción de la Acción *
                </label>
                <textarea
                  value={formAccion.descripcionAccion}
                  onChange={(e) => setFormAccion({ descripcionAccion: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Describa la acción para este objetivo..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAccionModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveAccion}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingAccion ? 'Guardar' : 'Agregar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ObjetivosEstrategicos;
