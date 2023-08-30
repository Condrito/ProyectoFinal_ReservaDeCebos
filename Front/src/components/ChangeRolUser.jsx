import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { cambiarRol } from '../services/user.service';
import { useForm } from 'react-hook-form';
import { useChangeRolError } from '../hooks';

export const ChangeRolUser = ({ userId, currentRol, updateUserRole }) => {
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
  const { handleSubmit, register, setValue } = useForm();

  const formSubmit = async (formData) => {
    const { newRol } = formData;

    if (newRol !== currentRol) {
      Swal.fire({
        title: '¿Estás seguro que quieres cambiar el Rol de este usuario?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'rgb(73, 193, 162)',
        cancelButtonColor: '#d33',
        confirmButtonText: 'YES',
      }).then(async (result) => {
        if (result.isConfirmed) {
          setSend(true);
          setRes(await cambiarRol(formData, userId));
          setSend(false);
          updateUserRole(currentRol);
          // Si el cambio de rol fue exitoso, actualiza el rol en el componente padre
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: ' Este usuario ya tiene ese Rol',
        showConfirmButton: false,
        timer: 2500,
      });
    }
  };

  useEffect(() => {
    useChangeRolError(res);
  }, [res]);

  return (
    <>
      <div>
        <form className="form-container" onSubmit={handleSubmit(formSubmit)}>
          <label>
            <select
              {...register('newRol')}
              onChange={(e) => setValue('newRol', e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="superAdmin">SuperAdmin</option>
              <option value="user">User</option>
            </select>
          </label>

          <button
            className="btn rol"
            type="submit"
            disabled={send}
            style={{ background: send ? '#49c1a388' : '#49c1a2' }}
          >
            Cambiar rol de usuario
          </button>
        </form>
      </div>
    </>
  );
};
