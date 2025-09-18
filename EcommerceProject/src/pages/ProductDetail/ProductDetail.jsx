import { useParams } from "react-router-dom";
import products from "../../data/products";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));
  const { addToCart } = useContext(CartContext);

  if (!product) return <h2>Sản phẩm không tồn tại</h2>;

  return (
    <div className="container">
      <h2>{product.name}</h2>
      <img
        src={product.img}
        alt={product.name}
        style={{ width: "300px", borderRadius: "10px" }}
      />
      <p>Giá: {product.price.toLocaleString()} đ</p>
      <button className="btn" onClick={() => addToCart(product)}>
        Thêm vào giỏ
      </button>
    </div>
  );
}
