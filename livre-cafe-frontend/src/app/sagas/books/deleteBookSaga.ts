import booksApi from '@app/api/booksApi';
import {
  deleteBook,
  deleteBookFailed,
  deleteBookSucceeded,
  fetchBooks,
} from '@app/app/features/books/books-slice';
import { getErrorMessage } from '@app/utils';
import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';

function* deleteBookData(action: PayloadAction<string>) {
  //   const token = localStorage.getItem('token');
  try {
    yield call(booksApi.remove, action.payload);
    yield put(deleteBookSucceeded());
    yield put(fetchBooks());
  } catch (error) {
    yield put(deleteBookFailed(getErrorMessage(error as AxiosError)));
  }
}

export default function* deleteBookSaga(): Generator {
  //   console.log('deleteBook.arguments', deleteBook?.arguments);
  yield takeEvery(deleteBook.toString(), deleteBookData);
}
