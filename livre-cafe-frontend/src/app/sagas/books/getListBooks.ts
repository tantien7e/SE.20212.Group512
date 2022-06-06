import booksApi from '@app/api/booksApi';
import {
  fetchBooks,
  fetchBooksFailed,
  fetchBooksSucceeded,
} from '@app/app/features/books/books-slice';
import { BookInterface } from '@app/models';
import { call, put, takeEvery } from 'redux-saga/effects';

function* getListBooks() {
  //   const token = localStorage.getItem('token');
  try {
    const data = (yield call(booksApi.getAll)) as BookInterface[];
    yield put(fetchBooksSucceeded(data));
  } catch (error) {
    const { message } = error as Error;
    yield put(fetchBooksFailed(message));
  }
}

export default function* getListBooksSaga(): Generator {
  yield takeEvery(fetchBooks.toString(), getListBooks);
}
