import staffsApi from '@app/api/staffsApi';
import {
  fetchStaffs,
  fetchStaffsFailed,
  fetchStaffsSucceeded,
} from '@app/app/features/staffs/staffs-slice';
import { StaffResponse } from '@app/models/user.interface';
import { getErrorMessage } from '@app/utils';
import { AxiosError } from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';

function* getListStaffs() {
  //   const token = localStorage.getItem('token');
  try {
    const data = (yield call(staffsApi.getAll)) as StaffResponse[];
    yield put(fetchStaffsSucceeded(data));
  } catch (error) {
    const message = getErrorMessage(error as AxiosError);
    yield put(fetchStaffsFailed(message));
  }
}

export default function* getListStaffsSaga(): Generator {
  yield takeEvery(fetchStaffs.toString(), getListStaffs);
}
