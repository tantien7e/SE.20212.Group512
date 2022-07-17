import { RootState } from '@app/app/store';
import { SnackInterface } from '@app/models';
import { toastError, toastInformSuccess } from '@app/utils/toast';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SnacksState {
  loading: boolean;
  addLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
  snacks?: SnackInterface[];
  error?: string;
}

const initialState: SnacksState = {
  loading: false,
  addLoading: false,
  updateLoading: false,
  deleteLoading: false,
  snacks: undefined,
};

const snacksSlice = createSlice({
  name: 'snacks',
  initialState,
  reducers: {
    //fetch
    fetchSnacks(state) {
      state.error = '';
      state.loading = true;
    },
    fetchSnacksSucceeded(state, action: PayloadAction<SnackInterface[]>) {
      state.snacks = action.payload;
      state.loading = false;
    },
    fetchSnacksFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    // Add
    addSnack(state, action: PayloadAction<SnackInterface>) {
      state.addLoading = true;
    },
    addSnackSucceeded(state, action: PayloadAction<SnackInterface>) {
      state.addLoading = false;
      if (!state.snacks) state.snacks = [];
      state.snacks.push(action.payload);
      toastInformSuccess('Item was added successfully');
    },
    addSnackFailed(state, action: PayloadAction<string>) {
      state.addLoading = false;
      state.error = action.payload;
      toastError(action.payload);
    },
    //Update
    updateSnack(state, action: PayloadAction<SnackInterface>) {
      state.updateLoading = true;
    },
    updateSnackSucceeded(state) {
      state.updateLoading = false;
      toastInformSuccess('Item was updated successfully');
    },
    updateSnackFailed(state, action: PayloadAction<string>) {
      state.updateLoading = false;
      state.error = action.payload;
      toastError(action.payload);
    },
    //Delete
    deleteSnack(state, action: PayloadAction<string>) {
      state.deleteLoading = true;
    },
    deleteSnackSucceeded(state) {
      state.deleteLoading = false;
      toastInformSuccess('Item was deleted successfully');
    },
    deleteSnackFailed(state, action: PayloadAction<string>) {
      state.deleteLoading = false;
      state.error = action.payload;
      toastError(action.payload);
    },
  },
});

//Actions
export const {
  fetchSnacks,
  fetchSnacksSucceeded,
  fetchSnacksFailed,
  addSnack,
  addSnackSucceeded,
  addSnackFailed,
  updateSnack,
  updateSnackSucceeded,
  updateSnackFailed,
  deleteSnack,
  deleteSnackSucceeded,
  deleteSnackFailed,
} = snacksSlice.actions;

//Selectors
export const selectSnacks = (state: RootState) => state.snacks;
export const selectSnacksLoading = (state: RootState) => state.snacks.loading;
export const selectSnacksAddLoading = (state: RootState) =>
  state.snacks.addLoading;
export const selectSnacksUpdateLoading = (state: RootState) =>
  state.snacks.updateLoading;
export const selectSnacksDeleteLoading = (state: RootState) =>
  state.snacks.deleteLoading;

export const selectSnacksError = (state: RootState) => state.snacks.error;
export const selectSnacksData = (state: RootState) => state.snacks.snacks;
//Reducer

const snacksReducer = snacksSlice.reducer;
export default snacksReducer;
