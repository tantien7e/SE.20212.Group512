import authenticationApi from '@app/api/authenticationApi';
import {
  LoginBody,
  LoginResponse,
  submitLogin,
  submitLoginFailed,
  submitLoginSucceeded,
  verify,
  verifyFailed,
  VerifyPayload,
  VerifyResponse,
  verifySucceeded,
} from '@app/app/features/authentication/authentication-slice';
import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeEvery } from 'redux-saga/effects';

function* login(action: PayloadAction<LoginBody>) {
  try {
    const data = (yield call(
      authenticationApi.login,
      action.payload,
    )) as LoginResponse;
    localStorage.setItem('token', data.token);
    yield put(submitLoginSucceeded(data));
  } catch (error) {
    const { message } = error as Error;
    yield put(submitLoginFailed(message));
  }
}

function* verifyAuth(action: PayloadAction<VerifyPayload>) {
  const callback = action.payload.callback;
  const token = localStorage.getItem('token') || '';
  try {
    const data = (yield call(
      authenticationApi.verify,
      token,
    )) as VerifyResponse;
    yield put(verifySucceeded());
    yield call(callback, data.success);
  } catch (error) {
    yield put(verifyFailed('Not authorized'));
    yield call(callback, false);
  }
}

export default function* loginSaga(): Generator {
  yield takeEvery(submitLogin.toString(), login);
  yield takeEvery(verify.toString(), verifyAuth);
}
