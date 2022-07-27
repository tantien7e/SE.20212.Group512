import { configureStore } from '@reduxjs/toolkit';
import { bookApi } from '@app/app/services/books/books-api-slice';
import { drinkApi } from '@app/app/services/drinks/drinks-api-slice';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '@app/app/sagas/rootSaga';
import drinksReducer from '@app/app/features/drinks/drinks-slice';
import booksReducer from '@app/app/features/books/books-slice';
import customersReducer from '@app/app/features/customers/customers-slice';
import ordersReducer from '@app/app/features/orders/orders-slice';
import authenticationReducer from '@app/app/features/authentication/authentication-slice';
import staffsReducer from '@app/app/features/staffs/staffs-slice';
import { verifyApi } from '@app/app/services/authentication/verify-api-slice';
import snacksReducer from '@app/app/features/snacks/snacks-slice';
import areasReducer from '@app/app/features/areas/areas-slice';
import reservationsReducer from '@app/app/features/reservations/reservations-slice';

const sagaMiddleware = createSagaMiddleware();
export const store = configureStore({
  reducer: {
    drinks: drinksReducer,
    books: booksReducer,
    customers: customersReducer,
    orders: ordersReducer,
    authentication: authenticationReducer,
    staffs: staffsReducer,
    snacks: snacksReducer,
    areas: areasReducer,
    reservations: reservationsReducer,
    [bookApi.reducerPath]: bookApi.reducer,
    [drinkApi.reducerPath]: drinkApi.reducer,
    [verifyApi.reducerPath]: verifyApi.reducer,
  },
  middleware: (getDefaultMiddleWare) =>
    getDefaultMiddleWare({
      serializableCheck: {
        // Ignore these action types
        // ignoredActions: ['your/action/type'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.callback'],
        // Ignore these paths in the state
        // ignoredPaths: ['items.dates'],
      },
    })
      .concat(bookApi.middleware)
      .concat(drinkApi.middleware)
      .concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
