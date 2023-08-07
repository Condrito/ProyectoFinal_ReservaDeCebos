const express = require('express');
const { isAuthAdmin, isAuth } = require('../../middlewares/auth.middleware');

const {
  crearPedido,
  actualizarEstadoPedido,
  borrarPedido,
  getAllPedidos,
} = require('../controllers/pedidos.controller');

const PedidoRoutes = express.Router();

PedidoRoutes.post('/crearpedido/:idCebo', [isAuth], crearPedido);
PedidoRoutes.delete('/borrarpedido/:idPedido', borrarPedido);
PedidoRoutes.patch(
  '/actualizarestadopedido/:idPedido',
  [isAuthAdmin],
  actualizarEstadoPedido
);
PedidoRoutes.get('/getallpedidos', [isAuthAdmin], getAllPedidos);

module.exports = PedidoRoutes;
