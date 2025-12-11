import { createSlice } from "@reduxjs/toolkit";

const variantSlice = createSlice({
  name: "variant", // Tên slice
  initialState: {
    selections: [],
  },
  reducers: {
    // 1. LƯU (Save/Update)
    setManyVariants(state, action) {
      state.selections = action.payload;
    },

    // 2. XÓA HẾT (Reset toàn bộ - ví dụ khi checkout xong)
    clearAllVariants(state) {
      state.selections = [];
    },
  },
});

export const { setManyVariants, clearAllVariants,  } = variantSlice.actions;

// Lấy tất cả (Return nguyên Object)
export const selectAllVariants = (state) => state.variant.selections;

export default variantSlice.reducer;
