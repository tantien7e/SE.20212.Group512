import booksApi from '@app/api/booksApi';
import {
  fetchBooks,
  deleteBook,
  deleteBookFailed,
  deleteBookSucceeded,
} from '@app/app/features/books/books-slice';
import { BookInterface } from '@app/models';
import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeEvery } from 'redux-saga/effects';

function* deleteBookData(action: PayloadAction<BookInterface>) {
  //   const token = localStorage.getItem('token');
  try {
    yield call(booksApi.remove, action.payload?._id);
    yield put(deleteBookSucceeded());
    yield put(fetchBooks());
  } catch (error) {
    const { message } = error as Error;
    yield put(deleteBookFailed(message));
  }
}

export default function* deleteBookSaga(): Generator {
  //   console.log('deleteBook.arguments', deleteBook?.arguments);
  yield takeEvery(deleteBook.toString(), deleteBookData);
}
