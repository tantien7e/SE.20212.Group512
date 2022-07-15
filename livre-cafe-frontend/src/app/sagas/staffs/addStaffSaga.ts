import staffsApi from '@app/api/staffsApi';
import {
  addStaff,
  addStaffFailed,
  addStaffSucceeded,
  fetchStaffs,
} from '@app/app/features/staffs/staffs-slice';
import { StaffPostData, StaffResponse } from '@app/models/user.interface';
import { getErrorMessage } from '@app/utils';
import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';

function* addNewStaff(action: PayloadAction<StaffPostData>) {
  //   const token = localStorage.getItem('token');
  try {
    const data = (yield call(staffsApi.add, action.payload)) as StaffResponse;
    yield put(addStaffSucceeded(data));
    yield put(fetchStaffs());
  } catch (error) {
    const message = getErrorMessage(error as AxiosError);
    yield put(addStaffFailed(message));
  }
}

export default function* addStaffSaga(): Generator {
  yield takeEvery(addStaff.toString(), addNewStaff);
}
