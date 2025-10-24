import axios from "axios";
import { apiStoreClient } from "../lib/medusa";

const DEFAULT_REGION_ID = "reg_01K83X4P5P7KBWB6FXEDJMADA6";
const API_URL = process.env.REACT_APP_MEDUSA_BACKEND_URL;
const PUBLISHABLE_KEY = process.env.REACT_APP_MEDUSA_PUBLISHABLE_KEY;
// const API_URL = "http://localhost:9000/store";
// const PUBLISHABLE_KEY =
//   "pk_f39b41d09e59ef35a32f1f1608cace1f3e6916954f0701c83aedc38ccf9912e4";

// Tạo instance cơ bản của axios
const storeApi = axios.create({
  baseURL: API_URL,
  headers: {
    "x-publishable-api-key": PUBLISHABLE_KEY,
    "Content-Type": "application/json",
  },
});



// ---------- Hàm gắn token động khi người dùng đã đăng nhập ----------
export const setAuthToken = (token) => {
  if (token) {
    storeApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete storeApi.defaults.headers.common["Authorization"];
  }
};

/* ---------------- PRODUCTS ---------------- */
export async function fetchProducts() {

  try {
    const res = await apiStoreClient.get("/products?limit=1000");
    return res.data.products;
  } catch (err) {
    console.error("fetchProducts error:", err);
    return [];
  }
}

// const VALID_REGION_ID = "reg_01K7GR3JKEREAS3ZXJ367QSVF7"; // Giữ nguyên Region ID hợp lệ

export async function fetchProductById(productId) {
  try {
    const response = await apiStoreClient.get(`/products/${productId}`, {
      params: {
        // ✅ SỬA: Bỏ 'expand' và kết hợp tất cả vào 'fields'
        // Cú pháp: [Trường cơ bản], [Mối quan hệ chính], [Mối quan hệ phụ qua dấu chấm]
        fields: "id,title,description,thumbnail,handle,status,metadata,variants,variants.prices,variants.calculated_price,options,images",
        // ⚠️ Đã loại bỏ 'expand'

        region_id: DEFAULT_REGION_ID, // Sử dụng Region ID hợp lệ
      }
    });

    return response.data.product;

  } catch (error) {
    console.error("Lỗi khi lấy chi tiết sản phẩm:", error.response?.status, error.message);
    throw new Error(`Lỗi tải chi tiết sản phẩm: ${error.response?.data?.message || error.message}. Vui lòng kiểm tra lại cấu hình fields.`);
  }
}
/* ---------------- CARTS ---------------- */
export async function createCart() {
  const res = await storeApi.post("/carts", {});
  return res.data.cart;
}

export async function fetchCartDetail(cartId) {
  const res = await storeApi.get(`/carts/${cartId}`);
  return res.data.cart;
}

export async function addToCart(cartId, variantId, quantity = 1) {
  const res = await apiStoreClient.post(`/carts/${cartId}/line-items`, {
    variant_id: variantId,
    quantity,
  });
  return res.data.cart;
}

export async function updateCartItem(cartId, lineId, quantity) {
  const res = await apiStoreClient.put(`/carts/${cartId}/line-items/${lineId}`, {
    quantity,
  });
  return res.data.cart;
}

export async function removeCartItem(cartId, lineId) {
  const res = await storeApi.delete(`/carts/${cartId}/line-items/${lineId}`);
  return res.data.cart;
}

/* ---------------- AUTH / CUSTOMERS ---------------- */

// -------------------- REGISTER --------------------
export const registerCustomer = async (data) => {
  try {
    // 1️⃣ Đăng ký user (Auth)
    const registerRes = await storeApi.post(`/auth/register`, {
      actor_type: "customer",
      provider: "emailpass",
      data: {
        email: data.email,
        password: data.password,
      },
    });

    const token = registerRes.data.token;

    // 2️⃣ Tạo profile Customer (họ tên, email,...)
    const customerApi = axios.create({
      baseURL: `${API_URL}/store`,
      headers: {
        Authorization: `Bearer ${token}`,
        "x-publishable-api-key": PUBLISHABLE_KEY,
        "Content-Type": "application/json",
      },
    });

    await customerApi.post(`/customers`, {
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
    });

    return { token };
  } catch (err) {
    console.error("❌ Register error:", err.response?.data || err.message);
    throw err;
  }
};

