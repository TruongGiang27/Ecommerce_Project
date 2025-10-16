// src/context/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
// ✅ Import apiAuthClient cho việc login và apiCustomerClient cho việc fetch customer
import { apiAuthClient, apiCustomerClient } from "../lib/medusa";

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

  const value = {
    isAuthenticated,
    customer,
    isLoading,
    login,
    logout,
    setAuthToken,
    fetchCustomer,
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
