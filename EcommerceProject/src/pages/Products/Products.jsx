import { useEffect, useState } from "react";
import ProductCard from "../../components/productCard/ProductCard";
import { useSearchParams, Link } from "react-router-dom";
import SidebarCategories from "../../components/SidebarCategories/SidebarCategories";
import "./products.css";

// Banner / logo dùng cho sidebar + hero
import OfficeBanner from "../../assets/images/banner-office.png";
import QuizletBanner from "../../assets/images/banner-quizlet.png";

// 👉 Các logo “app” bay lơ lửng quanh hero (bạn đổi path cho đúng dự án của bạn nha)
import NetflixLogo from "../../assets/images/netflix2.png";
import AdobeLogo from "../../assets/images/adobe-color.png";
import DuolingoLogo from "../../assets/images/duolingo-logo.png";
import WindowsLogo from "../../assets/images/win.png";
import OfficeLogo from "../../assets/images/microsoft_365.png";
import KasperskyLogo from "../../assets/images/kaspersky.png";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(
    searchParams.get("category") || "All"
  );
  const [products, setProducts] = useState([]);
  const pageSize = 12;
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [pageInput, setPageInput] = useState(
    String(Number(searchParams.get("page")) || 1)
  );
  const regionId = process.env.REACT_APP_MEDUSA_REGION_ID;

  // Lấy toàn bộ products
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const limit = 100;
        let offset = 0;
        let allProducts = [];

        while (true) {
          const res = await fetch(
            `${process.env.REACT_APP_MEDUSA_BACKEND}/store/products?region_id=${regionId}&limit=${limit}&offset=${offset}`,
            {
              headers: {
                "x-publishable-api-key":
                  process.env.REACT_APP_MEDUSA_PUBLISHABLE_KEY,
              },
            }
          );

          if (!res.ok) {
            throw new Error(`Fetch error: ${res.status}`);
          }

          const data = await res.json();
          console.log("API page response:", data);

          const items = data.products || data.items || data.data || [];
          allProducts = allProducts.concat(items);

          if (items.length < limit) {
            break;
          }

          offset += limit;
        }

        setProducts(allProducts);
      } catch (err) {
        console.error("Lỗi khi fetch products:", err);
      }
    };

    fetchAllProducts();
  }, [regionId]);

  // Đồng bộ category + page với URL
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    const pageFromUrl = Number(searchParams.get("page")) || 1;

    if (categoryFromUrl) {
      setCategory(categoryFromUrl);
    } else {
      setCategory("All");
    }

    setPage(pageFromUrl);
    setPageInput(String(pageFromUrl));
  }, [searchParams]);

  // Đổi category
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setPage(1);
    setPageInput("1");
    setSearchParams({ category: newCategory, page: "1" });
  };

  // Lọc sản phẩm theo category + search
  const filteredProducts = products.filter((p) => {
    return (
      (category === "All" || p.collection?.title === category) &&
      (p.title || "").toLowerCase().includes((search || "").toLowerCase())
    );
  });

  // Tính tổng số trang
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));

  // Nếu page > totalPages thì kéo lại
  useEffect(() => {
    if (page > totalPages) {
      const newPage = totalPages;
      setPage(newPage);
      setPageInput(String(newPage));
      setSearchParams({ category: category, page: String(newPage) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredProducts.length, totalPages]);

  const changePage = (newPage) => {
    if (newPage < 1) newPage = 1;
    if (newPage > totalPages) newPage = totalPages;

    setPage(newPage);
    setPageInput(String(newPage));
    setSearchParams({ category: category, page: String(newPage) });

    try {
      const container = document.querySelector(".container-products");
      if (container && typeof container.scrollIntoView === "function") {
        container.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Tạo list số trang có dấu ...
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

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  const applyPageInput = () => {
    const n = Number(pageInput);
    if (!Number.isFinite(n) || n < 1) {
      setPageInput(String(page));
      return;
    }
    changePage(Math.min(Math.max(1, Math.floor(n)), totalPages));
  };

  const handlePageInputKeyDown = (e) => {
    if (e.key === "Enter") {
      applyPageInput();
    }
  };

  const handlePageInputBlur = () => {
    applyPageInput();
  };

  const startIndex = (page - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + pageSize
  );

  // Sản phẩm mới nhất
  const newestProducts = [...products]
    .sort((a, b) => {
      const da = new Date(a.created_at || 0).getTime();
      const db = new Date(b.created_at || 0).getTime();
      return db - da;
    })
    .slice(0, 5);

  return (
    <>
      {/* ====== LIST SẢN PHẨM + SIDEBAR ====== */}
      <div className="container-products">
        <div className="subContainer">
          {/* Sidebar bên trái */}
          <div className="side-bar">
            <SidebarCategories onSelectCategory={handleCategoryChange} />

            {/* Banner + Sản phẩm mới dưới sidebar */}
            <div className="right-sidebar">
              {/* Banner Office */}
              <div className="promo-banner">
                <img src={OfficeBanner} alt="Office 2024 chính chủ" />
              </div>

              {/* Banner Quizlet → link tới product Quizlet */}
              <Link
                to="/products/prod_01K73YARNBAD1FZ5QKGFS2T6W6"
                className="promo-banner"
                style={{ display: "block" }}
              >
                <img
                  src={QuizletBanner}
                  alt="Quizlet banner"
                  style={{ cursor: "pointer", width: "100%", height: "auto" }}
                />
              </Link>

              {/* Box Sản phẩm mới */}
              <div className="new-products-box">
                <h3 className="new-products-title">Sản phẩm mới</h3>
                <div className="new-products-list">
                  {newestProducts.map((p) => {
                    const npPrice =
                      p?.variants?.[0]?.calculated_price?.calculated_amount ||
                      0;
                    return (
                      <Link
                        key={p.id}
                        to={`/products/${p.id}`}
                        className="new-product-item"
                      >
                        <div className="new-product-thumb">
                          <img
                            src={
                              p.thumbnail || "https://via.placeholder.com/60"
                            }
                            alt={p.title}
                          />
                        </div>
                        <div className="new-product-info">
                          <p className="new-product-name">{p.title}</p>
                          <p className="new-product-price">
                            {npPrice.toLocaleString()} đ
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Nội dung chính */}
          <div className="content">
            <div className="title-style" style={{ flex: 1 }}>
              <h2 style={{ marginBottom: "20px" }}>
                {category === "All"
                  ? "Tất cả sản phẩm"
                  : `Sản phẩm: ${category}`}
              </h2>
            </div>

            {/* Bạn có thể thêm ô search nếu cần */}
            {/* <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
            /> */}

            {/* Grid danh sách sản phẩm */}
            <div className="product-grid">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))
              ) : (
                <p>Không tìm thấy sản phẩm</p>
              )}
            </div>

            {/* Pagination */}
            <div
              className="pagination"
              style={{
                marginTop: 20,
                display: "flex",
                gap: 10,
                alignItems: "center",
              }}
            >
              <button
                onClick={() => changePage(page - 1)}
                disabled={page <= 1}
                className="icon-pagination-button"
                aria-label="Trang trước"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M15 18L9 12L15 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="sr-only">Prev</span>
              </button>

              <nav aria-label="Pagination">
                <ul
                  className="pagination-list"
                  style={{
                    display: "flex",
                    gap: 6,
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                  }}
                >
                  {getPageList().map((item, idx) =>
                    item === "left-ellipsis" || item === "right-ellipsis" ? (
                      <li
                        key={`${item}-${idx}`}
                        className="ellipsis"
                        aria-hidden="true"
                        style={{ padding: "6px 8px" }}
                      >
                        …
                      </li>
                    ) : (
                      <li key={item}>
                        <button
                          onClick={() => changePage(item)}
                          className={`page-button ${
                            item === page ? "active" : ""
                          }`}
                          aria-current={item === page ? "page" : undefined}
                        >
                          {item}
                        </button>
                      </li>
                    )
                  )}
                </ul>
              </nav>

              <button
                onClick={() => changePage(page + 1)}
                disabled={page >= totalPages}
                className="icon-pagination-button"
                aria-label="Trang tiếp theo"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="sr-only">Next</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ====== HERO “ĐĂNG KÝ TÀI KHOẢN” DƯỚI PHẦN SẢN PHẨM ====== */}
      <section className="hero-signup">
        {/* Lớp icon bay xung quanh (pure decoration) */}
        <div className="hero-floating-layer" aria-hidden="true">
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
        {/* Nội dung chính ở giữa */}
        <div className="hero-inner">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            3.000+ khách hàng tin tưởng
          </div>

          <h2 className="hero-title">
            <span className="hero-title-gradient">Mua tài Khoản Chính Chủ, </span>
            <span className="hero-title-gradient">
              Key bản Quyền Giá Tốt
            </span>{" "}
            <span className="hero-title-gradient"> Tại Digitech Shop</span>
          </h2>

          <p className="hero-subtitle">
            Trải nghiệm mua sắm tiện lợi với tài khoản và key bản quyền chính
            hãng tại Digitech Shop. Cam kết giá tốt nhất, hỗ trợ kỹ thuật và
            dịch vụ khách hàng chu đáo suốt quá trình sử dụng.
          </p>

          <Link to="/register" className="hero-cta">
            <span>Đăng ký tài khoản</span>
            <span className="hero-cta-arrow">➜</span>
          </Link>
        </div>
      </section>

      {/* ====== KHUNG ĐEN LỢI ÍCH DƯỚI HERO ====== */}
      <section className="benefit-strip">
        <div className="benefit-strip-inner">
          {/* Item 1 */}
          <div className="benefit-item">
            <div className="benefit-icon">
              <span role="img" aria-label="truck">
                🚚
              </span>
            </div>
            <div className="benefit-text">
              <p className="benefit-title">Xử lý nhanh</p>
              <p className="benefit-sub">Trong vòng 3h</p>
            </div>
          </div>

          <span className="benefit-divider" aria-hidden="true" />

          {/* Item 2 */}
          <div className="benefit-item">
            <div className="benefit-icon">
              <span role="img" aria-label="support">
                🛡️
              </span>
            </div>
            <div className="benefit-text">
              <p className="benefit-title">Đội ngũ chuyên nghiệp</p>
              <p className="benefit-sub">Hỗ trợ 24/7</p>
            </div>
          </div>

          <span className="benefit-divider" aria-hidden="true" />

          {/* Item 3 */}
          <div className="benefit-item">
            <div className="benefit-icon">
              <span role="img" aria-label="key">
                🔑
              </span>
            </div>
            <div className="benefit-text">
              <p className="benefit-title">Key chính hãng</p>
              <p className="benefit-sub">Hợp pháp 100%</p>
            </div>
          </div>

          <span className="benefit-divider" aria-hidden="true" />

          {/* Item 4 */}
          <div className="benefit-item">
            <div className="benefit-icon">
              <span role="img" aria-label="headset">
                🎧
              </span>
            </div>
            <div className="benefit-text">
              <p className="benefit-title">Cổng thanh toán</p>
              <p className="benefit-sub">An toàn, uy tín</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
