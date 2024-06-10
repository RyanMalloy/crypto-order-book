import { configureStore } from "@reduxjs/toolkit";
import tradesReducer from "../slices/trades";
import orderReducer from "../slices/orders";
import marketPriceReducer from "../slices/marketPrice";

export const store = configureStore({
  reducer: {
    trades: tradesReducer,
    orders: orderReducer,
    marketPrice: marketPriceReducer,
  },
});
