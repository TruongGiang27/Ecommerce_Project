// src/pages/ResetPassword.jsx
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { resetPasswordAPI } from "../../lib/medusa";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const email = params.get("email");

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    try {
      const res = await resetPasswordAPI.updatePassword(email, password, token);
      if (res.data.success) {
        setMessage("✅ Mật khẩu đã được cập nhật thành công!");
      } else {
        setMessage("❌ Có lỗi xảy ra, vui lòng thử lại.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Token không hợp lệ hoặc đã hết hạn.");
    }
  };

  return (
    <div>
      <h2>Đặt lại mật khẩu</h2>
      <input
        type="password"
        placeholder="Mật khẩu mới"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleReset}>Xác nhận</button>
      <p>{message}</p>
    </div>
  );
}
