import { RootState } from '@app/app/store';
import { StaffPostData, StaffResponse } from '@app/models/user.interface';
import { toastError, toastInformSuccess } from '@app/utils/toast';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface StaffState {
  loading: boolean;
  addLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
  staffs?: StaffResponse[];
  error?: string;
}

const initialState: StaffState = {
  loading: false,
  addLoading: false,
  updateLoading: false,
  deleteLoading: false,
};

const staffsSlice = createSlice({
  name: 'staffs',
  initialState,
  reducers: {
    //fetch
    fetchStaffs(state) {
      state.error = '';
      state.loading = true;
    },
    fetchStaffsSucceeded(state, action: PayloadAction<StaffResponse[]>) {
      state.staffs = action.payload;
      state.loading = false;
    },
    fetchStaffsFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    // Add
    addStaff(state, action: PayloadAction<StaffPostData>) {
      state.addLoading = true;
    },
    addStaffSucceeded(state, action: PayloadAction<StaffResponse>) {
      state.addLoading = false;
      if (!state.staffs) state.staffs = [];
      state.staffs.push(action.payload);
      toastInformSuccess('Item was added successfully');
    },
    addStaffFailed(state, action: PayloadAction<string>) {
      state.addLoading = false;
      state.error = action.payload;
      toastError(action.payload);
    },
    //Update
    updateStaff(state, action: PayloadAction<StaffPostData>) {
      state.updateLoading = true;
    },
    updateStaffSucceeded(state) {
      state.updateLoading = false;
      toastInformSuccess('Item was updated successfully');
    },
    updateStaffFailed(state, action: PayloadAction<string>) {
      state.updateLoading = false;
      state.error = action.payload;
      toastError(action.payload);
    },
    //Delete
    deleteStaff(state, action: PayloadAction<string>) {
      state.deleteLoading = true;
    },
    deleteStaffSucceeded(state) {
      state.deleteLoading = false;
      toastInformSuccess('Item was deleted successfully');
    },
    deleteStaffFailed(state, action: PayloadAction<string>) {
      state.deleteLoading = false;
      state.error = action.payload;
      toastError(action.payload);
    },
  },
});

//Actions
export const {
  fetchStaffs,
  fetchStaffsSucceeded,
  fetchStaffsFailed,
  addStaff,
  addStaffSucceeded,
  addStaffFailed,
  updateStaff,
  updateStaffSucceeded,
  updateStaffFailed,
  deleteStaff,
  deleteStaffSucceeded,
  deleteStaffFailed,
} = staffsSlice.actions;

//Selectors
export const selectStaffs = (state: RootState) => state.staffs;
export const selectStaffsLoading = (state: RootState) => state.staffs.loading;
export const selectStaffsAddLoading = (state: RootState) =>
  state.staffs.addLoading;
export const selectStaffsUpdateLoading = (state: RootState) =>
  state.staffs.updateLoading;
export const selectStaffsDeleteLoading = (state: RootState) =>
  state.staffs.deleteLoading;

export const selectStaffsError = (state: RootState) => state.staffs.error;
export const selectStaffsData = (state: RootState) => state.staffs.staffs;
//Reducer

const staffsReducer = staffsSlice.reducer;
export default staffsReducer;
