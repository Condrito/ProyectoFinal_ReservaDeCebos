import Swal from 'sweetalert2/dist/sweetalert2.all.js';

export const useCrearPedidoError = (res) => {
  if (res?.status === 200) {
    Swal.fire({
      icon: 'success',
      title: 'Realizar pedido',
      text: 'Pedido realizado con éxito',
      showConfirmButton: false,
      timer: 3000,
    });
  } else if (res?.response?.status === 400) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Fecha introducida no válida.',
      showConfirmButton: false,
      timer: 1500,
    });
  } else if (res?.response?.status === 500) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'El pedido no se ha podido guardar',
      showConfirmButton: false,
      timer: 1500,
    });
  }
};
