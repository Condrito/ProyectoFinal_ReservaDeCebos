import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMostrarCeboIdError } from '../hooks';
import { CeboCardUpdate } from '../components';
import { mostrarCeboId } from '../services/cebos.service';

export const CeboDetail = () => {
  const { ceboId } = useParams();
  const [res, setRes] = useState(null);
  const [reload, setReload] = useState(0);

  const ceboView = async (id) => {
    setRes(await mostrarCeboId(id));
  };

  useEffect(() => {
    ceboView(ceboId);
  }, [ceboId, reload]);
  useEffect(() => {
    useMostrarCeboIdError(res);
  }, [res]);

  const cebo = res?.data;

  const updateAndReload = () => {
    setReload(reload + 1);
  };

  return (
    <div>
      <CeboCardUpdate ceboData={cebo} updateAndReload={updateAndReload} />
    </div>
  );
};
