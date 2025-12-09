import { useEffect, useState } from "react";
import ProductCard from "../../components/productCard/ProductCard";
import { useSearchParams, Link } from "react-router-dom";
import SidebarCategories from "../../components/SidebarCategories/SidebarCategories";
import "./products.css";

import OfficeBanner from "../../assets/images/banner-office.png";
import QuizletBanner from "../../assets/images/banner-quizlet.png";

// ⭐ Thêm đúng như Home
import HeroLanding from "../../components/HeroLanding/HeroLanding";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [products, setProducts] = useState([]);
  const pageSize = 12;
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [pageInput, setPageInput] = useState(String(Number(searchParams.get("page")) || 1));
  const regionId = process.env.REACT_APP_MEDUSA_REGION_ID;

  // Fetch products
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const limit = 100;
        let offset = 0;
        let allProducts = [];

        while (true) {
          const res = await fetch(
            `http://localhost:9000/store/products?region_id=${regionId}&limit=${limit}&offset=${offset}`,
            {
              headers: {
                "x-publishable-api-key": process.env.REACT_APP_MEDUSA_PUBLISHABLE_KEY,
              },
            }
          );

          const data = await res.json();
          const items = data.products || [];
          allProducts = allProducts.concat(items);

          if (items.length < limit) break;
          offset += limit;
        }

        setProducts(allProducts);
      } catch (err) {
        console.error("Lỗi khi fetch products:", err);
      }
    };

    fetchAllProducts();
  }, [regionId]);

  // Sync category + page
  useEffect(() => {
    const cat = searchParams.get("category");
    const pg = Number(searchParams.get("page")) || 1;

    setCategory(cat || "All");
    setPage(pg);
    setPageInput(String(pg));
  }, [searchParams]);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setPage(1);
    setPageInput("1");
    setSearchParams({ category: newCategory, page: "1" });
  };

  const filteredProducts = products.filter((p) => {
    return (
      (category === "All" || p.collection?.title === category) &&
      (p.title || "").toLowerCase().includes((search || "").toLowerCase())
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      const newPage = totalPages;
      setPage(newPage);
      setPageInput(String(newPage));
      setSearchParams({ category: category, page: String(newPage) });
    }
  }, [filteredProducts.length, totalPages]);

  const changePage = (newPage) => {
    if (newPage < 1) newPage = 1;
    if (newPage > totalPages) newPage = totalPages;

    setPage(newPage);
    setPageInput(String(newPage));
    setSearchParams({ category: category, page: String(newPage) });
  };

  const getPageList = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);
    const left = Math.max(2, page - 2);
    const right = Math.min(totalPages - 1, page + 2);

    if (left > 2) pages.push("left-ellipsis");
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push("right-ellipsis");

    pages.push(totalPages);
    return pages;
  };

  const startIndex = (page - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);

  // Newest products
  const newestProducts = [...products]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return (
  <>
    {/* ===== SIDEBAR + PRODUCT GRID ===== */}
    <div className="container-products">
      <div className="subContainer">
        {/* Sidebar */}
        <div className="side-bar">
          <SidebarCategories onSelectCategory={handleCategoryChange} />

          <div className="right-sidebar">
            <div className="promo-banner">
              <img src={OfficeBanner} alt="Office 2024 chính chủ" />
            </div>

            <Link
              to="/products/prod_01K73YARNBAD1FZ5QKGFS2T6W6"
              className="promo-banner"
            >
              <img src={QuizletBanner} alt="Quizlet banner" />
            </Link>

            {/* New product list */}
            <div className="new-products-box">
              <h3 className="new-products-title">Sản phẩm mới</h3>

              <div className="new-products-list">
                {newestProducts.map((p) => (
                  <Link key={p.id} to={`/products/${p.id}`} className="new-product-item">
                    <div className="new-product-thumb">
                      <img src={p.thumbnail} alt={p.title} />
                    </div>
                    <div className="new-product-info">
                      <p className="new-product-name">{p.title}</p>
                      <p className="new-product-price">
                        {(p?.variants?.[0]?.calculated_price?.calculated_amount || 0).toLocaleString()} đ
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="content">
          <div className="title-style">
            <h2>{category === "All" ? "Tất cả sản phẩm" : `Sản phẩm: ${category}`}</h2>
          </div>

          <div className="product-grid">
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((p) => <ProductCard key={p.id} product={p} />)
            ) : (
              <p>Không tìm thấy sản phẩm</p>
            )}
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button onClick={() => changePage(page - 1)} disabled={page <= 1} className="icon-pagination-button">
              ‹
            </button>

            <ul className="pagination-list">
              {getPageList().map((item, idx) =>
                item === "left-ellipsis" || item === "right-ellipsis" ? (
                  <li key={idx} className="ellipsis">…</li>
                ) : (
                  <li key={item}>
                    <button
                      onClick={() => changePage(item)}
                      className={`page-button ${item === page ? "active" : ""}`}
                    >
                      {item}
                    </button>
                  </li>
                )
              )}
            </ul>

            <button onClick={() => changePage(page + 1)} disabled={page >= totalPages} className="icon-pagination-button">
              ›
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* ⭐⭐⭐ MỚI: HERO LANDING ĐƯA LÊN TRÊN ⭐⭐⭐ */}
    <HeroLanding />

    {/* ⭐⭐⭐ BENEFIT BOX ĐƯA XUỐNG CUỐI TRANG ⭐⭐⭐ */}
    <section className="benefit-strip">
      <div className="benefit-strip-inner">

        <div className="benefit-item">
          <div className="benefit-icon">🚚</div>
          <div className="benefit-text">
            <p className="benefit-title">Xử lý nhanh</p>
            <p className="benefit-sub">Trong vòng 3h</p>
          </div>
        </div>

        <span className="benefit-divider" />

        <div className="benefit-item">
          <div className="benefit-icon">🛡️</div>
          <div className="benefit-text">
            <p className="benefit-title">Đội ngũ chuyên nghiệp</p>
            <p className="benefit-sub">Hỗ trợ 24/7</p>
          </div>
        </div>

        <span className="benefit-divider" />

        <div className="benefit-item">
          <div className="benefit-icon">🔑</div>
          <div className="benefit-text">
            <p className="benefit-title">Key chính hãng</p>
            <p className="benefit-sub">Hợp pháp 100%</p>
          </div>
        </div>

        <span className="benefit-divider" />

        <div className="benefit-item">
          <div className="benefit-icon">🎧</div>
          <div className="benefit-text">
            <p className="benefit-title">Cổng thanh toán</p>
            <p className="benefit-sub">An toàn, uy tín</p>
          </div>
        </div>

      </div>
    </section>
  </>
);
}