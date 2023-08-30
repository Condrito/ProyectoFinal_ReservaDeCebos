import React from 'react';
import { Link } from 'react-router-dom';
import './Panel.css';

export const PanelAdmin = () => {
  return (
    <>
      <ul className="panel-container admin">
        <li className="panel-button entregas">
          <Link to="/entregas">Entregar Pedidos y Reservas</Link>
        </li>
        <li className="panel-button">
          <Link to="/gestionarpedidos">Gestión de Pedidos</Link>
        </li>
        <li className="panel-button">
          <Link to="/gestionarreservas">Gestión de Reservas</Link>
        </li>
        <li className="panel-button">
          <Link to="/gestionarstock">Gestión de Stock</Link>
        </li>
        <li className="panel-button">
          <Link to="/gestionarcatalogo">Gestión del Catálogo</Link>
        </li>
      </ul>
    </>
  );
};
