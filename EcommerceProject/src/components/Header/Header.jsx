import { NavLink } from "react-router-dom";
import "../Header/header.css";
import "../../theme/theme.css";
import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { FaUserCircle, FaShoppingCart, FaSearch } from "react-icons/fa";

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => setShowMenu(!showMenu);

  return (
    <header className="header">
      <div className="action-menu">
        <button onClick={toggleMenu} className="menu-button">
          <FiMenu className="icon" />
          <span className="text-menu-button"> Danh mục sản phẩm</span>
        </button>
        {showMenu && (
          <div className="dropdown-menu">
            <NavLink to="/products?category=Thiết kế" className="menu-item">
              Thiết kế
            </NavLink>
            <NavLink to="/products?category=Văn phòng" className="menu-item">
              Văn phòng
            </NavLink>
            <NavLink to="/products?category=Lập trình" className="menu-item">
              Lập trình
            </NavLink>
          </div>
        )}
      </div>
      <NavLink to="/">
        <h1 className="logo">Shop</h1>
      </NavLink>

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
      <nav>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Giới thiệu
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
          to="/cart"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <FaShoppingCart className="icon" />
        </NavLink>

        <NavLink
          to="/register"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <FaUserCircle className="icon" />
        </NavLink>
      </nav>
    </header>
  );
}
