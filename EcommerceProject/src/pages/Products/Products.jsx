import { useEffect, useState, useMemo, useCallback } from "react";
import ProductCard from "../../components/productCard/ProductCard";
import { useSearchParams, Link } from "react-router-dom";
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
  // const [search, setSearch] = useState(""); // Tạm tắt search client
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  
  // 🔥 1. Tách State: Products chính và New Products riêng
  const [products, setProducts] = useState([]);
  const [newestProducts, setNewestProducts] = useState([]); 
  
  // 🔥 2. Thêm Loading State
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarLoading, setIsSidebarLoading] = useState(true);

  const pageSize = 12;
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [pageInput, setPageInput] = useState(String(Number(searchParams.get("page")) || 1));
  
  const regionId = process.env.REACT_APP_MEDUSA_REGION_ID;
  const BACKEND_URL = process.env.REACT_APP_MEDUSA_BACKEND_URL;

  // 🔥 3. Optimize hàm xử lý ảnh bằng useCallback
  const getImageUrl = useCallback((url) => {
    if (!url) return "https://via.placeholder.com/60";
    if (url.includes("localhost:9000")) {
      return url.replace("http://localhost:9000", BACKEND_URL);
    }
    return url;
  }, [BACKEND_URL]);

  // 🔥 4. Fetch riêng "Sản phẩm mới" cho Sidebar (Chạy cực nhanh vì limit=5)
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
        // Sắp xếp giảm dần theo ngày tạo
        const sorted = (data.products || []).sort((a, b) => 
           new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setNewestProducts(sorted);
      } catch (err) {
        console.error("Lỗi fetch new products:", err);
      } finally {
        setIsSidebarLoading(false);
      }
    };
    if (regionId) fetchNewProducts();
  }, [regionId, BACKEND_URL]);

  // 🔥 5. Fetch tất cả sản phẩm (Vẫn giữ logic cũ của bạn nhưng thêm loading)
  useEffect(() => {
    const fetchAllProducts = async () => {
      setIsLoading(true);
      try {
        const limit = 100;
        let offset = 0;
        let allProducts = [];

        // LƯU Ý: Cách fetch while(true) này rất nặng nếu db > 500 sp.
        // Tốt nhất sau này bạn nên chuyển sang Server-Side Pagination hoàn toàn.
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
        console.error("Lỗi khi fetch products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (regionId) fetchAllProducts();
  }, [regionId, BACKEND_URL]);

  // Đồng bộ URL
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    const pageFromUrl = Number(searchParams.get("page")) || 1;
    setCategory(categoryFromUrl || "All");
    setPage(pageFromUrl);
    setPageInput(String(pageFromUrl));
  }, [searchParams]);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setPage(1);
    setPageInput("1");
    setSearchParams({ category: newCategory, page: "1" });
  };

  // 🔥 6. Dùng useMemo để tính toán Filter (Tối ưu CPU)
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Logic search tạm bỏ vì bạn đang comment input search
      return (category === "All" || p.collection?.title === category);
    });
  }, [products, category]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));

  // Pagination logic (giữ nguyên nhưng bọc useMemo các tính toán nặng nếu cần)
  const changePage = (newPage) => {
    if (newPage < 1) newPage = 1;
    if (newPage > totalPages) newPage = totalPages;
    setPage(newPage);
    setPageInput(String(newPage));
    setSearchParams({ category: category, page: String(newPage) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startIndex = (page - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);

  // Logic tạo list trang (Giữ nguyên)
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

  // Logic input page (Giữ nguyên)
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
      {/* ====== LIST SẢN PHẨM + SIDEBAR ====== */}
      <div className="products-wrapper"> {/* Thêm wrapper bao ngoài */}
      <div className="container-products">
        <div className="subContainer">
          {/* Sidebar */}
          <div className="side-bar">
            <SidebarCategories onSelectCategory={handleCategoryChange} />

            <div className="right-sidebar">
              <div className="promo-banner">
                <img src={OfficeBanner} alt="Office 2024" loading="lazy" />
              </div>
              <Link to="/products/prod_quizlet" className="promo-banner" style={{ display: "block" }}>
                <img src={QuizletBanner} alt="Quizlet" style={{ width: "100%", height: "auto" }} loading="lazy" />
              </Link>

              {/* Box Sản phẩm mới */}
              <div className="new-products-box">
                <h3 className="new-products-title">Sản phẩm mới</h3>
                <div className="new-products-list">
                  {/* Skeleton Loading cho Sidebar */}
                  {isSidebarLoading ? (
                     <p style={{padding: 10, fontSize: 13, color: '#888'}}>Đang tải...</p>
                  ) : (
                    newestProducts.map((p) => {
                      const npPrice = p?.variants?.[0]?.calculated_price?.calculated_amount || 0;
                      return (
                        <Link key={p.id} to={`/products/${p.id}`} className="new-product-item">
                          <div className="new-product-thumb">
                            <img src={getImageUrl(p.thumbnail)} alt={p.title} loading="lazy" />
                          </div>
                          <div className="new-product-info">
                            <p className="new-product-name">{p.title}</p>
                            <p className="new-product-price">{npPrice.toLocaleString()} đ</p>
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="content">
            <div className="title-style">
              <h2 style={{ marginBottom: "20px" }}>
                {category === "All" ? "Tất cả sản phẩm" : `Sản phẩm: ${category}`}
              </h2>
            </div>

            {/* Grid sản phẩm */}
            {isLoading ? (
               // 🔥 HIỂN THỊ LOADING KHI ĐANG TẢI (Thay vì màn hình trắng)
               <div className="loading-container" style={{textAlign: 'center', padding: 50}}>
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
                    <p>Không tìm thấy sản phẩm nào.</p>
                  )}
                </div>

                {/* Pagination */}
                {filteredProducts.length > pageSize && (
                  <div className="pagination" style={{ marginTop: 20, display: "flex", gap: 10, alignItems: "center" }}>
                    <button onClick={() => changePage(page - 1)} disabled={page <= 1} className="icon-pagination-button">
                       &lt;
                    </button>
                    <nav>
                      <ul className="pagination-list" style={{ display: "flex", gap: 6, listStyle: "none", padding: 0 }}>
                        {getPageList().map((item, idx) =>
                          item === "left-ellipsis" || item === "right-ellipsis" ? (
                            <li key={`${item}-${idx}`} className="ellipsis" style={{ padding: "6px 8px" }}>…</li>
                          ) : (
                            <li key={item}>
                              <button
                                onClick={() => changePage(item)}
                                className={`page-button ${item === page ? "active" : ""}`}
                              >
                                {item}
                              </button>
                            </li>
                          )
                        )}
                      </ul>
                    </nav>
                    <button onClick={() => changePage(page + 1)} disabled={page >= totalPages} className="icon-pagination-button">
                       &gt;
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      </div> {/* Đóng wrapper bao ngoài */}

      {/* Hero Signup Section (Giữ nguyên, chỉ thêm loading="lazy" cho ảnh) */}
      <section className="hero-signup">
        <div className="hero-floating-layer" aria-hidden="true">
          <div className="hero-floating-card card-1"><img src={OfficeLogo} alt="Office" loading="lazy"/></div>
          <div className="hero-floating-card card-2"><img src={NetflixLogo} alt="Netflix" loading="lazy"/></div>
          <div className="hero-floating-card card-3"><img src={AdobeLogo} alt="Adobe" loading="lazy"/></div>
          <div className="hero-floating-card card-4"><img src={DuolingoLogo} alt="Duolingo" loading="lazy"/></div>
          <div className="hero-floating-card card-5"><img src={WindowsLogo} alt="Windows" loading="lazy"/></div>
        </div>
        <div className="hero-floating-card card-6"><img src={KasperskyLogo} alt="Kaspersky" loading="lazy"/></div>
        <div className="hero-inner">
          <div className="hero-badge"><span className="hero-badge-dot" />3.000+ khách hàng tin tưởng</div>
          <h2 className="hero-title">
             <span className="hero-title-gradient">Mua tài Khoản Chính Chủ, </span>
             <span className="hero-title-gradient">Key bản Quyền Giá Tốt</span> tại Digitech Shop
          </h2>
          <p className="hero-subtitle">Trải nghiệm mua sắm tiện lợi...</p>
          <Link to="/register" className="hero-cta"><span>Đăng ký tài khoản</span><span className="hero-cta-arrow">➜</span></Link>
        </div>
      </section>
      
      {/* Benefit Section (Giữ nguyên) */}
      <section className="benefit-strip">
         {/* ... Code UI cũ của bạn ... */}
         <div className="benefit-strip-inner">
          <div className="benefit-item">
            <div className="benefit-icon">🚚</div>
            <div className="benefit-text"><p className="benefit-title">Xử lý nhanh</p><p className="benefit-sub">Trong vòng 3h</p></div>
          </div>
          <span className="benefit-divider" />
          <div className="benefit-item">
            <div className="benefit-icon">🛡️</div>
            <div className="benefit-text"><p className="benefit-title">Uy tín</p><p className="benefit-sub">Bảo hành trọn đời</p></div>
          </div>
          <span className="benefit-divider" />
          <div className="benefit-item">
            <div className="benefit-icon">🔑</div>
            <div className="benefit-text"><p className="benefit-title">Chính hãng</p><p className="benefit-sub">Key global</p></div>
          </div>
          <span className="benefit-divider" />
          <div className="benefit-item">
            <div className="benefit-icon">🎧</div>
            <div className="benefit-text"><p className="benefit-title">Hỗ trợ</p><p className="benefit-sub">24/7 Support</p></div>
          </div>
        </div>
      </section>
    </>
  );
}