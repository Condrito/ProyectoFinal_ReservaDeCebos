import Swal from 'sweetalert2/dist/sweetalert2.all.js';
export const useCheckCodeError = (
  res,
  setDeleteUser,
  setOkCheck,
  setUser,
  setReloadPageError,
  setRes,
) => {
  //? si la respuesta es ok ---- > directamente esta el status en la primera clave es decir: res.status
  //? si la respuesta no esta ok--> res.response.status

  //! ------------------ 200 : todo ok ---> testCheckOk: true
  if (res?.data?.testCheckOk?.toString() == 'true') {
    // comprobamos que vengas del login con el localStorage
    if (localStorage.getItem('user')) {
      const currentUser = localStorage.getItem('user');
      const parseCurrentUser = JSON.parse(currentUser);
      const customUser = {
        ...parseCurrentUser,
        check: true,
      };
      // como quiero volver a meterlo al local tengo que volver a convertirlo en un string
      const customUserString = JSON.stringify(customUser);
      setUser(() => customUser);
      localStorage.setItem('user', customUserString);
    }
    setOkCheck(() => true);
    Swal.fire({
      icon: 'success',
      title: 'Código correcto ✅',
      showConfirmButton: false,
      timer: 1500,
    });
  }
  //! ------------------ 200 : todo ok ---> testCheckOk: false
  if (res?.data?.testCheckOk?.toString() == 'false') {
    Swal.fire({
      icon: 'error',
      title: 'Error interno del servidor. ❎.',
      text: 'Usuario no eliminado. Inténtalo de nuevo, por favor.',
      showConfirmButton: false,
      timer: 2500,
    });
    setRes(() => {});
  }

  //! ------------------- 200: usuario borrado includes('error delete user')

  if (res?.data?.delete?.includes('error delete user')) {
    Swal.fire({
      icon: 'error',
      title: 'Código Incorrecto ❎.',
      text: 'Usuario no eliminado. Inténtalo de nuevo, por favor.',
      showConfirmButton: false,
      timer: 2500,
    });
    setRes(() => {});
  }
  //! ------------------- 200: usuario no borrado includes ('ok delete user')
  if (res?.data?.delete?.includes('ok delete user')) {
    setDeleteUser(() => true);
    Swal.fire({
      icon: 'error',
      title: 'Código Incorrecto ❎.',
      text: 'Usuario eliminado. Regístrate nuevamente, por favor.',
      showConfirmButton: false,
      timer: 2500,
    });
    setRes(() => {});
  }

  //! -------------------- 404: 'User not found' --> mi amigo a recargado la pagina allUser se ha reseteado no tengo el emaial
  //! ----------------------------> usuario se lleva por la via del login

  if (res?.response?.data?.includes('User not found')) {
    setReloadPageError(() => true);
    Swal.fire({
      icon: 'error',
      title: 'Error interno del servidor. ❎.',
      text: 'Usuario no eliminado. Inténtalo de nuevo, por favor.',
      showConfirmButton: false,
      timer: 1500,
    });

    setRes(() => {});
  }
  //!  -------------------- 404: random error.message, de la parte de la actualizacion del user
  if (res?.response?.status == 404) {
    Swal.fire({
      icon: 'error',
      title: 'Error interno del servidor. ❎.',
      text: 'Usuario no eliminado. Inténtalo de nuevo, por favor.',
      showConfirmButton: false,
      timer: 1500,
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
