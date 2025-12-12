import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart", // Tên slice
  initialState: {
    cartId: null,
  },
  reducers: {
    // 1. LƯU (Save/Update)
    setCartId(state, action) {
      state.cartId = action.payload;
    },

    // 2. XÓA HẾT (Reset toàn bộ - ví dụ khi checkout xong)
    clearCartId(state) {
      state.cartId = null;
    },
  },
});

export const { setCartId, clearCartId } = cartSlice.actions;

export default cartSlice.reducer;
