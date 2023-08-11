import { Navigate } from 'react-router-dom';

import { useUser } from '../context/userContext';

export const ProtectedSuperAdmin = ({ children }) => {
  const { user } = useUser();
  if (user.rol !== 'superAdmin') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};
