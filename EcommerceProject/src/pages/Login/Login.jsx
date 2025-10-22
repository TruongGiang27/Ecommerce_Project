// src/pages/Login/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

function CustomerLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // ✅ Xử lý việc chuyển hướng sau khi Context cập nhật isAuthenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    if (!email || !password) {
      setMessage("Vui lòng điền đầy đủ email và mật khẩu.");
      setIsError(true);
      return;
    }

    const result = await login(email, password);

    if (result.success) {
      // ✅ Nếu login thành công, useEffect ở trên sẽ tự xử lý chuyển hướng
      setMessage(`Đăng nhập thành công! Đang kiểm tra phiên...`);
      setIsError(false);
    } else {
      // Nếu thất bại (bao gồm cả lỗi fetchCustomer/CORS), hiển thị lỗi
      setMessage(`Lỗi: ${result.error}`);
      setIsError(true);
    }
  };

  const messageStyle = { color: isError ? "red" : "green", marginTop: "10px" };

  // ... (Phần JSX giữ nguyên)
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Đăng Nhập</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-options">
            <label>
              <input type="checkbox" /> Ghi nhớ mật khẩu
            </label>
            <button type="button" className="link-btn" onClick={() => navigate("/register")}>
              Bạn chưa có tài khoản? Đăng ký ngay
            </button>
          </div>
          <button type="submit" className="btn-submit">
            Đăng nhập
          </button>
        </form>
        {message && <div style={messageStyle}>{message}</div>}
        {/* Option login bằng social */}
        <div className="social-login">
          <p>Hoặc đăng nhập bằng</p>
          <div className="social-buttons">
            <button className="social-btn google">Google</button>
            <button className="social-btn facebook">Facebook</button>
          </div>
        </div>
      </div>
    </div>
    // <form onSubmit={handleSubmit}>
    //   <h2>Đăng nhập Khách hàng</h2>
    //   <input
    //     type="email"
    //     value={email}
    //     onChange={(e) => setEmail(e.target.value)}
    //     required
    //     placeholder="Email"
    //   />
    //   <input
    //     type="password"
    //     value={password}
    //     onChange={(e) => setPassword(e.target.value)}
    //     required
    //     placeholder="Mật khẩu"
    //   />

    //   <button type="submit">Đăng nhập</button>

    //   {message && (
    //     <p style={{ color: isError ? "red" : "green", marginTop: "10px" }}>
    //       {message}
    //     </p>
    //   )}
    // </form>
  );
}

export default CustomerLoginForm;
