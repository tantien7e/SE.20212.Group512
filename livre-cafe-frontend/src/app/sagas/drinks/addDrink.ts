import drinksApi from '@app/api/drinksApi';
import {
  addDrink,
  addDrinkFailed,
  addDrinkSucceeded,
} from '@app/app/features/drinks/drinks-slice';
import { DrinkInterface } from '@app/models/drinks';
import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeEvery } from 'redux-saga/effects';

function* addNewDrink(action: PayloadAction<DrinkInterface>) {
  //   const token = localStorage.getItem('token');
  try {
    const data = (yield call(drinksApi.add, action.payload)) as DrinkInterface;
    yield put(addDrinkSucceeded(data));
  } catch (error) {
    const { message } = error as Error;
    yield put(addDrinkFailed(message));
  }
}

export default function* addDrinkSaga(): Generator {
  //   console.log('addDrink.arguments', addDrink?.arguments);
  yield takeEvery(addDrink.toString(), addNewDrink);
}
