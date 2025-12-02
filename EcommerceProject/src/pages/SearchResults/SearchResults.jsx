import React, { useEffect, useState } from "react";
import {
  useLocation,
  NavLink,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import ProductCard from "../../components/productCard/ProductCard";
import SidebarCategories from "../../components/SidebarCategories/SidebarCategories";
import "./SearchResults.css";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchResults() {
  const q = useQuery().get("search") || "";
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const navigate = useNavigate();

  // Pagination + category (reuse same UX as Products page)
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState(
    searchParams.get("category") || "All"
  );
  const pageSize = 12;
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [pageInput, setPageInput] = useState(
    String(Number(searchParams.get("page")) || 1)
  );

  const regionId = process.env.REACT_APP_MEDUSA_REGION_ID;
  const BACKEND_URL = process.env.REACT_APP_MEDUSA_BACKEND_URL;
  useEffect(() => {
    // load products once when there's a query
    if (!q.trim()) {
      setProducts([]);
      return;
    }

    const url = `${BACKEND_URL}/store/products?limit=1000${regionId ? `&region_id=${regionId}` : ""
      }`;
    setLoading(true);
    fetch(url, {
      headers: {
        "x-publishable-api-key": process.env.REACT_APP_MEDUSA_PUBLISHABLE_KEY,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data?.products) ? data.products : [];
        setProducts(items);
      })
      .catch((err) => {
        console.error("Load products error:", err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [q, regionId]);

  useEffect(() => {
    // filter by query + category
    if (!q.trim()) {
      setFiltered([]);
      return;
    }
    const qLower = q.trim().toLowerCase();
    const matched = products.filter((p) => {
      const title = (p.title || p.name || "").toLowerCase();
      const id = (p.id || "").toLowerCase();
      const matchesQuery = title.includes(qLower) || id.includes(qLower);
      const matchesCategory =
        category === "All" || p.collection?.title === category;
      return matchesQuery && matchesCategory;
    });
    setFiltered(matched);
  }, [q, products, category]);

  // sync page & category from URL
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    const pageFromUrl = Number(searchParams.get("page")) || 1;
    setCategory(categoryFromUrl || "All");
    setPage(pageFromUrl);
    setPageInput(String(pageFromUrl));
  }, [searchParams]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      const newPage = totalPages;
      setPage(newPage);
      setPageInput(String(newPage));
      setSearchParams({ category: category, page: String(newPage) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered.length, totalPages]);

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
    } catch {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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

  const handleCategoryChange = (newCategory) => {
    // Điều hướng về trang Products với category + page=1
    const params = new URLSearchParams({ category: newCategory, page: "1" });
    navigate(`/products?${params.toString()}`);
  };

  const handlePageInputChange = (e) => setPageInput(e.target.value);
  const applyPageInput = () => {
    const n = Number(pageInput);
    if (!Number.isFinite(n) || n < 1) {
      setPageInput(String(page));
      return;
    }
    changePage(Math.min(Math.max(1, Math.floor(n)), totalPages));
  };
  const handlePageInputKeyDown = (e) => {
    if (e.key === "Enter") applyPageInput();
  };
  const handlePageInputBlur = () => applyPageInput();

  const startIndex = (page - 1) * pageSize;
  const paginatedProducts = filtered.slice(startIndex, startIndex + pageSize);

  return (
    <div className="container-products">
      <div className="subContainer">
        <div className="side-bar">
          <SidebarCategories onSelectCategory={handleCategoryChange} />
        </div>

        <div className="content">
          <div className="title-style" style={{ flex: 1 }}>
            <h2 style={{ marginBottom: "12px" }}>
              {q.trim() ? `Kết quả tìm kiếm cho “${q}”` : "Tìm sản phẩm"}
            </h2>
            <p style={{ margin: 0, color: "#666" }}>
              {loading ? "Đang tải..." : `${filtered.length} sản phẩm`}
            </p>
          </div>

          <div className="product-grid">
            {loading ? (
              <p className="loading-placeholder">Đang tải sản phẩm…</p>
            ) : paginatedProducts.length > 0 ? (
              paginatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))
            ) : (
              <div className="no-results">Không tìm thấy sản phẩm</div>
            )}
          </div>

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
                        className={`page-button ${item === page ? "active" : ""}`}
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
            </button>

            {/* quick page input */}
          </div>
        </div>
      </div>
    </div>
  );
}