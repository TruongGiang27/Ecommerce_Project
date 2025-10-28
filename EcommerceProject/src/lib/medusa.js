// src/lib/medusa.js
import Medusa from "@medusajs/medusa-js";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PUBLISHABLE_KEY = process.env.REACT_APP_MEDUSA_PUBLISHABLE_KEY;

const medusaClient = new Medusa({
    baseUrl: BACKEND_URL,
    maxRetries: 3,
    publishableApiKey: PUBLISHABLE_KEY
});

// ✅ Đổi tên thành CustomerClient, trỏ đến /store để gọi /customers/me
export const apiCustomerClient = axios.create({
    baseURL: `${BACKEND_URL}/store`,
    // ⚠️ Loại bỏ withCredentials vì chúng ta dùng Bearer Token qua header
    // withCredentials: true, 
    headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': PUBLISHABLE_KEY,

    },
});

export const apiAuthClient = axios.create({
    baseURL: `${BACKEND_URL}/auth`,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const apiStoreClient = axios.create({
    baseURL: `${BACKEND_URL}/store`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': PUBLISHABLE_KEY,
    },
});

export const resetPasswordAPI = {
  // B1: Gửi email reset
  requestReset: async (email) => {
    return apiAuthClient.post("/customer/emailpass/reset-password", {
      identifier: email,
    });
  },

  // B2: Cập nhật mật khẩu (chuẩn v2)
  updatePassword: async (email, password, token) => {
    return apiAuthClient.post(
      "/customer/emailpass/update",
      { email, password },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
};


export default medusaClient;