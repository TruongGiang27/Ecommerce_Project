import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { fetchProductById } from "../../services/api";
import { CartContext } from "../../context/CartContext";
import "./productDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  // const product = products.find((p) => p.id === parseInt(id));

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetchProductById(id).then(setProduct);
  }, [id]);

  if (!product) return <h2>Sản phẩm không tồn tại</h2>;

  return (
    <div className="container">
      <div className="product-detail">
        <div className="product-image">
          <img src={product.img} alt={product.name} />
        </div>
        <div className="product-info">
          <h2>{product.name}</h2>
          <div>Status: Còn hàng</div>
          <p>Giá: {product.price.toLocaleString()} VND</p>
          <p>Danh mục: {product.category}</p>
          <p>Mô tả: {product.description}</p>
          <p>Phần mềm bản quyền, giao ngay sau khi thanh toán.</p>
          <p>Hỗ trợ cài đặt và hướng dẫn sử dụng miễn phí.</p>
          <p>Liên hệ hỗ trợ: 0123456789</p>
          <button className="btn" onClick={() => addToCart(product)}>
            Thêm vào giỏ
          </button>
          <button
            className="btn btn-buy"
            onClick={() => {
              addToCart(product);
              window.location.href = "/cart";
            }}
          >
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
}
