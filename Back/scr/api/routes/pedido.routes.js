const express = require('express');
const { isAuthAdmin, isAuth } = require('../../middlewares/auth.middleware');

const {
  crearPedido,
  actualizarEstadoPedido,
  borrarPedido,
  getAllPedidos,
  getAllPedidosByUser,
  entregarPedido,
} = require('../controllers/pedidos.controller');

const PedidoRoutes = express.Router();

PedidoRoutes.post('/crearpedido/:idCebo', [isAuth], crearPedido);
PedidoRoutes.delete('/borrarpedido/:idPedido', [isAuth], borrarPedido);
PedidoRoutes.patch(
  '/actualizarestadopedido/:idPedido',
  [isAuthAdmin],
  actualizarEstadoPedido
);
PedidoRoutes.patch('/entregarpedido/:idPedido', [isAuthAdmin], entregarPedido);
PedidoRoutes.get('/getallpedidos', [isAuthAdmin], getAllPedidos);
PedidoRoutes.get('/getAllPedidosByUser', [isAuth], getAllPedidosByUser);

module.exports = PedidoRoutes;
