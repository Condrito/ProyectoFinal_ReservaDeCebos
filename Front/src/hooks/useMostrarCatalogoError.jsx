import Swal from 'sweetalert2/dist/sweetalert2.all.js';

export const useMostrarCatalogoError = (res, setError) => {
  //! -------- 404 = 'Usuario no encontrado'
  if (res?.response?.status == 404) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'En estos momentos el servicio no esta disponible, vuelve más tarde. Gracias.',
      showConfirmButton: false,
      timer: 3000,
    });

    setError(() => true);
  }
};
