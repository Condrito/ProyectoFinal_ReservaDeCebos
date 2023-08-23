import './PedidosUsers.css';
import React, { useEffect, useState } from 'react';
import { CeboCard, RealizarPedido } from '../components';
import { useMostrarCatalogoConStockError, useMostrarCatalogoError } from '../hooks';
import { Navigate } from 'react-router-dom';
import { mostrarCatalogoConStock } from '../services/stocks.service';
import { RealizarReserva } from '../components/RealizarReserva';

export const ReservasUsers = () => {
  const [res, setRes] = useState([]);
  const [resError, setError] = useState(false);

  const crearListaCebo = async () => {
    setRes(await mostrarCatalogoConStock());
  };

  useEffect(() => {
    crearListaCebo();
  }, []);

  useEffect(() => {
    useMostrarCatalogoConStockError(res, setError);
  }, [res]);
  // redirigimos al dashboard en caso de error en la llamada para mostrar el catalogo
  if (resError) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div>
      <ul>
        {res.data?.map((item) => (
          <li key={item._id}>
            <CeboCard ceboData={item.cebo} />
            <h2>{item.stockDisponible}</h2>
            <RealizarReserva
              ceboId={item.cebo._id}
              stockDisponible={item.stockDisponible}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
