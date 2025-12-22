import { useState, useMemo } from 'react';
import { showSuccessToast } from '../utils/toast.jsx';
import { FilterX, X, Save, FolderKanban, TrendingUp, Edit2 } from 'lucide-react';

// Datos de ejemplo para el portafolio de proyectos
const proyectosIniciales = [
  {
    id: 1,
    codigo: 'PROY-001',
    nombre: 'Implementación de la Agencia Digital',
    tipoProyecto: 'SOFTWARE O APLICACIONES',
    tipoBeneficiario: 'EXTERNO',
    fechaInicioProg: '2024-02-29',
    fechaFinProg: '2024-09-29',
    fechaInicioReal: '2024-03-04',
    fechaFinReal: '2024-10-14',
    etapa: 'CERRADO',
    porcentajeAvance: 100,
    informeAvance: true,
    montoInversion: 450000,
    ambito: 'LOCAL'
  },
  {
    id: 2,
    codigo: 'PROY-002',
    nombre: 'Sistema de Gestión Documental',
    tipoProyecto: 'SOFTWARE O APLICACIONES',
    tipoBeneficiario: 'INTERNO',
    fechaInicioProg: '2024-05-31',
    fechaFinProg: '2024-12-30',
    fechaInicioReal: '2024-06-14',
    fechaFinReal: null,
    etapa: 'EJECUCIÓN',
    porcentajeAvance: 65,
    informeAvance: true,
    montoInversion: 280000,
    ambito: 'LOCAL'
  },
  {
    id: 3,
    codigo: 'PROY-003',
    nombre: 'Renovación de Infraestructura TI',
    tipoProyecto: 'RENOVACIÓN TECNOLÓGICA y/o INFRAESTRUCTURA',
    tipoBeneficiario: 'INTERNO',
    fechaInicioProg: '2025-01-14',
    fechaFinProg: '2025-06-29',
    fechaInicioReal: null,
    fechaFinReal: null,
    etapa: 'SIN INICIAR',
    porcentajeAvance: 0,
    informeAvance: false,
    montoInversion: 650000,
    ambito: 'LOCAL'
  },
  {
    id: 4,
    codigo: 'PROY-004',
    nombre: 'Plataforma de Servicios Ciudadanos',
    tipoProyecto: 'SOFTWARE O APLICACIONES',
    tipoBeneficiario: 'EXTERNO',
    fechaInicioProg: '2024-07-31',
    fechaFinProg: '2025-02-27',
    fechaInicioReal: '2024-08-09',
    fechaFinReal: null,
    etapa: 'PLANIFICACIÓN',
    porcentajeAvance: 25,
    informeAvance: true,
    montoInversion: 320000,
    ambito: 'REGIONAL'
  },
  {
    id: 5,
    codigo: 'PROY-005',
    nombre: 'Implementación de Metodología Ágil',
    tipoProyecto: 'IMPLEMENTACIÓN DE METODOLOGÍA',
    tipoBeneficiario: 'INTERNO',
    fechaInicioProg: '2024-09-30',
    fechaFinProg: '2025-03-30',
    fechaInicioReal: '2024-10-04',
    fechaFinReal: null,
    etapa: 'EJECUCIÓN',
    porcentajeAvance: 40,
    informeAvance: false,
    montoInversion: 180000,
    ambito: 'LOCAL'
  }
];

// Opciones para los selects
const etapasOptions = [
  'SIN INICIAR',
  'PLANIFICACIÓN',
  'EJECUCIÓN',
  'CERRADO'
];

const tiposProyectoOptions = [
  'SOFTWARE O APLICACIONES',
  'RENOVACIÓN TECNOLÓGICA y/o INFRAESTRUCTURA',
  'IMPLEMENTACIÓN DE METODOLOGÍA',
  'CAPACITACIÓN',
  'OTRO'
];

const tiposBeneficiarioOptions = ['INTERNO', 'EXTERNO'];
const ambitosOptions = ['LOCAL', 'REGIONAL', 'NACIONAL'];

