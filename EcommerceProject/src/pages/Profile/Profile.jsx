// src/pages/Profile/Profile.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiCustomerClient } from "../../lib/medusa";
import "./profile.css";

const AUTH_TOKEN_KEY = "medusa_auth_token";

export default function Profile() {
  const { customer, isLoading, isAuthenticated, fetchCustomer } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    company_name: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);

  // Load dữ liệu khi customer thay đổi
  useEffect(() => {
    if (!customer && isAuthenticated) {
      // Nếu chưa có customer data thì fetch lại (dùng token từ context logic)
      const token = localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
      if(token) fetchCustomer(token);
    } else if (customer) {
      setFormData({
        first_name: customer.first_name || "",
        last_name: customer.last_name || "",
        // Lấy company từ metadata (nơi lưu trữ tùy chỉnh của Medusa)
        company_name: customer.metadata?.company || "",
        phone: customer.phone || "",
      });
    }
  }, [customer, isAuthenticated, fetchCustomer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ HÀM QUAN TRỌNG: Lấy token từ cả 2 nơi (Session hoặc Local)
  const getToken = () => {
    return localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    // Kiểm tra đăng nhập
    const token = getToken();
    if (!token) {
      alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      return;
    }

    setSaving(true);
    try {
      // Chuẩn bị payload chuẩn cho Medusa
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        metadata: {
          // Lưu thông tin công ty vào metadata để không bị mất
          company: formData.company_name 
        }
      };

      // Gọi API cập nhật
      const { data } = await apiCustomerClient.post(
        "/customers/me",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token xác thực
          },
        }
      );

      if (data?.customer) {
        await fetchCustomer(token); // Cập nhật lại dữ liệu mới nhất vào Context
        setIsEditing(false);
        alert("Cập nhật hồ sơ thành công!");
      }
    } catch (error) {
      console.error("❌ Lỗi cập nhật hồ sơ:", error.response?.data || error);
      alert("Cập nhật thất bại. Vui lòng kiểm tra lại kết nối.");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return <div className="profile-loading">Đang tải thông tin...</div>;
  }

  if (!customer) {
    return (
      <div className="profile-empty">
        <h2>Bạn chưa đăng nhập</h2>
        <p>Vui lòng đăng nhập để xem hồ sơ cá nhân.</p>
      </div>
    );
  }

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        {/* Sidebar bên trái */}
        <aside className="profile-sidebar">
          <div className="profile-avatar">
            {customer.first_name?.[0]?.toUpperCase() || customer.email?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="profile-sidebar-info">
            <div className="profile-name">
              {customer.first_name} {customer.last_name}
            </div>
            <div className="profile-email">{customer.email}</div>
          </div>
        </aside>

        {/* Nội dung chính bên phải */}
        <main className="profile-content">
          <div className="profile-header">
            <h2>Hồ Sơ Của Tôi</h2>
            <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
          </div>

          {!isEditing ? (
            /* CHẾ ĐỘ XEM */
            <div className="profile-view">
              <div className="info-row">
                <span className="info-label">Họ tên:</span>
                <span className="info-value">
                  {customer.first_name} {customer.last_name}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{customer.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Số điện thoại:</span>
                <span className="info-value">{customer.phone || "Chưa cập nhật"}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Công ty:</span>
                <span className="info-value">
                  {customer.metadata?.company || "Chưa cập nhật"}
                </span>
              </div>
              
              <div className="profile-actions">
                <button className="btn-edit" onClick={() => setIsEditing(true)}>
                  Chỉnh Sửa Thông Tin
                </button>
              </div>
            </div>
          ) : (
            /* CHẾ ĐỘ CHỈNH SỬA */
            <form className="profile-form" onSubmit={handleSave}>
              <div className="form-group-row">
                <div className="form-group">
                  <label>Họ</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Nhập họ"
                  />
                </div>
                <div className="form-group">
                  <label>Tên</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Nhập tên"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Công ty</label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  placeholder="Tên công ty / Tổ chức"
                />
              </div>

              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-cancel" 
                  onClick={() => setIsEditing(false)} 
                  disabled={saving}
                >
                  Hủy
                </button>
                <button type="submit" className="btn-save" disabled={saving}>
                  {saving ? "Đang Lưu..." : "Lưu Thay Đổi"}
                </button>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}