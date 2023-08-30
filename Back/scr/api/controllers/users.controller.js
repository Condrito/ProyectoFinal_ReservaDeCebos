const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const setError = require('../../helpers/handle-error');
const { deleteImgCloudinary } = require('../../middlewares/files.middleware');
const { generateToken } = require('../../utils/token');
const randomPassword = require('../../utils/randomPassword');
const Pedido = require('../models/pedido.model');
const Reserva = require('../models/reserva.model');

dotenv.config();

//--------------------------------------------------------------------------------
//····································REGISTER····································
//--------------------------------------------------------------------------------

const register = async (req, res, next) => {
  let catchImg = req.file?.path;

  try {
    await User.syncIndexes();
    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: password,
      },
    });

    const confirmationCode = Math.floor(
      Math.random() * (999999 - 100000) + 100000
    );

    const newUser = new User({ ...req.body, confirmationCode });

    if (req.file) {
      newUser.imagen = req.file.path;
    } else {
      newUser.imagen =
        'https://w1.pngwing.com/pngs/332/149/png-transparent-circle-silhouette-logo-user-generic-programming-black-black-and-white-line-sky.png';
    }

    const userExist = await User.findOne({
      email: newUser.email,
      name: newUser.name,
    });

    if (userExist) {
      if (req.file) deleteImgCloudinary(catchImg);
      return next(setError(409, 'This user already exist'));
    } else {
      try {
        const createUser = await newUser.save();
        createUser.password = null;
        const mailOptions = {
          from: email,
          to: req.body.email,
          subject: 'Code confirmation',
          text: `Your code is ${confirmationCode}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent:' + info.response);
          }
        });

        return res.status(201).json({
          user: createUser,
          confirmationCode: confirmationCode,
        });
      } catch (error) {
        if (req.file) deleteImgCloudinary(catchImg);
        return res.status(404).json(error.message);
      }
    }
  } catch (error) {
    if (req.file) deleteImgCloudinary(catchImg);
    return next(
      setError(error.code || 500, error.message || 'failed create user')
    );
  }
};

//--------------------------------------------------------------------------------
//·······························CHECK NEW USER···································
//--------------------------------------------------------------------------------

const checkNewUser = async (req, res, next) => {
  try {
    const { email, confirmationCode } = req.body;
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(404).json('User not found');
    } else {
      if (confirmationCode === userExist.confirmationCode) {
        try {
          await userExist.updateOne({ check: true });
          const updateUser = await User.findOne({ email });

          return res.status(200).json({
            testCheckOk: updateUser.check == true ? true : false,
          });
        } catch (error) {
          return res.status(404).json(error.message);
        }
      } else {
        await User.findByIdAndDelete(userExist._id);
        deleteImgCloudinary(userExist.imagen);
        return res.status(200).json({
          userExist,
          check: false,
          delete: (await User.findById(userExist._id))
            ? 'error delete user'
            : 'Ok delete user',
        });
      }
    }
  } catch (error) {
    return next(setError(500, 'General error check code'));
  }
};

//--------------------------------------------------------------------------------
//·························RESEND CODE CONFIRMATION·······························
//--------------------------------------------------------------------------------

const resendCode = async (req, res, next) => {
  const email = process.env.EMAIL;
  const password = process.env.PASSWORD;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email,
      pass: password,
    },
  });

  const userExist = await User.findOne({ email: req.body.email });
  try {
    if (userExist) {
      const mailOptions = {
        from: email,
        to: req.body.email,
        subject: 'Confirmation code Reserva de Cebo',
        text: `Your code is ${userExist.confirmationCode}`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent:' + info.response);
          return res.status(200).json({
            resend: true,
          });
        }
      });
    } else {
      return res.status(404).json('User not found');
    }
  } catch (error) {
    return next(setError(500, error.message || 'Error general send code'));
  }
};

//--------------------------------------------------------------------------------
//····································LOGIN·······································
//--------------------------------------------------------------------------------

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userDB = await User.findOne({ email });
    if (!userDB) {
      return res.status(404).json('User not found');
    } else {
      if (bcrypt.compareSync(password, userDB.password)) {
        const token = generateToken(userDB._id, email);
        return res.status(200).json({
          user: userDB,
          token,
        });
      } else {
        return res.status(404).json('Invalid password');
      }
    }
  } catch (error) {
    return next(
      setError(500 || error.code, 'General error login' || error.message)
    );
  }
};

//--------------------------------------------------------------------------------
//····················CAMBIO DE CONTRASEÑA SIN ESTAR LOGUEADO·····················
//--------------------------------------------------------------------------------

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const userDb = await User.findOne({ email });
    if (userDb) {
      return res.redirect(
        `http://localhost:8000/api/v1/users/forgotpassword/sendPassword/${userDb._id}`
      );
    } else {
      return res.status(404).json('User not register');
    }
  } catch (error) {
    return next(error);
  }
};

