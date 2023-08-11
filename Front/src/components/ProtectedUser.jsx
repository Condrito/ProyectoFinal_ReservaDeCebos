import { Navigate } from 'react-router-dom';

import { useUser } from '../context/userContext';

export const ProtectedUser = ({ children }) => {
  const { user } = useUser();
  if (user.rol !== 'user') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};
