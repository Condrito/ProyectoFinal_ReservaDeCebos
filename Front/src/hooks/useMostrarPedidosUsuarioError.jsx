import Swal from 'sweetalert2/dist/sweetalert2.all.js';

export const useMostrarPedidosUsuarioError = (res, setError) => {
  //! -------- 404 = 'Usuario no encontrado'
  if (res?.response?.status == 404) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'No tienes ningún pedido en tu lista de pedidos.',
      showConfirmButton: false,
      timer: 3000,
    });

    setError(() => true);
  }
};
