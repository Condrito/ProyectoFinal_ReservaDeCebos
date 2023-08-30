const Pedido = require('../models/pedido.model');
const Cebo = require('../models/cebo.model');
const User = require('../models/user.model');
const { esFechaValida } = require('../../utils/FechaYHoraActual');

const { format } = require('date-fns');
const { es } = require('date-fns/locale');
const enviarCorreo = require('../../utils/enviarCorreo');
const Stock = require('../models/stock.model');
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
      await Cebo.findByIdAndUpdate(idCebo, {
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
      // Verificar si el estado del pedido es diferente a "pendiente"
      if (pedido.estado !== 'pendiente') {
        return res
          .status(400)
          .json({ error: 'Solo se pueden eliminar los pedidos pendientes.' });
      }

      const user = await User.findById(pedido.user);

      // Verificar si el usuario existe
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }
      const arrayPedidos = user.pedidos;

      // Eliminar el pedido del array de pedidos del usuario
      arrayPedidos.pull(idPedido);

      await User.findByIdAndUpdate(user._id, { pedidos: arrayPedidos });

      // No es necesario guardar los cambios en el usuario, ya que se actualizan automáticamente

      // Eliminar el pedido de la base de datos
      await Pedido.findByIdAndDelete(idPedido);

      return res
        .status(200)
        .json({ message: 'Pedido eliminado correctamente.' });
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
//······························GET ALL PEDIDOS (ADMIN)···························
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
//--------------------------------------------------------------------------------
//······························GET ALL USER'S PEDIDOS (USER)···························
//--------------------------------------------------------------------------------

const getAllPedidosByUser = async (req, res, next) => {
  try {
    // Recuperar el ID del usuario actual del req.user
    const userId = req.user._id;

    // Buscar todos los pedidos asociados al usuario en la base de datos,
    // y populamos el campo 'cebo' para obtener todos sus atributos
    const pedidos = await Pedido.find({ user: userId }).populate('cebo');

    // Verificar si se encontraron pedidos
    if (pedidos.length === 0) {
      return res
        .status(404)
        .json({ message: 'No se encontraron pedidos para este usuario.' });
    }

    // Devolver los pedidos en la respuesta
    return res.status(200).json(pedidos);
  } catch (error) {
    // Manejar errores
    return next(error);
  }
};
//--------------------------------------------------------------------------------
//····································ENTREGAR PEDIDO·····························
//--------------------------------------------------------------------------------

const entregarPedido = async (req, res, next) => {
  try {
    const { idPedido } = req.params;

    // Buscar el pedido en la base de datos
    const pedido = await Pedido.findById(idPedido);

    // Verificar si el pedido existe
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado.' });
    }

    // Verificar si el pedido tiene el estado "confirmado"
    if (pedido.estado !== 'confirmado') {
      return res.status(400).json({
        error: 'El pedido no está confirmado y no puede ser entregado.',
      });
    }

    // Buscar el modelo de Stock asociado al pedido y popúlalo
    const stock = await Stock.findOne({ cebo: pedido.cebo });

    // Verificar si se encontró el stock
    if (!stock) {
      return res
        .status(404)
        .json({ error: 'Stock no encontrado para el cebo del pedido.' });
    }

    // Restar la cantidad del pedido al stockTotal
    stock.stockTotal -= pedido.cantidad;

    // Guardar los cambios en el modelo de Stock
    await stock.save();

    // Cambiar el estado del pedido a "entregado"
    pedido.estado = 'entregado';

    // Guardar los cambios en el pedido
    await pedido.save();

    // Redirigir al controlador "stockage" para actualizar el stock
    res.redirect(`http://localhost:8000/api/v1/stock/${pedido.cebo}`);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  crearPedido,
  actualizarEstadoPedido,
  borrarPedido,
  getAllPedidos,
  getAllPedidosByUser,
  entregarPedido,
};
