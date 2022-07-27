import reservationsApi from '@app/api/reservationsApi';
import {
  fetchReservations,
  fetchReservationsFailed,
  fetchReservationsSucceeded
} from '@app/app/features/reservations/reservations-slice';
import { ReservationInterface } from '@app/models';
import { getErrorMessage } from '@app/utils';
import { AxiosError } from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';

type OrderResponse = ReservationInterface & { createdAt: Date };

function* getListReservations() {
  //   const token = localStorage.getItem('token');
  try {
    const data = (yield call(reservationsApi.getAll)) as OrderResponse[];
    const convertedData = data.map((order) => ({
      ...order,
      bookedAt: order.createdAt,
    }));
    yield put(fetchReservationsSucceeded(convertedData as ReservationInterface[]));
  } catch (error) {
    const message = getErrorMessage(error as AxiosError);
    yield put(fetchReservationsFailed(message));
  }
}

export default function* getListReservationsSaga(): Generator {
  yield takeEvery(fetchReservations.toString(), getListReservations);
}
