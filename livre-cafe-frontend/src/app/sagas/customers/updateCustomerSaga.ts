import customersApi from '@app/api/customersApi';
import {
  fetchCustomers,
  updateCustomer,
  updateCustomerFailed,
  updateCustomerSucceeded,
} from '@app/app/features/customers/customers-slice';
import { CustomerInterface } from '@app/models';
import { getErrorMessage } from '@app/utils';
import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';

function* updateCustomerData(action: PayloadAction<CustomerInterface>) {
  //   const token = localStorage.getItem('token');
  try {
    yield call(customersApi.update, action.payload, action.payload?._id);
    yield put(updateCustomerSucceeded());
    yield put(fetchCustomers());
  } catch (error) {
    const message = getErrorMessage(error as AxiosError);
    yield put(updateCustomerFailed(message));
  }
}

export default function* updateCustomerSaga(): Generator {
  yield takeEvery(updateCustomer.toString(), updateCustomerData);
}
