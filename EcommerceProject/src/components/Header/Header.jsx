import { NavLink } from "react-router-dom";
import "../Header/header.css";
import "../../theme/theme.css";
import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { FaUserCircle, FaShoppingCart, FaSearch } from "react-icons/fa";
import Logo from "../../assets/images/DigitexLogoWhite.png";
import { menuCategories } from "../Category/Category";
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
      <NavLink to="/">
        <h1 className="logo">
          <img src={Logo} alt="Logo Website" />
        </h1>
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

        {/* FAQs Link */}
        <NavLink
          to="/faqs"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          FAQs
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
