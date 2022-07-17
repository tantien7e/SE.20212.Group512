import snacksApi from '@app/api/snacksApi';
import {
  fetchSnacks,
  updateSnack,
  updateSnackFailed,
  updateSnackSucceeded,
} from '@app/app/features/snacks/snacks-slice';
import { SnackInterface } from '@app/models';
import { getErrorMessage } from '@app/utils';
import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';

function* updateSnackData(action: PayloadAction<SnackInterface>) {
  //   const token = localStorage.getItem('token');
  try {
    yield call(snacksApi.update, action.payload, action.payload?._id);
    yield put(updateSnackSucceeded());
    yield put(fetchSnacks());
  } catch (error) {
    const message = getErrorMessage(error as AxiosError);
    yield put(updateSnackFailed(message));
  }
}

export default function* updateSnackSaga(): Generator {
  //   console.log('updateSnack.arguments', updateSnack?.arguments);
  yield takeEvery(updateSnack.toString(), updateSnackData);
}
