import { Navigate } from 'react-router-dom';

import { useUser } from '../context/userContext';

export const ProtectedAdmin = ({ children }) => {
  const { user } = useUser();
  if (user.rol !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};
