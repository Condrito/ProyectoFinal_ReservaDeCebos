import Swal from 'sweetalert2/dist/sweetalert2.all.js';

export const useMostrarTodosPedidosError = (res, setError) => {
  //! -------- 404 = 'Usuario no encontrado'
  if (res?.response?.status == 404) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'No hay pedidos para mostrar.',
      showConfirmButton: false,
      timer: 3000,
    });

    setError(() => true);
  }
};
