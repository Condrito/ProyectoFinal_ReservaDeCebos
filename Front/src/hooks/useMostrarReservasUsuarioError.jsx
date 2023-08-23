import Swal from 'sweetalert2/dist/sweetalert2.all.js';

export const useMostrarReservasUsuarioError = (res, setError) => {
  //! -------- 404 = 'Usuario no encontrado'
  if (res?.response?.status == 404) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'No tienes ningúna reserva en tu lista de reservas.',
      showConfirmButton: false,
      timer: 3000,
    });

    setError(() => true);
  }
};
