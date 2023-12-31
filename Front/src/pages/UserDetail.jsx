import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { mostrarUserById } from '../services/user.service';
import { useUserViewByIdError } from '../hooks';
import { formatDate } from '../utils/formatDate';
import { ChangeRolUser } from '../components/ChangeRolUser';
import { DeleteUserSuperAdmin } from '../components/DeleteUserSuperAdmin';

export const UserDetail = () => {
  const { userId } = useParams();
  const [res, setRes] = useState(null);
  const [changeRol, setChangeRol] = useState('');

  const userView = async (userId) => {
    setRes(await mostrarUserById(userId));
  };

  useEffect(() => {
    userView(userId);
  }, [userId, changeRol]);
  useEffect(() => {
    useUserViewByIdError(res);
  }, [res]);

  useEffect(() => {
    console.log(changeRol);
  }, [changeRol]);

  const user = res?.data;

  const updateUserRole = (newRole) => {
    setChangeRol(newRole);
  };

  return (
    <div className="user-list">
      <div className="user-container detail">
        <img className="profileCircleAvatar" src={user?.imagen} alt={user?.name} />
        <div className="info-container">
          <p>Nombre: {user?.name}</p>
          <p>Email: {user?.email}</p>
          <p>Rol: {user?.rol}</p>
          <p>Teléfono: {user?.telf}</p>
          <p>Fecha de registro: {formatDate(user?.createdAt)}</p>
        </div>
        <div className="function-container">
          <ChangeRolUser
            userId={user?._id}
            currentRol={user?.rol}
            updateUserRole={updateUserRole}
          />
          <DeleteUserSuperAdmin userId={user?._id} />
        </div>
      </div>
    </div>
  );
};
