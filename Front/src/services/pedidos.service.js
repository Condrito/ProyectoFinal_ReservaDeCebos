import { updateToken } from '../utils/updateToken';
import { APIuser } from './serviceApiUser.config';

//--------------------------------------------------------------------------------
//·······································PEDIDOS··································
//--------------------------------------------------------------------------------

//! ------------------------------- CREAR PEDIDO -----------------------------------
export const crearPedido = async (formData, ceboId) => {
  return APIuser.post(`/pedido/crearpedido/${ceboId}`, formData, {
    headers: { Authorization: `Bearer ${updateToken()}` },
  })
    .then((res) => res)
    .catch((error) => error);
};

//! ------------------------------- MOSTRAR PEDIDOS DEL USUARIO (USER) -----------------------------------

export const mostrarPedidosUsuario = async () => {
  return APIuser.get(`/pedido/getAllPedidosByUser`, {
    headers: { Authorization: `Bearer ${updateToken()}` },
  })
    .then((res) => res)
    .catch((error) => error);
};

//! ------------------------------- BORRAR PEDIDO DEL USUARIO (USER) -----------------------------------

export const borrarPedidoUsuario = async (pedidoId) => {
  return APIuser.delete(`/pedido/borrarpedido/${pedidoId}`, {
    headers: { Authorization: `Bearer ${updateToken()}` },
  })
    .then((res) => res)
    .catch((error) => error);
};

//! ------------------------------- MOSTRAR TODOS LOS PEDIDOS (ADMIN) -----------------------------------

export const mostrarPedidos = async () => {
  return APIuser.get(`/pedido/getallpedidos`, {
    headers: { Authorization: `Bearer ${updateToken()}` },
  })
    .then((res) => res)
    .catch((error) => error);
};

//! ------------------------------- CAMBIAR ESTADO PEDIDOS (ADMIN) -----------------------------------

export const cambiarEstadoPedido = async (formData, pedidoId) => {
  return APIuser.patch(`/pedido/actualizarestadopedido/${pedidoId}`, formData, {
    headers: { Authorization: `Bearer ${updateToken()}` },
  })
    .then((res) => res)
    .catch((error) => error);
};

//! ------------------------------- ENTREGAR PEDIDOS (ADMIN) -----------------------------------

export const entregarPedido = async (pedidoId) => {
  return APIuser.patch(`/pedido/entregarpedido/${pedidoId}`, {
    headers: { Authorization: `Bearer ${updateToken()}` },
  })
    .then((res) => res)
    .catch((error) => error);
};
