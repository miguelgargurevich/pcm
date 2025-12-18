import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Upload, Download, X } from 'lucide-react';

/**
 * Componente para gestionar el Portafolio de Proyectos
 */
const PortafolioProyectos = ({ proyectos = [], onProyectosChange, viewMode = false }) => {
  const [localProyectos, setLocalProyectos] = useState(proyectos);
  const [showModal, setShowModal] = useState(false);
  const [editingProyecto, setEditingProyecto] = useState(null);
  
  const [formProyecto, setFormProyecto] = useState({
    codigoProyecto: '',
    nombreProyecto: '',
    alcance: '',
    justificacion: '',
    tipoProyecto: '',
    objetivoEstrategico: '',
    objetivoGD: '',
    areaProy: '',
    areaEjecuta: '',
    tipoBeneficiario: '',
    etapaProyecto: '',
    ambitoProyecto: '',
    fechaInicio: '',
    fechaFin: '',
    fecIniReal: '',
    fecFinReal: '',
    estadoProyecto: false,
    alienadoPgd: '',
    accEst: '',
    informoAvance: false,
    porcentajeAvance: 0,
    observaciones: ''
  });

  useEffect(() => {
    setLocalProyectos(proyectos);
  }, [proyectos]);

  const generarCodigoProyecto = () => {
    const count = localProyectos.length + 1;
    const year = new Date().getFullYear();
    return `PP-${year}-${count.toString().padStart(3, '0')}`;
  };

  const handleAddProyecto = () => {
    setEditingProyecto(null);
    setFormProyecto({
      codigoProyecto: generarCodigoProyecto(),
      nombreProyecto: '',
      alcance: '',
      justificacion: '',
      tipoProyecto: '',
      objetivoEstrategico: '',
      objetivoGD: '',
      areaProy: '',
      areaEjecuta: '',
      tipoBeneficiario: '',
      etapaProyecto: '',
      ambitoProyecto: '',
      fechaInicio: '',
      fechaFin: '',
      fecIniReal: '',
      fecFinReal: '',
      estadoProyecto: false,
      alienadoPgd: '',
      accEst: '',
      informoAvance: false,
      porcentajeAvance: 0,
      observaciones: ''
    });
    setShowModal(true);
  };

  const handleEditProyecto = (proyecto) => {
    setEditingProyecto(proyecto);
    setFormProyecto({
      codigoProyecto: proyecto.codigoProyecto || '',
      nombreProyecto: proyecto.nombreProyecto || '',
      alcance: proyecto.alcance || '',
      justificacion: proyecto.justificacion || '',
      tipoProyecto: proyecto.tipoProyecto || '',
      objetivoEstrategico: proyecto.objetivoEstrategico || '',
      objetivoGD: proyecto.objetivoGD || '',
      areaProy: proyecto.areaProy || '',
      areaEjecuta: proyecto.areaEjecuta || '',
      tipoBeneficiario: proyecto.tipoBeneficiario || '',
      etapaProyecto: proyecto.etapaProyecto || '',
      ambitoProyecto: proyecto.ambitoProyecto || '',
      fechaInicio: proyecto.fechaInicio || '',
      fechaFin: proyecto.fechaFin || '',
      fecIniReal: proyecto.fecIniReal || '',
      fecFinReal: proyecto.fecFinReal || '',
      estadoProyecto: proyecto.estadoProyecto || false,
      alienadoPgd: proyecto.alienadoPgd || '',
      accEst: proyecto.accEst || '',
      informoAvance: proyecto.informoAvance || false,
      porcentajeAvance: proyecto.porcentajeAvance || 0,
      observaciones: proyecto.observaciones || ''
    });
    setShowModal(true);
  };

  const handleDeleteProyecto = (proyectoId) => {
    const updated = localProyectos.filter(p => (p.proyEntId || p.tempId) !== proyectoId);
    setLocalProyectos(updated);
    onProyectosChange(updated);
  };

  const handleSaveProyecto = () => {
    if (!formProyecto.nombreProyecto.trim()) return;

    let updated;
    if (editingProyecto) {
      updated = localProyectos.map(p => {
        if ((p.proyEntId || p.tempId) === (editingProyecto.proyEntId || editingProyecto.tempId)) {
          return { ...p, ...formProyecto };
        }
        return p;
      });
    } else {
      const newProyecto = {
        tempId: Date.now(),
        ...formProyecto,
        activo: true
      };
      updated = [...localProyectos, newProyecto];
    }

    setLocalProyectos(updated);
    onProyectosChange(updated);
    setShowModal(false);
  };

  const handleImportExcel = () => {
    // TODO: Implementar importación de Excel
    alert('Funcionalidad de importación de Excel en desarrollo');
  };

  const handleExportExcel = () => {
    // TODO: Implementar exportación a Excel
    alert('Funcionalidad de exportación a Excel en desarrollo');
  };

  const tiposProyecto = [
    { value: 'Infraestructura', label: 'Infraestructura TI' },
    { value: 'Software', label: 'Desarrollo de Software' },
    { value: 'Interoperabilidad', label: 'Interoperabilidad' },
    { value: 'Seguridad', label: 'Seguridad de la Información' },
    { value: 'Transformacion', label: 'Transformación Digital' },
    { value: 'Datos', label: 'Gestión de Datos' },
    { value: 'Capacitacion', label: 'Capacitación' },
    { value: 'Otro', label: 'Otro' }
  ];



  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-semibold text-gray-800">Portafolio de Proyectos</h3>
        <div className="flex items-center gap-2">
          {!viewMode && (
            <>
              <button
                onClick={handleImportExcel}
                className="flex items-center gap-2 px-3 py-1.5 text-gray-700 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Importar
              </button>
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-2 px-3 py-1.5 text-gray-700 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                Exportar
              </button>
              <button
                onClick={handleAddProyecto}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nuevo Proyecto
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabla de proyectos */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
              <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área</th>
              <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avance</th>
              <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inicio</th>
              <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fin</th>
              {!viewMode && (
                <th className="px-2 py-1.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {localProyectos.length === 0 ? (
              <tr>
                <td colSpan={viewMode ? 8 : 9} className="px-3 py-4 text-center text-gray-500">
                  No hay proyectos registrados
                </td>
              </tr>
            ) : (
              localProyectos.map((proyecto) => {
                const proyectoId = proyecto.proyEntId || proyecto.tempId;
                return (
                  <tr key={proyectoId} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm font-mono text-purple-600">{proyecto.codigoProyecto}</td>
                    <td className="px-2 py-1.5 text-xs text-gray-900">{proyecto.nombreProyecto}</td>
                    <td className="px-2 py-1.5 text-xs text-gray-500">{proyecto.tipoProyecto}</td>
                    <td className="px-2 py-1.5 text-xs text-gray-500">{proyecto.areaProy}</td>
                    <td className="px-3 py-2 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        proyecto.estadoProyecto ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {proyecto.estadoProyecto ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-2 py-1.5 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: `${proyecto.porcentajeAvance || 0}%` }}
                          />
                        </div>
                        <span className="text-xs">{proyecto.porcentajeAvance || 0}%</span>
                      </div>
                    </td>
                    <td className="px-2 py-1.5 text-xs text-gray-500">{proyecto.fechaInicio}</td>
                    <td className="px-2 py-1.5 text-xs text-gray-500">{proyecto.fechaFin}</td>
                    {!viewMode && (
                      <td className="px-3 py-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleEditProyecto(proyecto)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProyecto(proyectoId)}
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

      {/* Modal para Proyecto */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingProyecto ? 'Editar Proyecto' : 'Nuevo Proyecto'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-4 space-y-6">
              {/* Sección 1: Datos Básicos */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <h4 className="text-sm font-medium text-gray-900">Datos Básicos</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Código</label>
                    <input
                      type="text"
                      value={formProyecto.codigoProyecto}
                      disabled
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Nombre del Proyecto *</label>
                    <input
                      type="text"
                      value={formProyecto.nombreProyecto}
                      onChange={(e) => setFormProyecto(prev => ({ ...prev, nombreProyecto: e.target.value }))}
                      required
                      maxLength={150}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Alcance *</label>
                    <input
                      type="text"
                      value={formProyecto.alcance}
                      onChange={(e) => setFormProyecto(prev => ({ ...prev, alcance: e.target.value }))}
                      required
                      maxLength={240}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Descripción del alcance del proyecto"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Justificación *</label>
                    <input
                      type="text"
                      value={formProyecto.justificacion}
                      onChange={(e) => setFormProyecto(prev => ({ ...prev, justificacion: e.target.value }))}
                      required
                      maxLength={240}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Justificación del proyecto"
                    />
                  </div>
                </div>
              </div>

              {/* Sección 2: Clasificación */}
              <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                <h4 className="text-sm font-medium text-blue-900">🏷️ Clasificación</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Tipo de Proyecto *</label>
                    <select
                      value={formProyecto.tipoProyecto}
                      onChange={(e) => setFormProyecto(prev => ({ ...prev, tipoProyecto: e.target.value }))}
                      required
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">Seleccione...</option>
                      {tiposProyecto.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Etapa del Proyecto *</label>
                    <input
                      type="text"
                      value={formProyecto.etapaProyecto}
                      onChange={(e) => setFormProyecto(prev => ({ ...prev, etapaProyecto: e.target.value }))}
                      required
                      maxLength={100}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Ej: Diseño, Ejecución"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Ámbito *</label>
                    <input
                      type="text"
                      value={formProyecto.ambitoProyecto}
                      onChange={(e) => setFormProyecto(prev => ({ ...prev, ambitoProyecto: e.target.value }))}
                      required
                      maxLength={100}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Ej: Local, Nacional"
                    />
                  </div>
                </div>
              </div>

              {/* Sección 3: Áreas y Beneficiarios */}
              <div className="bg-green-50 p-4 rounded-lg space-y-3">
                <h4 className="text-sm font-medium text-green-900">🏢 Áreas y Beneficiarios</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Área del Proyecto *</label>
                    <input
                      type="text"
                      value={formProyecto.areaProy}
                      onChange={(e) => setFormProyecto(prev => ({ ...prev, areaProy: e.target.value }))}
                      required
                      maxLength={50}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Área responsable"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Área que Ejecuta *</label>
                    <input
                      type="text"
                      value={formProyecto.areaEjecuta}
                      onChange={(e) => setFormProyecto(prev => ({ ...prev, areaEjecuta: e.target.value }))}
                      required
                      maxLength={50}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Área ejecutora"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Tipo Beneficiario *</label>
                    <input
                      type="text"
                      value={formProyecto.tipoBeneficiario}
                      onChange={(e) => setFormProyecto(prev => ({ ...prev, tipoBeneficiario: e.target.value }))}
                      required
                      maxLength={100}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Ej: Ciudadanos, Personal"
                    />
                  </div>
                </div>
              </div>

              {/* Sección 4: Alineamiento Estratégico */}
              <div className="bg-purple-50 p-4 rounded-lg space-y-3">
                <h4 className="text-sm font-medium text-purple-900">🎯 Alineamiento Estratégico</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Objetivo Estratégico *</label>
                    <input
                      type="text"
                      value={formProyecto.objetivoEstrategico}
                      onChange={(e) => setFormProyecto(prev => ({ ...prev, objetivoEstrategico: e.target.value }))}
                      required
                      maxLength={100}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Ej: OE-01"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Objetivo GD *</label>
                    <input
                      type="text"
                      value={formProyecto.objetivoGD}
                      onChange={(e) => setFormProyecto(prev => ({ ...prev, objetivoGD: e.target.value }))}
                      required
                      maxLength={100}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Ej: OGD-01"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Alienado PGD *</label>
                    <input
                      type="text"
                      value={formProyecto.alienadoPgd}
                      onChange={(e) => setFormProyecto(prev => ({ ...prev, alienadoPgd: e.target.value }))}
                      required
                      maxLength={100}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Alienamiento con PGD"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Acción Estratégica *</label>
                  <input
                    type="text"
                    value={formProyecto.accEst}
                    onChange={(e) => setFormProyecto(prev => ({ ...prev, accEst: e.target.value }))}
                    required
                    maxLength={100}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Acción estratégica vinculada"
                  />
                </div>
              </div>

              {/* Sección 5: Fechas y Estado */}
              <div className="bg-yellow-50 p-4 rounded-lg space-y-3">
                <h4 className="text-sm font-medium text-yellow-900">📅 Cronograma y Estado</h4>
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Fecha Inicio Plan. *</label>
                    <input
                      type="date"
                      value={formProyecto.fechaInicio}
                      onChange={(e) => setFormProyecto(prev => ({ ...prev, fechaInicio: e.target.value }))}
                      required
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Fecha Fin Plan. *</label>
                    <input
                      type="date"
                      value={formProyecto.fechaFin}
                      onChange={(e) => setFormProyecto(prev => ({ ...prev, fechaFin: e.target.value }))}
                      min={formProyecto.fechaInicio || ''}
                      required
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    {formProyecto.fechaInicio && <p className="text-xs text-gray-500 mt-1">Debe ser mayor o igual a fecha inicio</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Fecha Inicio Real *</label>
                    <input
                      type="date"
                      value={formProyecto.fecIniReal}
                      onChange={(e) => setFormProyecto(prev => ({ ...prev, fecIniReal: e.target.value }))}
                      max={new Date().toISOString().split('T')[0]}
                      required
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">No puede ser una fecha futura</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Fecha Fin Real *</label>
                    <input
                      type="date"
                      value={formProyecto.fecFinReal}
                      onChange={(e) => setFormProyecto(prev => ({ ...prev, fecFinReal: e.target.value }))}
                      min={formProyecto.fecIniReal || ''}
                      max={new Date().toISOString().split('T')[0]}
                      required
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    {formProyecto.fecIniReal && <p className="text-xs text-gray-500 mt-1">Debe ser mayor o igual a fecha inicio real y no futura</p>}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="estadoProyecto"
                      checked={formProyecto.estadoProyecto}
                      onChange={(e) => setFormProyecto(prev => ({ ...prev, estadoProyecto: e.target.checked }))}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="estadoProyecto" className="text-sm font-medium text-gray-700">
                      Proyecto Activo
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="informoAvance"
                      checked={formProyecto.informoAvance}
                      onChange={(e) => setFormProyecto(prev => ({ ...prev, informoAvance: e.target.checked }))}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="informoAvance" className="text-sm font-medium text-gray-700">
                      Informó Avance
                    </label>
                  </div>
                </div>
              </div>

              {/* Porcentaje de Avance */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Porcentaje de Avance: {formProyecto.porcentajeAvance}%
                </label>
                <input
                  type="range"
                  value={formProyecto.porcentajeAvance}
                  onChange={(e) => setFormProyecto(prev => ({ ...prev, porcentajeAvance: parseInt(e.target.value) }))}
                  min="0"
                  max="100"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Observaciones */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Observaciones</label>
                <textarea
                  value={formProyecto.observaciones}
                  onChange={(e) => setFormProyecto(prev => ({ ...prev, observaciones: e.target.value }))}
                  rows={2}
                  maxLength={255}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveProyecto}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                {editingProyecto ? 'Guardar' : 'Agregar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortafolioProyectos;
