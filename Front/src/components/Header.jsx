import './Header.css';

import { NavLink } from 'react-router-dom';

import { useUser } from '../context/userContext';

export const Header = () => {
  const { user, logout } = useUser();

  return (
    <>
      <header>
        <nav>
          {user !== null && <h2>¡Hola {user?.user}!</h2>}
          {user == null && (
            <NavLink to="/login">
              <img
                src="https://res.cloudinary.com/dq186ej4c/image/upload/v1685705523/login_ljn9fb.png"
                alt=""
                className="iconNav"
              />
            </NavLink>
          )}
          {user !== null ? (
            <NavLink to="/dashboard">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="iconDashBoard"
                viewBox="0 0 16 16"
              >
                <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146ZM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5Z" />
              </svg>
            </NavLink>
          ) : null}
          {/* <NavLink to="/">
            <img
              src="https://res.cloudinary.com/dq186ej4c/image/upload/v1685705455/home_circle_outline_icon_139029_xdnnt2.png"
              alt=""
              className="iconNav home"
            />
          </NavLink> */}
          {user !== null && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="black"
              className="iconLogout"
              viewBox="0 0 16 16"
              onClick={() => logout()}
            >
              <path
                fill-rule="evenodd"
                d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"
              />
              <path
                fill-rule="evenodd"
                d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"
              />
            </svg>
          )}
          {user !== null ? (
            <>
              <NavLink to="/profile">
                <img
                  className="profileCircle imagenAvatar"
                  src={user.imagen}
                  alt={user.user}
                />
              </NavLink>
            </>
          ) : null}
        </nav>
      </header>
      <div className="whiteContainer"></div>
    </>
  );
};

/*<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
</svg>*/
