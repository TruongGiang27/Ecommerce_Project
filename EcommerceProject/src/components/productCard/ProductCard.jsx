import { Link } from "react-router-dom";
import { useState } from "react";
// import { CartContext } from "../../context/CartContext";
import "./productCard.css";
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
      </div>
    </div>
  );
}
