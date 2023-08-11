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

  useEffect(() => console.log('aqui', changeRol), [changeRol]);

  const user = res?.data;
  console.log(user?.rol);

  const updateUserRole = (newRole) => {
    console.log('entro');
    setChangeRol(newRole);
  };

  return (
    <div>
      <p>{user?._id}</p>
      <p>{user?.name}</p>
      <p>{user?.email}</p>
      <p>{user?.rol}</p>
      <p>{user?.telf}</p>
      <p>{formatDate(user?.createdAt)}</p>
      <ChangeRolUser
        userId={user?._id}
        currentRol={user?.rol}
        updateUserRole={updateUserRole}
      />
      <DeleteUserSuperAdmin userId={user?._id} />
    </div>
  );
};
