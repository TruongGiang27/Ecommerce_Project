// src/components/Header/Header.jsx

import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "../Header/header.css";
import "../../theme/theme.css";
import  { useState, useEffect, useRef } from "react";
import { FiMenu } from "react-icons/fi";
import { FaUserCircle, FaShoppingCart, FaSearch } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import Logo from "../../assets/images/DigitexLogoWhite.png";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => setShowMenu(!showMenu);

  const location = useLocation();
  useEffect(() => {
    setShowMenu(false);
  }, [location]);

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
  const BACKEND_URL = process.env.REACT_APP_MEDUSA_BACKEND_URL;
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

  // ⭐ Thêm state để biết header có đang sticky hay không
  const [isSticky, setIsSticky] = useState(false);

  // ⭐ Lắng nghe sự kiện scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0); // scroll xuống là bật sticky
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load all products once for client-side filtering (Medusa store endpoint)
  useEffect(() => {
    const regionId = process.env.REACT_APP_MEDUSA_REGION_ID;
    const url = `${BACKEND_URL}/store/products?limit=1000${regionId ? `&region_id=${regionId}` : ""}`;
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
    // ⭐ Thêm class header--sticky khi isSticky = true
    <header className={`header ${isSticky ? "header--sticky" : ""}`}>
      {/* 1. Menu Danh mục */}
      <div className="action-menu">
        <button
          onClick={toggleMenu}
          className="menu-button"
          aria-expanded={showMenu}
          aria-controls="category-menu"
        >
          <FiMenu className="icon" />
        </button>
        {showMenu && (
          <div id="category-menu" className="dropdown-menu" role="menu">
            <NavLink
              to="/products?category=Làm Việc"
              className="menu-item"
              onClick={() => setShowMenu(false)}
            >
              Làm Việc
            </NavLink>
            <NavLink
              to="/products?category=Giải Trí"
              className="menu-item"
              onClick={() => setShowMenu(false)}
            >
              Giải Trí
            </NavLink>
            <NavLink
              to="/products?category=Học Tập"
              className="menu-item"
              onClick={() => setShowMenu(false)}
            >
              Học Tập
            </NavLink>
            <NavLink
              to="/products?category=Tiện Ích"
              className="menu-item"
              onClick={() => setShowMenu(false)}
            >
              Tiện Ích
            </NavLink>
            <NavLink
              to="/products?category=Windows"
              className="menu-item"
              onClick={() => setShowMenu(false)}
            >
              Windows
            </NavLink>
            <NavLink
              to="/products?category=Microsoft"
              className="menu-item"
              onClick={() => setShowMenu(false)}
            >
              Microsoft
            </NavLink>
            <NavLink
              to="/products?category=Diệt Virus"
              className="menu-item"
              onClick={() => setShowMenu(false)}
            >
              Diệt Virus
            </NavLink>
            <NavLink
              to="/products?category=VPN"
              className="menu-item"
              onClick={() => setShowMenu(false)}
            >
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

        <NavLink
          to="/cart"
          className={({ isActive }) =>
            isActive ? "nav-link active cart-link" : "nav-link cart-link"
          }
        >
          <FaShoppingCart className="icon" />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </NavLink>

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