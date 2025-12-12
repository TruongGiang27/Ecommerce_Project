// src/context/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
// ✅ Import apiAuthClient cho việc login và apiCustomerClient cho việc fetch customer
import { apiAuthClient, apiCustomerClient, apiStoreClient } from "../lib/medusa";

const AUTH_TOKEN_KEY = "medusa_auth_token";
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

  const setAuthToken = (token) => {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  };

  const getAuthHeaders = (token) => {
    const currentToken = token || getToken();
    // ✅ Token phải được gửi qua header Authorization
    return currentToken ? { Authorization: `Bearer ${currentToken}` } : {};
  };

  const logout = useCallback(() => {
    setAuthToken(null);
    setIsAuthenticated(false);
    setCustomer(null);
  }, []);

  // ✅ HÀM NÀY ĐÃ ĐƯỢC SỬA ĐỂ GỌI /customers/me
  const fetchCustomer = useCallback(
    async (token) => {
      try {
        const headers = getAuthHeaders(token);

        console.log(
          "-> Sending GET /store/customers/me with headers:",
          headers
        );

        // ⚠️ GỌI ENDPOINT STORE API
        const response = await apiCustomerClient.get("/customers/me", {
          headers,
        });

        if (response.data.customer) {
          console.log("-> SUCCESS: Customer data received from /customers/me.");
          setCustomer(response.data.customer);
          setIsAuthenticated(true);
        } else {
          console.log("-> FAIL: Token invalid or no customer data.");
          logout();
        }
      } catch (error) {
        // ✅ Bắt lỗi 401/CORS/Network
        console.error(
          "LỖI FETCH CUSTOMER (Lỗi CORS/Token):",
          error.response?.status,
          error.message
        );
        logout();
      } finally {
        setIsLoading(false);
      }
    },
    [logout]
  );

  const login = async (email, password) => {
    try {
      const authResponse = await apiAuthClient.post("/customer/emailpass", {
        email,
        password,
      });
      const token = authResponse.data.token;

      console.log("-> POST /customer/emailpass success. Token received.");
      setAuthToken(token);

      // ⚠️ Dùng token mới để fetch customer từ Store API
      await fetchCustomer(token);

      return { success: true };
    } catch (error) {
      console.error(
        "Login thất bại:",
        error.response?.data?.message || error.message
      );
      setAuthToken(null);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Đăng nhập thất bại (Kiểm tra CORS/Kết nối)",
      };
    }
  };

 
  const register = async ({
  email,
  password,
  first_name,
  last_name,
  phone,
}) => {
  try {
    // 1️⃣ Đăng ký tài khoản trên Auth service
    const authRegisterResponse = await apiAuthClient.post(
      "/customer/emailpass/register",
      { email, password }
    );

    const registerToken = authRegisterResponse.data.token;
    setAuthToken(registerToken);

    // 2️⃣ Tạo customer record trong Store API
    const headers = {
      ...getAuthHeaders(registerToken),
      "x-publishable-api-key":
        apiStoreClient.defaults.headers?.common?.["x-publishable-api-key"] ||
        process.env.REACT_APP_MEDUSA_PUBLISHABLE_KEY,
    };

    const customerForm = { first_name, last_name, email, phone };
    await apiStoreClient.post("/customers", customerForm, { headers });

    // 3️⃣ Đăng nhập để lấy token chính thức
    const authLoginResponse = await apiAuthClient.post("/customer/emailpass", {
      email,
      password,
    });
    const loginToken = authLoginResponse.data.token;
    setAuthToken(loginToken);

    // 4️⃣ Gửi địa chỉ đến /store/customers/me/addresses
    const addressPayload = {
      first_name,
      last_name,
      phone,
    };

    const addressResponse = await apiStoreClient.post(
      "/customers/me/addresses",
      addressPayload,
      { headers: getAuthHeaders(loginToken) }
    );

    console.log("Address created:", addressResponse.data);

    // 5️⃣ Fetch lại thông tin customer để cập nhật UI
    await fetchCustomer(loginToken);

    return { success: true };
  } catch (error) {
    console.error(
      "Register failed:",
      error.response?.status,
      error.response?.data || error.message
    );
    setAuthToken(null);

    const serverData = error.response?.data;
    let serverMsg =
      serverData?.message ||
      (typeof serverData === "string" ? serverData : "Đăng ký thất bại.");
    return { success: false, error: serverMsg };
  }
};


// dùng apiAuthClient (baseURL = `${BACKEND_URL}/auth`)
// AuthContext.jsx (thay thế hàm loginWithGoogle)
const loginWithGoogle = async () => {
  try {
    // Gọi route authenticate cho customer (baseURL đã là `${BACKEND_URL}/auth`)
    const res = await apiAuthClient.get("/customer/google");

    // Trường hợp backend trả object { location: "https://accounts.google..." }
    if (res.data?.location) {
      window.location.href = res.data.location;
      return;
    }

    // Hoặc backend có thể trả token trực tiếp (ví dụ user đã đăng nhập trước)
    const token = res.data?.token || (typeof res.data === "string" ? res.data : null);
    if (token) {
      setAuthToken(token);
      await fetchCustomer(token);
      return;
    }

    // Nếu không nhận gì hợp lệ -> fallback redirect thẳng
    window.location.href = `${process.env.REACT_APP_MEDUSA_BACKEND_URL}/auth/customer/google`;
  } catch (err) {
    console.error("Lỗi khi khởi tạo Google login:", err.response?.data || err.message);
    // fallback direct redirect nếu có lỗi mạng / CORS
    window.location.href = `${process.env.REACT_APP_MEDUSA_BACKEND_URL}/auth/customer/google`;
  }
};



  const value = {
    isAuthenticated,
    customer,
    isLoading,
    login,
    register,
    logout,
    setAuthToken,
    fetchCustomer,
    loginWithGoogle,
  };

  useEffect(() => {
    const storedToken = getToken();
    if (storedToken) {
      fetchCustomer(storedToken);
    } else {
      setIsLoading(false);
    }
  }, [fetchCustomer]);

  

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? <div>Đang tải trạng thái người dùng...</div> : children}
    </AuthContext.Provider>
  );
};