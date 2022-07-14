import ordersApi from '@app/api/ordersApi';
import {
  fetchOrders,
  fetchOrdersFailed,
  fetchOrdersSucceeded,
} from '@app/app/features/orders/orders-slice';
import { OrderInterface } from '@app/models';
import { getErrorMessage } from '@app/utils';
import { AxiosError } from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';

type OrderResponse = OrderInterface & { createdAt: Date };

function* getListOrders() {
  //   const token = localStorage.getItem('token');
  try {
    const data = (yield call(ordersApi.getAll)) as OrderResponse[];
    const convertedData = data.map((order) => ({
      ...order,
      bookedAt: order.createdAt,
    }));
    yield put(fetchOrdersSucceeded(convertedData as OrderInterface[]));
  } catch (error) {
    const message = getErrorMessage(error as AxiosError);
    yield put(fetchOrdersFailed(message));
  }
}

export default function* getListOrdersSaga(): Generator {
  yield takeEvery(fetchOrders.toString(), getListOrders);
}
