// src/pages/Profile/Profile.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
// 1️⃣ Import thêm apiAuthClient
import { apiCustomerClient, apiAuthClient } from "../../lib/medusa"; 
import { toast } from "react-toastify"; // Sử dụng toast thay cho alert
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // Icon mắt
import "./profile.css";

const AUTH_TOKEN_KEY = "medusa_auth_token";

export default function Profile() {
  const { customer, isLoading, isAuthenticated, fetchCustomer } = useAuth();

  // State quản lý chế độ hiển thị: 'view' | 'edit_profile' | 'change_password'
  const [mode, setMode] = useState("view"); 
  
  // State form sửa thông tin
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    company_name: "",
    phone: "",
  });

  // State form đổi mật khẩu
  const [passData, setPassData] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [showPass, setShowPass] = useState(false); // Ẩn/hiện mật khẩu

  const [saving, setSaving] = useState(false);

  // Helper lấy token
  const getToken = () => {
    return localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
  };

  useEffect(() => {
    if (!customer && isAuthenticated) {
      const token = getToken();
      if(token) fetchCustomer(token);
    } else if (customer) {
      // Reset form data khi có customer
      setFormData({
        first_name: customer.first_name || "",
        last_name: customer.last_name || "",
        company_name: customer.metadata?.company || "",
        phone: customer.phone || "",
      });
    }
  }, [customer, isAuthenticated, fetchCustomer]);

  // Handle change cho profile
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle change cho password
  const handlePassChange = (e) => {
    const { name, value } = e.target;
    setPassData((prev) => ({ ...prev, [name]: value }));
  };

  // 1️⃣ Xử lý Lưu Hồ Sơ
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return toast.warning("Phiên đăng nhập hết hạn.");

    setSaving(true);
    try {
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        metadata: { company: formData.company_name }
      };

      const { data } = await apiCustomerClient.post("/customers/me", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data?.customer) {
        await fetchCustomer(token);
        setMode("view");
        toast.success("Cập nhật hồ sơ thành công!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi cập nhật hồ sơ");
    } finally {
      setSaving(false);
    }
  };

  // 2️⃣ Xử lý Đổi Mật Khẩu
  const handleChangePassword = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return toast.warning("Phiên đăng nhập hết hạn.");

    // Validation
    if (passData.newPassword.length < 8) {
      return toast.error("Mật khẩu phải có ít nhất 8 ký tự.");
    }
    if (passData.newPassword !== passData.confirmPassword) {
      return toast.error("Mật khẩu xác nhận không khớp.");
    }

    setSaving(true);
    try {
      // Gọi Auth API để update password
      await apiAuthClient.post(
        "/customer/emailpass/update",
        {
          identifier: customer.email, // Cần email để định danh
          password: passData.newPassword
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success("Đổi mật khẩu thành công!");
      setMode("view");
      setPassData({ newPassword: "", confirmPassword: "" }); // Reset form
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Đổi mật khẩu thất bại.");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <div className="profile-loading">Đang tải thông tin...</div>;
  if (!customer) return <div className="profile-empty">Vui lòng đăng nhập.</div>;

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <div className="profile-avatar">
            {customer.first_name?.[0]?.toUpperCase() || customer.email?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="profile-sidebar-info">
            <div className="profile-name">{customer.first_name} {customer.last_name}</div>
            <div className="profile-email">{customer.email}</div>
          </div>
          
          {/* Menu điều hướng nhỏ ở sidebar */}
          <div className="sidebar-menu">
            <button 
              className={`menu-btn ${mode === 'view' || mode === 'edit_profile' ? 'active' : ''}`}
              onClick={() => setMode("view")}
            >
              Thông tin chung
            </button>
            <button 
              className={`menu-btn ${mode === 'change_password' ? 'active' : ''}`}
              onClick={() => setMode("change_password")}
            >
              Đổi mật khẩu
            </button>
          </div>
        </aside>

        {/* Content */}
        <main className="profile-content">
          
          {/* --- VIEW MODE --- */}
          {mode === "view" && (
            <>
              <div className="profile-header">
                <h2>Hồ Sơ Của Tôi</h2>
                <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
              </div>
              <div className="profile-view">
                <div className="info-row"><span className="info-label">Họ tên:</span><span className="info-value">{customer.first_name} {customer.last_name}</span></div>
                <div className="info-row"><span className="info-label">Email:</span><span className="info-value">{customer.email}</span></div>
                <div className="info-row"><span className="info-label">SĐT:</span><span className="info-value">{customer.phone || "---"}</span></div>
                <div className="info-row"><span className="info-label">Công ty:</span><span className="info-value">{customer.metadata?.company || "---"}</span></div>
                
                <div className="profile-actions">
                  <button className="btn-edit" onClick={() => setMode("edit_profile")}>Chỉnh Sửa Thông Tin</button>
                </div>
              </div>
            </>
          )}

          {/* --- EDIT PROFILE MODE --- */}
          {mode === "edit_profile" && (
            <>
              <div className="profile-header">
                <h2>Chỉnh Sửa Hồ Sơ</h2>
              </div>
              <form className="profile-form" onSubmit={handleSaveProfile}>
                <div className="form-group-row">
                  <div className="form-group">
                    <label>Họ</label>
                    <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Tên</label>
                    <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Công ty</label>
                  <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={() => setMode("view")} disabled={saving}>Hủy</button>
                  <button type="submit" className="btn-save" disabled={saving}>{saving ? "Đang Lưu..." : "Lưu Thay Đổi"}</button>
                </div>
              </form>
            </>
          )}

          {/* --- CHANGE PASSWORD MODE --- */}
          {mode === "change_password" && (
            <>
              <div className="profile-header">
                <h2>Đổi Mật Khẩu</h2>
                <p>Vui lòng nhập mật khẩu mới</p>
              </div>
              <form className="profile-form" onSubmit={handleChangePassword}>
                <div className="form-group">
                  <label>Mật khẩu mới</label>
                  <div className="password-wrapper">
                    <input 
                      type={showPass ? "text" : "password"} 
                      name="newPassword" 
                      value={passData.newPassword} 
                      onChange={handlePassChange} 
                      placeholder="Tối thiểu 8 ký tự"
                    />
                    <button type="button" className="eye-icon" onClick={() => setShowPass(!showPass)}>
                      {showPass ? <AiOutlineEyeInvisible size={20}/> : <AiOutlineEye size={20}/>}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Xác nhận mật khẩu</label>
                  <div className="password-wrapper">
                    <input 
                      type={showPass ? "text" : "password"} 
                      name="confirmPassword" 
                      value={passData.confirmPassword} 
                      onChange={handlePassChange} 
                      placeholder="Nhập lại mật khẩu mới"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={() => setMode("view")} disabled={saving}>Hủy</button>
                  <button type="submit" className="btn-save" disabled={saving}>{saving ? "Đang Xử Lý..." : "Xác Nhận Đổi"}</button>
                </div>
              </form>
            </>
          )}

        </main>
      </div>
    </div>
  );
}