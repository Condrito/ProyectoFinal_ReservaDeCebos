const express = require('express');
const { isAuthAdmin, isAuth } = require('../../middlewares/auth.middleware');
const { uploadCebo } = require('../../middlewares/filesCebo.middleware');
const {
  añadirAlCatalogo,
  updateCebo,
  deleteCebo,
  getAllCebo,
  getByNameCebo,
  getByIdCebo,
} = require('../controllers/cebos.controller');

const CeboRoutes = express.Router();

CeboRoutes.post(
  '/addcebo',
  uploadCebo.single('imagen'),
  [isAuthAdmin],
  añadirAlCatalogo
);

CeboRoutes.patch(
  '/updatecebo/:id',
  uploadCebo.single('imagen'),
  [isAuthAdmin],
  updateCebo
);

CeboRoutes.delete('/:id', [isAuthAdmin], deleteCebo);
CeboRoutes.get('/getall', [isAuth], getAllCebo);
CeboRoutes.get('/getbyname/:ceboVivo', [isAuth], getByNameCebo);
CeboRoutes.get('/getbyid/:id', [isAuth], getByIdCebo);

module.exports = CeboRoutes;
