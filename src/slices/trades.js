import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  trades: [],
};

const tradesSlice = createSlice({
  name: "trades",
  initialState,
  reducers: {
    addTrade: (state, action) => {
      state.trades.push(action.payload);
    },
  },
});

export const { addTrade } = tradesSlice.actions;

export default tradesSlice.reducer;
