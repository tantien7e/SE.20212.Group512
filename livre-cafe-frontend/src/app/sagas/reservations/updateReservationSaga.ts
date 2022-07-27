import reservationsApi from '@app/api/reservationsApi';
import { fetchAreas } from '@app/app/features/areas/areas-slice';
import {
  fetchReservations,
  updateReservation,
  updateReservationFailed,
  updateReservationSucceeded,
} from '@app/app/features/reservations/reservations-slice';
import { ReservationInterface } from '@app/models';
import { getErrorMessage } from '@app/utils';
import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';

function* updateReservationData(action: PayloadAction<ReservationInterface>) {
  //   const token = localStorage.getItem('token');
  try {
    yield call(
      reservationsApi.update,
      { ...action.payload, order: action.payload.order._id } as any,
      action.payload?._id || '',
    );
    yield put(updateReservationSucceeded());
    yield put(fetchReservations());
    // yield put(fetchCustomers());
    // yield put(fetchDrinks());
    yield put(fetchAreas());
  } catch (error) {
    const message = getErrorMessage(error as AxiosError);
    yield put(updateReservationFailed(message));
  }
}

export default function* updateReservationSaga(): Generator {
  yield takeEvery(updateReservation.toString(), updateReservationData);
}
