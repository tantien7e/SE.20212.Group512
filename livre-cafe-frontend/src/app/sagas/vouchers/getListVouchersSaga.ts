import vouchersApi from '@app/api/vouchersApi';
import {
  fetchVouchers,
  fetchVouchersFailed,
  fetchVouchersSucceeded,
} from '@app/app/features/vouchers/vouchers-slice';
import { VoucherInterface } from '@app/models';
import { getErrorMessage } from '@app/utils';
import { AxiosError } from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';

function* getListVouchers() {
  //   const token = localStorage.getItem('token');
  try {
    const data = (yield call(vouchersApi.getAll)) as VoucherInterface[];
    yield put(fetchVouchersSucceeded(data));
  } catch (error) {
    const message = getErrorMessage(error as AxiosError);
    yield put(fetchVouchersFailed(message));
  }
}

export default function* getListVouchersSaga(): Generator {
  yield takeEvery(fetchVouchers.toString(), getListVouchers);
}
