import { useState, useEffect } from 'react';
import { entidadesService } from '../services/entidadesService';
import { catalogosService } from '../services/catalogosService';
import { Plus, Edit2, Trash2, X, Save, Filter, FilterX } from 'lucide-react';

const Entidades = () => {
  const [entidades, setEntidades] = useState([]);
  const [entidadesFiltradas, setEntidadesFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEntidad, setEditingEntidad] = useState(null);

  // Filtros
  const [filtros, setFiltros] = useState({
    nombre: '',
    departamento: '',
    provincia: '',
    distrito: '',
    sectorId: '',
    clasificacionId: '',
    estado: '',
  });

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  // Datos para selects
  const [departamentos, setDepartamentos] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [distritos, setDistritos] = useState([]);
  const [nivelesGobierno, setNivelesGobierno] = useState([]);
  const [sectores, setSectores] = useState([]);
  const [clasificaciones, setClasificaciones] = useState([]);

  const [formData, setFormData] = useState({
    ruc: '',
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    web: '',
    ubigeoCodigo: '',
    nivelGobiernoId: '',
    sectorId: '',
    clasificacionId: '',
    activo: true,
  });

  useEffect(() => {
    loadEntidades();
    loadUbigeoYCatalogos();
  }, []);

  // Aplicar filtros cuando cambian las entidades o los filtros
  useEffect(() => {
    const aplicarFiltrosLocal = () => {
      let filtered = [...entidades];

      // Filtrar por nombre o RUC
      if (filtros.nombre.trim()) {
        const nombreLower = filtros.nombre.toLowerCase();
        filtered = filtered.filter(
          (e) =>
            e.nombre?.toLowerCase().includes(nombreLower) ||
            e.ruc?.includes(filtros.nombre)
        );
      }

      // Filtrar por departamento
      if (filtros.departamento) {
        filtered = filtered.filter((e) => e.departamento === filtros.departamento);
        
        // Actualizar provincias disponibles
        const provinciasUnicas = [...new Set(
          entidades
            .filter(e => e.departamento === filtros.departamento)
            .map(e => e.provincia)
            .filter(Boolean)
        )];
        setProvincias(provinciasUnicas);
      } else {
        setProvincias([]);
        setDistritos([]);
      }

      // Filtrar por provincia
      if (filtros.provincia) {
        filtered = filtered.filter((e) => e.provincia === filtros.provincia);
        
        // Actualizar distritos disponibles
        const distritosUnicos = [...new Set(
          entidades
            .filter(e => e.departamento === filtros.departamento && e.provincia === filtros.provincia)
            .map(e => e.distrito)
            .filter(Boolean)
        )];
        setDistritos(distritosUnicos);
      } else if (filtros.departamento) {
        setDistritos([]);
      }

      // Filtrar por distrito
      if (filtros.distrito) {
        filtered = filtered.filter((e) => e.distrito === filtros.distrito);
      }

      // Filtrar por sector
      if (filtros.sectorId) {
        filtered = filtered.filter((e) => e.sectorId === parseInt(filtros.sectorId));
      }

      // Filtrar por clasificación
      if (filtros.clasificacionId) {
        filtered = filtered.filter((e) => e.clasificacionId === parseInt(filtros.clasificacionId));
      }

      // Filtrar por estado
      if (filtros.estado !== '') {
        const estadoBoolean = filtros.estado === 'true';
        filtered = filtered.filter((e) => e.activo === estadoBoolean);
      }

      setEntidadesFiltradas(filtered);
    };
    
    aplicarFiltrosLocal();
    setPaginaActual(1); // Reset a primera página cuando cambian filtros
  }, [entidades, filtros]);

  const loadUbigeoYCatalogos = async () => {
    try {
      // Cargar niveles de gobierno
      const nivelesResponse = await catalogosService.getNivelesGobierno();
      if (nivelesResponse.isSuccess || nivelesResponse.IsSuccess) {
        const nivelesData = nivelesResponse.data || nivelesResponse.Data;
        setNivelesGobierno(Array.isArray(nivelesData) ? nivelesData : []);
      }

      // Cargar sectores
      const sectoresResponse = await catalogosService.getSectores();
      if (sectoresResponse.isSuccess || sectoresResponse.IsSuccess) {
        const sectoresData = sectoresResponse.data || sectoresResponse.Data;
        setSectores(Array.isArray(sectoresData) ? sectoresData : []);
      }

      // Cargar clasificaciones
      const clasificacionesResponse = await catalogosService.getClasificaciones();
      if (clasificacionesResponse.isSuccess || clasificacionesResponse.IsSuccess) {
        const clasificacionesData = clasificacionesResponse.data || clasificacionesResponse.Data;
        setClasificaciones(Array.isArray(clasificacionesData) ? clasificacionesData : []);
      }

      // Mock de departamentos (hasta que esté el endpoint de ubigeo)
      setDepartamentos([
        'Lima', 'Arequipa', 'Cusco', 'La Libertad', 'Piura', 'Junín', 'Cajamarca'
      ]);
    } catch (error) {
      console.error('Error al cargar catálogos:', error);
      // Fallback a datos mock en caso de error
      setNivelesGobierno([
        { nivelGobiernoId: 1, nombre: 'Nacional' },
        { nivelGobiernoId: 2, nombre: 'Regional' },
        { nivelGobiernoId: 3, nombre: 'Local' },
      ]);
      setSectores([
        { sectorId: 1, nombre: 'Presidencia del Consejo de Ministros' },
        { sectorId: 2, nombre: 'Educación' },
        { sectorId: 3, nombre: 'Salud' },
      ]);
      setClasificaciones([
        { clasificacionId: 1, nombre: 'Ministerio' },
        { clasificacionId: 2, nombre: 'Organismo Público' },
      ]);
    }
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    
    // Si cambia el departamento, limpiar provincia y distrito
    if (name === 'departamento') {
      setFiltros({
        ...filtros,
        [name]: value,
        provincia: '',
        distrito: '',
      });
    }
    // Si cambia la provincia, limpiar distrito
    else if (name === 'provincia') {
      setFiltros({
        ...filtros,
        [name]: value,
        distrito: '',
      });
    }
    else {
      setFiltros({
        ...filtros,
        [name]: value,
      });
    }
  };

  const limpiarFiltros = () => {
    setFiltros({
      nombre: '',
      departamento: '',
      provincia: '',
      distrito: '',
      sectorId: '',
      clasificacionId: '',
      estado: '',
    });
    setProvincias([]);
    setDistritos([]);
  };

  // Cálculos de paginación
  const indiceUltimo = paginaActual * itemsPorPagina;
  const indicePrimero = indiceUltimo - itemsPorPagina;
  const entidadesPaginadas = entidadesFiltradas.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(entidadesFiltradas.length / itemsPorPagina);

  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadEntidades = async () => {
    try {
      setLoading(true);
      const response = await entidadesService.getAll();
      const isSuccess = response.isSuccess || response.IsSuccess;
      
      if (isSuccess) {
        const data = response.data || response.Data;
        setEntidades(Array.isArray(data) ? data : []);
      } else {
        setError(response.message || 'Error al cargar entidades');
      }
    } catch (err) {
      setError(err.message || 'Error al cargar entidades');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingEntidad(null);
    setFormData({
      ruc: '',
      nombre: '',
      direccion: '',
      telefono: '',
      email: '',
      web: '',
      ubigeoCodigo: '',
      nivelGobiernoId: '',
      sectorId: '',
      clasificacionId: '',
      activo: true,
    });
    setShowModal(true);
  };

  const handleEdit = (entidad) => {
    setEditingEntidad(entidad);
    setFormData({
      ruc: entidad.ruc || '',
      nombre: entidad.nombre || '',
      direccion: entidad.direccion || '',
      telefono: entidad.telefono || '',
      email: entidad.email || '',
      web: entidad.web || '',
      ubigeoCodigo: entidad.ubigeoCodigo || '',
      nivelGobiernoId: entidad.nivelGobiernoId || '',
      sectorId: entidad.sectorId || '',
      clasificacionId: entidad.clasificacionId || '',
      activo: entidad.activo !== undefined ? entidad.activo : true,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar esta entidad?')) return;

    try {
      const response = await entidadesService.delete(id);
      const isSuccess = response.isSuccess || response.IsSuccess;
      
      if (isSuccess) {
        await loadEntidades();
        alert('Entidad eliminada exitosamente');
      } else {
        alert(response.message || 'Error al eliminar entidad');
      }
    } catch (err) {
      alert(err.message || 'Error al eliminar entidad');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      let response;
      if (editingEntidad) {
        response = await entidadesService.update(editingEntidad.entidadId, formData);
      } else {
        response = await entidadesService.create(formData);
      }

      const isSuccess = response.isSuccess || response.IsSuccess;
      
      if (isSuccess) {
        setShowModal(false);
        await loadEntidades();
        alert(editingEntidad ? 'Entidad actualizada exitosamente' : 'Entidad creada exitosamente');
      } else {
        setError(response.message || 'Error al guardar entidad');
      }
    } catch (err) {
      setError(err.message || 'Error al guardar entidad');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Entidades</h1>
        <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Nueva Entidad
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Filtros */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Filtros de Búsqueda</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar por Nombre o RUC
            </label>
            <input
              type="text"
              name="nombre"
              value={filtros.nombre}
              onChange={handleFiltroChange}
              className="input-field"
              placeholder="Ingrese nombre o RUC..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Departamento
            </label>
            <select
              name="departamento"
              value={filtros.departamento}
              onChange={handleFiltroChange}
              className="input-field"
            >
              <option value="">Todos los departamentos</option>
              {departamentos.map((dept, idx) => (
                <option key={idx} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Provincia
            </label>
            <select
              name="provincia"
              value={filtros.provincia}
              onChange={handleFiltroChange}
              className="input-field"
              disabled={!filtros.departamento}
            >
              <option value="">Todas las provincias</option>
              {provincias.map((prov, idx) => (
                <option key={idx} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Distrito
            </label>
            <select
              name="distrito"
              value={filtros.distrito}
              onChange={handleFiltroChange}
              className="input-field"
              disabled={!filtros.provincia}
            >
              <option value="">Todos los distritos</option>
              {distritos.map((dist, idx) => (
                <option key={idx} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sector
            </label>
            <select
              name="sectorId"
              value={filtros.sectorId}
              onChange={handleFiltroChange}
              className="input-field"
            >
              <option value="">Todos los sectores</option>
              {sectores.map((sector) => (
                <option key={sector.sectorId} value={sector.sectorId}>
                  {sector.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clasificación
            </label>
            <select
              name="clasificacionId"
              value={filtros.clasificacionId}
              onChange={handleFiltroChange}
              className="input-field"
            >
              <option value="">Todas las clasificaciones</option>
              {clasificaciones.map((clasificacion) => (
                <option key={clasificacion.clasificacionId} value={clasificacion.clasificacionId}>
                  {clasificacion.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              name="estado"
              value={filtros.estado}
              onChange={handleFiltroChange}
              className="input-field"
            >
              <option value="">Todos los estados</option>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={limpiarFiltros}
            className="btn-secondary text-sm flex items-center gap-2"
          >
            <FilterX size={16} />
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Información de resultados */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>
          Mostrando {indicePrimero + 1} - {Math.min(indiceUltimo, entidadesFiltradas.length)} de {entidadesFiltradas.length} entidades
        </span>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  RUC
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                  Departamento
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                  Provincia
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Distrito
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                  Nivel de Gobierno
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Sector
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Clase
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entidadesPaginadas.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-3 py-8 text-center text-gray-500">
                    {entidades.length === 0
                      ? 'No hay entidades registradas'
                      : 'No se encontraron entidades con los filtros aplicados'}
                  </td>
                </tr>
              ) : (
                entidadesPaginadas.map((entidad) => (
                  <tr key={entidad.entidadId} className="hover:bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {entidad.ruc}
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-900">
                      {entidad.nombre}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {entidad.departamento || 'N/A'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {entidad.provincia || 'N/A'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {entidad.distrito || 'N/A'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {entidad.nivelGobierno || 'N/A'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {entidad.nombreSector || 'N/A'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {entidad.nombreClasificacion || 'N/A'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(entidad)}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => handleDelete(entidad.entidadId)}
                          className="text-red-600 hover:text-red-900 flex items-center gap-1"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <button
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>

          {[...Array(totalPaginas)].map((_, index) => {
            const numeroPagina = index + 1;
            // Mostrar solo páginas cercanas a la actual
            if (
              numeroPagina === 1 ||
              numeroPagina === totalPaginas ||
              (numeroPagina >= paginaActual - 1 && numeroPagina <= paginaActual + 1)
            ) {
              return (
                <button
                  key={numeroPagina}
                  onClick={() => cambiarPagina(numeroPagina)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    paginaActual === numeroPagina
                      ? 'bg-primary-500 text-white'
                      : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  {numeroPagina}
                </button>
              );
            } else if (
              numeroPagina === paginaActual - 2 ||
              numeroPagina === paginaActual + 2
            ) {
              return (
                <span key={numeroPagina} className="px-2 text-gray-500">
                  ...
                </span>
              );
            }
            return null;
          })}

          <button
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingEntidad ? 'Editar Entidad' : 'Nueva Entidad'}
              </h2>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      RUC *
                    </label>
                    <input
                      type="text"
                      name="ruc"
                      value={formData.ruc}
                      onChange={handleChange}
                      className="input-field"
                      required
                      maxLength="11"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección
                    </label>
                    <input
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="text"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sitio Web
                    </label>
                    <input
                      type="url"
                      name="web"
                      value={formData.web}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="https://"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código Ubigeo *
                    </label>
                    <input
                      type="text"
                      name="ubigeoCodigo"
                      value={formData.ubigeoCodigo}
                      onChange={handleChange}
                      className="input-field"
                      required
                      maxLength="6"
                      placeholder="150101"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nivel de Gobierno *
                    </label>
                    <select
                      name="nivelGobiernoId"
                      value={formData.nivelGobiernoId}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="">Seleccione...</option>
                      {nivelesGobierno.map((nivel) => (
                        <option key={nivel.nivelGobiernoId} value={nivel.nivelGobiernoId}>
                          {nivel.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sector *
                    </label>
                    <select
                      name="sectorId"
                      value={formData.sectorId}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="">Seleccione...</option>
                      {sectores.map((sector) => (
                        <option key={sector.sectorId} value={sector.sectorId}>
                          {sector.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clasificación *
                    </label>
                    <select
                      name="clasificacionId"
                      value={formData.clasificacionId}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="">Seleccione...</option>
                      {clasificaciones.map((clasificacion) => (
                        <option key={clasificacion.clasificacionId} value={clasificacion.clasificacionId}>
                          {clasificacion.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Entidad Activa
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <X size={18} />
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary flex items-center gap-2">
                    <Save size={18} />
                    {editingEntidad ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Entidades;
