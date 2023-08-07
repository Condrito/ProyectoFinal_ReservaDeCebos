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

UserRoutes.patch('/updateroll/:idUser', [isAuthSuperAdmin], cambiarRoll);
UserRoutes.get('/getallusers', [isAuthSuperAdmin], getAllUsers);
//·························REDIRECT···························

UserRoutes.patch('/forgotpassword/sendPassword/:id', sendPassword);

module.exports = UserRoutes;
