import './FigureUser.css';
export const FigureUser = (user) => {
  return (
    <figure className="dataProfile">
      <img src={user.user.imagen} alt="user imagen" className="imageUser" />
      <h4 className="emailUser">Email: {user.user.email}</h4>
    </figure>
  );
};
