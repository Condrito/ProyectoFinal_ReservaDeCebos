import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { CambiarEstadoPedido, CeboCard, PedidoCard, UserCard } from '../components';
import { mostrarPedidos } from '../services/pedidos.service';
import { useMostrarTodosPedidosError } from '../hooks';
import './GestionarPedidos.css';
export const GestionarPedidos = () => {
  const [res, setRes] = useState([]);
  const [resError, setError] = useState(false);
  const [reload, setReload] = useState(0);

  const crearListaTodosPedidos = async () => {
    setRes(await mostrarPedidos());
  };

  useEffect(() => {
    crearListaTodosPedidos();
  }, [reload]);

  const updateEstadoPedidos = () => {
    setReload(reload + 1);
  };

  useEffect(() => {
    useMostrarTodosPedidosError(res, setError);
  }, [res]);
  // redirigimos al dashboard en caso de error en la llamada para mostrar el catalogo
  if (resError) {
    return <Navigate to="/dashboard" />;
  }

  console.log(res.data);
  return (
    <div>
      {
        <ul>
          {res.data?.map((item) => (
            <li className="pedidosUserContainer" key={item._id}>
              <UserCard userData={item.user} />
              <PedidoCard pedidoData={item} />
              {item.estado == 'pendiente' ? (
                <CambiarEstadoPedido
                  pedidoId={item._id}
                  updateEstadoPedidos={updateEstadoPedidos}
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

// todos los pedidos
// por estado
//por dia

//mostrar por usuario
//mostrar por cebo
