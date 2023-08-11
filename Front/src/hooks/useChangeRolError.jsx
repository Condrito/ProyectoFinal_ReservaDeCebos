import Swal from 'sweetalert2/dist/sweetalert2.all.js';
export const useChangeRolError = (res) => {
  //! -------- 200
  if (res?.status == 200) {
    Swal.fire({
      icon: 'success',
      title: 'Cambio de rol',
      text: 'Rol del usuario actualizado con éxito.',
      showConfirmButton: false,
      timer: 3000,
    });
  }

  //! -------- 400 = rol no valido
  if (res?.response?.status == 400) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Debes introducir un rol valido.',
      showConfirmButton: false,
      timer: 1500,
    });

    //! -------- 404 = usuario no encontrado
    if (res?.response?.status == 404) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Usuario no encontrado.',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }
};
