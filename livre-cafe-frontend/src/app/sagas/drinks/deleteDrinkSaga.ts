import drinksApi from '@app/api/drinksApi';
import {
  fetchDrinks,
  deleteDrink,
  deleteDrinkFailed,
  deleteDrinkSucceeded,
} from '@app/app/features/drinks/drinks-slice';
import { DrinkInterface } from '@app/models/drinks';
import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeEvery } from 'redux-saga/effects';

function* deleteDrinkData(action: PayloadAction<DrinkInterface>) {
  //   const token = localStorage.getItem('token');
  try {
    yield call(drinksApi.remove, action.payload?._id);
    yield put(deleteDrinkSucceeded());
    yield put(fetchDrinks());
  } catch (error) {
    const { message } = error as Error;
    yield put(deleteDrinkFailed(message));
  }
}

export default function* deleteDrinkSaga(): Generator {
  //   console.log('deleteDrink.arguments', deleteDrink?.arguments);
  yield takeEvery(deleteDrink.toString(), deleteDrinkData);
}
