import areasApi from '@app/api/areasApi';
import {
  deleteArea,
  deleteAreaFailed,
  deleteAreaSucceeded,
  fetchAreas,
} from '@app/app/features/areas/areas-slice';
import { getErrorMessage } from '@app/utils';
import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';

function* deleteAreaData(action: PayloadAction<string>) {
  //   const token = localStorage.getItem('token');
  try {
    yield call(areasApi.remove, action.payload);
    yield put(deleteAreaSucceeded());
    yield put(fetchAreas());
  } catch (error) {
    yield put(deleteAreaFailed(getErrorMessage(error as AxiosError)));
  }
}

export default function* deleteAreaSaga(): Generator {
  //   console.log('deleteArea.arguments', deleteArea?.arguments);
  yield takeEvery(deleteArea.toString(), deleteAreaData);
}
