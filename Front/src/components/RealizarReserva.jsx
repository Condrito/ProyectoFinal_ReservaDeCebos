import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { useCrearPedidoError, useCrearReservaError } from '../hooks';
import { crearReserva } from '../services/reservas.service';

export const RealizarReserva = ({ ceboId, stockDisponible }) => {
  const { handleSubmit, register } = useForm();
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);

  const formSubmit = async (formData) => {
    const { cantidad } = formData;

    if (cantidad > 0) {
      Swal.fire({
        title: '¿Quieres confirmar la Reserva?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'rgb(73, 193, 162)',
        cancelButtonColor: '#d33',
        confirmButtonText: 'YES',
      }).then(async (result) => {
        if (result.isConfirmed) {
          console.log(formData);
          setSend(true);
          setRes(await crearReserva(formData, ceboId));
          setSend(false);
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Introduce una cantidad válida',
        showConfirmButton: false,
        timer: 2500,
      });
    }
  };

  useEffect(() => {
    useCrearReservaError(res);
  }, [res]);

  return (
    <div className="form-wrap">
      <h1>Realizar reserva</h1>

      <form onSubmit={handleSubmit(formSubmit)}>
        <div className="email_container form-group">
          <label htmlFor="cantidades" className="custom-placeholder">
            Cantidad
          </label>
          <input
            className="input_cantidades"
            type="number"
            id="cantidad"
            name="cantidad"
            autoComplete="off"
            {...register('cantidad', { required: true })}
            min="0"
            max={stockDisponible} // Agrega el atributo min para evitar valores negativos y no mas alto que el stock disponible
          />
        </div>

        <div className="btn_container">
          <button
            className="btn"
            type="submit"
            disabled={send}
            style={{ background: send ? '#007DBC;' : '#7ebbda;' }}
          >
            Realizar Reserva
          </button>
        </div>
      </form>
    </div>
  );
};
