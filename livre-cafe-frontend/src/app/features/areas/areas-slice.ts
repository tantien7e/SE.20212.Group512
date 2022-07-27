import { RootState } from '@app/app/store';
import { AreaInterface } from '@app/models';
import { toastError, toastInformSuccess } from '@app/utils/toast';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface areasData {
  //   areas: AreaInterface[];
}

export interface AreaState {
  loading: boolean;
  addLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
  areas?: AreaInterface[];
  error?: string;
}

const initialState: AreaState = {
  loading: false,
  addLoading: false,
  updateLoading: false,
  deleteLoading: false,
};

const areasSlice = createSlice({
  name: 'areas',
  initialState,
  reducers: {
    fetchAreas(state) {
      state.error = '';
      state.loading = true;
    },
    fetchAreasSucceeded(state, action: PayloadAction<AreaInterface[]>) {
      state.areas = action.payload;
      state.loading = false;
    },
    fetchAreasFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addArea(state, action: PayloadAction<AreaInterface>) {
      state.loading = true;
    },
    addAreaSucceeded(state, action: PayloadAction<AreaInterface>) {
      state.loading = false;
      if (!state.areas) state.areas = [];
      state.areas.push(action.payload);
      toastInformSuccess('Added Successfully');
    },
    addAreaFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      toastError(action.payload);
    },
    //Update
    updateArea(state, action: PayloadAction<AreaInterface>) {
      state.updateLoading = true;
    },
    updateAreaSucceeded(state) {
      state.updateLoading = false;
      toastInformSuccess('Item was updated successfully');
    },
    updateAreaFailed(state, action: PayloadAction<string>) {
      state.updateLoading = false;
      state.error = action.payload;
      toastError(action.payload);
    },
    //Delete
    deleteArea(state, action: PayloadAction<string>) {
      state.deleteLoading = true;
    },
    deleteAreaSucceeded(state) {
      state.deleteLoading = false;
      toastInformSuccess('Item was deleted successfully');
    },
    deleteAreaFailed(state, action: PayloadAction<string>) {
      state.deleteLoading = false;
      state.error = action.payload;
      toastError(action.payload);
    },
  },
});

//Actions
export const {
  fetchAreas,
  fetchAreasSucceeded,
  fetchAreasFailed,
  addArea,
  addAreaSucceeded,
  addAreaFailed,
  updateArea,
  updateAreaFailed,
  updateAreaSucceeded,
  deleteArea,
  deleteAreaFailed,
  deleteAreaSucceeded,
} = areasSlice.actions;

//Selectors
export const selectAreas = (state: RootState) => state.areas;
export const selectAreasLoading = (state: RootState) => state.areas.loading;
export const selectAreasAddLoading = (state: RootState) =>
  state.areas.addLoading;
export const selectAreasError = (state: RootState) => state.areas.error;
export const selectAreasData = (state: RootState) => state.areas.areas;
export const selectAreasUpdateLoading = (state: RootState) =>
  state.areas.updateLoading;
export const selectAreasDeleteLoading = (state: RootState) =>
  state.areas.deleteLoading;

const areasReducer = areasSlice.reducer;
export default areasReducer;
