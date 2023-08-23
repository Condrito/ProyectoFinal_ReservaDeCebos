import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { useEliminarCeboError } from '../hooks';

import { eliminarCebo } from '../services/cebos.service';
import { Navigate } from 'react-router-dom';

export const EliminarCebo = ({ ceboId }) => {
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
  const [okDelete, setOkDelete] = useState(false);

  const handleDeleteUser = () => {
    Swal.fire({
      title: '¿Estas seguro que quieres eliminar este pedido?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(73, 193, 162)',
      cancelButtonColor: '#d33',
      confirmButtonText: 'YES',
    }).then(async (result) => {
      if (result.isConfirmed) {
        setSend(true);
        setRes(await eliminarCebo(ceboId));
        setSend(false);
      }
    });
  };

  useEffect(() => {
    useEliminarCeboError(res, setRes, setOkDelete);
  }, [res]);

  if (okDelete) {
    return <Navigate to="/gestionarcatalogo" />;
  }

  return (
    <>
      <button
        onClick={handleDeleteUser}
        className="btn"
        type="submit"
        disabled={send}
        style={{ background: send ? '#49c1a388' : '#49c1a2' }}
      >
        Eliminar del catálogo
      </button>
    </>
  );
};
