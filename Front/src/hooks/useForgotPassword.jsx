import Swal from 'sweetalert2/dist/sweetalert2.all.js';
export const useForgotPassword = (res, setRes, setForgotOk) => {
  //! -------- 200 ={ updateUser: true, sendPassword: true}
  if (res?.status == 200) {
    if (res?.data?.sendPassword == true && res?.data?.updateUser == true) {
      setForgotOk(() => true);
      setRes(() => ({}));
      Swal.fire({
        icon: 'success',
        title: 'Cambio de contraseña',
        text: 'Correo electrónico enviado con tu nueva contraseña. ✅',
        showConfirmButton: false,
        timer: 3000,
      });
    }
  }

  //! -------- 404 = { updateUser: false, sendPassword: true}
  if (
    res?.response?.data?.sendPassword == true &&
    res?.response?.data?.updateUser == false
  ) {
    setRes(() => ({}));
    Swal.fire({
      icon: 'error',
      title: 'Error de envío, correo electrónico incorrecto.',
      text: 'La contraseña no ha sido cambiada, tu correo electrónico no es válido.❎',
      showConfirmButton: false,
      timer: 1500,
    });
  }
  //! -------- 404 = 'User no register'

  if (res?.response?.data?.includes('User no register')) {
    setRes(() => ({}));
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Ingresa una dirección de correo electrónico válida. ❎',
      showConfirmButton: false,
      timer: 3000,
    });
  }

  //! -------- 404 = 'dont send email and dont update user'
  if (res?.response?.data?.includes('dont send email and dont update user')) {
    setRes(() => ({}));
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'No se ha actualizado la contraseña. ❎ Inténtalo de nuevo, por favor.',
      showConfirmButton: false,
      timer: 3000,
    });
  }

  //! -------- 500 = interval server error
  if (res?.response?.status == 500) {
    setRes(() => ({}));
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Error interno del servidor. ❎ Inténtalo de nuevo, por favor.',
      showConfirmButton: false,
      timer: 1500,
    });
  }
};
