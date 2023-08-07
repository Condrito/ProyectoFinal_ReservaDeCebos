const mongoose = require('mongoose');
const { Schema } = mongoose;

const StocksSchema = new Schema(
  {
    cebo: { type: mongoose.Schema.Types.ObjectId, ref: 'Catalogo' },
    fechaStockActualizado: { type: String, required: true },
    horaStockActualizado: { type: String, required: true },
    stockTotal: { type: Number, required: true }, // Campo para almacenar el valor proporcionado por el req.body
    CantidadesPedidosReservas: { type: Number, required: true, default: 0 }, // Total de cantidades en pedidos y reservas (requerido y valor por defecto 0)
    stockDisponible: { type: Number, required: true, default: 0 }, // Calculado como stockTotal - CantidadesPedidosReservas (requerido y valor por defecto 0)
    pedidos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pedido' }],
    reservas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reserva' }],
  },
  {
    timestamps: true,
  }
);

const Stock = mongoose.model('Stock', StocksSchema);
module.exports = Stock;
