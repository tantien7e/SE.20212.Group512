import { RootState } from '@app/app/store';
import { BookInterface } from '@app/models/product.interface';
import { toastError, toastInformSuccess } from '@app/utils/toast';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BooksData {
  //   Books: BookInterface[];
}

export interface BookState {
  loading: boolean;
  addLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
  books?: BookInterface[];
  error?: string;
}

const initialState: BookState = {
  loading: false,
  addLoading: false,
  updateLoading: false,
  deleteLoading: false,
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
      if (!state.books) state.books = [];
      state.books.push(action.payload);
      toastInformSuccess('Added Successfully');
    },
    addBookFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      toastError(action.payload);
    },
    //Update
    updateBook(state, action: PayloadAction<BookInterface>) {
      state.updateLoading = true;
    },
    updateBookSucceeded(state) {
      state.updateLoading = false;
      toastInformSuccess('Item was updated successfully');
    },
    updateBookFailed(state, action: PayloadAction<string>) {
      state.updateLoading = false;
      state.error = action.payload;
      toastError(action.payload);
    },
    //Delete
    deleteBook(state, action: PayloadAction<string>) {
      state.deleteLoading = true;
    },
    deleteBookSucceeded(state) {
      state.deleteLoading = false;
      toastInformSuccess('Item was deleted successfully');
    },
    deleteBookFailed(state, action: PayloadAction<string>) {
      state.deleteLoading = false;
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
  updateBook,
  updateBookFailed,
  updateBookSucceeded,
  deleteBook,
  deleteBookFailed,
  deleteBookSucceeded,
} = booksSlice.actions;

//Selectors
export const selectBooks = (state: RootState) => state.books;
export const selectBooksLoading = (state: RootState) => state.books.loading;
export const selectBooksAddLoading = (state: RootState) =>
  state.books.addLoading;
export const selectBooksError = (state: RootState) => state.books.error;
export const selectBooksData = (state: RootState) => state.books.books;
export const selectBooksUpdateLoading = (state: RootState) =>
  state.books.updateLoading;
export const selectBooksDeleteLoading = (state: RootState) =>
  state.books.deleteLoading;

const booksReducer = booksSlice.reducer;
export default booksReducer;
