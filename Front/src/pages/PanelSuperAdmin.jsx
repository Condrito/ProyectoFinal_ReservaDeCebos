import React, { useState } from 'react';
import { mostrarUsers } from '../services/user.service';
import { UsersList } from '../components';

export const PanelSuperAdmin = () => {
  const [res, setRes] = useState([]);
  const [send, setSend] = useState(false);

  const crearListaUsers = async () => {
    setSend(true);
    setRes(await mostrarUsers());
    setSend(false);
  };

  return (
    <>
      <div>PanelSuperAdmin</div>
      <button
        onClick={crearListaUsers}
        className="btn"
        type="submit"
        disabled={send}
        style={{ background: send ? '#007DBC' : '#7ebbda' }}
      >
        Mostrar todos los usuarios
      </button>

      {res.data?.length > 0 && <UsersList data={res.data} />}
    </>
  );
};
