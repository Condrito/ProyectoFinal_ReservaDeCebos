import { updateToken } from '../utils/updateToken';
import { APIuser } from './serviceApiUser.config';

//--------------------------------------------------------------------------------
//·······································CATALOGO··································
//--------------------------------------------------------------------------------

//! ------------------------------- MOSTRAR CATALOGO -----------------------------------
export const mostrarCatalogo = async () => {
  return APIuser.get(`/cebo/getall`, {
    headers: { Authorization: `Bearer ${updateToken()}` },
  })
    .then((res) => res)
    .catch((error) => error);
};

//! ------------------------------- MOSTRAR CEBO POR ID -----------------------------------
export const mostrarCeboId = async (ceboId) => {
  return APIuser.get(`/cebo/getbyid/${ceboId}`, {
    headers: { Authorization: `Bearer ${updateToken()}` },
  })
    .then((res) => res)
    .catch((error) => error);
};

//! ------------------------------- ACTUALIZAR CEBO POR ID -----------------------------------
export const actualizarCebo = async (formData, ceboId) => {
  return APIuser.patch(`/cebo/updatecebo/${ceboId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${updateToken()}`,
    },
  })
    .then((res) => res)
    .catch((error) => error);
};

//! ------------------------------- ELIMINAR CEBO -----------------------------------
export const eliminarCebo = async (ceboId) => {
  return APIuser.delete(`/cebo/${ceboId}`, {
    headers: {
      Authorization: `Bearer ${updateToken()}`,
    },
  })
    .then((res) => res)
    .catch((error) => error);
};

//! ------------------------------- CREAR CEBO -----------------------------------
export const crearCebo = async (formData) => {
  console.log(formData);
  return APIuser.post(`/cebo/addcebo`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${updateToken()}`,
    },
  })
    .then((res) => res)
    .catch((error) => error);
};
