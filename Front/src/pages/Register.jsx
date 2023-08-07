import './Register.css';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate } from 'react-router-dom';

import { Uploadfile } from '../components';
import { useUser } from '../context/userContext';
import { useRegisterError } from '../hooks';
import { registerUser } from '../services/user.service';

export const Register = () => {
  const { setAllUser, bridgeData } = useUser();
  const { register, handleSubmit } = useForm();
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
  const [okRegister, setOkRegister] = useState(false);

  //! ------------------------------------------------------------------------------
  //? 1) funcion que se encarga del formulario - de la data del formulario
  //! ------------------------------------------------------------------------------

  const formSubmit = async (formData) => {
    const inputFile = document.getElementById('file-upload').files;

    if (inputFile.length !== 0) {
      // cuando me han hayan puesto una imagen por el input

      const custonFormData = {
        ...formData,
        imagen: inputFile[0],
      };

      setSend(true);
      setRes(await registerUser(custonFormData));
      setSend(false);

      //! me llamo al servicio
    } else {
      const custonFormData = {
        ...formData,
      };

      setSend(true);
      setRes(await registerUser(custonFormData));
      setSend(false);

      ///! me llamo al servicio
    }
  };

  //! ------------------------------------------------------------------------------
  //? 2) funcion que se encarga del formulario- de la data del formulario
  //! ------------------------------------------------------------------------------
  useEffect(() => {
    console.log(res);
    useRegisterError(res, setOkRegister, setRes, setAllUser);
    if (res?.status == 201) bridgeData('ALLUSER');
  }, [res]);

  //! ------------------------------------------------------------------------------
  //? 3) Estados de navegacion ----> lo veremos en siguiente proyectos
  //! ------------------------------------------------------------------------------

  if (okRegister) {
    console.log('res', res);
    console.log('registro correcto ya puedes navegar');
    return <Navigate to="/verifyCode" />;
  }
  return (
    <>
      <div className="form-wrap">
        <h1>Registrate</h1>

        <form onSubmit={handleSubmit(formSubmit)}>
          <div className="user_container form-group">
            <label htmlFor="custom-input" className="custom-placeholder">
              Nombre de usuario
            </label>
            <input
              className="input_user"
              type="text"
              id="name"
              name="name"
              autoComplete="false"
              {...register('name', { required: true })}
            />
          </div>
          <div className="password_container form-group">
            <label htmlFor="custom-input" className="custom-placeholder">
              Contraseña
            </label>
            <input
              className="input_user"
              type="password"
              id="password"
              name="password"
              autoComplete="false"
              {...register('password', { required: true })}
            />
          </div>
          <div className="email_container form-group">
            <label htmlFor="custom-input" className="custom-placeholder">
              Email
            </label>
            <input
              className="input_user"
              type="email"
              id="email"
              name="email"
              autoComplete="false"
              {...register('email', { required: true })}
            />
          </div>
          <div className="telf_container form-group">
            <label htmlFor="custom-input" className="custom-placeholder">
              Número de teléfono
            </label>
            <input
              className="input_user"
              type="telf"
              id="telf"
              name="telf"
              autoComplete="false"
              {...register('telf', { required: true })}
            />
          </div>

          <Uploadfile />

          <div className="btn_container">
            <button
              className="btn"
              type="submit"
              disabled={send}
              style={{ background: send ? '#007DBC;' : '#7ebbda;' }}
            >
              Registrarse
            </button>
          </div>
          <p className="bottom-text">
            <small>
              Al hacer clic en el botón de Registrarse, aceptas nuestros{' '}
              <a href="#">términos y condiciones</a> y{' '}
              <a href="#">política de privacidad</a>
            </small>
          </p>
        </form>

        <p>
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </>
  );
};
