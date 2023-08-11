import Swal from 'sweetalert2/dist/sweetalert2.all.js';
export const useLoginError = (res, setLoginOk, userLogin, setRes) => {
  //? si la respuesta es ok ---- > directamente esta el status en la primera clave es decir: res.status
  //? si la respuesta no esta ok--> res.response.status
  //! ------------------ 200 : todo ok
  if (res?.status == 200) {
    const dataCustom = {
      token: res.data.token,
      user: res.data.user.name,
      email: res.data.user.email,
      _id: res.data.user._id,
      imagen: res.data.user.imagen,
      check: res.data.user.check,
      rol: res.data.user.rol,
    };
    const dataString = JSON.stringify(dataCustom);
    userLogin(dataString);
    setLoginOk(() => true);
    Swal.fire({
      icon: 'success',
      title: 'Bienvenido/a',
      text: 'Sesión Iniciada✅',
      showConfirmButton: false,
      timer: 1500,
    });
  }

  //! ------------------- 404: 'password dont match'

  if (res?.response?.data?.includes('Invalid password')) {
    setRes(() => {});
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Las contraseñas no coinciden ❎',
      showConfirmButton: false,
      timer: 1500,
    });
  }

  //! ------------------- 404: 'User no register'
  if (res?.response?.data?.includes('User not found')) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Usuario no encontrado ❎',
      showConfirmButton: false,
      timer: 1500,
    });
    setRes(() => {});
  }

  //! --------------------500: INTERNAL SERVER ERROR
  if (res?.response?.status == 500) {
    setRes(() => {});
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Error interno del servidor ❎!',
      showConfirmButton: false,
      timer: 1500,
    });
  }
};
