import React from 'react';
import './CeboCard.css';

export const CeboCard = ({ ceboData }) => {
  return (
    <div className="cebo-container">
      <h2>{ceboData?.ceboVivo}</h2>
      <img
        className="catalogoImg CircleCebo"
        src={ceboData?.imagen}
        alt={ceboData?.ceboVivo}
      />
      <div className="precio">
        <h2>{ceboData?.precio} €</h2>
      </div>

      <p>Cod: {ceboData?.codigo}</p>
    </div>
  );
};