const SeguimientoPGDPP = () => {
  const [proyectos, setProyectos] = useState(proyectosIniciales);
  const [loading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProyecto, setEditingProyecto] = useState(null);

  // Filtros
  const [filtros, setFiltros] = useState({
    codigo: '',
    nombre: '',
    etapa: '',
    tipoProyecto: '',
    ambito: ''
  });

  // Form data para el modal
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    tipoProyecto: '',
    tipoBeneficiario: '',
    fechaInicioProg: '',
    fechaFinProg: '',
    fechaInicioReal: '',
    fechaFinReal: '',
    etapa: '',
    porcentajeAvance: 0,
    informeAvance: false,
    montoInversion: 0,
    ambito: ''
  });

  // Aplicar filtros
  const proyectosFiltrados = useMemo(() => {
    let filtered = [...proyectos];

    if (filtros.codigo.trim()) {
      const busqueda = filtros.codigo.toLowerCase();
      filtered = filtered.filter((p) =>
        p.codigo?.toLowerCase().includes(busqueda)
      );
    }

    if (filtros.nombre.trim()) {
      const busqueda = filtros.nombre.toLowerCase();
      filtered = filtered.filter((p) =>
        p.nombre?.toLowerCase().includes(busqueda)
      );
    }

    if (filtros.etapa) {
      filtered = filtered.filter((p) => p.etapa === filtros.etapa);
    }

    if (filtros.tipoProyecto) {
      filtered = filtered.filter((p) => p.tipoProyecto === filtros.tipoProyecto);
    }

    if (filtros.ambito) {
      filtered = filtered.filter((p) => p.ambito === filtros.ambito);
    }

    return filtered;
  }, [proyectos, filtros]);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const limpiarFiltros = () => {
    setFiltros({ codigo: '', nombre: '', etapa: '', tipoProyecto: '', ambito: '' });
  };

  const handleRowClick = (proyecto) => {
    setEditingProyecto(proyecto);
    setFormData({
      codigo: proyecto.codigo || '',
      nombre: proyecto.nombre || '',
      tipoProyecto: proyecto.tipoProyecto || '',
      tipoBeneficiario: proyecto.tipoBeneficiario || '',
      fechaInicioProg: proyecto.fechaInicioProg || '',
      fechaFinProg: proyecto.fechaFinProg || '',
      fechaInicioReal: proyecto.fechaInicioReal || '',
      fechaFinReal: proyecto.fechaFinReal || '',
      etapa: proyecto.etapa || '',
      porcentajeAvance: proyecto.porcentajeAvance || 0,
      informeAvance: proyecto.informeAvance || false,
      montoInversion: proyecto.montoInversion || 0,
      ambito: proyecto.ambito || ''
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Actualizar el proyecto
    const proyectosActualizados = proyectos.map(p => {
      if (p.id === editingProyecto.id) {
        return {
          ...p,
          ...formData,
          porcentajeAvance: parseInt(formData.porcentajeAvance) || 0,
          montoInversion: parseFloat(formData.montoInversion) || 0
        };
      }
      return p;
    });

    setProyectos(proyectosActualizados);
    setShowModal(false);
    showSuccessToast('Proyecto actualizado exitosamente');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE');
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  const getEtapaBadgeClass = (etapa) => {
    switch (etapa) {
      case 'CERRADO':
        return 'bg-gray-100 text-gray-800';
      case 'EJECUCIÓN':
        return 'bg-blue-100 text-blue-800';
      case 'PLANIFICACIÓN':
        return 'bg-yellow-100 text-yellow-800';
      case 'SIN INICIAR':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary-100 rounded-xl">
            <TrendingUp className="w-8 h-8 text-primary-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Seguimiento PGD-PP</h1>
            <p className="text-gray-600 mt-1">Plan de Gobierno Digital - Portafolio de Proyectos</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código
            </label>
            <input
              type="text"
              name="codigo"
              value={filtros.codigo}
              onChange={handleFiltroChange}
              placeholder="Buscar código..."
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={filtros.nombre}
              onChange={handleFiltroChange}
              placeholder="Buscar nombre..."
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo Proyecto
            </label>
            <select
              name="tipoProyecto"
              value={filtros.tipoProyecto}
              onChange={handleFiltroChange}
              className="input-field"
            >
              <option value="">Todos los tipos</option>
              {tiposProyectoOptions.map((tipo) => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Etapa
            </label>
            <select
              name="etapa"
              value={filtros.etapa}
              onChange={handleFiltroChange}
              className="input-field"
            >
              <option value="">Todas las etapas</option>
              {etapasOptions.map((etapa) => (
                <option key={etapa} value={etapa}>{etapa}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ámbito
            </label>
            <select
              name="ambito"
              value={filtros.ambito}
              onChange={handleFiltroChange}
              className="input-field"
            >
              <option value="">Todos los ámbitos</option>
              {ambitosOptions.map((ambito) => (
                <option key={ambito} value={ambito}>{ambito}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600 mr-2">Etapas:</span>
            {etapasOptions.map((etapa) => (
              <span
                key={etapa}
                className={`px-2 py-1 text-xs font-semibold rounded-full ${getEtapaBadgeClass(etapa)}`}
              >
                {etapa}
              </span>
            ))}
          </div>
          <button
            onClick={limpiarFiltros}
            className="btn-secondary flex items-center gap-2 px-4 py-2"
            title="Limpiar filtros"
          >
            <FilterX size={20} />
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Panel de Lista - Portafolio de Proyectos */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FolderKanban size={20} />
            Portafolio de Proyectos ({proyectosFiltrados.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* Columnas sticky - con anchos fijos y posiciones calculadas */}
                <th className="sticky left-0 z-20 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 w-[60px] min-w-[60px] max-w-[60px]">
                  Id
                </th>
                <th className="sticky left-[60px] z-20 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 w-[100px] min-w-[100px] max-w-[100px]">
                  Código
                </th>
                <th className="sticky left-[160px] z-20 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 w-[250px] min-w-[250px] max-w-[250px]">
                  Nombre
                </th>
                {/* Columnas con scroll */}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Tipo Proyecto
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Tipo Beneficiario
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Fecha Inicio Prog.
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Fecha Fin Prog.
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Fecha Inicio Real
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Fecha Fin Real
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Etapa
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  % Avance
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Informe Avance
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Monto Inversión
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Ámbito
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {proyectosFiltrados.map((proyecto) => (
                <tr 
                  key={proyecto.id} 
                  className="hover:bg-gray-50 cursor-pointer group"
                  onClick={() => handleRowClick(proyecto)}
                >
                  {/* Columnas sticky - con anchos fijos y posiciones calculadas */}
                  <td className="sticky left-0 z-20 bg-white group-hover:bg-gray-50 px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200 w-[60px] min-w-[60px] max-w-[60px]">
                    {proyecto.id}
                  </td>
                  <td className="sticky left-[60px] z-20 bg-white group-hover:bg-gray-50 px-4 py-4 whitespace-nowrap text-sm font-medium text-primary border-r border-gray-200 w-[100px] min-w-[100px] max-w-[100px]">
                    {proyecto.codigo}
                  </td>
                  <td 
                    className="sticky left-[160px] z-20 bg-white group-hover:bg-gray-50 px-4 py-4 text-sm text-blue-600 hover:text-blue-800 hover:underline border-r border-gray-200 w-[250px] min-w-[250px] max-w-[250px] cursor-pointer"
                  >
                    {proyecto.nombre}
                  </td>
                  {/* Columnas con scroll */}
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {proyecto.tipoProyecto}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {proyecto.tipoBeneficiario}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(proyecto.fechaInicioProg)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(proyecto.fechaFinProg)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(proyecto.fechaInicioReal)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(proyecto.fechaFinReal)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEtapaBadgeClass(proyecto.etapa)}`}>
                      {proyecto.etapa}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${proyecto.porcentajeAvance}%` }}
                        ></div>
                      </div>
                      <span>{proyecto.porcentajeAvance}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${proyecto.informeAvance ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {proyecto.informeAvance ? 'SI' : 'NO'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatMoney(proyecto.montoInversion)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {proyecto.ambito}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {proyectosFiltrados.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FolderKanban size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No se encontraron proyectos</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Editar Proyecto */}
      {showModal && editingProyecto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[95vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary-600 to-primary-700 rounded-t-xl text-white">
              <div className="flex items-center gap-3">
                <Edit2 className="w-6 h-6" />
                <div>
                  <h2 className="text-lg font-semibold">Editar Proyecto</h2>
                  <p className="text-sm text-white/80">Seguimiento de proyecto PGDPP</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
              {/* Sección: Información General */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 pb-2 border-b border-gray-100">
                  Información General
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Código */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código
                    </label>
                    <input
                      type="text"
                      name="codigo"
                      value={formData.codigo}
                      onChange={handleInputChange}
                      className="input-field bg-gray-100 text-gray-500"
                      readOnly
                    />
                  </div>

                  {/* Tipo Proyecto */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo Proyecto
                    </label>
                    <select
                      name="tipoProyecto"
                      value={formData.tipoProyecto}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    >
                      <option value="">Seleccionar...</option>
                      {tiposProyectoOptions.map((tipo) => (
                        <option key={tipo} value={tipo}>{tipo}</option>
                      ))}
                    </select>
                  </div>

                  {/* Tipo Beneficiario */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo Beneficiario
                    </label>
                    <select
                      name="tipoBeneficiario"
                      value={formData.tipoBeneficiario}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    >
                      <option value="">Seleccionar...</option>
                      {tiposBeneficiarioOptions.map((tipo) => (
                        <option key={tipo} value={tipo}>{tipo}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Nombre - ancho completo */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Proyecto
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              {/* Sección: Fechas */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 pb-2 border-b border-gray-100">
                  Cronograma
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Inicio Programado
                    </label>
                    <input
                      type="date"
                      name="fechaInicioProg"
                      value={formData.fechaInicioProg}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fin Programado
                    </label>
                    <input
                      type="date"
                      name="fechaFinProg"
                      value={formData.fechaFinProg}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Inicio Real
                    </label>
                    <input
                      type="date"
                      name="fechaInicioReal"
                      value={formData.fechaInicioReal}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fin Real
                    </label>
                    <input
                      type="date"
                      name="fechaFinReal"
                      value={formData.fechaFinReal}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              {/* Sección: Estado y Avance */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 pb-2 border-b border-gray-100">
                  Estado y Avance
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Columna izquierda */}
                  <div className="space-y-4">
                    {/* Etapa */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Etapa
                      </label>
                      <select
                        name="etapa"
                        value={formData.etapa}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      >
                        <option value="">Seleccionar...</option>
                        {etapasOptions.map((etapa) => (
                          <option key={etapa} value={etapa}>{etapa}</option>
                        ))}
                      </select>
                    </div>

                    {/* % Avance */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Porcentaje de Avance
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          name="porcentajeAvance"
                          value={formData.porcentajeAvance}
                          onChange={handleInputChange}
                          min="0"
                          max="100"
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <span className="text-sm font-semibold bg-gray-100 px-3 py-1 rounded-md min-w-[50px] text-center">
                          {formData.porcentajeAvance}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Columna derecha */}
                  <div className="space-y-4">
                    {/* Informe Avance */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Informe de Avance
                      </label>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="informeAvance"
                            checked={formData.informeAvance === true}
                            onChange={() => setFormData(prev => ({ ...prev, informeAvance: true }))}
                            className="w-4 h-4 text-primary accent-primary"
                          />
                          <span className="text-sm">Sí</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="informeAvance"
                            checked={formData.informeAvance === false}
                            onChange={() => setFormData(prev => ({ ...prev, informeAvance: false }))}
                            className="w-4 h-4 text-primary accent-primary"
                          />
                          <span className="text-sm">No</span>
                        </label>
                      </div>
                    </div>

                    {/* Monto Inversión */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Monto de Inversión
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">S/</span>
                        <input
                          type="number"
                          name="montoInversion"
                          value={formData.montoInversion}
                          onChange={handleInputChange}
                          className="input-field pl-8"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección: Ubicación */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 pb-2 border-b border-gray-100">
                  Ubicación
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Ámbito */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ámbito
                    </label>
                    <select
                      name="ambito"
                      value={formData.ambito}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    >
                      <option value="">Seleccionar...</option>
                      {ambitosOptions.map((ambito) => (
                        <option key={ambito} value={ambito}>{ambito}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary px-6 py-2"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary flex items-center gap-2 px-6 py-2"
                >
                  <Save size={18} />
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeguimientoPGDPP;
