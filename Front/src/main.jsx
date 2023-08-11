import './index.css';

import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import App from './App.jsx';
import {
  Protected,
  ProtectedAdmin,
  ProtectedCheckChildren,
  ProtectedSuperAdmin,
  ProtectedUser,
} from './components';
import { UserContextProvider } from './context/userContext';
import {
  CheckCode,
  Dashboard,
  ForgotPassword,
  Home,
  Login,
  MisPedidos,
  MisReservas,
  Page404NotFound,
  PanelAdmin,
  PanelSuperAdmin,
  PanelUser,
  PedidosUsers,
  Profile,
  Register,
  ReservasUsers,
  UserDetail,
} from './pages';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename="/">
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/verifyCode"
            element={
              <ProtectedCheckChildren>
                <CheckCode />
              </ProtectedCheckChildren>
            }
          />{' '}
          <Route
            path="/profile"
            element={
              <Protected>
                <Profile />
              </Protected>
            }
          />
          <Route
            path="/dashboard"
            element={
              <Protected>
                <Dashboard />
              </Protected>
            }
          />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route
            path="/panelsuperadmin"
            element={
              <Protected>
                <ProtectedSuperAdmin>
                  <PanelSuperAdmin />
                </ProtectedSuperAdmin>
              </Protected>
            }
          />
          <Route
            path="/user/:userId"
            element={
              <Protected>
                <ProtectedSuperAdmin>
                  <UserDetail />
                </ProtectedSuperAdmin>
              </Protected>
            }
          />
          <Route
            path="/paneladmin"
            element={
              <ProtectedAdmin>
                <PanelAdmin />
              </ProtectedAdmin>
            }
          />
          <Route
            path="/paneluser"
            element={
              <ProtectedUser>
                <PanelUser />
              </ProtectedUser>
            }
          />
          <Route
            path="/pedidosusers"
            element={
              <ProtectedUser>
                <PedidosUsers />
              </ProtectedUser>
            }
          />
          <Route
            path="/reservasusers"
            element={
              <ProtectedUser>
                <ReservasUsers />
              </ProtectedUser>
            }
          />
          <Route
            path="/mispedidos"
            element={
              <ProtectedUser>
                <MisPedidos />
              </ProtectedUser>
            }
          />
          <Route
            path="/misreservas"
            element={
              <ProtectedUser>
                <MisReservas />
              </ProtectedUser>
            }
          />
          <Route path="/*" element={<Page404NotFound />} />
        </Route>
      </Routes>
    </UserContextProvider>
  </BrowserRouter>,
);
