import toast from 'react-hot-toast';

/**
 * Muestra un toast de confirmación personalizado
 * @param {Object} options - Opciones de configuración
 * @param {string} options.title - Título del mensaje de confirmación
 * @param {string} options.message - Mensaje opcional adicional
 * @param {Function} options.onConfirm - Función a ejecutar al confirmar
 * @param {string} options.confirmText - Texto del botón de confirmar (default: "Confirmar")
 * @param {string} options.cancelText - Texto del botón de cancelar (default: "Cancelar")
 * @param {string} options.loadingText - Texto mostrado durante la carga (default: "Procesando...")
 * @param {string} options.confirmButtonClass - Clases CSS personalizadas para botón confirmar
 */
export const showConfirmToast = ({
  title,
  message,
  onConfirm,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  loadingText = 'Procesando...',
  confirmButtonClass = 'px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700',
}) => {
  toast((t) => (
    <div className="flex flex-col gap-3">
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        {message && <p className="text-sm text-gray-600 mt-1">{message}</p>}
      </div>
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
        >
          {cancelText}
        </button>
        <button
          onClick={async () => {
            toast.dismiss(t.id);
            const loadingToast = toast.loading(loadingText);
            try {
              await onConfirm();
              toast.dismiss(loadingToast);
            } catch (error) {
              toast.dismiss(loadingToast);
              throw error;
            }
          }}
          className={confirmButtonClass}
        >
          {confirmText}
        </button>
      </div>
    </div>
  ), {
    duration: Infinity,
    style: {
      background: '#fff',
      color: '#000',
      minWidth: '300px',
    },
  });
};

/**
 * Muestra un toast de éxito
 * @param {string} message - Mensaje de éxito
 */
export const showSuccessToast = (message) => {
  toast.success(message, {
    duration: 3000,
  });
};

/**
 * Muestra un toast de error
 * @param {string} message - Mensaje de error
 */
export const showErrorToast = (message) => {
  toast.error(message, {
    duration: 4000,
  });
};

/**
 * Muestra un toast de información
 * @param {string} message - Mensaje informativo
 */
export const showInfoToast = (message) => {
  toast(message, {
    duration: 3000,
    icon: 'ℹ️',
  });
};

/**
 * Muestra un toast de carga y retorna el ID para actualizarlo después
 * @param {string} message - Mensaje de carga
 * @returns {string} ID del toast para actualizar después
 */
export const showLoadingToast = (message = 'Cargando...') => {
  return toast.loading(message);
};

/**
 * Actualiza un toast de carga con un mensaje de éxito
 * @param {string} toastId - ID del toast a actualizar
 * @param {string} message - Mensaje de éxito
 */
export const updateToastSuccess = (toastId, message) => {
  toast.success(message, { id: toastId });
};

/**
 * Actualiza un toast de carga con un mensaje de error
 * @param {string} toastId - ID del toast a actualizar
 * @param {string} message - Mensaje de error
 */
export const updateToastError = (toastId, message) => {
  toast.error(message, { id: toastId });
};
