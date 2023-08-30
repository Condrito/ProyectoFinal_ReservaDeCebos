import { updateToken } from '../utils/updateToken';
import { APIuser } from './serviceApiUser.config';

//--------------------------------------------------------------------------------
//·······································RESERVAS··································
//--------------------------------------------------------------------------------

//! ------------------------------- CREAR RESERVA -----------------------------------
export const crearReserva = async (formData, ceboId) => {
  return APIuser.post(`/reserva/crearreserva/${ceboId}`, formData, {
    headers: { Authorization: `Bearer ${updateToken()}` },
  })
    .then((res) => res)
    .catch((error) => error);
};

//! ------------------------------- MOSTRAR RESERVAS DEL USUARIO (USER) -----------------------------------

export const mostrarReservasUsuario = async () => {
  return APIuser.get(`/reserva/getallreservas`, {
    headers: { Authorization: `Bearer ${updateToken()}` },
  })
    .then((res) => res)
    .catch((error) => error);
};
//! ------------------------------- BORRAR RESERVA DEL USUARIO (USER) -----------------------------------

export const borrarReservaUsuario = async (reservaId) => {
  return APIuser.delete(`/reserva/borrarreserva/${reservaId}`, {
    headers: { Authorization: `Bearer ${updateToken()}` },
  })
    .then((res) => res)
    .catch((error) => error);
};
//! ------------------------------- MOSTRAR TODAS LOS RESERVAS (ADMIN) -----------------------------------

export const mostrarReservas = async () => {
  return APIuser.get(`/reserva/getallreservas`, {
    headers: { Authorization: `Bearer ${updateToken()}` },
  })
    .then((res) => res)
    .catch((error) => error);
};

//! ------------------------------- CAMBIAR ESTADO RESERVA (ADMIN) -----------------------------------

export const cambiarEstadoReserva = async (formData, reservaId) => {
  return APIuser.patch(`/reserva/actualizarestadoreserva/${reservaId}`, formData, {
    headers: { Authorization: `Bearer ${updateToken()}` },
  })
    .then((res) => res)
    .catch((error) => error);
};

//! ------------------------------- ENTREGAR RESERVAS (ADMIN) -----------------------------------

export const entregarReserva = async (reservaId) => {
  return APIuser.patch(`/reserva/entregarreserva/${reservaId}`, {
    headers: { Authorization: `Bearer ${updateToken()}` },
  })
    .then((res) => res)
    .catch((error) => error);
};
