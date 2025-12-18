import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X } from 'lucide-react';

// Constantes fuera del componente para evitar recreación en cada render
const rolesPersonal = [
  { value: 'Analista', label: 'Analista' },
  { value: 'Desarrollador', label: 'Desarrollador' },
  { value: 'Administrador', label: 'Administrador' },
  { value: 'Soporte Técnico', label: 'Soporte Técnico' },
  { value: 'Jefe de Área', label: 'Jefe de Área' },
  { value: 'Especialista', label: 'Especialista' },
  { value: 'Otro', label: 'Otro' }
];

const gradosInstruccion = [
  { value: 'Técnico', label: 'Técnico' },
  { value: 'Bachiller', label: 'Bachiller' },
  { value: 'Licenciado', label: 'Licenciado' },
  { value: 'Magister', label: 'Magíster' },
  { value: 'Doctor', label: 'Doctor' }
];

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
    nombrePersona: '',
    dni: '',
    cargo: '',
    rol: '',
    especialidad: '',
    gradoInstruccion: '',
    certificacion: '',
    acreditadora: '',
    codigoCertificacion: '',
    colegiatura: '',
    emailPersonal: '',
    telefono: ''
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
      nombrePersona: '',
      dni: '',
      cargo: '',
      rol: '',
      especialidad: '',
      gradoInstruccion: '',
      certificacion: '',
      acreditadora: '',
      codigoCertificacion: '',
      colegiatura: '',
      emailPersonal: '',
      telefono: ''
    });
    setShowModal(true);
  };

  const handleEditPersonal = (personal) => {
    setEditingPersonal(personal);
    setFormPersonal({
      nombrePersona: personal.nombrePersona || '',
      dni: personal.dni || '',
      cargo: personal.cargo || '',
      rol: personal.rol || '',
      especialidad: personal.especialidad || '',
      gradoInstruccion: personal.gradoInstruccion || '',
      certificacion: personal.certificacion || '',
      acreditadora: personal.acreditadora || '',
      codigoCertificacion: personal.codigoCertificacion || '',
      colegiatura: personal.colegiatura || '',
      emailPersonal: personal.emailPersonal || '',
      telefono: personal.telefono || ''
    });
    setShowModal(true);
  };

  const handleDeletePersonal = (personalId) => {
    const updated = localPersonal.filter(p => (p.personalId || p.tempId) !== personalId);
    setLocalPersonal(updated);
    onPersonalChange(updated);
  };

  const handleSavePersonal = () => {
    if (!formPersonal.nombrePersona.trim()) return;

    let updated;
    if (editingPersonal) {
      updated = localPersonal.map(p => {
        if ((p.personalId || p.tempId) === (editingPersonal.personalId || editingPersonal.tempId)) {
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

  return (
    <div className="space-y-3">
      {/* Header - Datos Generales Obligatorios */}
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
        <h4 className="font-medium text-gray-800 mb-3 text-sm">Datos Generales (Obligatorios)</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Fecha de Reporte *
            </label>
            <input
              type="date"
              value={localHeader.fechaReporte || ''}
              onChange={(e) => handleHeaderFieldChange('fechaReporte', e.target.value)}
              disabled={viewMode}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              required
            />
            <p className="text-xs text-gray-500 mt-0.5">No puede ser una fecha futura</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Sede *
            </label>
            <input
              type="text"
              value={localHeader.sede || ''}
              onChange={(e) => handleHeaderFieldChange('sede', e.target.value)}
              disabled={viewMode}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              placeholder="Sede principal de la entidad"
              maxLength="100"
              required
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Ubicación Área TI *
            </label>
            <input
              type="text"
              value={localHeader.ubicacionAreaTi || ''}
              onChange={(e) => handleHeaderFieldChange('ubicacionAreaTi', e.target.value)}
              disabled={viewMode}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              placeholder="Ubicación física del área"
              maxLength="255"
              required
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Observaciones Generales *
          </label>
          <textarea
            value={localHeader.observaciones || ''}
            onChange={(e) => handleHeaderFieldChange('observaciones', e.target.value)}
            disabled={viewMode}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            placeholder="Observaciones o comentarios generales sobre el área de TI"
            rows="3"
            maxLength="255"
            required
          />
        </div>
      </div>

      {/* Header - Datos del Área de TI */}
      <div className="bg-gray-50 p-3 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-2 text-sm">Datos del Área de TI / Gobierno Digital</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Dependencia del Área TI *
            </label>
            <input
              type="text"
              value={localHeader.dependenciaAreaTi || ''}
              onChange={(e) => handleHeaderFieldChange('dependenciaAreaTi', e.target.value)}
              disabled={viewMode}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              placeholder="Ej: Gerencia General, Secretaría General"
              maxLength="100"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Costo Anual TI (S/) *
            </label>
            <input
              type="number"
              step="0.01"
              value={localHeader.costoAnualTi || ''}
              onChange={(e) => handleHeaderFieldChange('costoAnualTi', parseFloat(e.target.value))}
              disabled={viewMode}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              placeholder="0.00"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={localHeader.existeComisionGdTi || false}
                onChange={(e) => handleHeaderFieldChange('existeComisionGdTi', e.target.checked)}
                disabled={viewMode}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              ¿Existe Comisión de Gobierno Digital / TI? *
            </label>
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
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N°</th>
                <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Completo</th>
                <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DNI</th>
                <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo</th>
                <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Especialidad</th>
                <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                {!viewMode && (
                  <th className="px-2 py-1.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {localPersonal.length === 0 ? (
                <tr>
                  <td colSpan={viewMode ? 8 : 9} className="px-3 py-4 text-center text-gray-500">
                    No hay personal registrado
                  </td>
                </tr>
              ) : (
                localPersonal.map((personal, index) => {
                  const personalId = personal.personalId || personal.tempId;
                  return (
                    <tr key={personalId} className="hover:bg-gray-50">
                      <td className="px-2 py-1.5 text-xs text-gray-500">{index + 1}</td>
                      <td className="px-2 py-1.5 text-xs text-gray-900">{personal.nombrePersona}</td>
                      <td className="px-2 py-1.5 text-xs text-gray-500">{personal.dni}</td>
                      <td className="px-2 py-1.5 text-xs text-gray-500">{personal.cargo}</td>
                      <td className="px-2 py-1.5 text-xs text-gray-500">{personal.rol}</td>
                      <td className="px-2 py-1.5 text-xs text-gray-500">{personal.especialidad}</td>
                      <td className="px-2 py-1.5 text-xs text-gray-500">{personal.emailPersonal}</td>
                      <td className="px-2 py-1.5 text-xs text-gray-500">{personal.telefono}</td>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
              <h3 className="text-base font-semibold text-gray-900">
                {editingPersonal ? 'Editar Personal' : 'Agregar Personal'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  value={formPersonal.nombrePersona}
                  onChange={(e) => setFormPersonal(prev => ({ ...prev, nombrePersona: e.target.value }))}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  maxLength="100"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">DNI *</label>
                  <input
                    type="text"
                    value={formPersonal.dni}
                    onChange={(e) => setFormPersonal(prev => ({ ...prev, dni: e.target.value }))}
                    maxLength="12"
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Cargo *</label>
                  <input
                    type="text"
                    value={formPersonal.cargo}
                    onChange={(e) => setFormPersonal(prev => ({ ...prev, cargo: e.target.value }))}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    maxLength="100"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Rol *</label>
                  <select
                    value={formPersonal.rol}
                    onChange={(e) => setFormPersonal(prev => ({ ...prev, rol: e.target.value }))}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option key="rol-empty" value="">Seleccione...</option>
                    {rolesPersonal.map(r => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Especialidad *</label>
                  <input
                    type="text"
                    value={formPersonal.especialidad}
                    onChange={(e) => setFormPersonal(prev => ({ ...prev, especialidad: e.target.value }))}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    maxLength="80"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Grado de Instrucción *</label>
                  <select
                    value={formPersonal.gradoInstruccion}
                    onChange={(e) => setFormPersonal(prev => ({ ...prev, gradoInstruccion: e.target.value }))}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option key="grado-empty" value="">Seleccione...</option>
                    {gradosInstruccion.map(g => (
                      <option key={g.value} value={g.value}>{g.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Certificación *</label>
                  <input
                    type="text"
                    value={formPersonal.certificacion}
                    onChange={(e) => setFormPersonal(prev => ({ ...prev, certificacion: e.target.value }))}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    maxLength="80"
                    placeholder="Ej: ITIL, PMP, COBIT"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Acreditadora *</label>
                  <input
                    type="text"
                    value={formPersonal.acreditadora}
                    onChange={(e) => setFormPersonal(prev => ({ ...prev, acreditadora: e.target.value }))}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    maxLength="80"
                    placeholder="Entidad que otorga la certificación"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Código Certificación *</label>
                  <input
                    type="text"
                    value={formPersonal.codigoCertificacion}
                    onChange={(e) => setFormPersonal(prev => ({ ...prev, codigoCertificacion: e.target.value }))}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    maxLength="50"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Colegiatura *</label>
                  <input
                    type="text"
                    value={formPersonal.colegiatura}
                    onChange={(e) => setFormPersonal(prev => ({ ...prev, colegiatura: e.target.value }))}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    maxLength="20"
                    placeholder="N° de colegiatura"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Teléfono *</label>
                  <input
                    type="text"
                    value={formPersonal.telefono}
                    onChange={(e) => setFormPersonal(prev => ({ ...prev, telefono: e.target.value }))}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    maxLength="30"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email Personal *</label>
                <input
                  type="email"
                  value={formPersonal.emailPersonal}
                  onChange={(e) => setFormPersonal(prev => ({ ...prev, emailPersonal: e.target.value }))}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  maxLength="100"
                  required
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
                onClick={handleSavePersonal}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
