import customersApi from '@app/api/customersApi';
import {
  fetchCustomers,
  deleteCustomer,
  deleteCustomerFailed,
  deleteCustomerSucceeded,
} from '@app/app/features/customers/customers-slice';
import { CustomerInterface } from '@app/models';
import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeEvery } from 'redux-saga/effects';

function* deleteCustomerData(action: PayloadAction<CustomerInterface>) {
  //   const token = localStorage.getItem('token');
  try {
    yield call(customersApi.remove, action.payload?._id || action.payload?.id);
    yield put(deleteCustomerSucceeded());
    yield put(fetchCustomers());
  } catch (error) {
    const { message } = error as Error;
    yield put(deleteCustomerFailed(message));
  }
}

export default function* deleteCustomerSaga(): Generator {
  yield takeEvery(deleteCustomer.toString(), deleteCustomerData);
}
