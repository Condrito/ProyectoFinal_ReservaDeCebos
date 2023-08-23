import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';

import { useForgotPassword } from '../hooks';
import { forgotPasswordUser } from '../services/user.service';

export const ForgotPassword = () => {
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
  const { handleSubmit, register } = useForm();
  const [forgotOk, setForgotOk] = useState(false);

  //! 1)-------------------- LA FUNCIOON QUE SE ENCARGA DE GESTIONAR LOS DATOS DEL FORMULARIO

  const formSubmit = async (formData) => {
    setSend(true);
    setRes(await forgotPasswordUser(formData));
    setSend(false);
  };
  //! 2) ----------------USEEFFECT QUE GESTIONA LA RES CON SUS ERRORES Y SUS 200
  useEffect(() => {
    useForgotPassword(res, setRes, setForgotOk);
  }, [res]);

  //! 3) ---------------- ESTADOS DE NAVEGACION O QUE LA fiuncion ESTA ok

  if (forgotOk) {
    console.log('envio de la contraseña correcto');
    return <Navigate to="/login" />;
  }

  return (
    <>
      <div className="form-wrap">
        <h1>Recuperar Contraseña</h1>

        <form onSubmit={handleSubmit(formSubmit)}>
          <div className="user_container form-group">
            <label htmlFor="custom-input" className="custom-placeholder">
              Email
            </label>
            <input
              className="input_user"
              type="text"
              id="email"
              name="email"
              autoComplete="false"
              {...register('email', { required: true })}
            />
          </div>

          <div className="btn_container">
            <button
              className="btn"
              type="submit"
              disabled={send}
              style={{ background: send ? '#007DBC;' : '#7ebbda;' }}
            >
              Recuperar Contraseña
            </button>
          </div>

          <p className="bottom-text">
            <small>
              Ingresa tu correo electrónico para enviarte la nueva contraseña.
            </small>
          </p>
        </form>
      </div>
    </>
  );
};
