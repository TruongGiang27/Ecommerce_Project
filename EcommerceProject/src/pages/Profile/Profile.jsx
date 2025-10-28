// import React, { useEffect } from "react";
// import { useAuth } from "../../context/AuthContext";
// import "./profile.css";

// export default function Profile() {
//   const { customer, isLoading, fetchCustomer, isAuthenticated } = useAuth();

//   // Nếu cần refresh dữ liệu (ví dụ token tồn tại nhưng customer chưa có), có thể gọi fetchCustomer
//   useEffect(() => {
//     if (!customer && isAuthenticated) {
//       fetchCustomer();
//     }
//   }, [customer, isAuthenticated, fetchCustomer]);

//   if (isLoading) {
//     return <div className="profile-empty">Đang tải thông tin người dùng...</div>;
//   }

//   if (!customer) {
//     return (
//       <div className="profile-empty">
//         <h2>Hồ Sơ Người Dùng</h2>
//         <p>Không có thông tin hồ sơ. Vui lòng đăng nhập.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="profile-page">
//       <div className="profile-card">
//         <aside className="profile-aside">
//           <div className="avatar">
//             {customer.first_name?.[0]?.toUpperCase() || "U"}
//           </div>
//           <div>
//             <div className="label muted">Tài khoản</div>
//             <div className="value">
//               {customer.first_name} {customer.last_name}
//             </div>
//           </div>
//         </aside>

//         <main className="profile-main">
//           <h2>Hồ Sơ Người Dùng</h2>
//           <ul className="info-list">
//             <li className="info-item">
//               <div className="label">Email</div>
//               <div className="value">{customer.email}</div>
//             </li>
//             <li className="info-item">
//               <div className="label">Số điện thoại</div>
//               <div className="value">{customer.phone || "Chưa cập nhật"}</div>
//             </li>
//             <li className="info-item address" style={{ gridColumn: "1 / -1" }}>
//               <div className="label">Địa chỉ</div>
//               <div className="value">
//                 {customer.addresses && customer.addresses.length > 0
//                   ? `${customer.addresses[0].address_1 || ""} ${customer.addresses[0].city || ""}`.trim()
//                   : "Chưa cập nhật"}
//               </div>
//             </li>
//           </ul>
//         </main>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiCustomerClient } from "../../lib/medusa";
import "./profile.css";

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

  useEffect(() => {
    if (!customer && isAuthenticated) {
      fetchCustomer();
    } else if (customer) {
      setFormData({
        first_name: customer.first_name || "",
        last_name: customer.last_name || "",
        company_name: customer.company_name || "",
        phone: customer.phone || "",
      });
    }
  }, [customer, isAuthenticated, fetchCustomer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    setSaving(true);
    try {
      const token = localStorage.getItem("medusa_auth_token");

      const { data } = await apiCustomerClient.post(
        "/customers/me",
        {
          first_name: formData.first_name,
          last_name: formData.last_name,
          company_name: formData.company_name,
          phone: formData.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data?.customer) {
        await fetchCustomer(token); // cập nhật context
        setIsEditing(false);
      }
    } catch (error) {
      console.error("❌ Lỗi cập nhật hồ sơ:", error.response?.data || error);
      alert("Cập nhật thất bại. Vui lòng thử lại!");
    } finally {
      setSaving(false);
    }
  };

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

          {!isEditing ? (
            <>
              <ul className="info-list">
                <li className="info-item">
                  <div className="label">Email</div>
                  <div className="value">{customer.email}</div>
                </li>
                <li className="info-item">
                  <div className="label">Số điện thoại</div>
                  <div className="value">{customer.phone || "Chưa cập nhật"}</div>
                </li>
                <li className="info-item">
                  <div className="label">Công ty</div>
                  <div className="value">{customer.company_name || "Chưa cập nhật"}</div>
                </li>
                <li className="info-item address" style={{ gridColumn: "1 / -1" }}>
                  <div className="label">Địa chỉ</div>
                  <div className="value">
                    {customer.addresses?.length > 0
                      ? `${customer.addresses[0].address_1 || ""} ${customer.addresses[0].city || ""}`.trim()
                      : "Chưa cập nhật"}
                  </div>
                </li>
              </ul>
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                Chỉnh sửa
              </button>
            </>
          ) : (
            <form className="edit-form" onSubmit={handleSave}>
              <div className="form-group">
                <label>Họ</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Tên</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Công ty</label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="btn-group">
                <button type="button" onClick={() => setIsEditing(false)} disabled={saving}>
                  Hủy
                </button>
                <button type="submit" disabled={saving}>
                  {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}
