import { Navigate } from 'react-router-dom';

import { useUser } from '../context/userContext';

export const Protected = ({ children }) => {
  const { user } = useUser();
  if (user == null || user?.check == false) {
    localStorage.removeItem('user');
    return <Navigate to="/login" />;
  }

  return children;
};
