import { RootState } from '@app/app/store';
import { OrderInterface } from '@app/models';
import { toastError, toastInformSuccess } from '@app/utils/toast';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface OrdersState {
  loading: boolean;
  addLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
  orders: OrderInterface[];
  error?: string;
}

const initialState: OrdersState = {
  loading: false,
  addLoading: false,
  updateLoading: false,
  deleteLoading: false,
  orders: [],
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    //fetch
    fetchOrders(state) {
      state.error = '';
      state.loading = true;
    },
    fetchOrdersSucceeded(state, action: PayloadAction<OrderInterface[]>) {
      state.orders = action.payload;
      state.loading = false;
    },
    fetchOrdersFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    // Add
    addOrder(state, action: PayloadAction<OrderInterface>) {
      state.addLoading = true;
    },
    addOrderSucceeded(state, action: PayloadAction<OrderInterface>) {
      state.addLoading = false;
      state.orders.push(action.payload);
      toastInformSuccess('Item was added successfully');
    },
    addOrderFailed(state, action: PayloadAction<string>) {
      state.addLoading = false;
      state.error = action.payload;
      toastError(action.payload);
    },
    //Update
    updateOrder(state, action: PayloadAction<OrderInterface>) {
      state.updateLoading = true;
    },
    updateOrderSucceeded(state) {
      state.updateLoading = false;
      toastInformSuccess('Item was updated successfully');
    },
    updateOrderFailed(state, action: PayloadAction<string>) {
      state.updateLoading = false;
      state.error = action.payload;
      toastError(action.payload);
    },
    //Delete
    deleteOrder(state, action: PayloadAction<OrderInterface>) {
      state.deleteLoading = true;
    },
    deleteOrderSucceeded(state) {
      state.deleteLoading = false;
      toastInformSuccess('Item was deleted successfully');
    },
    deleteOrderFailed(state, action: PayloadAction<string>) {
      state.deleteLoading = false;
      state.error = action.payload;
      toastError(action.payload);
    },
  },
});

//Actions
export const {
  fetchOrders,
  fetchOrdersSucceeded,
  fetchOrdersFailed,
  addOrder,
  addOrderSucceeded,
  addOrderFailed,
  updateOrder,
  updateOrderSucceeded,
  updateOrderFailed,
  deleteOrder,
  deleteOrderSucceeded,
  deleteOrderFailed,
} = ordersSlice.actions;

//Selectors
export const selectOrders = (state: RootState) => state.orders;
export const selectOrdersLoading = (state: RootState) => state.orders.loading;
export const selectOrdersAddLoading = (state: RootState) =>
  state.orders.addLoading;
export const selectOrdersUpdateLoading = (state: RootState) =>
  state.orders.updateLoading;
export const selectOrdersDeleteLoading = (state: RootState) =>
  state.orders.deleteLoading;

export const selectOrdersError = (state: RootState) => state.orders.error;
export const selectOrdersData = (state: RootState) => state.orders.orders;
//Reducer

const ordersReducer = ordersSlice.reducer;
export default ordersReducer;
