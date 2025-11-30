import { useState, useEffect } from 'react';
import { entidadesService } from '../services/entidadesService';
import { catalogosService } from '../services/catalogosService';
import { ubigeoService } from '../services/ubigeoService';
import { showConfirmToast, showSuccessToast, showErrorToast, showInfoToast } from '../utils/toast.jsx';
import { Plus, Edit2, Trash2, X, Save, Filter, FilterX, Search } from 'lucide-react';

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
  const [subclasificaciones, setSubclasificaciones] = useState([]);
  const [subclasificacionesModal, setSubclasificacionesModal] = useState([]);

  // Estados para selects en cascada
  const [selectedDepartamento, setSelectedDepartamento] = useState('');
  const [selectedProvincia, setSelectedProvincia] = useState('');
  const [selectedDistrito, setSelectedDistrito] = useState('');
  const [selectedClasificacion, setSelectedClasificacion] = useState('');
  const [provinciasModal, setProvinciasModal] = useState([]);
  const [distritosModal, setDistritosModal] = useState([]);
  const [consultingRUC, setConsultingRUC] = useState(false);

  const [formData, setFormData] = useState({
    ruc: '',
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    web: '',
    ubigeoId: '',
    nivelGobiernoId: '',
    sectorId: '',
    clasificacionId: '', // Este ahora es subclasificacion_id en BD
    nombreAlcalde: '',
    apePatAlcalde: '',
    apeMatAlcalde: '',
    emailAlcalde: '',
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
      }

      // Filtrar por provincia
      if (filtros.provincia) {
        filtered = filtered.filter((e) => e.provincia === filtros.provincia);
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

      // Cargar subclasificaciones (todas)
      const subclasificacionesResponse = await catalogosService.getSubclasificaciones();
      if (subclasificacionesResponse.isSuccess || subclasificacionesResponse.IsSuccess) {
        const subclasificacionesData = subclasificacionesResponse.data || subclasificacionesResponse.Data;
        setSubclasificaciones(Array.isArray(subclasificacionesData) ? subclasificacionesData : []);
      }

      // Cargar departamentos
      const departamentosResponse = await ubigeoService.getDepartamentos();
      if (departamentosResponse.isSuccess || departamentosResponse.IsSuccess) {
        const deptosData = departamentosResponse.data || departamentosResponse.Data;
        setDepartamentos(Array.isArray(deptosData) ? deptosData : []);
      }
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
        { clasificacionId: 1, nombre: 'Poder Ejecutivo' },
        { clasificacionId: 2, nombre: 'Poder Legislativo' },
      ]);
      setSubclasificaciones([
        { subclasificacionId: 1, nombre: 'Ministerio', clasificacionId: 1 },
        { subclasificacionId: 2, nombre: 'Organismo Público', clasificacionId: 1 },
      ]);
    }
  };

  const handleFiltroChange = async (e) => {
    const { name, value } = e.target;
    
    // Si cambia el departamento, limpiar provincia y distrito y cargar provincias
    if (name === 'departamento') {
      setFiltros({
        ...filtros,
        [name]: value,
        provincia: '',
        distrito: '',
      });
      setDistritos([]);
      
      if (value) {
        try {
          const response = await ubigeoService.getProvincias(value);
          if (response.isSuccess || response.IsSuccess) {
            const provData = response.data || response.Data;
            setProvincias(Array.isArray(provData) ? provData : []);
          }
        } catch (error) {
          console.error('Error al cargar provincias:', error);
          setProvincias([]);
        }
      } else {
        setProvincias([]);
      }
    }
    // Si cambia la provincia, limpiar distrito y cargar distritos
    else if (name === 'provincia') {
      setFiltros({
        ...filtros,
        [name]: value,
        distrito: '',
      });
      
      if (value && filtros.departamento) {
        try {
          const response = await ubigeoService.getDistritos(filtros.departamento, value);
          if (response.isSuccess || response.IsSuccess) {
            const distData = response.data || response.Data;
            // Extraer solo nombres de distritos
            const distritosNombres = Array.isArray(distData) 
              ? distData.map(d => d.distrito || d)
              : [];
            setDistritos(distritosNombres);
          }
        } catch (error) {
          console.error('Error al cargar distritos:', error);
          setDistritos([]);
        }
      } else {
        setDistritos([]);
      }
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
      setError(''); // Limpiar error anterior
      console.log('🔄 Iniciando carga de entidades...');
      
      const response = await entidadesService.getAll();
      console.log('✅ Response from getAll:', response);
      
      const isSuccess = response.isSuccess || response.IsSuccess;
      console.log('IsSuccess:', isSuccess);
      
      if (isSuccess) {
        const data = response.data || response.Data;
        console.log('📦 Entidades data:', data);
        console.log('📊 Type of data:', typeof data, 'Is array:', Array.isArray(data));
        
        const entidadesArray = Array.isArray(data) ? data : [];
        setEntidades(entidadesArray);
        console.log(`✅ Entidades cargadas exitosamente: ${entidadesArray.length} registros`);
        
        if (entidadesArray.length === 0) {
          console.warn('⚠️ La respuesta fue exitosa pero no hay entidades en la base de datos');
        }
      } else {
        const errorMsg = response.message || response.Message || 'Error al cargar entidades';
        setError(`Error del servidor: ${errorMsg}`);
        console.error('❌ Error response:', response);
        setEntidades([]);
      }
    } catch (err) {
      console.error('❌ Error completo:', err);
      
      let errorMsg = 'Error de conexión con el servidor';
      
      if (err.message) {
        errorMsg = err.message;
      }
      
      if (err.response) {
        errorMsg = `Error ${err.response.status}: ${err.response.statusText}`;
      }
      
      if (!navigator.onLine) {
        errorMsg = 'No hay conexión a internet';
      }
      
      setError(errorMsg);
      console.error('💥 Error loading entidades:', err);
      setEntidades([]);
    } finally {
      setLoading(false);
      console.log('🏁 Carga de entidades finalizada');
    }
  };

  const handleCreate = () => {
    setEditingEntidad(null);
    setSelectedDepartamento('');
    setSelectedProvincia('');
    setSelectedDistrito('');
    setSelectedClasificacion('');
    setProvinciasModal([]);
    setDistritosModal([]);
    setSubclasificacionesModal([]);
    setFormData({
      ruc: '',
      nombre: '',
      direccion: '',
      telefono: '',
      email: '',
      web: '',
      ubigeoId: '',
      nivelGobiernoId: '',
      sectorId: '',
      clasificacionId: '', // Este ahora es subclasificacion_id en BD
      nombreAlcalde: '',
      apePatAlcalde: '',
      apeMatAlcalde: '',
      emailAlcalde: '',
      activo: true,
    });
    setShowModal(true);
  };

  const handleEdit = async (entidad) => {
    setEditingEntidad(entidad);
    
    // Si tiene ubigeoId, cargar los datos de ubicación
    if (entidad.ubigeoId) {
      setSelectedDepartamento(entidad.departamento || '');
      setSelectedProvincia(entidad.provincia || '');
      setSelectedDistrito(entidad.ubigeoId);
      
      // Cargar provincias si hay departamento
      if (entidad.departamento) {
        try {
          const provResponse = await ubigeoService.getProvincias(entidad.departamento);
          if (provResponse.isSuccess || provResponse.IsSuccess) {
            setProvinciasModal(provResponse.data || provResponse.Data || []);
          }
        } catch (error) {
          console.error('Error al cargar provincias:', error);
        }
      }
      
      // Cargar distritos si hay departamento y provincia
      if (entidad.departamento && entidad.provincia) {
        try {
          const distResponse = await ubigeoService.getDistritos(entidad.departamento, entidad.provincia);
          if (distResponse.isSuccess || distResponse.IsSuccess) {
            setDistritosModal(distResponse.data || distResponse.Data || []);
          }
        } catch (error) {
          console.error('Error al cargar distritos:', error);
        }
      }
    }

    // Buscar la clasificación de la subclasificación seleccionada
    if (entidad.clasificacionId) {
      // Buscar en subclasificaciones para obtener su clasificacion padre
      const subclasificacion = subclasificaciones.find(
        s => s.subclasificacionId === entidad.clasificacionId
      );
      if (subclasificacion && subclasificacion.clasificacionId) {
        setSelectedClasificacion(String(subclasificacion.clasificacionId));
        // Cargar subclasificaciones de esa clasificación
        try {
          const subResponse = await catalogosService.getSubclasificacionesByClasificacion(subclasificacion.clasificacionId);
          if (subResponse.isSuccess || subResponse.IsSuccess) {
            setSubclasificacionesModal(subResponse.data || subResponse.Data || []);
          }
        } catch (error) {
          console.error('Error al cargar subclasificaciones:', error);
        }
      }
    }
    
    setFormData({
      ruc: entidad.ruc || '',
      nombre: entidad.nombre || '',
      direccion: entidad.direccion || '',
      telefono: entidad.telefono || '',
      email: entidad.email || '',
      web: entidad.web || '',
      ubigeoId: entidad.ubigeoId || '',
      nivelGobiernoId: entidad.nivelGobiernoId ? String(entidad.nivelGobiernoId) : '',
      sectorId: entidad.sectorId ? String(entidad.sectorId) : '',
      clasificacionId: entidad.clasificacionId ? String(entidad.clasificacionId) : '',
      nombreAlcalde: entidad.nombreAlcalde || '',
      apePatAlcalde: entidad.apePatAlcalde || '',
      apeMatAlcalde: entidad.apeMatAlcalde || '',
      emailAlcalde: entidad.emailAlcalde || '',
      activo: entidad.activo !== undefined ? entidad.activo : true,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    showConfirmToast({
      title: '¿Está seguro de eliminar esta entidad?',
      message: 'Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      loadingText: 'Eliminando entidad...',
      onConfirm: async () => {
        const response = await entidadesService.delete(id);
        const isSuccess = response.isSuccess || response.IsSuccess;
        
        if (isSuccess) {
          await loadEntidades();
          showSuccessToast('Entidad eliminada exitosamente');
        } else {
          showErrorToast(response.message || 'Error al eliminar entidad');
        }
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      let response;
      
      // Preparar datos con conversión de tipos
      const dataToSend = {
        ruc: formData.ruc,
        nombre: formData.nombre,
        direccion: formData.direccion,
        telefono: formData.telefono,
        email: formData.email,
        web: formData.web || null,
        ubigeoId: formData.ubigeoId,
        nivelGobiernoId: parseInt(formData.nivelGobiernoId),
        sectorId: parseInt(formData.sectorId),
        clasificacionId: parseInt(formData.clasificacionId),
        nombreAlcalde: formData.nombreAlcalde,
        apePatAlcalde: formData.apePatAlcalde,
        apeMatAlcalde: formData.apeMatAlcalde,
        emailAlcalde: formData.emailAlcalde,
        activo: formData.activo,
      };
      
      if (editingEntidad) {
        // Para actualizar: incluir entidadId en el body
        response = await entidadesService.update(editingEntidad.entidadId, {
          entidadId: editingEntidad.entidadId,
          ...dataToSend
        });
      } else {
        // Para crear: no incluir entidadId
        response = await entidadesService.create(dataToSend);
      }

      const isSuccess = response.isSuccess || response.IsSuccess;
      
      if (isSuccess) {
        setShowModal(false);
        await loadEntidades();
        showSuccessToast(editingEntidad ? 'Entidad actualizada exitosamente' : 'Entidad creada exitosamente');
      } else {
        setError(response.message || 'Error al guardar entidad');
      }
    } catch (err) {
      setError(err.message || 'Error al guardar entidad');
      showErrorToast(err.message || 'Error al guardar entidad');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Manejar cambio de departamento en el modal
  const handleDepartamentoChange = async (e) => {
    const dept = e.target.value;
    setSelectedDepartamento(dept);
    setSelectedProvincia('');
    setSelectedDistrito('');
    setProvinciasModal([]);
    setDistritosModal([]);
    setFormData({ ...formData, ubigeoId: '' });

    if (dept) {
      try {
        const response = await ubigeoService.getProvincias(dept);
        if (response.isSuccess || response.IsSuccess) {
          const provData = response.data || response.Data;
          setProvinciasModal(Array.isArray(provData) ? provData : []);
        }
      } catch (error) {
        console.error('Error al cargar provincias:', error);
        showErrorToast('Error al cargar provincias');
      }
    }
  };

  // Manejar cambio de provincia en el modal
  const handleProvinciaChange = async (e) => {
    const prov = e.target.value;
    setSelectedProvincia(prov);
    setSelectedDistrito('');
    setDistritosModal([]);
    setFormData({ ...formData, ubigeoId: '' });

    if (prov && selectedDepartamento) {
      try {
        const response = await ubigeoService.getDistritos(selectedDepartamento, prov);
        if (response.isSuccess || response.IsSuccess) {
          const distData = response.data || response.Data;
          setDistritosModal(Array.isArray(distData) ? distData : []);
        }
      } catch (error) {
        console.error('Error al cargar distritos:', error);
        showErrorToast('Error al cargar distritos');
      }
    }
  };

  // Manejar cambio de distrito en el modal
  const handleDistritoChange = (e) => {
    const ubigeoId = e.target.value;
    setSelectedDistrito(ubigeoId);
    setFormData({ ...formData, ubigeoId });
  };

  // Manejar cambio de clasificación en el modal (carga subclasificaciones)
  const handleClasificacionChange = async (e) => {
    const clasificacionId = e.target.value;
    setSelectedClasificacion(clasificacionId);
    setSubclasificacionesModal([]);
    setFormData({ ...formData, clasificacionId: '' }); // Reset subclasificación

    if (clasificacionId) {
      try {
        const response = await catalogosService.getSubclasificacionesByClasificacion(clasificacionId);
        if (response.isSuccess || response.IsSuccess) {
          const subData = response.data || response.Data;
          setSubclasificacionesModal(Array.isArray(subData) ? subData : []);
        }
      } catch (error) {
        console.error('Error al cargar subclasificaciones:', error);
        showErrorToast('Error al cargar subclasificaciones');
      }
    }
  };

  // Manejar cambio de subclasificación en el modal
  const handleSubclasificacionChange = (e) => {
    const subclasificacionId = e.target.value;
    setFormData({ ...formData, clasificacionId: subclasificacionId });
  };

  // Consultar RUC en SUNAT (mock por ahora, se puede integrar con API real)
  const consultarRUC = async () => {
    if (!formData.ruc || formData.ruc.length !== 11) {
      showErrorToast('Ingrese un RUC válido de 11 dígitos');
      return;
    }

    setConsultingRUC(true);
    try {
      // TODO: Integrar con API de SUNAT o servicio de consulta RUC
      // Por ahora, simulamos una consulta
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showInfoToast('Consulta RUC: Funcionalidad pendiente de integración con SUNAT');
      
      // Cuando se integre con SUNAT, se puede autocompletar:
      // setFormData({
      //   ...formData,
      //   nombre: response.razonSocial,
      //   direccion: response.direccion,
      //   // etc...
      // });
    } catch (err) {
      console.error('Error al consultar RUC:', err);
      showErrorToast('Error al consultar RUC');
    } finally {
      setConsultingRUC(false);
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
            <h1 className="text-xl font-bold text-gray-800">Gestión de Entidades</h1>
            <p className="text-gray-600 mt-1">Administración de entidades del Estado</p>
          </div>
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
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
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

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Mostrando {entidadesPaginadas.length} de {entidadesFiltradas.length} entidades
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

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                  Estado
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entidadesPaginadas.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-3 py-8 text-center text-gray-500">
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
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        entidad.activo 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {entidad.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(entidad)}
                          className="text-primary-600 hover:text-blue-900 flex items-center gap-1"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                          {/* <span>Editar</span> */}
                        </button>
                        <button
                          onClick={() => handleDelete(entidad.entidadId)}
                          className="text-red-600 hover:text-red-900 flex items-center gap-1"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                          {/* <span>Eliminar</span> */}
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
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingEntidad ? 'Editar Entidad' : 'Nueva Entidad'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Información Básica */}
                <div className="bg-gray-50 p-5 rounded-lg">
                  <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-2 h-6 bg-primary-600 rounded"></span>
                    Información de la Entidad
                  </h3>
                  <div className="space-y-4">
                    {/* RUC y Nombre */}
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          RUC *
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            name="ruc"
                            value={formData.ruc}
                            onChange={handleChange}
                            className="input-field flex-1"
                            required
                            maxLength="11"
                            pattern="[0-9]{11}"
                            placeholder="20123456789"
                          />
                          <button
                            type="button"
                            onClick={consultarRUC}
                            disabled={consultingRUC || !formData.ruc || formData.ruc.length !== 11}
                            className="btn-secondary px-3 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            title="Consultar RUC en SUNAT"
                          >
                            <Search size={18} />
                            {consultingRUC ? '...' : 'Consultar'}
                          </button>
                        </div>
                      </div>

                      <div className="col-span-8">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre de la Entidad *
                        </label>
                        <input
                          type="text"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                          className="input-field"
                          required
                          maxLength="300"
                        />
                      </div>
                    </div>

                    {/* Ubicación Geográfica */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Departamento *
                        </label>
                        <select
                          value={selectedDepartamento}
                          onChange={handleDepartamentoChange}
                          className="input-field"
                          required
                        >
                          <option value="">Seleccione...</option>
                          {departamentos.map((dept) => (
                            <option key={dept} value={dept}>
                              {dept}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Provincia *
                        </label>
                        <select
                          value={selectedProvincia}
                          onChange={handleProvinciaChange}
                          className="input-field"
                          required
                          disabled={!selectedDepartamento}
                        >
                          <option value="">Seleccione...</option>
                          {provinciasModal.map((prov) => (
                            <option key={prov} value={prov}>
                              {prov}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Distrito *
                        </label>
                        <select
                          value={selectedDistrito}
                          onChange={handleDistritoChange}
                          className="input-field"
                          required
                          disabled={!selectedProvincia}
                        >
                          <option value="">Seleccione...</option>
                          {distritosModal.map((dist) => (
                            <option key={dist.ubigeoId} value={dist.ubigeoId}>
                              {dist.distrito}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Dirección y Teléfono */}
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-9">
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

                      <div className="col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Teléfono
                        </label>
                        <input
                          type="text"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleChange}
                          className="input-field"
                          maxLength="20"
                          placeholder="(01) 123-4567"
                        />
                      </div>
                    </div>

                    {/* Contacto Digital */}
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
                          placeholder="contacto@entidad.gob.pe"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dirección Web Institucional
                        </label>
                        <input
                          type="url"
                          name="web"
                          value={formData.web}
                          onChange={handleChange}
                          className="input-field"
                          maxLength="100"
                          placeholder="https://www.entidad.gob.pe"
                        />
                      </div>
                    </div>

                    {/* Clasificación Administrativa */}
                    <div className="grid grid-cols-4 gap-4">
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
                          value={selectedClasificacion}
                          onChange={handleClasificacionChange}
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

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subclasificación *
                        </label>
                        <select
                          name="clasificacionId"
                          value={formData.clasificacionId}
                          onChange={handleSubclasificacionChange}
                          className="input-field"
                          required
                          disabled={!selectedClasificacion}
                        >
                          <option value="">Seleccione...</option>
                          {subclasificacionesModal.map((sub) => (
                            <option key={sub.subclasificacionId} value={sub.subclasificacionId}>
                              {sub.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información del Alcalde */}
                <div className="bg-gray-50 p-5 rounded-lg">
                  <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-2 h-6 bg-primary-600 rounded"></span>
                    Información del Alcalde o Responsable
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombres *
                        </label>
                        <input
                          type="text"
                          name="nombreAlcalde"
                          value={formData.nombreAlcalde}
                          onChange={handleChange}
                          className="input-field"
                          required
                          maxLength="100"
                          placeholder="Juan Carlos"
                        />
                      </div>

                      <div className="col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Apellido Paterno *
                        </label>
                        <input
                          type="text"
                          name="apePatAlcalde"
                          value={formData.apePatAlcalde}
                          onChange={handleChange}
                          className="input-field"
                          required
                          maxLength="60"
                          placeholder="Pérez"
                        />
                      </div>

                      <div className="col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Apellido Materno *
                        </label>
                        <input
                          type="text"
                          name="apeMatAlcalde"
                          value={formData.apeMatAlcalde}
                          onChange={handleChange}
                          className="input-field"
                          required
                          maxLength="60"
                          placeholder="García"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        name="emailAlcalde"
                        value={formData.emailAlcalde}
                        onChange={handleChange}
                        className="input-field"
                        required
                        maxLength="100"
                        placeholder="alcalde@entidad.gob.pe"
                      />
                    </div>
                  </div>
                </div>

                {/* Estado */}
                <div className="flex items-center pt-4">
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
    </>
  );
};

export default Entidades;
