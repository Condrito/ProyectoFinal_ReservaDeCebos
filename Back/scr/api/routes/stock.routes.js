const express = require('express');
const { isAuthAdmin, isAuth } = require('../../middlewares/auth.middleware');

const {
  stockage,
  crearStock,
  modificarStock,
  inventario,
} = require('../controllers/stocks.controller');

const StockRoutes = express.Router();

StockRoutes.patch('/:idCebo', [isAuthAdmin], stockage);
StockRoutes.patch('/inventario/:idCebo', [isAuthAdmin], inventario);
StockRoutes.patch('/modificarstock/:idCebo', [isAuthAdmin], modificarStock);

//·························REDIRECT···························

StockRoutes.post('/crearstock/:idCebo', crearStock);

module.exports = StockRoutes;
