import staffsApi from '@app/api/staffsApi';
import {
  fetchStaffs,
  updateStaff,
  updateStaffFailed,
  updateStaffSucceeded
} from '@app/app/features/staffs/staffs-slice';
import { StaffResponse } from '@app/models/user.interface';
import { getErrorMessage } from '@app/utils';
import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';

function* updateStaffrData(action: PayloadAction<StaffResponse>) {
  //   const token = localStorage.getItem('token');
  try {
    yield call(staffsApi.update, action.payload, action.payload?._id || '');
    yield put(updateStaffSucceeded());
    yield put(fetchStaffs());
  } catch (error) {
    const message = getErrorMessage(error as AxiosError);
    yield put(updateStaffFailed(message));
  }
}

export default function* updateCustomerSaga(): Generator {
  yield takeEvery(updateStaff.toString(), updateStaffrData);
}
