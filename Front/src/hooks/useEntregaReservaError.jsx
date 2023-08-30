import Swal from 'sweetalert2/dist/sweetalert2.all.js';
export const useEntregaReservaError = (res) => {
  //! -------- 200
  if (res?.status == 200) {
    Swal.fire({
      icon: 'success',
      title: 'Entregar reserva',
      text: 'Reserva entregada.',
      showConfirmButton: false,
      timer: 3000,
    });
  }

  //! -------- 400 = reserva no confirmada
  if (res?.response?.status == 400) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'La reserva no está confirmada y no puede ser entregada.',
      showConfirmButton: false,
      timer: 1500,
    });

    //! -------- 404 = Reserva no encontrada
    if (res?.response?.status == 404) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Reserva no encontrada.',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }
};
