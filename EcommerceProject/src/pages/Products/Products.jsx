import { useEffect, useState } from "react";
<<<<<<< HEAD
import { fetchProducts } from "../../services/api";
import ProductCard from "../../components/productCard/ProductCard";
=======
>>>>>>> c6e1c65e900e61c7abfc3ececeed678933ca946e
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/productCard/ProductCard";
import SidebarCategories from "../../components/SidebarCategories/SidebarCategories";
import "./products.css";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(
    searchParams.get("category") || "All"
  );
  const [products, setProducts] = useState([]);
<<<<<<< HEAD
  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);
=======
  const regionId = "reg_01K73N9QAJJ6DVF7FGKAKCJQG0";
>>>>>>> c6e1c65e900e61c7abfc3ececeed678933ca946e

 useEffect(() => {
    // Gọi API chỉ 1 lần, có region_id và API key
    fetch(`http://localhost:9000/store/products?region_id=${regionId}`, {
      headers: {
        "x-publishable-api-key":
          "pk_d4bf2faebacb69611013a1fd3c32bb8f76ab55d06f2068d92b0efd01a377ecfc",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("API response:", data);
        setProducts(data.products || []);
      })
      .catch((err) => {
        console.error("Lỗi khi fetch products:", err);
      });
  }, []); // chỉ chạy 1 lần khi load trang

  // Cập nhật category khi thay đổi URL
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
      setCategory(categoryFromUrl);
    }
  }, [searchParams]);

  // Cập nhật URL khi chọn category
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setSearchParams({ category: newCategory });
  };

  // Lọc sản phẩm
  const filteredProducts = products.filter((p) => {
    return (
<<<<<<< HEAD
      (category === "All" || p.category === category) &&
      p.title.toLowerCase().includes(search.toLowerCase())
=======
      (category === "All" || p.collection?.title === category) &&
      (p.title || "").toLowerCase().includes((search || "").toLowerCase())
>>>>>>> c6e1c65e900e61c7abfc3ececeed678933ca946e
    );
  });

  return (
<<<<<<< HEAD
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
=======
    <div className="container-products">
      <div className="subContainer">
        <div className="side-bar">
          {/* Sidebar bên trái */}
          <SidebarCategories onSelectCategory={handleCategoryChange} />
        </div>

        <div className="content">
          {/* Nội dung chính */}
          <div className="title-style" style={{ flex: 1 }}>
            <h2 style={{ marginBottom: "20px" }}>
              {category === "All" ? "Tất cả sản phẩm" : `Sản phẩm: ${category}`}
            </h2>
          </div>
          {/* Ô tìm kiếm */}
          {/* <div
            style={{
              marginBottom: "20px",
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          ></div> */}
          {/* Grid danh sách sản phẩm */}
          <div className="product-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))
            ) : (
              <p>Không tìm thấy sản phẩm</p>
            )}
          </div>
        </div>
>>>>>>> c6e1c65e900e61c7abfc3ececeed678933ca946e
      </div>
    </div>
  );
}
