import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "./profile.css";

export default function Profile() {
  const { customer, isLoading, fetchCustomer, isAuthenticated } = useAuth();

  // Nếu cần refresh dữ liệu (ví dụ token tồn tại nhưng customer chưa có), có thể gọi fetchCustomer
  useEffect(() => {
    if (!customer && isAuthenticated) {
      fetchCustomer();
    }
  }, [customer, isAuthenticated, fetchCustomer]);

  if (isLoading) {
    return <div className="profile-empty">Đang tải thông tin người dùng...</div>;
  }

  if (!customer) {
    return (
      <div className="profile-empty">
        <h2>Hồ Sơ Người Dùng</h2>
        <p>Không có thông tin hồ sơ. Vui lòng đăng nhập.</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <aside className="profile-aside">
          <div className="avatar">
            {customer.first_name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <div className="label muted">Tài khoản</div>
            <div className="value">
              {customer.first_name} {customer.last_name}
            </div>
          </div>
        </aside>

        <main className="profile-main">
          <h2>Hồ Sơ Người Dùng</h2>
          <ul className="info-list">
            <li className="info-item">
              <div className="label">Email</div>
              <div className="value">{customer.email}</div>
            </li>
            <li className="info-item">
              <div className="label">Số điện thoại</div>
              <div className="value">{customer.phone || "Chưa cập nhật"}</div>
            </li>
            <li className="info-item address" style={{ gridColumn: "1 / -1" }}>
              <div className="label">Địa chỉ</div>
              <div className="value">
                {customer.addresses && customer.addresses.length > 0
                  ? `${customer.addresses[0].address_1 || ""} ${customer.addresses[0].city || ""}`.trim()
                  : "Chưa cập nhật"}
              </div>
            </li>
          </ul>
        </main>
      </div>
    </div>
  );
}