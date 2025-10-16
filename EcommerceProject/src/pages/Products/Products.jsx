import { useEffect, useState } from "react";
import { fetchProducts } from "../../services/api";
import ProductCard from "../../components/productCard/ProductCard";
import { useSearchParams } from "react-router-dom";
import "./products.css";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(
    searchParams.get("category") || "All"
  );
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
      setCategory(categoryFromUrl);
    }
  }, [searchParams]);

  //Cập nhật URL khi thay đổi category
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setSearchParams({ category: newCategory });
  };

  // Lọc sản phẩm theo category và tìm kiếm
  const filteredProducts = products.filter((p) => {
    return (
      (category === "All" || p.category === category) &&
      p.title.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="products-page">
      <div className="products-header">
        <h1 className="products-title">
          {category === "All" ? "Tất cả sản phẩm" : `Sản phẩm: ${category}`}
        </h1>

        <div className="products-stats">
          <span>{filteredProducts.length} sản phẩm</span>
        </div>
      </div>

      <div className="products-container">
        <aside className="filters-sidebar">
          <div className="filter-section">
            <h3>Tìm kiếm</h3>
            <input
              className="filter-search"
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-section">
            <h3>Danh mục</h3>
            <div className="category-filters">
              <button
                className={`category-btn ${category === "All" ? "active" : ""}`}
                onClick={() => handleCategoryChange("All")}
              >
                Tất cả
              </button>
              {["Thiết kế", "Văn phòng", "Lập trình"].map((cat) => (
                <button
                  key={cat}
                  className={`category-btn ${category === cat ? "active" : ""}`}
                  onClick={() => handleCategoryChange(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Sắp xếp</h3>
            <select className="sort-select">
              <option value="newest">Mới nhất</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
            </select>
          </div>
        </aside>

        <main className="products-grid">
          {filteredProducts.length > 0 ? (
            <div className="grid">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>Không tìm thấy sản phẩm phù hợp</p>
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
