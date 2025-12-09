import React, { useMemo } from "react";
import "./productCard.css";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

// 🔥 1. TỐI ƯU: Đưa biến tĩnh và hàm ra ngoài component
// Giúp React không phải khởi tạo lại hàm này mỗi lần component render
const BACKEND_URL = process.env.REACT_APP_MEDUSA_BACKEND_URL;

const getImageUrl = (url) => {
  if (!url) return "https://via.placeholder.com/200";
  // Nếu link ảnh chứa localhost:9000, thay thế bằng BACKEND_URL
  if (url.includes("localhost:9000")) {
    return url.replace("http://localhost:9000", BACKEND_URL);
  }
  return url;
};

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  // const { addToCart } = useCart(); // Nếu chưa dùng thì comment lại để đỡ tốn bộ nhớ

  // 🔥 2. TỐI ƯU: Sử dụng useMemo để tính toán giá trị
  // Chỉ tính lại khi object product thay đổi, giúp CPU nghỉ ngơi
  const price = useMemo(() => {
    return product?.variants?.[0]?.calculated_price?.calculated_amount || 0;
  }, [product]);

  const originalPrice = useMemo(() => {
    return product?.variants?.[0]?.original_price || 0;
  }, [product]);

  const statusLabel = useMemo(() => {
    const hasStock = product?.variants?.some((v) => {
      if (typeof v.inventory_quantity === "number") return v.inventory_quantity > 0;
      if (v.manage_inventory === false) return true;
      if (v.stock_status === "in_stock") return true;
      return false;
    });
    return hasStock ? "Còn hàng" : "Liên hệ";
  }, [product]);

  // Điều hướng nhanh
  const handleNavigate = () => {
    navigate(`/products/${product?.id}`);
  };

  return (
    <div className="product-card">
      {/* Ảnh + overlay */}
      <div className="product-img">
        {/* 🔥 3. TỐI ƯU QUAN TRỌNG NHẤT: Lazy Loading Ảnh */}
        <img
          src={getImageUrl(product?.thumbnail)}
          alt={product?.title}
          loading="lazy"      // Chỉ tải khi cuộn tới
          decoding="async"    // Giải mã ảnh không chặn luồng chính
          width="200"         // Gợi ý kích thước để tránh nhảy layout (CLS)
          height="200"
          style={{ objectFit: "cover" }} 
        />
        <div className="explore-overlay">
          <button onClick={handleNavigate} className="btn-explore">
            Khám phá ngay →
          </button>
        </div>
      </div>

      {/* Thông tin sản phẩm */}
      <div className="product-info">
        <div className="info-top">
          <h3 className="title">{product?.title}</h3>
          <div className="price-box">
            <span className="price">{price.toLocaleString()} đ</span>
            {originalPrice > 0 && (
              <span className="old-price">
                {(originalPrice / 100).toLocaleString()} đ
              </span>
            )}
          </div>
        </div>
        <div className="info-bottom">
          <p className="status">
             {/* Dùng statusLabel đã tính toán ở trên */}
             {statusLabel}
          </p>
          <button onClick={handleNavigate} className="btn-cart">
            <FaShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
};

// 🔥 4. TỐI ƯU: Dùng React.memo
// Giúp component không bị render lại nếu props "product" không đổi
// Cực kỳ hiệu quả khi hiển thị danh sách dài
export default React.memo(ProductCard);