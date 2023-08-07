import './Profile.css';

import { useState } from 'react';

import { ChangePassword, FormProfile } from '../components';
import { useUser } from '../context/userContext';
import { useDeleteUser } from '../hooks';

export const Profile = () => {
  const [changeRender, setChangeRender] = useState(true);
  const { setUser } = useUser();

  return (
    <>
      <div className="containerNavProfile">
        <button onClick={() => setChangeRender(false)}>Change Password</button>
        <button onClick={() => setChangeRender(true)}>Update User Data</button>
        <button onClick={() => useDeleteUser(setUser)}>Delete User</button>
      </div>
      <div className="fluidContainerProfile">
        {changeRender ? <FormProfile /> : <ChangePassword />}
      </div>
    </>
  );
};
