const Reserva = require('../models/reserva.model');
const Cebo = require('../models/cebo.model');
const Stock = require('../models/stock.model');
const User = require('../models/user.model');
const {
  obtenerFechaActual,
  obtenerHoraActual,
} = require('../../utils/FechaYHoraActual');

const enviarCorreo = require('../../utils/enviarCorreo');

//--------------------------------------------------------------------------------
//····································CREAR RESERVA·······························
//--------------------------------------------------------------------------------
const crearReserva = async (req, res, next) => {
  try {
    // Extraemos el cebo de los parámetros de la solicitud
    const { idCebo } = req.params;

    // Extraemos el user del middleware que verifica el token de acceso
    const user = req.user;

    // Extraemos los datos adicionales de la reserva del cuerpo de la solicitud
    const { cantidad } = req.body;

    // Obtenemos la fecha y hora actual
    const fechaActual = obtenerFechaActual();
    const horaActual = obtenerHoraActual();

    // Creamos un nuevo objeto Reserva con los datos recibidos
    const newReserva = new Reserva({
      user: user._id,
      cebo: idCebo,
      fechaDeLaReserva: fechaActual,
      horaDeLaReserva: horaActual,
      cantidad,
    });

    // Guardamos la nueva reserva en la base de datos
    const reservaGuardada = await newReserva.save();

    // Verificamos si la reserva se ha guardado correctamente
    if (reservaGuardada) {
      // Agregamos el ID de la nueva reserva al array de reservas del usuario

      await User.findByIdAndUpdate(user._id, {
        $push: { reservas: reservaGuardada._id },
      });

      return res.status(200).json(reservaGuardada);
    } else {
      return res.status(500).json({ error: 'Error al guardar la reserva.' });
    }
  } catch (error) {
    return next(error);
  }
};

//--------------------------------------------------------------------------------
//··································BORRAR RESERVA·································
//--------------------------------------------------------------------------------

const borrarReserva = async (req, res, next) => {
  try {
    const { idReserva } = req.params;

    // Buscar la reserva en la base de datos
    const reserva = await Reserva.findById(idReserva);

    // Verificar si la reserva existe
    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada.' });
    } else {
      // Verificar si el estado de la reserva es "confirmado"
      if (reserva.estado === 'confirmado') {
        return res
          .status(400)
          .json({ error: 'No se puede borrar una reserva confirmada.' });
      }

      const user = await User.findById(reserva.user);

      // Verificar si el usuario existe
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }
      const arrayReservas = user.reservas;

      // Eliminar la reserva del array de reservas del usuario
      arrayReservas.pull(idReserva);

      await User.findByIdAndUpdate(user._id, { reservas: arrayReservas });

      // Eliminar la reserva de la base de datos
      await Reserva.findByIdAndDelete(idReserva);
      return res
        .status(200)
        .json({ message: 'Reserva cancelada y eliminada correctamente.' });
    }
  } catch (error) {
    return next(error);
  }
};

//--------------------------------------------------------------------------------
//························CONFIRMAR O CANCELAR RESERVA·····························
//--------------------------------------------------------------------------------
// Controlador para actualizar el estado de la reserva
const actualizarEstadoReserva = async (req, res, next) => {
  try {
    const { idReserva } = req.params;
    const { mensaje } = req.body;

    // Buscar la reserva en la base de datos
    const reserva = await Reserva.findById(idReserva);

    // Verificar si la reserva existe
    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada.' });
    }

    // Verificar si se proporciona el nuevo estado en el req.body
    if (!req.body.estado) {
      return res
        .status(400)
        .json({ error: 'Debe proporcionar el nuevo estado de la reserva.' });
    }
    if (reserva) {
      // Cambiar el estado de la reserva
      reserva.estado = req.body.estado;
      await reserva.save();
      const userEmail = await User.findById(reserva.user);
      const ceboReserva = await Cebo.findById(reserva.cebo);

      // Enviar correo electrónico si la reserva fue confirmada o cancelada
      if (reserva.estado === 'confirmada') {
        enviarCorreo(
          userEmail.email,
          'Confirmación de Reserva',
          `Su reserva de ${reserva.cantidad} de ${ceboReserva.ceboVivo} ha sido confirmada. ${mensaje}`
        );
      }
      if (reserva.estado === 'cancelada') {
        enviarCorreo(
          userEmail.email,
          'Cancelación de Reserva',
          `Su reserva de ${reserva.cantidad} de ${ceboReserva.ceboVivo} ha sido cancelada. ${mensaje}`
        );
      }
    }

    // Redirigir al controlador "stockage" para actualizar el stock
    res.redirect(`http://localhost:8000/api/v1/stock/${reserva.cebo}`);
  } catch (error) {
    return next(error);
  }
};

//--------------------------------------------------------------------------------
//··································GET ALL RESERVAS·······························
//--------------------------------------------------------------------------------

const getAllReservas = async (req, res, next) => {
  try {
    const reservas = await Reserva.find().populate('user').populate('cebo');
    if (reservas) {
      return res.status(200).json(reservas);
    } else {
      return res.status(404).json('No se encontraron reservas.');
    }
  } catch (error) {
    return next(error);
  }
};
//--------------------------------------------------------------------------------
//····································ENTREGAR RESERVA·····························
//--------------------------------------------------------------------------------

const entregarReserva = async (req, res, next) => {
  try {
    const { idReserva } = req.params;

    // Buscar la reserva en la base de datos
    const reserva = await Reserva.findById(idReserva);

    // Verificar si la reserva existe
    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada.' });
    }

    // Verificar si la reserva tiene el estado "confirmada"
    if (reserva.estado !== 'confirmada') {
      return res.status(400).json({
        error: 'La reserva no está confirmada y no puede ser entregada.',
      });
    }

    // Buscar el modelo de Stock asociado la reserva y popúlalo
    const stock = await Stock.findOne({ cebo: reserva.cebo });

    // Verificar si se encontró el stock
    if (!stock) {
      return res
        .status(404)
        .json({ error: 'Stock no encontrado para el cebo de la reserva.' });
    }

    // Restar la cantidad de la reserva al stockTotal
    stock.stockTotal -= reserva.cantidad;

    // Guardar los cambios en el modelo de Stock
    await stock.save();

    // Cambiar el estado del pedido a "entregado"
    reserva.estado = 'entregada';

    // Guardar los cambios en el pedido
    await reserva.save();

    // Redirigir al controlador "stockage" para actualizar el stock
    res.redirect(`http://localhost:8000/api/v1/stock/${reserva.cebo}`);
  } catch (error) {
    return next(error);
  }
};
module.exports = {
  crearReserva,
  actualizarEstadoReserva,
  borrarReserva,
  getAllReservas,
  entregarReserva,
};
