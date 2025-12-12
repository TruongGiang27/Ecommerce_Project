// src/pages/Login/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineGoogle } from "react-icons/ai";
import "./Login.css";

function CustomerLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // 🔹 State cho chức năng ghi nhớ đăng nhập
  const [rememberMe, setRememberMe] = useState(false);
  
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const { login, isAuthenticated, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

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

    // 🔹 Gọi hàm login với tham số rememberMe
    const result = await login(email, password, rememberMe);

    if (result.success) {
      setMessage(`Đăng nhập thành công!`);
      setIsError(false);
    } else {
      setMessage(`Lỗi: ${result.error}`);
      setIsError(true);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Đăng Nhập</h2>
          <p className="auth-subtitle">Chào mừng bạn quay trở lại!</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>
          </div>
          
          <div className="form-options">
            <label className="checkbox-container">
              {/* 🔹 Input checkbox liên kết với state rememberMe */}
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              /> 
              Ghi nhớ mật khẩu
            </label>
            <button type="button" className="link-btn forgot-btn" onClick={() => navigate("/forgot-password")}>
              Quên mật khẩu?
            </button>
          </div>

          <button type="submit" className="btn-submit">
            Đăng nhập
          </button>
        </form>

        {message && (
          <div className={`message-box ${isError ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        {/* <div className="social-login">
          <div className="divider"><span>Hoặc</span></div>
          <div className="social-buttons">
            <button onClick={() => loginWithGoogle()} className="social-btn google">
               <AiOutlineGoogle size={20} style={{marginRight: 8}}/> Đăng nhập với Google
            </button>
          </div>
        </div> */}

        <div className="auth-footer">
          <span>Bạn chưa có tài khoản? </span>
          <button type="button" className="link-btn highlight" onClick={() => navigate("/register")}>
            Đăng ký ngay
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomerLoginForm;