// src/pages/Register/Register.jsx (Đã chỉnh sửa)

import React, { useState } from "react";
import { apiAuthClient, apiStoreClient } from "../../lib/medusa";
import { useAuth } from "../../context/AuthContext"; // ✅ Dùng Context
import { useNavigate } from "react-router-dom";
// import { registerCustomer } from "../../services/api"; // ⚠️ Không dùng, nên loại bỏ nếu không cần thiết

function CustomerRegistrationForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // ✅ Dùng context Auth để cập nhật trạng thái đăng nhập
  const { setAuthToken, fetchCustomer } = useAuth();
  const navigate = useNavigate();

  // Hàm tiện ích cục bộ (không phải hàm tiện ích toàn cục bị dư thừa)
  const getAuthHeaders = (token) => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    const { email, password, first_name, last_name } = formData;
    const customerForm = { first_name, last_name, email };

    // Kiểm tra cơ bản
    if (!email || !password || password.length < 8) {
      setMessage("Vui lòng điền đầy đủ email và mật khẩu (tối thiểu 8 ký tự).");
      setIsError(true);
      return;
    }

    try {
      // 1. ĐĂNG KÝ (AUTH SERVICE)
      const authRegisterResponse = await apiAuthClient.post(
        "/customer/emailpass/register",
        { email, password }
      );
      const registerToken = authRegisterResponse.data.token;

      // ✅ Lưu token đăng ký TẠM THỜI (để xác thực bước Tạo Customer)
      setAuthToken(registerToken);

      // 2. TẠO CUSTOMER RECORD (STORE API)
      const headers = getAuthHeaders(registerToken);

      const storeCustomerResponse = await apiStoreClient.post(
        "/customers",
        customerForm,
        { headers }
      );
      const createdCustomer = storeCustomerResponse.data.customer;

      // 3. ĐĂNG NHẬP (AUTH SERVICE) để lấy token phiên làm việc chính thức
      const authLoginResponse = await apiAuthClient.post(
        "/customer/emailpass",
        { email, password }
      );
      const loginToken = authLoginResponse.data.token;

      // ✅ Lưu token đăng nhập chính thức và Cập nhật Context
      setAuthToken(loginToken);
      await fetchCustomer(loginToken);

      setMessage(
        `Đăng ký và đăng nhập thành công cho: ${createdCustomer.email}`
      );
      setIsError(false);

      // ✅ Chuyển hướng về trang chủ sau 1 giây
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Registration Error:", error);

      // Nếu đăng ký lỗi, đảm bảo xóa token (nếu có)
      setAuthToken(null);

      const errorMessage =
        error.response?.data?.message ||
        "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin và kết nối.";

      setMessage(`Lỗi: ${errorMessage}`);
      setIsError(true);
    }
  };

  return (
    // ... (Giữ nguyên Form JSX)
    <form onSubmit={handleSubmit}>
      <h2>Đăng ký Khách hàng (Medusa V2 Flow)</h2>
      {/* Input fields */}
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        placeholder="Email"
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
        placeholder="Mật khẩu"
      />
      <input
        type="text"
        name="first_name"
        value={formData.first_name}
        onChange={handleChange}
        required
        placeholder="Tên"
      />
      <input
        type="text"
        name="last_name"
        value={formData.last_name}
        onChange={handleChange}
        required
        placeholder="Họ"
      />

      <button type="submit">Đăng ký và Đăng nhập</button>

      {message && (
        <p style={{ color: isError ? "red" : "green", marginTop: "10px" }}>
          {message}
        </p>
      )}
    </form>
  );
}

export default CustomerRegistrationForm;
