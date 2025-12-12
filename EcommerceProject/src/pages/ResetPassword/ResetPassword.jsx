// src/pages/ResetPassword/ResetPassword.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { apiAuthClient } from "../../lib/medusa"; // Import client đã config
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import "./resetPassword.css"; 

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  // Lấy token và email từ URL (Medusa gửi về dạng ?token=...&email=...)
  const token = params.get("token");
  const email = params.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Kiểm tra token ngay khi vào trang
  useEffect(() => {
    if (!token) {
      setIsError(true);
      setMessage("Link không hợp lệ hoặc đã hết hạn (Thiếu Token).");
    }
  }, [token]);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    // 1. Validation
    if (!password || !confirmPassword) {
      setIsError(true);
      setMessage("Vui lòng nhập đầy đủ mật khẩu.");
      return;
    }

    if (password !== confirmPassword) {
      setIsError(true);
      setMessage("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (password.length < 8) {
      setIsError(true);
      setMessage("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }

    setLoading(true);

    try {
      // 2. Gọi API cập nhật mật khẩu (Endpoint CHUẨN)
      // POST /auth/customer/emailpass/update
      // Token phải gửi trong Header để xác thực phiên thay đổi mật khẩu
      await apiAuthClient.post(
        "/customer/emailpass/update", 
        { 
          password: password,
          // Một số phiên bản yêu cầu cả identifier, gửi kèm cho chắc chắn
          identifier: email 
        }, 
        {
          headers: {
            Authorization: `Bearer ${token}` // QUAN TRỌNG: Token nằm ở đây
          }
        }
      );

      setMessage("Đổi mật khẩu thành công! Đang chuyển hướng...");
      setIsError(false);
      
      // Chuyển hướng về Login sau 2s
      setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      console.error("Lỗi đổi mật khẩu:", err);
      setIsError(true);
      
      // Xử lý thông báo lỗi chi tiết
      if (err.response) {
        if (err.response.status === 401) {
          setMessage("Token đã hết hạn hoặc không hợp lệ. Vui lòng yêu cầu cấp lại.");
        } else if (err.response.status === 404) {
          setMessage("Sai đường dẫn API (404). Vui lòng kiểm tra backend.");
        } else {
          setMessage(err.response.data?.message || "Có lỗi xảy ra phía máy chủ.");
        }
      } else {
        setMessage("Lỗi kết nối mạng (CORS/Network Error).");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card reset-card">
        <div className="auth-header">
          <h2>Đặt lại mật khẩu</h2>
          <p className="auth-subtitle">Nhập mật khẩu mới cho {email}</p>
        </div>
        
        <form onSubmit={handleReset} className="auth-form">
          {/* Mật khẩu mới */}
          <div className="form-group">
            <label>Mật khẩu mới</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Tối thiểu 8 ký tự"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading || !token}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>
          </div>

          {/* Nhập lại mật khẩu */}
          <div className="form-group">
            <label>Xác nhận mật khẩu</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading || !token}
              />
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={loading || !token}>
            {loading ? "Đang xử lý..." : "Xác nhận đổi mật khẩu"}
          </button>
        </form>

        {message && (
          <div className={`message-box ${isError ? "error" : "success"}`}>
            {message}
          </div>
        )}

        <div className="auth-footer">
          <span className="back-link" onClick={() => navigate("/login")}>
            ← Quay lại đăng nhập
          </span>
        </div>
      </div>
    </div>
  );
}