import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';

import { ButtonReSend } from '../components';
import { useUser } from '../context/userContext';
import { useAutoLogin, useCheckCodeError } from '../hooks';
import { checkCodeConfirmationUser } from '../services/user.service';

export const CheckCode = () => {
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
  const [okCheck, setOkCheck] = useState(false);
  const [reloadPageError, setReloadPageError] = useState(false);
  const [autoLogin, setAutologin] = useState(false);
  const [deleteUser, setDeleteUser] = useState(false);
  const { allUser, userLogin, setUser, user } = useUser();
  const { register, handleSubmit } = useForm();

  //! 1) ---------------LAS FUNCIONES QUE GESTIONAN LOS SUBMIT DE LOS FORMULARIOS--------
  const formSubmit = async (formData) => {
    const userLocal = localStorage.getItem('user');

    if (userLocal == null) {
      /// -----> este usuario viene del registro porque no se a logado previamente
      /// ---> recordar alllUser es la res que recibo del registro, solo disponible cuando he echo un registro previo
      const customFormData = {
        email: allUser.data.user.email,
        confirmationCode: parseInt(formData.confirmationCode),
      };

      //! llamada al servicio
      setSend(true);
      setRes(await checkCodeConfirmationUser(customFormData));
      setSend(false);
    } else {
      // ------> este usuario viene del login porque existe en el local storage
      const customFormData = {
        email: user.email,
        confirmationCode: parseInt(formData.confirmationCode),
      };

      //! llamada al servicio
      setSend(true);
      setRes(await checkCodeConfirmationUser(customFormData));
      setSend(false);
    }
  };

  //!2) ---------------- USEEFFECT  QUE GESTIONAN LOS ERRRORES Y EL 200 CON UN CUSTOMhook -----
  useEffect(() => {
    useCheckCodeError(
      res,
      setDeleteUser,
      setOkCheck,
      setUser,
      setReloadPageError,
      setRes,
    );
  }, [res]);

  //!3) ----------------- ESTADOS DE NAVEGACION O DE CONFIRMACION DE QUE LA FUNCIONALIDAD ESTA OK ----
  if (okCheck) {
    if (!localStorage.getItem('user')) {
      // autologin
      setOkCheck(false);
      useAutoLogin(allUser, userLogin, setOkCheck);
    } else {
      return <Navigate to="/dashboard" />;
    }
  }

  if (deleteUser) {
    return <Navigate to="/register" />;
  }

  if (reloadPageError) {
    return <Navigate to="/login" />;
  }
  return (
    <>
      <div className="form-wrap">
        <h1>Verificación de Código</h1>

        <form onSubmit={handleSubmit(formSubmit)}>
          <div className="user_container form-group">
            <label htmlFor="custom-input" className="custom-placeholder">
              Ingresa el código de verificación enviado a tu correo electrónico
            </label>
            <input
              className="input_user"
              type="text"
              id="name"
              name="name"
              autoComplete="false"
              {...register('confirmationCode', { required: false })}
            />
          </div>

          <div className="btn_container">
            <button
              id="btnCheck"
              className="btn"
              type="submit"
              disabled={send}
              style={{ background: send ? '#007DBC;' : '#7ebbda;' }}
            >
              Verificar Código
            </button>
          </div>
        </form>
        <div className="btn_container">
          <ButtonReSend setReloadPageError={setReloadPageError} />
        </div>
        <p className="bottom-text">
          <small>
            Si el código no es correcto , tu usuario será eliminado de la base de datos y
            deberás registrarte nuevamente.
          </small>
        </p>
      </div>
    </>
  );
};
