import React, { useState } from "react";
import { resetPasswordAPI } from "../../lib/medusa";
import { useNavigate } from "react-router-dom";
import "./forgotPassword.css"; 

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return alert("Vui lòng nhập email");

    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      await resetPasswordAPI.requestReset(email);
      setMessage("Nếu tài khoản tồn tại, email hướng dẫn đặt lại mật khẩu đã được gửi.");
      setIsError(false);
    } catch (err) {
      setMessage(err.response?.data?.message || "Có lỗi xảy ra khi gửi yêu cầu.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Quên mật khẩu</h2>
        <p style={{ textAlign: "center", marginBottom: "20px", color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
          Nhập email đăng ký để nhận liên kết đặt lại mật khẩu.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="ví dụ: user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Đang xử lý..." : "Gửi yêu cầu"}
          </button>
        </form>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button 
            type="button" 
            className="link-btn" 
            onClick={() => navigate("/login")}
          >
            ← Quay lại đăng nhập
          </button>
        </div>

        {message && (
          <div className={`message-box ${isError ? "message-error" : "message-success"}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}