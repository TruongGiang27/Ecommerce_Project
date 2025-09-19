import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: xử lý login
  };

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
  );
}
