import { useMemo, useState } from 'react';
import { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const data = localStorage.getItem('user');
    const parseUser = JSON.parse(data);
    if (data) {
      return parseUser;
    } else {
      return null;
    }
  });
  //! ALLUSER -----solo cuando me registro para guardar la respuesta--

  const [allUser, setAllUser] = useState({
    data: {
      confirmationCode: '',
      user: {
        password: '',
        email: '',
      },
    },
  });

  const navigate = useNavigate();

  //? -------------------- LOGIN -------------------------------------------

  const userLogin = (data) => {
    //lo metemos al localstorage

    localStorage.setItem('user', data);

    //lo metemos al estado global

    const parseUser = JSON.parse(data);
    setUser(() => parseUser);
  };

  //? -------------------- LOGOUT -------------------------------------------

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  //? -------- PUENTE PARA CUANDO TENGAMOS PROBLEMAS DE ASYNCRONIA ----------

  const bridgeData = (state) => {
    const data = localStorage.getItem('data');
    const dataJson = JSON.parse(data);
    switch (state) {
      case 'ALLUSER':
        setAllUser(dataJson), localStorage.removeItem('data');

        break;

      default:
        break;
    }
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      userLogin,
      logout,
      allUser,
      setAllUser,
      bridgeData,
    }),
    [user, allUser],
  );
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  return useContext(UserContext);
};
