import { Link } from "react-router-dom";
// import { useContext, useState } from "react";
// import { CartContext } from "../../context/CartContext";
import "./productCard.css";

export default function ProductCard({ product }) {
  // const { addToCart } = useContext(CartContext);
  // const [success, setSuccess] = useState(false);

  // const handleAddToCart = (product) => {
  //   addToCart(product);
  //   setSuccess(true);
  //   setTimeout(() => setSuccess(false), 2000); // thông báo tự ẩn sau 2s
  // };

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-link">
        <img src={product.img} alt={product.name} />
      </Link>
      <h3>{product.name}</h3>
      <p>{product.price.toLocaleString()} VND</p>
    </div>
  );
}
