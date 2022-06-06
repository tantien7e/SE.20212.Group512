import { RootState } from '@app/app/store';
import { DrinkInterface } from '@app/models/product.interface';
import { toastError, toastInformSuccess } from '@app/utils/toast';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DrinksData {
  //   drinks: DrinkInterface[];
}

export interface DrinksState {
  loading: boolean;
  drinks: DrinkInterface[];
  error?: string;
}

const initialState: DrinksState = {
  loading: false,
  drinks: [],
};

const drinksSlice = createSlice({
  name: 'drinks',
  initialState,
  reducers: {
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
    addDrink(state, action: PayloadAction<DrinkInterface>) {
      state.loading = true;
    },
    addDrinkSucceeded(state, action: PayloadAction<DrinkInterface>) {
      state.loading = false;
      state.drinks.push(action.payload);
      toastInformSuccess('Added Successfully');
    },
    addDrinkFailed(state, action: PayloadAction<string>) {
      state.loading = false;
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
} = drinksSlice.actions;

//Selectors
export const selectDrinks = (state: RootState) => state.drinks;
export const selectDrinksLoading = (state: RootState) => state.drinks.loading;
export const selectDrinksError = (state: RootState) => state.drinks.error;
export const selectDrinksData = (state: RootState) => state.drinks.drinks;
//Reducer

const drinksReducer = drinksSlice.reducer;
export default drinksReducer;
