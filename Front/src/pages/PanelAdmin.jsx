import React from 'react';
import { Link } from 'react-router-dom';

export const PanelAdmin = () => {
  return (
    <>
      <div>PanelUser</div>
      <ul>
        <li>
          <Link to="/gestionarpedidos">Gestión de Pedidos</Link>
        </li>
        <li>
          <Link to="/gestionarreservas">Gestión de Reservas</Link>
        </li>
        <li>
          <Link to="/gestionarstock">Gestión de Stock</Link>
        </li>
        <li>
          <Link to="/gestionarcatalogo">Gestión del Catálogo</Link>
        </li>
      </ul>
    </>
  );
};
