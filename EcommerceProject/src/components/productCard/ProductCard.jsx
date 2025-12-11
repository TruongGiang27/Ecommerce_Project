import React from "react";
import "./productCard.css";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const BACKEND_URL = process.env.REACT_APP_MEDUSA_BACKEND_URL;

  // Hàm sửa link ảnh Medusa -> Cloudflare
  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/200";

    if (url.includes("localhost:9000")) {
      return url.replace("http://localhost:9000", BACKEND_URL);
    }
    return url;
  };

  // Lấy giá sản phẩm
  const price = product?.variants?.[0]?.calculated_price?.calculated_amount || 0;

  // -----------------------------
  // 🔥 CHECK TỒN KHO CHUẨN MEDUSA
  // -----------------------------
  const hasStock = product?.variants?.some((v) => {
    // Nếu dùng Classic Inventory của Medusa
    if (typeof v.inventory_quantity === "number") {
      return v.inventory_quantity > 0;
    }

    // Nếu không quản lý tồn kho -> coi như có hàng
    if (v.manage_inventory === false) return true;

    // Nếu bản cài có stock_status
    if (v.stock_status === "in_stock") return true;

    return false;
  });

  const statusLabel = hasStock ? "Còn hàng" : "Liên hệ";

  const handleAddToCart = () => {
    addToCart(product);
    navigate("/cart");
  };

  return (
    <div className="product-card">
      {/* Ảnh + overlay */}
      <div className="product-img">
        <img
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
          {/* 🔥 DÙNG hasStock CHỈNH XÁC */}
          <p className="status">{statusLabel}</p>

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
