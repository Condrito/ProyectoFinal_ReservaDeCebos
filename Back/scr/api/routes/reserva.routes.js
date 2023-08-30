const express = require('express');
const { isAuthAdmin, isAuth } = require('../../middlewares/auth.middleware');

const {
  crearReserva,
  actualizarEstadoReserva,
  borrarReserva,
  getAllReservas,
  entregarReserva,
} = require('../controllers/reservas.controller');

const ReservaRoutes = express.Router();

ReservaRoutes.post('/crearreserva/:idCebo', [isAuth], crearReserva);
ReservaRoutes.delete('/borrarreserva/:idReserva', borrarReserva);
ReservaRoutes.patch(
  '/actualizarestadoreserva/:idReserva',
  [isAuthAdmin],
  actualizarEstadoReserva
);
ReservaRoutes.get('/getallreservas', [isAuth], getAllReservas);
ReservaRoutes.patch(
  '/entregarreserva/:idReserva',
  [isAuthAdmin],
  entregarReserva
);

module.exports = ReservaRoutes;
