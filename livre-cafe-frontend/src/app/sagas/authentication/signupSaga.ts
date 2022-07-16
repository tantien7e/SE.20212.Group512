import authenticationApi from '@app/api/authenticationApi';
import {
  clearPhone,
  SignupBody,
  SignupResponse,
  submitLogin,
  submitSignup,
  submitSignupFailed,
  submitSignupSucceeded,
  verifyPhone,
  verifyPhoneFailed,
  verifyPhoneSucceeded,
} from '@app/app/features/authentication/authentication-slice';
import { StaffResponse } from '@app/models/user.interface';
import { getErrorMessage } from '@app/utils';
import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';

function* signup(action: PayloadAction<SignupBody>) {
  try {
    const data = (yield call(
      authenticationApi.signup,
      action.payload,
    )) as SignupResponse;
    console.log(data);
    yield put(submitSignupSucceeded(data));
    yield put(
      submitLogin({
        username: action.payload.username,
        password: action.payload.password,
      }),
    );
    yield put(clearPhone());
  } catch (error) {
    yield put(submitSignupFailed(getErrorMessage(error as AxiosError)));
  }
}

function* verifyPhoneNum(action: PayloadAction<string>) {
  try {
    console.log('verify saga');
    const data = (yield call(
      authenticationApi.verifyPhone,
      action.payload,
    )) as StaffResponse;
    yield put(verifyPhoneSucceeded(data));
  } catch (error) {
    yield put(verifyPhoneFailed(getErrorMessage(error as AxiosError)));
  }
}

export default function* signupSaga(): Generator {
  yield takeEvery(submitSignup.toString(), signup);
  yield takeEvery(verifyPhone.toString(), verifyPhoneNum);
}
