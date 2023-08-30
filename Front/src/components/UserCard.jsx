import React from 'react';
import './UserCard.css';

export const UserCard = ({ userData }) => {
  return (
    <div className="userCard">
      <h2>{userData?.name}</h2>

      <h3>{userData?.email}</h3>
      <h3>{userData?.telf}</h3>
      <img className="userImg" src={userData?.imagen} alt={userData?.name} />
    </div>
  );
};
