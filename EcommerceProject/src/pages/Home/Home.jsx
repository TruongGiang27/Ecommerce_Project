import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryBar from "../../components/CategoryBar/CategoryBar";
import ProductCard from "../../components/productCard/ProductCard";
import HeroBanner from "../../components/Banner/HeroBanner";
import "./home.css";
import InfinityScrollBar from "../../components/InfinityScrollBar/InfinityScrollBar";

export default function Home() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const regionId = process.env.REACT_APP_MEDUSA_REGION_ID;

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category}`);
  };

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Chọn sản phẩm");

  const items = ["Tai nghe", "Bàn phím", "Chuột", "Màn hình"];

  useEffect(() => {
    fetch(
      `http://localhost:9000/store/products?region_id=${regionId}&limit=1000`,
      {
        headers: {
          "x-publishable-api-key": process.env.REACT_APP_MEDUSA_PUBLISHABLE_KEY,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(
          "Test products:",
          data.products.map((p) => ({
            title: p.title,
            created_at: p.created_at,
          }))
        );

        setProducts(data.products || []);
      })
      .catch((err) => console.error("Lỗi khi lấy sản phẩm:", err));
  }, []);

  // 🔥 Lấy ngày hiện tại trừ 30 ngày
  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);

  // 🕒 Lọc sản phẩm tạo trong 30 ngày qua
  const recentProducts = products.filter((p) => {
    if (!p.created_at) return false;
    const createdAt = new Date(p.created_at);
    return createdAt >= thirtyDaysAgo;
  });

  // 🔝 8 sản phẩm nổi bật
  const bestSellers = products.slice(0, 8);

  return (
    <div className="container">
      {/* ✅ Banner */}
      <HeroBanner />

      <InfinityScrollBar />

      {/* Giới thiệu */}
      <section className="intro section-box">
        <h1>Digitech Shop</h1>
        <p>
          Digitech Shop là địa chỉ đáng tin cậy, chuyên cung cấp phần mềm bản
          quyền và dịch vụ nâng cấp tài khoản chính chủ. Chúng tôi cam kết mang
          đến chất lượng vượt trội, giá cả hợp lý và sẵn sàng hỗ trợ tận tâm
          24/7.
        </p>
      </section>

      {/* Thanh category */}
      <CategoryBar onCategoryClick={handleCategoryClick} />

      {/* 🔥 Sản phẩm nổi bật */}
      <section className="highlight-box">
        <div className="highlight-left">
          <span className="tag">🔥 Xu Hướng 2025</span>
          <h2>Sản Phẩm Nổi Bật Nhất Năm 2025</h2>
          <p>
            Digitech Shop cung cấp phần mềm bản quyền chính hãng đa dạng: AI,
            Microsoft Office, thiết kế đồ họa, VPN/Antivirus... đáp ứng mọi nhu
            cầu học tập, công việc và giải trí với giá cực kỳ cạnh tranh.
          </p>
          <button className="btn-contact" onClick={() => navigate("/products")}>
            Liên hệ tư vấn tại đây →
          </button>
        </div>

        <div className="highlight-right">
          <h3>Nổi bật</h3>
          {bestSellers.length > 0 ? (
            <>
              {bestSellers.length > 4 && (
                <div className="bestseller-scroll-vertical">
                  <ul className="bestseller-list-vertical">
                    {bestSellers.slice(2).map((p) => {
                      // ✅ Lấy giá chuẩn theo calculated_price giống ProductCard
                      const price =
                        p?.variants?.[0]?.calculated_price?.calculated_amount ||
                        0;
                      const image = p.thumbnail || "/default-product.png";

                      return (
                        <li
                          key={p.id}
                          className="bestseller-item"
                          onClick={() => navigate(`/products/${p.id}`)}
                        >
                          <img src={image} alt={p.title} />
                          <div>
                            <h4>{p.title}</h4>
                            <p className="price-highlight">
                              {price.toLocaleString()} đ
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <p>Đang tải sản phẩm...</p>
          )}
        </div>
      </section>

      {/* 🛒 Sản phẩm mới nhất trong 30 ngày */}
      <section className="product-section">
        <h2>Sản phẩm mới nhất</h2>
        <div className="product-grid">
          {recentProducts.length > 0 ? (
            recentProducts
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .slice(0, 8)
              .map((p) => <ProductCard key={p.id} product={p} />)
          ) : (
            <p>Không có sản phẩm mới nhất</p>
          )}
        </div>
      </section>

      <div style={{ position: "relative", width: 200, margin: 20 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "8px 12px",
          border: "1px solid #ccc",
          borderRadius: 6,
          cursor: "pointer",
          background: "#fff",
        }}
      >
        {selected}
      </button>

      {open && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: 6,
            marginTop: 4,
            listStyle: "none",
            padding: 0,
            zIndex: 100,
          }}
        >
          {items.map((item) => (
            <li
              key={item}
              onClick={() => {
                setSelected(item);
                setOpen(false);
              }}
              style={{
                padding: "8px 12px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
    </div>
  );
}
