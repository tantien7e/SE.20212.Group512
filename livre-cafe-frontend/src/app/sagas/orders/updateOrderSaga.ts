import ordersApi from '@app/api/ordersApi';
import { fetchAreas } from '@app/app/features/areas/areas-slice';
import { fetchBooks } from '@app/app/features/books/books-slice';
import { fetchCustomers } from '@app/app/features/customers/customers-slice';
import { fetchDrinks } from '@app/app/features/drinks/drinks-slice';
import {
  fetchOrders,
  updateOrder,
  updateOrderFailed,
  updateOrderSucceeded,
} from '@app/app/features/orders/orders-slice';
import { fetchReservations } from '@app/app/features/reservations/reservations-slice';
import { OrderInterface, OrderPostData } from '@app/models';
import { getErrorMessage } from '@app/utils';
import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';

function* updateOrderData(action: PayloadAction<OrderPostData>) {
  //   const token = localStorage.getItem('token');
  try {
    const response = (yield call(
      ordersApi.update,
      action.payload,
      action.payload?._id || '',
    )) as OrderInterface;
    yield put(updateOrderSucceeded());
    yield put(fetchOrders());
    yield put(fetchCustomers());
    yield put(fetchDrinks());
    yield put(fetchBooks());
    if (response.reservation) {
      yield put(fetchReservations());
      yield put(fetchAreas());
    }
  } catch (error) {
    const message = getErrorMessage(error as AxiosError);
    yield put(updateOrderFailed(message));
  }
}

export default function* updateOrderSaga(): Generator {
  yield takeEvery(updateOrder.toString(), updateOrderData);
}
