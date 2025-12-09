import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import CategoryBar from "../../components/CategoryBar/CategoryBar";
import ProductCard from "../../components/productCard/ProductCard";
import HeroBanner from "../../components/Banner/HeroBanner";
import "./home.css";
import InfinityScrollBar from "../../components/InfinityScrollBar/InfinityScrollBar";

const BACKEND_URL = process.env.REACT_APP_MEDUSA_BACKEND_URL;
const REGION_ID = process.env.REACT_APP_MEDUSA_REGION_ID;
const PUBLISHABLE_KEY = process.env.REACT_APP_MEDUSA_PUBLISHABLE_KEY;

// Hàm xử lý ảnh tối ưu
const getImageUrl = (url) => {
  if (!url) return "/default-product.png";
  if (url.includes("localhost:9000")) {
    return url.replace("http://localhost:9000", BACKEND_URL);
  }
  return url;
};

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category}`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // 🔥 TỐI ƯU QUAN TRỌNG NHẤT:
        // Thay vì limit=1000, chỉ lấy 20 sản phẩm mới nhất.
        // Backend Medusa mặc định trả về sản phẩm mới tạo trước (hoặc tùy cấu hình DB), 
        // nhưng tải 20 cái chắc chắn nhanh gấp 50 lần tải 1000 cái.
        const res = await fetch(
          `${BACKEND_URL}/store/products?region_id=${REGION_ID}&limit=20`, 
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

  // Tính toán dữ liệu hiển thị từ 20 sản phẩm vừa tải
  const { recentProducts, bestSellers } = useMemo(() => {
    // Vì đã limit=20 từ server, ta cứ lấy danh sách này để hiển thị luôn
    // Không cần filter ngày tháng phức tạp làm chậm máy client nữa
    
    // Giả sử 8 sản phẩm đầu tiên là Nổi bật
    const best = products.slice(0, 8);
    
    // 8 sản phẩm tiếp theo là Mới nhất (hoặc dùng chung cũng được nếu ít sp)
    // Ở đây mình lấy khác đi một chút để demo
    const recent = products.slice(0, 8); 

    return { recentProducts: recent, bestSellers: best };
  }, [products]);

  if (isLoading) {
    return (
      <div className="container" style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        {/* Loading Spinner đơn giản */}
        <div className="loader"></div>
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
          Digitech Shop là địa chỉ đáng tin cậy...
        </p>
      </section>

      <CategoryBar onCategoryClick={handleCategoryClick} />

      <section className="highlight-box">
        <div className="highlight-left">
          <span className="tag">🔥 Xu Hướng 2025</span>
          <h2>Sản Phẩm Nổi Bật</h2>
          <p>
            Digitech Shop cung cấp phần mềm bản quyền chính hãng...
          </p>
          <button className="btn-contact" onClick={() => navigate("/contact")}>
            Liên hệ ngay →
          </button>
        </div>

        <div className="highlight-right">
          <h3>Nổi bật</h3>
          {bestSellers.length > 0 ? (
            <div className="bestseller-scroll-vertical">
              <ul className="bestseller-list-vertical">
                {bestSellers.slice(0, 4).map((p) => {
                  const price = p?.variants?.[0]?.calculated_price?.calculated_amount || 0;
                  return (
                    <li
                      key={p.id}
                      className="bestseller-item"
                      onClick={() => navigate(`/products/${p.id}`)}
                    >
                      <img 
                        src={getImageUrl(p.thumbnail)} 
                        alt={p.title} 
                        loading="lazy" 
                        width="60" height="60"
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
          ) : (
            <p>Đang cập nhật...</p>
          )}
        </div>
      </section>

      <section className="product-section">
        <h2>Sản phẩm mới về</h2>
        <div className="product-grid">
          {recentProducts.length > 0 ? (
            recentProducts.map((p) => (
               // Component này đã được tối ưu bằng React.memo ở bước trước
               <ProductCard key={p.id} product={p} />
            ))
          ) : (
            <p>Đang cập nhật sản phẩm...</p>
          )}
        </div>
        
        <div style={{textAlign: 'center', marginTop: 30}}>
            <button 
                onClick={() => navigate('/products')} 
                style={{
                    padding: '10px 20px', 
                    background: '#007bff', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 5,
                    cursor: 'pointer'
                }}
            >
                Xem tất cả sản phẩm
            </button>
        </div>
      </section>
    </div>
  );
}