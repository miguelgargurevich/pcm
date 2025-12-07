import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Upload, Download } from 'lucide-react';

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
    descripcion: '',
    tipoProyecto: '',
    objetivoEstrategico: '',
    objetivoGD: '',
    responsable: '',
    presupuesto: '',
    fuenteFinanciamiento: '',
    fechaInicio: '',
    fechaFin: '',
    estado: '',
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
      descripcion: '',
      tipoProyecto: '',
      objetivoEstrategico: '',
      objetivoGD: '',
      responsable: '',
      presupuesto: '',
      fuenteFinanciamiento: '',
      fechaInicio: '',
      fechaFin: '',
      estado: '',
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
      descripcion: proyecto.descripcion || '',
      tipoProyecto: proyecto.tipoProyecto || '',
      objetivoEstrategico: proyecto.objetivoEstrategico || '',
      objetivoGD: proyecto.objetivoGD || '',
      responsable: proyecto.responsable || '',
      presupuesto: proyecto.presupuesto || '',
      fuenteFinanciamiento: proyecto.fuenteFinanciamiento || '',
      fechaInicio: proyecto.fechaInicio || '',
      fechaFin: proyecto.fechaFin || '',
      estado: proyecto.estado || '',
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

  const estadosProyecto = [
    { value: 'Planificado', label: 'Planificado' },
    { value: 'En ejecución', label: 'En ejecución' },
    { value: 'Pausado', label: 'Pausado' },
    { value: 'Completado', label: 'Completado' },
    { value: 'Cancelado', label: 'Cancelado' }
  ];

  const fuentesFinanciamiento = [
    { value: 'RO', label: 'Recursos Ordinarios (RO)' },
    { value: 'RDR', label: 'Recursos Directamente Recaudados (RDR)' },
    { value: 'ROOC', label: 'Recursos por Operaciones Oficiales de Crédito' },
    { value: 'Donaciones', label: 'Donaciones y Transferencias' },
    { value: 'Canon', label: 'Canon y Sobrecanon' },
    { value: 'Mixto', label: 'Mixto' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Portafolio de Proyectos</h3>
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
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsable</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avance</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inicio</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fin</th>
              {!viewMode && (
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
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
                    <td className="px-3 py-2 text-sm text-gray-900">{proyecto.nombreProyecto}</td>
                    <td className="px-3 py-2 text-sm text-gray-500">{proyecto.tipoProyecto}</td>
                    <td className="px-3 py-2 text-sm text-gray-500">{proyecto.responsable}</td>
                    <td className="px-3 py-2 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        proyecto.estado === 'Completado' ? 'bg-green-100 text-green-800' :
                        proyecto.estado === 'En ejecución' ? 'bg-blue-100 text-blue-800' :
                        proyecto.estado === 'Pausado' ? 'bg-yellow-100 text-yellow-800' :
                        proyecto.estado === 'Cancelado' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {proyecto.estado}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-500">
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
                    <td className="px-3 py-2 text-sm text-gray-500">{proyecto.fechaInicio}</td>
                    <td className="px-3 py-2 text-sm text-gray-500">{proyecto.fechaFin}</td>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingProyecto ? 'Editar Proyecto' : 'Nuevo Proyecto'}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código
                  </label>
                  <input
                    type="text"
                    value={formProyecto.codigoProyecto}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Proyecto *
                  </label>
                  <input
                    type="text"
                    value={formProyecto.nombreProyecto}
                    onChange={(e) => setFormProyecto(prev => ({ ...prev, nombreProyecto: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={formProyecto.descripcion}
                  onChange={(e) => setFormProyecto(prev => ({ ...prev, descripcion: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Proyecto</label>
                  <select
                    value={formProyecto.tipoProyecto}
                    onChange={(e) => setFormProyecto(prev => ({ ...prev, tipoProyecto: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Seleccione...</option>
                    {tiposProyecto.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                  <input
                    type="text"
                    value={formProyecto.responsable}
                    onChange={(e) => setFormProyecto(prev => ({ ...prev, responsable: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Objetivo Estratégico Vinculado</label>
                  <input
                    type="text"
                    value={formProyecto.objetivoEstrategico}
                    onChange={(e) => setFormProyecto(prev => ({ ...prev, objetivoEstrategico: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Ej: OE-01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Objetivo GD Vinculado</label>
                  <input
                    type="text"
                    value={formProyecto.objetivoGD}
                    onChange={(e) => setFormProyecto(prev => ({ ...prev, objetivoGD: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Ej: OGD-01"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Presupuesto (S/.)</label>
                  <input
                    type="number"
                    value={formProyecto.presupuesto}
                    onChange={(e) => setFormProyecto(prev => ({ ...prev, presupuesto: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    step="0.01"
                    min="0"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fuente de Financiamiento</label>
                  <select
                    value={formProyecto.fuenteFinanciamiento}
                    onChange={(e) => setFormProyecto(prev => ({ ...prev, fuenteFinanciamiento: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Seleccione...</option>
                    {fuentesFinanciamiento.map(f => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                  <input
                    type="date"
                    value={formProyecto.fechaInicio}
                    onChange={(e) => setFormProyecto(prev => ({ ...prev, fechaInicio: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
                  <input
                    type="date"
                    value={formProyecto.fechaFin}
                    onChange={(e) => setFormProyecto(prev => ({ ...prev, fechaFin: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    value={formProyecto.estado}
                    onChange={(e) => setFormProyecto(prev => ({ ...prev, estado: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Seleccione...</option>
                    {estadosProyecto.map(e => (
                      <option key={e.value} value={e.value}>{e.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                <textarea
                  value={formProyecto.observaciones}
                  onChange={(e) => setFormProyecto(prev => ({ ...prev, observaciones: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
