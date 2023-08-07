const mongoose = require('mongoose');
const { Schema } = mongoose;
const ReservasSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    cebo: { type: mongoose.Schema.Types.ObjectId, ref: 'Catalogo' },
    fechaDeLaReserva: { type: Date, required: true },
    horaDeLaReserva: { type: String, required: true },
    cantidad: { type: Number, default: 0, required: true },
    estado: {
      type: String,
      enum: ['pendiente', 'confirmada', 'cancelada'],
      default: 'pendiente',
    },
    stocks: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock' },
  },

  {
    timestamps: true,
  }
);

const Reserva = mongoose.model('Reserva', ReservasSchema);
module.exports = Reserva;
