import vouchersApi from '@app/api/vouchersApi';
import {
  fetchVouchers,
  updateVoucher,
  updateVoucherFailed,
  updateVoucherSucceeded,
} from '@app/app/features/vouchers/vouchers-slice';
import { VoucherInterface } from '@app/models';
import { getErrorMessage } from '@app/utils';
import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';

function* updateVoucherData(action: PayloadAction<VoucherInterface>) {
  //   const token = localStorage.getItem('token');
  try {
    yield call(vouchersApi.update, action.payload, action.payload?._id);
    yield put(updateVoucherSucceeded());
    yield put(fetchVouchers());
  } catch (error) {
    const message = getErrorMessage(error as AxiosError);
    yield put(updateVoucherFailed(message));
  }
}

export default function* updateVoucherSaga(): Generator {
  yield takeEvery(updateVoucher.toString(), updateVoucherData);
}
