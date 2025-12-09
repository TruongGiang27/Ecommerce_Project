import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryBar from "../../components/CategoryBar/CategoryBar";
import ProductCard from "../../components/productCard/ProductCard";
import HeroBanner from "../../components/Banner/HeroBanner";
import "./home.css";
import InfinityScrollBar from "../../components/InfinityScrollBar/InfinityScrollBar";
import HeroLanding from "../../components/HeroLanding/HeroLanding";

export default function Home() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const regionId = process.env.REACT_APP_MEDUSA_REGION_ID;
  const BACKEND_URL = process.env.REACT_APP_MEDUSA_BACKEND_URL;

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
    fetch(`${BACKEND_URL}/store/products?region_id=${regionId}&limit=1000`, {
      headers: {
        "x-publishable-api-key": process.env.REACT_APP_MEDUSA_PUBLISHABLE_KEY,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
      })
      .catch((err) => console.error("Lỗi khi lấy sản phẩm:", err));
  }, [BACKEND_URL, regionId]);

  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);

  const recentProducts = products.filter((p) => {
    if (!p.created_at) return false;
    const createdAt = new Date(p.created_at);
    return createdAt >= thirtyDaysAgo;
  });

  const bestSellers = products.slice(0, 8);

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
            Microsoft Office, thiết kế đồ họa, VPN/Antivirus... đáp ứng mọi nhu
            cầu học tập, công việc và giải trí với giá cực kỳ cạnh tranh.
          </p>
          <button className="btn-contact" onClick={() => navigate("/contact")}>
            Liên hệ tư vấn tại đây →
          </button>
        </div>

        <div className="highlight-right">
          <h3>Nổi bật</h3>
          {bestSellers.length > 0 ? (
            <>
              {bestSellers.length > 4 && (
                <div className="bestseller-scroll-vertical">
                  <ul className="bestseller-list-vertical">
                    {bestSellers.slice(2).map((p) => {
                      const price =
                        p?.variants?.[0]?.calculated_price?.calculated_amount ||
                        0;

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
            <p>Đang tải sản phẩm...</p>
          )}
        </div>
      </section>

      <section className="product-section">
        <h2>Sản phẩm mới nhất</h2>
        <div className="product-grid">
          {recentProducts.length > 0 ? (
            recentProducts
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .slice(0, 8)
              .map((p) => <ProductCard key={p.id} product={p} />)
          ) : (
            <p>Không có sản phẩm mới nhất</p>
          )}
        </div>
      </section>

      {/* ⭐ THÊM HERO LANDING Ở CUỐI */}
      <HeroLanding />

      {/* ⭐ THÊM LẠI KHUNG ĐEN BENEFIT STRIP (BẢN GỐC CỦA BẠN) */}
      <section className="benefit-strip">
        <div className="benefit-strip-inner">
          <div className="benefit-item">
            <div className="benefit-icon">
              <span role="img" aria-label="truck">🚚</span>
            </div>
            <div className="benefit-text">
              <p className="benefit-title">Xử lý nhanh</p>
              <p className="benefit-sub">Trong vòng 3h</p>
            </div>
          </div>

          <span className="benefit-divider" />

          <div className="benefit-item">
            <div className="benefit-icon">
              <span role="img" aria-label="support">🛡️</span>
            </div>
            <div className="benefit-text">
              <p className="benefit-title">Đội ngũ chuyên nghiệp</p>
              <p className="benefit-sub">Hỗ trợ 24/7</p>
            </div>
          </div>

          <span className="benefit-divider" />

          <div className="benefit-item">
            <div className="benefit-icon">
              <span role="img" aria-label="key">🔑</span>
            </div>
            <div className="benefit-text">
              <p className="benefit-title">Key chính hãng</p>
              <p className="benefit-sub">Hợp pháp 100%</p>
            </div>
          </div>

          <span className="benefit-divider" />

          <div className="benefit-item">
            <div className="benefit-icon">
              <span role="img" aria-label="headset">🎧</span>
            </div>
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
