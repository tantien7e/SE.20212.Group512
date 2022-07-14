import { RootState } from '@app/app/store';
import { CustomerInterface } from '@app/models/customer.interface';
import { toastError, toastInformSuccess } from '@app/utils/toast';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CustomersState {
  loading: boolean;
  addLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
  customers?: CustomerInterface[];
  error?: string;
}

const initialState: CustomersState = {
  loading: false,
  addLoading: false,
  updateLoading: false,
  deleteLoading: false,
};

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    //fetch
    fetchCustomers(state) {
      state.error = '';
      state.loading = true;
    },
    fetchCustomersSucceeded(state, action: PayloadAction<CustomerInterface[]>) {
      state.customers = action.payload;
      state.loading = false;
    },
    fetchCustomersFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    // Add
    addCustomer(state, action: PayloadAction<CustomerInterface>) {
      state.addLoading = true;
    },
    addCustomerSucceeded(state, action: PayloadAction<CustomerInterface>) {
      state.addLoading = false;
      if (!state.customers) state.customers = [];
      state.customers.push(action.payload);
      toastInformSuccess('Item was added successfully');
    },
    addCustomerFailed(state, action: PayloadAction<string>) {
      state.addLoading = false;
      state.error = action.payload;
      toastError(action.payload);
    },
    //Update
    updateCustomer(state, action: PayloadAction<CustomerInterface>) {
      state.updateLoading = true;
    },
    updateCustomerSucceeded(state) {
      state.updateLoading = false;
      toastInformSuccess('Item was updated successfully');
    },
    updateCustomerFailed(state, action: PayloadAction<string>) {
      state.updateLoading = false;
      state.error = action.payload;
      toastError(action.payload);
    },
    //Delete
    deleteCustomer(state, action: PayloadAction<string>) {
      state.deleteLoading = true;
    },
    deleteCustomerSucceeded(state) {
      state.deleteLoading = false;
      toastInformSuccess('Item was deleted successfully');
    },
    deleteCustomerFailed(state, action: PayloadAction<string>) {
      state.deleteLoading = false;
      state.error = action.payload;
      toastError(action.payload);
    },
  },
});

//Actions
export const {
  fetchCustomers,
  fetchCustomersSucceeded,
  fetchCustomersFailed,
  addCustomer,
  addCustomerSucceeded,
  addCustomerFailed,
  updateCustomer,
  updateCustomerSucceeded,
  updateCustomerFailed,
  deleteCustomer,
  deleteCustomerSucceeded,
  deleteCustomerFailed,
} = customersSlice.actions;

//Selectors
export const selectCustomers = (state: RootState) => state.customers;
export const selectCustomersLoading = (state: RootState) =>
  state.customers.loading;
export const selectCustomersAddLoading = (state: RootState) =>
  state.customers.addLoading;
export const selectCustomersUpdateLoading = (state: RootState) =>
  state.customers.updateLoading;
export const selectCustomersDeleteLoading = (state: RootState) =>
  state.customers.deleteLoading;

export const selectCustomersError = (state: RootState) => state.customers.error;
export const selectCustomersData = (state: RootState) =>
  state.customers.customers;
//Reducer

const customersReducer = customersSlice.reducer;
export default customersReducer;
