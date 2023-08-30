import React from 'react';
import './PedidoCard.css';

export const StockCard = ({ stockData }) => {
  return (
    <div className="stockContainer">
      <div className="dataContainer">
        <h2>Cantidad en stock: {stockData.stockTotal}</h2>
        <h3>Cantidad disponible: {stockData.stockDisponible}</h3>
        <h3>
          cantidad en pedidos confirmados y reservas confirmadas:{' '}
          {stockData.CantidadesPedidosReservas}
        </h3>

        <p>Fecha de la última actualización: {stockData.fechaStockActualizado}</p>
        <p>Hora de la última actualización: {stockData.horaStockActualizado}</p>
      </div>
    </div>
  );
};
