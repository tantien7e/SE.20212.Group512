import vouchersApi from '@app/api/vouchersApi';
import {
  deleteVoucher,
  deleteVoucherFailed,
  deleteVoucherSucceeded,
  fetchVouchers,
} from '@app/app/features/vouchers/vouchers-slice';
import { getErrorMessage } from '@app/utils';
import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';

function* deleteVoucherData(action: PayloadAction<string>) {
  //   const token = localStorage.getItem('token');
  try {
    yield call(vouchersApi.remove, action.payload);
    yield put(deleteVoucherSucceeded());
    yield put(fetchVouchers());
  } catch (error) {
    const message = getErrorMessage(error as AxiosError);
    yield put(deleteVoucherFailed(message));
  }
}

export default function* deleteVoucherSaga(): Generator {
  yield takeEvery(deleteVoucher.toString(), deleteVoucherData);
}
