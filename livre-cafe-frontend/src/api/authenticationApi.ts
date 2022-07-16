import axiosClient from '@app/api/axiosClient';
import {
  LoginBody,
  SignupBody,
} from '@app/app/features/authentication/authentication-slice';
import {
  LOGIN_URL,
  SIGNUP_URL,
  VERIFY_CODE_URL,
  VERIFY_PHONE_URL,
  VERIFY_TOKEN_URL,
} from '@app/constants';

const authenticationApi = {
  login(body: LoginBody) {
    const url = LOGIN_URL;
    return axiosClient.post(url, body);
  },
  verifyToken(token: string) {
    const url = VERIFY_TOKEN_URL;
    return axiosClient.get(url, {
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json',
      },
    });
  },
  verifyPhone(phone: string) {
    const url = VERIFY_PHONE_URL;
    return axiosClient.post(url, { phone });
  },
  signup(body: SignupBody) {
    const url = SIGNUP_URL;
    return axiosClient.post(url, body);
  },
  verifyCode({ phone, code }: { phone: string; code: string }) {
    const url = VERIFY_CODE_URL;
    return axiosClient.post(url, { phone, code });
  },
};

export default authenticationApi;
