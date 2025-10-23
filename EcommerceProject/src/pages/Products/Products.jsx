import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/productCard/ProductCard";
import SidebarCategories from "../../components/SidebarCategories/SidebarCategories";
import "./Products.css";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(
    searchParams.get("category") || "All"
  );
  const [products, setProducts] = useState([]);
  const regionId = process.env.REACT_APP_MEDUSA_REGION_ID;

 useEffect(() => {
    // Gọi API chỉ 1 lần, có region_id và API key
    fetch(`http://localhost:9000/store/products?region_id=${regionId}`, {
      headers: {
        "x-publishable-api-key":
          process.env.REACT_APP_MEDUSA_PUBLISHABLE_KEY,
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
      (category === "All" || p.collection?.title === category) &&
      (p.title || "").toLowerCase().includes((search || "").toLowerCase())
    );
  });

  return (
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
      </div>
    </div>
  );
}
