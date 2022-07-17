import snacksApi from '@app/api/snacksApi';
import {
  fetchSnacks,
  fetchSnacksFailed,
  fetchSnacksSucceeded,
} from '@app/app/features/snacks/snacks-slice';
import { SnackInterface } from '@app/models';
import { getErrorMessage } from '@app/utils';
import { AxiosError } from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';

function* getListSnacks() {
  //   const token = localStorage.getItem('token');
  try {
    const data = (yield call(snacksApi.getAll)) as SnackInterface[];
    yield put(fetchSnacksSucceeded(data));
  } catch (error) {
    const message = getErrorMessage(error as AxiosError);
    yield put(fetchSnacksFailed(message));
  }
}

export default function* getListSnacksSaga(): Generator {
  yield takeEvery(fetchSnacks.toString(), getListSnacks);
}
