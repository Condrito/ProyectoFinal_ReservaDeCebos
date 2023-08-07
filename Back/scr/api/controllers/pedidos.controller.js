const Pedido = require('../models/pedido.model');
const Cebo = require('../models/cebo.model');
const Reserva = require('../models/reserva.model');
const Stock = require('../models/stock.model');
const User = require('../models/user.model');
const {
  esFechaValida,
  obtenerFechaActual,
  obtenerHoraActual,
} = require('../../utils/FechaYHoraActual');

const { format } = require('date-fns');
const { es } = require('date-fns/locale');
const enviarCorreo = require('../../utils/enviarCorreo');
//--------------------------------------------------------------------------------
//····································CREAR PEDIDO································
//--------------------------------------------------------------------------------

const crearPedido = async (req, res, next) => {
  try {
    // Extraemos el cebo de los parámetros de la solicitud
    const { idCebo } = req.params;

    // Extraemos el user del middleware que verifica el token de acceso
    const user = req.user;

    // Extraemos los datos adicionales del pedido del cuerpo de la solicitud
    const { fechaDelPedido, cantidad, estado } = req.body;

    // Verificamos si la fecha del pedido es válida (antes de las 12 del mediodía del día anterior)
    if (!esFechaValida(fechaDelPedido)) {
      return res.status(400).json({ error: 'Fecha del pedido no válida.' });
    }

    // Creamos un nuevo objeto Pedido con los datos recibidos
    const newPedido = new Pedido({
      user: user._id,
      cebo: idCebo,
      fechaDelPedido,
      cantidad,
      estado,
    });

    // Guardamos el nuevo pedido en la base de datos
    const pedidoGuardado = await newPedido.save();

    // Verificamos si el pedido se ha guardado correctamente
    if (pedidoGuardado) {
      // Agregamos el ID del nuevo pedido al array de pedidos del usuario

      await User.findByIdAndUpdate(user._id, {
        $push: { pedidos: pedidoGuardado._id },
      });

      return res.status(200).json(pedidoGuardado);
    } else {
      return res.status(500).json({ error: 'Error al guardar el pedido.' });
    }
  } catch (error) {
    return next(error);
  }
};

//--------------------------------------------------------------------------------
//································BORRAR PEDIDO···································
//--------------------------------------------------------------------------------

const borrarPedido = async (req, res, next) => {
  try {
    const { idPedido } = req.params;

    // Buscar el pedido en la base de datos
    const pedido = await Pedido.findById(idPedido);

    // Verificar si el pedido existe
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado.' });
    } else {
      // Verificar si el estado del pedido es "confirmado"
      if (pedido.estado === 'confirmado') {
        return res
          .status(400)
          .json({ error: 'No se puede borrar un pedido confirmado.' });
      }

      // Buscar el usuario asociado al pedido
      const user = await User.findById(pedido.user);

      // Verificar si el usuario existe
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }

      // Buscar el índice del pedido en el array de pedidos del usuario
      const pedidoIndex = user.pedidos.indexOf(idPedido);

      // Verificar si el pedido está en el array de pedidos del usuario
      if (pedidoIndex === -1) {
        return res
          .status(404)
          .json({ error: 'Pedido no encontrado en el usuario.' });
      }

      // Eliminar el pedido del array de pedidos del usuario
      user.pedidos.splice(pedidoIndex, 1);

      // Guardar los cambios en el usuario para que se reflejen en la base de datos
      await user.save();

      // Eliminar el pedido de la base de datos
      await Pedido.findByIdAndDelete(idPedido);

      return res
        .status(200)
        .json({ message: 'Pedido cancelado y eliminado correctamente.' });
    }
  } catch (error) {
    return next(error);
  }
};

//--------------------------------------------------------------------------------
//························CONFIRMAR O CANCELAR PEDIDO·····························
//--------------------------------------------------------------------------------

// Controlador para actualizar el estado del pedido
const actualizarEstadoPedido = async (req, res, next) => {
  try {
    const { idPedido } = req.params;
    const { mensaje } = req.body;

    // Buscar el pedido en la base de datos
    const pedido = await Pedido.findById(idPedido);

    // Verificar si el pedido existe
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado.' });
    }

    // Verificar si se proporciona el nuevo estado en el req.body
    if (!req.body.estado) {
      return res
        .status(400)
        .json({ error: 'Debe proporcionar el nuevo estado del pedido.' });
    }
    if (pedido) {
      // Cambiar el estado del pedido
      pedido.estado = req.body.estado;
      await pedido.save();
      const userEmail = await User.findById(pedido.user);
      const ceboPedido = await Cebo.findById(pedido.cebo);

      // Formatear la fecha del pedido en español y solo con el día
      const fechaPedido = format(
        new Date(pedido.fechaDelPedido),
        'EEEE, d MMMM yyyy',
        {
          locale: es,
        }
      );

      // Enviar correo electrónico si el pedido fue confirmado o cancelado
      if (pedido.estado === 'confirmado') {
        enviarCorreo(
          userEmail.email,
          'Confirmación de Pedido',
          `Su pedido de ${pedido.cantidad} de ${ceboPedido.ceboVivo} para el ${fechaPedido} ha sido confirmado. ${mensaje}`
        );
      }
      if (pedido.estado === 'cancelado') {
        enviarCorreo(
          userEmail.email,
          'Cancelación de Pedido',
          `Su pedido de ${pedido.cantidad} de ${ceboPedido.ceboVivo}  para el ${fechaPedido} ha sido cancelado. ${mensaje}`
        );
      }
    }

    // Redirigir al controlador "stockage" para actualizar el stock
    res.redirect(`http://localhost:8000/api/v1/stock/${pedido.cebo}`);
  } catch (error) {
    return next(error);
  }
};

//--------------------------------------------------------------------------------
//····································GET ALL PEDIDOS·····························
//--------------------------------------------------------------------------------

const getAllPedidos = async (req, res, next) => {
  try {
    const pedidos = await Pedido.find().populate('user').populate('cebo');
    if (pedidos) {
      return res.status(200).json(pedidos);
    } else {
      return res.status(404).json('No se encontraron pedidos.');
    }
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  crearPedido,
  actualizarEstadoPedido,
  borrarPedido,
  getAllPedidos,
};
