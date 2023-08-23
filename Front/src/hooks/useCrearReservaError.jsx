import Swal from 'sweetalert2/dist/sweetalert2.all.js';

export const useCrearReservaError = (res) => {
  if (res?.status === 200) {
    Swal.fire({
      icon: 'success',
      title: 'Realizar reserva',
      text: 'Reserva realizada con éxito',
      showConfirmButton: false,
      timer: 3000,
    });
  } else if (res?.response?.status === 500) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'La reserva no se ha podido guardar',
      showConfirmButton: false,
      timer: 1500,
    });
  }
};