const sendPassword = async (req, res, next) => {
  try {
    const { id } = req.params;

    const userDb = await User.findById(id);

    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: password,
      },
    });

    let passwordSecure = randomPassword();
    const mailOptions = {
      from: email,
      to: userDb.email,
      subject: '-----',
      text: `User: ${userDb.name}. Your new code login is ${passwordSecure} Hemos enviado esto porque tenemos una solicitud de cambio de contraseña, si no has sido ponte en contacto con nosotros, gracias.`,
    };

    transporter.sendMail(mailOptions, async function (error) {
      if (error) {
        console.log(error);

        return res.status(404).json('dont sent email and dont update user');
      } else {
        const newPasswordHash = bcrypt.hashSync(passwordSecure, 10);

        try {
          await User.findByIdAndUpdate(id, { password: newPasswordHash });

          const updateUser = await User.findById(id);
          if (bcrypt.compareSync(passwordSecure, updateUser.password)) {
            return res.status(200).json({
              updateUser: true,
              sendPassword: true,
            });
          } else {
            return res.status(404).json({
              updateUser: false,
              sendPassword: true,
            });
          }
        } catch (error) {
          return res.status(404).json(error.message);
        }
      }
    });
  } catch (error) {
    return next(error);
  }
};

//--------------------------------------------------------------------------------
//······················CAMBIO DE CONTRASEÑA ESTANDO LOGUEADO·····················
//--------------------------------------------------------------------------------

const modifyPassword = async (req, res, next) => {
  try {
    const { password, newPassword } = req.body;

    const { _id } = req.user;
    if (bcrypt.compareSync(password, req.user.password)) {
      const newPasswordHash = bcrypt.hashSync(newPassword, 10);
      await User.findByIdAndUpdate(_id, { password: newPasswordHash });

      const updateUser = await User.findById(_id);

      if (bcrypt.compareSync(newPassword, updateUser.password)) {
        return res.status(200).json({
          updateUser: true,
        });
      } else {
        return res.status(404).json({
          updateUser: false,
        });
      }
    } else {
      return res.status(404).json('password not match');
    }
  } catch (error) {
    return next(error);
  }
};

//--------------------------------------------------------------------------------
//··································UPDATE········································
//--------------------------------------------------------------------------------

