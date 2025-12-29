import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import CategoryBar from "../../components/CategoryBar/CategoryBar";
import ProductCard from "../../components/productCard/ProductCard";
import HeroBanner from "../../components/Banner/HeroBanner";
import InfinityScrollBar from "../../components/InfinityScrollBar/InfinityScrollBar";
import HeroLanding from "../../components/HeroLanding/HeroLanding";
import "./home.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ENV Setup
  const regionId = import.meta.env?.VITE_MEDUSA_REGION_ID || process.env.REACT_APP_MEDUSA_REGION_ID;
  const BACKEND_URL = import.meta.env?.VITE_MEDUSA_BACKEND_URL || process.env.REACT_APP_MEDUSA_BACKEND_URL;
  const API_KEY = import.meta.env?.VITE_MEDUSA_PUBLISHABLE_KEY || process.env.REACT_APP_MEDUSA_PUBLISHABLE_KEY;

  const getImageUrl = (url) => {
    if (!url) return "/default-product.png";
    if (url.includes("localhost:9000")) {
      return url.replace("http://localhost:9000", BACKEND_URL);
    }
    return url;
  };

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category}`);
  };

  useEffect(() => {
    setLoading(true);
    fetch(`${BACKEND_URL}/store/products?region_id=${regionId}&limit=1000`, {
      headers: {
        "x-publishable-api-key": API_KEY,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
      })
      .catch((err) => console.error("Lỗi khi lấy sản phẩm:", err))
      .finally(() => setLoading(false));
  }, [BACKEND_URL, regionId, API_KEY]);

  // === PHẦN BẠN MUỐN SỬA Ở ĐÂY ===
  const { recentProducts, bestSellers } = useMemo(() => {
    // 1. LOGIC MỚI (Lấy từ Product sang): Sắp xếp theo ngày tạo mới nhất
    // Thay vì filter 30 ngày, ta sort date giảm dần để luôn có sản phẩm
    const sortedByDate = [...products].sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA; // Mới nhất lên đầu
    });

    // Lấy 8 sản phẩm mới nhất để hiển thị ra Grid (Home cần nhiều hơn sidebar của Product)
    const recent = sortedByDate.slice(0, 8);

    // 2. Logic Best Sellers (Giữ nguyên hoặc tùy chỉnh)
    // Tạm thời lấy 8 sản phẩm đầu tiên của danh sách gốc làm bestseller
    const best = products.slice(0, 8);

    return { recentProducts: recent, bestSellers: best };
  }, [products]);

  return (
    <div className="container">
      <HeroBanner />
      <InfinityScrollBar />

      <section className="intro section-box">
        <h1>Digitech Shop</h1>
        <p>
          Digitech Shop là địa chỉ đáng tin cậy, chuyên cung cấp phần mềm bản
          quyền và dịch vụ nâng cấp tài khoản chính chủ. Chúng tôi cam kết mang
          đến chất lượng vượt trội, giá cả hợp lý và sẵn sàng hỗ trợ tận tâm
          24/7.
        </p>
      </section>

      <CategoryBar onCategoryClick={handleCategoryClick} />

      <section className="highlight-box">
        <div className="highlight-left">
          <span className="tag">🔥 Xu Hướng 2025</span>
          <h2>Sản Phẩm Nổi Bật Nhất Năm 2025</h2>
          <p>
            Digitech Shop cung cấp phần mềm bản quyền chính hãng đa dạng: AI,
            Microsoft Office, thiết kế đồ họa, VPN/Antivirus...
          </p>
          <button className="btn-contact" onClick={() => navigate("/contact")}>
            Liên hệ tư vấn tại đây →
          </button>
        </div>

        <div className="highlight-right">
          <h3>Nổi bật</h3>
          {loading ? (
             <div className="loading-spinner">Đang tải...</div>
          ) : bestSellers.length > 0 ? (
            <>
              {bestSellers.length > 4 && (
                <div className="bestseller-scroll-vertical">
                  <ul className="bestseller-list-vertical">
                    {bestSellers.slice(2).map((p) => {
                      const price =
                        p?.variants?.[0]?.calculated_price?.calculated_amount || 0;
                      const image = getImageUrl(p.thumbnail);

                      return (
                        <li
                          key={p.id}
                          className="bestseller-item"
                          onClick={() => navigate(`/products/${p.id}`)}
                        >
                          <img src={image} alt={p.title} />
                          <div>
                            <h4>{p.title}</h4>
                            <p className="price-highlight">
                              {price.toLocaleString()} đ
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <p>Đang cập nhật...</p>
          )}
        </div>
      </section>

      {/* === GIỮ NGUYÊN CODE UI SẢN PHẨM MỚI CỦA HOME === */}
      <section className="product-section">
        <h2>Sản phẩm mới nhất</h2>
        <div className="product-grid">
          {loading ? (
             <p>Đang tải sản phẩm mới...</p>
          ) : recentProducts.length > 0 ? (
            // Vẫn dùng Grid của Home để hiển thị danh sách đã lọc theo logic mới
            recentProducts.map((p) => <ProductCard key={p.id} product={p} />)
          ) : (
            <p>Chưa có sản phẩm mới</p>
          )}
        </div>
      </section>

      <HeroLanding />

      <section className="benefit-strip">
        <div className="benefit-strip-inner">
          <div className="benefit-item">
            <div className="benefit-icon">🚚</div>
            <div className="benefit-text">
              <p className="benefit-title">Xử lý nhanh</p>
              <p className="benefit-sub">Trong vòng 3h</p>
            </div>
          </div>
          <span className="benefit-divider" />
          <div className="benefit-item">
            <div className="benefit-icon">🛡️</div>
            <div className="benefit-text">
              <p className="benefit-title">Đội ngũ chuyên nghiệp</p>
              <p className="benefit-sub">Hỗ trợ 24/7</p>
            </div>
          </div>
          <span className="benefit-divider" />
          <div className="benefit-item">
            <div className="benefit-icon">🔑</div>
            <div className="benefit-text">
              <p className="benefit-title">Key chính hãng</p>
              <p className="benefit-sub">Hợp pháp 100%</p>
            </div>
          </div>
          <span className="benefit-divider" />
          <div className="benefit-item">
            <div className="benefit-icon">🎧</div>
            <div className="benefit-text">
              <p className="benefit-title">Cổng thanh toán</p>
              <p className="benefit-sub">An toàn, uy tín</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}