import Swal from 'sweetalert2/dist/sweetalert2.all.js';
export const useEliminarPedidoUsuarioError = (res, setRes, setOkDelete) => {
  //? si la respuesta es ok ---- > directamente esta el status en la primera clave es decir: res.status
  //? si la respuesta no esta ok--> res.response.status

  //! ------------------ 200
  if (res?.status == 200) {
    Swal.fire({
      icon: 'success',
      title: 'Eliminar pedido',
      text: 'Pedido eliminado con éxito',
      showConfirmButton: false,
      timer: 1500,
    });
    setRes({});
    setOkDelete(true);
  }

  //! ------------------- 404: Pedido no encontrado)

  if (res?.response?.data?.includes('Pedido no encontrado.')) {
    Swal.fire({
      icon: 'error',
      title: 'Eliminar pedido',
      text: 'No se ha podido encontrar el pedido',
      showConfirmButton: false,
      timer: 2500,
    });
    setRes(() => {});
  }

  //! ------------------- 404: Usuario no encontrado
  if (res?.response?.data?.includes('Usuario no encontrado.')) {
    Swal.fire({
      icon: 'error',
      title: 'Eliminar pedido',
      text: 'No se ha podido encontrar el pedido',
      showConfirmButton: false,
      timer: 2500,
    });
    setRes(() => {});
  }
  //! ------------------- 400: Estado del pedido != pendiente

  if (res?.response?.data?.includes('Solo se pueden eliminar los pedidos pendientes.')) {
    Swal.fire({
      icon: 'error',
      title: 'Eliminar pedido',
      text: 'Solo se pueden eliminar los pedidos pendientes.',
      showConfirmButton: false,
      timer: 2500,
    });
    setRes(() => {});
  }

  //! ---------------------- 500: interval server error
  if (res?.response?.status == 500) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Error interno del servidor.❎!',
      showConfirmButton: false,
      timer: 1500,
    });
    setRes(() => {});
  }
};
