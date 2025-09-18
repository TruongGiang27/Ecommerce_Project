import React from "react";
import { useNavigate } from "react-router-dom";
import CategoryBar from "../../components/CategoryBar/CategoryBar";
import products from "../../data/products";
import ProductCard from "../../components/productCard/ProductCard";

const Home = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category}`);
  };

  return (
    <div className="container">
      {/* Giới thiệu */}
      <section className="intro">
        <h1>Chào mừng đến với Website Bán Phần Mềm</h1>
        <p>
          Khám phá các phần mềm chất lượng, các gói khuyến mãi hấp dẫn và trải
          nghiệm dịch vụ hỗ trợ tuyệt vời.
        </p>
      </section>

      {/* Thanh category */}
      <CategoryBar onCategoryClick={handleCategoryClick} />

      {/* Sản phẩm nổi bật */}
      <section className="featured-products">
        <h2>Sản phẩm nổi bật</h2>
        <div className="grid">
          {products.slice(0, 6).map((p) => (
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
  );
};

export default Home;
