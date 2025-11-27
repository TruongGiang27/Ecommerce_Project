import React from "react";
import "./productCard.css";
// import { fetchProducts } from "../../services/api"; // Không dùng thì có thể bỏ
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // 🔥 1. Lấy biến môi trường URL Backend (Cloudflare)
  const BACKEND_URL = process.env.REACT_APP_MEDUSA_BACKEND_URL;

  // 🔥 2. Hàm xử lý link ảnh: Đổi localhost -> Cloudflare URL
  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/200";
    
    // Nếu link ảnh chứa localhost:9000, thay thế bằng BACKEND_URL
    if (url.includes("localhost:9000")) {
      return url.replace("http://localhost:9000", BACKEND_URL);
    }
    return url;
  };

  const price = product?.variants?.[0]?.calculated_price?.calculated_amount || 0;

  // Hàm handleAddToCart này của bạn chưa được gắn vào nút giỏ hàng ở dưới, 
  // mình đã để nguyên nhưng bạn nhớ kiểm tra nút Button nhé.
  const handleAddToCart = () => {
    addToCart(product);
    navigate("/cart");
  };

  // console.log("Product data:", product);

  return (
    <div className="product-card">
      {/* Ảnh + overlay */}
      <div className="product-img">
        <img
          // 🔥 3. Áp dụng hàm getImageUrl vào đây
          src={getImageUrl(product?.thumbnail)}
          alt={product?.title}
        />
        <div className="explore-overlay">
          <button 
            onClick={() => navigate(`/products/${product?.id}`)} 
            className="btn-explore"
          >
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
            {product?.variants?.[0]?.original_price && (
              <span className="old-price">
                {(product?.variants?.[0]?.original_price / 100).toLocaleString()} đ
              </span>
            )}
          </div>
        </div>
        <div className="info-bottom">
          <p className="status">
            {product?.status === "published" || product?.status === "in_stock" 
              ? "Còn hàng" 
              : "Liên hệ"}
          </p>
          <button 
            onClick={() => navigate(`/products/${product?.id}`)} 
            className="btn-cart"
          >
            <FaShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;