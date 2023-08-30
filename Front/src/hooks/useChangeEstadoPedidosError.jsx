import Swal from 'sweetalert2/dist/sweetalert2.all.js';
export const useChangeEstadoPedidosError = (res, estadoPedido) => {
  //! -------- 200
  if (res?.status == 200) {
    if (estadoPedido == 'confirmado')
      Swal.fire({
        icon: 'success',
        title: 'Confirmar pedido',
        text: 'Pedido Confirmado con exito.',
        showConfirmButton: false,
        timer: 3000,
      });
    if (estadoPedido == 'cancelado')
      Swal.fire({
        icon: 'success',
        title: 'Cancelar pedido',
        text: 'Pedido Cancelado con exito.',
        showConfirmButton: false,
        timer: 3000,
      });
  }

  //! -------- 400 = Debe proporcionar el nuevo estado del pedido
  if (res?.response?.status == 400) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Debe proporcionar el nuevo estado del pedido.',
      showConfirmButton: false,
      timer: 1500,
    });

    //! -------- 404 = Pedido no encontrado
    if (res?.response?.status == 404) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Pedido no encontrado.',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }
};
