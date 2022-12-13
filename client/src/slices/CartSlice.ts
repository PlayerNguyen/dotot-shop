import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const cart = localStorage.getItem(
  process.env.CART_ITEM_KEY_NAME ? process.env.CART_ITEM_KEY_NAME : "cartItems"
);
const initialState = {
  items: cart ? JSON.parse(cart) : new Set(),
};

const CartSlice = createSlice({
  name: "Cart",
  initialState,
  reducers: {
    addCartItem: (state, action: PayloadAction<string>) => {
      if (!state.items.includes(action.payload)) {
        state.items = [...state.items, action.payload];
      }
    },
    removeCartItem: (state, action: PayloadAction<string>) => {
      state.items = [...state.items].filter((ele) => ele !== action.payload);
    },
    clearCartItem: (state) => {
      state.items = [];
    },
  },
});

export const { addCartItem, removeCartItem, clearCartItem } = CartSlice.actions;

export default CartSlice.reducer;
