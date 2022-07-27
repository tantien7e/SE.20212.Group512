import vouchersApi from '@app/api/vouchersApi';
import {
  addVoucher,
  addVoucherFailed,
  addVoucherSucceeded,
  fetchVouchers,
} from '@app/app/features/vouchers/vouchers-slice';
import { VoucherInterface, VoucherPostData } from '@app/models';
import { getErrorMessage } from '@app/utils';
import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';

function* addNewVoucher(action: PayloadAction<VoucherPostData>) {
  //   const token = localStorage.getItem('token');
  try {
    const data = (yield call(
      vouchersApi.add,
      action.payload,
    )) as VoucherInterface;
    yield put(addVoucherSucceeded(data));
    yield put(fetchVouchers());
  } catch (error) {
    const message = getErrorMessage(error as AxiosError);
    yield put(addVoucherFailed(message));
  }
}

export default function* addVoucherSaga(): Generator {
  yield takeEvery(addVoucher.toString(), addNewVoucher);
}
