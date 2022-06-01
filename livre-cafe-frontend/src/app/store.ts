import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counter-slice';
import { bookApi } from '@app/app/services/books/books-api-slice';
import { drinkApi } from '@app/app/services/drinks/drinks-api-slice';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '@app/app/rootSaga';

const sagaMiddleware = createSagaMiddleware();
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    [bookApi.reducerPath]: bookApi.reducer,
    [drinkApi.reducerPath]: drinkApi.reducer,
  },
  middleware: (getDefaultMiddleWare) =>
    getDefaultMiddleWare()
      .concat(bookApi.middleware)
      .concat(drinkApi.middleware)
      .concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
