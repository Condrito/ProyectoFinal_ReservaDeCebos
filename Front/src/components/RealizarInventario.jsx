import React, { useEffect, useState } from 'react';
import { crearPedido } from '../services/pedidos.service';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { useCrearPedidoError, useInventarioError } from '../hooks';
import { inventario } from '../services/stocks.service';

export const RealizarInventario = ({ ceboId, reloadPage }) => {
  const { handleSubmit, register } = useForm();
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);

  const formSubmit = async (formData) => {
    const { stockTotal } = formData;
    const customFormData = {
      stockTotal: stockTotal,
    };

    if (stockTotal > 0) {
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
          setRes(await inventario(customFormData, ceboId));
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
            Nuevo stock total
          </label>
          <input
            className="input_cantidades"
            type="number"
            id="cantidades"
            name="cantidades"
            autoComplete="off"
            {...register('stockTotal', { required: true })}
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
            Actualizar Stock
          </button>
        </div>
      </form>
    </div>
  );
};
