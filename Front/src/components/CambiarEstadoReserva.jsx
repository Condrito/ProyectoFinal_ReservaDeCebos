import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { useChangeEstadoReservasError } from '../hooks';

import { useForm } from 'react-hook-form';

import './CambiarEstadoPedido.css'; // Importa tu archivo CSS para los estilos personalizados
import { cambiarEstadoReserva } from '../services/reservas.service';

export const CambiarEstadoReserva = ({ reservaId, updateEstadoReservas }) => {
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);

  const { handleSubmit, register, setValue } = useForm();

  const formSubmit = async (formData) => {
    const { estado } = formData;

    if (estado === 'confirmada') {
      Swal.fire({
        title: '¿Estás seguro que quieres confirmar la reserva?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'rgb(73, 193, 162)',
        cancelButtonColor: '#d33',
        confirmButtonText: 'YES',
      }).then(async (result) => {
        if (result.isConfirmed) {
          setSend(true);
          setRes(await cambiarEstadoReserva(formData, reservaId));
          setSend(false);
          updateEstadoReservas(estado);
        }
      });
    }
    if (estado === 'cancelada') {
      Swal.fire({
        title: '¿Estás seguro que quieres cancelar la reserva?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'rgb(73, 193, 162)',
        cancelButtonColor: '#d33',
        confirmButtonText: 'YES',
      }).then(async (result) => {
        if (result.isConfirmed) {
          setSend(true);
          setRes(await cambiarEstadoReserva(formData, reservaId));
          setSend(false);
          updateEstadoReservas(estado);
        }
      });
    }
  };

  useEffect(() => {
    useChangeEstadoReservasError(res);
  }, [res]);

  return (
    <>
      <div>
        <form onSubmit={handleSubmit(formSubmit)}>
          {/* Botones para confirmar y cancelar con clases de estilo */}
          <button
            className="btn btn-confirmar" // Clase para el botón "Confirmar"
            type="button"
            onClick={() => setValue('estado', 'confirmada')}
          >
            Confirmar
          </button>
          <button
            className="btn btn-cancelar" // Clase para el botón "Cancelar"
            type="button"
            onClick={() => setValue('estado', 'cancelada')}
          >
            Cancelar
          </button>

          {/* Cuadro de texto más grande con marcador de posición */}
          <textarea
            {...register('mensaje')}
            placeholder="Mensaje para el cliente (Opcional)"
            rows="4"
          />

          {/* El campo 'estado' ahora se maneja con los botones */}
          <input type="hidden" {...register('estado')} />

          {/* Cambia el texto del botón a "Actualizar estado" */}
          <button
            className="btn"
            type="submit"
            disabled={send}
            style={{ background: send ? '#49c1a388' : '#49c1a2' }}
          >
            Actualizar estado
          </button>
        </form>
      </div>
    </>
  );
};
