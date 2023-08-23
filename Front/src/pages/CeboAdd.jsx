import './Register.css';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';

import { Uploadfile } from '../components';

import { useCrearCeboError } from '../hooks';

import { crearCebo } from '../services/cebos.service';

export const CeboAdd = () => {
  const { register, handleSubmit } = useForm();
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
  const [newCeboOk, setNewCeboOk] = useState(false);

  //! ------------------------------------------------------------------------------
  //? 1) funcion que se encarga del formulario - de la data del formulario
  //! ------------------------------------------------------------------------------

  const formSubmit = async (formData) => {
    const inputFile = document.getElementById('file-upload').files;

    if (inputFile.length !== 0) {
      // cuando me han hayan puesto una imagen por el input

      const customFormData = {
        ...formData,
        imagen: inputFile[0],
      };

      setSend(true);
      setRes(await crearCebo(customFormData));
      setSend(false);

      //! me llamo al servicio
    } else {
      const customFormData = {
        ...formData,
      };

      setSend(true);
      setRes(await crearCebo(customFormData));
      setSend(false);

      ///! me llamo al servicio
    }
  };

  //! ------------------------------------------------------------------------------
  //? 2) funcion que se encarga del formulario- de la data del formulario
  //! ------------------------------------------------------------------------------
  useEffect(() => {
    useCrearCeboError(res, setNewCeboOk, setRes);
  }, [res]);

  //! ------------------------------------------------------------------------------
  //? 3) Estados de navegacion ----> lo veremos en siguiente proyectos
  //! ------------------------------------------------------------------------------

  if (newCeboOk) {
    return <Navigate to="/gestionarcatalogo" />;
  }
  return (
    <>
      <div className="form-wrap">
        <h1>Crea una nueva ficha de cebo y añadela al catálogo</h1>

        <form onSubmit={handleSubmit(formSubmit)}>
          <div className="user_container form-group">
            <label htmlFor="custom-input" className="custom-placeholder">
              Nombre
            </label>
            <input
              className="input_user"
              type="text"
              id="name"
              name="name"
              autoComplete="false"
              {...register('ceboVivo', { required: true })}
            />
          </div>

          <div className="telf_container form-group">
            <label htmlFor="custom-input" className="custom-placeholder">
              Código
            </label>
            <input
              className="input_user"
              type="codigo"
              id="codigo"
              name="codigo"
              autoComplete="false"
              {...register('codigo', { required: true })}
            />
          </div>
          <div className="telf_container form-group">
            <label htmlFor="custom-input" className="custom-placeholder">
              Precio
            </label>
            <input
              className="input_user"
              type="precio"
              id="precio"
              name="precio"
              autoComplete="false"
              {...register('precio', { required: true })}
            />
          </div>

          <Uploadfile />

          <div className="btn_container">
            <button
              className="btn"
              type="submit"
              disabled={send}
              style={{ background: send ? '#007DBC' : '#7ebbda' }}
            >
              Añadir al catálogo
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
