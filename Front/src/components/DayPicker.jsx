import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns'; // Importar la función de formateo

export const DayPicker = ({ fechaDelPedido, onDateChange }) => {
  const [startDate, setStartDate] = useState(fechaDelPedido || null);
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 7);

  const minDate = new Date();
  if (today.getHours() < 12) {
    minDate.setDate(today.getDate() + 1);
  } else {
    minDate.setDate(today.getDate() + 2);
  }

  const handleDateChange = (date) => {
    setStartDate(date);
    const formattedDate = format(date, 'yyyy-MM-dd'); // Formatear la fecha
    onDateChange(formattedDate); // Pasar la fecha formateada a la función
  };

  return (
    <div className="day-picker">
      <label>Selecciona un día:</label>
      <DatePicker
        selected={startDate}
        onChange={handleDateChange}
        dateFormat="dd/MM/yyyy"
        isClearable
        showYearDropdown
        scrollableYearDropdown
        minDate={minDate}
        maxDate={maxDate}
      />
    </div>
  );
};
