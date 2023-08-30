import { Link } from 'react-router-dom';

export const PanelSuperAdmin = () => {
  return (
    <ul className="panel-container superadmin">
      <li className="panel-button">
        <Link to="/gestioncuentas">Gestionar cuentas de usuario</Link>
      </li>
    </ul>
  );
};
