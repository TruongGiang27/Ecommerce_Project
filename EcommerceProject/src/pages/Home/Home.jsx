import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import CategoryBar from "../../components/CategoryBar/CategoryBar";
import ProductCard from "../../components/productCard/ProductCard";
import HeroBanner from "../../components/Banner/HeroBanner";
import "./home.css";
import InfinityScrollBar from "../../components/InfinityScrollBar/InfinityScrollBar";

// 🔥 1. TỐI ƯU: Đưa biến tĩnh ra ngoài component để không khởi tạo lại
const BACKEND_URL = process.env.REACT_APP_MEDUSA_BACKEND_URL;
const REGION_ID = process.env.REACT_APP_MEDUSA_REGION_ID;
const PUBLISHABLE_KEY = process.env.REACT_APP_MEDUSA_PUBLISHABLE_KEY;

// 🔥 2. TỐI ƯU: Hàm xử lý ảnh đưa ra ngoài (hoặc dùng useCallback)
const getImageUrl = (url) => {
  if (!url) return "/default-product.png";
  if (url.includes("localhost:9000")) {
    return url.replace("http://localhost:9000", BACKEND_URL);
  }
  return url;
};

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Thêm state loading
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category}`);
  };

  useEffect(() => {
    // 🔥 3. TỐI ƯU: Fetch dữ liệu
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${BACKEND_URL}/store/products?region_id=${REGION_ID}&limit=1000`, // Lưu ý: 1000 item là khá nặng, nên cân nhắc giảm xuống nếu backend hỗ trợ sort
          {
            headers: {
              "x-publishable-api-key": PUBLISHABLE_KEY,
            },
          }
        );
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error("Lỗi khi lấy sản phẩm:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 🔥 4. TỐI ƯU: Sử dụng useMemo để tính toán danh sách sản phẩm
  // Giúp React KHÔNG phải tính lại logic lọc 1000 sản phẩm mỗi khi component re-render
  const { recentProducts, bestSellers } = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const recent = products.filter((p) => {
      if (!p.created_at) return false;
      const createdAt = new Date(p.created_at);
      return createdAt >= thirtyDaysAgo;
    });

    // Sort giảm dần theo ngày tạo để lấy mới nhất thực sự
    const sortedRecent = recent.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const best = products.slice(0, 8);

    return { recentProducts: sortedRecent, bestSellers: best };
  }, [products]);

  // Nếu đang tải dữ liệu ban đầu, hiển thị loading đơn giản để tránh layout bị nhảy
  if (isLoading) {
    return (
      <div className="container" style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div className="loader"></div> 
        <p style={{marginLeft: 10}}>Đang tải dữ liệu shop...</p>
      </div>
    );
  }

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
                          {/* 🔥 5. TỐI ƯU: Thêm loading="lazy" cho ảnh list nhỏ */}
                          <img 
                            src={image} 
                            alt={p.title} 
                            loading="lazy" 
                            width="60" height="60" // Gợi ý kích thước để browser render nhanh hơn
                          />
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

      <section className="product-section">
        <h2>Sản phẩm mới nhất</h2>
        <div className="product-grid">
          {recentProducts.length > 0 ? (
            recentProducts
              .slice(0, 8)
              .map((p) => (
                // ProductCard đã được tối ưu ở bước trước (có memo và lazy load)
                <ProductCard key={p.id} product={p} />
              ))
          ) : (
            <p>Không có sản phẩm mới nhất</p>
          )}
        </div>
      </section>
    </div>
  );
}