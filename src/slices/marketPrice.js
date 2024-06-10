import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  askPrice: undefined,
  bidPrice: undefined,
};

const marketPriceSlice = createSlice({
  name: "marketPrice",
  initialState,
  reducers: {
    setAskPrice: (state, action) => {
      state.askPrice = action.payload;
    },
    setBidPrice: (state, action) => {
      state.bidPrice = action.payload;
    },
  },
});

export const { setAskPrice, setBidPrice } = marketPriceSlice.actions;

export default marketPriceSlice.reducer;
