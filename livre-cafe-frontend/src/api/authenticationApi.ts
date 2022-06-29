import axiosClient from '@app/api/axiosClient';
import { LoginBody } from '@app/app/features/authentication/authentication-slice';
import { LOGIN_URL, VERIFY_URL } from '@app/constants';

const authenticationApi = {
  login(body: LoginBody) {
    const url = LOGIN_URL;
    return axiosClient.post(url, body);
  },
  verify(token: string) {
    const url = VERIFY_URL;
    return axiosClient.get(
      url,
      {
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
  },
};

export default authenticationApi;
