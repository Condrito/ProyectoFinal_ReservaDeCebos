import Swal from 'sweetalert2/dist/sweetalert2.all.js';

export const useCrearCeboError = (res, setNewCeboOk, setRes) => {
  //? si la respuesta es ok ---- > directamente esta el status en la primera clave es decir: res.status
  //? si la respuesta no esta ok--> res.response.status
  //! ------------------ 200 : todo ok y redirecciona a la creacion del stock
  if (res?.status == 201) {
    setNewCeboOk(() => true);

    Swal.fire({
      icon: 'Crear Catálogo',
      title: 'Cebo añadido al catálogo con éxito',
      showConfirmButton: false,
      timer: 1500,
    });
    setRes({});
  }

  //! ------------------- 404 y 400 cebo no creado

  if (res?.response?.status === 404) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'No se ha podido crear la ficha para el cebo',
      showConfirmButton: false,
      timer: 1500,
    });
    setRes({});
  }

  if (res?.response?.status === 400) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'No se ha podido crear la ficha para el cebo',
      showConfirmButton: false,
      timer: 1500,
    });
    setRes({});
  }

  //! -------------------- 500 : internal server error

  if (res?.response?.status == 500) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Error interno del servidor. ❎ Inténtalo de nuevo, por favor.',
      showConfirmButton: false,
      timer: 1500,
    });
    setRes({});
  }
};
