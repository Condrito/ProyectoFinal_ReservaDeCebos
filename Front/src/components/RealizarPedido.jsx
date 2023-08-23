import React, { useEffect, useState } from 'react';
import { crearPedido } from '../services/pedidos.service';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { useCrearPedidoError } from '../hooks';

export const RealizarPedido = ({ fechaDelPedido, ceboId }) => {
  const { handleSubmit, register } = useForm();
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);

  const formSubmit = async (formData) => {
    const { cantidad } = formData;
    const customFormData = {
      fechaDelPedido: fechaDelPedido,
      cantidad: cantidad,
    };

    if (cantidad > 0) {
      Swal.fire({
        title: '¿Quieres confirmar el pedido?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'rgb(73, 193, 162)',
        cancelButtonColor: '#d33',
        confirmButtonText: 'YES',
      }).then(async (result) => {
        if (result.isConfirmed) {
          setSend(true);
          setRes(await crearPedido(customFormData, ceboId));
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
    useCrearPedidoError(res);
  }, [res]);

  return (
    <div className="form-wrap">
      <h1>Realizar Pedido</h1>

      <form onSubmit={handleSubmit(formSubmit)}>
        <div className="email_container form-group">
          <label htmlFor="cantidades" className="custom-placeholder">
            Cantidades
          </label>
          <input
            className="input_cantidades"
            type="number"
            id="cantidades"
            name="cantidades"
            autoComplete="off"
            {...register('cantidad', { required: true })}
            min="0" // Agrega el atributo min para evitar valores negativos
          />
        </div>

        <div className="btn_container">
          <button
            className="btn"
            type="submit"
            disabled={send}
            style={{ background: send ? '#007DBC;' : '#7ebbda;' }}
          >
            Realizar Pedido
          </button>
        </div>
      </form>
    </div>
  );
};
