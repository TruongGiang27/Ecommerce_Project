import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPasswordAPI } from "../../lib/medusa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import "./resetPassword.css"; 

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const email = params.get("email");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if(!password) return;
    
    setLoading(true);
    setMessage("");

    try {
      const res = await resetPasswordAPI.updatePassword(email, password, token);
      if (res.data.success || res.status === 200) {
        setMessage("Mật khẩu đã được cập nhật thành công!");
        setIsError(false);
        // Chuyển hướng về trang login sau 2 giây
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage("Có lỗi xảy ra, vui lòng thử lại.");
        setIsError(true);
      }
    } catch (err) {
      console.error(err);
      setMessage("Token không hợp lệ hoặc đã hết hạn.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Đặt lại mật khẩu</h2>
        
        <form onSubmit={handleReset} className="auth-form">
          <div className="form-group">
            <label>Mật khẩu mới</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu mới"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Đang cập nhật..." : "Xác nhận"}
          </button>
        </form>

        {message && (
          <div className={`message-box ${isError ? "message-error" : "message-success"}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}