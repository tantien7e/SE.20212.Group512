import reservationsApi from '@app/api/reservationsApi';
import { fetchBooks } from '@app/app/features/books/books-slice';
import { fetchDrinks } from '@app/app/features/drinks/drinks-slice';
import {
  addReservation,
  addReservationFailed,
  addReservationSucceeded,
  fetchReservations,
} from '@app/app/features/reservations/reservations-slice';
import { ReservationInterface } from '@app/models';
import { getErrorMessage } from '@app/utils';
import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';

function* addNewReservation(action: PayloadAction<ReservationInterface>) {
  //   const token = localStorage.getItem('token');
  try {
    const data = (yield call(
      reservationsApi.add,
      action.payload,
    )) as ReservationInterface;
    yield put(addReservationSucceeded(data));
    yield put(fetchReservations());
    yield put(fetchDrinks());
    yield put(fetchBooks());
  } catch (error) {
    const message = getErrorMessage(error as AxiosError);
    yield put(addReservationFailed(message));
  }
}

export default function* addReservationSaga(): Generator {
  yield takeEvery(addReservation.toString(), addNewReservation);
}
