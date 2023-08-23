import { updateToken } from '../utils/updateToken';
import { APIuser } from './serviceApiUser.config';

//--------------------------------------------------------------------------------
//··························CATALOGO CON STOCK DISPONIBLE··························
//--------------------------------------------------------------------------------

//! ------------------------------- MOSTRAR CATALOGO CON STOCK DISPONIBLE-----------------------------------
export const mostrarCatalogoConStock = async () => {
  return APIuser.get(`/stock/getavailablecebos`, {
    headers: { Authorization: `Bearer ${updateToken()}` },
  })
    .then((res) => res)
    .catch((error) => error);
};
//! ------------------------------- REALIZAR INVENTARIO (Nuevo stock total) -----------------------------------
export const inventario = async (formData, ceboId) => {
  return APIuser.patch(`/stock/inventario/${ceboId}`, formData, {
    headers: { Authorization: `Bearer ${updateToken()}` },
  })
    .then((res) => res)
    .catch((error) => error);
};
