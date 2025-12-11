import axios from "axios";

const DEFAULT_REGION_ID = process.env.REACT_APP_MEDUSA_REGION_ID;
const API_URL = process.env.REACT_APP_MEDUSA_BACKEND_URL;
const PUBLISHABLE_KEY = process.env.REACT_APP_MEDUSA_PUBLISHABLE_KEY;
const apiBaseURL = `${API_URL}/store`;

// 1. Tạo instance Axios dùng chung (Best Practice)
const apiClient = axios.create({
  baseURL: apiBaseURL,
  headers: {
    "Content-Type": "application/json",
    "x-publishable-api-key": PUBLISHABLE_KEY,
  },
});

/* --- CÁC HÀM CORE --- */

// 2. Tạo Cart
export async function createCart(regionId = DEFAULT_REGION_ID) {
  try {
    const res = await apiClient.post(`/carts`, {
      region_id: regionId,
      currency_code: "vnd",
    });
    return res.data.cart;
  } catch (error) {
    console.error("Error creating cart:", error);
    throw error;
  }
}

// 3. Thêm sản phẩm vào Cart
export async function addItemToCart(cartId, variantId, quantity = 1) {
  try {
    const res = await apiClient.post(`/carts/${cartId}/line-items`, {
      variant_id: variantId,
      quantity: quantity,
    });

    return res.data.cart;
  } catch (error) {
    if (error.response) {
      // Server trả về lỗi (400, 500...)
      console.error("Medusa Error Data:", error.response.data);
      console.error("Medusa Error Message:", error.response.data.message);
    } else {
      console.error("Network Error:", error.message);
    }
    throw error;
  }
}

// 4. Cập nhật Email & Địa chỉ (Bắt buộc để tính Ship)
export async function updateCartInfo(cartId, email, shippingAddress, promoCodes) {
  try {
    const res = await apiClient.post(`/carts/${cartId}`, {
      email: email,
      shipping_address: shippingAddress,
      promo_codes: promoCodes,
    });

    return res.data.cart;
  } catch (error) {
    console.error("Error updating cart info:", error);
    throw error;
  }
}

// 7. Tạo Payment Collection (Bắt buộc ở Medusa v2)
export async function createPaymentCollection(cartId) {
  try {
    const res = await apiClient.post(`/payment-collections`, {
      cart_id: cartId,
    });

    return res.data.payment_collection;
  } catch (error) {
    console.error("Error creating payment collection:", error);
    throw error;
  }
}

// 8. Khởi tạo Payment Session (Chọn cổng thanh toán)
export async function initPaymentSession(
  paymentCollectionId,
  providerId = "pp_system_default"
) {
  try {
    const res = await apiClient.post(
      `/payment-collections/${paymentCollectionId}/payment-sessions`,
      {
        provider_id: providerId,
      }
    );

    return res.data.payment_collection;
  } catch (error) {
    console.error("Error init payment session:", error);
    throw error;
  }
}

// 9. Hoàn tất đơn hàng (Complete Cart)
export async function completeCart(cartId) {
  try {
    const res = await apiClient.post(`/carts/${cartId}/complete`, {});

    return res.data; // Trả về { type: "order", data: ... }
  } catch (error) {
    console.error("Error completing cart:", error);
    throw error;
  }
}

// --- HÀM TỔNG HỢP (FULL FLOW) ---
// Hàm này mô phỏng nút "Mua Ngay" (Buy Now)
export async function processCheckout(
  variantId,
  quantity,
  customerInfo,
) {
  try {
    if (!Array.isArray(variantId) || variantId.length === 0) {
      throw new Error("Danh sách sản phẩm không hợp lệ (phải là mảng và không rỗng).");
    }

    console.log("1. Creating Cart...");
    let cart = await createCart();
    const cartId = cart.id;
    console.log("Finish Create Cart");

    console.log(`2. Adding ${variantId.length} Item...`);
    await Promise.all(variantId.map(id => addItemToCart(cartId, id.variant_id, quantity)));
    console.log("Finish Add Item");

    console.log("3. Updating Info...");
    console.log("Customer Info: ", customerInfo);
    
    // customerInfo structure: { email: "...", address: { ... } }
    cart = await updateCartInfo(
      cartId,
      customerInfo.email,
      customerInfo.address,
      customerInfo.promoCodes
    );
    console.log("Finish Update Info");

    console.log("5. Initializing Payment...");
    const payCol = await createPaymentCollection(cartId);
    await initPaymentSession(payCol.id, "pp_system_default");
    console.log("Finish Init Payment");

    console.log("6. Completing Order...");
    const orderData = await completeCart(cartId);

    console.log("Order Created Successfully:", orderData);
    return orderData;
  } catch (error) {
    console.error("Checkout Failed:", error.response?.data || error.message);
    throw error;
  }
}
