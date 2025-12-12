// src/components/Header/Header.jsx

import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "../Header/header.css";
import "../../theme/theme.css";
import { useState, useEffect, useRef } from "react";

// 1. IMPORT ICONS UI (Giữ nguyên các icon điều hướng)
import { FiMenu, FiX, FiChevronRight } from "react-icons/fi"; 
import { FaUserCircle, FaShoppingCart, FaSearch } from "react-icons/fa";

// 2. IMPORT ICONS DANH MỤC (Đồng bộ với SidebarCategories)
import { FaPenNib, FaGamepad, FaBook, FaWindows, FaShieldAlt, FaThLarge } from "react-icons/fa";
import { SiMicrosoft, SiExpressvpn } from "react-icons/si";

import { useCart } from "../../context/CartContext";
import Logo from "../../assets/images/DigitexLogoWhite.png";
import { useAuth } from "../../context/AuthContext";

// 3. CẤU HÌNH DANH MỤC (Đã cập nhật Icon khớp với Sidebar)
const CATEGORIES = [
  { name: "Làm Việc", link: "/products?category=Làm Việc", icon: <FaPenNib /> },
  { name: "Giải Trí", link: "/products?category=Giải Trí", icon: <FaGamepad /> },
  { name: "Học Tập", link: "/products?category=Học Tập", icon: <FaBook /> },
  { name: "Tiện Ích", link: "/products?category=Tiện Ích", icon: <FaThLarge /> },
  { name: "Windows", link: "/products?category=Windows", icon: <FaWindows /> },
  { name: "Microsoft", link: "/products?category=Microsoft", icon: <SiMicrosoft /> },
  { name: "Diệt Virus", link: "/products?category=Diệt Virus", icon: <FaShieldAlt /> },
  { name: "VPN", link: "/products?category=VPN", icon: <SiExpressvpn /> },
];

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => setShowMenu(!showMenu);

  const location = useLocation();
  useEffect(() => {
    setShowMenu(false);
    setOpen(false);
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

  const userMenuRef = useRef();
  const categoryRef = useRef();
  const searchRef = useRef(null);
  
  const BACKEND_URL = process.env.REACT_APP_MEDUSA_BACKEND_URL;

  // --- SEARCH states ---
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]); 
  const [suggestions, setSuggestions] = useState([]);
  const [filteredCount, setFilteredCount] = useState(0); 
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setOpen(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(e.target) && window.innerWidth > 1024) {
        setShowMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [isSticky, setIsSticky] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch products logic (giữ nguyên)
  useEffect(() => {
    const regionId = process.env.REACT_APP_MEDUSA_REGION_ID;
    const url = `${BACKEND_URL}/store/products?limit=1000${regionId ? `&region_id=${regionId}` : ""}`;
    setLoadingProducts(true);
    fetch(url, { headers: { "x-publishable-api-key": process.env.REACT_APP_MEDUSA_PUBLISHABLE_KEY } })
      .then((res) => res.json())
      .then((data) => setAllProducts(Array.isArray(data?.products) ? data.products : []))
      .catch((err) => { console.error(err); setAllProducts([]); })
      .finally(() => setLoadingProducts(false));
  }, []);

  // Search filter logic (giữ nguyên)
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
        return title.includes(q);
      });
      setFilteredCount(filteredAll.length);
      const sliced = filteredAll.slice(0, SUGGESTION_LIMIT).map((p) => ({ id: p.id, title: p.title || p.name, thumbnail: p.thumbnail }));
      setSuggestions(sliced);
    }, 250);
    return () => clearTimeout(timer);
  }, [query, allProducts]);

  const handleSelectSuggestion = (p) => { if (!p) return; setQuery(""); setSuggestions([]); setShowSuggestions(false); navigate(`/products/${p.id}`); };
  const handleShowAll = () => { const q = query.trim(); if (!q) return; setShowSuggestions(false); setQuery(""); navigate(`/search?search=${encodeURIComponent(q)}`); };
  const handleSubmit = (e) => { e && e.preventDefault(); const q = query.trim(); if (!q) return; const match = allProducts.find((p) => p.id === q); if (match) { setQuery(""); navigate(`/products/${match.id}`); return; } setQuery(""); navigate(`/search?search=${encodeURIComponent(q)}`); };

  return (
    <header className={`header ${isSticky ? "header--sticky" : ""}`}>
      
      {/* 1. Menu Danh mục & Mobile Navigation */}
      <div className="action-menu" ref={categoryRef}>
        <button
          onClick={toggleMenu}
          className={`menu-button ${showMenu ? 'active' : ''}`}
          aria-label="Danh mục"
        >
          {showMenu ? <FiX className="icon" /> : <FiMenu className="icon" />}
        </button>

        <div className={`menu-overlay ${showMenu ? 'show' : ''}`} onClick={() => setShowMenu(false)}></div>

        <div className={`dropdown-menu ${showMenu ? 'show' : ''}`}>
             
             {/* Header Mobile */}
             <div className="mobile-menu-header">
                <span className="mobile-menu-title">Menu</span>
                <button className="close-menu-btn" onClick={() => setShowMenu(false)}>
                  <FiX />
                </button>
             </div>

             {/* Links Mobile */}
             <div className="mobile-only-links">
                <NavLink to="/products" className="menu-item main-link">Tất cả sản phẩm</NavLink>
                <div className="mobile-nav-group">
                  <NavLink to="/about" className="menu-item">Giới thiệu</NavLink>
                  <NavLink to="/policy" className="menu-item">Chính sách</NavLink>
                  <NavLink to="/faqs" className="menu-item">FAQs</NavLink>
                </div>
                <div className="menu-divider"></div>
             </div>

            <div className="menu-category-label">Danh mục sản phẩm</div>
            
            {/* Render Danh mục với Icon đồng bộ */}
            <div className="category-grid">
              {CATEGORIES.map((cat, index) => (
                <NavLink key={index} to={cat.link} className="menu-item cat-item">
                  <div className="menu-item-left">
                    <span className="cat-icon-box">{cat.icon}</span>
                    <span className="cat-name">{cat.name}</span>
                  </div>
                  <FiChevronRight className="arrow"/>
                </NavLink>
              ))}
            </div>
        </div>
      </div>

      {/* 2. Logo */}
      <NavLink to="/" className="logo-container">
        <div className="logo"><img src={Logo} alt="Logo Website" /></div>
      </NavLink>

      {/* 3. Search Bar */}
      <div className="search-bar" ref={searchRef}>
        <form onSubmit={handleSubmit} className="search-form" style={{ position: "relative" }}>
          <input type="text" placeholder="Tìm kiếm sản phẩm ..." className="search-input" value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => { if (suggestions.length) setShowSuggestions(true); }} autoComplete="off" />
          <button className="search-button" type="submit"><FaSearch className="icon" /></button>
          {showSuggestions && (
            loadingProducts ? (<ul className="suggestions-list"><li className="suggestion-loading">Đang tải...</li></ul>) : (
              <ul className="suggestions-list">
                {suggestions.map((p) => (
                  <li key={p.id} className="suggestion-item" onMouseDown={() => handleSelectSuggestion(p)}>
                    <img src={p.thumbnail || "/default-product.png"} alt="" className="suggestion-thumbnail" />
                    <div className="suggestion-info"><span className="suggestion-title">{p.title}</span></div>
                  </li>
                ))}
                {filteredCount > suggestions.length && (<li className="suggestions-footer"><button type="button" className="show-all-button" onMouseDown={(e) => { e.preventDefault(); handleShowAll(); }}>Xem tất cả {filteredCount} kết quả</button></li>)}
                {!suggestions.length && !filteredCount && (<li className="suggestion-empty">Không tìm thấy kết quả</li>)}
              </ul>
            )
          )}
        </form>
      </div>

      {/* 4. Desktop Nav & User */}
      <nav>
        <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active nav-text-link" : "nav-link nav-text-link"}>Giới thiệu</NavLink>
        <NavLink to="/policy" className={({ isActive }) => isActive ? "nav-link active nav-text-link" : "nav-link nav-text-link"}>Chính sách</NavLink>
        <NavLink to="/products" className={({ isActive }) => isActive ? "nav-link active nav-text-link" : "nav-link nav-text-link"}>Sản phẩm</NavLink>
        <NavLink to="/faqs" className={({ isActive }) => isActive ? "nav-link active nav-text-link" : "nav-link nav-text-link"}>FAQs</NavLink>

        <NavLink to="/cart" className={({ isActive }) => isActive ? "nav-link active cart-link" : "nav-link cart-link"}>
          <FaShoppingCart className="icon" />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </NavLink>

        {isAuthenticated ? (
          <div className="user-container" style={{position: 'relative'}} ref={userMenuRef}>
            <button className="user-button" onClick={() => setOpen(!open)}><FaUserCircle className="user-icon" /></button>
            {open && (
              <div className="user-dropdown">
                {items.map((item) => (<NavLink key={item.link} to={item.link} className="dropdown-item" onClick={() => setOpen(false)}>{item.name}</NavLink>))}
                <button className="dropdown-item logout" onClick={logout}>Đăng xuất</button>
              </div>
            )}
          </div>
        ) : (
          <NavLink to="/login" className="user-button"><FaUserCircle className="user-icon" /></NavLink>
        )}
      </nav>
    </header>
  );
}