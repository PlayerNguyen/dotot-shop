import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const cart = localStorage.getItem(
  process.env.CART_ITEM_KEY_NAME ? process.env.CART_ITEM_KEY_NAME : "cartItems"
);
const initialState = {
  user: {},
};

const UserSlice = createSlice({
  name: "Cart",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = UserSlice.actions;

export default UserSlice.reducer;
