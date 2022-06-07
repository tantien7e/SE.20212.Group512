import { RootState } from '@app/app/store';
import { BookInterface } from '@app/models/product.interface';
import { toastError, toastInformSuccess } from '@app/utils/toast';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DrinksData {
  //   drinks: BookInterface[];
}

export interface BookState {
  loading: boolean;
  books: BookInterface[];
  error?: string;
}

const initialState: BookState = {
  loading: false,
  books: [],
};

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    fetchBooks(state) {
      state.error = '';
      state.loading = true;
    },
    fetchBooksSucceeded(state, action: PayloadAction<BookInterface[]>) {
      state.books = action.payload;
      state.loading = false;
    },
    fetchBooksFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addBook(state, action: PayloadAction<BookInterface>) {
      state.loading = true;
    },
    addBookSucceeded(state, action: PayloadAction<BookInterface>) {
      state.loading = false;
      state.books.push(action.payload);
      toastInformSuccess('Added Successfully');
    },
    addBookFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      toastError(action.payload);
    },
  },
});

//Actions
export const {
  fetchBooks,
  fetchBooksSucceeded,
  fetchBooksFailed,
  addBook,
  addBookSucceeded,
  addBookFailed,
} = booksSlice.actions;

//Selectors
export const selectBooks = (state: RootState) => state.books;
export const selectBooksLoading = (state: RootState) => state.books.loading;
export const selectBooksError = (state: RootState) => state.books.error;
export const selectBooksData = (state: RootState) => state.books.books;
//Reducer

const booksReducer = booksSlice.reducer;
export default booksReducer;
