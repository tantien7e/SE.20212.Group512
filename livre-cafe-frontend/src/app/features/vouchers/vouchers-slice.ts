import { RootState } from '@app/app/store';
import { VoucherInterface } from '@app/models/voucher.interface';
import { toastError, toastInformSuccess } from '@app/utils/toast';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface VouchersState {
  loading: boolean;
  addLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
  vouchers?: VoucherInterface[];
  error?: string;
}

const initialState: VouchersState = {
  loading: false,
  addLoading: false,
  updateLoading: false,
  deleteLoading: false,
};

const vouchersSlice = createSlice({
  name: 'vouchers',
  initialState,
  reducers: {
    //fetch
    fetchVouchers(state) {
      state.error = '';
      state.loading = true;
    },
    fetchVouchersSucceeded(state, action: PayloadAction<VoucherInterface[]>) {
      state.vouchers = action.payload;
      state.loading = false;
    },
    fetchVouchersFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    // Add
    addVoucher(state, action: PayloadAction<VoucherInterface>) {
      state.addLoading = true;
    },
    addVoucherSucceeded(state, action: PayloadAction<VoucherInterface>) {
      state.addLoading = false;
      if (!state.vouchers) state.vouchers = [];
      state.vouchers.push(action.payload);
      toastInformSuccess('Voucher was added successfully');
    },
    addVoucherFailed(state, action: PayloadAction<string>) {
      state.addLoading = false;
      state.error = action.payload;
      toastError(action.payload);
    },
    //Update
    updateVoucher(state, action: PayloadAction<VoucherInterface>) {
      state.updateLoading = true;
    },
    updateVoucherSucceeded(state) {
      state.updateLoading = false;
      toastInformSuccess('Voucher was updated successfully');
    },
    updateVoucherFailed(state, action: PayloadAction<string>) {
      state.updateLoading = false;
      state.error = action.payload;
      toastError(action.payload);
    },
    //Delete
    deleteVoucher(state, action: PayloadAction<string>) {
      state.deleteLoading = true;
    },
    deleteVoucherSucceeded(state) {
      state.deleteLoading = false;
      toastInformSuccess('Voucher was deleted successfully');
    },
    deleteVoucherFailed(state, action: PayloadAction<string>) {
      state.deleteLoading = false;
      state.error = action.payload;
      toastError(action.payload);
    },
  },
});

//Actions
export const {
  fetchVouchers,
  fetchVouchersSucceeded,
  fetchVouchersFailed,
  addVoucher,
  addVoucherSucceeded,
  addVoucherFailed,
  updateVoucher,
  updateVoucherSucceeded,
  updateVoucherFailed,
  deleteVoucher,
  deleteVoucherSucceeded,
  deleteVoucherFailed,
} = vouchersSlice.actions;

//Selectors
export const selectVouchers = (state: RootState) => state.vouchers;
export const selectVouchersLoading = (state: RootState) =>
  state.vouchers.loading;
export const selectVouchersAddLoading = (state: RootState) =>
  state.vouchers.addLoading;
export const selectVouchersUpdateLoading = (state: RootState) =>
  state.vouchers.updateLoading;
export const selectVouchersDeleteLoading = (state: RootState) =>
  state.vouchers.deleteLoading;

export const selectVouchersError = (state: RootState) => state.vouchers.error;
export const selectVouchersData = (state: RootState) =>
  state.vouchers.vouchers;
//Reducer

const vouchersReducer = vouchersSlice.reducer;
export default vouchersReducer;
