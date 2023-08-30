import React, { useEffect, useState } from 'react';
import { mostrarUsers } from '../services/user.service';
import { UsersList } from '../components';

export const GestionCuentas = () => {
  const [res, setRes] = useState([]);
  const [send, setSend] = useState(false);

  const crearListaUsers = async () => {
    setSend(true);
    setRes(await mostrarUsers());
    setSend(false);
  };
  useEffect(() => {
    crearListaUsers();
  }, []);
  return <>{res.data?.length > 0 && <UsersList data={res.data} />}</>;
};
