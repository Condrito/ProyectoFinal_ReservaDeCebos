import React from 'react';
import { CeboCard } from './CeboCard';
import { formatDate, formatDateWithoutHours } from '../utils/formatDate';
import './PedidoCard.css';
export const PedidoCard = ({ pedidoData }) => {
  let estadoClassName = '';

  // Definir la clase CSS según el estado del pedido
  switch (pedidoData.estado) {
    case 'pendiente':
      estadoClassName = 'estado-pendiente';
      break;
    case 'cancelado':
      estadoClassName = 'estado-cancelado';
      break;
    case 'confirmado':
      estadoClassName = 'estado-confirmado';
      break;
    default:
      estadoClassName = '';
  }

  return (
    <div className="pedidoContainer">
      <CeboCard ceboData={pedidoData.cebo} />
      <div className="dataContainer">
        <h2>Cantidad pedida: {pedidoData.cantidad}</h2>
        <h3 className={estadoClassName}>{pedidoData.estado}</h3>
        <p>Pedido para el día {formatDateWithoutHours(pedidoData.fechaDelPedido)}</p>
        <p>Realizado el día {formatDate(pedidoData.createdAt)}</p>
      </div>
    </div>
  );
};
