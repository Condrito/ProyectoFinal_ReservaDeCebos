import Swal from 'sweetalert2/dist/sweetalert2.all.js';
export const useChangeEstadoReservasError = (res, estadoPedido) => {
  //! -------- 200
  if (res?.status == 200) {
    if (estadoPedido == 'confirmada')
      Swal.fire({
        icon: 'success',
        title: 'Confirmar reserva',
        text: 'Reserva confirmada con éxito.',
        showConfirmButton: false,
        timer: 3000,
      });
    if (estadoPedido == 'cancelada')
      Swal.fire({
        icon: 'success',
        title: 'Cancelar reserva',
        text: 'Reserva cancelada con éxito.',
        showConfirmButton: false,
        timer: 3000,
      });
  }

  //! -------- 400 = Debe proporcionar el nuevo estado de la reserva
  if (res?.response?.status == 400) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Debe proporcionar el nuevo estado de la reserva.',
      showConfirmButton: false,
      timer: 1500,
    });

    //! -------- 404 = Reserva no encontrado
    if (res?.response?.status == 404) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'reserva no encontrado.',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }
};
