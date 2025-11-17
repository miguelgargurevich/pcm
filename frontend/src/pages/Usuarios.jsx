import { useState, useEffect } from 'react';
import { usuariosService } from '../services/usuariosService';
import { entidadesService } from '../services/entidadesService';
import { catalogosService } from '../services/catalogosService';
import { showConfirmToast, showSuccessToast, showErrorToast, showInfoToast } from '../utils/toast.jsx';
import { Plus, Edit2, Trash2, X, Save, FilterX, Search } from 'lucide-react';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [consultingRENIEC, setConsultingRENIEC] = useState(false);
  
  // Filtros
  const [filtros, setFiltros] = useState({
    nombre: '',
    entidadId: '',
    perfilId: '',
  });

  // Datos para los selects
  const [entidades, setEntidades] = useState([]);
  const [perfiles, setPerfiles] = useState([]);

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  const [formData, setFormData] = useState({
    email: '',
    numDni: '',
    nombres: '',
    apePaterno: '',
    apeMaterno: '',
    direccion: '',
    entidadId: '',
    perfilId: '',
    activo: true,
  });

  useEffect(() => {
    loadUsuarios();
    loadEntidadesYPerfiles();
  }, []);

  // Aplicar filtros cuando cambian los usuarios o los filtros
  useEffect(() => {
    const aplicarFiltros = () => {
      let filtered = [...usuarios];

      // Filtrar por nombre (busca en nombres completos)
      if (filtros.nombre.trim()) {
        const nombreLower = filtros.nombre.toLowerCase();
        filtered = filtered.filter(
          (u) =>
            `${u.nombres} ${u.apePaterno} ${u.apeMaterno}`
              .toLowerCase()
              .includes(nombreLower) ||
            u.email?.toLowerCase().includes(nombreLower) ||
            u.numDni?.includes(filtros.nombre)
        );
      }

      // Filtrar por entidad
      if (filtros.entidadId) {
        filtered = filtered.filter((u) => u.entidadId === parseInt(filtros.entidadId));
      }

      // Filtrar por perfil
      if (filtros.perfilId) {
        filtered = filtered.filter((u) => u.perfilId === parseInt(filtros.perfilId));
      }

      setUsuariosFiltrados(filtered);
      setPaginaActual(1); // Reset página cuando cambian los filtros
    };

    aplicarFiltros();
  }, [usuarios, filtros]);

  const loadEntidadesYPerfiles = async () => {
    try {
      // Cargar entidades
      const entidadesResponse = await entidadesService.getAll();
      const entidadesSuccess = entidadesResponse.isSuccess || entidadesResponse.IsSuccess;
      
      if (entidadesSuccess) {
        const entidadesData = entidadesResponse.data || entidadesResponse.Data;
        setEntidades(Array.isArray(entidadesData) ? entidadesData : []);
      }

      // Cargar perfiles desde API
      try {
        const perfilesResponse = await catalogosService.getPerfiles();
        const perfilesSuccess = perfilesResponse.isSuccess || perfilesResponse.IsSuccess;
        
        if (perfilesSuccess) {
          const perfilesData = perfilesResponse.data || perfilesResponse.Data;
          setPerfiles(Array.isArray(perfilesData) ? perfilesData : []);
        }
      } catch (perfilesError) {
        console.error('Error al cargar perfiles:', perfilesError);
        // Fallback a datos mock si falla la API
        setPerfiles([
          { perfilId: 1, nombre: 'Administrador' },
          { perfilId: 2, nombre: 'Usuario' },
          { perfilId: 3, nombre: 'Consultor' },
        ]);
      }
    } catch (err) {
      console.error('Error al cargar entidades y perfiles:', err);
      // En caso de error, usar datos mock
      setEntidades([
        { entidadId: 1, nombre: 'PCM' },
        { entidadId: 2, nombre: 'MIDIS' },
        { entidadId: 3, nombre: 'MINSA' },
      ]);
      setPerfiles([
        { perfilId: 1, nombre: 'Administrador' },
        { perfilId: 2, nombre: 'Usuario' },
        { perfilId: 3, nombre: 'Consultor' },
      ]);
    }
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros({
      ...filtros,
      [name]: value,
    });
  };

  const limpiarFiltros = () => {
    setFiltros({
      nombre: '',
      entidadId: '',
      perfilId: '',
    });
    setPaginaActual(1); // Reset página al limpiar filtros
  };

  // Lógica de paginación
  const indiceUltimo = paginaActual * itemsPorPagina;
  const indicePrimero = indiceUltimo - itemsPorPagina;
  const usuariosPaginados = usuariosFiltrados.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(usuariosFiltrados.length / itemsPorPagina);

  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      const response = await usuariosService.getAll();
      const isSuccess = response.isSuccess || response.IsSuccess;
      
      if (isSuccess) {
        const data = response.data || response.Data;
        setUsuarios(Array.isArray(data) ? data : []);
      } else {
        setError(response.message || 'Error al cargar usuarios');
      }
    } catch (err) {
      setError(err.message || 'Error al cargar usuarios');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingUsuario(null);
    setFormData({
      email: '',
      numDni: '',
      nombres: '',
      apePaterno: '',
      apeMaterno: '',
      direccion: '',
      entidadId: '',
      perfilId: '',
      activo: true,
    });
    setShowModal(true);
  };

  const handleEdit = (usuario) => {
    setEditingUsuario(usuario);
    setFormData({
      email: usuario.email || '',
      numDni: usuario.numDni || '',
      nombres: usuario.nombres || '',
      apePaterno: usuario.apePaterno || '',
      apeMaterno: usuario.apeMaterno || '',
      direccion: usuario.direccion || '',
      entidadId: usuario.entidadId || '',
      perfilId: usuario.perfilId || '',
      activo: usuario.activo !== undefined ? usuario.activo : true,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    showConfirmToast({
      title: '¿Está seguro de eliminar este usuario?',
      message: 'Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      loadingText: 'Eliminando usuario...',
      onConfirm: async () => {
        const response = await usuariosService.delete(id);
        const isSuccess = response.isSuccess || response.IsSuccess;
        
        if (isSuccess) {
          await loadUsuarios();
          showSuccessToast('Usuario eliminado exitosamente');
        } else {
          showErrorToast(response.message || 'Error al eliminar usuario');
        }
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      let response;
      
      if (editingUsuario) {
        // Para actualizar: incluir userId en el body
        const dataToSend = {
          userId: editingUsuario.userId,
          ...formData
        };
        response = await usuariosService.update(editingUsuario.userId, dataToSend);
      } else {
        // Para crear: no incluir userId
        response = await usuariosService.create(formData);
      }

      const isSuccess = response.isSuccess || response.IsSuccess;
      
      if (isSuccess) {
        setShowModal(false);
        await loadUsuarios();
        showSuccessToast(editingUsuario ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente');
      } else {
        setError(response.message || 'Error al guardar usuario');
      }
    } catch (err) {
      setError(err.message || 'Error al guardar usuario');
      showErrorToast(err.message || 'Error al guardar usuario');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const consultarRENIEC = async () => {
    if (!formData.numDni || formData.numDni.length !== 8) {
      showErrorToast('Ingrese un DNI válido de 8 dígitos');
      return;
    }

    setConsultingRENIEC(true);
    try {
      // Simulación de consulta a RENIEC
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      showInfoToast('Función de consulta RENIEC en desarrollo');
      
      // Cuando se integre con la API real de RENIEC, descomentar:
      // const response = await reniecService.consultarDNI(formData.numDni);
      // if (response.isSuccess) {
      //   setFormData({
      //     ...formData,
      //     nombres: response.data.nombres,
      //     apePaterno: response.data.apellidoPaterno,
      //     apeMaterno: response.data.apellidoMaterno,
      //   });
      //   showSuccessToast('Datos obtenidos de RENIEC');
      // }
    } catch {
      showErrorToast('Error al consultar RENIEC');
    } finally {
      setConsultingRENIEC(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
            <p className="text-gray-600 mt-1">Administración de usuarios del sistema</p>
          </div>
          <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Nuevo Usuario
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar por Nombre, DNI o Email
            </label>
            <input
              type="text"
              name="nombre"
              value={filtros.nombre}
              onChange={handleFiltroChange}
              className="input-field"
              placeholder="Ingrese nombre, DNI o email..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Entidad
            </label>
            <select
              name="entidadId"
              value={filtros.entidadId}
              onChange={handleFiltroChange}
              className="input-field"
            >
              <option value="">Todas las entidades</option>
              {entidades.map((entidad) => (
                <option key={entidad.entidadId} value={entidad.entidadId}>
                  {entidad.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Perfil
            </label>
            <select
              name="perfilId"
              value={filtros.perfilId}
              onChange={handleFiltroChange}
              className="input-field"
            >
              <option value="">Todos los perfiles</option>
              {perfiles.map((perfil) => (
                <option key={perfil.perfilId} value={perfil.perfilId}>
                  {perfil.nombre}
                </option>
              ))}
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

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DNI
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre Completo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Correo Electrónico
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Perfil
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usuariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    {usuarios.length === 0 
                      ? 'No hay usuarios registrados' 
                      : 'No se encontraron usuarios con los filtros aplicados'}
                  </td>
                </tr>
              ) : usuariosPaginados.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    {usuarios.length === 0
                      ? 'No hay usuarios registrados'
                      : 'No se encontraron usuarios con los filtros aplicados'}
                  </td>
                </tr>
              ) : (
                usuariosPaginados.map((usuario) => (
                  <tr key={usuario.userId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {usuario.numDni || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {[usuario.nombres, usuario.apePaterno, usuario.apeMaterno]
                        .filter(Boolean)
                        .join(' ') || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {usuario.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {usuario.nombreEntidad || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {usuario.nombrePerfil || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          usuario.activo
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {usuario.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(usuario)}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => handleDelete(usuario.userId)}
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

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                onClick={() => cambiarPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{indicePrimero + 1}</span> a{' '}
                  <span className="font-medium">
                    {Math.min(indiceUltimo, usuariosFiltrados.length)}
                  </span>{' '}
                  de <span className="font-medium">{usuariosFiltrados.length}</span> resultados
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => cambiarPagina(paginaActual - 1)}
                    disabled={paginaActual === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Anterior</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {[...Array(totalPaginas)].map((_, index) => {
                    const numeroPagina = index + 1;
                    // Mostrar siempre la primera página, última página, y páginas cerca de la actual
                    if (
                      numeroPagina === 1 ||
                      numeroPagina === totalPaginas ||
                      (numeroPagina >= paginaActual - 1 && numeroPagina <= paginaActual + 1)
                    ) {
                      return (
                        <button
                          key={numeroPagina}
                          onClick={() => cambiarPagina(numeroPagina)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            paginaActual === numeroPagina
                              ? 'z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                              : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                          }`}
                        >
                          {numeroPagina}
                        </button>
                      );
                    } else if (
                      numeroPagina === paginaActual - 2 ||
                      numeroPagina === paginaActual + 2
                    ) {
                      return <span key={numeroPagina} className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">...</span>;
                    }
                    return null;
                  })}
                  <button
                    onClick={() => cambiarPagina(paginaActual + 1)}
                    disabled={paginaActual === totalPaginas}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Siguiente</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
        >
          <div className="min-h-screen flex items-start justify-center p-4 pt-8">
            <div className="bg-white rounded-lg max-w-2xl w-full shadow-xl relative my-8">
            {/* Botón cerrar */}
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
              title="Cerrar"
            >
              <X size={24} />
            </button>

            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 pr-8">
                {editingUsuario ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h2>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* DNI con botón consultar */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de DNI *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="numDni"
                      value={formData.numDni}
                      onChange={handleChange}
                      className="input-field flex-1"
                      required
                      maxLength="8"
                      pattern="[0-9]{8}"
                      placeholder="12345678"
                    />
                    <button
                      type="button"
                      onClick={consultarRENIEC}
                      disabled={consultingRENIEC || !formData.numDni || formData.numDni.length !== 8}
                      className="btn-secondary flex items-center gap-2 whitespace-nowrap"
                    >
                      <Search size={18} />
                      {consultingRENIEC ? '...' : 'Consultar RENIEC'}
                    </button>
                  </div>
                </div>

                {/* Nombres */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombres *
                  </label>
                  <input
                    type="text"
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleChange}
                    className="input-field"
                    required
                    maxLength="100"
                    placeholder="Juan Carlos"
                  />
                </div>

                {/* Apellido Paterno, Apellido Materno */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido Paterno *
                    </label>
                    <input
                      type="text"
                      name="apePaterno"
                      value={formData.apePaterno}
                      onChange={handleChange}
                      className="input-field"
                      required
                      maxLength="60"
                      placeholder="Pérez"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido Materno *
                    </label>
                    <input
                      type="text"
                      name="apeMaterno"
                      value={formData.apeMaterno}
                      onChange={handleChange}
                      className="input-field"
                      required
                      maxLength="60"
                      placeholder="García"
                    />
                  </div>
                </div>

                {/* Correo Electrónico, Entidad */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field"
                      required
                      maxLength="100"
                      placeholder="usuario@entidad.gob.pe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Entidad *
                    </label>
                    <select
                      name="entidadId"
                      value={formData.entidadId}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="">Seleccione una entidad...</option>
                      {entidades.map((entidad) => (
                        <option key={entidad.entidadId} value={entidad.entidadId}>
                          {entidad.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>

                {/* Dirección */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    className="input-field"
                    maxLength="200"
                    placeholder="Av. Principal 123, Piso 5"
                  />
                </div>

                {/* Perfil, Estado */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Perfil *
                    </label>
                    <select
                      name="perfilId"
                      value={formData.perfilId}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="">Seleccione un perfil...</option>
                      {perfiles.map((perfil) => (
                        <option key={perfil.perfilId} value={perfil.perfilId}>
                          {perfil.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center pt-7">
                    <input
                      type="checkbox"
                      name="activo"
                      checked={formData.activo}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Usuario Activo
                    </label>
                  </div>
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
                    {editingUsuario ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Usuarios;
