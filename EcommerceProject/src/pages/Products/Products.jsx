import { useEffect, useState } from "react";
import ProductCard from "../../components/productCard/ProductCard";
import { useSearchParams, Link } from "react-router-dom";
import SidebarCategories from "../../components/SidebarCategories/SidebarCategories";
import "./products.css";
import OfficeBanner from "../../assets/images/banner-office.png";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(
    searchParams.get("category") || "All"
  );
  const [products, setProducts] = useState([]);
  const pageSize = 12;
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  // NEW: input state cho trang (chuỗi để kiểm soát input)
  const [pageInput, setPageInput] = useState(
    String(Number(searchParams.get("page")) || 1)
  );
  const regionId = process.env.REACT_APP_MEDUSA_REGION_ID;
<<<<<<< HEAD

  useEffect(() => {
    // Gọi API nhiều trang để lấy hết sản phẩm (limit/offset)
=======
 const  BACKEND_URL = process.env.REACT_APP_MEDUSA_BACKEND_URL;


 useEffect(() => {
    // Gọi API nhiều trang để lấy hết sản phẩm (limit/offset). Nếu API của bạn dùng cursor,
    // cần điều chỉnh sang starting_after/next_cursor theo docs.
>>>>>>> e3c53243d78c6f88f0f26722427ead8fcda94da0
    const fetchAllProducts = async () => {
      try {
        const limit = 100; // tăng lên tùy nhu cầu / theo giới hạn server
        let offset = 0;
        let allProducts = [];

        while (true) {
          const res = await fetch(
            `${BACKEND_URL}/store/products?region_id=${regionId}&limit=${limit}&offset=${offset}`,
            {
              headers: {
                "x-publishable-api-key":
                  process.env.REACT_APP_MEDUSA_PUBLISHABLE_KEY,
              },
            }
          );

          if (!res.ok) {
            throw new Error(`Fetch error: ${res.status}`);
          }

          const data = await res.json();
          console.log("API page response:", data);

          const items = data.products || data.items || data.data || [];
          allProducts = allProducts.concat(items);

          if (items.length < limit) {
            break;
          }

          offset += limit;
        }

        setProducts(allProducts);
      } catch (err) {
        console.error("Lỗi khi fetch products:", err);
      }
    };

    fetchAllProducts();
  }, []); // chỉ chạy 1 lần khi load trang

  // Sync category + page từ URL
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    const pageFromUrl = Number(searchParams.get("page")) || 1;

    if (categoryFromUrl) {
      setCategory(categoryFromUrl);
    } else {
      setCategory("All");
    }

    setPage(pageFromUrl);
    setPageInput(String(pageFromUrl)); // sync input khi URL thay đổi
  }, [searchParams]);

  // Khi chọn category: cập nhật URL và đặt lại trang về 1
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setPage(1);
    setPageInput("1");
    setSearchParams({ category: newCategory, page: String(1) });
  };

  // Lọc sản phẩm
  const filteredProducts = products.filter((p) => {
    return (
      (category === "All" || p.collection?.title === category) &&
      (p.title || "").toLowerCase().includes((search || "").toLowerCase())
    );
  });

  // pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));

  // nếu page lớn hơn totalPages (ví dụ sau khi lọc), đưa về totalPages
  useEffect(() => {
    if (page > totalPages) {
      const newPage = totalPages;
      setPage(newPage);
      setPageInput(String(newPage));
      setSearchParams({ category: category, page: String(newPage) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredProducts.length, totalPages]);

  const changePage = (newPage) => {
    if (newPage < 1) newPage = 1;
    if (newPage > totalPages) newPage = totalPages;
    setPage(newPage);
    setPageInput(String(newPage));
    setSearchParams({ category: category, page: String(newPage) });

    try {
      const container = document.querySelector(".container-products");
      if (container && typeof container.scrollIntoView === "function") {
        container.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // NEW: tạo danh sách trang để hiển thị nút (show ellipsis khi nhiều trang)
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

  // NEW: handlers cho input số trang
  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  const applyPageInput = () => {
    const n = Number(pageInput);
    if (!Number.isFinite(n) || n < 1) {
      setPageInput(String(page));
      return;
    }
    changePage(Math.min(Math.max(1, Math.floor(n)), totalPages));
  };

  const handlePageInputKeyDown = (e) => {
    if (e.key === "Enter") {
      applyPageInput();
    }
  };

  const handlePageInputBlur = () => {
    applyPageInput();
  };

  const startIndex = (page - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + pageSize
  );

  // ✅ Sản phẩm mới: sort theo created_at, lấy 5 sản phẩm đầu
  const newestProducts = [...products]
    .sort((a, b) => {
      const da = new Date(a.created_at || 0).getTime();
      const db = new Date(b.created_at || 0).getTime();
      return db - da;
    })
    .slice(0, 5);

  return (
    <div className="container-products">
      <div className="subContainer">
        {/* Sidebar bên trái */}
        <div className="side-bar">
          <SidebarCategories onSelectCategory={handleCategoryChange} />

          {/* ⭐ Banner + Sản phẩm mới nằm dưới Sidebar */}
          <div className="right-sidebar">
            {/* Banner Office */}
            <div className="promo-banner">
              <img src={OfficeBanner} alt="Office 2024 chính chủ" />
            </div>

            {/* Banner Quizlet (tạm dùng placeholder) */}
            <div className="promo-banner">
              <img
                src="https://via.placeholder.com/260x360?text=Quizlet+Banner"
                alt="Quizlet banner"
              />
            </div>

            {/* Box Sản phẩm mới */}
            <div className="new-products-box">
              <h3 className="new-products-title">Sản phẩm mới</h3>
              <div className="new-products-list">
                {newestProducts.map((p) => {
                  const npPrice =
                    p?.variants?.[0]?.calculated_price?.calculated_amount || 0;
                  return (
                    <Link
                      key={p.id}
                      to={`/products/${p.id}`}
                      className="new-product-item"
                    >
                      <div className="new-product-thumb">
                        <img
                          src={p.thumbnail || "https://via.placeholder.com/60"}
                          alt={p.title}
                        />
                      </div>
                      <div className="new-product-info">
                        <p className="new-product-name">{p.title}</p>
                        <p className="new-product-price">
                          {npPrice.toLocaleString()} đ
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Nội dung chính */}
        <div className="content">
          <div className="title-style" style={{ flex: 1 }}>
            <h2 style={{ marginBottom: "20px" }}>
              {category === "All"
                ? "Tất cả sản phẩm"
                : `Sản phẩm: ${category}`}
            </h2>
          </div>

          {/* Grid danh sách sản phẩm */}
          <div className="product-grid">
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))
            ) : (
              <p>Không tìm thấy sản phẩm</p>
            )}
          </div>

          {/* Pagination controls */}
          <div
            className="pagination"
            style={{
              marginTop: 20,
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
          >
            <button
              onClick={() => changePage(page - 1)}
              disabled={page <= 1}
              className="icon-pagination-button"
              aria-label="Trang trước"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="sr-only">Prev</span>
            </button>

            <nav aria-label="Pagination">
              <ul
                className="pagination-list"
                style={{
                  display: "flex",
                  gap: 6,
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                }}
              >
                {getPageList().map((item, idx) =>
                  item === "left-ellipsis" || item === "right-ellipsis" ? (
                    <li
                      key={`${item}-${idx}`}
                      className="ellipsis"
                      aria-hidden="true"
                      style={{ padding: "6px 8px" }}
                    >
                      …
                    </li>
                  ) : (
                    <li key={item}>
                      <button
                        onClick={() => changePage(item)}
                        className={`page-button ${
                          item === page ? "active" : ""
                        }`}
                        aria-current={item === page ? "page" : undefined}
                      >
                        {item}
                      </button>
                    </li>
                  )
                )}
              </ul>
            </nav>

            <button
              onClick={() => changePage(page + 1)}
              disabled={page >= totalPages}
              className="icon-pagination-button"
              aria-label="Trang tiếp theo"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="sr-only">Next</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
