import ordersApi from '@app/api/ordersApi';
import {
  fetchOrders,
  deleteOrder,
  deleteOrderFailed,
  deleteOrderSucceeded,
} from '@app/app/features/orders/orders-slice';
import { OrderInterface } from '@app/models';
import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeEvery } from 'redux-saga/effects';

function* deleteOrderData(action: PayloadAction<OrderInterface>) {
  //   const token = localStorage.getItem('token');
  try {
    yield call(ordersApi.remove, action.payload?._id);
    yield put(deleteOrderSucceeded());
    yield put(fetchOrders());
  } catch (error) {
    const { message } = error as Error;
    yield put(deleteOrderFailed(message));
  }
}

export default function* deleteOrderSaga(): Generator {
  yield takeEvery(deleteOrder.toString(), deleteOrderData);
}
