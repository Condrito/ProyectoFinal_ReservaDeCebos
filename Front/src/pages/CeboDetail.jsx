import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMostrarCeboIdError } from '../hooks';
import { CeboCardUpdate } from '../components';
import { mostrarCeboId } from '../services/cebos.service';

export const CeboDetail = () => {
  const { ceboId } = useParams();
  const [res, setRes] = useState(null);

  const ceboView = async (id) => {
    setRes(await mostrarCeboId(id));
  };

  useEffect(() => {
    ceboView(ceboId);
  }, [ceboId]);
  useEffect(() => {
    useMostrarCeboIdError(res);
  }, [res]);

  return (
    <div>
      <CeboCardUpdate ceboData={res?.data} ceboView={ceboView} />
    </div>
  );
};