// -------------------- LOGIN --------------------
export const loginCustomer = async (email, password) => {
  try {
    const res = await storeApi.post(`/auth/customer/emailpass`, {
      email,
      password,
    });

    const token = res.data.token;

    const customer = await getCurrentCustomer(token);
    return { token, customer };
  } catch (err) {
    console.error("❌ Login error:", err.response?.data || err.message);
    throw err;
  }
};

// -------------------- GET CURRENT CUSTOMER --------------------
export const getCurrentCustomer = async (token) => {
  try {
    const res = await axios.get(`${API_URL}/store/customers/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-publishable-api-key": PUBLISHABLE_KEY,
      },
    });
    return res.data.customer;
  } catch (err) {
    console.error("❌ Fetch customer error:", err.response?.data || err.message);
    throw err;
  }
};

// -------------------- LOGOUT --------------------
export const logoutCustomer = async (token) => {
  try {
    await axios.post(
      `${API_URL}/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-publishable-api-key": PUBLISHABLE_KEY,
        },
      }
    );
  } catch (err) {
    console.error("❌ Logout error:", err.response?.data || err.message);
  }
};

// Cập nhật hồ sơ cá nhân
// ✅ Cập nhật profile
export async function updateCustomerProfile(data) {
  try {
    const res = await apiStoreClient.post("/customers/me", data);
    return res.data.customer;
  } catch (err) {
    throw (err, "Cập nhật hồ sơ thất bại");
  }
}

// ✅ Đổi mật khẩu
export async function changeCustomerPassword(oldPassword, newPassword) {
  try {
    // const res = await storeApi.post("/auth/customer/emailpass/update", {
    const res = await apiStoreClient.post("/auth/emailpass/update", {
      old_password: oldPassword,
      new_password: newPassword,
    });
    return res.data.customer;
  } catch (err) {
    throw (err, "Đổi mật khẩu thất bại");
  }
}


export async function getCustomerProfile(token) {
  try {
    const authApi = axios.create({
      baseURL: API_URL,
      headers: {
        Authorization: `Bearer ${token}`,
        "x-publishable-api-key": PUBLISHABLE_KEY,
      },
    });

    const res = await authApi.get("/customers/me");
    return res.data.customer;
  } catch (err) {
    throw new Error("Không thể lấy thông tin người dùng");
  }
}

/* ---------------- THANH TOÁN ---------------- */
export async function createPaymentCollection(cartId) {
  const res = await storeApi.post("/payment-collections", { cart_id: cartId });
  return res.data.payment_collection;
}

export async function addPaymentSession(collectionId, providerId) {
  const res = await apiStoreClient.post(
    `/payment-collections/${collectionId}/payment-sessions`,
    { provider_id: providerId }
  );
  return res.data.payment_collection;
}

export async function completePayment(collectionId) {
  const res = await storeApi.post(
    `/payment-collections/${collectionId}/complete`
  );
  return res.data.order;
}

/* ---------------- ORDERS ---------------- */
export async function fetchOrderById(orderId) {
  const res = await storeApi.get(`/orders/${orderId}`);
  return res.data.order;
}

// ✅ Lấy danh sách đơn hàng (phải login)
export async function fetchOrders(customerToken) {
  const authApi = axios.create({
    baseURL: `${API_URL}/store`,
    headers: {
      "x-publishable-api-key": PUBLISHABLE_KEY,
      Authorization: `Bearer ${customerToken}`,
    },
  });

  const res = await authApi.get(`/orders`);
  return res.data.orders;
}
