import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { useChangeEstadoPedidosError, useEntregaPedidoError } from '../hooks';

import './CambiarEstadoPedido.css'; // Importa tu archivo CSS para los estilos personalizados
import { entregarPedido } from '../services/pedidos.service';

export const EntregaDelPedido = ({ pedidoId, obtenerDatos }) => {
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);

  const handleEntrega = async () => {
    Swal.fire({
      title: '¿Confirmas la entrega del pedido?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(73, 193, 162)',
      cancelButtonColor: '#d33',
      confirmButtonText: 'YES',
    }).then(async (result) => {
      if (result.isConfirmed) {
        setSend(true);
        setRes(await entregarPedido(pedidoId)); // Reemplaza EntregaDelPedido con la función correcta
        setSend(false);
        obtenerDatos();
      }
    });
  };

  useEffect(() => {
    useEntregaPedidoError(res);
  }, [res]);

  return (
    <>
      <div>
        <button
          className="btn btn-entregar"
          type="button"
          disabled={send}
          style={{ background: send ? '#49c1a388' : '#49c1a2' }}
          onClick={handleEntrega} // Cambia hadleClick a handleEntrega
        >
          Entregar
        </button>
      </div>
    </>
  );
};
