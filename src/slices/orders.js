import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  side: undefined,
  price: undefined,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setSide: (state, action) => {
      state.side = action.payload;
    },
    setPrice: (state, action) => {
      state.price = action.payload;
    },
  },
});

export const { setSide, setPrice } = orderSlice.actions;

export default orderSlice.reducer;
