import Swal from 'sweetalert2/dist/sweetalert2.all.js';
export const useEntregaPedidoError = (res) => {
  //! -------- 200
  if (res?.status == 200) {
    Swal.fire({
      icon: 'success',
      title: 'Entregar pedido',
      text: 'Pedido entregado.',
      showConfirmButton: false,
      timer: 3000,
    });
  }

  //! -------- 400 = pedido no confirmado
  if (res?.response?.status == 400) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'El pedido no está confirmado y no puede ser entregado.',
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
