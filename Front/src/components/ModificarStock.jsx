import React, { useEffect, useState } from 'react';
import { crearPedido } from '../services/pedidos.service';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { useCrearPedidoError, useInventarioError } from '../hooks';
import { inventario, oprerarStock } from '../services/stocks.service';

export const ModificarStock = ({ ceboId, reloadPage }) => {
  const { handleSubmit, register } = useForm();
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);

  const formSubmit = async (formData) => {
    const { valorOperar } = formData;

    if (valorOperar !== 0) {
      Swal.fire({
        title: '¿Confirmas el nuevo stock?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'rgb(73, 193, 162)',
        cancelButtonColor: '#d33',
        confirmButtonText: 'YES',
      }).then(async (result) => {
        if (result.isConfirmed) {
          setSend(true);
          setRes(await oprerarStock(formData, ceboId));
          setSend(false);
          reloadPage();
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
    useInventarioError(res);
  }, [res]);

  return (
    <div className="form-wrap">
      <form onSubmit={handleSubmit(formSubmit)}>
        <div className="email_container form-group">
          <label htmlFor="cantidades" className="custom-placeholder">
            Suma el valor al Stock total
          </label>
          <input
            className="input_cantidades"
            type="number"
            id="cantidades"
            name="cantidades"
            autoComplete="off"
            {...register('valorOperar', { required: true })}
          />
        </div>

        <div className="btn_container">
          <button
            className="btn"
            type="submit"
            disabled={send}
            style={{ background: send ? '#007DBC;' : '#7ebbda;' }}
          >
            Actualizar Stock
          </button>
        </div>
      </form>
    </div>
  );
};
