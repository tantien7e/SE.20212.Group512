import addAreaSaga from '@app/app/sagas/areas/addAreaSaga';
import deleteAreaSaga from '@app/app/sagas/areas/deleteAreaSaga';
import getListAreasSaga from '@app/app/sagas/areas/getListAreasSaga';
import updateAreaSaga from '@app/app/sagas/areas/updateAreaSaga';
import loginSaga from '@app/app/sagas/authentication/loginSaga';
import signupSaga from '@app/app/sagas/authentication/signupSaga';
import addBookSaga from '@app/app/sagas/books/addBookSaga';
import deleteBookSaga from '@app/app/sagas/books/deleteBookSaga';
import getListBooksSaga from '@app/app/sagas/books/getListBooksSaga';
import updateBookSaga from '@app/app/sagas/books/updateBookSaga';
import addCustomerSaga from '@app/app/sagas/customers/addCustomerSaga';
import deleteCustomerSaga from '@app/app/sagas/customers/deleteCustomerSaga';
import getListCustomersSaga from '@app/app/sagas/customers/getListCustomersSaga';
import updateCustomerSaga from '@app/app/sagas/customers/updateCustomerSaga';
import addDrinkSaga from '@app/app/sagas/drinks/addDrinkSaga';
import deleteDrinkSaga from '@app/app/sagas/drinks/deleteDrinkSaga';
import getListDrinksSaga from '@app/app/sagas/drinks/getListDrinksSaga';
import updateDrinkSaga from '@app/app/sagas/drinks/updateDrinkSaga';
import addOrderSaga from '@app/app/sagas/orders/addOrderSaga';
import deleteOrderSaga from '@app/app/sagas/orders/deleteOrderSaga';
import getListOrdersSaga from '@app/app/sagas/orders/getListOrdersSaga';
import updateOrderSaga from '@app/app/sagas/orders/updateOrderSaga';
import addSnackSaga from '@app/app/sagas/snacks/addSnackSaga';
import deleteSnackSaga from '@app/app/sagas/snacks/deleteSnackSaga';
import getListSnacksSaga from '@app/app/sagas/snacks/getListSnacksSaga';
import updateSnackSaga from '@app/app/sagas/snacks/updateSnackSaga';
import addStaffSaga from '@app/app/sagas/staffs/addStaffSaga';
import deleteStaffSaga from '@app/app/sagas/staffs/deleteStaffSaga';
import getListStaffsSaga from '@app/app/sagas/staffs/getListStaffsSaga';
import updateStaffSaga from '@app/app/sagas/staffs/updateStaffSaga';
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
    deleteDrinkSaga(),
    getListSnacksSaga(),
    addSnackSaga(),
    updateSnackSaga(),
    deleteSnackSaga(),
    getListBooksSaga(),
    addBookSaga(),
    updateBookSaga(),
    deleteBookSaga(),
    getListAreasSaga(),
    addAreaSaga(),
    updateAreaSaga(),
    deleteAreaSaga(),
    getListCustomersSaga(),
    addCustomerSaga(),
    updateCustomerSaga(),
    deleteCustomerSaga(),
    getListOrdersSaga(),
    addOrderSaga(),
    updateOrderSaga(),
    deleteOrderSaga(),
    loginSaga(),
    signupSaga(),
    getListStaffsSaga(),
    addStaffSaga(),
    updateStaffSaga(),
    deleteStaffSaga(),
  ]);
}
