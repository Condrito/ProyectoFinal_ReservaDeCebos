import './PedidosUsers.css';
import React, { useEffect, useState } from 'react';
import { CeboCard, DayPicker, RealizarPedido } from '../components';
import { mostrarCatalogo } from '../services/cebos.service';
import { useMostrarCatalogoError } from '../hooks';
import { Navigate } from 'react-router-dom';

export const PedidosUsers = () => {
  const [fechaDelPedido, setFechaDelPedido] = useState(null);
  const [res, setRes] = useState([]);
  const [resError, setError] = useState(false);

  const handleDateChange = (date) => {
    setFechaDelPedido(date);
  };

  const crearListaCebo = async () => {
    setRes(await mostrarCatalogo());
  };

  useEffect(() => {
    crearListaCebo();
  }, [fechaDelPedido]);

  useEffect(() => {
    useMostrarCatalogoError(res, setError);
  }, [res]);
  // redirigimos al dashboard en caso de error en la llamada para mostrar el catalogo
  if (resError) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="pedidos-page-container">
      {fechaDelPedido == null ? (
        <>
          <h3>Elige primero el día que quieres venir a recoger tu pedido de cebo</h3>
          <DayPicker selectedDate={fechaDelPedido} onDateChange={handleDateChange} />
        </>
      ) : (
        <ul className="pedidos-page-container">
          {res.data.map((item) => (
            <li className="pedidos-user" key={item._id}>
              <CeboCard ceboData={item} />
              <RealizarPedido fechaDelPedido={fechaDelPedido} ceboId={item._id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
