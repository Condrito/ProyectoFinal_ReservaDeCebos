import React from 'react';
import { useUser } from '../context/userContext';
import { Navigate } from 'react-router-dom';

export const Dashboard = () => {
  const { user } = useUser();

  console.log(user.rol);

  if (user.rol === 'superAdmin') {
    return <Navigate to="/panelsuperadmin" />;
  }

  if (user.rol === 'admin') {
    return <Navigate to="/paneladmin" />;
  }

  if (user.rol === 'user') {
    return <Navigate to="/paneluser" />;
  }
};
