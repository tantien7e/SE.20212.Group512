import addBookSaga from '@app/app/sagas/books/addBook';
import getListBooksSaga from '@app/app/sagas/books/getListBooks';
import addDrinkSaga from '@app/app/sagas/drinks/addDrink';
import deleteDrinkSaga from '@app/app/sagas/drinks/deleteDrink';
import getListDrinksSaga from '@app/app/sagas/drinks/getListDrinks';
import updateDrinkSaga from '@app/app/sagas/drinks/updateDrink';
import { all } from 'redux-saga/effects';

function* helloSaga() {
  console.log('Hello Saga');
}

export default function* rootSaga() {
  console.log('root Saga');
  yield all([
    helloSaga(),
    getListDrinksSaga(),
    addDrinkSaga(),
    updateDrinkSaga(),
    getListBooksSaga(),
    addBookSaga(),
    deleteDrinkSaga(),
  ]);
}
