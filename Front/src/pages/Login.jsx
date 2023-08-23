import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate } from 'react-router-dom';

import { useUser } from '../context/userContext';
import { useLoginError } from '../hooks';
import { loginUser } from '../services/user.service';

export const Login = () => {
  const { handleSubmit, register } = useForm();
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
  const [loginOk, setLoginOk] = useState(false);
  const { userLogin, setUser } = useUser();

  //! 1) ------------------ FUNCION QUE GESTIONA EL FORMULARIO----------
  const formSubmit = async (formData) => {
    setSend(true);
    setRes(await loginUser(formData));
    setSend(false);
  };

  //! 2) ------------------ LOS USEEFFECT QUE GESTIONAN LA RESPUESTA: ERRORES Y 200

  useEffect(() => {
    setUser(() => null);
  }, []);
  useEffect(() => {
    useLoginError(res, setLoginOk, userLogin, setRes);
  }, [res]);

  //! 3) ------------------ ESTADOS DE NAVEGACION O ESTADOS DE FUNCIONALIDADES OK

  if (loginOk) {
    if (res.data.user.check == false) {
      return <Navigate to="/verifyCode" />;
    } else {
      return <Navigate to="/dashboard" />;
    }
  }

  return (
    <>
      <div className="form-wrap">
        <h1>Iniciar sesión</h1>

        <form onSubmit={handleSubmit(formSubmit)}>
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
          </div>

          <div className="btn_container">
            <button
              className="btn"
              type="submit"
              disabled={send}
              style={{ background: send ? '#007DBC;' : '#7ebbda;' }}
            >
              Inicia sesión
            </button>
          </div>
        </form>

        <p className="parrafoLogin">
          ¿Aún no estás registrado? <Link to="/register">Registrate aquí</Link>
        </p>
        <p className="parrafoChangePassword">
          ¿Has olvidado tu contraseña? <Link to="/forgotpassword">Recuperala aquí</Link>
        </p>
      </div>
    </>
  );
};
