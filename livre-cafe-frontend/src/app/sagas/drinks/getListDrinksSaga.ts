import drinksApi from '@app/api/drinksApi';
import {
  fetchDrinks,
  fetchDrinksFailed,
  fetchDrinksSucceeded
} from '@app/app/features/drinks/drinks-slice';
import { DrinkInterface } from '@app/models/drinks';
import { call, put, takeEvery } from 'redux-saga/effects';

function* getListDrinks() {
  //   const token = localStorage.getItem('token');
  try {
    const data = (yield call(drinksApi.getAll)) as DrinkInterface[];
    yield put(fetchDrinksSucceeded(data));
  } catch (error) {
    const { message } = error as Error;
    yield put(fetchDrinksFailed(message));
  }
}

export default function* getListDrinksSaga(): Generator {
  yield takeEvery(fetchDrinks.toString(), getListDrinks);
}
