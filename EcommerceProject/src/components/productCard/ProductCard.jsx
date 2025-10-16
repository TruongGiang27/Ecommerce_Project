import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
// import { CartContext } from "../../context/CartContext";
import "./productCard.css";
<<<<<<< HEAD
import { useEffect } from "react";
import { fetchProducts } from "../../services/api";

export default function ProductCard({ product }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error loading products: {error}</p>;
  if (!products) return <p>Product not found</p>;

  return (
    <div>
      <div key={product.id} className="product-card">
        <Link to={`/products/${product.id}`} className="product-link">
          <img src={product.thumbnail} alt={product.name} />
        </Link>
        <h3>{product.title}</h3>
        {/* <p>{product.price.toLocaleString()} VND</p> */}
        <h5>
          {product.description?.length > 100
            ? product.description.slice(0, 100) + "..."
            : product.description}
        </h5>
=======
import { FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

const price = product?.variants?.[0]?.calculated_price?.calculated_amount || 0;

  const handleAddToCart = () => {
    addToCart(product);
    navigate("/cart"); // 👉 Chuyển sang giỏ hàng ngay sau khi thêm
  };
  console.log("Product data:", product)


  return (
    <div className="product-card">
      {/* Ảnh + overlay */}
      <div className="product-img">
        <img
          src={product?.thumbnail || "https://via.placeholder.com/200"}
          alt={product?.title}
        />
        <div className="explore-overlay">
          <Link to={`/products/${product.id}`} className="btn-explore">
            Khám phá ngay →
          </Link>
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
            {product?.status === "in_stock" ? "Còn hàng" : "Liên hệ"}
          </p>
          <button onClick={handleAddToCart} className="btn-cart">
            <FaShoppingCart />
          </button>
        </div>
>>>>>>> c6e1c65e900e61c7abfc3ececeed678933ca946e
      </div>
    </div>
  );
};

export default ProductCard;
