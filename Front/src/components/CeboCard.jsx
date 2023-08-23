import React from 'react';

export const CeboCard = ({ ceboData }) => {
  console.log(ceboData);
  return (
    <div>
      <h3>{ceboData?.ceboVivo}</h3>
      <img className="catalogoImg" src={ceboData?.imagen} alt={ceboData?.ceboVivo} />
      <h2>{ceboData?.precio} €</h2>
      <p>{ceboData?.codigo}</p>
    </div>
  );
};
