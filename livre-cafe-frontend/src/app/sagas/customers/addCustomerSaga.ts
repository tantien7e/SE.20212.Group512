import customersApi from '@app/api/customersApi';
import {
  addCustomer,
  addCustomerFailed,
  addCustomerSucceeded,
  fetchCustomers,
} from '@app/app/features/customers/customers-slice';
import { CustomerInterface } from '@app/models';
import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeEvery } from 'redux-saga/effects';

function* addNewCustomer(action: PayloadAction<CustomerInterface>) {
  //   const token = localStorage.getItem('token');
  try {
    const data = (yield call(
      customersApi.add,
      action.payload,
    )) as CustomerInterface;
    yield put(addCustomerSucceeded(data));
    yield put(fetchCustomers());
  } catch (error) {
    const { message } = error as Error;
    yield put(addCustomerFailed(message));
  }
}

export default function* addCustomerSaga(): Generator {
  yield takeEvery(addCustomer.toString(), addNewCustomer);
}
