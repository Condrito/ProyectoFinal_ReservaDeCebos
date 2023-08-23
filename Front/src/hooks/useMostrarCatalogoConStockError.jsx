import Swal from 'sweetalert2/dist/sweetalert2.all.js';

export const useMostrarCatalogoConStockError = (res, setError) => {
  //! ---------------- 404 : 'No hay o no se encontraron cebos disponibles'
  if (res?.response?.data?.includes('No se encontraron cebos disponibles.')) {
    Swal.fire({
      icon: 'error',
      title: 'Catalogo no disponible',
      text: 'En estos momentos nuestras neveras estan vacias, vuelve mas tarde',
      showConfirmButton: false,
      timer: 1500,
    });
    setError(() => true);
  }
  //! ---------------- 404 : No se encuentra el cebo para ese stock
  if (res?.response?.data?.includes('No se encontró el cebo correspondiente.')) {
    Swal.fire({
      icon: 'error',
      title: 'Catalogo no disponible',
      text: 'No se han encontrado cebos con stock disponible',
      showConfirmButton: false,
      timer: 1500,
    });
    setError(() => true);
  }
};
