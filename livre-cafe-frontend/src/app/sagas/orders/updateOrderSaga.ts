import ordersApi from '@app/api/ordersApi';
import {
  fetchOrders,
  updateOrder,
  updateOrderFailed,
  updateOrderSucceeded,
} from '@app/app/features/orders/orders-slice';
import { OrderInterface } from '@app/models';
import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeEvery } from 'redux-saga/effects';

function* updateOrderData(action: PayloadAction<OrderInterface>) {
  //   const token = localStorage.getItem('token');
  try {
    yield call(ordersApi.update, action.payload, action.payload?._id);
    yield put(updateOrderSucceeded());
    yield put(fetchOrders());
  } catch (error) {
    const { message } = error as Error;
    yield put(updateOrderFailed(message));
  }
}

export default function* updateOrderSaga(): Generator {
  yield takeEvery(updateOrder.toString(), updateOrderData);
}
