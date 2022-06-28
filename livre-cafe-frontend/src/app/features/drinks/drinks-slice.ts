import { RootState } from '@app/app/store';
import { DrinkInterface } from '@app/models/product.interface';
import { toastError, toastInformSuccess } from '@app/utils/toast';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DrinksData {
  //   drinks: DrinkInterface[];
}

export interface DrinksState {
  loading: boolean;
  addLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
  drinks?: DrinkInterface[];
  error?: string;
}

const initialState: DrinksState = {
  loading: false,
  addLoading: false,
  updateLoading: false,
  deleteLoading: false,
  drinks: undefined,
};

const drinksSlice = createSlice({
  name: 'drinks',
  initialState,
  reducers: {
    //fetch
    fetchDrinks(state) {
      state.error = '';
      state.loading = true;
    },
    fetchDrinksSucceeded(state, action: PayloadAction<DrinkInterface[]>) {
      state.drinks = action.payload;
      state.loading = false;
    },
    fetchDrinksFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    // Add
    addDrink(state, action: PayloadAction<DrinkInterface>) {
      state.addLoading = true;
    },
    addDrinkSucceeded(state, action: PayloadAction<DrinkInterface>) {
      state.addLoading = false;
      if (!state.drinks) state.drinks = [];
      state.drinks.push(action.payload);
      toastInformSuccess('Item was added successfully');
    },
    addDrinkFailed(state, action: PayloadAction<string>) {
      state.addLoading = false;
      state.error = action.payload;
      toastError(action.payload);
    },
    //Update
    updateDrink(state, action: PayloadAction<DrinkInterface>) {
      state.updateLoading = true;
    },
    updateDrinkSucceeded(state) {
      state.updateLoading = false;
      toastInformSuccess('Item was updated successfully');
    },
    updateDrinkFailed(state, action: PayloadAction<string>) {
      state.updateLoading = false;
      state.error = action.payload;
      toastError(action.payload);
    },
    //Delete
    deleteDrink(state, action: PayloadAction<DrinkInterface>) {
      state.deleteLoading = true;
    },
    deleteDrinkSucceeded(state) {
      state.deleteLoading = false;
      toastInformSuccess('Item was deleted successfully');
    },
    deleteDrinkFailed(state, action: PayloadAction<string>) {
      state.deleteLoading = false;
      state.error = action.payload;
      toastError(action.payload);
    },
  },
});

//Actions
export const {
  fetchDrinks,
  fetchDrinksSucceeded,
  fetchDrinksFailed,
  addDrink,
  addDrinkSucceeded,
  addDrinkFailed,
  updateDrink,
  updateDrinkSucceeded,
  updateDrinkFailed,
  deleteDrink,
  deleteDrinkSucceeded,
  deleteDrinkFailed,
} = drinksSlice.actions;

//Selectors
export const selectDrinks = (state: RootState) => state.drinks;
export const selectDrinksLoading = (state: RootState) => state.drinks.loading;
export const selectDrinksAddLoading = (state: RootState) =>
  state.drinks.addLoading;
export const selectDrinksUpdateLoading = (state: RootState) =>
  state.drinks.updateLoading;
export const selectDrinksDeleteLoading = (state: RootState) =>
  state.drinks.deleteLoading;

export const selectDrinksError = (state: RootState) => state.drinks.error;
export const selectDrinksData = (state: RootState) => state.drinks.drinks;
//Reducer

const drinksReducer = drinksSlice.reducer;
export default drinksReducer;
