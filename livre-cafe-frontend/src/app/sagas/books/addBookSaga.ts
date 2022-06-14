import booksApi from '@app/api/booksApi';
import {
  addBook,
  addBookFailed,
  addBookSucceeded,
  fetchBooks,
} from '@app/app/features/books/books-slice';
import { BookInterface } from '@app/models';
import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeEvery } from 'redux-saga/effects';

function* addNewBook(action: PayloadAction<BookInterface>) {
  //   const token = localStorage.getItem('token');
  try {
    const data = (yield call(booksApi.add, action.payload)) as BookInterface;
    yield put(addBookSucceeded(data));
    yield put(fetchBooks());
  } catch (error) {
    const { message } = error as Error;
    yield put(addBookFailed(message));
  }
}

export default function* addBookSaga(): Generator {
  yield takeEvery(addBook.toString(), addNewBook);
}
