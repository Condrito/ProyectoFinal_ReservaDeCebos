import { Navigate } from 'react-router-dom';

import { useUser } from '../context/userContext';

export const ProtectedCheckChildren = ({ children }) => {
  const { user, allUser } = useUser();
  if (allUser?.data?.user?.check == true || user?.check == true) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};
