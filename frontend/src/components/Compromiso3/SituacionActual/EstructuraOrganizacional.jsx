import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';

/**
 * Componente para gestionar la Estructura Organizacional del área de TI
 * Incluye datos del header y grilla de personal
 */
const EstructuraOrganizacional = ({ 
  headerData = {}, 
  personalTI = [], 
  onHeaderChange, 
  onPersonalChange, 
  viewMode = false 
}) => {
  const [localHeader, setLocalHeader] = useState(headerData);
  const [localPersonal, setLocalPersonal] = useState(personalTI);
  const [showModal, setShowModal] = useState(false);
  const [editingPersonal, setEditingPersonal] = useState(null);
  
  const [formPersonal, setFormPersonal] = useState({
    apellidosNombres: '',
    dni: '',
    cargo: '',
    regimen: '',
    condicion: '',
    correo: ''
  });

  useEffect(() => {
    setLocalHeader(headerData);
  }, [headerData]);

  useEffect(() => {
    setLocalPersonal(personalTI);
  }, [personalTI]);

  const handleHeaderFieldChange = (field, value) => {
    const updated = { ...localHeader, [field]: value };
    setLocalHeader(updated);
    onHeaderChange(updated);
  };

  const handleAddPersonal = () => {
    setEditingPersonal(null);
    setFormPersonal({
      apellidosNombres: '',
      dni: '',
      cargo: '',
      regimen: '',
      condicion: '',
      correo: ''
    });
    setShowModal(true);
  };

  const handleEditPersonal = (personal) => {
    setEditingPersonal(personal);
    setFormPersonal({
      apellidosNombres: personal.apellidosNombres || '',
      dni: personal.dni || '',
      cargo: personal.cargo || '',
      regimen: personal.regimen || '',
      condicion: personal.condicion || '',
      correo: personal.correo || ''
    });
    setShowModal(true);
  };

  const handleDeletePersonal = (personalId) => {
    const updated = localPersonal.filter(p => (p.pTiId || p.tempId) !== personalId);
    setLocalPersonal(updated);
    onPersonalChange(updated);
  };

  const handleSavePersonal = () => {
    if (!formPersonal.apellidosNombres.trim()) return;

    let updated;
    if (editingPersonal) {
      updated = localPersonal.map(p => {
        if ((p.pTiId || p.tempId) === (editingPersonal.pTiId || editingPersonal.tempId)) {
          return { ...p, ...formPersonal };
        }
        return p;
      });
    } else {
      const newPersonal = {
        tempId: Date.now(),
        ...formPersonal,
        activo: true
      };
      updated = [...localPersonal, newPersonal];
    }

    setLocalPersonal(updated);
    onPersonalChange(updated);
    setShowModal(false);
  };

  const regimenes = [
    { value: '276', label: 'D.L. 276' },
    { value: '728', label: 'D.L. 728' },
    { value: '1057', label: 'D.L. 1057 (CAS)' },
    { value: '30057', label: 'Ley 30057 (SERVIR)' },
    { value: 'FAG', label: 'FAG' },
    { value: 'Otro', label: 'Otro' }
  ];

  const condiciones = [
    { value: 'Nombrado', label: 'Nombrado' },
    { value: 'Contratado', label: 'Contratado' },
    { value: 'Locador', label: 'Locador' },
    { value: 'Practicante', label: 'Practicante' }
  ];

  return (
    <div className="space-y-6">
      {/* Header - Datos de la Estructura Organizacional */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-4">Datos del Área de TI / Gobierno Digital</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Área responsable de TI / GD
            </label>
            <input
              type="text"
              value={localHeader.areaResponsable || ''}
              onChange={(e) => handleHeaderFieldChange('areaResponsable', e.target.value)}
              disabled={viewMode}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              placeholder="Ej: Oficina de Tecnologías de la Información"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de órgano
            </label>
            <select
              value={localHeader.tipoOrgano || ''}
              onChange={(e) => handleHeaderFieldChange('tipoOrgano', e.target.value)}
              disabled={viewMode}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            >
              <option value="">Seleccione...</option>
              <option value="Alta Direccion">Alta Dirección</option>
              <option value="Organo de Linea">Órgano de Línea</option>
              <option value="Organo de Apoyo">Órgano de Apoyo</option>
              <option value="Organo de Asesoramiento">Órgano de Asesoramiento</option>
              <option value="Organo Desconcentrado">Órgano Desconcentrado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Responsable del área
            </label>
            <input
              type="text"
              value={localHeader.responsableArea || ''}
              onChange={(e) => handleHeaderFieldChange('responsableArea', e.target.value)}
              disabled={viewMode}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              placeholder="Nombre del responsable"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo del responsable
            </label>
            <input
              type="email"
              value={localHeader.correoResponsable || ''}
              onChange={(e) => handleHeaderFieldChange('correoResponsable', e.target.value)}
              disabled={viewMode}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              placeholder="correo@entidad.gob.pe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="text"
              value={localHeader.telefonoResponsable || ''}
              onChange={(e) => handleHeaderFieldChange('telefonoResponsable', e.target.value)}
              disabled={viewMode}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              placeholder="999 999 999"
            />
          </div>
        </div>
      </div>

      {/* Grid de Personal */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium text-gray-800">Personal del Área de TI</h4>
          {!viewMode && (
            <button
              onClick={handleAddPersonal}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Agregar Personal
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N°</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellidos y Nombres</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DNI</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Régimen</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condición</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
                {!viewMode && (
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {localPersonal.length === 0 ? (
                <tr>
                  <td colSpan={viewMode ? 7 : 8} className="px-3 py-4 text-center text-gray-500">
                    No hay personal registrado
                  </td>
                </tr>
              ) : (
                localPersonal.map((personal, index) => {
                  const personalId = personal.pTiId || personal.tempId;
                  return (
                    <tr key={personalId} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-sm text-gray-500">{index + 1}</td>
                      <td className="px-3 py-2 text-sm text-gray-900">{personal.apellidosNombres}</td>
                      <td className="px-3 py-2 text-sm text-gray-500">{personal.dni}</td>
                      <td className="px-3 py-2 text-sm text-gray-500">{personal.cargo}</td>
                      <td className="px-3 py-2 text-sm text-gray-500">{personal.regimen}</td>
                      <td className="px-3 py-2 text-sm text-gray-500">{personal.condicion}</td>
                      <td className="px-3 py-2 text-sm text-gray-500">{personal.correo}</td>
                      {!viewMode && (
                        <td className="px-3 py-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleEditPersonal(personal)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              title="Editar"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePersonal(personalId)}
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

      {/* Modal para Personal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">
              {editingPersonal ? 'Editar Personal' : 'Agregar Personal'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellidos y Nombres *
                </label>
                <input
                  type="text"
                  value={formPersonal.apellidosNombres}
                  onChange={(e) => setFormPersonal(prev => ({ ...prev, apellidosNombres: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">DNI</label>
                  <input
                    type="text"
                    value={formPersonal.dni}
                    onChange={(e) => setFormPersonal(prev => ({ ...prev, dni: e.target.value }))}
                    maxLength={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                  <input
                    type="text"
                    value={formPersonal.cargo}
                    onChange={(e) => setFormPersonal(prev => ({ ...prev, cargo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Régimen</label>
                  <select
                    value={formPersonal.regimen}
                    onChange={(e) => setFormPersonal(prev => ({ ...prev, regimen: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccione...</option>
                    {regimenes.map(r => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condición</label>
                  <select
                    value={formPersonal.condicion}
                    onChange={(e) => setFormPersonal(prev => ({ ...prev, condicion: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccione...</option>
                    {condiciones.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                <input
                  type="email"
                  value={formPersonal.correo}
                  onChange={(e) => setFormPersonal(prev => ({ ...prev, correo: e.target.value }))}
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
                onClick={handleSavePersonal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingPersonal ? 'Guardar' : 'Agregar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstructuraOrganizacional;
