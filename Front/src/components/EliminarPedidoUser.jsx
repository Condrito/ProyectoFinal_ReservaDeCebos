import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { useEliminarPedidoUsuarioError } from '../hooks';
import { borrarPedidoUsuario } from '../services/pedidos.service';

export const EliminarPedidoUser = ({ pedidoId, pedidoBorrado }) => {
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
        setRes(await borrarPedidoUsuario(pedidoId));
        setSend(false);
        pedidoBorrado(pedidoId);
      }
    });
  };

  useEffect(() => {
    useEliminarPedidoUsuarioError(res, setRes, setOkDelete);
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
