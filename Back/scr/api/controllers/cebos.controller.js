const {
  deleteImgCeboCloudinary,
} = require('../../middlewares/filesCebo.middleware');
const Cebo = require('../models/cebo.model');
const dotenv = require('dotenv');
const Stock = require('../models/stock.model');
const Pedido = require('../models/pedido.model');
const Reserva = require('../models/reserva.model');
const User = require('../models/user.model');

dotenv.config();

//--------------------------------------------------------------------------------
//····································CREAR CEBO··································
//--------------------------------------------------------------------------------

const añadirAlCatalogo = async (req, res, next) => {
  let catchImg = req.file?.path;
  try {
    await Cebo.syncIndexes();

    const newCebo = new Cebo(req.body);
    try {
      if (req.file) {
        newCebo.imagen = req.file.path;
      } else {
        newCebo.imagen =
          'https://www.micebo.es/data/blog/255/images/_mini/post_grd/738/coreano-cebo.jpg?t=20220422b';
      }
      const postCebo = await newCebo.save();

      if (postCebo) {
        // Redirección a la ruta para crear un stock con el ID del cebo recién creado

        return res.redirect(
          308,
          `http://localhost:8000/api/v1/stock/crearstock/${postCebo._id}`
        );
      } else {
        return res.status(400).json('Error create Cebo');
      }
    } catch (error) {
      return res.status(404).json(error.message);
    }
  } catch (error) {
    if (req.file) deleteImgCeboCloudinary(catchImg);
    return next(error);
  }
};

//--------------------------------------------------------------------------------
//··································UPDATE········································
//--------------------------------------------------------------------------------

const updateCebo = async (req, res, next) => {
  let catchImg = req.file?.path;
  const { id } = req.params;
  try {
    await Cebo.syncIndexes();
    console.log(req.body);

    const patchCebo = new Cebo(req.body);

    if (req.file) {
      patchCebo.imagen = req.file.path;
    }
    patchCebo._id = id;

    try {
      try {
        const ceboBuscado = await Cebo.findByIdAndUpdate(id, patchCebo);
        if (req.file) {
          deleteImgCeboCloudinary(ceboBuscado.imagen);
        }
      } catch (error) {
        return res.status(404).json(error.message);
      }

      const updateCebo = await Cebo.findById(id);
      console.log(updateCebo);

      const updateKeys = Object.keys(req.body);

      const testUpdate = [];

      updateKeys.forEach((item) => {
        if (updateCebo[item] == req.body[item]) {
          testUpdate.push({
            [item]: true,
          });
        } else {
          testUpdate.push({
            [item]: false,
          });
        }
      });
      if (req.file) {
        updateCebo.imagen == req.file.path
          ? testUpdate.push({
              file: true,
            })
          : testUpdate.push({
              file: false,
            });
      }
      return res.status(200).json({
        testUpdate,
      });
    } catch (error) {
      return res.status(404).json(error.message);
    }
  } catch (error) {
    if (req.file) deleteImgCeboCloudinary(catchImg);
    return next(error);
  }
};

//--------------------------------------------------------------------------------
//··································DELETE········································
//--------------------------------------------------------------------------------
const deleteCebo = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Buscar el cebo a eliminar y almacenar su imagen para su posterior eliminación
    const ceboBuscado = await Cebo.findById(id).populate('stocks');
    if (!ceboBuscado) {
      return res.status(404).json('Cebo no encontrado');
    }

    // Verificar si existen pedidos con estado "pendiente" o "confirmado" que contienen este cebo
    const pedidosPendientesConfirmados = await Pedido.exists({
      cebo: id,
      estado: { $in: ['pendiente', 'confirmado'] },
    });

    // Verificar si existen reservas con estado "pendiente" o "confirmada" que contienen este cebo
    const reservasPendientesConfirmadas = await Reserva.exists({
      cebo: id,
      estado: { $in: ['pendiente', 'confirmada'] },
    });

    if (pedidosPendientesConfirmados || reservasPendientesConfirmadas) {
      return res
        .status(409)
        .json(
          'No se puede eliminar el cebo con pedidos o reservas pendientes o confirmadas'
        );
    }

    // Obtener la lista de pedidos asociados al cebo
    const pedidosCebo = await Cebo.findById(id).populate('pedidos');

    for (const pedido of pedidosCebo.pedidos) {
      // Buscar el usuario asociado al pedido
      const idPedido = pedido._id;
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
    }
    // Obtener la lista de reservas asociadas al cebo
    const reservasCebo = await Cebo.findById(id).populate('pedidos');

    for (const reserva of reservasCebo.reservas) {
      // Buscar el usuario asociado a la reserva
      const idReserva = reserva._id;
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
    }
    // Eliminar el cebo del catálogo
    await Cebo.findByIdAndDelete(id);

    // Eliminar el stock asociado al cebo
    const stockId = ceboBuscado.stocks._id;
    if (stockId) {
      await Stock.findByIdAndDelete(stockId);
    }

    // // Eliminar la imagen asociada al cebo desde Cloudinary

    deleteImgCeboCloudinary(ceboBuscado.imagen);

    return res.status(200).json('Cebo eliminado correctamente');
  } catch (error) {
    return next(error);
  }
};

//--------------------------------------------------------------------------------
//··································GET ALL·······································
//--------------------------------------------------------------------------------

const getAllCebo = async (req, res, next) => {
  try {
    const cebosAll = await Cebo.find().populate('stocks');
    if (cebosAll) {
      return res.status(200).json(cebosAll);
    } else {
      return res.status(404).json('Failed getAll controller to cebos');
    }
  } catch (error) {
    return next(error);
  }
};

//--------------------------------------------------------------------------------
//··································GET BY NAME···································
//--------------------------------------------------------------------------------

const getByNameCebo = async (req, res, next) => {
  try {
    let { ceboVivo } = req.params;
    ceboVivo = ceboVivo.toLowerCase();
    const regex = new RegExp(ceboVivo, 'i');
    // recordar que el find nos permite traernos todosl os elementos que nosotros pongamos en las condicones de sus parentesis
    //! EL FIND DEVUELVE UN ARRAY DE ELMENTOS
    //! EL FINDBYID DEVUELVE O UN OBJETO O DEVUELVE UN NULL SI NO LO HA ENCONTRADO
    const cebosByName = await Cebo.find({
      ceboVivo: { $regex: regex },
    }).populate('stocks');
    if (cebosByName.length > 0) {
      return res.status(200).json(cebosByName);
    } else {
      return res.status(404).json('Error to controller getByname Cebos');
    }
  } catch (error) {
    return next(error);
  }
};

//--------------------------------------------------------------------------------
//··································GET BY ID·····································
//--------------------------------------------------------------------------------

const getByIdCebo = async (req, res, next) => {
  try {
    const { id } = req.params;

    /// populate nos sirve para que los elementos del Schema del modelo que esten
    //con objectID podamos acceder a su info de otro modelo
    const cebosById = await Cebo.findById(id).populate('stocks');
    if (cebosById) {
      return res.status(200).json(cebosById);
    } else {
      return res.status(404).json('Usuario no encontrado');
    }
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  añadirAlCatalogo,
  updateCebo,
  deleteCebo,
  getAllCebo,
  getByNameCebo,
  getByIdCebo,
};
