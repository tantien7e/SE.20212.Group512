import drinksApi from '@app/api/drinksApi';
import {
  fetchDrinks,
  updateDrink,
  updateDrinkFailed,
  updateDrinkSucceeded,
} from '@app/app/features/drinks/drinks-slice';
import { DrinkInterface } from '@app/models/drinks';
import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeEvery } from 'redux-saga/effects';

function* updateDrinkData(action: PayloadAction<DrinkInterface>) {
  //   const token = localStorage.getItem('token');
  try {
    yield call(drinksApi.update, action.payload, action.payload?._id);
    yield put(updateDrinkSucceeded());
    yield put(fetchDrinks());
  } catch (error) {
    const { message } = error as Error;
    yield put(updateDrinkFailed(message));
  }
}

export default function* updateDrinkSaga(): Generator {
  //   console.log('updateDrink.arguments', updateDrink?.arguments);
  yield takeEvery(updateDrink.toString(), updateDrinkData);
}
