const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;
const UsersSchema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      validate: [validator.isEmail, 'Email not valid'],
      unique: true,
    },
    password: {
      type: String,
      required: true,
      validate: [validator.isStrongPassword],
      minlength: [8, 'Min 8 characters'],
    },
    telf: { type: String, required: true, unique: true },
    rol: {
      type: String,
      enum: ['superAdmin', 'admin', 'user'],
      default: 'user',
    },
    imagen: { type: String },
    confirmationCode: { type: Number, require: true },
    check: { type: Boolean, default: false },
    pedidos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pedido' }],
    reservas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reserva' }],
  },

  {
    timestamps: true,
  }
);

UsersSchema.pre('save', async function (next) {
  try {
    this.password = await bcrypt.hash(this.password, 10);

    next();
  } catch (error) {
    next('Error hashing password', error);
  }
});

const User = mongoose.model('User', UsersSchema);
module.exports = User;
