const Stock = require('../models/stock.model');
const Cebo = require('../models/cebo.model');
const Pedido = require('../models/pedido.model');
const Reserva = require('../models/reserva.model');
const {
  obtenerHoraActual,
  obtenerFechaActual,
} = require('../../utils/FechaYHoraActual');

//--------------------------------------------------------------------------------
//····································CREAR STOCK·································
//--------------------------------------------------------------------------------
const crearStock = async (req, res, next) => {
  try {
    const { idCebo } = req.params;
    console.log(req.params);

    // Verificar si el cebo con el id proporcionado existe
    const ceboExistente = await Cebo.findById(idCebo);
    if (!ceboExistente) {
      return res.status(404).json({ error: 'Cebo no encontrado.' });
    }

    // Crear un nuevo objeto Stock con el id del cebo
    const newStock = new Stock({
      cebo: idCebo,
      fechaStockActualizado: obtenerFechaActual(),
      horaStockActualizado: obtenerHoraActual(),
      stockTotal: 0,
      CantidadesPedidosReservas: 0,
      stockDisponible: 0,
    });

    // Guardar el nuevo stock en la base de datos
    const stockGuardado = await newStock.save();

    if (stockGuardado) {
      // Actualizar la referencia del stock en el cebo
      ceboExistente.stocks = stockGuardado._id;
      await ceboExistente.save();

      return res.status(201).json(stockGuardado);
    } else {
      return res.status(500).json({ error: 'Error al guardar el stock.' });
    }
  } catch (error) {
    return next(error);
  }
};

//--------------------------------------------------------------------------------
//································ACTUALIZAR STOCK································
//--------------------------------------------------------------------------------

const stockage = async (req, res, next) => {
  const hora = obtenerHoraActual();
  const fecha = obtenerFechaActual();

  try {
    // Buscamos el stock existente para el cebo correspondiente
    const stockExistente = await Stock.findOne({ cebo: req.params.idCebo });

    // Verificamos si se encontró el stock existente
    if (stockExistente) {
      // Obtenemos la cantidad total de pedidos confirmados relacionados con este cebo
      const pedidos = await Pedido.find({
        cebo: req.params.idCebo,
        estado: 'confirmado',
      });
      const cantidadTotalPedidos = pedidos.reduce(
        (total, pedido) => total + pedido.cantidad,
        0
      );

      // Obtenemos la cantidad total de reservas confirmadas relacionadas con este cebo
      const reservas = await Reserva.find({
        cebo: req.params.idCebo,
        estado: 'confirmada',
      });
      const cantidadTotalReservas = reservas.reduce(
        (total, reserva) => total + reserva.cantidad,
        0
      );

      // Calculamos la cantidad total restante del stock
      stockExistente.stockDisponible =
        stockExistente.stockTotal -
        cantidadTotalPedidos -
        cantidadTotalReservas;

      // Actualizamos la fecha y hora del stock
      stockExistente.fechaStockActualizado = fecha;
      stockExistente.horaStockActualizado = hora;

      // Guardamos los cambios en el stock existente
      const updatedStock = await stockExistente.save();

      // Verificamos si se guardaron los cambios correctamente
      if (updatedStock) {
        // Obtenemos el cebo con la información del stock actualizado
        const ceboActualizado = await Cebo.findById(req.params.idCebo).populate(
          'stocks'
        );

        return res.status(200).json({
          updateStock: updatedStock,
          updateCebo: ceboActualizado,
        });
      }
    } else {
      // Si no se encontró un stock existente, respondemos con un mensaje de error
      return res
        .status(404)
        .json({ error: 'Stock no encontrado para el cebo especificado.' });
    }
  } catch (error) {
    return next(error);
  }
};

//--------------------------------------------------------------------------------
//······························INVENTARIAR STOCK·································
//--------------------------------------------------------------------------------

const inventario = async (req, res, next) => {
  const hora = obtenerHoraActual();
  const fecha = obtenerFechaActual();

  try {
    // Buscamos el stock existente para el cebo correspondiente
    const stockExistente = await Stock.findOne({ cebo: req.params.idCebo });

    // Verificamos si se encontró el stock existente
    if (stockExistente) {
      // Actualizamos los campos del stock con los datos del req.body
      stockExistente.fechaStockActualizado = fecha;
      stockExistente.horaStockActualizado = hora;
      stockExistente.stockTotal = Number(req.body.stockTotal);

      // Obtenemos la cantidad total de pedidos confirmados relacionados con este cebo
      const pedidos = await Pedido.find({
        cebo: req.params.idCebo,
        estado: 'confirmado',
      });
      const cantidadTotalPedidos = pedidos.reduce(
        (total, pedido) => total + pedido.cantidad,
        0
      );

      // Obtenemos la cantidad total de reservas confirmadas relacionadas con este cebo
      const reservas = await Reserva.find({
        cebo: req.params.idCebo,
        estado: 'confirmada',
      });
      const cantidadTotalReservas = reservas.reduce(
        (total, reserva) => total + reserva.cantidad,
        0
      );

      // Calculamos la cantidad total restante del stock
      stockExistente.stockDisponible =
        stockExistente.stockTotal -
        cantidadTotalPedidos -
        cantidadTotalReservas;

      // Guardamos los cambios en el stock existente
      const updatedStock = await stockExistente.save();

      // Verificamos si se guardaron los cambios correctamente
      if (updatedStock) {
        // Actualizamos el documento 'cebo' con el ID del stock actualizado
        const cebo = await Cebo.findById(req.params.idCebo);
        cebo.stocks = updatedStock._id;
        await cebo.save();

        // Obtenemos el cebo con la información del stock actualizado
        const ceboActualizado = await Cebo.findById(req.params.idCebo).populate(
          'stocks'
        );

        return res.status(200).json({
          updateStock: updatedStock,
          updateCebo: ceboActualizado,
        });
      }
    } else {
      // Si no se encontró un stock existente, respondemos con un mensaje de error
      return res
        .status(404)
        .json({ error: 'Stock no encontrado para el cebo especificado.' });
    }
  } catch (error) {
    return next(error);
  }
};

//--------------------------------------------------------------------------------
//··················· AÑADIR O QUITAR STOCK (ACTUALIZAR)··························
//--------------------------------------------------------------------------------

const modificarStock = async (req, res, next) => {
  try {
    // Verificamos si se proporcionó un valor para operar
    if (!req.body.valorOperar || isNaN(Number(req.body.valorOperar))) {
      return res
        .status(400)
        .json({ error: 'El valor proporcionado no es válido.' });
    }

    // Convertimos el valor proporcionado en un número
    const valorOperar = Number(req.body.valorOperar);

    // Buscamos el stock existente para el cebo correspondiente
    const stockExistente = await Stock.findOne({ cebo: req.params.idCebo });

    // Verificamos si se encontró el stock existente
    if (stockExistente) {
      // Realizamos la operación en el stock total
      stockExistente.stockTotal += valorOperar;

      // Redireccionamos al controlador 'stockage' para actualizar el stock
      req.body.stockTotal = stockExistente.stockTotal;
      return stockage(req, res, next);
    } else {
      // Si no se encontró un stock existente, respondemos con un mensaje de error
      return res
        .status(404)
        .json({ error: 'Stock no encontrado para el cebo especificado.' });
    }
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  stockage,
  crearStock,
  modificarStock,
  inventario,
};
