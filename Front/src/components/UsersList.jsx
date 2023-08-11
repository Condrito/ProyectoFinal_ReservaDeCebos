import React from 'react';
import { NavLink } from 'react-router-dom';
import { formatDate } from '../utils/formatDate';

export const UsersList = ({ data }) => {
  return (
    <>
      <ul className="user-list">
        {data?.map((user) => (
          <li key={user._id}>
            <NavLink to={`/user/${user._id}`}>{user.name}</NavLink>
            <p>{user.email}</p>
            <p>{user.rol}</p>
            <p>{user.telf}</p>
            <p>{user.rol}</p>
            <p>{formatDate(user.createdAt)}</p>
          </li>
        ))}
      </ul>
    </>
  );
};
