import { useEffect, useState } from "react";
import ProductCard from "../../components/productCard/ProductCard";
import { useSearchParams, Link } from "react-router-dom";
import SidebarCategories from "../../components/SidebarCategories/SidebarCategories";
import "./products.css";

// --- IMPORT IMAGE ASSETS (Giữ nguyên) ---
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
  
  // --- STATE QUẢN LÝ DỮ LIỆU ---
  const [products, setProducts] = useState([]); // List sản phẩm hiển thị chính
  const [newestProducts, setNewestProducts] = useState([]); // List sản phẩm mới cho Sidebar
  const [count, setCount] = useState(0); // Tổng số lượng sản phẩm (để chia trang)
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading
  
  // --- CẤU HÌNH ---
  const pageSize = 12;
  const page = Number(searchParams.get("page")) || 1;
  const category = searchParams.get("category") || "All";
  const [pageInput, setPageInput] = useState(String(page));
  
  const regionId = process.env.REACT_APP_MEDUSA_REGION_ID;
  const baseUrl = "http://localhost:9000/store"; // Base URL API

  // --- 1. USE EFFECT: LẤY SẢN PHẨM MỚI NHẤT (Cho Sidebar) ---
  // Chỉ chạy 1 lần khi load trang để lấy 5 sp mới nhất
  useEffect(() => {
    const fetchNewest = async () => {
      try {
        const res = await fetch(`${baseUrl}/products?region_id=${regionId}&limit=5&order=-created_at`, {
          headers: { "x-publishable-api-key": process.env.REACT_APP_MEDUSA_PUBLISHABLE_KEY },
        });
        const data = await res.json();
        setNewestProducts(data.products || []);
      } catch (err) {
        console.error("Lỗi fetch newest products:", err);
      }
    };
    fetchNewest();
  }, [regionId]);

  // --- 2. USE EFFECT: LẤY SẢN PHẨM CHÍNH (Server-side Pagination & Filter) ---
  useEffect(() => {
    const fetchMainProducts = async () => {
      setIsLoading(true);
      try {
        let collectionId = null;

        // BƯỚC A: Nếu có chọn Category, cần tìm ID của Collection đó trước
        // (Vì Medusa API lọc theo ID chứ không theo tên)
        if (category !== "All") {
          const colRes = await fetch(`${baseUrl}/collections?limit=100`, {
             headers: { "x-publishable-api-key": process.env.REACT_APP_MEDUSA_PUBLISHABLE_KEY },
          });
          const colData = await colRes.json();
          const foundCol = colData.collections.find(c => c.title === category);
          if (foundCol) collectionId = foundCol.id;
        }

        // BƯỚC B: Gọi API lấy sản phẩm theo trang và collection ID
        const offset = (page - 1) * pageSize;
        let url = `${baseUrl}/products?region_id=${regionId}&limit=${pageSize}&offset=${offset}`;
        
        // Nếu tìm thấy ID collection thì thêm vào filter
        if (collectionId) {
          url += `&collection_id[]=${collectionId}`;
        }

        const res = await fetch(url, {
          headers: { "x-publishable-api-key": process.env.REACT_APP_MEDUSA_PUBLISHABLE_KEY },
        });

        if (!res.ok) throw new Error("API Error");
        
        const data = await res.json();
        setProducts(data.products || []);
        setCount(data.count || 0); // Quan trọng: lấy count từ server để tính phân trang

      } catch (err) {
        console.error("Lỗi fetch main products:", err);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMainProducts();
    
    // Scroll lên đầu mỗi khi đổi trang hoặc category
    window.scrollTo({ top: 0, behavior: "smooth" });

  }, [page, category, regionId]);

  // --- LOGIC PHÂN TRANG (PAGINATION) ---
  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  const changePage = (newPage) => {
    if (newPage < 1) newPage = 1;
    if (newPage > totalPages) newPage = totalPages;
    setSearchParams({ category, page: String(newPage) });
    setPageInput(String(newPage));
  };

  const handleCategoryChange = (newCategory) => {
    setSearchParams({ category: newCategory, page: "1" });
    setPageInput("1");
  };

  // Logic tạo danh sách trang (1, 2, ..., 10)
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

  // Logic Input nhập số trang
  const handlePageInputKeyDown = (e) => {
    if (e.key === "Enter") {
      const n = Number(pageInput);
      if (Number.isFinite(n) && n >= 1) changePage(n);
      else setPageInput(String(page));
    }
  };

  return (
    <>
      <div className="container-products">
        <div className="subContainer">
          {/* ====== SIDEBAR ====== */}
          <div className="side-bar">
            <SidebarCategories onSelectCategory={handleCategoryChange} />

            <div className="right-sidebar">
              {/* Banner Quảng Cáo */}
              <div className="promo-banner">
                <img src={OfficeBanner} alt="Office 2024" />
              </div>
              <Link to="/products/prod_01K73YARNBAD1FZ5QKGFS2T6W6" className="promo-banner" style={{ display: "block" }}>
                <img src={QuizletBanner} alt="Quizlet" style={{ width: "100%" }} />
              </Link>

              {/* Box Sản Phẩm Mới (Đã tối ưu lấy từ API riêng) */}
              <div className="new-products-box">
                <h3 className="new-products-title">Sản phẩm mới</h3>
                <div className="new-products-list">
                  {newestProducts.map((p) => {
                    const npPrice = p?.variants?.[0]?.calculated_price?.calculated_amount || 0;
                    return (
                      <Link key={p.id} to={`/products/${p.id}`} className="new-product-item">
                        <div className="new-product-thumb">
                          <img src={p.thumbnail || "https://via.placeholder.com/60"} alt={p.title} />
                        </div>
                        <div className="new-product-info">
                          <p className="new-product-name">{p.title}</p>
                          <p className="new-product-price">{npPrice.toLocaleString()} đ</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ====== NỘI DUNG CHÍNH ====== */}
          <div className="content">
            <div className="title-style">
              <h2>{category === "All" ? "Tất cả sản phẩm" : `Sản phẩm: ${category}`}</h2>
            </div>

            {isLoading ? (
              <div style={{ padding: "40px", textAlign: "center", fontSize: "18px", color: "#666" }}>
                Đang tải sản phẩm...
              </div>
            ) : (
              <>
                <div className="product-grid">
                  {products.length > 0 ? (
                    products.map((p) => <ProductCard key={p.id} product={p} />)
                  ) : (
                    <div style={{width: '100%', textAlign: 'center'}}>Không tìm thấy sản phẩm nào.</div>
                  )}
                </div>

                {/* Phân trang */}
                {products.length > 0 && (
                  <div className="pagination" style={{ marginTop: 20, display: "flex", gap: 10, alignItems: "center", justifyContent: "center" }}>
                    <button onClick={() => changePage(page - 1)} disabled={page <= 1} className="icon-pagination-button">
                      &lt;
                    </button>

                    <ul className="pagination-list" style={{ display: "flex", gap: 6, listStyle: "none", padding: 0 }}>
                      {getPageList().map((item, idx) =>
                        item === "left-ellipsis" || item === "right-ellipsis" ? (
                          <li key={idx} style={{ padding: "6px 8px" }}>...</li>
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

                    <button onClick={() => changePage(page + 1)} disabled={page >= totalPages} className="icon-pagination-button">
                      &gt;
                    </button>
                    
                    {/* Input nhập trang nhanh */}
                    <div style={{marginLeft: 10, display: 'flex', alignItems: 'center', gap: 5}}>
                        <span>Đến trang:</span>
                        <input 
                            type="number" 
                            value={pageInput}
                            onChange={(e) => setPageInput(e.target.value)}
                            onKeyDown={handlePageInputKeyDown}
                            onBlur={() => changePage(Number(pageInput))}
                            style={{width: 50, padding: 5, borderRadius: 4, border: '1px solid #ccc'}}
                        />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ====== HERO FOOTER & BENEFITS (Giữ nguyên) ====== */}
      <section className="hero-signup">
        <div className="hero-floating-layer" aria-hidden="true">
          <div className="hero-floating-card card-1"><img src={OfficeLogo} alt="Office" /></div>
          <div className="hero-floating-card card-2"><img src={NetflixLogo} alt="Netflix" /></div>
          <div className="hero-floating-card card-3"><img src={AdobeLogo} alt="Adobe" /></div>
          <div className="hero-floating-card card-4"><img src={DuolingoLogo} alt="Duolingo" /></div>
          <div className="hero-floating-card card-5"><img src={WindowsLogo} alt="Windows" /></div>
        </div>
        <div className="hero-floating-card card-6"><img src={KasperskyLogo} alt="Kaspersky" /></div>
        
        <div className="hero-inner">
          <div className="hero-badge"><span className="hero-badge-dot" />3.000+ khách hàng tin tưởng</div>
          <h2 className="hero-title">
            <span className="hero-title-gradient">Mua tài Khoản Chính Chủ, </span>
            <span className="hero-title-gradient">Key bản Quyền Giá Tốt</span>{" "}
            <span className="hero-title-gradient"> Tại Digitech Shop</span>
          </h2>
          <p className="hero-subtitle">Trải nghiệm mua sắm tiện lợi với tài khoản và key bản quyền chính hãng...</p>
          <Link to="/register" className="hero-cta"><span>Đăng ký tài khoản</span><span className="hero-cta-arrow">➜</span></Link>
        </div>
      </section>

      <section className="benefit-strip">
        <div className="benefit-strip-inner">
          <div className="benefit-item">
            <div className="benefit-icon">🚚</div>
            <div className="benefit-text"><p className="benefit-title">Xử lý nhanh</p><p className="benefit-sub">Trong vòng 3h</p></div>
          </div>
          <span className="benefit-divider" />
          <div className="benefit-item">
            <div className="benefit-icon">🛡️</div>
            <div className="benefit-text"><p className="benefit-title">Đội ngũ chuyên nghiệp</p><p className="benefit-sub">Hỗ trợ 24/7</p></div>
          </div>
          <span className="benefit-divider" />
          <div className="benefit-item">
            <div className="benefit-icon">🔑</div>
            <div className="benefit-text"><p className="benefit-title">Key chính hãng</p><p className="benefit-sub">Hợp pháp 100%</p></div>
          </div>
          <span className="benefit-divider" />
          <div className="benefit-item">
            <div className="benefit-icon">🎧</div>
            <div className="benefit-text"><p className="benefit-title">Cổng thanh toán</p><p className="benefit-sub">An toàn, uy tín</p></div>
          </div>
        </div>
      </section>
    </>
  );
}