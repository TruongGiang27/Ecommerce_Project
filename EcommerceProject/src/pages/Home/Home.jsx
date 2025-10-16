import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryBar from "../../components/CategoryBar/CategoryBar";
import ProductCard from "../../components/productCard/ProductCard";
<<<<<<< HEAD
import HeroBanner from "../../components/Banner/HeroBanner"; // ✅ import banner
=======
import HeroBanner from "../../components/Banner/HeroBanner";
>>>>>>> c6e1c65e900e61c7abfc3ececeed678933ca946e
import "./home.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const regionId = "reg_01K73N9QAJJ6DVF7FGKAKCJQG0";

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category}`);
  };

  useEffect(() => {
<<<<<<< HEAD
    fetchProducts()
      .then(setProducts)
      .catch((err) => console.error(err));
=======
    fetch(
      `http://localhost:9000/store/products?region_id=${regionId}&limit=1000`,
      {
        headers: {
          "x-publishable-api-key":
            "pk_d4bf2faebacb69611013a1fd3c32bb8f76ab55d06f2068d92b0efd01a377ecfc",
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
>>>>>>> c6e1c65e900e61c7abfc3ececeed678933ca946e
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
    <>
      <HeroBanner /> {/* ✅ Banner component */}
      <div className="container">
        {/* ✅ Banner */}

<<<<<<< HEAD
        {/* Thanh category */}
        <CategoryBar onCategoryClick={handleCategoryClick} />

        {/* Sản phẩm nổi bật */}
        <section className="featured-products">
          <h2>Sản phẩm nổi bật</h2>
          <div className="grid">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* Khuyến mãi */}
        <section className="promotions">
          <h2>Chương trình khuyến mãi</h2>
          <div className="promo-cards">
            <div className="promo-card">
              <h3>Giảm giá 20% cho phần mềm thiết kế</h3>
              <p>Chỉ áp dụng đến cuối tháng này!</p>
            </div>
            <div className="promo-card">
              <h3>Mua 1 tặng 1 phần mềm văn phòng</h3>
              <p>Nhanh tay trước khi hết ưu đãi.</p>
            </div>
          </div>
        </section>
      </div>
    </>
=======
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
                        p?.variants?.[0]?.calculated_price
                          ?.calculated_amount || 0;
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
    </div>
>>>>>>> c6e1c65e900e61c7abfc3ececeed678933ca946e
  );
}
