import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 5,
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    //increment
    increment(state) {
      state.value++;
    },
    //amount added
    amountAdded(state, action: PayloadAction<number>) {
      state.value += action.payload
    }
  },
});

export const { increment, amountAdded } = counterSlice.actions;
export default counterSlice.reducer;
