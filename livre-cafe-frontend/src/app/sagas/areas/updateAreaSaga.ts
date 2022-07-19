import areasApi from '@app/api/areasApi';
import {
  fetchAreas,
  updateArea,
  updateAreaFailed,
  updateAreaSucceeded,
} from '@app/app/features/areas/areas-slice';
import { AreaInterface } from '@app/models';
import { getErrorMessage } from '@app/utils';
import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';

function* updateAreaData(action: PayloadAction<AreaInterface>) {
  //   const token = localStorage.getItem('token');
  try {
    yield call(areasApi.update, action.payload, action.payload?._id || '');
    yield put(updateAreaSucceeded());
    yield put(fetchAreas());
  } catch (error) {
    yield put(updateAreaFailed(getErrorMessage(error as AxiosError)));
  }
}

export default function* updateAreaSaga(): Generator {
  //   console.log('updateArea.arguments', updateArea?.arguments);
  yield takeEvery(updateArea.toString(), updateAreaData);
}
