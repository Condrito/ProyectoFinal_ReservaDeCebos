const mongoose = require('mongoose');
const { Schema } = mongoose;
const CebosSchema = new Schema(
  {
    ceboVivo: { type: String, required: true },
    imagen: { type: String },
    precio: { type: String, required: true },
    codigo: { type: String, unique: true },
    stocks: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock' },
    pedidos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pedido' }],
    reservas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reserva' }],
  },
  {
    timestamps: true,
  }
);

const Cebo = mongoose.model('Catalogo', CebosSchema);
module.exports = Cebo;
