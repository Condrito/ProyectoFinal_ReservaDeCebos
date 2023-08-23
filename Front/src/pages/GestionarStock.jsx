import React, { useEffect, useState } from 'react';
import { mostrarCatalogo } from '../services/cebos.service';
import { useMostrarCatalogoError } from '../hooks';
import { NavLink, Navigate } from 'react-router-dom';
import { CeboCard, RealizarInventario, StockCard } from '../components';

export const GestionarStock = () => {
  const [res, setRes] = useState([]);
  const [resError, setError] = useState(false);

  const crearListaCebo = async () => {
    setRes(await mostrarCatalogo());
  };

  useEffect(() => {
    crearListaCebo();
  }, []);

  useEffect(() => {
    useMostrarCatalogoError(res, setError);
  }, [res]);

  // redirigimos al dashboard en caso de error en la llamada para mostrar el catalogo
  if (resError) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div>
      {res?.data?.length > 0 ? ( // Verifica si la lista tiene elementos
        <ul>
          {res?.data?.map((item) => (
            <li key={item._id}>
              <CeboCard ceboData={item} />
              <StockCard stockData={item.stocks} />
              <RealizarInventario />
            </li>
          ))}
        </ul>
      ) : (
        <div>El catálogo está vacío</div> // Mensaje cuando no hay elementos
      )}
    </div>
  );
};
