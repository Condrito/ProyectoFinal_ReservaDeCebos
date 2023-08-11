import Swal from 'sweetalert2/dist/sweetalert2.all.js';

export const useUserViewByIdError = (res) => {
  //! -------- 200
  if (res?.status == 200) {
    console.log('perfil del usuario', res);
  }

  //! -------- 404 = 'Usuario no encontrado'
  if (res?.response?.status == 404) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Usuario no encontrado',
      showConfirmButton: false,
      timer: 3000,
    });
  }
};
