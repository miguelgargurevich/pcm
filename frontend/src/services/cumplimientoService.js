import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a cada request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Servicio de Cumplimiento Normativo
const cumplimientoService = {
  /**
   * Obtiene todos los cumplimientos normativos con filtros opcionales
   * @param {Object} filters - Filtros: compromisoId, estado, entidadId
   * @returns {Promise}
   */
  getAll: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.compromisoId) params.append('compromisoId', filters.compromisoId);
      if (filters.estado) params.append('estado', filters.estado);
      if (filters.entidadId) params.append('entidadId', filters.entidadId);
      
      const response = await apiClient.get(`/CumplimientoNormativo?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener cumplimientos:', error);
      throw error;
    }
  },

  /**
   * Obtiene un cumplimiento normativo por ID
   * @param {number} id - ID del cumplimiento
   * @returns {Promise}
   */
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/CumplimientoNormativo/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener cumplimiento:', error);
      throw error;
    }
  },

  /**
   * Crea un nuevo cumplimiento normativo
   * @param {Object} data - Datos del cumplimiento
   * @returns {Promise}
   */
  create: async (data) => {
    try {
      const response = await apiClient.post('/CumplimientoNormativo', data);
      return response.data;
    } catch (error) {
      console.error('Error al crear cumplimiento:', error);
      throw error;
    }
  },

  /**
   * Actualiza un cumplimiento normativo existente
   * @param {number} id - ID del cumplimiento
   * @param {Object} data - Datos actualizados
   * @returns {Promise}
   */
  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/CumplimientoNormativo/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar cumplimiento:', error);
      throw error;
    }
  },

  /**
   * Sube un archivo PDF para el cumplimiento normativo
   * @param {File} file - Archivo PDF
   * @returns {Promise} URL del archivo subido
   */
  uploadDocument: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/CumplimientoNormativo/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  /**
   * Obtiene los estados de cumplimiento disponibles
   * @returns {Array} Lista de estados
   */
  getEstados: () => {
    return [
      { id: 1, nombre: 'Bandeja', descripcion: 'En bandeja de entrada' },
      { id: 2, nombre: 'Sin Reportar', descripcion: 'Iniciado pero sin reportar' },
      { id: 3, nombre: 'Publicado', descripcion: 'Reportado y publicado' }
    ];
  }
};

export default cumplimientoService;
