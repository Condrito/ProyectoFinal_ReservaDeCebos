import Swal from 'sweetalert2/dist/sweetalert2.all.js';
export const useDeleteUserSuperAdminError = (res, setOkDelete) => {
  //! -------- 200
  if (res?.status == 200) {
    Swal.fire({
      icon: 'success',
      title: 'Gestión de cuentas',
      text: 'Usuario eliminado con éxito.',
      showConfirmButton: false,
      timer: 3000,
    });
    setOkDelete(() => true);
  }
  //! -------- 404 = usuario no eliminado
  if (res?.response?.status == 404) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Usuario no eliminado.',
      showConfirmButton: false,
      timer: 1500,
    });
  }
};
