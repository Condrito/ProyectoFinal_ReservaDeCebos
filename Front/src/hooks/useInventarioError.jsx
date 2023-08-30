import Swal from 'sweetalert2/dist/sweetalert2.all.js';

export const useInventarioError = (res) => {
  if (res?.status === 200) {
    Swal.fire({
      icon: 'success',
      title: 'Actualizar Stock',
      text: 'Stock actualizado con éxito',
      showConfirmButton: false,
      timer: 3000,
    });
  } else if (res?.response?.status === 404) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Cebo no encontrado',
      showConfirmButton: false,
      timer: 1500,
    });
  } else if (res?.response?.status === 500) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'No se ha podido guardar el nuevo stock',
      showConfirmButton: false,
      timer: 1500,
    });
  }
};
