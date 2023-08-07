const mongoose = require('mongoose');
const { Schema } = mongoose;
const PedidosSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    cebo: { type: mongoose.Schema.Types.ObjectId, ref: 'Catalogo' },
    fechaDelPedido: { type: Date, required: true },
    cantidad: { type: Number, default: 0, required: true },
    estado: {
      type: String,
      enum: ['pendiente', 'cancelado', 'confirmado'],
      default: 'pendiente',
    },
  },
  {
    timestamps: true,
  }
);

const Pedido = mongoose.model('Pedido', PedidosSchema);
module.exports = Pedido;
