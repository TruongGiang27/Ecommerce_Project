import { createSlice } from '@reduxjs/toolkit';

// State khởi tạo mặc định (giúp form không bị lỗi null/undefined)
const initialState = {
  email: "",
  address: {
    first_name: "",
    last_name: "",
    address_1: "",
    city: "",
    country_code: "vn", // Default cứng theo yêu cầu
    postal_code: "700000", // Default cứng theo yêu cầu
    phone: "",
  },
  promoCodes: [], // Luôn là mảng để dễ xử lý
};

const customerInfoSlice = createSlice({
  name: 'customerInfo',
  initialState,
  reducers: {
    // 1. Update Email riêng lẻ
    updateEmail(state, action) {
      state.email = action.payload;
    },

    // 2. Update Address (Hỗ trợ Partial Update)
    // Cho phép truyền vào { city: "Hanoi" } mà không làm mất first_name cũ
    updateAddress(state, action) {
      state.address = {
        ...state.address, // Giữ lại các trường cũ
        ...action.payload // Ghi đè các trường mới
      };
    },

    // 3. Xử lý Promo Codes
    setPromoCodes(state, action) {
      // Input có thể là mảng string ["SALE10"] hoặc chuỗi rỗng
      state.promoCodes = action.payload;
    },
    
    // Thêm 1 mã giảm giá
    addPromoCode(state, action) {
      const code = action.payload;
      if (code && !state.promoCodes.includes(code)) {
        state.promoCodes.push(code);
      }
    },

    // Xóa mã giảm giá
    removePromoCode(state, action) {
      state.promoCodes = state.promoCodes.filter(c => c !== action.payload);
    },

    // 4. Set toàn bộ object (Dùng khi load từ LocalStorage hoặc API)
    setCustomerInfo(state, action) {
      const { email, address, promoCodes } = action.payload;
      if (email !== undefined) state.email = email;
      if (address) state.address = { ...state.address, ...address };
      if (promoCodes) state.promoCodes = promoCodes;
    },

    // 5. Reset về mặc định
    resetCustomerInfo(state) {
      // Reset về đúng initialState ban đầu
      return initialState;
    }
  }
});

export const { 
  updateEmail, 
  updateAddress, 
  setPromoCodes, 
  addPromoCode, 
  removePromoCode,
  setCustomerInfo, 
  resetCustomerInfo 
} = customerInfoSlice.actions;

// Selectors
export const selectCustomerInfo = (state) => state.customerInfo;
export const selectShippingAddress = (state) => state.customerInfo.address;
export const selectPromoCodes = (state) => state.customerInfo.promoCodes;

export default customerInfoSlice.reducer;