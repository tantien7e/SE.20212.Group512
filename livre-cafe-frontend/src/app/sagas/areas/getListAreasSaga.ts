import areasApi from '@app/api/areasApi';
import {
  fetchAreas,
  fetchAreasFailed,
  fetchAreasSucceeded,
} from '@app/app/features/areas/areas-slice';
import { AreaInterface } from '@app/models';
import { getErrorMessage } from '@app/utils';
import { AxiosError } from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';

function* getListAreas() {
  //   const token = localStorage.getItem('token');
  try {
    const data = (yield call(areasApi.getAll)) as AreaInterface[];
    yield put(fetchAreasSucceeded(data));
  } catch (error) {
    yield put(fetchAreasFailed(getErrorMessage(error as AxiosError)));
  }
}

export default function* getListAreasSaga(): Generator {
  yield takeEvery(fetchAreas.toString(), getListAreas);
}
