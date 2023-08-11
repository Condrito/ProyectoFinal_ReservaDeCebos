import React from 'react';

import { Link } from 'react-router-dom';
export const PanelUser = () => {
  return (
    <>
      <div>PanelUser</div>
      <ul>
        <li>
          <Link to="/pedidosusers">Pide</Link>
        </li>
        <li>
          <Link to="/reservasusers">Reserva</Link>
        </li>
        <li>
          <Link to="/mispedidos">Mis Pedidos</Link>
        </li>
        <li>
          <Link to="/misreservas">Mis Reservas</Link>
        </li>
      </ul>
    </>
  );
};
