const moment = require('moment-timezone');

const obtenerFechaActual = () => {
  const zonaHoraria = 'Europe/Madrid';
  return moment().tz(zonaHoraria).format('YYYY-MM-DD');
};

const obtenerHoraActual = () => {
  const zonaHoraria = 'Europe/Madrid';
  return moment().tz(zonaHoraria).format('HH:mm:ss');
};

const esFechaValida = (fecha) => {
  const fechaPedido = new Date(fecha);
  const fechaActual = new Date();
  const fechaLimite = new Date(fechaActual);
  const fechaLimiteSieteDias = new Date(fechaActual);

  fechaLimite.setHours(12, 0, 0, 0); // Establecer la hora límite a las 12:00 del mediodía en la zona horaria local
  fechaLimiteSieteDias.setDate(fechaActual.getDate() + 7); // Agregar 7 días a la fecha actual en la zona horaria local

  console.log('Fecha actual:', fechaActual.toLocaleString());
  console.log('Fecha límite:', fechaLimite.toLocaleString());
  console.log('Fecha límite + 7 días:', fechaLimiteSieteDias.toLocaleString());
  console.log('Fecha del pedido:', fechaPedido.toLocaleString());

  if (fechaActual.getTime() > fechaLimite.getTime()) {
    fechaLimite.setDate(fechaLimite.getDate() + 1); // Incrementar la fecha límite en un día
  }

  return fechaPedido > fechaLimite && fechaPedido <= fechaLimiteSieteDias;
};

module.exports = {
  obtenerFechaActual,
  obtenerHoraActual,
  esFechaValida,
};
