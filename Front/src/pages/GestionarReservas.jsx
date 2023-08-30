import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  CambiarEstadoPedido,
  CambiarEstadoReserva,
  CeboCard,
  PedidoCard,
  ReservaCard,
  UserCard,
} from '../components';

import { useMostrarTodasReservasError, useMostrarTodosPedidosError } from '../hooks';
import './GestionarPedidos.css';
import { mostrarReservas } from '../services/reservas.service';
export const GestionarReservas = () => {
  const [res, setRes] = useState([]);
  const [resError, setError] = useState(false);
  const [reload, setReload] = useState(0);

  const crearListaTodasReservas = async () => {
    setRes(await mostrarReservas());
  };

  useEffect(() => {
    crearListaTodasReservas();
  }, [reload]);

  const updateEstadoReservas = () => {
    setReload(reload + 1);
  };

  useEffect(() => {
    useMostrarTodasReservasError(res, setError);
  }, [res]);
  // redirigimos al dashboard en caso de error en la llamada para mostrar el catalogo
  if (resError) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div>
      {
        <ul>
          {res.data?.map((item) => (
            <li className="reservasUserContainer" key={item._id}>
              <UserCard userData={item.user} />
              <ReservaCard reservaData={item} />
              {item.estado == 'pendiente' ? (
                <CambiarEstadoReserva
                  reservaId={item._id}
                  updateEstadoReservas={updateEstadoReservas}
                />
              ) : (
                ''
              )}
            </li>
          ))}
        </ul>
      }
    </div>
  );
};
