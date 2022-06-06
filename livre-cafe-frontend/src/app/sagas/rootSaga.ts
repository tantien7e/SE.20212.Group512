import addDrinkSaga from '@app/app/sagas/drinks/addDrink';
import getListDrinksSaga from '@app/app/sagas/drinks/getListDrinks';
import { all } from 'redux-saga/effects';

function* helloSaga() {
  console.log('Hello Saga');
}

export default function* rootSaga() {
  console.log('root Saga');
  yield all([helloSaga(), getListDrinksSaga(), addDrinkSaga()]);
}
