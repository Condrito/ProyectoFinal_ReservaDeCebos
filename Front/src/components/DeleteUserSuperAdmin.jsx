import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { cambiarRol, deleteUserByAdmin } from '../services/user.service';
import { useForm } from 'react-hook-form';
import { useChangeRolError, useDeleteUserSuperAdminError } from '../hooks';
import { Navigate } from 'react-router-dom';

export const DeleteUserSuperAdmin = ({ userId }) => {
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
  const [okDelete, setOkDelete] = useState(false);

  const handleDeleteUser = () => {
    Swal.fire({
      title: '¿Estás seguro que quieres eliminar a este usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(73, 193, 162)',
      cancelButtonColor: '#d33',
      confirmButtonText: 'YES',
    }).then(async (result) => {
      if (result.isConfirmed) {
        setSend(true);
        setRes(await deleteUserByAdmin(userId));
        setSend(false);
      }
    });
  };

  useEffect(() => {
    useDeleteUserSuperAdminError(res, setOkDelete);
  }, [res]);

  console.log(okDelete);

  if (okDelete) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <>
      <button
        onClick={handleDeleteUser}
        className="btn eliminar"
        type="submit"
        disabled={send}
        style={{ background: send ? '#49c1a388' : '#49c1a2' }}
      >
        Eliminar Usuario
      </button>
    </>
  );
};
