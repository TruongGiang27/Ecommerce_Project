// src/components/Header/Header.jsx

import { NavLink, useLocation } from "react-router-dom";
import "../Header/header.css";
import "../../theme/theme.css";
import React, { useState, useEffect, useRef } from "react";
import { FiMenu } from "react-icons/fi";
import { FaUserCircle, FaShoppingCart, FaSearch } from "react-icons/fa";
import { useCart } from "../../context/CartContext"; // ✅ import context
import Logo from "../../assets/images/DigitexLogoWhite.png";
// import { menuCategories } from "../Category/Category";
// ✅ Đảm bảo import useAuth
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => setShowMenu(!showMenu);

  const location = useLocation();
  // Đóng dropdown khi route thay đổi (ví dụ sau khi click NavLink)
  useEffect(() => {
    setShowMenu(false);
  }, [location]);

  // ✅ Lấy trạng thái xác thực và thông tin khách hàng
  const { isAuthenticated, customer, logout } = useAuth();

  const { cart } = useCart();
  const cartCount = cart.length;

  const [open, setOpen] = useState(false);
  const items = [
    { name: "Thông tin", link: "/profile" },
    { name: "Lịch sử đơn hàng", link: "/orders-history" },
    { name: "Lịch sử giao dịch", link: "/transaction-history" },
  ];
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header">
      {/* 1. Menu Danh mục */}
      <div className="action-menu">
        <button onClick={toggleMenu} className="menu-button" aria-expanded={showMenu} aria-controls="category-menu">
          <FiMenu className="icon" />
        </button>
        {showMenu && (
          <div id="category-menu" className="dropdown-menu" role="menu">
            <NavLink to="/products?category=Làm Việc" className="menu-item" onClick={() => setShowMenu(false)}>
              Làm Việc
            </NavLink>
            <NavLink to="/products?category=Giải Trí" className="menu-item" onClick={() => setShowMenu(false)}>
              Giải Trí
            </NavLink>
            <NavLink to="/products?category=Học Tập" className="menu-item" onClick={() => setShowMenu(false)}>
              Học Tập
            </NavLink>
            <NavLink to="/products?category=Tiện Ích" className="menu-item" onClick={() => setShowMenu(false)}>
              Tiện Ích
            </NavLink>
            <NavLink to="/products?category=Windows" className="menu-item" onClick={() => setShowMenu(false)}>
              Windows
            </NavLink>
            <NavLink to="/products?category=Microsoft" className="menu-item" onClick={() => setShowMenu(false)}>
              Microsoft
            </NavLink>
            <NavLink to="/products?category=Diệt Virus" className="menu-item" onClick={() => setShowMenu(false)}>
              Diệt Virus
            </NavLink>
            <NavLink to="/products?category=VPN" className="menu-item" onClick={() => setShowMenu(false)}>
              VPN
            </NavLink>
          </div>
        )}
      </div>

      {/* 2. Logo */}
      <NavLink to="/">
        <div className="logo">
          <img src={Logo} alt="Logo Website" />
        </div>
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
        {/* ✅ Giỏ hàng có badge */}
        <NavLink
          to="/cart"
          className={({ isActive }) =>
            isActive ? "nav-link active cart-link" : "nav-link cart-link"
          }
        >
          <FaShoppingCart className="icon" />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </NavLink>

        {/* 6. Trạng thái Đăng nhập/Đăng ký */}
        {isAuthenticated ? (
          <>
            <button
              className="user-button"
              onClick={() => setOpen(!open)}
              aria-label="Tài khoản"
            >
              <FaUserCircle className="user-icon" />
            </button>

            {open && (
              <div className="user-dropdown" ref={menuRef}>
                {items.map((item) => (
                  <NavLink
                    key={item.link}
                    to={item.link}
                    className="dropdown-item"
                    onClick={() => setOpen(false)}
                  >
                    {item.name}
                  </NavLink>
                ))}
                <button className="dropdown-item logout" onClick={logout}>
                  Đăng xuất
                </button>
              </div>
            )}
          </>
        ) : (
          /* Nếu chưa đăng nhập: Hiển thị link Đăng nhập/Đăng ký */
          <NavLink
            to="/login"
            className="user-button"
            title="Đăng nhập / Đăng ký"
          >
            <FaUserCircle className="user-icon" />
          </NavLink>
        )}
      </nav>
    </header>
  );
}
