import areasApi from '@app/api/areasApi';
import {
  addArea,
  addAreaFailed,
  addAreaSucceeded,
  fetchAreas,
} from '@app/app/features/areas/areas-slice';
import { AreaInterface } from '@app/models';
import { getErrorMessage } from '@app/utils';
import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';

function* addNewBook(action: PayloadAction<AreaInterface>) {
  //   const token = localStorage.getItem('token');
  try {
    const data = (yield call(areasApi.add, action.payload)) as AreaInterface;
    yield put(addAreaSucceeded(data));
    yield put(fetchAreas());
  } catch (error) {
    yield put(addAreaFailed(getErrorMessage(error as AxiosError)));
  }
}

export default function* addAreaSaga(): Generator {
  yield takeEvery(addArea.toString(), addNewBook);
}
