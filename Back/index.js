//! ------- CREAMOS EL SERVIDOR WEB CON EXPRESS -------------

const express = require('express');
const dotenv = require('dotenv');
const connect = require('./scr/utils/db');
const { configCloudinary } = require('./scr/middlewares/files.middleware');

dotenv.config();

//! ------TRAERNOS EL PORT, CREAR EL SERVER WEB Y POR ULTIMO CONECTAR LA DB Y CONFIGURAR CLOUDINARY
const PORT = process.env.PORT;
configCloudinary();
const app = express();
connect();

//! --------CONFIGURAMOS LAS CORS QUE SON LOS LIMITES AL ACCESO DE NUESTRA API
const cors = require('cors');

app.use(cors());

app.use((req, res, next) => {
  // con el asterisco les estamos diendo en la header que puede entrar a nuestro backend cualquier cliente
  res.header('Access-Control-Allow-Origen', '*');

  // Primero decimos que las header ayudar a  controlar el acceso de nuestra api
  //Segundo puede haber authorizaciones mediante las request que acepten un contenido concreto en nuestra api
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization, X-API-KEY, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'
  );
  /// VERBOS  PERMITIDOS EN NUESTRA
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  res.header('Allow', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  next();
});

//! ----- DECIRLE EL TIPO DE SERVE WEB QUE VAMOS A TENER, UNA CONFIG BASICA INICIAL -----
// Json Data
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: false }));

//! ------ LAS ROUTAS -------------------------------------------

const UserRoutes = require('./scr/api/routes/user.routes');
const CeboRoutes = require('./scr/api/routes/cebo.routes');
const StockRoutes = require('./scr/api/routes/stock.routes');
const PedidoRoutes = require('./scr/api/routes/pedido.routes');
const ReservaRoutes = require('./scr/api/routes/reserva.routes');

app.use('/api/v1/users', UserRoutes);
app.use('/api/v1/cebo', CeboRoutes);
app.use('/api/v1/stock', StockRoutes);
app.use('/api/v1/pedido', PedidoRoutes);
app.use('/api/v1/reserva', ReservaRoutes);

app.use('*', (req, res, next) => {
  const error = new Error('Route not found');
  error.status = 404;
  next(error);
});

//! ------VAMOS A ESCUCHAR EL SERVIDOR WEB EN SU PUERTO CORRESPONDIENTE------

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
