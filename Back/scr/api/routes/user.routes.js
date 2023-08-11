const express = require('express');
const { upload } = require('../../middlewares/files.middleware');
const {
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
} = require('../controllers/users.controller');
const {
  isAuth,
  isAuthSuperAdmin,
  isAuthAdmin,
} = require('../../middlewares/auth.middleware');

const UserRoutes = express.Router();

UserRoutes.post('/register', upload.single('imagen'), register);
UserRoutes.post('/check', checkNewUser);
UserRoutes.post('/resend', resendCode);
UserRoutes.post('/login', login);
UserRoutes.patch('/forgotpassword', forgotPassword);
UserRoutes.patch('/changepassword', [isAuth], modifyPassword);
UserRoutes.patch(
  '/update/update',
  [isAuth],
  upload.single('imagen'),
  updateUser
);
UserRoutes.delete('/', [isAuth], deleteUser);

UserRoutes.patch('/updaterol/:idUser', [isAuthSuperAdmin], cambiarRoll);
UserRoutes.get('/getallusers', [isAuthSuperAdmin], getAllUsers);
UserRoutes.delete(
  '/deleteuserbyadmin/:userId',
  [isAuthSuperAdmin],
  deleteUserByAdmin
);

// Ruta para obtener un solo usuario por su ID
UserRoutes.get('/:userId', [isAuthSuperAdmin], getUserById);
//·························REDIRECT···························

UserRoutes.patch('/forgotpassword/sendPassword/:id', sendPassword);

module.exports = UserRoutes;
