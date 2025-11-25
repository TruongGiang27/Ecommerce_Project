// src/components/Header/Header.jsx

import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "../Header/header.css";
import "../../theme/theme.css";
import React, { useState } from "react";
import { FiMenu, FiLogOut } from "react-icons/fi";
import { FaUserCircle, FaShoppingCart, FaSearch } from "react-icons/fa";
import { useCart } from "../../context/CartContext"; // ✅ import context
import Logo from "../../assets/images/DigitexLogoWhite.png";
// import { menuCategories } from "../Category/Category";
// ✅ Đảm bảo import useAuth
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => setShowMenu(!showMenu);

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

  // --- SEARCH: states ---
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]); // full product list from Medusa
  const [suggestions, setSuggestions] = useState([]);
  const [filteredCount, setFilteredCount] = useState(0); // tổng kết quả matching
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load all products once for client-side filtering (Medusa store endpoint)
  useEffect(() => {
    const regionId = process.env.REACT_APP_MEDUSA_REGION_ID;
    const url = `http://localhost:9000/store/products?limit=1000${regionId ? `&region_id=${regionId}` : ""}`;
    setLoadingProducts(true);
    fetch(url, {
      headers: {
        "x-publishable-api-key": process.env.REACT_APP_MEDUSA_PUBLISHABLE_KEY,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data?.products) ? data.products : [];
        setAllProducts(items);
      })
      .catch((err) => {
        console.error("Không tải được products từ Medusa:", err);
        setAllProducts([]);
      })
      .finally(() => setLoadingProducts(false));
  }, []);

  // Debounced filter suggestions (limit to 5, set filteredCount)
  useEffect(() => {
    const SUGGESTION_LIMIT = 5;
    if (!query.trim()) {
      setSuggestions([]);
      setFilteredCount(0);
      setShowSuggestions(false);
      return;
    }
    setShowSuggestions(true);
    const q = query.trim().toLowerCase();
    const timer = setTimeout(() => {
      const filteredAll = allProducts.filter((p) => {
        const title = (p.title || p.name || "").toLowerCase();
        const id = (p.id || "").toLowerCase();
        return title.includes(q) || id.includes(q);
      });
      setFilteredCount(filteredAll.length);
      const sliced = filteredAll.slice(0, SUGGESTION_LIMIT).map((p) => ({ id: p.id, title: p.title || p.name, thumbnail: p.thumbnail }));
      setSuggestions(sliced);
    }, 250);
    return () => clearTimeout(timer);
  }, [query, allProducts]);

  const handleSelectSuggestion = (p) => {
    if (!p) return;
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    navigate(`/products/${p.id}`);
  };

  const handleShowAll = () => {
    const q = query.trim();
    if (!q) return;
    setShowSuggestions(false);
    setQuery("");
    navigate(`/search?search=${encodeURIComponent(q)}`);
  };

  const handleSubmit = (e) => {
    e && e.preventDefault();
    const q = query.trim();
    if (!q) return;
    // if query matches product id exactly, navigate to product detail
    const match = allProducts.find((p) => p.id === q);
    if (match) {
      setQuery("");
      navigate(`/products/${match.id}`);
      return;
    }
    // else go to products list with search param
    setQuery("");
    navigate(`/search?search=${encodeURIComponent(q)}`);
  };

  return (
    <header className="header">
      {/* 1. Menu Danh mục */}
      <div className="action-menu">
        <button onClick={toggleMenu} className="menu-button">
          <FiMenu className="icon" />
          {/* <span className="text-menu-button"></span> */}
        </button>
        {showMenu && (
          <div className="dropdown-menu">
            <NavLink to="/products?category=Làm Việc" className="menu-item">
              Làm Việc
            </NavLink>
            <NavLink to="/products?category=Giải Trí" className="menu-item">
              Giải Trí
            </NavLink>
            <NavLink to="/products?category=Học Tập" className="menu-item">
              Học Tập
            </NavLink>
            <NavLink to="/products?category=Tiện Ích" className="menu-item">
              Tiện Ích
            </NavLink>
            <NavLink to="/products?category=Windows" className="menu-item">
              Windows
            </NavLink>
            <NavLink to="/products?category=Microsoft" className="menu-item">
              Microsoft
            </NavLink>
            <NavLink to="/products?category=Diệt Virus" className="menu-item">
              Diệt Virus
            </NavLink>
            <NavLink to="/products?category=VPN" className="menu-item">
              VPN
            </NavLink>
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
      <div className="search-bar" ref={searchRef}>
        <form onSubmit={handleSubmit} className="search-form" style={{ position: "relative" }}>
          <input
            type="text"
            id="search"
            name="search"
            placeholder="Tìm theo tên hoặc dán product id..."
            className="search-input"
            aria-label="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if (suggestions.length) setShowSuggestions(true); }}
            autoComplete="off"
          />
          <button className="search-button" type="submit" aria-label="Tìm">
            <FaSearch className="icon" />
          </button>

          {showSuggestions && (
            loadingProducts ? (
              <ul className="suggestions-list">
                <li className="suggestion-loading">Đang tải...</li>
              </ul>
            ) : (
              <ul className="suggestions-list" role="listbox" aria-label="Gợi ý tìm kiếm">
                {suggestions.map((p) => (
                  <li
                    key={p.id}
                    className="suggestion-item"
                    role="option"
                    onMouseDown={() => handleSelectSuggestion(p)} // onMouseDown để xử lý trước blur
                  >
                    <img src={p.thumbnail || "/default-product.png"} alt="" className="suggestion-thumbnail" />
                    <span className="suggestion-title">{p.title}</span>
                    <small className="suggestion-id">{p.id.slice(0, 8)}...</small>
                  </li>
                ))}

                {/* Footer: show button to view full results when more matches exist */}
                {filteredCount > suggestions.length && (
                  <li className="suggestions-footer">
                    <button type="button" className="show-all-button" onMouseDown={(e) => { e.preventDefault(); handleShowAll(); }}>
                      Xem tất cả {filteredCount} kết quả cho “{query}”
                    </button>
                  </li>
                )}
                {/* If no suggestions but query exists, show message */}
                {suggestions.length === 0 && filteredCount === 0 && (
                  <li className="suggestion-empty">Không tìm thấy kết quả</li>
                )}
              </ul>
            )
          )}
        </form>
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
              aria-label="Đăng xuất"
            >
              <FiLogOut className="icon" />
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
