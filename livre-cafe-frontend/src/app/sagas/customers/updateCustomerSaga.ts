import customersApi from '@app/api/customersApi';
import {
  fetchCustomers,
  updateCustomer,
  updateCustomerFailed,
  updateCustomerSucceeded,
} from '@app/app/features/customers/customers-slice';
import { CustomerInterface } from '@app/models';
import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeEvery } from 'redux-saga/effects';

function* updateCustomerData(action: PayloadAction<CustomerInterface>) {
  //   const token = localStorage.getItem('token');
  try {
    yield call(customersApi.update, action.payload, action.payload?._id);
    yield put(updateCustomerSucceeded());
    yield put(fetchCustomers());
  } catch (error) {
    const { message } = error as Error;
    yield put(updateCustomerFailed(message));
  }
}

export default function* updateCustomerSaga(): Generator {
  yield takeEvery(updateCustomer.toString(), updateCustomerData);
}
