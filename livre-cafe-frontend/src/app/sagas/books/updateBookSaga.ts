import booksApi from '@app/api/booksApi';
import {
  fetchBooks,
  updateBook,
  updateBookFailed,
  updateBookSucceeded,
} from '@app/app/features/books/books-slice';
import { BookInterface } from '@app/models';
import { getErrorMessage } from '@app/utils';
import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';

function* updateBookData(action: PayloadAction<BookInterface>) {
  //   const token = localStorage.getItem('token');
  try {
    yield call(booksApi.update, action.payload, action.payload?._id);
    yield put(updateBookSucceeded());
    yield put(fetchBooks());
  } catch (error) {
    yield put(updateBookFailed(getErrorMessage(error as AxiosError)));
  }
}

export default function* updateBookSaga(): Generator {
  //   console.log('updateBook.arguments', updateBook?.arguments);
  yield takeEvery(updateBook.toString(), updateBookData);
}
