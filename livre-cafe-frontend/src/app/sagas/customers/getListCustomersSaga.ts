import customersApi from '@app/api/customersApi';
import {
  fetchCustomers,
  fetchCustomersFailed,
  fetchCustomersSucceeded,
} from '@app/app/features/customers/customers-slice';
import { CustomerInterface } from '@app/models';
import { call, put, takeEvery } from 'redux-saga/effects';

function* getListCustomers() {
  //   const token = localStorage.getItem('token');
  try {
    const data = (yield call(customersApi.getAll)) as CustomerInterface[];
    yield put(fetchCustomersSucceeded(data));
  } catch (error) {
    const { message } = error as Error;
    yield put(fetchCustomersFailed(message));
  }
}

export default function* getListCustomersSaga(): Generator {
  yield takeEvery(fetchCustomers.toString(), getListCustomers);
}
