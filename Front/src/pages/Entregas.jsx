import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  CambiarEstadoPedido,
  CambiarEstadoReserva,
  CeboCard,
  EntregaDeLaReserva,
  EntregaDelPedido,
  PedidoCard,
  ReservaCard,
  UserCard,
} from '../components';

import { useMostrarTodosPedidosError, useMostrarTodasReservasError } from '../hooks';
import './GestionarPedidos.css';
import { mostrarReservas } from '../services/reservas.service';
import { mostrarPedidos } from '../services/pedidos.service';

export const Entregas = () => {
  const [datos, setDatos] = useState({ pedidos: [], reservas: [] });
  const [error, setError] = useState(false);

  const obtenerDatos = async () => {
    try {
      const pedidosResponse = await mostrarPedidos();
      const reservasResponse = await mostrarReservas();

      setDatos({ pedidos: pedidosResponse.data, reservas: reservasResponse.data });
    } catch (error) {
      setError(true);
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  useEffect(() => {
    useMostrarTodosPedidosError(datos.pedidos, setError);
    useMostrarTodasReservasError(datos.reservas, setError);
  }, [datos]);

  // Filtra los pedidos y reservas con estado "pendiente"
  const pedidosPendientes = datos.pedidos.filter(
    (pedido) => pedido.estado === 'confirmado',
  );
  const reservasPendientes = datos.reservas.filter(
    (reserva) => reserva.estado === 'confirmada',
  );

  // Redirige al dashboard en caso de error al cargar los datos
  if (error) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div>
      <h1>Entregas de Pedidos y Reservas</h1>
      <ul>
        {pedidosPendientes.map((item) => (
          <li className="pedidosUserContainer" key={item._id}>
            <UserCard userData={item.user} />
            <PedidoCard pedidoData={item} />
            <EntregaDelPedido pedidoId={item._id} obtenerDatos={obtenerDatos} />
          </li>
        ))}
        {reservasPendientes.map((item) => (
          <li className="reservasUserContainer" key={item._id}>
            <UserCard userData={item.user} />
            <ReservaCard reservaData={item} />
            <EntregaDeLaReserva reservaId={item._id} obtenerDatos={obtenerDatos} />
          </li>
        ))}
      </ul>
    </div>
  );
};
