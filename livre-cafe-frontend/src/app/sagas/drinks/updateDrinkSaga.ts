import drinksApi from '@app/api/drinksApi';
import {
  fetchDrinks,
  updateDrink,
  updateDrinkFailed,
  updateDrinkSucceeded,
} from '@app/app/features/drinks/drinks-slice';
import { DrinkInterface } from '@app/models/drinks';
import { getErrorMessage } from '@app/utils';
import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';

function* updateDrinkData(action: PayloadAction<DrinkInterface>) {
  //   const token = localStorage.getItem('token');
  try {
    yield call(drinksApi.update, action.payload, action.payload?._id);
    yield put(updateDrinkSucceeded());
    yield put(fetchDrinks());
  } catch (error) {
    const message = getErrorMessage(error as AxiosError);
    yield put(updateDrinkFailed(message));
  }
}

export default function* updateDrinkSaga(): Generator {
  //   console.log('updateDrink.arguments', updateDrink?.arguments);
  yield takeEvery(updateDrink.toString(), updateDrinkData);
}
