import React from 'react';

import { Link } from 'react-router-dom';
export const PanelUser = () => {
  return (
    <>
      <ul className="panel-container user">
        <li className="panel-button">
          <Link to="/pedidosusers">Realizar Pedidos</Link>
        </li>
        <li className="panel-button">
          <Link to="/reservasusers">Realizar Reservas</Link>
        </li>
        <li className="panel-button">
          <Link to="/mispedidos">Mis Pedidos</Link>
        </li>
        <li className="panel-button">
          <Link to="/misreservas">Mis Reservas</Link>
        </li>
      </ul>
    </>
  );
};
