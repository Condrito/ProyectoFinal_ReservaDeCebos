import { useEffect, useState } from 'react';
import { mostrarReservasUsuario } from '../services/reservas.service';
import { useMostrarReservasUsuarioError } from '../hooks';
import { Navigate } from 'react-router-dom';
import { ReservaCard } from '../components';
import { EliminarReservaUser } from '../components/EliminarReservaUser';

export const MisReservas = () => {
  const [res, setRes] = useState([]);
  const [resError, setError] = useState(false);
  const [reservaBorradaId, setReservaBorradaId] = useState('');

  const crearListaReservas = async () => {
    setRes(await mostrarReservasUsuario());
  };

  useEffect(() => {
    crearListaReservas();
  }, [reservaBorradaId]);

  const reservaBorrada = (id) => {
    console.log('entro');
    setReservaBorradaId(id);
  };

  useEffect(() => {
    useMostrarReservasUsuarioError(res, setError);
  }, [res]);

  // redirigimos al dashboard en caso de error en la llamada para mostrar la lista de reservas del usuario
  if (resError) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div>
      {res?.data?.length === 0 ? ( // Verifica si el array de reservas está vacío
        <h3>No tienes ninguna reserva</h3>
      ) : (
        <ul className="pedidosContainer">
          {res?.data?.map((item) => (
            <li className="pedidoContainer" key={item._id}>
              <ReservaCard reservaData={item} />
              {item?.estado === 'pendiente' ? (
                <EliminarReservaUser
                  reservaId={item._id}
                  reservaBorrada={reservaBorrada}
                />
              ) : (
                ''
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
