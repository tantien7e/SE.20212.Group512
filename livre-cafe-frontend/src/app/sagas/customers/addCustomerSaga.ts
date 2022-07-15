import customersApi from '@app/api/customersApi';
import {
  addCustomer,
  addCustomerFailed,
  addCustomerSucceeded,
  fetchCustomers,
} from '@app/app/features/customers/customers-slice';
import { CustomerInterface, CustomerPostData } from '@app/models';
import { getErrorMessage } from '@app/utils';
import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';

function* addNewCustomer(action: PayloadAction<CustomerPostData>) {
  //   const token = localStorage.getItem('token');
  try {
    const data = (yield call(
      customersApi.add,
      action.payload,
    )) as CustomerInterface;
    yield put(addCustomerSucceeded(data));
    yield put(fetchCustomers());
  } catch (error) {
    const message = getErrorMessage(error as AxiosError);
    yield put(addCustomerFailed(message));
  }
}

export default function* addCustomerSaga(): Generator {
  yield takeEvery(addCustomer.toString(), addNewCustomer);
}
