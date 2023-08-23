import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import './FormProfile';
import { Uploadfile } from './Uploadfile';
import { useForm } from 'react-hook-form';
import { actualizarCebo } from '../services/cebos.service';
import { useCeboUpdateError } from '../hooks';
import { EliminarCebo } from './EliminarCebo';

export const CeboCardUpdate = ({ ceboData, updateAndReload }) => {
  const { register, handleSubmit } = useForm();
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);

  //! ------------ 1) La funcion que gestiona el formulario----
  const formSubmit = (formData) => {
    Swal.fire({
      title: 'Estas seguro que quieres actualizar el catàlogo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(73, 193, 162)',
      cancelButtonColor: '#d33',
      confirmButtonText: 'YES',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const inputfile = document.getElementById('file-upload').files;
        let customFormData;

        if (inputfile.length !== 0) {
          customFormData = { ...formData, imagen: inputfile[0] };
          setSend(true);
          setRes(await actualizarCebo(customFormData, ceboData._id));
          setSend(false);
        } else {
          customFormData = { ...formData };
          setSend(true);
          setRes(await actualizarCebo(customFormData, ceboData._id));
          setSend(false);
        }
        updateAndReload();
      }
    });
  };

  //! -------------- 2 ) useEffect que gestiona la parte de la respuesta ------- customHook
  useEffect(() => {}, [ceboData]);

  useEffect(() => {
    useCeboUpdateError(res, setRes);
  }, [res]);
  console.log(ceboData?._id);
  return (
    <>
      <div className="containerProfile">
        <div className="containerDataNoChange">
          <img className="imageCebo" src={ceboData?.imagen} alt={ceboData?.ceboVivo} />
        </div>

        <div className="form-wrap formProfile">
          <h1>Aquí puedes actualizar el cebo en el catálogo ♻</h1>

          <form onSubmit={handleSubmit(formSubmit)}>
            <div className="user_container form-group">
              <label htmlFor="custom-input" className="custom-placeholder">
                nombre
              </label>
              <input
                className="input_user"
                type="text"
                id="ceboVivo"
                name="ceboVivo"
                autoComplete="false"
                defaultValue={ceboData?.ceboVivo}
                {...register('ceboVivo')}
              />

              <label htmlFor="custom-input" className="custom-placeholder">
                precio
              </label>
              <input
                className="input_user"
                type="text"
                id="precio"
                name="precio"
                autoComplete="false"
                defaultValue={ceboData?.precio}
                {...register('precio')}
              />

              <label htmlFor="custom-input" className="custom-placeholder">
                código
              </label>
              <input
                className="input_user"
                type="text"
                id="codigo"
                name="cogigo"
                autoComplete="false"
                defaultValue={ceboData?.codigo}
                {...register('codigo')}
              />
              <label htmlFor="custom-input" className="custom-placeholder">
                código
              </label>
            </div>
            <Uploadfile />
            <div className="btn_container">
              <button
                className="btn"
                type="submit"
                disabled={send}
                style={{ background: send ? '#49c1a388' : '#49c1a2' }}
              >
                Actualizar en el catálogo
              </button>
            </div>
          </form>
        </div>
        <EliminarCebo ceboId={ceboData?._id} />
      </div>
    </>
  );
};