const updateUser = async (req, res, next) => {
  let catchImg = req.file?.path;

  try {
    // actualizamos los indexes de los elementos unicos por si han modificado
    await User.syncIndexes();
    // instanciamos un nuevo modelo de user
    const patchUser = new User(req.body);
    // si tenemos la req.file le metemos el path de cloudinary
    if (req.file) {
      patchUser.imagen = req.file.path;
    }
    // estas cosas no quiero que me cambien por lo cual lo cojo del req.user gracias a que esto es con auth
    patchUser._id = req.user._id;
    patchUser.password = req.user.password;
    patchUser.rol = req.user.rol;
    patchUser.confirmationCode = req.user.confirmationCode;
    patchUser.check = req.user.check;
    patchUser.email = req.user.email;

    // actualizamos en la db con el id y la instancia del modelo de user
    try {
      await User.findByIdAndUpdate(req.user._id, patchUser);
      // borrramos en cloudinary la imagen antigua
      if (req.file) {
        deleteImgCloudinary(req.user.imagen);
      }

      //! ----------------test  runtime ----------------
      // buscamos el usuario actualizado
      const updateUser = await User.findById(req.user._id);

      // cogemos la keys del body
      const updateKeys = Object.keys(req.body);

      // creamos una variable para  guardar los test
      const testUpdate = [];
      // recorremos las keys y comparamos
      updateKeys.forEach((item) => {
        if (updateUser[item] == req.body[item]) {
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
        updateUser.imagen == req.file.path
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
    if (req.file) deleteImgCloudinary(catchImg);
    return next(error);
  }
};

//--------------------------------------------------------------------------------
//··································DELETE········································
//--------------------------------------------------------------------------------

const deleteUser = async (req, res, next) => {
  try {
    const { _id } = req.user;

    // Eliminar los pedidos asociados al usuario
    await Pedido.deleteMany({ user: _id });

    // Eliminar las reservas asociadas al usuario
    await Reserva.deleteMany({ user: _id });

    // Eliminar el usuario
    await User.findByIdAndDelete(_id);

    if (await User.findById(_id)) {
      return res.status(404).json('Dont delete');
    } else {
      deleteImgCloudinary(req.user.imagen);
      return res.status(200).json('ok delete');
    }
  } catch (error) {
    return next(error);
  }
};

//--------------------------------------------------------------------------------
//·······················CAMBIAR ROLL (superAdmin)································
//--------------------------------------------------------------------------------
const cambiarRoll = async (req, res, next) => {
  try {
    const { idUser } = req.params;
    const { newRol } = req.body;

    // Verificar si se proporciona el nuevo rol en el req.body
    if (!newRol) {
      return res
        .status(400)
        .json({ error: 'Debe proporcionar el nuevo rol del usuario.' });
    }

    // Verificar si el nuevo rol es válido (superAdmin, admin, o user)
    if (newRol !== 'superAdmin' && newRol !== 'admin' && newRol !== 'user') {
      return res.status(400).json({ error: 'Rol no válido.' });
    }

    // Buscar el usuario en la base de datos por su ID y cambiamos el rol del usuario
    const usuarioNewRol = await User.findByIdAndUpdate(
      idUser,
      { rol: newRol },
      { new: true } // Agregar la opción 'new: true' para devolver el documento actualizado
    );

    // Verificar si el usuario existe
    if (!usuarioNewRol) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    return res.status(200).json({
      message: 'Rol del usuario actualizado con éxito.',
      usuarioNewRol,
    });
  } catch (error) {
    return next(error);
  }
};

//--------------------------------------------------------------------------------
//···········MOSTRAR TODOS LOS USUARIOS (superAdmin)······························
//--------------------------------------------------------------------------------

const getAllUsers = async (req, res, next) => {
  try {
    // Buscar todos los usuarios en la base de datos
    const users = await User.find({});

    // Devolver los usuarios en la respuesta
    return res.status(200).json(users);
  } catch (error) {
    return next(error);
  }
};

//--------------------------------------------------------------------------------
//···········MOSTRAR UN USUARIO (superAdmin)······························
//--------------------------------------------------------------------------------

const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Buscar el usuario por su ID en la base de datos
    const user = await User.findById(userId);

    // Verificar si el usuario existe
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    // Devolver el usuario en la respuesta
    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};

//--------------------------------------------------------------------------------
//······················DELETE USER (SuperAdmin)··································
//--------------------------------------------------------------------------------

const deleteUserByAdmin = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const userFile = await User.findById(userId);
    // Eliminar los pedidos asociados al usuario
    await Pedido.deleteMany({ user: userId });

    // Eliminar las reservas asociadas al usuario
    await Reserva.deleteMany({ user: userId });

    // Eliminar el usuario
    await User.findByIdAndDelete(userId);

    if (await User.findById(userId)) {
      return res.status(404).json('Dont delete');
    } else {
      deleteImgCloudinary(userFile.imagen);
      return res.status(200).json('ok delete');
    }
  } catch (error) {
    return next(error);
  }
};

//?-----------AUTO LOGIN--------------------------------
const autoLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userDB = await User.findOne({ email });

    if (userDB) {
      if (bcrypt.compareSync(password, userDB.password)) {
        const token = generateToken(userDB._id, email);
        return res.status(200).json({ user: userDB, token });
      } else {
        return res.status(404).json('password dont match');
      }
    } else {
      return res.status(404).json('User no register');
    }
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  checkNewUser,
  resendCode,
  login,
  forgotPassword,
  sendPassword,
  modifyPassword,
  updateUser,
  deleteUser,
  cambiarRoll,
  getAllUsers,
  getUserById,
  deleteUserByAdmin,
  autoLogin,
};
