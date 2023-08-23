import Swal from 'sweetalert2/dist/sweetalert2.all.js';
export const useEliminarCeboError = (res, setRes, setOkDelete) => {
  //? si la respuesta es ok ---- > directamente esta el status en la primera clave es decir: res.status
  //? si la respuesta no esta ok--> res.response.status

  //! ------------------ 200
  if (res?.status == 200) {
    Swal.fire({
      icon: 'success',
      title: 'Eliminar cebo',
      text: 'Cebo eliminado del catálogo con éxito',
      showConfirmButton: false,
      timer: 1500,
    });
    setRes({});
    setOkDelete(true);
  }

  //! ------------------- 404: Cebo no encontrado)

  if (res?.response?.status == 404) {
    Swal.fire({
      icon: 'error',
      title: 'Eliminar cebo',
      text: 'Cebo no encontrado.',
      showConfirmButton: false,
      timer: 2500,
    });
    setRes(() => {});
  }

  //! ------------------- 409: Cebo con pedidos o reservas pendientes o confirmadas
  if (res?.response?.status == 409) {
    Swal.fire({
      icon: 'error',
      title: 'Eliminar cebo',
      text: 'No se puede eliminar el cebo con pedidos o reservas con estado pendiente o confirmado/a',
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
