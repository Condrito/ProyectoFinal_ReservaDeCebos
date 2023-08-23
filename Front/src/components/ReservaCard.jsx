import React from 'react';
import { CeboCard } from './CeboCard';
import { formatDate } from '../utils/formatDate';
import './PedidoCard.css';
export const ReservaCard = ({ reservaData }) => {
  let estadoClassName = '';

  // Definir la clase CSS según el estado del pedido
  switch (reservaData?.estado) {
    case 'pendiente':
      estadoClassName = 'estado-pendiente';
      break;
    case 'cancelada':
      estadoClassName = 'estado-cancelada';
      break;
    case 'confirmada':
      estadoClassName = 'estado-confirmada';
      break;
    default:
      estadoClassName = '';
  }

  return (
    <div className="pedidoContainer">
      <CeboCard ceboData={reservaData?.cebo} />
      <div className="dataContainer">
        <h2>Cantidad reservada: {reservaData?.cantidad}</h2>
        <h3 className={estadoClassName}>{reservaData?.estado}</h3>
        <p>Realizada el día {formatDate(reservaData?.createdAt)}</p>
      </div>
    </div>
  );
};
