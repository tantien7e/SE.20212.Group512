import snacksApi from '@app/api/snacksApi';
import {
  addSnack,
  addSnackFailed,
  addSnackSucceeded,
  fetchSnacks,
} from '@app/app/features/snacks/snacks-slice';
import { SnackInterface } from '@app/models';
import { getErrorMessage } from '@app/utils';
import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';

function* addNewSnack(action: PayloadAction<SnackInterface>) {
  //   const token = localStorage.getItem('token');
  try {
    const data = (yield call(snacksApi.add, action.payload)) as SnackInterface;
    yield put(addSnackSucceeded(data));
    yield put(fetchSnacks());
  } catch (error) {
    const message = getErrorMessage(error as AxiosError);
    yield put(addSnackFailed(message));
  }
}

export default function* addSnackSaga(): Generator {
  //   console.log('addSnack.arguments', addSnack?.arguments);
  yield takeEvery(addSnack.toString(), addNewSnack);
}
