import drinksApi from '@app/api/drinksApi';
import {
  fetchDrinks,
  deleteDrink,
  deleteDrinkFailed,
  deleteDrinkSucceeded,
} from '@app/app/features/drinks/drinks-slice';
import { DrinkInterface } from '@app/models/drinks';
import { getErrorMessage } from '@app/utils';
import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';

function* deleteDrinkData(action: PayloadAction<string>) {
  //   const token = localStorage.getItem('token');
  try {
    yield call(drinksApi.remove, action.payload);
    yield put(deleteDrinkSucceeded());
    yield put(fetchDrinks());
  } catch (error) {
    const message = getErrorMessage(error as AxiosError);
    yield put(deleteDrinkFailed(message));
  }
}

export default function* deleteDrinkSaga(): Generator {
  //   console.log('deleteDrink.arguments', deleteDrink?.arguments);
  yield takeEvery(deleteDrink.toString(), deleteDrinkData);
}
