import React from "react";

export default function Register() {
  return (
    <div className="container">
      <h2>Đăng ký</h2>
      <form className="form">
        <input type="text" placeholder="Họ & Tên" />
        <input type="text" placeholder="Email" />
        <input type="password" placeholder="Mật khẩu" />
        <input type="password" placeholder="Xác nhận mật khẩu" />
        <button type="submit" className="btn">
          Đăng ký
        </button>
      </form>
    </div>
  );
}
