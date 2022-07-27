import ordersApi from '@app/api/ordersApi';
import {
  deleteOrder,
  deleteOrderFailed,
  deleteOrderSucceeded, fetchOrders
} from '@app/app/features/orders/orders-slice';
import { fetchReservations } from '@app/app/features/reservations/reservations-slice';
import { getErrorMessage } from '@app/utils';
import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';

function* deleteOrderData(action: PayloadAction<string>) {
  //   const token = localStorage.getItem('token');
  try {
    yield call(ordersApi.remove, action.payload);
    yield put(deleteOrderSucceeded());
    yield put(fetchOrders());
    yield put(fetchReservations());

  } catch (error) {
    const message = getErrorMessage(error as AxiosError);
    yield put(deleteOrderFailed(message));
  }
}

export default function* deleteOrderSaga(): Generator {
  yield takeEvery(deleteOrder.toString(), deleteOrderData);
}
