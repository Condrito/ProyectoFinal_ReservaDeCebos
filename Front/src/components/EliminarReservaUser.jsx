import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { useEliminarReservaUsuarioError } from '../hooks';

import { borrarReservaUsuario } from '../services/reservas.service';

export const EliminarReservaUser = ({ reservaId, reservaBorrada }) => {
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
  const [okDelete, setOkDelete] = useState(false);

  const handleDeleteUser = () => {
    Swal.fire({
      title: '¿Estas seguro que quieres eliminar esta reserva?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(73, 193, 162)',
      cancelButtonColor: '#d33',
      confirmButtonText: 'YES',
    }).then(async (result) => {
      if (result.isConfirmed) {
        setSend(true);
        setRes(await borrarReservaUsuario(reservaId));
        setSend(false);
        reservaBorrada(reservaId);
      }
    });
  };

  useEffect(() => {
    useEliminarReservaUsuarioError(res, setRes, setOkDelete);
  }, [res]);

  return (
    <>
      <button
        onClick={handleDeleteUser}
        className="btn"
        type="submit"
        disabled={send}
        style={{ background: send ? '#49c1a388' : '#49c1a2' }}
      >
        Eliminar
      </button>
    </>
  );
};
