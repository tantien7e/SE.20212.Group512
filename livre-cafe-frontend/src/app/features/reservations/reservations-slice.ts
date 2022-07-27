import { RootState } from '@app/app/store';
import { ReservationInterface } from '@app/models';
import { toastError, toastInformSuccess } from '@app/utils/toast';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ReservationsState {
  loading: boolean;
  addLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
  reservations?: ReservationInterface[];
  error?: string;
}

const initialState: ReservationsState = {
  loading: false,
  addLoading: false,
  updateLoading: false,
  deleteLoading: false,
};

const reservationsSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {
    //fetch
    fetchReservations(state) {
      state.error = '';
      state.loading = true;
    },
    fetchReservationsSucceeded(
      state,
      action: PayloadAction<ReservationInterface[]>,
    ) {
      state.reservations = action.payload;
      state.loading = false;
    },
    fetchReservationsFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    // Add
    addReservation(state, action: PayloadAction<ReservationInterface>) {
      state.addLoading = true;
    },
    addReservationSucceeded(
      state,
      action: PayloadAction<ReservationInterface>,
    ) {
      state.addLoading = false;
      if (!state.reservations) state.reservations = [];
      state.reservations.push(action.payload);
      toastInformSuccess('Item was added successfully');
    },
    addReservationFailed(state, action: PayloadAction<string>) {
      state.addLoading = false;
      state.error = action.payload;
      toastError(action.payload);
    },
    //Update
    updateReservation(state, action: PayloadAction<ReservationInterface>) {
      state.updateLoading = true;
    },
    updateReservationSucceeded(state) {
      state.updateLoading = false;
      toastInformSuccess('Item was updated successfully');
    },
    updateReservationFailed(state, action: PayloadAction<string>) {
      state.updateLoading = false;
      state.error = action.payload;
      toastError(action.payload);
    },
    //Delete
    deleteReservation(state, action: PayloadAction<string>) {
      state.deleteLoading = true;
    },
    deleteReservationSucceeded(state) {
      state.deleteLoading = false;
      toastInformSuccess('Item was deleted successfully');
    },
    deleteReservationFailed(state, action: PayloadAction<string>) {
      state.deleteLoading = false;
      state.error = action.payload;
      toastError(action.payload);
    },
  },
});

//Actions
export const {
  fetchReservations,
  fetchReservationsSucceeded,
  fetchReservationsFailed,
  addReservation,
  addReservationSucceeded,
  addReservationFailed,
  updateReservation,
  updateReservationSucceeded,
  updateReservationFailed,
  deleteReservation,
  deleteReservationSucceeded,
  deleteReservationFailed,
} = reservationsSlice.actions;

//Selectors
export const selectReservations = (state: RootState) => state.reservations;
export const selectReservationsLoading = (state: RootState) =>
  state.reservations.loading;
export const selectReservationsAddLoading = (state: RootState) =>
  state.reservations.addLoading;
export const selectReservationsUpdateLoading = (state: RootState) =>
  state.reservations.updateLoading;
export const selectReservationsDeleteLoading = (state: RootState) =>
  state.reservations.deleteLoading;

export const selectReservationsError = (state: RootState) =>
  state.reservations.error;
export const selectReservationsData = (state: RootState) =>
  state.reservations.reservations;
//Reducer

const reservationsReducer = reservationsSlice.reducer;
export default reservationsReducer;
