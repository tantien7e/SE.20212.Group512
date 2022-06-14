import ordersApi from '@app/api/ordersApi';
import {
  fetchOrders,
  fetchOrdersFailed,
  fetchOrdersSucceeded,
} from '@app/app/features/orders/orders-slice';
import { OrderInterface } from '@app/models';
import { call, put, takeEvery } from 'redux-saga/effects';

function* getListOrders() {
  //   const token = localStorage.getItem('token');
  try {
    const data = (yield call(ordersApi.getAll)) as OrderInterface[];
    yield put(fetchOrdersSucceeded(data));
  } catch (error) {
    const { message } = error as Error;
    yield put(fetchOrdersFailed(message));
  }
}

export default function* getListOrdersSaga(): Generator {
  yield takeEvery(fetchOrders.toString(), getListOrders);
}
