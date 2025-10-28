import React, { useState } from "react";
import { resetPasswordAPI } from "../../lib/medusa";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return alert("Vui lòng nhập email");

    setLoading(true);
    try {
      await resetPasswordAPI.requestReset(email);
      setMessage(
        "Nếu tài khoản tồn tại, email hướng dẫn đặt lại mật khẩu đã được gửi."
      );
    } catch (err) {
      setMessage(err.response?.data?.message || "Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password">
      <h2>Quên mật khẩu</h2>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          placeholder="Nhập email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Đang gửi..." : "Gửi yêu cầu"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
