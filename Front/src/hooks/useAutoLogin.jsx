import { autoLoginUser } from '../services/user.service';

export const useAutoLogin = async (allUser, userLogin, setOkCheck) => {
  try {
    const { email, password } = allUser?.data?.user;

    const customFormData = {
      email,
      password,
    };
    const setData = await autoLoginUser(customFormData);
    if (setData?.status == 200) {
      const dataCustom = {
        token: setData.data.token,
        user: setData.data.user.name,
        email: setData.data.user.email,
        imagen: setData.data.user.imagen,
        check: setData.data.user.check,
      };

      const dataString = JSON.stringify(dataCustom);
      userLogin(dataString);
      setOkCheck(() => true);
    }
  } catch (error) {
    console.log(error);
  }
};
