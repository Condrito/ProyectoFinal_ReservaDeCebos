import React from 'react';
import { NavLink } from 'react-router-dom';
import { formatDate } from '../utils/formatDate';

export const UsersList = ({ data }) => {
  return (
    <>
      <ul className="user-list">
        {data?.map((user) => (
          <li key={user._id}>
            <NavLink to={`/user/${user._id}`}>
              <div className="user-container">
                <img className="profileCircle" src={user.imagen} alt={user.name} />
                <p>Nombre: {user.name}</p>
                <p>Email: {user.email}</p>
                <p>Rol: {user.rol}</p>
                <p>Teléfono: {user.telf}</p>
                <p>Fecha de registro: {formatDate(user.createdAt)}</p>
              </div>
            </NavLink>
          </li>
        ))}
      </ul>
    </>
  );
};
