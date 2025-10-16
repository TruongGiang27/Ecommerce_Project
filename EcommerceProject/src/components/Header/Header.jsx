// src/components/Header/Header.jsx

import { NavLink } from "react-router-dom";
import "../Header/header.css";
import "../../theme/theme.css";
import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { FaUserCircle, FaShoppingCart, FaSearch } from "react-icons/fa";
import Logo from "../../assets/images/DigitexLogoWhite.png";
import { menuCategories } from "../Category/Category";
// ✅ Đảm bảo import useAuth
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => setShowMenu(!showMenu);

  // ✅ Lấy trạng thái xác thực và thông tin khách hàng
  const { isAuthenticated, customer, logout } = useAuth();

  // Hàm tạo tên hiển thị ngắn gọn
  const getCustomerDisplayName = () => {
    if (!customer) return "Khách hàng";
    return customer.first_name || customer.email.split("@")[0];
  };

  return (
    <header className="header">
      {/* 1. Menu Danh mục */}
      <div className="action-menu">
        <button onClick={toggleMenu} className="menu-button">
          <FiMenu className="icon" />
          <span className="text-menu-button"> Danh mục sản phẩm</span>
        </button>
        {showMenu && (
          <div className="dropdown-menu">
            {menuCategories.map((category, index) => (
              <div key={index} className="menu-category">
                <div className="category-title">
                  <span className="category-icon">{category.icon}</span>
                  {category.title}
                </div>
                <div className="subcategory-list">
                  {category.subcategories.map((sub, subIndex) => (
                    <NavLink
                      key={subIndex}
                      to={sub.path}
                      className="menu-item"
                      onClick={() => setShowMenu(false)}
                    >
                      {sub.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Logo */}
      <NavLink to="/">
        <h1 className="logo">
          <img src={Logo} alt="Logo Website" />
        </h1>
      </NavLink>

      {/* 3. Thanh Tìm kiếm */}
      <div className="search-bar">
        <input
          type="text"
          id="search"
          name="search"
          placeholder="Tìm kiếm..."
          className="search-input"
          aria-label="Search"
        />
        <button className="search-button">
          <FaSearch className="icon" />
        </button>
      </div>

      {/* 4. Menu Điều hướng chính */}
      <nav>
        {/* ... Các liên kết chung */}
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Giới thiệu
        </NavLink>
        <NavLink
          to="/policy"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Chính sách
        </NavLink>
        <NavLink
          to="/products"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Sản phẩm
        </NavLink>
        <NavLink
          to="/faqs"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          FAQs
        </NavLink>

        {/* 5. Giỏ hàng */}
        <NavLink
          to="/cart"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <FaShoppingCart className="icon" />
        </NavLink>

        {/* 6. Trạng thái Đăng nhập/Đăng ký */}
        {isAuthenticated ? (
          <>
            {/* Nếu đã đăng nhập: Hiển thị tên và nút Đăng xuất */}
            {/* Thêm link đến trang /account để quản lý hồ sơ */}
            <NavLink
              to="/profile" // 💡 Giả sử trang quản lý hồ sơ là /account
              className={({ isActive }) =>
                isActive
                  ? "nav-link nav-link-account active"
                  : "nav-link nav-link-account"
              }
            >
              <FaUserCircle className="icon" style={{ marginRight: "5px" }} />
              {getCustomerDisplayName()}
            </NavLink>

            {/* Nút Đăng xuất */}
            <button
              onClick={logout}
              className="nav-link logout-button"
              title="Đăng xuất"
            >
              Đăng xuất
            </button>
          </>
        ) : (
          /* Nếu chưa đăng nhập: Hiển thị link Đăng nhập/Đăng ký */
          <NavLink
            to="/login" // 💡 Chuyển hướng đến trang Đăng nhập thay vì Đăng ký (Register)
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            title="Đăng nhập / Đăng ký"
          >
            <FaUserCircle className="icon" />
          </NavLink>
        )}
      </nav>
    </header>
  );
}
