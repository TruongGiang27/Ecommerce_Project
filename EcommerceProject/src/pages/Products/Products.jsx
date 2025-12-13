import { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ProductCard from "../../components/productCard/ProductCard";
import SidebarCategories from "../../components/SidebarCategories/SidebarCategories";
import "./products.css";

// Assets
import OfficeBanner from "../../assets/images/banner-office.png";
import QuizletBanner from "../../assets/images/banner-quizlet.png";
import NetflixLogo from "../../assets/images/netflix2.png";
import AdobeLogo from "../../assets/images/adobe-color.png";
import DuolingoLogo from "../../assets/images/duolingo-logo.png";
import WindowsLogo from "../../assets/images/win.png";
import OfficeLogo from "../../assets/images/microsoft_365.png";
import KasperskyLogo from "../../assets/images/kaspersky.png";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [category, setCategory] = useState(searchParams.get("category") || "All");

  // Products
  const [products, setProducts] = useState([]);
  const [newestProducts, setNewestProducts] = useState([]);

  // Loading
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarLoading, setIsSidebarLoading] = useState(true);

  // Pagination
  const pageSize = 12;
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [pageInput, setPageInput] = useState(String(Number(searchParams.get("page")) || 1));

  // Env
  const regionId = process.env.REACT_APP_MEDUSA_REGION_ID;
  const BACKEND_URL = process.env.REACT_APP_MEDUSA_BACKEND_URL;

  // ===== Utils =====
  const getImageUrl = useCallback(
    (url) => {
      if (!url) return "https://via.placeholder.com/60";
      if (url.includes("localhost:9000")) {
        return url.replace("http://localhost:9000", BACKEND_URL);
      }
      return url;
    },
    [BACKEND_URL]
  );

  // ===== Fetch newest products (Sidebar) =====
  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const res = await fetch(
          `${BACKEND_URL}/store/products?region_id=${regionId}&limit=5`,
          {
            headers: {
              "x-publishable-api-key": process.env.REACT_APP_MEDUSA_PUBLISHABLE_KEY,
            },
          }
        );
        const data = await res.json();
        const sorted = (data.products || []).sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setNewestProducts(sorted);
      } catch (err) {
        console.error("Lỗi fetch newest products:", err);
      } finally {
        setIsSidebarLoading(false);
      }
    };

    if (regionId) fetchNewProducts();
  }, [regionId, BACKEND_URL]);

  // ===== Fetch all products =====
  useEffect(() => {
    const fetchAllProducts = async () => {
      setIsLoading(true);
      try {
        const limit = 100;
        let offset = 0;
        let allProducts = [];

        while (true) {
          const res = await fetch(
            `${BACKEND_URL}/store/products?region_id=${regionId}&limit=${limit}&offset=${offset}`,
            {
              headers: {
                "x-publishable-api-key": process.env.REACT_APP_MEDUSA_PUBLISHABLE_KEY,
              },
            }
          );

          if (!res.ok) break;

          const data = await res.json();
          const items = data.products || [];

          allProducts = allProducts.concat(items);

          if (items.length < limit) break;
          offset += limit;
        }

        setProducts(allProducts);
      } catch (err) {
        console.error("Lỗi fetch products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (regionId) fetchAllProducts();
  }, [regionId, BACKEND_URL]);

  // ===== Sync URL =====
  useEffect(() => {
    const cat = searchParams.get("category");
    const pg = Number(searchParams.get("page")) || 1;

    setCategory(cat || "All");
    setPage(pg);
    setPageInput(String(pg));
  }, [searchParams]);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setPage(1);
    setPageInput("1");
    setSearchParams({ category: newCategory, page: "1" });
  };

  // ===== Filter products =====
  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) => category === "All" || p.collection?.title === category
    );
  }, [products, category]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));

  const changePage = (newPage) => {
    if (newPage < 1) newPage = 1;
    if (newPage > totalPages) newPage = totalPages;

    setPage(newPage);
    setPageInput(String(newPage));
    setSearchParams({ category, page: String(newPage) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startIndex = (page - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + pageSize
  );

  const getPageList = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);
    const left = Math.max(2, page - 2);
    const right = Math.min(totalPages - 1, page + 2);

    if (left > 2) pages.push("left-ellipsis");
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push("right-ellipsis");

    pages.push(totalPages);
    return pages;
  };

  const handlePageInputKeyDown = (e) => {
    if (e.key === "Enter") {
      const n = Number(pageInput);
      if (!Number.isFinite(n) || n < 1) {
        setPageInput(String(page));
        return;
      }
      changePage(Math.min(Math.max(1, Math.floor(n)), totalPages));
    }
  };

  return (
    <>
      {/* ===== LIST + SIDEBAR ===== */}
      <div className="products-wrapper">
        <div className="container-products">
          <div className="subContainer">
            {/* Sidebar */}
            <div className="side-bar">
              <SidebarCategories onSelectCategory={handleCategoryChange} />

              <div className="right-sidebar">
                <div className="promo-banner">
                  <img src={OfficeBanner} alt="Office" loading="lazy" />
                </div>

                <Link to="/products/prod_quizlet" className="promo-banner">
                  <img src={QuizletBanner} alt="Quizlet" loading="lazy" />
                </Link>

                {/* New products */}
                <div className="new-products-box">
                  <h3 className="new-products-title">Sản phẩm mới</h3>

                  <div className="new-products-list">
                    {isSidebarLoading ? (
                      <p style={{ padding: 10, fontSize: 13, color: "#888" }}>
                        Đang tải...
                      </p>
                    ) : (
                      newestProducts.map((p) => {
                        const price =
                          p?.variants?.[0]?.calculated_price
                            ?.calculated_amount || 0;
                        return (
                          <Link
                            key={p.id}
                            to={`/products/${p.id}`}
                            className="new-product-item"
                          >
                            <div className="new-product-thumb">
                              <img
                                src={getImageUrl(p.thumbnail)}
                                alt={p.title}
                                loading="lazy"
                              />
                            </div>
                            <div className="new-product-info">
                              <p className="new-product-name">{p.title}</p>
                              <p className="new-product-price">
                                {price.toLocaleString()} đ
                              </p>
                            </div>
                          </Link>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="content">
              <div className="title-style">
                <h2>
                  {category === "All"
                    ? "Tất cả sản phẩm"
                    : `Sản phẩm: ${category}`}
                </h2>
              </div>

              {isLoading ? (
                <div
                  className="loading-container"
                  style={{ textAlign: "center", padding: 50 }}
                >
                  <div className="loader"></div>
                  <p>Đang tải danh sách sản phẩm...</p>
                </div>
              ) : (
                <>
                  <div className="product-grid">
                    {paginatedProducts.length > 0 ? (
                      paginatedProducts.map((p) => (
                        <ProductCard key={p.id} product={p} />
                      ))
                    ) : (
                      <p>Không tìm thấy sản phẩm.</p>
                    )}
                  </div>

                  {filteredProducts.length > pageSize && (
                    <div className="pagination">
                      <button
                        onClick={() => changePage(page - 1)}
                        disabled={page <= 1}
                        className="icon-pagination-button"
                      >
                        &lt;
                      </button>

                      <ul className="pagination-list">
                        {getPageList().map((item, idx) =>
                          item === "left-ellipsis" ||
                          item === "right-ellipsis" ? (
                            <li key={idx} className="ellipsis">
                              …
                            </li>
                          ) : (
                            <li key={item}>
                              <button
                                onClick={() => changePage(item)}
                                className={`page-button ${
                                  item === page ? "active" : ""
                                }`}
                              >
                                {item}
                              </button>
                            </li>
                          )
                        )}
                      </ul>

                      <button
                        onClick={() => changePage(page + 1)}
                        disabled={page >= totalPages}
                        className="icon-pagination-button"
                      >
                        &gt;
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== HERO ===== */}
      <section className="hero-signup">
        <div className="hero-floating-layer">
          <div className="hero-floating-card card-1">
            <img src={OfficeLogo} alt="Office" />
          </div>
          <div className="hero-floating-card card-2">
            <img src={NetflixLogo} alt="Netflix" />
          </div>
          <div className="hero-floating-card card-3">
            <img src={AdobeLogo} alt="Adobe" />
          </div>
          <div className="hero-floating-card card-4">
            <img src={DuolingoLogo} alt="Duolingo" />
          </div>
          <div className="hero-floating-card card-5">
            <img src={WindowsLogo} alt="Windows" />
          </div>
        </div>
        <div className="hero-floating-card card-6">
          <img src={KasperskyLogo} alt="Kaspersky" />
        </div>
        <div className="hero-inner">
          <div className="hero-badge">3.000+ khách hàng tin tưởng</div>
          <h2 className="hero-title">
            Mua tài khoản & key bản quyền chính hãng tại Digitech Shop
          </h2>
          <Link to="/register" className="hero-cta">
            Đăng ký tài khoản
          </Link>
        </div>
      </section>
    </>
  );
}
