import './index.css';

import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import App from './App.jsx';
import { Protected, ProtectedCheckChildren } from './components';
import { UserContextProvider } from './context/userContext';
import {
  CheckCode,
  Dashboard,
  ForgotPassword,
  Home,
  Login,
  Page404NotFound,
  Profile,
  Register,
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
          <Route path="/*" element={<Page404NotFound />} />
        </Route>
      </Routes>
    </UserContextProvider>
  </BrowserRouter>,
);
