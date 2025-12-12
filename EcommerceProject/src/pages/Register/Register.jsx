// src/pages/Register/Register.jsx
import React, { useState } from "react";
import { apiAuthClient, apiStoreClient } from "../../lib/medusa";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function CustomerRegistrationForm() {
  const [formData, setFormData] = useState({
    email: "", password: "", first_name: "", last_name: "", phone: "", company: "",
  });
  
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setAuthToken, fetchCustomer } = useAuth();
  const navigate = useNavigate();

  const getAuthHeaders = (token) => ({ Authorization: `Bearer ${token}` });
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); setIsError(false); setLoading(true);

    const { email, password, first_name, last_name, phone, company } = formData;

    if (!email || !password || !first_name || !last_name || !phone) {
      setMessage("Vui lòng điền các trường có dấu (*)");
      setIsError(true); setLoading(false); return;
    }
    if (password.length < 8) {
      setMessage("Mật khẩu phải có ít nhất 8 ký tự.");
      setIsError(true); setLoading(false); return;
    }

    try {
      // 1. Register Auth
      const authRes = await apiAuthClient.post("/customer/emailpass/register", { email, password });
      const tempToken = authRes.data.token;
      setAuthToken(tempToken);

      // 2. Create Profile
      await apiStoreClient.post("/customers", {
        first_name, last_name, email, phone, metadata: { company: company || "" }
      }, { headers: getAuthHeaders(tempToken) });

      // 3. Re-login
      const loginRes = await apiAuthClient.post("/customer/emailpass", { email, password });
      const sessionToken = loginRes.data.token;
      setAuthToken(sessionToken);
      await fetchCustomer(sessionToken);

      setMessage("Đăng ký thành công! Đang chuyển hướng...");
      setIsError(false);
      setTimeout(() => navigate("/"), 1500);

    } catch (error) {
      console.error(error);
      setAuthToken(null);
      setMessage(error.response?.data?.message || "Đăng ký thất bại. Email có thể đã tồn tại.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card register-card"> {/* Thêm class register-card */}
        <div className="auth-header">
          <h2>Tạo Tài Khoản Mới</h2>
          <p className="auth-subtitle">Nhập thông tin chi tiết của bạn</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Sửa lại chỗ này: Bỏ style inline grid */}
          <div className="form-row">
            <div className="form-group">
              <label>Họ <span className="req">*</span></label>
              <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required placeholder="Nguyễn" />
            </div>
            <div className="form-group">
              <label>Tên <span className="req">*</span></label>
              <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required placeholder="Văn A" />
            </div>
          </div>

          <div className="form-group">
            <label>Email <span className="req">*</span></label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="email@domain.com" />
          </div>

          <div className="form-group">
            <label>Mật khẩu <span className="req">*</span></label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Tối thiểu 8 ký tự" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>SĐT <span className="req">*</span></label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="0912345678" />
            </div>
            <div className="form-group">
              <label>Công ty</label>
              <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Không bắt buộc" />
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Đang xử lý..." : "Đăng Ký Tài Khoản"}
          </button>
        </form>

        {message && (
          <div className={`message-box ${isError ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="auth-footer">
          <span>Đã có tài khoản? </span>
          <button type="button" className="link-btn highlight" onClick={() => navigate("/login")}>
            Đăng nhập ngay
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomerRegistrationForm;