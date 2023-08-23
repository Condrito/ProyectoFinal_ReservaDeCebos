import React, { useEffect, useState } from 'react';
import { mostrarPedidosUsuario } from '../services/pedidos.service';
import { useMostrarPedidosUsuarioError } from '../hooks';
import { Navigate } from 'react-router-dom';
import { EliminarPedidoUser, PedidoCard } from '../components';

export const MisPedidos = () => {
  const [res, setRes] = useState([]);
  const [resError, setError] = useState(false);
  const [pedidoBorradoId, setPedidoBorradoId] = useState('');

  const crearListaPedidos = async () => {
    setRes(await mostrarPedidosUsuario());
  };

  useEffect(() => {
    crearListaPedidos();
  }, [pedidoBorradoId]);

  const pedidoBorrado = (id) => {
    setPedidoBorradoId(id);
  };

  useEffect(() => {
    useMostrarPedidosUsuarioError(res, setError);
  }, [res]);
  // redirigimos al dashboard en caso de error en la llamada para mostrar la lista de pedidos del usuario
  if (resError) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <ul className="pedidosContainer">
      {res?.data?.map((item) => (
        <li className="pedidoContainer" key={item._id}>
          <PedidoCard pedidoData={item} />
          {item.estado == 'pendiente' ? (
            <EliminarPedidoUser pedidoId={item._id} pedidoBorrado={pedidoBorrado} />
          ) : (
            ''
          )}
        </li>
      ))}
    </ul>
  );
};
