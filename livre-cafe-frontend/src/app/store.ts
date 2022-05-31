import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counter-slice';
import { bookApi } from '../features/books/books-api-slice';
import { drinkApi } from '@app/features/drinks/drinks-api-slice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    [bookApi.reducerPath]: bookApi.reducer,
    [drinkApi.reducerPath]: drinkApi.reducer,
  },
  middleware: (getDefaultMiddleWare) => {
    return getDefaultMiddleWare().concat(bookApi.middleware);
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
