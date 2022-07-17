import snacksApi from '@app/api/snacksApi';
import {
  fetchSnacks,
  deleteSnack,
  deleteSnackFailed,
  deleteSnackSucceeded,
} from '@app/app/features/snacks/snacks-slice';
import { getErrorMessage } from '@app/utils';
import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';

function* deleteSnackData(action: PayloadAction<string>) {
  //   const token = localStorage.getItem('token');
  try {
    yield call(snacksApi.remove, action.payload);
    yield put(deleteSnackSucceeded());
    yield put(fetchSnacks());
  } catch (error) {
    const message = getErrorMessage(error as AxiosError);
    yield put(deleteSnackFailed(message));
  }
}

export default function* deleteSnackSaga(): Generator {
  //   console.log('deleteSnack.arguments', deleteSnack?.arguments);
  yield takeEvery(deleteSnack.toString(), deleteSnackData);
}
